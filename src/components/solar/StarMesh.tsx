"use client";

import { forwardRef, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";
import { buildStarGeometry, type StarGeometryOptions } from "./star-geometry";
import { useStarShapes } from "./StarShapesProvider";

type StarMeshProps = {
  size?: number;
  geometryOptions?: StarGeometryOptions;
  children?: ReactNode;
} & Omit<ThreeElements["mesh"], "children" | "ref">;

/**
 * Renders the trademark star as an extruded 3D mesh. Caller supplies the
 * material via children (`<meshStandardMaterial ... />`). The star geometry
 * is loaded from `/star.svg` once and reused across instances.
 */
export const StarMesh = forwardRef<THREE.Mesh, StarMeshProps>(function StarMesh(
  { size = 1, geometryOptions, children, ...meshProps },
  ref,
) {
  const shapes = useStarShapes();

  const geometry = useMemo(() => {
    if (!shapes) return null;
    return buildStarGeometry(shapes, geometryOptions);
  }, [shapes, geometryOptions]);

  if (!geometry) return null;

  return (
    <mesh ref={ref} geometry={geometry} scale={size} {...meshProps}>
      {children}
    </mesh>
  );
});
