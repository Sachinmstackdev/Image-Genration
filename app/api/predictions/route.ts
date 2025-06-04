import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface IdeogramInput {
  prompt: string;
  aspect_ratio?: string;
  resolution?: string;
  style_type?: string;
  magic_prompt_option?: string;
  seed?: number;
}

export async function POST(req: Request) {
  try {
    const {
      prompt,
      aspect_ratio,
      resolution,
      style_type,
      magic_prompt_option,
      seed
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Correct model version for Ideogram v3 Balanced
    const modelVersion = "ideogram-ai/ideogram-v3-balanced:e78d8251b33015f3d743e83e8631b6cf53fed99057e4ddbaa6ee52340b4c2910";
    
    // Prepare input with correct parameter names and values
    const input: IdeogramInput = {
      prompt,
      resolution: resolution || "1024x1024",
      style_type: style_type || "AUTO",
      magic_prompt_option: magic_prompt_option || "AUTO"
    };

    // Add seed if provided
    if (seed) {
      input.seed = seed;
    }

    console.log('Making prediction with input:', input);

    try {
      // Make the prediction
      const output = await replicate.run(modelVersion, { input });
      console.log('Prediction output:', output);
      return NextResponse.json({ output });
    } catch (predictionError: any) {
      console.error('Prediction error details:', {
        message: predictionError.message,
        response: predictionError.response,
        stack: predictionError.stack
      });
      throw predictionError;
    }
  } catch (error: any) {
    console.error('Error in image generation:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; 