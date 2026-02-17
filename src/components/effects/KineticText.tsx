import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface KineticTextProps {
  text: string;
  className?: string;
  variant?: "hero" | "heading" | "accent";
  animate?: boolean;
}

export function KineticText({ text, className = "", variant = "hero", animate = true }: KineticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]), springConfig);

  const words = text.split(" ");

  const getVariantStyles = () => {
    switch (variant) {
      case "hero":
        return "text-4xl md:text-6xl lg:text-7xl font-black leading-tight";
      case "heading":
        return "text-3xl md:text-4xl font-bold";
      case "accent":
        return "text-2xl md:text-3xl font-semibold";
      default:
        return "";
    }
  };

  if (!animate) {
    return (
      <span className={`kinetic-text ${getVariantStyles()} ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className={`${getVariantStyles()} ${className}`}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: wordIndex * 0.08,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block kinetic-text"
              whileHover={{
                scale: 1.2,
                transition: { type: "spring", stiffness: 500 }
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.div>
  );
}
