import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = ((current) / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
            {current}
          </span>
          <span className="text-muted-foreground/60">of</span>
          <span>{total}</span>
        </span>
        <span className="text-sm font-bold text-primary">
          {Math.round(percentage)}%
        </span>
      </div>
      
      {/* Progress Steps */}
      <div className="flex gap-1.5 mb-2">
        {Array.from({ length: total }).map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              index < current 
                ? 'gradient-primary shadow-sm' 
                : index === current - 1
                ? 'gradient-accent'
                : 'bg-muted'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          />
        ))}
      </div>

      {/* Current question indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
        <span>{current - 1} answered</span>
        <span className="text-muted-foreground/40">•</span>
        <span>{total - current + 1} remaining</span>
      </div>
    </div>
  );
}
