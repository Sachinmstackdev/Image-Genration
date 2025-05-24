'use client';

import { Sparkles } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 mx-auto mb-4">
          <Sparkles className="h-6 w-6 text-white animate-pulse" />
        </div>
        <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
          Eve AI
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
      </div>
    </div>
  );
} 