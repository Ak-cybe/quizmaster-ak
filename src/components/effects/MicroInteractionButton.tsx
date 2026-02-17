import { motion, useAnimation } from "framer-motion";
import { ReactNode, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MicroInteractionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  haptic?: boolean;
}

export function MicroInteractionButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  haptic = true
}: MicroInteractionButtonProps) {
  const controls = useAnimation();

  const triggerHaptic = useCallback(() => {
    if (haptic && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, [haptic]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    
    triggerHaptic();
    
    // Ripple animation
    controls.start({
      scale: [1, 0.95, 1.02, 1],
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
    });
    
    onClick?.();
  }, [disabled, triggerHaptic, controls, onClick]);

  const variantStyles = {
    primary: "gradient-primary text-primary-foreground shadow-lg hover:shadow-xl glow-interact",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent/10 text-foreground",
    glass: "liquid-glass text-foreground hover:bg-card/60"
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-sm rounded-lg",
    md: "h-11 px-6 text-base rounded-xl",
    lg: "h-14 px-8 text-lg rounded-2xl font-semibold"
  };

  return (
    <motion.button
      animate={controls}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -2
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.97
      }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2",
        "font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "overflow-hidden",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {/* Shimmer overlay on hover */}
      <motion.div
        className="absolute inset-0 opacity-0"
        whileHover={{ opacity: 1 }}
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--background) / 0.2), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
