import { QuizCategory } from "@/types/quiz";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, ArrowRight, Code, Braces, Globe, Lightbulb, HelpCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  Code,
  Braces,
  Globe,
  Lightbulb,
  HelpCircle,
};

interface CategoryCardProps {
  category: QuizCategory;
  bestScore: number;
  onSelect: (category: QuizCategory) => void;
}

export function CategoryCard({ category, bestScore, onSelect }: CategoryCardProps) {
  // Get icon from map, fallback to HelpCircle
  const IconComponent = iconMap[category.icon] || HelpCircle;

  const hasAttempted = bestScore > 0;

  return (
    <Card
      onClick={() => onSelect(category)}
      className={cn(
        "group cursor-pointer transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
        "border-2 hover:border-primary/30 overflow-hidden"
      )}
    >
      {/* Gradient top bar */}
      <div className={cn("h-2 bg-gradient-to-r", category.color)} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "p-3 rounded-xl bg-gradient-to-br",
              category.color,
              "text-white shadow-lg"
            )}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          {hasAttempted && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-success/10 text-success border-success/20"
            >
              <Trophy className="h-3 w-3" />
              {bestScore}%
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
          {category.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {category.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {category.timePerQuestion}s/question
            </span>
            <span>{category.questions.length} questions</span>
          </div>

          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full",
              "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
              "transition-all duration-300"
            )}
          >
            <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
