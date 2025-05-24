'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Navbar } from './ui/Navbar';
import ModelSelector from './ModelSelector';
import PricingModal from './PricingModal';
import { 
  Download, 
  Share2, 
  Heart, 
  Maximize2, 
  Zap, 
  Info,
  Copy,
  Trash2,
  RefreshCw,
  Crown,
  AlertCircle,
  X,
  Settings2,
  Sparkles,
  HelpCircle,
  Grid,
  FileText,
  Loader2
} from 'lucide-react';

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [showFullImage, setShowFullImage] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  
  // Premium features state
  const [selectedModel, setSelectedModel] = useState('sdxl-base');
  const [userTier, setUserTier] = useState<'free' | 'premium' | 'enterprise'>('free');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState(10);
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  // New modals/panels state
  const [showGallery, setShowGallery] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Aspect ratio configurations
  const aspectRatioOptions = [
    { value: '1:1', label: '1:1 Square', resolution: '1024x1024', class: 'aspect-square' },
    { value: '16:9', label: '16:9 Landscape', resolution: '1920x1080', class: 'aspect-video' },
    { value: '9:16', label: '9:16 Portrait', resolution: '1080x1920', class: 'aspect-[9/16]' },
    { value: '4:3', label: '4:3 Classic', resolution: '1536x1152', class: 'aspect-[4/3]' },
    { value: '3:2', label: '3:2 Photo', resolution: '1536x1024', class: 'aspect-[3/2]' }
  ];

  const getAspectRatioConfig = (ratio: string) => {
    return aspectRatioOptions.find(option => option.value === ratio) || aspectRatioOptions[0];
  };

  const currentAspectRatio = getAspectRatioConfig(aspectRatio);

  // Simulate user subscription check
  useEffect(() => {
    const checkUserSubscription = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          setUserTier(data.tier || 'free');
          setGenerationsRemaining(data.generationsRemaining || 10);
        }
      } catch (error) {
        console.error('Failed to fetch user subscription:', error);
      }
    };

    checkUserSubscription();
  }, []);

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImageUrl('');
    setUpgradeRequired(false);

    try {
      const resolution = currentAspectRatio.resolution;

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          negative_prompt: negativePrompt,
          model_id: selectedModel,
          resolution
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (Array.isArray(data.output) && data.output.length > 0) {
          setImageUrl(data.output[0]);
          setGenerationHistory(prev => [data.output[0], ...prev.slice(0, 11)]);
        } else if (typeof data.output === 'string') {
          setImageUrl(data.output);
          setGenerationHistory(prev => [data.output, ...prev.slice(0, 11)]);
        } else {
          throw new Error('Invalid response format');
        }
        
        if (data.generationsRemaining !== undefined) {
          setGenerationsRemaining(data.generationsRemaining);
        }
      } else {
        if (data.upgradeRequired) {
          setUpgradeRequired(true);
        }
        throw new Error(data.detail || 'Failed to generate image');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (url: string) => {
    setFavorites(prev => 
      prev.includes(url) 
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearPrompt = () => {
    setPrompt('');
    setNegativePrompt('');
  };

  const handlePricingClick = () => {
    setShowPricingModal(true);
  };

  const handleGalleryClick = () => {
    setShowGallery(true);
  };

  const handleHelpClick = () => {
    setShowHelp(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar 
        onPricingClick={handlePricingClick}
        onGalleryClick={handleGalleryClick}
        onHelpClick={handleHelpClick}
      />
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            What will you create?
          </h1>
        </div>

        {/* Main Input and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <form onSubmit={generateImage} className="space-y-4">
            {/* Prompt Input */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see"
                className="w-full p-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                required
              />
              {prompt && (
                <button
                  type="button"
                  onClick={clearPrompt}
                  className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Aspect Ratio */}
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ratio:</span>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {aspectRatioOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentAspectRatio.resolution}
                </span>
              </div>

              {/* Model Selector - Compact */}
              <div className="flex items-center gap-2">
                <Crown className={`h-4 w-4 ${userTier === 'free' ? 'text-gray-400' : 'text-yellow-500'}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Model:</span>
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sdxl-base">SDXL Base</option>
                  {userTier !== 'free' && <option value="flux-dev">FLUX Dev</option>}
                  {userTier !== 'free' && <option value="sdxl-pro">SDXL Pro</option>}
                </select>
              </div>

              {/* Usage Stats */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="h-4 w-4" />
                <span>{generationsRemaining} left today</span>
                {userTier === 'free' && (
                  <button
                    type="button"
                    onClick={() => setShowPricingModal(true)}
                    className="text-blue-600 hover:text-blue-700 underline ml-2"
                  >
                    Upgrade
                  </button>
                )}
              </div>

              {/* Generate Button */}
              <div className="ml-auto">
                <Button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Upgrade Banner */}
            {upgradeRequired && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      This feature requires a premium subscription
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setShowPricingModal(true)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Generation Progress */}
        <AnimatePresence>
          {loading && (
            <div className="mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">Generating your image...</span>
                </div>
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Images Grid */}
        <div className="space-y-4">
          {/* Latest Image - Hero */}
          {imageUrl && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className={`relative ${currentAspectRatio.class} max-w-2xl mx-auto`}>
                  <Image
                    src={imageUrl}
                    alt="Generated image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  
                  {/* Image Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFavorite(imageUrl)}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(imageUrl) ? 'fill-current text-red-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => copyToClipboard(imageUrl)}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = imageUrl;
                        link.download = 'eve-ai-generated.png';
                        link.click();
                      }}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowFullImage(true)}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Image Info */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Aspect Ratio: {currentAspectRatio.label}</span>
                    <span>Resolution: {currentAspectRatio.resolution}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* History Grid */}
          {generationHistory.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Generations</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {generationHistory.length} images
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {generationHistory.map((historyUrl, index) => (
                  <motion.div
                    key={historyUrl}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    onClick={() => setImageUrl(historyUrl)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={historyUrl}
                        alt={`Generation ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-sm font-medium">View</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!imageUrl && !loading && generationHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Zap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ready to create amazing AI art?
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your prompt above and watch AI bring your imagination to life
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullImage(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imageUrl}
                alt="Generated image"
                width={1024}
                height={1024}
                className="object-contain max-h-[90vh]"
                priority
              />
              
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Grid className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gallery</h2>
                  </div>
                  <button
                    onClick={() => setShowGallery(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {generationHistory.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {generationHistory.map((historyUrl, index) => (
                      <div
                        key={historyUrl}
                        className="relative group cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square"
                        onClick={() => {
                          setImageUrl(historyUrl);
                          setShowGallery(false);
                        }}
                      >
                        <Image
                          src={historyUrl}
                          alt={`Generation ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-white text-sm font-medium">View</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Grid className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No images yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Generate your first image to see it here
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Help & Guide</h2>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Getting Started</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Enter a descriptive prompt in the text area</li>
                    <li>• Choose your preferred aspect ratio</li>
                    <li>• Select an AI model (premium models available with subscription)</li>
                    <li>• Click Generate to create your image</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Aspect Ratios</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• <strong>1:1 Square:</strong> Perfect for social media posts</li>
                    <li>• <strong>16:9 Landscape:</strong> Great for wallpapers and presentations</li>
                    <li>• <strong>9:16 Portrait:</strong> Ideal for mobile wallpapers and stories</li>
                    <li>• <strong>4:3 Classic:</strong> Traditional photo format</li>
                    <li>• <strong>3:2 Photo:</strong> Standard camera aspect ratio</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Writing Better Prompts</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Be specific about what you want to see</li>
                    <li>• Include style descriptions (e.g., "photorealistic", "cartoon", "oil painting")</li>
                    <li>• Mention lighting and mood</li>
                    <li>• Use commas to separate different elements</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Subscription Benefits</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• <strong>Premium:</strong> FLUX Dev models, HD quality, no watermarks</li>
                    <li>• <strong>Enterprise:</strong> All models, 8K quality, API access</li>
                    <li>• <strong>Free:</strong> SDXL Base model, standard quality</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Need More Help?</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Contact our support team at <a href="mailto:support@eve-ai.com" className="text-blue-600 hover:text-blue-700 underline">support@eve-ai.com</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentTier={userTier}
      />
    </div>
  );
} 