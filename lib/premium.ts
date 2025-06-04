import { useState, useEffect } from "react";

export async function checkPremiumStatus() {
  try {
    const response = await fetch("/api/premium");
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.isPremium;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
}

// Hook to use premium status in components
export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremiumStatus()
      .then(setIsPremium)
      .finally(() => setLoading(false));
  }, []);

  return { isPremium, loading };
} 