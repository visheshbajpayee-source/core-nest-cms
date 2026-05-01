"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

type Props = {
  className?: string;
  compact?: boolean;
};

export default function ThemeToggle({ className = "", compact = false }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${className}`}
      >
        <Icon isDark={isDark} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={`group relative flex h-8 w-14 items-center rounded-full border border-slate-200/70 bg-slate-100 p-1 transition-colors dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      <span
        className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white text-slate-700 shadow transition-transform duration-300 dark:bg-slate-900 dark:text-amber-300 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        <Icon isDark={isDark} small />
      </span>
    </button>
  );
}

function Icon({ isDark, small = false }: { isDark: boolean; small?: boolean }) {
  const size = small ? "h-3.5 w-3.5" : "h-4 w-4";
  if (isDark) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21.64 13.65A9 9 0 1110.35 2.36 7 7 0 0021.64 13.65z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
