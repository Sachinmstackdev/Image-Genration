'use client';

import { useState } from 'react';
import { X, Check, Crown, Building, Sparkles } from 'lucide-react';
import { getSubscriptionFeatures } from '../../lib/subscription';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: 'free' | 'premium' | 'enterprise';
}

const plans = [
  {
    id: 'free',
    name: 'Standard',
    icon: <Sparkles className="w-6 h-6 text-blue-500" />,
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '10 images per day',
      'Standard quality (1024x1024)',
      'SDXL Base model',
      'Watermarked images',
      'Community support'
    ],
    buttonText: 'Current Plan',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    price: '$19',
    period: '/month',
    description: 'For serious creators',
    features: [
      '100 images per day',
      'HD quality (2048x2048)',
      'FLUX Dev + SDXL Pro models',
      'No watermarks',
      'Priority generation',
      'Advanced controls',
      'Email support'
    ],
    buttonText: 'Upgrade to Premium',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: <Building className="w-6 h-6 text-purple-500" />,
    price: '$99',
    period: '/month',
    description: 'For teams and businesses',
    features: [
      '500 images per day',
      '8K quality (4096x4096)',
      'All premium models + FLUX Pro',
      'Custom model training',
      'API access',
      'White-label solution',
      'Priority support',
      'Custom integrations'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
];

export default function PricingModal({ isOpen, onClose, currentTier }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === currentTier) return;
    
    setLoading(planId);
    
    try {
      // TODO: Integrate with your payment provider (Stripe, Paddle, etc.)
      if (planId === 'enterprise') {
        // Redirect to contact form or sales
        window.open('mailto:sales@yourapp.com?subject=Enterprise Plan Inquiry', '_blank');
      } else {
        // Redirect to Stripe checkout or payment flow
        // Example: window.location.href = `/api/checkout?plan=${planId}`;
        alert('Payment integration coming soon!');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Unlock premium models and higher generation limits
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Plans */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = plan.id === currentTier;
                const isDowngrade = 
                  (currentTier === 'enterprise' && plan.id !== 'enterprise') ||
                  (currentTier === 'premium' && plan.id === 'free');

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl border-2 p-6 transition-all ${
                      plan.popular
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                        : isCurrentPlan
                        ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Current plan badge */}
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        {plan.icon}
                      </div>

                      {/* Plan name */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {plan.period}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {plan.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Button */}
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isCurrentPlan || isDowngrade || loading === plan.id}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                          isCurrentPlan
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : isDowngrade
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : plan.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                        }`}
                      >
                        {loading === plan.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Processing...
                          </div>
                        ) : isCurrentPlan ? (
                          'Current Plan'
                        ) : isDowngrade ? (
                          'Downgrade'
                        ) : (
                          plan.buttonText
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQ or additional info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need help choosing? <button className="text-blue-600 hover:text-blue-700 underline">Contact our team</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 