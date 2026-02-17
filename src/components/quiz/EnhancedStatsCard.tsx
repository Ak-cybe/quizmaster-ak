import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface EnhancedStatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  value: number | string;
  total?: number;
  label: string;
  sublabel?: string;
  showProgress?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
  delay?: number;
}

// Animated counter component
function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (value - startValue) * easeOut);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <>{displayValue}</>;
}

export function EnhancedStatsCard({
  icon: Icon,
  iconColor,
  value,
  total,
  label,
  sublabel,
  showProgress = false,
  ctaText,
  onCtaClick,
  delay = 0,
}: EnhancedStatsCardProps) {
  const numericValue = typeof value === 'number' ? value : 0;
  const progress = total ? (numericValue / total) * 100 : 0;
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
    >
      <div className="liquid-glass h-full rounded-2xl overflow-hidden group cursor-pointer">
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.15), transparent 60%)",
          }}
        />
        
        <CardContent className="p-5 relative" style={{ transform: "translateZ(15px)" }}>
          {/* Icon with enhanced animation */}
          <motion.div 
            className={`inline-flex p-3.5 rounded-xl ${iconColor} mb-4 shadow-xl`}
            whileHover={{ 
              rotate: [0, -15, 15, 0],
              scale: 1.15
            }}
            transition={{ duration: 0.4 }}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>

          {/* Value with animated counter */}
          <div className="mb-2">
            <motion.span 
              className="text-4xl font-black text-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.2 }}
            >
              {typeof value === 'number' ? <AnimatedNumber value={value} duration={1.5} /> : value}
            </motion.span>
            {total !== undefined && (
              <span className="text-xl text-muted-foreground font-medium"> / {total}</span>
            )}
          </div>

          {/* Label */}
          <p className="text-sm font-semibold text-muted-foreground mb-3">{label}</p>

          {/* Animated Progress Bar */}
          {showProgress && total && (
            <div className="mb-2">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: delay + 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ originX: 0 }}
              >
                <Progress value={progress} className="h-2.5" />
              </motion.div>
            </div>
          )}

          {/* Sublabel or CTA */}
          {sublabel && (
            <motion.p 
              className="text-xs text-muted-foreground flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
            >
              {sublabel}
            </motion.p>
          )}
          
          {ctaText && onCtaClick && numericValue === 0 && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onCtaClick();
              }}
              className="text-xs text-primary font-bold hover:underline mt-1 flex items-center gap-1"
              whileHover={{ x: 5 }}
            >
              {ctaText} →
            </motion.button>
          )}
        </CardContent>
      </div>
    </motion.div>
  );
}
