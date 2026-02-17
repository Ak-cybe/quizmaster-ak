import { QuizQuestion } from "@/types/quiz";
import { AnswerOption } from "./AnswerOption";
import { ExplanationPanel } from "./ExplanationPanel";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Lightbulb } from "lucide-react";

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  onSelectAnswer: (optionId: string) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
}: QuestionCardProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Question number badge */}
      <motion.div 
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span className="text-primary text-sm font-bold">
            Question {questionNumber}
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        <span className="text-muted-foreground text-sm font-medium px-3 py-1 rounded-full bg-muted">
          {totalQuestions - questionNumber + 1} left
        </span>
      </motion.div>

      {/* Question text */}
      <motion.h2 
        className="text-xl md:text-2xl font-bold text-foreground mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {question.question}
      </motion.h2>

      {/* Hint for user */}
      {!isAnswered && (
        <motion.div 
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 rounded-lg bg-muted/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Lightbulb className="h-4 w-4 text-warning" />
          <span>Select the best answer from the options below</span>
        </motion.div>
      )}

      {/* Answer options with staggered animation */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <AnswerOption
              option={option}
              isSelected={selectedAnswer === option.id}
              isCorrect={
                isAnswered
                  ? option.id === question.correctAnswer
                    ? true
                    : selectedAnswer === option.id
                    ? false
                    : null
                  : null
              }
              isDisabled={isAnswered}
              onSelect={onSelectAnswer}
            />
          </motion.div>
        ))}
      </div>

      {/* Explanation panel with animation */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ExplanationPanel
              explanation={question.explanation}
              isCorrect={isCorrect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
