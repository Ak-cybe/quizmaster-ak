import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, X, Coffee, Brain, Target, Clock } from "lucide-react";

interface PauseModalProps {
  onResume: () => void;
  onQuit: () => void;
  currentQuestion: number;
  totalQuestions: number;
}

export const PauseModal = forwardRef<HTMLDivElement, PauseModalProps>(
  function PauseModal({ onResume, onQuit, currentQuestion, totalQuestions }, ref) {
    const progressPercentage = Math.round((currentQuestion / totalQuestions) * 100);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full bg-primary/5"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="text-center px-6 max-w-md relative"
        >
          {/* Pause icon with animation */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="mx-auto w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Coffee className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-3xl font-black text-foreground mb-2"
          >
            Quiz Paused ☕
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mb-6"
          >
            Take a breather! Your progress is saved.
          </motion.p>

          {/* Progress Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <Brain className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{currentQuestion}</p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <Target className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <Clock className="w-5 h-5 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-success">{progressPercentage}%</p>
              <p className="text-xs text-muted-foreground">Done</p>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Button
              onClick={onResume}
              size="lg"
              className="w-full gradient-primary text-white border-0 h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Resume Quiz
            </Button>
            
            <Button
              onClick={onQuit}
              variant="outline"
              size="lg"
              className="w-full h-12 text-muted-foreground hover:text-destructive hover:border-destructive/50"
            >
              <X className="w-5 h-5 mr-2" />
              Quit Quiz
            </Button>
          </motion.div>

          {/* Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 rounded-xl bg-muted/50 border border-border"
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="text-lg">💡</span>
              The timer is paused while you take a break
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);
