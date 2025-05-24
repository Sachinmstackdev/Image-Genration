import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const stylePresets = [
  {
    id: "realistic",
    name: "Realistic",
    description: "Photorealistic style with high detail",
    prompt: "highly detailed, photorealistic, 8k, high resolution",
    negative: "cartoon, anime, illustration, painting",
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese anime and manga style",
    prompt: "anime style, manga, detailed illustration, studio ghibli",
    negative: "photorealistic, 3d, photograph",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical and ethereal fantasy art",
    prompt: "fantasy art, magical, ethereal, detailed, intricate",
    negative: "mundane, realistic, modern",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Movie-like scenes with dramatic lighting",
    prompt: "cinematic, dramatic lighting, movie scene, high budget",
    negative: "flat lighting, amateur, low quality",
  },
];

interface StylePresetSelectorProps {
  value: string;
  onChange: (preset: typeof stylePresets[0]) => void;
}

export function StylePresetSelector({ value, onChange }: StylePresetSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stylePresets.map((preset) => (
        <motion.button
          key={preset.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(preset)}
          className={cn(
            "relative p-4 rounded-xl border transition-all duration-200",
            value === preset.id
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <div className="space-y-2">
            <h3 className="font-medium text-sm">{preset.name}</h3>
            <p className="text-xs text-muted-foreground">{preset.description}</p>
          </div>
          {value === preset.id && (
            <motion.div
              layoutId="activePreset"
              className="absolute inset-0 border-2 border-primary rounded-xl"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
} 