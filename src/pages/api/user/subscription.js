import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get user authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ detail: 'Authentication required' });
    }

    // Development feature: Override tier with query parameter
    // Usage: /api/user/subscription?tier=free (or premium, enterprise)
    const requestedTier = req.query.tier || 'premium';

    // Define subscription configurations
    const subscriptionConfigs = {
      free: {
        tier: 'free',
        generationsUsedToday: 3,
        generationsRemaining: 7,
        maxGenerationsPerDay: 10,
        expiresAt: null,
        features: {
          watermark: true,
          maxResolution: '1024x1024',
          availableModels: ['sdxl-base'],
          priority: false
        }
      },
      premium: {
        tier: 'premium',
        generationsUsedToday: 15,
        generationsRemaining: 85,
        maxGenerationsPerDay: 100,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        features: {
          watermark: false,
          maxResolution: '2048x2048',
          availableModels: ['sdxl-base', 'flux-dev', 'sdxl-pro'],
          priority: true
        }
      },
      enterprise: {
        tier: 'enterprise',
        generationsUsedToday: 50,
        generationsRemaining: 450,
        maxGenerationsPerDay: 500,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        features: {
          watermark: false,
          maxResolution: '4096x4096',
          availableModels: ['sdxl-base', 'flux-dev', 'sdxl-pro', 'flux-pro'],
          priority: true,
          apiAccess: true,
          customModels: true
        }
      }
    };

    // Get the subscription based on requested tier (defaults to premium)
    const mockSubscription = subscriptionConfigs[requestedTier] || subscriptionConfigs.premium;

    res.status(200).json(mockSubscription);
  } catch (error) {
    console.error('Subscription API Error:', error);
    res.status(500).json({ detail: 'Failed to fetch subscription data' });
  }
} 