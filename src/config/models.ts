export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  modelId: string;
  version: string;
  defaultParams?: Record<string, any>;
  supportedFeatures?: {
    negativePrompt?: boolean;
    aspectRatio?: boolean;
    resolution?: boolean;
    safety?: boolean;
    seed?: boolean;
    raw?: boolean;
    styles?: boolean;
    magicPrompt?: boolean;
    inpainting?: boolean;
  };
}

export const imageModels: ModelConfig[] = [
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion XL',
    description: 'Fast and reliable image generation with excellent quality',
    modelId: 'stability-ai/sdxl',
    version: 'latest',
    defaultParams: {
      guidance_scale: 7.5,
      num_inference_steps: 50
    },
    supportedFeatures: {
      negativePrompt: true,
      aspectRatio: true,
      seed: true
    }
  },
  {
    id: 'imagen',
    name: 'Google Imagen-4',
    description: 'Preview of Google\'s Imagen-4 flagship model with superior clarity, style versatility, and enhanced text rendering',
    modelId: 'google/imagen-4',
    version: 'latest',
    defaultParams: {
      safety_filter_level: 'block_medium_and_above'
    },
    supportedFeatures: {
      aspectRatio: true,
      safety: true
    }
  },
  {
    id: 'flux',
    name: 'FLUX 1.1 Pro Ultra',
    description: 'High-resolution model supporting 4MP images with raw mode for enhanced realism',
    modelId: 'black-forest-labs/flux-1.1-pro-ultra-finetuned',
    version: '8e2b6d27f0c32d1a6696a0e3f4c4c3a9c0a87c3d4f6c7b8a9b0c1d2e3f4g5h6',
    defaultParams: {
      raw: false,
      safety_tolerance: 2,
      finetune_strength: 1,
      image_prompt_strength: 0.1,
      output_format: 'jpg'
    },
    supportedFeatures: {
      aspectRatio: true,
      safety: true,
      seed: true,
      raw: true
    }
  },
  {
    id: 'ideogram',
    name: 'Ideogram v2 Turbo',
    description: 'Fast image model with state-of-the-art inpainting, prompt comprehension and text rendering',
    modelId: 'ideogram-ai/ideogram-v2-turbo',
    version: 'latest',
    defaultParams: {
      magic_prompt_option: 'Auto',
      style_type: 'None'
    },
    supportedFeatures: {
      negativePrompt: true,
      aspectRatio: true,
      resolution: true,
      seed: true,
      styles: true,
      magicPrompt: true,
      inpainting: true
    }
  }
]; 