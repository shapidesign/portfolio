"use client";

import { useEffect } from "react";

const STORAGE_KEY = "hasVisitedWork";

export function WorkVisitMarker() {
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  return null;
}

export function hasVisitedWork(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}
