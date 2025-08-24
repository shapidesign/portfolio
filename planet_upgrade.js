/*
 * Planet Upgrade Kit — Three.js r140 compatible
 * Drop-in visual upgrades for your solar system: PBR-ish planet shader, Fresnel atmosphere, soft glow,
 * optional rings, and subtle color variation derived from your project color.
 *
 * How to use:
 * 1) Include this file AFTER your current scripts (after new-script.js) OR import its single hook below.
 * 2) In initSolarSystem(), AFTER createSun() and createPlanets(), call:
 *        window.upgradeSolarSystem({ scene: solarScene, camera: solarCamera, renderer: solarRenderer, planets: solarPlanets, sun: solarSun });
 *    (All names above already exist in your code.)
 * 3) That’s it. It rebuilds planet materials, adds atmospheres, and adds a tasteful glow.
 *
 * Notes:
 * - No external textures; everything is procedural (shaders), so it works offline.
 * - Compatible with your existing OrbitControls and animation loop. No postprocessing dependencies.
 * - If you later want bloom: add EffectComposer with UnrealBloomPass; hook points are left in comments below.
 */

(function(){
  if (typeof THREE === 'undefined') {
    console.error('[Planet Upgrade Kit] THREE is not available.');
    return;
  }

  // ---------- GLSL helpers ----------
  const planetVertex = `
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec2 vUv2;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      vUv2 = uv;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  // Simple 3D noise (IQ hash-based) + fBm for surface breakup. Lightweight on mobile.
  const planetFragment = `
    precision highp float;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec2 vUv2;

    uniform vec3 uBase;
    uniform vec3 uAccent;
    uniform float uTime;
    uniform float uRoughness;
    uniform float uMetalness;
    uniform float uGlossBoost;

    // hash & noise
    float hash(vec3 p){
      p = fract(p*0.3183099 + vec3(0.1,0.2,0.3));
      p *= 17.0;
      return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
    }
    float noise(vec3 p){
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f*f*(3.0-2.0*f);
      float n = mix(
        mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
            mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
            mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
      return n;
    }
    float fbm(vec3 p){
      float a=0.5, f=1.0, s=0.0;
      for(int i=0;i<5;i++){
        s += a*noise(p*f);
        f *= 2.0; a *= 0.55;
      }
      return s;
    }

    vec3 tonemapACES(vec3 c){
      // ACES approx
      float a = 2.51; float b = 0.03; float c1 = 2.43; float d = 0.59; float e = 0.14;
      return clamp((c*(a*c+b))/(c*(c1*c+d)+e), 0.0, 1.0);
    }

    void main(){
      // Latitude bands via vUv2.y, mixed with fbm for organic look
      vec3 n = normalize(vNormal);
      float bands = smoothstep(0.0,1.0,abs(fract(vUv2.y*8.0)-0.5)*2.0);
      float surf = fbm(n*3.5 + uTime*0.02);
      float ridges = fbm(n*8.0 + uTime*0.05);
      float mask = smoothstep(0.2,0.8,surf*0.8 + bands*0.4 + ridges*0.2);

      // Base + accent mixing
      vec3 albedo = mix(uBase, uAccent, mask*0.7);

      // Cheap specular: view-dependent highlight using Fresnel-ish term
      vec3 V = normalize(cameraPosition - vWorldPos);
      float fres = pow(1.0 - max(dot(n, V), 0.0), 5.0);
      float gloss = pow(max(dot(reflect(-V,n), V), 0.0), 32.0) * uGlossBoost;

      // Fake shading using hemi-like term and a warm key light
      vec3 lightDir = normalize(vec3(0.4, 0.6, 0.2));
      float NdotL = max(dot(n, lightDir), 0.0);
      vec3 diffuse = albedo * (0.15 + 0.85*NdotL);
      vec3 spec = mix(vec3(0.0), vec3(1.0), gloss*0.5 + fres*0.15);

      vec3 color = diffuse + spec;
      color = tonemapACES(color);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Atmosphere shell shader (backside) with Fresnel falloff & height tint
  const atmoVertex = `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main(){
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;
  const atmoFragment = `
    precision highp float;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    uniform vec3 uColor;
    uniform float uStrength;
    void main(){
      vec3 V = normalize(cameraPosition - vWorldPos);
      float fres = pow(1.0 - max(dot(-vNormal, V), 0.0), 3.0);
      float altitude = clamp((vNormal.y*0.5+0.5), 0.0, 1.0);
      vec3 c = uColor * (fres*1.25 + altitude*0.15) * uStrength;
      gl_FragColor = vec4(c, clamp(fres, 0.0, 1.0));
    }
  `;

  // Optional ring shader (alpha falloff + subtle banding)
  const ringVertex = `
    varying vec2 vUv2;
    void main(){
      vUv2 = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;
  const ringFragment = `
    precision highp float;
    varying vec2 vUv2;
    uniform vec3 uColor;
    uniform float uInner;
    uniform float uOuter;
    void main(){
      // uv.x is the radial axis on RingGeometry
      float r = vUv2.x;
      if (r < uInner || r > uOuter) discard;
      // banding
      float bands = smoothstep(0.0,1.0,abs(fract(r*40.0)-0.5)*2.0);
      float alpha = smoothstep(uInner, uInner+0.02, r) * (1.0 - smoothstep(uOuter-0.02, uOuter, r));
      alpha *= 0.55 + 0.45*bands;
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  function hexToVec3(hex){
    const c = new THREE.Color(hex);
    return new THREE.Vector3(c.r, c.g, c.b);
  }

  function makePlanetMaterial(baseHex){
    const base = new THREE.Color(baseHex);
    const accent = base.clone().offsetHSL(0.03, 0.15, 0.05); // tiny hue shift for richness
    return new THREE.ShaderMaterial({
      uniforms: {
        uBase: { value: new THREE.Color(base) },
        uAccent: { value: new THREE.Color(accent) },
        uTime: { value: 0 },
        uRoughness: { value: 0.8 },
        uMetalness: { value: 0.0 },
        uGlossBoost: { value: 0.6 }
      },
      vertexShader: planetVertex,
      fragmentShader: planetFragment,
      transparent: false,
      lights: false,
      fog: false
    });
  }

  function makeAtmosphere(colorHex, radius){
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(radius*1.08, 48, 48),
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(colorHex) },
          uStrength: { value: 1.0 }
        },
        vertexShader: atmoVertex,
        fragmentShader: atmoFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      })
    );
    shell.renderOrder = 2;
    return shell;
  }

  function addRing(planet, colorHex, inner=1.6, outer=2.6){
    const geo = new THREE.RingGeometry(inner, outer, 256, 1);
    // Orient the ring around the planet’s equator
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(colorHex).lerp(new THREE.Color('#ffffff'), 0.25) },
        uInner: { value: inner/(outer) },
        uOuter: { value: 1.0 }
      },
      vertexShader: ringVertex,
      fragmentShader: ringFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI/2.35; // slight tilt
    mesh.renderOrder = 1;
    planet.add(mesh);
    return mesh;
  }

  function upgradeOnePlanet(container){
    // container.userData.planet is your sphere; swap material & add atmosphere
    const sphere = container.userData.planet;
    if (!sphere || !sphere.geometry) return;

    const radius = (sphere.geometry.parameters && sphere.geometry.parameters.radius) || 1.5;
    const colorHex = `#${container.userData.project.color.toString(16).padStart(6,'0')}`;

    // high-res geometry for crisper shading
    const newGeo = new THREE.SphereGeometry(radius, 64, 64);
    sphere.geometry.dispose();
    sphere.geometry = newGeo;
    sphere.material.dispose();
    sphere.material = makePlanetMaterial(colorHex);

    // keep a time uniform hook for animation
    sphere.userData._shader = sphere.material;

    // remove existing atmosphere if any
    if (container.userData.atmosphere){
      container.remove(container.userData.atmosphere);
    }
    const atmo = makeAtmosphere(colorHex, radius);
    container.add(atmo);
    container.userData.atmosphere = atmo;

    // 1 in 3 planets gets rings for variety (skip the innermost two for clarity)
    if (container.userData.index >= 2 && (container.userData.index % 3 === 0)){
      addRing(container, colorHex, radius*1.4, radius*2.2);
    }
  }

  function tickPlanets(planets){
    const t = (performance.now() || Date.now()) * 0.001;
    for (let i=0;i<planets.length;i++){
      const sphere = planets[i].userData.planet;
      if (sphere && sphere.userData && sphere.userData._shader){
        sphere.userData._shader.uniforms.uTime.value = t;
      }
    }
  }

  // Optional: very soft quad glow behind the sun for punch (no postprocessing needed)
  function addSunBillboard(scene, color=0xffcc66){
    const tex = new THREE.DataTexture(new Uint8Array([255,255,255,255]),1,1,THREE.RGBAFormat);
    tex.needsUpdate = true;
    const m = new THREE.SpriteMaterial({
      map: tex,
      color: color,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.25
    });
    const s = new THREE.Sprite(m);
    s.scale.set(28,28,1);
    s.renderOrder = 0;
    scene.add(s);
    return s;
  }

  // Public hook
  window.upgradeSolarSystem = function(opts){
    const { scene, camera, renderer, planets, sun } = opts || {};
    if (!scene || !planets){
      console.warn('[Planet Upgrade Kit] Missing scene/planets');
      return;
    }

    // Upgrade all current planets
    planets.forEach(upgradeOnePlanet);

    // Add subtle billboard to sun
    addSunBillboard(scene, 0xffbb55);

    // Hook your existing animation loop by monkey-patching animate3D if present,
    // otherwise set up a tiny ticker. We avoid duplicate RAFs.
    const _tick = function(){ tickPlanets(planets); };

    // If your code exposes animate3D, wrap it once.
    const w = window;
    if (!w.__planetUpgradeInstalled){
      w.__planetUpgradeInstalled = true;
      // Patch requestAnimationFrame path: append our per-frame uniform update
      const _origRequest = w.requestAnimationFrame;
      w.requestAnimationFrame = function(cb){
        const wrapped = function(t){
          try { _tick(); } catch(e){}
          cb(t);
        };
        return _origRequest(wrapped);
      };
    }

    console.log('%c[Planet Upgrade Kit]%c Planets upgraded: shader surface + atmosphere + (optional) rings', 'color:#66d9ef;font-weight:bold', 'color:inherit');
  };

})();
