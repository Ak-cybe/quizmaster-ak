import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Sparkles, ArrowRight, Bot } from "lucide-react";

interface CreateQuizCardProps {
  onClick: () => void;
}

export function CreateQuizCard({ onClick }: CreateQuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card
        className="group cursor-pointer h-full overflow-hidden border-2 border-dashed border-primary/40 hover:border-primary bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all duration-300 shadow-lg hover:shadow-2xl"
        onClick={onClick}
      >
        {/* Animated Gradient Border Effect */}
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer" />

        <CardContent className="p-6 flex flex-col h-full min-h-[240px]">
          {/* Icon with Pulse Effect */}
          <div className="relative mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg inline-block"
            >
              <Plus className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="h-5 w-5 text-warning" />
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
            Create Your Own Quiz
            <Sparkles className="h-4 w-4 text-warning" />
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-3 flex-grow">
            Paste your questions in bulk or add them one by one. Create custom quizzes for your study group or challenge friends!
          </p>

          {/* AI Helper Badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 mb-4">
            <Bot className="h-4 w-4 text-violet-500" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-violet-600 dark:text-violet-400">AI Powered:</span> Get MCQs from ChatGPT, Gemini, Claude, or Perplexity AI
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all pt-4 border-t border-primary/20">
            <span>Create Now</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
