import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Maximize2, RefreshCw, Heart } from "lucide-react";

// Example generated images (replace with real data)
const exampleImages = [
  {
    id: 1,
    url: "https://replicate.delivery/pbxt/IJE0TgZzXE2Aq9Fh3vBrMFjF9qCGS1xrWOv9Jh9GZnhm75iB/out-0.png",
    prompt: "A mystical forest with glowing mushrooms, ethereal lighting, fantasy art style",
    model: "SDXL Base",
    seed: 123456,
  },
  {
    id: 2,
    url: "https://replicate.delivery/pbxt/8Cpm9Tp1KkRD4L0z6vVZYWYyRrNJb2XvFe9Qk8J8ZXkn75iB/out-0.png",
    prompt: "Cyberpunk city at night with neon lights and flying cars",
    model: "SDXL Refiner",
    seed: 789012,
  },
  // Add more example images as needed
];

export function GeneratedImagesGrid() {
  const [selectedImage, setSelectedImage] = useState<typeof exampleImages[0] | null>(null);

  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {exampleImages.map((image) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group"
          >
            {/* Image Card */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-900/50 border border-gray-800">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => {/* TODO: Implement download */}}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* TODO: Implement upscale */}}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* TODO: Implement remix */}}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* TODO: Implement favorite */}}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Info Button */}
              <button
                onClick={() => setSelectedImage(image)}
                className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/50 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Image Details Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1C22] rounded-xl border border-gray-800 p-6 max-w-lg w-full"
            >
              <h3 className="text-lg font-medium text-white mb-4">Image Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Prompt:</span>
                  <p className="text-white mt-1">{selectedImage.prompt}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-gray-400">Model:</span>
                    <p className="text-white mt-1">{selectedImage.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Seed:</span>
                    <p className="text-white mt-1">{selectedImage.seed}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 