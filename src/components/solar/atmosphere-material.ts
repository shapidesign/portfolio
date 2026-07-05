import * as THREE from "three";

/**
 * Fresnel-style rim glow rendered on the BackSide of a sphere slightly larger
 * than the body it wraps. The rim brightens toward grazing angles, so the
 * planet/sun reads as sitting inside a glowing atmosphere. Shared by Planet
 * and Sun.
 *
 * Uniforms:
 *  - uColor: glow tint
 *  - uIntensity: overall brightness multiplier (animate for hover/pulse)
 *  - uPower: fresnel falloff exponent (higher = thinner rim)
 */
export function makeAtmosphereMaterial(color: string | THREE.Color, intensity = 1, power = 3) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uPower: { value: power },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uPower;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        // BackSide: normals face away from camera, so dot is the rim signal.
        float rim = pow(clamp(dot(normalize(vNormal), normalize(vViewDir)) + 1.0, 0.0, 1.0), uPower);
        gl_FragColor = vec4(uColor, 1.0) * rim * uIntensity;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}
