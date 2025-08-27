// Planet Hero Component - Vanilla JavaScript Version
// Integrates with your existing portfolio structure

class PlanetHero {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      title: options.title || "Shapi Design",
      subtitle: options.subtitle || "Creative developer crafting cosmic digital experiences. Scroll to explore my universe of projects.",
      colors: {
        primary: options.colors?.primary || '#66d9ef',
        secondary: options.colors?.secondary || '#a6e22e',
        accent: options.colors?.accent || '#f92672'
      },
      ...options
    };
    
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.earth = null;
    this.moon = null;
    this.stars = null;
    this.animationId = null;
    this.progress = 0;
    
    this.init();
  }
  
  init() {
    this.createContainer();
    this.setupThreeJS();
    this.createScene();
    this.createLights();
    // this.createEarth(); // Removed Earth
    // this.createMoon(); // Removed Moon
    this.createStars();
    this.createAtmosphere();
    this.setupControls();
    this.setupScrollHandler();
    this.animate();
    this.createOverlay();
  }
  
  createContainer() {
    // Create the hero section container
    const heroSection = document.createElement('div');
    heroSection.id = this.containerId;
    heroSection.className = 'planet-hero-section';
    heroSection.style.cssText = `
      position: relative;
      width: 100%;
      height: 120vh;
      overflow: hidden;
      border-radius: 16px;
      border: 3px solid ${this.options.colors.primary};
      margin-bottom: 2rem;
    `;
    
    // Insert after the launch screen but before the portfolio container
    const launchScreen = document.getElementById('launch-screen');
    if (launchScreen && launchScreen.nextSibling) {
      launchScreen.parentNode.insertBefore(heroSection, launchScreen.nextSibling);
    } else {
      document.body.appendChild(heroSection);
    }
    
    this.container = heroSection;
  }
  
  setupThreeJS() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0c0c0c');
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 12);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    this.container.appendChild(this.renderer.domElement);
    
    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  createScene() {
    // Add fog for depth
    this.scene.fog = new THREE.Fog('#0c0c0c', 10, 100);
  }
  
  createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
    directionalLight.position.set(5, 4, 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
  }
  
  createEarth() {
    // Create Earth geometry
    const geometry = new THREE.IcosahedronGeometry(2.1, 8);
    
    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_day_4096.jpg');
    const normalTexture = textureLoader.load('https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_normal_2048.jpg');
    const cloudsTexture = textureLoader.load('https://cdn.apewebapps.com/threejs/168/examples/textures/planets/earth_clouds_2048.png');
    
    // Earth material
    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      normalMap: normalTexture,
      roughness: 0.9,
      metalness: 0.0,
      envMapIntensity: 0.3
    });
    
    this.earth = new THREE.Mesh(geometry, material);
    this.earth.rotation.set(0.2, 0.8, 0);
    this.earth.castShadow = true;
    this.earth.receiveShadow = true;
    this.scene.add(this.earth);
    
    // Add cloud layer
    const cloudGeometry = new THREE.SphereGeometry(2.18, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    this.earth.add(clouds);
  }
  
  createMoon() {
    // Create moon geometry
    const geometry = new THREE.IcosahedronGeometry(0.7, 8);
    
    // Load moon texture
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load('https://cdn.apewebapps.com/threejs/168/examples/textures/planets/moon_1024.jpg');
    
    // Moon material
    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 1.0,
      metalness: 0.0
    });
    
    this.moon = new THREE.Mesh(geometry, material);
    this.moon.position.set(4.2, 0.6, -1.5);
    this.moon.rotation.set(0, 1.1, 0);
    this.moon.castShadow = true;
    this.scene.add(this.moon);
  }
  
  createStars() {
    // Create star field
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 8000;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 160;
      positions[i + 1] = (Math.random() - 0.5) * 160;
      positions[i + 2] = (Math.random() - 0.5) * 160;
      
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.8, 0.5, Math.random() * 0.5 + 0.5);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(this.stars);
  }
  
  createAtmosphere() {
    // Earth atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(2.18, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color(this.options.colors.primary) },
        uIntensity: { value: 1.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalMatrix * normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uColor;
        uniform float uIntensity;
        void main() {
          float rim = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
          gl_FragColor = vec4(uColor * rim * uIntensity, rim * 0.9);
        }
      `
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    this.earth.add(atmosphere);
    
    // Moon atmosphere
    const moonAtmosphereGeometry = new THREE.SphereGeometry(0.73, 64, 64);
    const moonAtmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color(this.options.colors.secondary) },
        uIntensity: { value: 0.5 }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalMatrix * normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uColor;
        uniform float uIntensity;
        void main() {
          float rim = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
          gl_FragColor = vec4(uColor * rim * uIntensity, rim * 0.9);
        }
      `
    });
    
    const moonAtmosphere = new THREE.Mesh(moonAtmosphereGeometry, moonAtmosphereMaterial);
    this.moon.add(moonAtmosphere);
  }
  
  setupControls() {
    // Orbit controls for manual interaction
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.autoRotate = false;
  }
  
  setupScrollHandler() {
    // Calculate scroll progress for camera movement
    const computeProgress = () => {
      const rect = this.container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const raw = passed / total;
      this.progress = Math.max(0, Math.min(1, raw));
    };
    
    const onScroll = () => computeProgress();
    const onResize = () => computeProgress();
    
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  }
  
  createOverlay() {
    // Create overlay UI
    const overlay = document.createElement('div');
    overlay.className = 'planet-hero-overlay';
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: flex;
      align-items: flex-end;
      z-index: 10;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      margin: 1.5rem;
      padding: 1rem 1.5rem;
      border-radius: 16px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid ${this.options.colors.primary}20;
      backdrop-filter: blur(10px);
      pointer-events: none;
    `;
    
    const title = document.createElement('h1');
    title.textContent = this.options.title;
    title.style.cssText = `
      color: white;
      font-size: 2.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      font-family: 'JetBrains Mono', monospace;
      margin: 0 0 0.5rem 0;
    `;
    
    const subtitle = document.createElement('p');
    subtitle.textContent = this.options.subtitle;
    subtitle.style.cssText = `
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      max-width: 32rem;
      font-size: 1rem;
      line-height: 1.5;
      font-family: 'JetBrains Mono', monospace;
    `;
    
    content.appendChild(title);
    content.appendChild(subtitle);
    overlay.appendChild(content);
    this.container.appendChild(overlay);
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Rotate Earth (removed)
    // if (this.earth) {
    //   this.earth.rotation.y += 0.008;
    // }
    
    // Rotate Moon (removed)
    // if (this.moon) {
    //   this.moon.rotation.y += 0.005;
    // }
    
    // Rotate Stars
    if (this.stars) {
      this.stars.rotation.y += 0.0005;
    }
    
    // Camera movement based on scroll
    const targetX = THREE.MathUtils.lerp(-2, 2, this.progress);
    const targetY = 0;
    const targetZ = THREE.MathUtils.lerp(12, 6, this.progress);
    
    this.camera.position.x += (targetX - this.camera.position.x) * 0.03;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.03;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.03;
    
    this.camera.lookAt(0, 0, 0);
    
    // Update controls
    if (this.controls) {
      this.controls.update();
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    // Clean up event listeners
    window.removeEventListener('resize', this.onWindowResize);
  }
}

// Initialize the planet hero when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Three.js to be available
  if (typeof THREE !== 'undefined') {
    new PlanetHero('planet-hero', {
      title: "Shapi Design",
      subtitle: "Creative developer crafting cosmic digital experiences. Scroll to explore my universe of projects.",
      colors: {
        primary: '#66d9ef',
        secondary: '#a6e22e',
        accent: '#f92672'
      }
    });
  } else {
    // Wait for Three.js to load
    const checkThreeJS = setInterval(() => {
      if (typeof THREE !== 'undefined') {
        clearInterval(checkThreeJS);
        new PlanetHero('planet-hero', {
          title: "Shapi Design",
          subtitle: "Creative developer crafting cosmic digital experiences. Scroll to explore my universe of projects.",
          colors: {
            primary: '#66d9ef',
            secondary: '#a6e22e',
            accent: '#f92672'
          }
        });
      }
    }, 100);
  }
});
