import { useState } from "react";
import { motion } from "framer-motion";
import { QuizCategory, QuizAttempt, UserAnswer } from "@/types/quiz";
import { quizCategories } from "@/data/quizData";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LandingPage } from "./LandingPage";
import { EnhancedCategoryCard } from "@/components/quiz/EnhancedCategoryCard";
import { EnhancedStatsCard } from "@/components/quiz/EnhancedStatsCard";
import { CreateQuizCard } from "@/components/quiz/CreateQuizCard";
import { QuickStartCard } from "@/components/quiz/QuickStartCard";
import { QuizPlayer } from "./QuizPlayer";
import { QuizResults } from "./QuizResults";
import { QuizCreator } from "./QuizCreator";
import { ThemeToggle } from "@/components/effects/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import amreshImage from "@/assets/amresh-singh.jpg";
import {
  Brain,
  Trophy,
  Flame,
  BarChart3,
  Target,
  Sparkles,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Medal,
  ArrowRight,
  Home,
} from "lucide-react";

type QuizView = "landing" | "home" | "playing" | "results" | "creator";

export function QuizHome() {
  const [currentView, setCurrentView] = useState<QuizView>("landing");
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);
  const [customQuizzes, setCustomQuizzes] = useLocalStorage<QuizCategory[]>("custom-quizzes", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "in-progress" | "completed" | "new">("all");

  const { progress, saveAttempt, getBestScore, getAttemptsForCategory } = useQuizProgress();

  // Combine default and custom quizzes
  const allCategories = [...quizCategories, ...customQuizzes];

  // Filter categories
  const filteredCategories = allCategories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const attempts = getAttemptsForCategory(cat.id);
    const hasAttempts = attempts.length > 0;
    const bestScore = getBestScore(cat.id);

    switch (filterType) {
      case "in-progress":
        return hasAttempts && bestScore < 100;
      case "completed":
        return bestScore >= 80;
      case "new":
        return !hasAttempts;
      default:
        return true;
    }
  });

  // Calculate total stats
  const totalQuestions = allCategories.reduce((sum, cat) => sum + cat.questions.length, 0);
  const totalAnswered = progress.attempts.reduce((sum, att) => sum + att.answers.length, 0);

  const handleSelectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentView("playing");
  };

  const handleQuizComplete = (answers: UserAnswer[], totalTime: number) => {
    if (!selectedCategory) return;

    const score = answers.filter((a) => a.isCorrect).length;
    const attempt: QuizAttempt = {
      categoryId: selectedCategory.id,
      date: new Date().toISOString(),
      score,
      totalQuestions: selectedCategory.questions.length,
      timeTaken: totalTime,
      answers,
    };

    saveAttempt(attempt);
    setLastAttempt(attempt);
    setCurrentView("results");
  };

  const handleRetry = () => {
    setCurrentView("playing");
    setLastAttempt(null);
  };

  const handleGoHome = () => {
    setCurrentView("home");
    setSelectedCategory(null);
    setLastAttempt(null);
  };

  const handleQuit = () => {
    setCurrentView("home");
    setSelectedCategory(null);
  };

  const handleOpenCreator = () => {
    setCurrentView("creator");
  };

  const handleSaveQuiz = (newQuiz: QuizCategory) => {
    setCustomQuizzes([...customQuizzes, newQuiz]);
    setCurrentView("home");
  };

  const handleDeleteQuiz = (categoryId: string) => {
    setCustomQuizzes(customQuizzes.filter((quiz) => quiz.id !== categoryId));
  };

  const handleCloseCreator = () => {
    setCurrentView("home");
  };

  const handleGetStarted = () => {
    setCurrentView("home");
  };

  // Render Landing Page
  if (currentView === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Render Quiz Creator
  if (currentView === "creator") {
    return <QuizCreator onSaveQuiz={handleSaveQuiz} onClose={handleCloseCreator} />;
  }

  // Render Quiz Player
  if (currentView === "playing" && selectedCategory) {
    return (
      <QuizPlayer
        category={selectedCategory}
        onComplete={handleQuizComplete}
        onQuit={handleQuit}
      />
    );
  }

  // Render Results
  if (currentView === "results" && selectedCategory && lastAttempt) {
    return (
      <QuizResults
        category={selectedCategory}
        attempt={lastAttempt}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
      />
    );
  }

  // Render Enhanced Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView("landing")}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                >
                  <Home className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Brain className="h-7 w-7" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black">MakeAQuiz</h1>
                </div>
                <ThemeToggle />
              </div>

              {/* Personalized Greeting */}
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-white/80 max-w-xl">
                {progress.totalQuizzesCompleted === 0
                  ? "Ready to start your learning journey? Take your first quiz to unlock stats!"
                  : `Your current streak: ${progress.currentStreak} days — keep it going!`
                }
              </p>
            </div>

            {/* Quick Action */}
            {progress.totalQuizzesCompleted === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  size="lg"
                  onClick={() => handleSelectCategory(allCategories[0])}
                  className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
                >
                  Take First Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-10 mb-8 relative z-10">
          <EnhancedStatsCard
            icon={Trophy}
            iconColor="bg-gradient-to-br from-warning to-orange-400"
            value={progress.totalQuizzesCompleted}
            total={allCategories.length}
            label="Quizzes Completed"
            showProgress
            ctaText="Start One"
            onCtaClick={() => handleSelectCategory(allCategories[0])}
            delay={0}
          />

          <EnhancedStatsCard
            icon={Flame}
            iconColor="bg-gradient-to-br from-destructive to-red-400"
            value={progress.currentStreak}
            label="Day Streak"
            sublabel="🎯 Goal: 7 days"
            delay={0.1}
          />

          <EnhancedStatsCard
            icon={Target}
            iconColor="bg-gradient-to-br from-primary to-accent"
            value={Object.keys(progress.bestScores).length}
            total={allCategories.length}
            label="Categories Explored"
            showProgress
            delay={0.2}
          />

          <EnhancedStatsCard
            icon={Brain}
            iconColor="bg-gradient-to-br from-success to-emerald-400"
            value={totalAnswered}
            total={totalQuestions}
            label="Questions Answered"
            showProgress
            delay={0.3}
          />
        </div>

        {/* Quick Start Section */}
        {allCategories.length > 0 && (
          <div className="mb-8">
            <QuickStartCard
              recommendedQuiz={allCategories[Math.floor(Math.random() * Math.min(allCategories.length, 4))]}
              onStart={handleSelectCategory}
            />
          </div>
        )}

        {/* Search & Filter - Improved Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Search gets prominence */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="quiz-search"
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search quizzes by name or description"
                    aria-describedby="search-hint"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-input bg-background text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <span id="search-hint" className="sr-only">
                    Type to filter quizzes in real-time
                  </span>
                </div>

                {/* Filters as secondary actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter:</span>
                  {[
                    { value: "all" as const, label: "All" },
                    { value: "in-progress" as const, label: "In Progress" },
                    { value: "completed" as const, label: "Completed" },
                    { value: "new" as const, label: "New" },
                  ].map((filter) => (
                    <Button
                      key={filter.value}
                      variant={filterType === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType(filter.value)}
                      className="font-medium"
                      aria-pressed={filterType === filter.value}
                      aria-label={`Filter by ${filter.label} quizzes`}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Choose a Category</h2>
            <span className="text-muted-foreground">
              {filteredCategories.length} of {allCategories.length} categories
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Create Quiz Card - First Position */}
            <CreateQuizCard onClick={handleOpenCreator} />

            {/* Category Cards */}
            {filteredCategories.map((category, index) => {
              const isCustom = customQuizzes.some((c) => c.id === category.id);
              const isPopular = ["python-basics", "javascript-fundamentals"].includes(category.id);
              const attempts = getAttemptsForCategory(category.id);

              return (
                <EnhancedCategoryCard
                  key={category.id}
                  category={category}
                  bestScore={getBestScore(category.id)}
                  questionsAnswered={attempts.reduce((sum, a) => sum + a.answers.filter(ans => ans.isCorrect).length, 0)}
                  isCustom={isCustom}
                  isPopular={isPopular}
                  onSelect={handleSelectCategory}
                  onDelete={isCustom ? handleDeleteQuiz : undefined}
                />
              );
            })}

            {/* Empty State */}
            {filteredCategories.length === 0 && (
              <Card className="col-span-full border-dashed border-2 border-muted">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Target className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No quizzes found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? `No quizzes match "${searchQuery}". Try a different search term.`
                      : "No quizzes match the selected filter. Try changing your filter selection."
                    }
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Weekly Summary */}
        {progress.attempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-8 border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Week in Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Medal className="h-8 w-8 text-warning" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {progress.attempts.slice(0, 7).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Quizzes this week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Clock className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round(progress.attempts.slice(0, 7).reduce((sum, a) => sum + a.timeTaken, 0) / 60)}
                      </p>
                      <p className="text-sm text-muted-foreground">Minutes learning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Target className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {progress.attempts.length > 0
                          ? Math.round(
                            (progress.attempts.slice(0, 7).reduce((sum, a) => sum + a.score, 0) /
                              progress.attempts.slice(0, 7).reduce((sum, a) => sum + a.totalQuestions, 0)) * 100
                          ) || 0
                          : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Average accuracy</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <h4 className="font-semibold text-foreground mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {progress.attempts.slice(0, 5).map((attempt, index) => {
                    const category = allCategories.find((c) => c.id === attempt.categoryId);
                    const scorePercentage = Math.round((attempt.score / attempt.totalQuestions) * 100);

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${scorePercentage >= 80 ? 'bg-success' : scorePercentage >= 50 ? 'bg-warning' : 'bg-destructive'}`} />
                          <div>
                            <p className="font-medium text-foreground">
                              {category?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(attempt.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={scorePercentage >= 80 ? "default" : "secondary"} className="font-bold">
                            {scorePercentage}%
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Achievements Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-warning" />
                Achievements
                <Badge variant="outline" className="ml-2">Coming Soon</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                🏅 Unlock badges as you progress!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "First Quiz", icon: "🎯", unlocked: progress.totalQuizzesCompleted > 0 },
                  { name: "7-Day Streak", icon: "🔥", unlocked: progress.currentStreak >= 7 },
                  { name: "Perfect Score", icon: "💯", unlocked: Object.values(progress.bestScores).some(s => s === 100) },
                  { name: "Category Master", icon: "👑", unlocked: Object.keys(progress.bestScores).length >= 4 },
                ].map((achievement) => (
                  <div
                    key={achievement.name}
                    className={`p-4 rounded-lg text-center transition-all ${achievement.unlocked
                      ? 'bg-primary/10 border-2 border-primary/30'
                      : 'bg-muted/50 opacity-60'
                      }`}
                  >
                    <span className="text-2xl mb-2 block">{achievement.icon}</span>
                    <p className="text-sm font-medium text-foreground">{achievement.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer with Creator Info */}
      <footer className="py-10 mt-8 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">MakeAQuiz.in</span>
            </div>

            {/* Creator Section */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <img
                src={amreshImage}
                alt="Amresh Singh"
                className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow-lg"
              />
              <div>
                <p className="text-sm text-muted-foreground">Service by</p>
                <p className="font-bold text-lg text-foreground">Amresh Singh</p>
              </div>
            </div>

            <p className="text-muted-foreground text-xs mt-2">
              © {new Date().getFullYear()} MakeAQuiz.in. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
