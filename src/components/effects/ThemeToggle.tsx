import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState, forwardRef } from "react";

export const ThemeToggle = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  function ThemeToggle(props, ref) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return (
        <Button ref={ref} variant="ghost" size="icon" className="rounded-full" {...props}>
          <Sun className="h-5 w-5" />
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full bg-white/10 hover:bg-white/20 text-white"
        {...props}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 transition-all" />
        ) : (
          <Moon className="h-5 w-5 transition-all" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
);
