"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as THREE from "three";
import { loadStarShapes } from "./star-geometry";

const StarShapesContext = createContext<THREE.Shape[] | null>(null);

export function StarShapesProvider({ children }: { children: ReactNode }) {
  const [shapes, setShapes] = useState<THREE.Shape[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadStarShapes()
      .then((s) => {
        if (!cancelled) setShapes(s);
      })
      .catch((err) => {
        console.error("[solar] failed to load star.svg", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <StarShapesContext.Provider value={shapes}>{children}</StarShapesContext.Provider>;
}

export function useStarShapes(): THREE.Shape[] | null {
  return useContext(StarShapesContext);
}
