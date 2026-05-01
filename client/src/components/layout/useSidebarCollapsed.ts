"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "core-nest-sidebar-collapsed";

export function useSidebarCollapsed(): {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (next: boolean) => void;
} {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === "1";
    setCollapsedState(stored);
    document.documentElement.classList.toggle("sidebar-collapsed", stored);
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    document.documentElement.classList.toggle("sidebar-collapsed", next);
    // Notify any other sidebar instances on the page so they can stay in sync.
    window.dispatchEvent(new CustomEvent("sidebar:collapsed", { detail: next }));
  }, []);

  useEffect(() => {
    const onSync = (e: Event) => {
      const next = (e as CustomEvent<boolean>).detail;
      setCollapsedState(next);
    };
    window.addEventListener("sidebar:collapsed", onSync as EventListener);
    return () => window.removeEventListener("sidebar:collapsed", onSync as EventListener);
  }, []);

  const toggle = useCallback(() => setCollapsed(!collapsed), [collapsed, setCollapsed]);

  return { collapsed, toggle, setCollapsed };
}
