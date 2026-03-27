"use client";

import { useEffect } from "react";

let visited = false;

export function WorkVisitMarker() {
  useEffect(() => {
    visited = true;
  }, []);

  return null;
}

export function hasVisitedWork(): boolean {
  return visited;
}
