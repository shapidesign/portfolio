import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const STAR_VIEWBOX_WIDTH = 45;
const STAR_VIEWBOX_HEIGHT = 43;

let cachedShapes: THREE.Shape[] | null = null;
let inflight: Promise<THREE.Shape[]> | null = null;

/**
 * Fetches /star.svg, parses it via Three's SVGLoader, and returns the
 * raw Shape(s). The shapes stay in SVG coordinate space (Y-down) — geometry
 * built from them gets transformed below in buildStarGeometry().
 */
export function loadStarShapes(): Promise<THREE.Shape[]> {
  if (cachedShapes) return Promise.resolve(cachedShapes);
  if (inflight) return inflight;

  inflight = new Promise<THREE.Shape[]>((resolve, reject) => {
    const loader = new SVGLoader();
    loader.load(
      "/star.svg",
      (data) => {
        const shapes: THREE.Shape[] = [];
        for (const path of data.paths) {
          for (const shape of SVGLoader.createShapes(path)) {
            shapes.push(shape);
          }
        }
        cachedShapes = shapes;
        inflight = null;
        resolve(shapes);
      },
      undefined,
      (err) => {
        inflight = null;
        reject(err);
      },
    );
  });

  return inflight;
}

export type StarGeometryOptions = {
  depth?: number;
  bevelSize?: number;
  bevelThickness?: number;
  bevelSegments?: number;
  curveSegments?: number;
};

/**
 * Builds an extruded geometry from the loaded star shapes, normalized so
 * the star is centered on origin with ~unit height and ~unit thickness.
 */
export function buildStarGeometry(
  shapes: THREE.Shape[],
  opts: StarGeometryOptions = {},
): THREE.ExtrudeGeometry {
  const {
    depth = 0.35,
    bevelSize = 0.04,
    bevelThickness = 0.06,
    bevelSegments = 4,
    curveSegments = 24,
  } = opts;

  const geom = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelSize,
    bevelThickness,
    bevelSegments,
    curveSegments,
  });

  // SVG is Y-down — flip Y. Then center on X/Y. Then normalize scale so
  // the longest axis is ~2 units.
  const cx = STAR_VIEWBOX_WIDTH / 2;
  const cy = STAR_VIEWBOX_HEIGHT / 2;
  const scale = 2 / STAR_VIEWBOX_HEIGHT;

  const pos = geom.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    pos.setXYZ(i, (x - cx) * scale, -(y - cy) * scale, z - depth / 2);
  }
  pos.needsUpdate = true;

  geom.computeBoundingBox();
  geom.computeBoundingSphere();
  geom.computeVertexNormals();
  return geom;
}
