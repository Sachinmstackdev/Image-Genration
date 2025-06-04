// Types for subscription management
export interface UserSubscription {
  tier: 'free' | 'premium' | 'enterprise';
  expiresAt?: Date;
  generationsUsedToday: number;
  maxGenerationsPerDay: number;
}

// In-memory store for development
const devSubscriptions = new Map<string, UserSubscription>();

// Get or create a subscription for a user
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  if (process.env.NODE_ENV === 'development') {
    // In development, use in-memory storage
    if (!devSubscriptions.has(userId)) {
      devSubscriptions.set(userId, {
        tier: 'free',
        generationsUsedToday: 0,
        maxGenerationsPerDay: 25 // Higher limit for development
      });
    }
    return devSubscriptions.get(userId)!;
  }

  // TODO: In production, implement database query
  return {
    tier: 'free',
    generationsUsedToday: 0,
    maxGenerationsPerDay: 10
  };
}

export async function canUserGenerate(userId: string): Promise<{
  canGenerate: boolean;
  reason?: string;
  upgradeRequired?: boolean;
}> {
  try {
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) {
      return {
        canGenerate: false,
        reason: 'No active subscription found',
        upgradeRequired: true
      };
    }
    
    if (subscription.generationsUsedToday >= subscription.maxGenerationsPerDay) {
      return {
        canGenerate: false,
        reason: `Daily limit reached (${subscription.maxGenerationsPerDay} generations)`,
        upgradeRequired: subscription.tier === 'free'
      };
    }
    
    return { canGenerate: true };
  } catch (error) {
    console.error('Error checking generation permissions:', error);
    return {
      canGenerate: false,
      reason: 'Failed to verify generation permissions'
    };
  }
}

export async function incrementUserGenerations(userId: string): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    // In development, update in-memory storage
    const subscription = await getUserSubscription(userId);
    subscription.generationsUsedToday += 1;
    devSubscriptions.set(userId, subscription);
    console.log(`[DEV] Incremented generations for user ${userId} to ${subscription.generationsUsedToday}`);
    return;
  }

  // TODO: Implement database update for production
  console.log(`Incrementing generations for user: ${userId}`);
}

export function getSubscriptionFeatures(tier: string) {
  const features = {
    free: {
      maxGenerations: process.env.NODE_ENV === 'development' ? 25 : 10,
      maxResolution: '1024x1024',
      watermark: true,
      priority: false,
      models: ['imagen', 'flux']
    },
    premium: {
      maxGenerations: process.env.NODE_ENV === 'development' ? 100 : 50,
      maxResolution: '2048x2048',
      watermark: false,
      priority: true,
      models: ['imagen', 'flux', 'ideogram']
    },
    enterprise: {
      maxGenerations: process.env.NODE_ENV === 'development' ? 500 : 200,
      maxResolution: '4096x4096',
      watermark: false,
      priority: true,
      models: ['All Models', 'Custom Training']
    }
  };
  
  return features[tier as keyof typeof features] || features.free;
} 