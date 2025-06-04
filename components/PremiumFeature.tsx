import { usePremiumStatus } from "@/lib/premium";

interface PremiumFeatureProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PremiumFeature({ children, fallback }: PremiumFeatureProps) {
  const { isPremium, loading } = usePremiumStatus();

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-800 rounded-lg p-4">
        Loading...
      </div>
    );
  }

  if (!isPremium) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-white mb-2">Premium Feature</h3>
        <p className="text-gray-400 mb-4">
          This feature is only available to premium users.
        </p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return <>{children}</>;
} 