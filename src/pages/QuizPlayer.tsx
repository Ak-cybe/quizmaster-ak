import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QuizCategory, UserAnswer } from "@/types/quiz";
import { useTimer } from "@/hooks/useTimer";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { TimerDisplay } from "@/components/quiz/TimerDisplay";
import { PauseModal } from "@/components/quiz/PauseModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, X, Pause, Brain, Sparkles } from "lucide-react";

interface QuizPlayerProps {
  category: QuizCategory;
  onComplete: (answers: UserAnswer[], totalTime: number) => void;
  onQuit: () => void;
}

export function QuizPlayer({ category, onComplete, onQuit }: QuizPlayerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  const { play } = useSoundEffects();

  const currentQuestion = category.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === category.questions.length - 1;

  const handleTimeUp = useCallback(() => {
    if (!isAnswered) {
      // Auto-submit with no answer when time runs out
      const timeTaken = category.timePerQuestion;
      const answer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: null,
        isCorrect: false,
        timeTaken,
      };

      setUserAnswers((prev) => [...prev, answer]);
      setTotalTimeTaken((prev) => prev + timeTaken);
      setIsAnswered(true);
    }
  }, [isAnswered, currentQuestion, category.timePerQuestion]);

  const { timeRemaining, percentage, isWarning, isCritical, resetTimer } = useTimer({
    initialTime: category.timePerQuestion,
    onTimeUp: handleTimeUp,
    isActive: !isAnswered && !isPaused,
  });

  const handlePause = () => {
    if (!isAnswered) {
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleSelectAnswer = (optionId: string) => {
    if (isAnswered) return;

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = optionId === currentQuestion.correctAnswer;

    // Play sound effect based on answer correctness
    play(isCorrect ? "correct" : "incorrect");

    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: optionId,
      isCorrect,
      timeTaken,
    };

    setSelectedAnswer(optionId);
    setUserAnswers((prev) => [...prev, answer]);
    setTotalTimeTaken((prev) => prev + timeTaken);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Quiz complete
      onComplete(userAnswers, totalTimeTaken);
    } else {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setQuestionStartTime(Date.now());
      resetTimer(category.timePerQuestion);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <motion.header
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Quiz Title with Icon */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-2 rounded-xl gradient-primary">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground truncate">
                  {category.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {category.questions.length} questions • {category.timePerQuestion}s each
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {!isAnswered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePause}
                  className="text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onQuit}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-1" />
                Quit
              </Button>
            </motion.div>
          </div>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={category.questions.length}
          />
        </div>
      </motion.header>

      {/* Main content with animations */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Timer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6 overflow-hidden border-2 border-primary/20">
            <CardContent className="py-5">
              <TimerDisplay
                timeRemaining={timeRemaining}
                percentage={percentage}
                isWarning={isWarning}
                isCritical={isCritical}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Question Card with key for re-animation */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="mb-6 shadow-xl border-0 overflow-hidden">
            {/* Gradient top line */}
            <div className="h-1 gradient-hero" />
            <CardContent className="py-6 px-6">
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={category.questions.length}
                selectedAnswer={selectedAnswer}
                isAnswered={isAnswered}
                onSelectAnswer={handleSelectAnswer}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Next button with animation */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                onClick={handleNext}
                size="lg"
                className="w-full gradient-primary text-white border-0 h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all group"
              >
                {isLastQuestion ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                    See Results
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Pause Modal */}
      <AnimatePresence>
        {isPaused && (
          <PauseModal
            onResume={handleResume}
            onQuit={onQuit}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={category.questions.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
