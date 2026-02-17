import { motion } from "framer-motion";
import { QuizCategory } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Zap, Clock, Star } from "lucide-react";

interface QuickStartCardProps {
  recommendedQuiz: QuizCategory;
  onStart: (category: QuizCategory) => void;
}

export function QuickStartCard({ recommendedQuiz, onStart }: QuickStartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Info */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <Zap className="h-4 w-4 text-warning" />
                </div>
                <span className="text-sm font-semibold text-warning">Quick Start</span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ready for a challenge?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Jump right into <span className="font-semibold text-primary">{recommendedQuiz.name}</span> and test your knowledge!
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recommendedQuiz.timePerQuestion}s per question</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{recommendedQuiz.questions.length} questions</span>
                </div>
              </div>

              <Button
                onClick={() => onStart(recommendedQuiz)}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold shadow-lg group"
              >
                <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Start Now
              </Button>
            </div>

            {/* Right side - Visual */}
            <div className="hidden md:flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 to-accent/20">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                  <Play className="h-10 w-10 text-white ml-1" />
                </div>
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-warning flex items-center justify-center"
                >
                  <Star className="h-3 w-3 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
