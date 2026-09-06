import * as THREE from "three";

// Black pentagons on white, placed at the 12 icosahedron vertices — the classic
// minimal soccer-ball motif. Computed in 3D direction space so it maps cleanly
// onto the sphere regardless of equirectangular pole distortion.
// ponytail: pentagons only (no hexagon seam lines) — good enough soccer read;
// upgrade path is a truncated-icosahedron geometry if a crisper ball is wanted.
export function makeSoccerTexture(width = 1024) {
  const height = width / 2;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const phi = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
    [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1],
  ];
  const verts = raw.map(([x, y, z]) => {
    const length = Math.hypot(x, y, z);
    return [x / length, y / length, z / length] as const;
  });
  const bases = verts.map((v) => {
    const up: readonly [number, number, number] = Math.abs(v[1]) > 0.99 ? [1, 0, 0] : [0, 1, 0];
    let t1x = up[1] * v[2] - up[2] * v[1];
    let t1y = up[2] * v[0] - up[0] * v[2];
    let t1z = up[0] * v[1] - up[1] * v[0];
    const length = Math.hypot(t1x, t1y, t1z);
    t1x /= length;
    t1y /= length;
    t1z /= length;
    const t2x = v[1] * t1z - v[2] * t1y;
    const t2y = v[2] * t1x - v[0] * t1z;
    const t2z = v[0] * t1y - v[1] * t1x;
    return { t1: [t1x, t1y, t1z] as const, t2: [t2x, t2y, t2z] as const };
  });

  const apothem = 0.32;
  const segment = (2 * Math.PI) / 5;
  const isDark = (dx: number, dy: number, dz: number) => {
    let best = 0;
    let bestDot = -2;
    for (let i = 0; i < verts.length; i++) {
      const v = verts[i];
      const dot = dx * v[0] + dy * v[1] + dz * v[2];
      if (dot > bestDot) {
        bestDot = dot;
        best = i;
      }
    }
    const angle = Math.acos(Math.min(1, Math.max(-1, bestDot)));
    const basis = bases[best];
    const a = dx * basis.t1[0] + dy * basis.t1[1] + dz * basis.t1[2];
    const c = dx * basis.t2[0] + dy * basis.t2[1] + dz * basis.t2[2];
    const m = (((Math.atan2(c, a) % segment) + segment) % segment) - segment / 2;
    return angle <= apothem / Math.cos(m);
  };

  const image = ctx.createImageData(width, height);
  const data = image.data;
  for (let y = 0; y < height; y++) {
    const theta = (y / height) * Math.PI;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    for (let x = 0; x < width; x++) {
      const longitude = (x / width) * 2 * Math.PI;
      const dark = isDark(
        sinTheta * Math.cos(longitude),
        cosTheta,
        sinTheta * Math.sin(longitude),
      );
      const index = (y * width + x) * 4;
      const value = dark ? 16 : 244;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  if (process.env.NODE_ENV !== "production") {
    console.assert(verts.length === 12, "soccer: expected 12 pentagon centres");
    console.assert(
      isDark(verts[0][0], verts[0][1], verts[0][2]),
      "soccer: pentagon centre should be dark",
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
