import { cn } from "@/lib/utils";
import { QuizOption } from "@/types/quiz";
import { MathText } from "@/components/ui/MathText";
import { Check, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AnswerOptionProps {
  option: QuizOption;
  isSelected: boolean;
  isCorrect: boolean | null; // null = not revealed yet
  isDisabled: boolean;
  onSelect: (optionId: string) => void;
}

export function AnswerOption({
  option,
  isSelected,
  isCorrect,
  isDisabled,
  onSelect,
}: AnswerOptionProps) {
  const getStateClasses = () => {
    if (isCorrect === null) {
      // Not revealed yet
      if (isSelected) {
        return "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-lg shadow-primary/20";
      }
      return "border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md";
    }

    // Revealed
    if (isCorrect && isSelected) {
      return "answer-correct border-2 shadow-lg shadow-success/20";
    }
    if (!isCorrect && isSelected) {
      return "answer-incorrect border-2 shadow-lg shadow-destructive/20";
    }
    if (isCorrect) {
      // Show correct answer even if not selected
      return "border-success/50 bg-success/10";
    }
    return "border-border/50 opacity-50";
  };

  const getOptionLabel = () => {
    const baseClasses =
      "flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300";

    if (isCorrect === null) {
      if (isSelected) {
        return cn(baseClasses, "bg-primary text-primary-foreground scale-110");
      }
      return cn(baseClasses, "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary");
    }

    if (isCorrect && isSelected) {
      return cn(baseClasses, "bg-success text-success-foreground");
    }
    if (!isCorrect && isSelected) {
      return cn(baseClasses, "bg-destructive text-destructive-foreground");
    }
    if (isCorrect) {
      return cn(baseClasses, "bg-success/20 text-success");
    }
    return cn(baseClasses, "bg-muted/50 text-muted-foreground/50");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isDisabled) {
        onSelect(option.id);
      }
    }
  };

  return (
    <motion.button
      onClick={() => onSelect(option.id)}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={!isDisabled ? { scale: 1.02, x: 4 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      role="radio"
      aria-checked={isSelected}
      aria-disabled={isDisabled}
      aria-label={`Option ${option.id}: ${option.text}${isCorrect === true ? ' (Correct answer)' : ''}${isCorrect === false && isSelected ? ' (Incorrect)' : ''}`}
      tabIndex={isDisabled ? -1 : 0}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 group",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        isDisabled && isCorrect === null && "cursor-not-allowed opacity-50",
        !isDisabled && "cursor-pointer",
        getStateClasses()
      )}
    >
      <motion.span
        className={getOptionLabel()}
        animate={isCorrect && isSelected ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {isCorrect !== null && isSelected ? (
          isCorrect ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Check className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          )
        ) : isCorrect !== null && isCorrect ? (
          <Check className="h-5 w-5" />
        ) : (
          option.id
        )}
      </motion.span>
      <span
        className={cn(
          "flex-1 text-left text-base md:text-lg transition-all duration-200",
          isCorrect === null && isSelected && "font-medium",
          isCorrect !== null && isCorrect && "font-medium text-success",
          isCorrect !== null && !isCorrect && isSelected && "text-destructive",
          !isDisabled && "group-hover:translate-x-1"
        )}
      >
        <MathText text={option.text} />
      </span>

      {/* Success sparkle effect */}
      {isCorrect && isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles className="h-5 w-5 text-success" />
        </motion.div>
      )}
    </motion.button>
  );
}
