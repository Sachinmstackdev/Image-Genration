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
    
    const input: IdeogramInput = {
      prompt,
      aspect_ratio: aspect_ratio || "1:1",
      resolution: resolution || "None",
      style_type: style_type || "None",
      magic_prompt_option: magic_prompt_option || "Auto"
    };

    // Add seed if provided
    if (seed) {
      input.seed = seed;
    }

    console.log('Making prediction with input:', input);

    // Make the prediction
    const output = await replicate.run(modelVersion, { input });

    console.log('Prediction output:', output);

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error('Error in image generation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; 