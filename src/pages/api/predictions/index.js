import Replicate from "replicate";
import { getAuth } from "@clerk/nextjs/server";
import { getUserSubscription, canUserGenerate, incrementUserGenerations } from "../../../../lib/subscription";
import { getModelById } from "../../../../lib/models";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ detail: 'REPLICATE_API_TOKEN is not set' });
  }

  // Get user authentication
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ detail: 'Authentication required' });
  }

  const { prompt, negative_prompt, model_id = 'sdxl-base', resolution = '1024x1024' } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ detail: 'Prompt is required' });
  }

  try {
    // Check if user can generate
    const generateCheck = await canUserGenerate(userId);
    if (!generateCheck.canGenerate) {
      return res.status(403).json({ 
        detail: generateCheck.reason,
        upgradeRequired: generateCheck.upgradeRequired
      });
    }

    // Get user subscription
    const subscription = await getUserSubscription(userId);
    
    // Check if user has access to requested model
    const selectedModel = getModelById(model_id, subscription.tier);
    if (!selectedModel) {
      return res.status(403).json({ 
        detail: 'Model not available in your subscription tier',
        upgradeRequired: true
      });
    }

    // Validate resolution based on subscription
    const maxRes = selectedModel.maxResolution;
    if (resolution !== maxRes && subscription.tier === 'free') {
      return res.status(403).json({ 
        detail: `Maximum resolution for free tier is ${maxRes}`,
        upgradeRequired: true
      });
    }

    // Configure the model input parameters
    const input = {
      prompt: prompt,
      negative_prompt: negative_prompt || "",
      num_outputs: 1,
      scheduler: "K_EULER",
      num_inference_steps: subscription.tier === 'free' ? 20 : 50, // Lower steps for free
      guidance_scale: 7.5,
      width: parseInt(resolution.split('x')[0]),
      height: parseInt(resolution.split('x')[1]),
    };

    // Add watermark for free users
    if (selectedModel.watermark) {
      input.watermark = true;
    }

    // Create the prediction using the selected model
    const prediction = await replicate.run(selectedModel.version, {
      input: input
    });

    // Increment user's generation count
    await incrementUserGenerations(userId);

    // Return the generated image URLs with metadata
    res.status(200).json({ 
      output: prediction,
      model: selectedModel,
      subscription: subscription.tier,
      generationsRemaining: subscription.maxGenerationsPerDay - subscription.generationsUsedToday - 1
    });
  } catch (error) {
    console.error('Replicate API Error:', error);
    if (error.response) {
      res.status(error.response.status).json({ detail: error.response.data });
    } else if (error.request) {
      res.status(500).json({ detail: 'No response received from Replicate API' });
    } else {
      res.status(500).json({ detail: error.message });
    }
  }
}
