import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { QuizCategory } from "@/types/quiz";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  ArrowRight,
  Code,
  Braces,
  Globe,
  Lightbulb,
  Sparkles,
  LucideIcon,
  Flame,
  Crown,
  Trash2,
} from "lucide-react";

interface EnhancedCategoryCardProps {
  category: QuizCategory;
  bestScore: number;
  questionsAnswered?: number;
  isCustom?: boolean;
  isPopular?: boolean;
  onSelect: (category: QuizCategory) => void;
  onDelete?: (categoryId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Code: Code,
  Braces: Braces,
  Globe: Globe,
  Lightbulb: Lightbulb,
  Sparkles: Sparkles,
};

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-success/20 text-success border-success/30" },
  medium: { label: "Medium", color: "bg-warning/20 text-warning border-warning/30" },
  hard: { label: "Hard", color: "bg-destructive/20 text-destructive border-destructive/30" },
};

export function EnhancedCategoryCard({
  category,
  bestScore,
  questionsAnswered = 0,
  isCustom = false,
  isPopular = false,
  onSelect,
  onDelete,
}: EnhancedCategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Sparkles;
  const progress = Math.min((questionsAnswered / category.questions.length) * 100, 100);
  
  // Determine difficulty based on timePerQuestion
  const difficulty = category.timePerQuestion <= 20 ? "hard" : category.timePerQuestion <= 25 ? "medium" : "easy";
  const diffConfig = difficultyConfig[difficulty];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className="group cursor-pointer h-full overflow-hidden rounded-2xl liquid-glass relative"
        onClick={() => onSelect(category)}
      >
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary) / 0.2), transparent 50%)`,
          }}
        />
        
        {/* Delete Button for Custom Quizzes */}
        {isCustom && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-10 h-8 w-8 liquid-glass hover:bg-destructive/20 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{category.name}"? This action cannot be undone and all progress for this quiz will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category.id);
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Quiz
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Gradient Top Border with Animation */}
        <motion.div 
          className={`h-1.5 bg-gradient-to-r ${category.color}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ originX: 0 }}
        />

        <CardContent className="p-6 relative" style={{ transform: "translateZ(10px)" }}>
          {/* Header with Icon & Badges */}
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-xl`}
              whileHover={{ 
                rotate: [0, -10, 10, 0],
                scale: 1.1,
                transition: { duration: 0.4 }
              }}
            >
              <IconComponent className="h-7 w-7 text-white" />
            </motion.div>
            <div className="flex flex-wrap gap-2 justify-end pr-8">
              <Badge variant="outline" className={`text-xs font-medium ${diffConfig.color} backdrop-blur-sm`}>
                {diffConfig.label}
              </Badge>
              {isCustom && (
                <Badge className="text-xs liquid-glass border-primary/30 text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Custom
                </Badge>
              )}
              {isPopular && (
                <Badge className="text-xs bg-warning/20 text-warning border-warning/30 backdrop-blur-sm">
                  <Flame className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {category.description}
          </p>

          {/* Progress Bar with Animation */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <motion.span 
                className="font-semibold text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{ originX: 0 }}
            >
              <Progress value={progress} className="h-2.5" />
            </motion.div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{category.timePerQuestion}s/q</span>
              </div>
              <div className="text-muted-foreground">
                📝 {category.questions.length} questions
              </div>
            </div>
          </div>

          {/* Best Score & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            {bestScore > 0 ? (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                <Crown className="h-5 w-5 text-warning" />
                <span className="text-sm font-bold text-foreground">
                  Best: {bestScore}%
                </span>
              </motion.div>
            ) : (
              <span className="text-sm text-muted-foreground">Not attempted yet</span>
            )}
            <motion.div 
              className="flex items-center gap-2 text-primary font-semibold"
              whileHover={{ x: 5 }}
            >
              <span className="text-sm">Start Quiz</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>
        </CardContent>
      </div>
    </motion.div>
  );
}
