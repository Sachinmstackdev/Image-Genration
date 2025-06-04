import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Wand2Icon, RefreshCcwIcon, Loader2Icon } from "lucide-react";

const aspectRatios = [
  { label: "Square", value: "1:1", width: 1024, height: 1024 },
  { label: "Landscape", value: "16:9", width: 1024, height: 576 },
  { label: "Portrait", value: "9:16", width: 576, height: 1024 },
];

const models = [
  { label: "SDXL Base", value: "sdxl-base" },
  { label: "SDXL Refiner", value: "sdxl-refiner" },
  { label: "Stable Diffusion 2.1", value: "sd-2.1" },
];

export function ImageGenerationCard() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);
  const [model, setModel] = useState(models[0]);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    // TODO: Implement image generation
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
    setIsGenerating(false);
  };

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-[#1A1C22] rounded-xl border border-gray-800 shadow-xl"
    >
      <div className="p-6">
        {/* Prompt Input */}
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A mystical forest with glowing mushrooms, ethereal lighting, fantasy art style..."
            className="w-full bg-gray-900/50 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap gap-4">
          {/* Aspect Ratio */}
          <select
            value={aspectRatio.value}
            onChange={(e) => setAspectRatio(aspectRatios.find(ar => ar.value === e.target.value) || aspectRatios[0])}
            className="bg-gray-900/50 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {aspectRatios.map((ar) => (
              <option key={ar.value} value={ar.value}>
                {ar.label} ({ar.value})
              </option>
            ))}
          </select>

          {/* Model */}
          <select
            value={model.value}
            onChange={(e) => setModel(models.find(m => m.value === e.target.value) || models[0])}
            className="bg-gray-900/50 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Seed */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value))}
              className="w-24 bg-gray-900/50 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={randomizeSeed}
              className="p-2 rounded-lg bg-gray-900/50 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <RefreshCcwIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className="ml-auto inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#1A1C22] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2Icon className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
} 