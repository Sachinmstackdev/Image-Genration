// Model tiers configuration
export const MODEL_TIERS = {
  FREE: {
    id: 'free',
    name: 'Standard',
    models: [
      {
        id: 'sdxl-base',
        name: 'SDXL Base',
        provider: 'replicate',
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        maxResolution: '1024x1024',
        quality: 'Standard',
        watermark: true,
        generationsPerDay: 10
      }
    ]
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    models: [
      {
        id: 'flux-dev',
        name: 'FLUX Dev',
        provider: 'replicate',
        version: 'black-forest-labs/flux-dev:854c0c8b2f38d2fa2b08ba1dbe7bfab28885e85d30c96eb5d04ddb2e04d4a70e',
        maxResolution: '2048x2048',
        quality: 'HD',
        watermark: false,
        generationsPerDay: 100
      },
      {
        id: 'sdxl-pro',
        name: 'SDXL Pro',
        provider: 'replicate',
        version: 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
        maxResolution: '2048x2048',
        quality: '4K',
        watermark: false,
        generationsPerDay: 100
      }
    ]
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    models: [
      {
        id: 'flux-pro',
        name: 'FLUX Pro',
        provider: 'replicate',
        version: 'black-forest-labs/flux-pro:c0dcf5d6a7e6b4edc1c065a3eefb82c7c99f45b3b7d1e5f5b3c3c3c3c3c3c3c3',
        maxResolution: '4096x4096',
        quality: '8K',
        watermark: false,
        generationsPerDay: 500
      }
    ]
  }
};

export const getUserAllowedModels = (subscriptionTier: string) => {
  switch (subscriptionTier) {
    case 'premium':
      return [...MODEL_TIERS.FREE.models, ...MODEL_TIERS.PREMIUM.models];
    case 'enterprise':
      return [...MODEL_TIERS.FREE.models, ...MODEL_TIERS.PREMIUM.models, ...MODEL_TIERS.ENTERPRISE.models];
    default:
      return MODEL_TIERS.FREE.models;
  }
};

export const getModelById = (modelId: string, userTier: string) => {
  const allowedModels = getUserAllowedModels(userTier);
  return allowedModels.find(model => model.id === modelId);
}; 