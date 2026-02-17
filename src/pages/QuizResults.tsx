import { useEffect, useRef } from "react";
import { QuizAttempt, QuizCategory, UserAnswer } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Confetti, StarConfetti } from "@/components/effects/Confetti";
import { MathText } from "@/components/ui/MathText";
import { Trophy, Clock, Target, RotateCcw, Home, ChevronDown, ChevronUp, Check, X, Star, Sparkles, Zap, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface QuizResultsProps {
  category: QuizCategory;
  attempt: QuizAttempt;
  onRetry: () => void;
  onGoHome: () => void;
}

export function QuizResults({ category, attempt, onRetry, onGoHome }: QuizResultsProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const { play } = useSoundEffects();
  const hasPlayedCelebration = useRef(false);

  const scorePercentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const averageTime = Math.round(attempt.timeTaken / attempt.totalQuestions);
  const correctAnswers = attempt.score;
  const incorrectAnswers = attempt.totalQuestions - attempt.score;

  const getGrade = () => {
    if (scorePercentage >= 90) return { grade: "A+", color: "text-success", message: "Outstanding! 🏆", emoji: "🏆", bg: "bg-success/10" };
    if (scorePercentage >= 80) return { grade: "A", color: "text-success", message: "Excellent work! 🌟", emoji: "🌟", bg: "bg-success/10" };
    if (scorePercentage >= 70) return { grade: "B", color: "text-primary", message: "Great job! 👏", emoji: "👏", bg: "bg-primary/10" };
    if (scorePercentage >= 60) return { grade: "C", color: "text-warning", message: "Good effort! 💪", emoji: "💪", bg: "bg-warning/10" };
    if (scorePercentage >= 50) return { grade: "D", color: "text-warning", message: "Keep practicing! 📚", emoji: "📚", bg: "bg-warning/10" };
    return { grade: "F", color: "text-destructive", message: "Don't give up! 🔥", emoji: "🔥", bg: "bg-destructive/10" };
  };

  const gradeInfo = getGrade();

  // Confetti logic: 80%+ gets confetti, 90%+ gets star confetti (perfect celebration)
  const showConfetti = scorePercentage >= 80 && scorePercentage < 90;
  const showStarConfetti = scorePercentage >= 90;
  const confettiIntensity = scorePercentage >= 95 ? "high" : scorePercentage >= 85 ? "medium" : "low";

  // Play celebration sound for high scores
  useEffect(() => {
    if (!hasPlayedCelebration.current && scorePercentage >= 70) {
      hasPlayedCelebration.current = true;
      // Small delay to sync with visual celebration
      const timer = setTimeout(() => {
        play("celebration");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scorePercentage, play]);
  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {showConfetti && <Confetti intensity={confettiIntensity} />}
      {showStarConfetti && <StarConfetti />}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Score Hero Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6",
              gradeInfo.bg
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          >
            {scorePercentage >= 80 ? (
              <Sparkles className={cn("h-5 w-5", gradeInfo.color)} />
            ) : (
              <Trophy className={cn("h-5 w-5", gradeInfo.color)} />
            )}
            <span className={cn("font-bold", gradeInfo.color)}>
              {scorePercentage >= 90 ? "Perfect Score!" : scorePercentage >= 80 ? "Great Achievement!" : "Quiz Complete!"}
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-black text-foreground mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {category.name}
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {gradeInfo.message}
          </motion.p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
        >
          <Card className="mb-8 overflow-hidden shadow-2xl border-0">
            <div className="gradient-hero p-10 text-center text-white relative overflow-hidden">
              {/* Animated background sparkles for high scores */}
              {scorePercentage >= 80 && (
                <div className="absolute inset-0">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/30 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.3, 1, 0.3],
                        y: [0, -20, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Score Circle */}
              <motion.div
                className="relative inline-block mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.5, stiffness: 100 }}
              >
                <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                  <div className="text-center">
                    <motion.span
                      className="text-6xl font-black block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {scorePercentage}%
                    </motion.span>
                    <span className="text-sm font-medium opacity-80">Score</span>
                  </div>
                </div>

                {/* Floating star for perfect score */}
                {scorePercentage >= 90 && (
                  <motion.div
                    className="absolute -top-3 -right-3"
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="p-2 rounded-full bg-warning shadow-lg">
                      <Star className="h-6 w-6 text-white fill-white" />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Grade Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Award className="h-5 w-5" />
                <span className="text-lg font-bold">Grade: {gradeInfo.grade}</span>
              </motion.div>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <motion.div
                  className="p-5 rounded-2xl bg-success/10 hover:bg-success/20 transition-all cursor-default group"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="p-2 rounded-full bg-success/20 group-hover:bg-success/30 transition-colors">
                      <Check className="h-5 w-5 text-success" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-success mb-1">{correctAnswers}</div>
                  <div className="text-sm text-muted-foreground font-medium">Correct</div>
                </motion.div>

                <motion.div
                  className="p-5 rounded-2xl bg-destructive/10 hover:bg-destructive/20 transition-all cursor-default group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="p-2 rounded-full bg-destructive/20 group-hover:bg-destructive/30 transition-colors">
                      <X className="h-5 w-5 text-destructive" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-destructive mb-1">{incorrectAnswers}</div>
                  <div className="text-sm text-muted-foreground font-medium">Incorrect</div>
                </motion.div>

                <motion.div
                  className="p-5 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-all cursor-default group"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-primary mb-1">{averageTime}s</div>
                  <div className="text-sm text-muted-foreground font-medium">Avg/Question</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card className="mb-8 border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Performance Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Time</p>
                  <p className="text-xl font-bold text-foreground">{Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-xl font-bold text-foreground">{scorePercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                Question Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.questions.map((question, index) => {
                const userAnswer = attempt.answers[index];
                const isExpanded = expandedQuestions.has(question.id);
                const isCorrect = userAnswer?.isCorrect;

                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.05 }}
                    className={cn(
                      "rounded-xl border-2 overflow-hidden transition-all hover:shadow-md",
                      isCorrect ? "border-success/30 hover:border-success/50" : "border-destructive/30 hover:border-destructive/50"
                    )}
                  >
                    <button
                      onClick={() => toggleQuestion(question.id)}
                      className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <motion.div
                        className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                          isCorrect ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                        )}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-foreground">Q{index + 1}: <MathText text={question.question} /></p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {userAnswer?.timeTaken || 0}s
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-muted/20">
                            <p className="text-sm text-muted-foreground mb-3">
                              Your answer:{" "}
                              <span
                                className={cn(
                                  "font-semibold",
                                  isCorrect ? "text-success" : "text-destructive"
                                )}
                              >
                                {userAnswer?.selectedAnswer
                                  ? <MathText text={question.options.find((o) => o.id === userAnswer.selectedAnswer)?.text || "No answer"} />
                                  : "No answer"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-muted-foreground mb-3">
                                Correct answer:{" "}
                                <span className="font-semibold text-success">
                                  <MathText text={question.options.find((o) => o.id === question.correctAnswer)?.text || ""} />
                                </span>
                              </p>
                            )}
                            <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                              <p className="text-sm text-foreground/80"><MathText text={question.explanation} /></p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Button
            onClick={onRetry}
            size="lg"
            className="flex-1 h-14 gradient-primary text-white border-0 text-lg font-bold shadow-lg hover:shadow-xl transition-all group"
          >
            <RotateCcw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Button>
          <Button
            onClick={onGoHome}
            size="lg"
            variant="outline"
            className="flex-1 h-14 text-lg font-medium hover:bg-muted"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Categories
          </Button>
        </motion.div>

        {/* Motivational message */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-warning" />
            {scorePercentage >= 80
              ? "Amazing! You're mastering this topic!"
              : scorePercentage >= 50
                ? "Good progress! Practice makes perfect!"
                : "Every expert was once a beginner. Keep going!"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
