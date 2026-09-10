"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const THEME_EVENT = "themechange";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function applyTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Ignore write failures (e.g. private browsing storage limits).
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: next }));
}

/**
 * Light/dark theme switch. The `.dark` class is applied synchronously by
 * an inline script in the root layout (no flash on load). Every instance
 * listens for the same `themechange` event so header and footer stay in
 * sync.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readTheme());
    const onChange = (event: Event) => {
      setTheme((event as CustomEvent<Theme>).detail);
    };
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
  }, []);

  return (
    <button
      type="button"
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
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
