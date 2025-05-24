// Remove this import since we'll pass userId directly

export interface UserSubscription {
  tier: 'free' | 'premium' | 'enterprise';
  expiresAt?: Date;
  generationsUsedToday: number;
  maxGenerationsPerDay: number;
}

// Mock function - replace with your database logic
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  // TODO: Replace with actual database query
  // For now, return a mock subscription
  return {
    tier: 'free',
    generationsUsedToday: 0,
    maxGenerationsPerDay: 10
  };
}

// This function is not needed since we get userId from API routes directly

export async function canUserGenerate(userId: string): Promise<{
  canGenerate: boolean;
  reason?: string;
  upgradeRequired?: boolean;
}> {
  const subscription = await getUserSubscription(userId);
  
  if (subscription.generationsUsedToday >= subscription.maxGenerationsPerDay) {
    return {
      canGenerate: false,
      reason: `Daily limit reached (${subscription.maxGenerationsPerDay} generations)`,
      upgradeRequired: subscription.tier === 'free'
    };
  }
  
  return { canGenerate: true };
}

export async function incrementUserGenerations(userId: string): Promise<void> {
  // TODO: Implement database update to increment user's daily generation count
  console.log(`Incrementing generations for user: ${userId}`);
}

export function getSubscriptionFeatures(tier: string) {
  const features = {
    free: {
      maxGenerations: 10,
      maxResolution: '1024x1024',
      watermark: true,
      priority: false,
      models: ['SDXL Base']
    },
    premium: {
      maxGenerations: 100,
      maxResolution: '2048x2048',
      watermark: false,
      priority: true,
      models: ['SDXL Base', 'FLUX Dev', 'SDXL Pro']
    },
    enterprise: {
      maxGenerations: 500,
      maxResolution: '4096x4096',
      watermark: false,
      priority: true,
      models: ['All Models', 'Custom Training']
    }
  };
  
  return features[tier as keyof typeof features] || features.free;
} 