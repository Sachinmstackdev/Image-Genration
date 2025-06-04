import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function PremiumButton() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePremiumUpgrade = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/premium", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upgrade to premium");
      }

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error upgrading to premium:", error);
      alert("Failed to upgrade to premium. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePremiumUpgrade}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-medium rounded-lg hover:from-violet-700 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Upgrading...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Upgrade to Premium
        </>
      )}
    </button>
  );
} 