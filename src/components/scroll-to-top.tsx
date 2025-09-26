"use client";

import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  return null;
}
