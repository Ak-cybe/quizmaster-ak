import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { MathText } from "@/components/ui/MathText";
import { Lightbulb, CheckCircle2, XCircle, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ExplanationPanelProps {
  explanation: string;
  isCorrect: boolean;
}

export const ExplanationPanel = forwardRef<HTMLDivElement, ExplanationPanelProps>(
  function ExplanationPanel({ explanation, isCorrect }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={cn(
          "mt-6 p-6 rounded-2xl border-2 relative overflow-hidden",
          isCorrect
            ? "bg-gradient-to-br from-success/10 to-success/5 border-success/30"
            : "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30"
        )}
      >
        {/* Background decoration */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20",
          isCorrect ? "bg-success" : "bg-destructive"
        )} />

        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className={cn(
              "p-3 rounded-xl shadow-lg",
              isCorrect
                ? "bg-success"
                : "bg-destructive"
            )}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            {isCorrect ? (
              <CheckCircle2 className="h-6 w-6 text-white" />
            ) : (
              <XCircle className="h-6 w-6 text-white" />
            )}
          </motion.div>
          <div>
            <motion.h4
              className={cn(
                "text-lg font-bold",
                isCorrect ? "text-success" : "text-destructive"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isCorrect ? "Excellent! 🎉" : "Keep Learning! 📚"}
            </motion.h4>
            <p className="text-sm text-muted-foreground">
              {isCorrect ? "You got it right!" : "Don't worry, here's the explanation"}
            </p>
          </div>
        </motion.div>

        {/* Explanation content */}
        <motion.div
          className="flex items-start gap-3 p-4 rounded-xl bg-background/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Explanation</p>
            <div className="text-foreground leading-relaxed">
              <MathText text={explanation} as="p" />
            </div>
          </div>
        </motion.div>

        {/* Encouragement message */}
        <motion.div
          className="flex items-center gap-2 mt-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Lightbulb className={cn(
            "h-4 w-4",
            isCorrect ? "text-warning" : "text-primary"
          )} />
          <span className="text-muted-foreground">
            {isCorrect
              ? "Keep up the great work! You're doing amazing."
              : "Every mistake is a step toward mastery. Keep going!"}
          </span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
        </motion.div>
      </motion.div>
    );
  }
);
