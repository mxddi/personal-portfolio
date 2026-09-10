"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

/**
 * Light/dark theme switch. The actual `.dark` class is applied synchronously
 * by an inline `beforeInteractive` script in the root layout (so there's no
 * flash of the wrong theme on load) — this component just reflects that
 * state and toggles it on click, persisting the choice to `localStorage`.
 */
export function ThemeToggle() {
  // Start `null` until mounted so the icon doesn't mismatch the
  // server-rendered markup before we can read the class the inline
  // script already applied.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Ignore write failures (e.g. private browsing storage limits).
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="relative flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-200 text-zinc-700 transition-colors duration-200 hover:border-accent/40 hover:text-accent dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-accent/40 dark:hover:text-accent"
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ease-precise ${
          theme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        strokeWidth={1.5}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ease-precise ${
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        strokeWidth={1.5}
      />
    </button>
  );
}
