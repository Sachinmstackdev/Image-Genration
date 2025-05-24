import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Camera, Palette } from 'lucide-react';

const suggestions = [
  {
    id: 'realistic',
    icon: Camera,
    title: 'Realistic Portrait',
    prompt: 'Professional headshot of a confident businesswoman, soft natural lighting, neutral background, high resolution, photorealistic',
    category: 'Portrait'
  },
  {
    id: 'fantasy',
    icon: Sparkles,
    title: 'Fantasy Landscape',
    prompt: 'Magical floating islands with waterfalls, ethereal lighting, mystical clouds, fantasy art style, highly detailed',
    category: 'Fantasy'
  },
  {
    id: 'creative',
    icon: Palette,
    title: 'Abstract Art',
    prompt: 'Vibrant abstract composition with flowing colors, geometric shapes, modern art style, digital painting',
    category: 'Abstract'
  },
  {
    id: 'cinematic',
    icon: Wand2,
    title: 'Cinematic Scene',
    prompt: 'Epic movie scene with dramatic lighting, wide angle shot, cinematic composition, high budget production',
    category: 'Cinematic'
  }
];

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
  className?: string;
}

export function PromptSuggestions({ onSelect, className = '' }: PromptSuggestionsProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        Prompt Suggestions
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.button
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(suggestion.prompt)}
              className="group relative p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-border transition-all duration-200 text-left"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-500/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500/10 to-violet-600/10">
                    <Icon className="h-3.5 w-3.5 text-pink-500" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {suggestion.category}
                  </span>
                </div>
                
                <h3 className="text-sm font-medium text-foreground">
                  {suggestion.title}
                </h3>
                
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {suggestion.prompt}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
} 