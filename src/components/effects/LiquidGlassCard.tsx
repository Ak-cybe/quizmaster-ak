import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "accent" | "success" | "warning";
  interactive?: boolean;
}

export function LiquidGlassCard({ 
  children, 
  className = "", 
  glowColor = "primary",
  interactive = true 
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive) return;
    
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

  const glowColors = {
    primary: "hsl(var(--primary) / 0.15)",
    accent: "hsl(var(--accent) / 0.15)",
    success: "hsl(var(--success) / 0.15)",
    warning: "hsl(var(--warning) / 0.15)",
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-2xl liquid-glass overflow-hidden",
        interactive && "cursor-pointer",
        className
      )}
      whileHover={{ scale: interactive ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${glowColors[glowColor]}, transparent 50%)`,
        }}
        animate={{
          background: [
            `linear-gradient(0deg, ${glowColors[glowColor]}, transparent 50%)`,
            `linear-gradient(90deg, ${glowColors[glowColor]}, transparent 50%)`,
            `linear-gradient(180deg, ${glowColors[glowColor]}, transparent 50%)`,
            `linear-gradient(270deg, ${glowColors[glowColor]}, transparent 50%)`,
            `linear-gradient(360deg, ${glowColors[glowColor]}, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Content with depth */}
      <div 
        className="relative z-10" 
        style={{ transform: interactive ? "translateZ(20px)" : undefined }}
      >
        {children}
      </div>

      {/* Liquid surface reflection */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, hsl(var(--background) / 0.05) 100%)",
        }}
      />
    </motion.div>
  );
}
