'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles, Crown, Building } from 'lucide-react';
import { getUserAllowedModels } from '../../lib/models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  userTier: 'free' | 'premium' | 'enterprise';
  onUpgrade?: () => void;
}

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'premium':
      return <Crown className="w-4 h-4 text-yellow-500" />;
    case 'enterprise':
      return <Building className="w-4 h-4 text-purple-500" />;
    default:
      return <Sparkles className="w-4 h-4 text-blue-500" />;
  }
};

const getTierBadge = (tier: string) => {
  const badges = {
    free: 'Standard',
    premium: 'Premium',
    enterprise: 'Enterprise'
  };
  
  const colors = {
    free: 'bg-gray-100 text-gray-700',
    premium: 'bg-yellow-100 text-yellow-800',
    enterprise: 'bg-purple-100 text-purple-800'
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors[tier as keyof typeof colors]}`}>
      {badges[tier as keyof typeof badges]}
    </span>
  );
};

export default function ModelSelector({ selectedModel, onModelChange, userTier, onUpgrade }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const allowedModels = getUserAllowedModels(userTier);
  const allModels = getUserAllowedModels('enterprise');
  
  const selectedModelData = allowedModels.find(model => model.id === selectedModel) || allowedModels[0];

  return (
    <div className="relative">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          AI Model
        </label>
        
        {/* Current Tier Badge */}
        <div className="flex items-center gap-2 mb-2">
          {getTierIcon(userTier)}
          {getTierBadge(userTier)}
          {userTier === 'free' && (
            <button
              onClick={onUpgrade}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Upgrade for better models
            </button>
          )}
        </div>
        
        {/* Model Selector */}
        <div className="relative">
          <button
            type="button"
            className="relative w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {selectedModelData?.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedModelData?.quality} • {selectedModelData?.maxResolution}
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-auto">
              <div className="py-1">
                {allModels.map((model: any) => {
                  const isAvailable = allowedModels.some((m: any) => m.id === model.id);
                  const isSelected = model.id === selectedModel;
                  
                  return (
                    <div
                      key={model.id}
                      className={`relative px-3 py-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                          : isAvailable
                          ? 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (isAvailable) {
                          onModelChange(model.id);
                          setIsOpen(false);
                        } else if (onUpgrade) {
                          onUpgrade();
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.name}</span>
                            {!isAvailable && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Premium
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {model.quality} • {model.maxResolution}
                            {!model.watermark && ' • No Watermark'}
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-gray-900/5 dark:bg-gray-100/5 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpgrade?.();
                            }}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                          >
                            Upgrade to use
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 