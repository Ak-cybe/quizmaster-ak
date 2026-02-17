import { useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  intensity?: "low" | "medium" | "high";
}

export function Confetti({ intensity = "medium" }: ConfettiProps) {
  const hasRun = useRef(false);

  const fireConfetti = useCallback(() => {
    // Base config for confetti
    const duration = intensity === "high" ? 5000 : intensity === "medium" ? 3000 : 2000;
    const particleCount = intensity === "high" ? 150 : intensity === "medium" ? 100 : 50;

    const end = Date.now() + duration;

    const colors = ["#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F59E0B", "#FFD700"];

    // Initial burst from both sides
    const fireBurst = () => {
      confetti({
        particleCount: particleCount,
        spread: 60,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        startVelocity: 45,
        gravity: 1,
        scalar: 1.2,
      });
      
      confetti({
        particleCount: particleCount,
        spread: 60,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        startVelocity: 45,
        gravity: 1,
        scalar: 1.2,
      });
    };

    // Center burst
    const fireCenterBurst = () => {
      confetti({
        particleCount: Math.floor(particleCount * 1.5),
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        startVelocity: 55,
        gravity: 0.8,
        scalar: 1.3,
      });
    };

    // Fire initial bursts
    fireBurst();
    
    setTimeout(() => {
      fireCenterBurst();
    }, 200);

    // Continuous confetti for high intensity
    if (intensity === "high") {
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors,
        });
        
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors,
        });
      }, 250);

      return () => clearInterval(interval);
    }

    // Random bursts for medium intensity
    if (intensity === "medium") {
      const randomBursts = [500, 1000, 1500, 2000];
      randomBursts.forEach((delay) => {
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { x: Math.random(), y: Math.random() * 0.4 + 0.3 },
            colors: colors,
          });
        }, delay);
      });
    }
  }, [intensity]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      fireConfetti();
    }, 100);

    return () => {
      clearTimeout(timer);
      // Reset confetti on unmount
      confetti.reset();
    };
  }, [fireConfetti]);

  return null; // canvas-confetti creates its own canvas
}

// Star confetti for perfect score
export function StarConfetti() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const duration = 4000;
    const end = Date.now() + duration;
    
    const colors = ["#FFD700", "#FFA500", "#FF6347", "#8B5CF6", "#EC4899"];

    // Custom star shape
    const star = confetti.shapeFromPath({
      path: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
    });

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        shapes: [star, "circle"],
        scalar: 1.5,
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        shapes: [star, "circle"],
        scalar: 1.5,
      });

      requestAnimationFrame(frame);
    };

    // Initial big burst with stars
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: colors,
      shapes: [star, "circle", "square"],
      scalar: 1.5,
      startVelocity: 45,
    });

    setTimeout(frame, 300);

    return () => {
      confetti.reset();
    };
  }, []);

  return null;
}
