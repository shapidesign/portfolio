"use client";

import { useEffect } from "react";

let hasVisitedWorkInPageLifecycle = false;

export function WorkVisitMarker() {
  useEffect(() => {
    hasVisitedWorkInPageLifecycle = true;
  }, []);

  return null;
}

export function hasVisitedWork(): boolean {
  return hasVisitedWorkInPageLifecycle;
}
