import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Add debug logging
console.log('API Token available:', !!process.env.REPLICATE_API_TOKEN);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { 
      prompt,
      quality = "540p",
      duration = 5,
      motion_mode = "normal",
      aspect_ratio = "16:9",
      negative_prompt = "",
      style = "None",
      effect = "None"
    } = await req.json();

    // Add request logging
    console.log('Video generation request:', {
      prompt,
      quality,
      duration,
      motion_mode,
      aspect_ratio,
      style,
      effect
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate inputs
    const validQualities = ["360p", "540p", "720p", "1080p"];
    const validDurations = [5, 8];
    const validMotionModes = ["normal", "smooth"];
    const validAspectRatios = ["16:9", "9:16", "1:1"];

    if (!validQualities.includes(quality)) {
      return NextResponse.json(
        { error: 'Invalid quality. Must be one of: 360p, 540p, 720p, 1080p' },
        { status: 400 }
      );
    }

    if (!validDurations.includes(duration)) {
      return NextResponse.json(
        { error: 'Invalid duration. Must be either 5 or 8 seconds' },
        { status: 400 }
      );
    }

    if (!validMotionModes.includes(motion_mode)) {
      return NextResponse.json(
        { error: 'Invalid motion mode. Must be either normal or smooth' },
        { status: 400 }
      );
    }

    if (!validAspectRatios.includes(aspect_ratio)) {
      return NextResponse.json(
        { error: 'Invalid aspect ratio. Must be one of: 16:9, 9:16, 1:1' },
        { status: 400 }
      );
    }

    // Additional validation for specific combinations
    if (quality === "1080p" && duration === 8) {
      return NextResponse.json(
        { error: '1080p resolution does not support 8 second duration' },
        { status: 400 }
      );
    }

    if (quality === "1080p" && motion_mode === "smooth") {
      return NextResponse.json(
        { error: '1080p resolution does not support smooth motion' },
        { status: 400 }
      );
    }

    if (duration === 8 && motion_mode === "smooth") {
      return NextResponse.json(
        { error: '8 second duration does not support smooth motion' },
        { status: 400 }
      );
    }

    const output = await replicate.run(
      "pixverse/pixverse-v4.5",
      {
        input: {
          prompt,
          quality,
          duration,
          motion_mode,
          aspect_ratio,
          negative_prompt,
          style,
          effect
        }
      }
    );

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 