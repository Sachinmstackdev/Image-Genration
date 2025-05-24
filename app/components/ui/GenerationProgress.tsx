import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Sparkles } from 'lucide-react';

const steps = [
  { id: 'processing', label: 'Processing prompt', duration: 2000 },
  { id: 'generating', label: 'Generating image', duration: 8000 },
  { id: 'enhancing', label: 'Enhancing details', duration: 3000 },
  { id: 'finalizing', label: 'Finalizing result', duration: 1000 },
];

interface GenerationProgressProps {
  isGenerating: boolean;
  onComplete?: () => void;
}

export function GenerationProgress({ isGenerating, onComplete }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let timeouts: NodeJS.Timeout[] = [];
    let startTime = Date.now();
    let totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(progressPercent);

      // Update current step
      let accumulatedTime = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulatedTime += steps[i].duration;
        if (elapsed < accumulatedTime) {
          setCurrentStep(i);
          break;
        }
      }

      if (progressPercent < 95) {
        timeouts.push(setTimeout(updateProgress, 100));
      }
    };

    updateProgress();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
    >
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Generating your image...</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-violet-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: index <= currentStep ? 1 : 0.5,
              scale: index === currentStep ? 1.02 : 1
            }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0">
              {index < currentStep ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : index === currentStep ? (
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center">
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-muted" />
              )}
            </div>
            
            <span className={`text-sm ${
              index <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}>
              {step.label}
            </span>
            
            {index === currentStep && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto"
              >
                <Sparkles className="w-4 h-4 text-pink-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Artistic Loading Animation */}
      <div className="flex justify-center pt-4">
        <div className="relative">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${i * 16}px`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
} 