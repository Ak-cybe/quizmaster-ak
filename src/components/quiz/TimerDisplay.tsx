import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimerDisplayProps {
  timeRemaining: number;
  percentage: number;
  isWarning: boolean;
  isCritical: boolean;
}

export function TimerDisplay({
  timeRemaining,
  percentage,
  isWarning,
  isCritical,
}: TimerDisplayProps) {
  const getTimerColor = () => {
    if (isCritical) return "text-destructive";
    if (isWarning) return "text-warning";
    return "text-primary";
  };

  const getProgressColor = () => {
    if (isCritical) return "bg-gradient-to-r from-destructive to-red-400";
    if (isWarning) return "bg-gradient-to-r from-warning to-orange-400";
    return "gradient-primary";
  };

  const getIcon = () => {
    if (isCritical) return AlertTriangle;
    if (isWarning) return Zap;
    return Clock;
  };

  const Icon = getIcon();

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="timer"
        aria-label="Quiz timer"
      >
        {isCritical
          ? `Warning: Only ${timeRemaining} seconds remaining`
          : isWarning
            ? `${timeRemaining} seconds remaining`
            : `${timeRemaining} seconds left`
        }
      </div>

      <motion.div
        className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-2xl transition-colors",
          isCritical ? "bg-destructive/10" : isWarning ? "bg-warning/10" : "bg-primary/10"
        )}
        animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
      >
        <motion.div
          animate={isWarning || isCritical ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3, repeat: isWarning || isCritical ? Infinity : 0 }}
          aria-hidden="true"
        >
          <Icon className={cn("h-7 w-7", getTimerColor())} />
        </motion.div>
        <motion.span
          className={cn(
            "text-3xl font-black tabular-nums transition-colors",
            getTimerColor(),
            isCritical && "timer-warning"
          )}
          key={timeRemaining}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          {timeRemaining}s
        </motion.span>
      </motion.div>

      {/* Enhanced Progress bar */}
      <div
        className="w-full h-3 bg-muted rounded-full overflow-hidden relative"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Time remaining: ${percentage}%`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" aria-hidden="true" />

        <motion.div
          className={cn(
            "h-full transition-colors rounded-full relative overflow-hidden",
            getProgressColor()
          )}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "linear" }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Time status text */}
      <AnimatePresence mode="wait">
        {isCritical && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm font-semibold text-destructive"
            role="alert"
          >
            <AlertTriangle className="inline h-4 w-4 mr-1" aria-hidden="true" />
            Hurry up! Time is running out!
          </motion.p>
        )}
        {isWarning && !isCritical && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm font-medium text-warning"
            role="status"
          >
            <Zap className="inline h-4 w-4 mr-1" aria-hidden="true" />
            Less than 10 seconds left
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
