'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Navbar } from './ui/Navbar';
import { 
  Download, 
  Share2, 
  Heart, 
  Maximize2, 
  Zap, 
  Copy,
  X,
  Grid,
  Loader2,
  Video,
  Image as ImageIcon
} from 'lucide-react';

// Constants for Ideogram model
const STYLE_TYPES = ['None', 'Auto', 'General', 'Realistic', 'Design'];
const MAGIC_PROMPT_OPTIONS = ['Auto', 'On', 'Off'];

const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square', resolution: '1024x1024', class: 'aspect-square' },
  { value: '16:9', label: 'Landscape', resolution: '1408x704', class: 'aspect-video' },
  { value: '9:16', label: 'Portrait', resolution: '704x1408', class: 'aspect-[9/16]' },
  { value: '4:3', label: 'Standard', resolution: '1152x864', class: 'aspect-[4/3]' }
];

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [showFullImage, setShowFullImage] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [generationHistory, setGenerationHistory] = useState<{type: 'image' | 'video', url: string}[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [generationType, setGenerationType] = useState<'image' | 'video'>('image');
  
  // Video configuration
  const [videoQuality, setVideoQuality] = useState('540p');
  const [videoDuration, setVideoDuration] = useState(5);
  const [motionMode, setMotionMode] = useState('normal');
  const [videoAspectRatio, setVideoAspectRatio] = useState('16:9');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [videoStyle, setVideoStyle] = useState('None');
  const [videoEffect, setVideoEffect] = useState('None');

  // Video options
  const videoQualities = ['360p', '540p', '720p', '1080p'];
  const durations = [5, 8];
  const motionModes = ['normal', 'smooth'];
  const videoAspectRatios = ['16:9', '9:16', '1:1'];
  const videoStyles = ['None', 'Cinematic', 'Anime', '3D Animation', 'Stop Motion'];
  const videoEffects = ['None', 'VHS', 'Glitch', 'Dream', 'Neon'];

  // Get current aspect ratio configuration
  const currentAspectRatio = ASPECT_RATIOS.find(ar => ar.value === aspectRatio) || ASPECT_RATIOS[0];

  const [selectedModel, setSelectedModel] = useState('stable-diffusion');
  const [numOutputs, setNumOutputs] = useState(1);
  const [guidanceScale, setGuidanceScale] = useState(7);
  const [numInferenceSteps, setNumInferenceSteps] = useState(50);
  const [scheduler, setScheduler] = useState('K_EULER');
  const [safetyFilterLevel, setSafetyFilterLevel] = useState('block_medium_and_above');
  const [safetyTolerance, setSafetyTolerance] = useState(2);
  const [raw, setRaw] = useState(false);
  const [styleType, setStyleType] = useState('Auto');
  const [magicPromptOption, setMagicPromptOption] = useState('Auto');
  const [seed, setSeed] = useState<number | undefined>(undefined);

  const generateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImageUrl('');
    setVideoUrl('');

    try {
      const endpoint = '/api/predictions';

      const body = { 
        prompt,
        aspect_ratio: aspectRatio,
        resolution: currentAspectRatio.resolution,
        style_type: styleType,
        magic_prompt_option: magicPromptOption,
        seed
      };

      console.log('Sending request to:', endpoint, 'with body:', body);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      const imageOutput = Array.isArray(data.output) ? data.output[0] : data.output;
      console.log('Setting image URL:', imageOutput);
      setImageUrl(imageOutput);
      setGenerationHistory(prev => [{ type: 'image', url: imageOutput }, ...prev.slice(0, 11)]);
    } catch (err: any) {
      console.error('Generation error:', err);
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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar 
        onGalleryClick={() => setShowGallery(true)}
      />
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Amazing {generationType === 'image' ? 'Images' : 'Videos'}
          </h1>
        </div>

        {/* Main Input and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <form onSubmit={generateContent} className="space-y-4">
            {/* Prompt Input */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="w-full p-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                required
              />
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Image Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Aspect Ratio */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aspect Ratio
                </label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ASPECT_RATIOS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.value})
                    </option>
                  ))}
                </select>
              </div>

              {/* Style Type */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Style
                </label>
                <select
                  value={styleType}
                  onChange={(e) => setStyleType(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {STYLE_TYPES.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Magic Prompt */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Magic Prompt
                </label>
                <select
                  value={magicPromptOption}
                  onChange={(e) => setMagicPromptOption(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {MAGIC_PROMPT_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Seed */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Seed (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={seed || ''}
                    onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Random"
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end mt-4">
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
                  'Generate Image'
                )}
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
                  <span className="text-gray-700 dark:text-gray-300">
                    Generating your {generationType}...
                  </span>
                </div>
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Content Display */}
        <div className="space-y-4">
          {/* Latest Generation */}
          {(imageUrl || videoUrl) && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {generationType === 'image' ? (
                <div className={`relative ${currentAspectRatio.class} max-w-2xl mx-auto`}>
                  <Image
                    src={imageUrl}
                    alt="Generated image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  </div>
                ) : (
                  <div className="relative aspect-video max-w-2xl mx-auto">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full"
                      autoPlay
                      loop
                    />
                  </div>
                )}
                  
                {/* Content Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                    onClick={() => toggleFavorite(generationType === 'image' ? imageUrl : videoUrl)}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                        favorites.includes(generationType === 'image' ? imageUrl : videoUrl) ? 'fill-current text-red-500' : ''
                        }`}
                      />
                    </button>
                    <button
                    onClick={() => copyToClipboard(generationType === 'image' ? imageUrl : videoUrl)}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                      link.href = generationType === 'image' ? imageUrl : videoUrl;
                      link.download = generationType === 'image' ? 'generated-image.png' : 'generated-video.mp4';
                        link.click();
                      }}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  {generationType === 'image' && (
                    <button
                      onClick={() => setShowFullImage(true)}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {/* Content Info */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    {generationType === 'image' ? (
                      <>
                    <span>Aspect Ratio: {currentAspectRatio.label}</span>
                    <span>Resolution: {currentAspectRatio.resolution}</span>
                      </>
                    ) : (
                      <span>Video Format: MP4</span>
                    )}
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
                  {generationHistory.length} items
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {generationHistory.map((item, index) => (
                  <motion.div
                    key={item.url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    onClick={() => {
                      if (item.type === 'image') {
                        setImageUrl(item.url);
                        setVideoUrl('');
                      } else {
                        setVideoUrl(item.url);
                        setImageUrl('');
                      }
                      setGenerationType(item.type);
                    }}
                  >
                    <div className="relative aspect-square">
                      {item.type === 'image' ? (
                      <Image
                          src={item.url}
                        alt={`Generation ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                      />
                      ) : (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
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
          {!imageUrl && !videoUrl && !loading && generationHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Zap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ready to create amazing content?
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
                    {generationHistory.map((item, index) => (
                      <div
                        key={item.url}
                        className="relative group cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square"
                        onClick={() => {
                          if (item.type === 'image') {
                            setImageUrl(item.url);
                            setVideoUrl('');
                          } else {
                            setVideoUrl(item.url);
                            setImageUrl('');
                          }
                          setGenerationType(item.type);
                          setShowGallery(false);
                        }}
                      >
                        {item.type === 'image' ? (
                        <Image
                            src={item.url}
                          alt={`Generation ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
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
                      No content yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Generate your first {generationType} to see it here
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 