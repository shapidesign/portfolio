

// === Portfolio State ===
let portfolioState = 'launch'; // launch, space
let solarScene, solarCamera, solarRenderer, solarControls;
let solarPlanets = [];
let solarSun = null;
let hoveredPlanet = null;
let visitedProjects = new Set();

// === Project Data ===
const projectData = [
  {
    title: "AFL Israel Designs",
    description: "Complete branding and design package for AFL Israel, including posters, countdown graphics, and promotional materials. This project showcases my ability to create cohesive visual systems that capture the energy and excitement of sports marketing.",
    tags: ["Branding", "Sports Marketing", "Print Design"],
    images: ["project1/Artboard 1.png", "project1/winter league english 2.png", "project1/POSTER12.png", "project1/Artboard 36.png", "project1/Artboard 3 copy.png", "project1/COUNTDOWN 9.png", "project1/COUNTDOWN 16.png", "project1/general.png"],
    color: 0xf92672
  },
  {
    title: "The Bible: Remastered",
    description: "Everyone own the bible in their home, but it's so ugly and generic - always with that blue or brown leathery cover. So why shouldn't the top selling book in the world get a unique design? I created several modern designs for the classic bible, giving it a fresh outfit, and I hope people won't be afraid to place it as a coffee table book now.",
    tags: ["Book Design", "Typography", "Modern Design", "Print Design"],
    images: ["project2/SHAPES.png", "project2/modrian.png", "project2/חושן.png", "project2/JAPANESE WAVES.png", "project2/ABSTRACT.png", "project2/NOODLES.png", "project2/HITS.png", "project2/COLORBLIND.png", "project2/WEIRD.png", "project2/SWIRLY.png", "project2/BAUHAUS SHAPES.png", "project2/BAUHAUS LINES.png", "project2/TORAH2 2.png", "project2/סיפורי התנך.png", "project2/TORAH.png"],
    color: 0xae81ff
  },
  {
    title: "Generative Poster Series",
    description: "Algorithmic design exploration using p5.js with modular repetition and dynamic color systems. Each poster is generated through code, blending randomness with structured design principles.",
    tags: ["p5.js", "Generative Art", "Print Design"],
    images: ["kiwi.png", "nature.jpg", "kiwi.png"],
    color: 0x66d9ef
  },
  {
    title: "Hebrew Glitch Typography",
    description: "Experimental typography project exploring ASCII manipulation with Hebrew letterforms and digital aesthetics, pushing the boundaries of traditional typography.",
    tags: ["Typography", "Hebrew", "Digital Art"],
    images: ["kiwi.png", "nature.jpg"],
    color: 0xa6e22e
  },
  {
    title: "Interactive Portfolio",
    description: "This very website - a canvas-based portfolio with particle systems, interactive typography, and explosive animations built with HTML5 Canvas and JavaScript.",
    tags: ["Web Development", "Canvas API", "Interactive Design"],
    images: ["kiwi.png", "nature.jpg"],
    color: 0xfd971f
  },
  {
    title: "Motion Graphics Exploration",
    description: "Learning motion design principles through experimental animations and kinetic typography, exploring the intersection of time and visual design.",
    tags: ["Motion Design", "Animation", "Learning"],
    images: ["kiwi.png", "nature.jpg"],
    color: 0xae81ff
  }
];

// === Star Field Background ===
const starCanvas = document.getElementById('star-canvas');
const starCtx = starCanvas.getContext('2d');
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

// === Earth Rotation Animation ===
let earthAnimationInterval = null;
const earthFrames = 12; // Number of earth rotation frames
let currentEarthFrame = 1;

const stars = [];
const starCount = 2000;
const interactionRadius = 400;
let mouseX = null;
let mouseY = null;
let prevMouseX = null;
let prevMouseY = null;
let mouseVelocityX = 0;
let mouseVelocityY = 0;
const timeStart = Date.now();

// Create interactive star field
for (let i = 0; i < starCount; i++) {
  stars.push({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    originalX: Math.random() * starCanvas.width,
    originalY: Math.random() * starCanvas.height,
    ragX: 0,
    dragY: 0,
    inertia: Math.random() * 0.3 + 0.7,
    size: Math.random() * 2 + 1,
    brightness: Math.random() * 0.6 + 0.4,
    twinkleSpeed: Math.random() * 0.003 + 0.001,
    twinkleOffset: Math.random() * Math.PI * 2
  });
}

function animateStarField() {
  const time = Date.now();
  
  // Only fill background when NOT on launch screen (since launch screen has its own background)
  if (portfolioState !== 'launch') {
    starCtx.fillStyle = '#050301';
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
  } else {
    // Clear the canvas for launch screen (let launch background show through)
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  }

  stars.forEach(star => {
    // Twinkling effect
    const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
    let targetX = star.originalX;
    let targetY = star.originalY;
    let brightness = star.brightness * twinkle;

    // Mouse interaction
    if (mouseX !== null && mouseY !== null) {
      const dx = star.originalX - mouseX;
      const dy = star.originalY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < interactionRadius) {
        const influence = Math.pow(1 - (distance / interactionRadius), 2);
        const angle = Math.atan2(dy, dx);
        
        targetX = star.originalX + Math.cos(angle) * 30 * influence;
        targetY = star.originalY + Math.sin(angle) * 30 * influence;
        brightness = Math.min(1, brightness * (1 + influence));
      }
    }

    // Smooth movement
    star.x += (targetX - star.x) * 0.1;
    star.y += (targetY - star.y) * 0.1;

    // Draw star
    starCtx.fillStyle = `rgba(200, 200, 255, ${brightness})`;
    starCtx.fillRect(star.x, star.y, star.size, star.size);
  });

  requestAnimationFrame(animateStarField);
}

// Mouse tracking for star field
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouseX = null;
  mouseY = null;
});

// === Firework Effects ===
const fireworkCanvas = document.getElementById('firework-canvas');
const fireworkCtx = fireworkCanvas.getContext('2d');
fireworkCanvas.width = window.innerWidth;
fireworkCanvas.height = window.innerHeight;

let particles = [];
const monokaiColors = ['#f92672', '#66d9ef', '#fd971f', '#a6e22e', '#ae81ff'];

function explode(x, y, color = null, power = 50) {
  const asciiVariants = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*',
    '█▓▒░▒▓█▒░▓█',
    '@@@!!!###$%%%^^^&&&***|||',
    'אבגדהוזחטיכלמםנןסעפףצץקרשת'
  ];
  
  const characters = asciiVariants[Math.floor(Math.random() * asciiVariants.length)];
  const chosenColor = color || monokaiColors[Math.floor(Math.random() * monokaiColors.length)];

  for (let i = 0; i < power; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 2;
    const size = Math.random() * 0.4 + 0.6;
    
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      char: characters[Math.floor(Math.random() * characters.length)],
      color: chosenColor,
      life: 1,
      decay: Math.random() * 0.01 + 0.008,
      size: size,
      gravity: Math.random() * 0.05 + 0.02,
      friction: 0.98
    });
  }
}

function updateFireworks() {
  fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
  
  // Fix: Filter particles by life instead of alpha (since alpha isn't set initially)
  particles = particles.filter(p => p.life > 0);
  
  particles.forEach(p => {
    // Physics
    p.vx *= p.friction;
    p.vy = p.vy * p.friction + p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    
    // Life cycle
    p.life -= p.decay;
    
    // Fix: Set alpha based on life (this was missing!)
    p.alpha = Math.max(0, p.life);
    
    // Render - Add debugging
    if (p.alpha > 0) {
      fireworkCtx.font = `${Math.round(p.size * 16)}px monospace`;
      fireworkCtx.fillStyle = p.color;
      fireworkCtx.globalAlpha = p.alpha;
      fireworkCtx.fillText(p.char, p.x, p.y);
    }
  });
  
  fireworkCtx.globalAlpha = 1;
  requestAnimationFrame(updateFireworks);
}

// === Spaceship Cursor ===
const cursorCanvas = document.getElementById('cursor-canvas');
const cursorCtx = cursorCanvas.getContext('2d');
cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let prevCursorX = cursorX;
let prevCursorY = cursorY;
let cursorAngle = 0;
let isMoving = false;
let moveTimer = null;
let movementAlpha = 0; // 0: idle, 1: fire (moving)

// Load spaceship images
const spaceshipIdle = new Image();
spaceshipIdle.src = 'spaceship_idle.png';

const spaceshipFire = new Image();
spaceshipFire.src = 'spaceship_fire.png';

window.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;

  const dx = cursorX - prevCursorX;
  const dy = cursorY - prevCursorY;
  const speed = Math.hypot(dx, dy);

  if (speed > 1) {
    if (moveTimer) clearTimeout(moveTimer);
    isMoving = true;
    moveTimer = setTimeout(() => {
      isMoving = false;
    }, 150);
  }
});

function drawCursor() {
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  
  // Calculate angle based on movement direction
  const dx = cursorX - prevCursorX;
  const dy = cursorY - prevCursorY;
  if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
    const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
    cursorAngle += (targetAngle - cursorAngle) * 0.1;
  }
  
  movementAlpha += ((isMoving ? 1 : 0) - movementAlpha) * 0.1;
  
  prevCursorX = cursorX;
  prevCursorY = cursorY;

  const height = 32;

  cursorCtx.save();
  cursorCtx.translate(cursorX, cursorY);
  cursorCtx.rotate(cursorAngle);

  // Draw spaceship based on images or fallback to drawn version
  if (spaceshipIdle.complete && spaceshipIdle.naturalWidth !== 0 &&
      spaceshipFire.complete && spaceshipFire.naturalWidth !== 0) {
    
    const idleAspect = spaceshipIdle.width / spaceshipIdle.height;
    const fireAspect = spaceshipFire.width / spaceshipFire.height;
    const widthIdle = height * idleAspect;
    const widthFire = height * fireAspect;

    // Draw idle spaceship
    cursorCtx.globalAlpha = 1 - movementAlpha;
    cursorCtx.drawImage(spaceshipIdle, -widthIdle / 2, -height / 2, widthIdle, height);

    // Draw fire spaceship
    cursorCtx.globalAlpha = movementAlpha;
    cursorCtx.drawImage(spaceshipFire, -widthFire / 2, -height / 2, widthFire, height);

    cursorCtx.globalAlpha = 1;
  } else {
    // Fallback: draw simple spaceship
    cursorCtx.fillStyle = '#66d9ef';
    cursorCtx.beginPath();
    cursorCtx.moveTo(0, -height/2);
    cursorCtx.lineTo(-height/4, height/2);
    cursorCtx.lineTo(0, height/3);
    cursorCtx.lineTo(height/4, height/2);
    cursorCtx.closePath();
    cursorCtx.fill();
    
    // Fire effect when moving
    if (isMoving) {
      cursorCtx.fillStyle = '#fd971f';
      cursorCtx.globalAlpha = movementAlpha;
      cursorCtx.beginPath();
      cursorCtx.moveTo(-height/6, height/2);
      cursorCtx.lineTo(0, height/2 + height/3);
      cursorCtx.lineTo(height/6, height/2);
      cursorCtx.closePath();
      cursorCtx.fill();
      cursorCtx.globalAlpha = 1;
    }
    
    // Glow effect
    cursorCtx.shadowColor = '#66d9ef';
    cursorCtx.shadowBlur = 8;
    cursorCtx.fill();
    cursorCtx.shadowBlur = 0;
  }

  cursorCtx.restore();
  
  requestAnimationFrame(drawCursor);
}

// === Launch Sequence ===
function startEarthRotation() {
  if (earthAnimationInterval) {
    clearInterval(earthAnimationInterval);
  }
  
  earthAnimationInterval = setInterval(() => {
    const earthImg = document.getElementById('earth');
    if (earthImg) {
      // Simple infinite forward sequence
      currentEarthFrame = (currentEarthFrame % earthFrames) + 1;
      earthImg.src = `earth-rotate/${currentEarthFrame}.png`;
    }
  }, 100); // Change frame every 100ms for faster rotation
}

function stopEarthRotation() {
  if (earthAnimationInterval) {
    clearInterval(earthAnimationInterval);
    earthAnimationInterval = null;
  }
}

function initLaunchScreen() {
  console.log('🚀 Initializing launch screen...');
  
  // Start earth rotation immediately
  startEarthRotation();
  
  // Wait for elements to be available
  const waitForElements = () => {
    const launchBtn = document.getElementById('launch-btn');
    const spaceship = document.getElementById('spaceship');
    const launchScreen = document.getElementById('launch-screen');
    const skyOverlay = document.getElementById('sky-overlay');
    const portfolioContainer = document.getElementById('portfolio-container');

    console.log('Elements found:', {
      launchBtn: !!launchBtn,
      spaceship: !!spaceship,
      launchScreen: !!launchScreen,
      skyOverlay: !!skyOverlay,
      portfolioContainer: !!portfolioContainer
    });

    if (!launchBtn) {
      console.error('❌ Launch button not found! Retrying in 100ms...');
      setTimeout(waitForElements, 100);
      return;
    }

    console.log('✅ All launch elements found, setting up event listener');

    function launchSequence() {
      console.log('🚀 Launch sequence triggered!');
      launchBtn.style.display = 'none';
      
      // Stop earth rotation and start launch animation
      stopEarthRotation();
      
      const earthImg = document.getElementById('earth');
      if (earthImg) {
        earthImg.classList.add('launching-earth');
        // Wait for animation to finish (1.2s), then continue
        setTimeout(() => {
          // Trigger explosion at earth location
          explode(window.innerWidth / 2, window.innerHeight / 2, '#a6e22e', 150);
          // Open the sky
          setTimeout(() => {
            if (skyOverlay) {
              skyOverlay.classList.add('opening');
            }
          }, 500);
          // Hide launch screen and show portfolio
          setTimeout(() => {
            if (launchScreen) {
              launchScreen.classList.add('hidden');
            }
            if (portfolioContainer) {
              portfolioContainer.classList.add('visible');
              const contactPhone = document.getElementById('contact-phone');
              if (contactPhone) contactPhone.style.display = 'flex';
            }
            portfolioState = 'space';
            initSolarSystem();
          }, 1200);
        }, 1200);
      } else {
        // fallback: original sequence
        setTimeout(() => {
          explode(window.innerWidth / 2, window.innerHeight / 2, '#a6e22e', 150);
        }, 1000);
        setTimeout(() => {
          if (skyOverlay) {
            skyOverlay.classList.add('opening');
          }
        }, 1500);
        setTimeout(() => {
          if (launchScreen) {
            launchScreen.classList.add('hidden');
          }
          if (portfolioContainer) {
            portfolioContainer.classList.add('visible');
            const contactPhone = document.getElementById('contact-phone');
            if (contactPhone) contactPhone.style.display = 'flex';
          }
          portfolioState = 'space';
          initSolarSystem();
        }, 3000);
      }
    }

    // SIMPLIFIED CLICK HANDLER
    launchBtn.onclick = function(e) {
      console.log('🎯 Button onclick fired!');
      e.preventDefault();
      e.stopPropagation();
      launchSequence();
    };

    // Also try addEventListener as backup
    launchBtn.addEventListener('click', function(e) {
      console.log('🎯 Button addEventListener fired!');
      e.preventDefault();
      e.stopPropagation();
      launchSequence();
    });

    // Debug: Add mousedown handler
    launchBtn.addEventListener('mousedown', function(e) {
      console.log('🎯 Button mousedown fired!');
    });
    
    // SPACEBAR HANDLER
    document.addEventListener('keydown', function keyLaunchHandler(e) {
      if (portfolioState === 'launch' && e.key === ' ') {
        e.preventDefault();
        console.log('🚀 Spacebar launch triggered!');
        launchSequence();
        document.removeEventListener('keydown', keyLaunchHandler);
      }
    });

    // TEST: Make button super obvious it's clickable
    launchBtn.style.cursor = 'pointer';
    launchBtn.title = 'Click me to launch!';
  };

  waitForElements();
}

// === Backup manual launch function ===
window.startLaunch = function() {
  console.log('🚀 Manual launch triggered!');
  
  const launchScreen = document.getElementById('launch-screen');
  const portfolioContainer = document.getElementById('portfolio-container');
  
  if (launchScreen) {
    launchScreen.style.display = 'none';
  }
  if (portfolioContainer) {
    portfolioContainer.style.opacity = '1';
    portfolioContainer.classList.add('visible');
    // Show contact phone icon after launch
    const contactPhone = document.getElementById('contact-phone');
    if (contactPhone) contactPhone.style.display = 'flex';
  }
  
  portfolioState = 'space';
  
  // Small delay to ensure elements are ready
  setTimeout(() => {
    initSolarSystem();
  }, 100);
};

// === 3D Solar System ===
function initSolarSystem() {
  // Prevent multiple initializations
  if (solarScene) {
    console.log('Solar system already initialized');
    return;
  }
  
  if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded');
    return;
  }

  const container = document.getElementById('solar-system-canvas');
  
  // Scene setup
  solarScene = new THREE.Scene();
  
  // Camera
  solarCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  solarCamera.position.set(0, 20, 30);
  
  // Renderer
  solarRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  solarRenderer.setSize(window.innerWidth, window.innerHeight);
  solarRenderer.setClearColor(0x000000, 0);
  container.appendChild(solarRenderer.domElement);
  
 // Controls - Fixed to work like NASA's site
if (THREE.OrbitControls) {
  solarControls = new THREE.OrbitControls(solarCamera, solarRenderer.domElement);
  
  // Enable smooth 3D movement like NASA site
  solarControls.enableDamping = true;
  solarControls.dampingFactor = 0.12;
  
  // Mouse controls
  solarControls.enableRotate = true;        // Left click + drag to rotate
  solarControls.enableZoom = true;          // Mouse wheel to zoom
  solarControls.enablePan = true;           // Right click + drag to pan
  
  // Rotation settings
  solarControls.rotateSpeed = 0.5;
  solarControls.autoRotate = false;         // Disable auto-rotation for manual control
  
  // Zoom settings
  solarControls.zoomSpeed = 1.0;
  solarControls.minDistance = 10;
  solarControls.maxDistance = 150;
  
  // Pan settings
  solarControls.panSpeed = 0.8;
  solarControls.screenSpacePanning = false; // Keep panning in world space
  
  // Vertical rotation limits (optional)
  solarControls.maxPolarAngle = Math.PI; // Allow full vertical rotation
  solarControls.minPolarAngle = 0;
  
  // Make sure controls are enabled
  solarControls.enabled = true;
  
  console.log('✅ OrbitControls enabled - Left click+drag to rotate, wheel to zoom, right click+drag to pan');
} else {
  console.error('❌ THREE.OrbitControls not available');
}

  // Turn off auto-rotation so users have full manual control
solarControls.autoRotate = false;

// Add this after creating solarControls to test
solarControls.addEventListener('change', () => {
  console.log('🎮 Camera moved:', solarCamera.position);
});
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  solarScene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0xffaa00, 2, 200);
  pointLight.position.set(0, 0, 0);
  solarScene.add(pointLight);
  
  createSun();
  createPlanets();
  setupInteractions();
  createPlanetGrid();
  
  animate3D();
}

function createSun() {
  const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xffaa00,
    emissiveIntensity: 0.6
  });
  
  solarSun = new THREE.Mesh(sunGeometry, sunMaterial);
  
  // Add corona effect
  const coronaGeometry = new THREE.SphereGeometry(3.5, 16, 16);
  const coronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
  
  const sunGroup = new THREE.Object3D();
  sunGroup.add(solarSun);
  sunGroup.add(corona);
  sunGroup.userData = { isSun: true };
  
  solarScene.add(sunGroup);
}

function createPlanets() {
const orbits = [8, 12, 18, 24, 30];

  projectData.forEach((project, i) => {
    const planetGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    
    // Create gradient material for more realistic planets
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: project.color,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
      emissive: new THREE.Color(project.color).multiplyScalar(0.1)
    });
    
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.8, 16, 16);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: project.color,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    
    // Create orbit container
    const orbitContainer = new THREE.Object3D();
    orbitContainer.add(planet);
    orbitContainer.add(atmosphere);
    
    // Store planet data
    let speed = 0.002 + i * 0.0005;
    let baseSpeed = 0.002 + i * 0.002;
    if (i >= projectData.length - 2) { // outer two planets
      speed *= 0.5;
      baseSpeed *= 0.5;
    }
    orbitContainer.userData = {
      index: i,
      project: project,
      planet: planet,
      atmosphere: atmosphere,
      angle: (i / projectData.length) * Math.PI * 2,
      radius: orbits[i],
      speed: speed,
      baseSpeed: baseSpeed,
      isHovered: false
    };
    
    solarScene.add(orbitContainer);
    solarPlanets.push(orbitContainer);
  });
}

function createPlanetGrid() {
  const grid = document.getElementById('planet-grid');
  
  projectData.forEach((project, i) => {
    const dot = document.createElement('div');
    dot.className = 'planet-dot';
    dot.style.borderColor = `#${project.color.toString(16).padStart(6, '0')}`;
    dot.style.color = `#${project.color.toString(16).padStart(6, '0')}`;
    dot.title = project.title;
    
    dot.addEventListener('click', () => {
      focusOnPlanet(i);
    });
    
    grid.appendChild(dot);
  });
}

function setupInteractions() {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  function updateMouse(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  
  window.addEventListener('mousemove', updateMouse);
  
  window.addEventListener('click', () => {
    if (hoveredPlanet) {
      // Zoom into planet with smooth camera animation
      zoomToPlanet(hoveredPlanet);
    } else if (raycaster.intersectObject(solarSun).length > 0) {
      // NEW: Zoom to sun first, then show modal
      zoomToSun();
    }
  });
  
  // Hover detection
  function checkHover() {
    if (!solarCamera) return;
    
    raycaster.setFromCamera(mouse, solarCamera);
    
    // Check sun intersection
    const sunIntersects = raycaster.intersectObject(solarSun);
    if (sunIntersects.length > 0) {
      solarRenderer.domElement.style.cursor = 'pointer';
    }
    
    // Check planet intersections
    const planetMeshes = solarPlanets.map(p => p.userData.planet);
    const intersects = raycaster.intersectObjects(planetMeshes);
    
    // Reset all planets
    solarPlanets.forEach(container => {
      container.userData.isHovered = false;
      container.userData.speed = container.userData.baseSpeed;
      container.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      container.userData.planet.material.emissive.setHex(container.userData.project.color).multiplyScalar(0.1);
      container.userData.atmosphere.material.opacity = 0.2;
    });
    
    hoveredPlanet = null;
    const hud = document.getElementById('planet-hud');
    hud.classList.remove('visible', 'planet-hud-floating');
    hud.style.left = '';
    hud.style.top = '';
    hud.style.transform = '';
    const planetName = document.getElementById('planet-name');
    if (planetName) planetName.textContent = '';
    
    if (intersects.length > 0) {
      const planetMesh = intersects[0].object;
      const container = solarPlanets.find(p => p.userData.planet === planetMesh);
      
      if (container) {
        hoveredPlanet = container;
        container.userData.isHovered = true;
        container.userData.speed = 0; // Stop rotation
        container.scale.lerp(new THREE.Vector3(1.4, 1.4, 1.4), 0.2);
        
        // Enhanced hover effects
        container.userData.planet.material.emissive.setHex(container.userData.project.color).multiplyScalar(0.3);
        container.userData.atmosphere.material.opacity = 0.4;
        
        // Show planet HUD above the planet
        const planetWorldPos = container.position.clone();
        const vector = planetWorldPos.project(solarCamera);
        const x = (vector.x + 1) / 2 * window.innerWidth;
        const y = (-vector.y + 1) / 2 * window.innerHeight;
        hud.classList.add('visible', 'planet-hud-floating');
        hud.style.left = `${x}px`;
        hud.style.top = `${y - 110}px`; // offset more so it doesn't block the planet
        hud.style.transform = 'translate(-50%, -100%)';
        const planetName = document.getElementById('planet-name');
        planetName.textContent = `🪐 ${container.userData.project.title}`;
        // Set HUD border and text color to planet color
        const accent = `#${container.userData.project.color.toString(16).padStart(6, '0')}`;
        hud.style.borderColor = accent;
        planetName.style.color = accent;
      }
    }
    
    requestAnimationFrame(checkHover);
  }
  
  checkHover();
}

function zoomToPlanet(container) {
  if (!container || !solarControls) return;
  
  // Disable controls during animation
  solarControls.enabled = false;
  
  // Get planet's exact current position using its orbital data
  const planetData = container.userData;
  const planetWorldPos = new THREE.Vector3(
    Math.cos(planetData.angle) * planetData.radius,
    0,
    Math.sin(planetData.angle) * planetData.radius
  );
  
  console.log('🎯 Planet:', planetData.project.title, 'at position:', planetWorldPos);
  
  // Calculate optimal camera position for this specific planet
  const cameraDistance = 12;
  const cameraHeight = 3;
  
  // Create camera position that orbits around the planet
  const cameraAngle = planetData.angle + Math.PI * 0.3;
  const targetPosition = new THREE.Vector3(
    planetWorldPos.x + Math.cos(cameraAngle) * cameraDistance,
    planetWorldPos.y + cameraHeight,
    planetWorldPos.z + Math.sin(cameraAngle) * cameraDistance
  );
  
  const startPosition = solarCamera.position.clone();
  const startTarget = solarControls.target.clone();
  const startTime = Date.now();
  const duration = 2500;
  
  function animateZoom() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing with more dramatic curve
    const eased = 1 - Math.pow(1 - progress, 3);
    
    // Update planet position during animation (since planets are moving)
    const currentPlanetPos = new THREE.Vector3(
      Math.cos(planetData.angle) * planetData.radius,
      0,
      Math.sin(planetData.angle) * planetData.radius
    );
    
    // Update camera target position accordingly
    const currentCameraAngle = planetData.angle + Math.PI * 0.3;
    const currentTargetPos = new THREE.Vector3(
      currentPlanetPos.x + Math.cos(currentCameraAngle) * cameraDistance,
      currentPlanetPos.y + cameraHeight,
      currentPlanetPos.z + Math.sin(currentCameraAngle) * cameraDistance
    );
    
    // Animate camera position
    solarCamera.position.lerpVectors(startPosition, currentTargetPos, eased);
    
    // Animate camera look-at target
    const currentLookAt = new THREE.Vector3().lerpVectors(startTarget, currentPlanetPos, eased);
    solarCamera.lookAt(currentLookAt);
    solarControls.target.copy(currentLookAt);
    
    // Make planet more prominent during zoom
    if (progress > 0.3) {
      container.scale.lerp(new THREE.Vector3(1.8, 1.8, 1.8), 0.1);
      container.userData.planet.material.emissive.setHex(container.userData.project.color).multiplyScalar(0.4);
    }
    
    if (progress < 1) {
      requestAnimationFrame(animateZoom);
    } else {
      // Final positioning - LOCK the camera and controls
      const finalPlanetPos = new THREE.Vector3(
        Math.cos(planetData.angle) * planetData.radius,
        0,
        Math.sin(planetData.angle) * planetData.radius
      );
      
      solarCamera.lookAt(finalPlanetPos);
      solarControls.target.copy(finalPlanetPos);
      
      // Important: Update controls without enabling them yet
      solarControls.update();
      
      setTimeout(() => {
        openProjectModal(container.userData.project, container.userData.index);
        explode(window.innerWidth / 2, window.innerHeight / 2, `#${container.userData.project.color.toString(16)}`, 150);
      }, 300);
    }
  }
  
  animateZoom();
}

function focusOnPlanet(index) {
  const container = solarPlanets[index];
  if (container) {
    zoomToPlanet(container);
  }
}

// === Orbital Trails and Connections ===
const orbitCanvas = document.getElementById('orbit-canvas');
const orbitCtx = orbitCanvas.getContext('2d');
function resizeOrbitCanvas() {
  orbitCanvas.width = window.innerWidth;
  orbitCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeOrbitCanvas);
resizeOrbitCanvas();

// Store planet trail history
const planetTrails = Array(projectData.length).fill().map(() => []);
const maxTrailLength = 80;

// Store visited planet indices in order
let visitedOrder = [];

// Patch visitedProjects to update visitedOrder
const originalOpenProjectModal = openProjectModal;
openProjectModal = function(project, index) {
  if (!visitedOrder.includes(index)) visitedOrder.push(index);
  originalOpenProjectModal.apply(this, arguments);
};

// Patch updateProgress to update visitedOrder for legacy triggers
const originalUpdateProgress = updateProgress;
updateProgress = function() {
  originalUpdateProgress.apply(this, arguments);
  visitedOrder = Array.from(visitedProjects);
};

// === Warp Speed Effect ===
let warpParticles = [];
function spawnWarpParticles(targetScreen) {
  const count = 180;
  const center = { x: orbitCanvas.width / 2, y: orbitCanvas.height / 2 };
  for (let i = 0; i < count; i++) {
    // Direction from center to target, with some spread
    const angleToTarget = Math.atan2(targetScreen.y - center.y, targetScreen.x - center.x);
    const spread = (Math.random() - 0.5) * Math.PI / 7;
    const angle = angleToTarget + spread;
    const speed = 32 + Math.random() * 24;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    // Color: white, cyan, blue
    const colorChoices = [
      'rgba(255,255,255,0.95)',
      'rgba(102,217,239,0.95)',
      'rgba(166,226,46,0.85)'
    ];
    const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    warpParticles.push({
      x: center.x,
      y: center.y,
      vx,
      vy,
      alpha: 1,
      life: 1.2 + Math.random() * 0.6,
      color: color
    });
  }
}

function animate3D() {
  if (!solarRenderer || !solarScene || !solarCamera) return;
  requestAnimationFrame(animate3D);
  if (solarControls) solarControls.update();

  // Clear orbit canvas with slight opacity for fading trails
  orbitCtx.globalAlpha = 0.18;
  orbitCtx.clearRect(0, 0, orbitCanvas.width, orbitCanvas.height);
  orbitCtx.globalAlpha = 1;

  // Project 3D to 2D helper
  function toScreen(pos) {
    const vector = pos.clone().project(solarCamera);
    return {
      x: (vector.x + 1) / 2 * orbitCanvas.width,
      y: (-vector.y + 1) / 2 * orbitCanvas.height
    };
  }

  // Draw planet trails as subtle glowing particles (desktop only)
  if (!isMobile()) {
  solarPlanets.forEach((container, i) => {
    // Update trail
    const worldPos = container.position.clone();
    planetTrails[i].push(worldPos.clone());
    if (planetTrails[i].length > maxTrailLength) planetTrails[i].shift();
      
      // Draw trail as connected line segments for better mobile appearance
      if (planetTrails[i].length > 1) {
      orbitCtx.save();
        orbitCtx.strokeStyle = `rgba(${(projectData[i].color>>16)&255},${(projectData[i].color>>8)&255},${projectData[i].color&255},0.3)`;
        orbitCtx.shadowColor = orbitCtx.strokeStyle;
        orbitCtx.shadowBlur = 8;
        orbitCtx.lineWidth = 3;
      orbitCtx.beginPath();
        
        // Start from the planet's exact center position
        const planetWorldPos = container.getWorldPosition(new THREE.Vector3());
        const currentScreen = toScreen(planetWorldPos);
        orbitCtx.moveTo(currentScreen.x, currentScreen.y);
        
        // Draw line through trail points
        planetTrails[i].forEach((pos, j) => {
          const screen = toScreen(pos);
          orbitCtx.lineTo(screen.x, screen.y);
        });
        
        orbitCtx.stroke();
      orbitCtx.restore();
      }
    });
  }

  // Draw glowing arc connectors between visited planets
  if (visitedOrder.length > 1) {
    const sunScreen = toScreen(new THREE.Vector3(0, 0, 0));
    orbitCtx.save();
    orbitCtx.strokeStyle = 'rgba(255,255,255,0.85)';
    orbitCtx.shadowColor = '#fff';
    orbitCtx.shadowBlur = 18;
    orbitCtx.lineWidth = 4;
    orbitCtx.beginPath();
    let prevScreen = null;
    visitedOrder.forEach((idx, j) => {
      const planetWorldPos = solarPlanets[idx].getWorldPosition(new THREE.Vector3());
      const screen = toScreen(planetWorldPos);
      if (j === 0) {
        orbitCtx.moveTo(screen.x, screen.y);
      } else {
        // Always draw an arc (quadratic Bezier) that bows away from the sun
        // Find midpoint
        const mx = (prevScreen.x + screen.x) / 2;
        const my = (prevScreen.y + screen.y) / 2;
        // Vector from sun to midpoint
        const vx = mx - sunScreen.x;
        const vy = my - sunScreen.y;
        const vlen = Math.hypot(vx, vy) || 1;
        // Control point offset: away from sun, fixed arc height
        const arcHeight = 48; // px
        const cx = mx + (vx / vlen) * arcHeight;
        const cy = my + (vy / vlen) * arcHeight;
        orbitCtx.quadraticCurveTo(cx, cy, screen.x, screen.y);
      }
      prevScreen = screen;
    });
    orbitCtx.stroke();
    orbitCtx.restore();
  }

  // Draw and animate warp particles
  for (let i = warpParticles.length - 1; i >= 0; i--) {
    const p = warpParticles[i];
    orbitCtx.save();
    orbitCtx.globalAlpha = p.alpha;
    orbitCtx.strokeStyle = p.color;
    orbitCtx.shadowColor = p.color;
    orbitCtx.shadowBlur = 32;
    orbitCtx.lineWidth = 4.5;
    orbitCtx.beginPath();
    orbitCtx.moveTo(p.x, p.y);
    orbitCtx.lineTo(p.x - p.vx * 1.2, p.y - p.vy * 1.2);
    orbitCtx.stroke();
    orbitCtx.restore();
    p.x += p.vx;
    p.y += p.vy;
    p.alpha *= 0.97;
    p.life -= 0.03;
    if (p.life <= 0 || p.alpha < 0.05) warpParticles.splice(i, 1);
  }

  // Rotate sun
  solarScene.children.forEach(child => {
    if (child.userData && child.userData.isSun) {
      child.rotation.y += 0.01;
      if (child.children[1]) { // Corona
        child.children[1].rotation.y -= 0.015;
      }
    }
  });

  // Update planets
  const pulseTime = Date.now() * 0.002;
  solarPlanets.forEach((container, i) => {
    if (!container.userData.isHovered) {
      container.userData.angle += container.userData.speed;
      const x = Math.cos(container.userData.angle) * container.userData.radius;
      const z = Math.sin(container.userData.angle) * container.userData.radius;
      container.position.set(x, 0, z);
    }
    // Planet self-rotation
    container.userData.planet.rotation.y += 0.02;

    // Pulsing glow for unvisited planets
    const isVisited = visitedProjects.has(i);
    if (!isVisited) {
      const pulse = 0.25 + 0.25 * Math.sin(pulseTime + i * 1.2);
      container.userData.planet.material.emissive.setHex(container.userData.project.color).multiplyScalar(0.25 + pulse);
      container.userData.atmosphere.material.opacity = 0.35 + pulse * 0.5;
    } else {
      container.userData.planet.material.emissive.setHex(container.userData.project.color).multiplyScalar(0.1);
      container.userData.atmosphere.material.opacity = 0.2;
    }
  });

  solarRenderer.render(solarScene, solarCamera);
}

// === Modal Functions ===
function openAboutModal() {
  const modal = document.getElementById('about-modal');
  modal.classList.add('show');
}

function openContactModal() {
  const modal = document.getElementById('contact-modal');
  modal.classList.add('show');
}

function openEmailFormModal() {
  const modal = document.getElementById('email-form-modal');
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'flex';
  }
}

function closeEmailFormModal() {
  const modal = document.getElementById('email-form-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: #272822;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 10001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    ${type === 'success' ? 'background: #a6e22e;' : 'background: #f92672;'}
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function openProjectModal(project, index) {
  console.log('Opening project modal for:', project.title);
  visitedProjects.add(index);
  updateProgress();
  
  const modal = document.getElementById('project-modal');
  const modalContent = modal.querySelector('.project-modal-content');
  const header = modalContent.querySelector('.project-modal-header h2');

  if (!modal) {
    console.error('Project modal not found!');
    return;
  }

  // Set accent color
  const accent = `#${project.color.toString(16).padStart(6, '0')}`;
  modalContent.style.borderColor = accent;
  header.style.color = accent;
  
  // Set close button color to match project
  const closeBtn = document.getElementById('close-project');
  if (closeBtn) {
    closeBtn.style.color = accent;
    closeBtn.style.borderColor = accent;
  }

  // Set content
  document.getElementById('project-modal-title').textContent = project.title;
  document.getElementById('project-modal-desc').textContent = project.description;
  currentProject = project;
  
  // Create scrollable image gallery with preloaded images
  const imagesContainer = document.getElementById('project-images-container');
  if (imagesContainer) {
    imagesContainer.innerHTML = '';
    
    // Preload all images first
    const imagePromises = project.images.map((imageSrc, imageIndex) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Image ${imageIndex + 1} loaded:`, imageSrc);
          resolve({ img, imageSrc, imageIndex });
        };
        img.onerror = () => {
          console.error(`Failed to load image ${imageIndex + 1}:`, imageSrc);
          resolve({ img: null, imageSrc, imageIndex });
        };
        img.src = imageSrc;
      });
    });
    
    // Once all images are loaded, add them to the container
    Promise.all(imagePromises).then((loadedImages) => {
      // Check if mobile
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // Instagram-style mobile layout
        loadedImages.forEach(({ img, imageSrc, imageIndex }) => {
          if (img) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-item';
            imageDiv.style.borderColor = accent;
            imageDiv.dataset.index = imageIndex;
            
            const displayImg = document.createElement('img');
            displayImg.src = imageSrc;
            displayImg.alt = `${project.title} - Image ${imageIndex + 1}`;
            
            // Zoom functionality disabled - click does nothing for now
            // imageDiv.addEventListener('click', () => {
            //   openImageZoom(imageSrc, `${project.title} - Image ${imageIndex + 1}`, imageIndex);
            // });
            
            imageDiv.appendChild(displayImg);
            imagesContainer.appendChild(imageDiv);
          }
        });
        
        // Set first image as active
        const firstImage = imagesContainer.querySelector('.image-item');
        if (firstImage) {
          firstImage.classList.add('active');
        }
        
        // Update image counter
        imagesContainer.setAttribute('data-image-counter', `1/${loadedImages.length}`);
        
        // Add Instagram-like mobile swipe functionality
        let startX = 0;
        let currentX = 0;
        let currentImageIndex = 0;
        let isDragging = false;
        
        // Touch start
        imagesContainer.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          currentX = startX;
          isDragging = true;
          e.preventDefault();
        }, { passive: false });
        
        // Touch move - smooth dragging
        imagesContainer.addEventListener('touchmove', (e) => {
          if (!isDragging) return;
          
          currentX = e.touches[0].clientX;
          const diffX = currentX - startX;
          
          // Apply smooth transform to current image
          const images = imagesContainer.querySelectorAll('.image-item');
          const activeImage = images[currentImageIndex];
          if (activeImage) {
            activeImage.style.transform = `translateX(${diffX}px)`;
            activeImage.style.transition = 'none';
          }
          
          e.preventDefault();
        }, { passive: false });
        
        // Touch end - snap to position
        imagesContainer.addEventListener('touchend', (e) => {
          if (!isDragging) return;
          
          const diffX = currentX - startX;
          const threshold = 100; // Minimum swipe distance
          
          if (Math.abs(diffX) > threshold) {
            const prevIndex = currentImageIndex;
            
            if (diffX < 0 && currentImageIndex < loadedImages.length - 1) {
              // Swipe left - next image
              currentImageIndex++;
            } else if (diffX > 0 && currentImageIndex > 0) {
              // Swipe right - previous image
              currentImageIndex--;
            }
            
            // Update active image with smooth animation
            const images = imagesContainer.querySelectorAll('.image-item');
            images.forEach((img, index) => {
              img.style.transition = 'transform 0.3s ease-out';
              img.style.transform = '';
              img.classList.remove('active', 'prev', 'next');
              
              if (index === currentImageIndex) {
                img.classList.add('active');
              } else if (index === prevIndex) {
                // Previous image should go in the opposite direction of the swipe
                if (diffX < 0) {
                  // Swiped left, previous image goes left (prev)
                  img.classList.add('prev');
                } else {
                  // Swiped right, previous image goes right (next)
                  img.classList.add('next');
                }
              }
            });
            
            // Update counter
            imagesContainer.setAttribute('data-image-counter', `${currentImageIndex + 1}/${loadedImages.length}`);
          } else {
            // Snap back to current position
            const images = imagesContainer.querySelectorAll('.image-item');
            images.forEach((img) => {
              img.style.transition = 'transform 0.3s ease-out';
              img.style.transform = '';
            });
          }
          
          isDragging = false;
          startX = 0;
          currentX = 0;
        });
        
      } else {
        // Desktop layout - horizontal scrolling
        loadedImages.forEach(({ img, imageSrc, imageIndex }) => {
          if (img) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-item';
            imageDiv.style.borderColor = accent;
            
            const displayImg = document.createElement('img');
            displayImg.src = imageSrc;
            displayImg.alt = `${project.title} - Image ${imageIndex + 1}`;
            
            // Zoom functionality disabled - click does nothing for now
            // imageDiv.addEventListener('click', () => {
            //   openImageZoom(imageSrc, `${project.title} - Image ${imageIndex + 1}`, imageIndex);
            // });
            
            imageDiv.appendChild(displayImg);
            imagesContainer.appendChild(imageDiv);
          }
        });
      }
    });
  }
  
  // Show modal
  modal.classList.add('show');
  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  
  console.log('Project modal opened successfully');
}

// Image Zoom Functions
let currentZoomIndex = 0;
let zoomImages = [];

function openImageZoom(imageSrc, altText, imageIndex = 0) {
  const zoomModal = document.getElementById('image-zoom-modal');
  const zoomedImage = document.getElementById('zoomed-image');
  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.querySelector('.project-modal-content');
  
  if (zoomModal && zoomedImage) {
    // Get all images from current project
    const currentProject = projectData.find(p => p.title === document.getElementById('project-modal-title').textContent);
    if (currentProject) {
      zoomImages = currentProject.images;
      currentZoomIndex = imageIndex;
    }
    
    zoomedImage.src = imageSrc;
    zoomedImage.alt = altText;
    zoomModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Completely disable project modal interactions
    if (projectModal) {
      projectModal.style.pointerEvents = 'none';
      projectModal.style.userSelect = 'none';
    }
    if (projectModalContent) {
      projectModalContent.style.pointerEvents = 'none';
    }
    
    // Reinitialize zoom modal events
    initializeZoomModalEvents();
    
    // Update navigation buttons
    updateZoomNavigation();
  }
}

function closeImageZoom() {
  const zoomModal = document.getElementById('image-zoom-modal');
  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.querySelector('.project-modal-content');
  
  if (zoomModal) {
    zoomModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Re-enable project modal interactions
    if (projectModal) {
      projectModal.style.pointerEvents = 'auto';
      projectModal.style.userSelect = 'auto';
    }
    if (projectModalContent) {
      projectModalContent.style.pointerEvents = 'auto';
    }
    
    zoomImages = [];
    currentZoomIndex = 0;
  }
}

function nextZoomImage() {
  if (zoomImages.length > 0) {
    currentZoomIndex = (currentZoomIndex + 1) % zoomImages.length;
    const zoomedImage = document.getElementById('zoomed-image');
    if (zoomedImage) {
      zoomedImage.src = zoomImages[currentZoomIndex];
      updateZoomNavigation();
    }
  }
}

function prevZoomImage() {
  if (zoomImages.length > 0) {
    currentZoomIndex = (currentZoomIndex - 1 + zoomImages.length) % zoomImages.length;
    const zoomedImage = document.getElementById('zoomed-image');
    if (zoomedImage) {
      zoomedImage.src = zoomImages[currentZoomIndex];
      updateZoomNavigation();
    }
  }
}

function updateZoomNavigation() {
  const prevBtn = document.getElementById('zoom-prev');
  const nextBtn = document.getElementById('zoom-next');
  
  if (prevBtn && nextBtn) {
    prevBtn.disabled = zoomImages.length <= 1;
    nextBtn.disabled = zoomImages.length <= 1;
  }
}

// Simple zoom modal event listeners
function initializeZoomModalEvents() {
  const zoomModal = document.getElementById('image-zoom-modal');
  const zoomedImage = document.getElementById('zoomed-image');
  const prevBtn = document.getElementById('zoom-prev');
  const nextBtn = document.getElementById('zoom-next');
  
  if (!zoomModal) return;
  
  // Click anywhere on modal background to close
  zoomModal.addEventListener('click', function(e) {
    if (e.target === zoomModal) {
      closeImageZoom();
    }
  });
  
  // Click on image to close
  if (zoomedImage) {
    zoomedImage.addEventListener('click', function(e) {
      e.stopPropagation();
      closeImageZoom();
    });
    
    // Touch event for mobile
    zoomedImage.addEventListener('touchend', function(e) {
      e.stopPropagation();
      closeImageZoom();
    });
  }
  
  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      prevZoomImage();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      nextZoomImage();
    });
  }
}

// Initialize events when DOM is ready
document.addEventListener('DOMContentLoaded', initializeZoomModalEvents);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const zoomModal = document.getElementById('image-zoom-modal');
  if (zoomModal && zoomModal.classList.contains('show')) {
    if (e.key === 'Escape') {
      closeImageZoom();
    } else if (e.key === 'ArrowLeft') {
      prevZoomImage();
    } else if (e.key === 'ArrowRight') {
      nextZoomImage();
    }
  }
});

// Touch/swipe support for mobile - REMOVED from zoom modal
// Navigation is now only with buttons

function closeProjectModal() {
  console.log('Closing project modal...');
  const modal = document.getElementById('project-modal');
  const modalContent = modal.querySelector('.project-modal-content');
  
  if (!modal) {
    console.error('Project modal not found!');
    return;
  }
  
  // Hide modal
  modal.classList.remove('show');
  modal.style.display = 'none';
  modal.style.visibility = 'hidden';
  modal.style.opacity = '0';
  
    // Reset accent colors
  if (modalContent) {
    modalContent.style.borderColor = '';
    const header = modalContent.querySelector('.project-modal-header h2');
    if (header) header.style.color = '';
  }
  
  // Reset close button color
  const closeBtn = document.getElementById('close-project');
  if (closeBtn) {
    closeBtn.style.color = '';
    closeBtn.style.borderColor = '';
  }
  
  // Reset camera to default position on mobile - enhanced reset with smooth animation
  if (isMobile() && solarControls) {
    console.log('Resetting solar camera to default position with smooth animation...');
    
    // Use the existing smooth reset function for visible animation
    if (typeof smoothCameraReset === 'function') {
      smoothCameraReset(800); // 800ms smooth animation
    } else {
      // Fallback to immediate reset if smooth function not available
      solarControls.reset();
      solarControls.target.set(0, 0, 0);
      solarCamera.position.set(0, 20, 30);
      solarCamera.lookAt(0, 0, 0);
      solarControls.update();
    }
    
    // Additional reset to ensure it takes effect
    setTimeout(() => {
      if (solarControls && solarCamera) {
        solarControls.reset();
        solarControls.target.set(0, 0, 0);
        solarCamera.position.set(0, 20, 30);
        solarCamera.lookAt(0, 0, 0);
        solarControls.update();
        console.log('Camera reset animation completed');
      }
    }, 1000);
  }
  
  console.log('Project modal closed successfully');
}

// Set up project modal close button
setTimeout(() => {
  const closeProject = document.getElementById('close-project');
  if (closeProject) {
    closeProject.addEventListener('click', closeProjectModal);
    // Also add touch event for mobile
    closeProject.addEventListener('touchend', closeProjectModal);
  }
}, 100);

// Gallery functionality
let currentProject = null;
let currentImageIndex = 0;

// Gallery navigation removed - now using scrollable content

function updateProgress() {
  const progress = document.getElementById('progress-info');
  progress.textContent = `${visitedProjects.size}/${projectData.length} projects explored`;
  // Update planet dots
  const dots = document.querySelectorAll('.planet-dot');
  dots.forEach((dot, i) => {
    if (visitedProjects.has(i)) {
      dot.classList.add('visited');
    }
  });
  // Achievement
  const contactPhone = document.getElementById('contact-phone');
  let groundMsg = document.getElementById('ground-control-msg');
  if (visitedProjects.size === projectData.length) {
    setTimeout(() => {
      explode(window.innerWidth / 2, window.innerHeight / 2, '#a6e22e', 200);
    }, 1000);
    // Phone icon rings
    if (contactPhone) contactPhone.classList.add('ringing');
    // Show ground control message only if not dismissed and not on mobile
    if (!groundMsg && !groundControlDismissed && !isMobile()) {
      groundMsg = document.createElement('div');
      groundMsg.id = 'ground-control-msg';
      groundMsg.textContent = 'call ground control';
      groundMsg.style.position = 'fixed';
      groundMsg.style.bottom = '6.5rem';
      groundMsg.style.right = '3.2rem';
      groundMsg.style.zIndex = '3100';
      groundMsg.style.background = 'rgba(39,40,34,0.95)';
      groundMsg.style.color = '#66d9ef';
      groundMsg.style.fontFamily = 'JetBrains Mono, monospace';
      groundMsg.style.fontSize = '1.2rem';
      groundMsg.style.padding = '0.7rem 1.5rem';
      groundMsg.style.borderRadius = '16px';
      groundMsg.style.boxShadow = '0 0 18px #66d9ef88';
      groundMsg.style.pointerEvents = 'none';
      document.body.appendChild(groundMsg);
    }
  } else {
    if (contactPhone) contactPhone.classList.remove('ringing');
    if (groundMsg) groundMsg.remove();
    groundControlDismissed = false;
  }
}

// === Event Listeners ===
function setupEventListeners() {
  // Contact phone icon - Add safety check
  const contactPhone = document.getElementById('contact-phone');
  if (contactPhone) {
    contactPhone.addEventListener('click', () => {
      openContactModal();
      explode(window.innerWidth - 100, window.innerHeight - 100, '#f92672', 80);
      // Remove ground control message if present and set dismissed flag
      const groundMsg = document.getElementById('ground-control-msg');
      if (groundMsg) groundMsg.remove();
      if (contactPhone.classList.contains('ringing')) groundControlDismissed = true;
    });
  }

  // Email form trigger
  const emailFormTrigger = document.getElementById('email-form-trigger');
  if (emailFormTrigger) {
    emailFormTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openEmailFormModal();
      explode(window.innerWidth / 2, window.innerHeight / 2, '#66d9ef', 100);
    });
  }

  // Email form close button
  const closeEmailForm = document.getElementById('close-email-form');
  if (closeEmailForm) {
    closeEmailForm.addEventListener('click', closeEmailFormModal);
  }

  // Email form submission
  const emailForm = document.getElementById('email-form');
  if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(emailForm);
      const name = formData.get('full-name');
      const email = formData.get('email-address');
      const company = formData.get('company-name');
      const message = formData.get('message');
      
      // Show loading state
      const submitBtn = emailForm.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'SENDING...';
      submitBtn.disabled = true;
      
      try {
        // Validate form data
        if (!name || !email || !message) {
          throw new Error('Please fill in all required fields');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Please enter a valid email address');
        }
        
        // Submit to Formspree (direct email sending)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('company', company || 'Not specified');
        formData.append('message', message);
        formData.append('subject', `Portfolio Contact from ${name}`);
        
        // Send to Formspree
        const response = await fetch('https://formspree.io/f/meolqyap', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Success - close modal and show success message
          closeEmailFormModal();
          explode(window.innerWidth / 2, window.innerHeight / 2, '#a6e22e', 150);
          
          // Reset form
          emailForm.reset();
          
          // Show success notification
          showNotification('Message sent successfully!', 'success');
        } else {
          throw new Error('Failed to send message. Please try again.');
        }
        
      } catch (error) {
        console.error('Error in email form:', error);
        showNotification(error.message || 'Failed to send message. Please try again.', 'error');
      } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Close modals - Fixed with individual event listeners
  setTimeout(() => {
    const closeAbout = document.getElementById('close-about');
    const closeContact = document.getElementById('close-contact');
    const closeProject = document.getElementById('close-project');
    
    if (closeAbout) {
      closeAbout.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('about-modal').classList.remove('show');
        // Smooth camera reset after closing about modal
        if (solarControls && solarCamera) {
          solarControls.enabled = true;
          smoothCameraReset();
        }
      });
    }
    
    if (closeContact) {
      closeContact.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('contact-modal').classList.remove('show');
      });
    }
    
    if (closeProject) {
      closeProject.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('project-modal').classList.remove('show');
        if (solarControls && solarCamera) {
          solarControls.enabled = true;
          smoothCameraReset();
        }
        updatePhoneVisibility();
      });
    }

    // Gallery navigation removed - now using scrollable content
  }, 100);

  // Click outside modal to close
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
      if (e.target.id === 'project-modal' && solarControls && solarCamera) {
        solarControls.enabled = true;
        smoothCameraReset();
      }
      if (e.target.id === 'about-modal' && solarControls && solarCamera) {
        solarControls.enabled = true;
        smoothCameraReset();
      }
      updatePhoneVisibility();
    }
  });
  
  // Keyboard controls with Escape key
  document.addEventListener('keydown', (e) => {
    const aboutModal = document.getElementById('about-modal');
    const contactModal = document.getElementById('contact-modal');
    const projectModal = document.getElementById('project-modal');
    
    const isAboutOpen = aboutModal && aboutModal.classList.contains('show');
    const isContactOpen = contactModal && contactModal.classList.contains('show');
    const isProjectOpen = projectModal && projectModal.classList.contains('show');
    const isAnyModalOpen = isAboutOpen || isContactOpen || isProjectOpen;

    // Escape key closes any open modal
    if (e.key === 'Escape') {
      if (isAboutOpen) {
        aboutModal.classList.remove('show');
        // Smooth camera reset after closing about modal
        if (solarControls && solarCamera) {
          solarControls.enabled = true;
          smoothCameraReset();
        }
      }
      if (isContactOpen) contactModal.classList.remove('show');
      if (isProjectOpen) {
        projectModal.classList.remove('show');
        if (solarControls && solarCamera) {
          solarControls.enabled = true;
          smoothCameraReset();
        }
      }
      updatePhoneVisibility();
      return;
    }

    // Simple project modal navigation - ONLY within current project
    if (isProjectOpen) {
      if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
        currentImageIndex--;
        updateGalleryImage();
        explode(200, window.innerHeight / 2, '#66d9ef', 50);
      }
      if (e.key === 'ArrowRight' && currentProject && currentImageIndex < currentProject.images.length - 1) {
        currentImageIndex++;
        updateGalleryImage();
        explode(window.innerWidth - 200, window.innerHeight / 2, '#66d9ef', 50);
      }
      return; // Don't process other keys when modal is open
    }

    // Number keys for planet navigation (only when no modal is open)
    if (portfolioState === 'space' && !isAnyModalOpen) {
      const num = parseInt(e.key);
      if (num >= 1 && num <= projectData.length) {
        focusOnPlanet(num - 1);
      }
    }

    // Chaos mode (press C) - only when no modal is open
    if (e.key.toLowerCase() === 'c' && portfolioState === 'space' && !isAnyModalOpen) {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          const color = monokaiColors[Math.floor(Math.random() * monokaiColors.length)];
          explode(x, y, color, 80);
        }, i * 200);
      }
    }
  });
  
  // Background explosions on click (restored)
  document.addEventListener('click', (e) => {
    if (portfolioState === 'space') {
      // Check if we clicked on any interactive elements (more comprehensive)
      const clickedElement = e.target;
      const isUI = clickedElement.closest('.space-ui') || 
                   clickedElement.closest('.mission-control') || 
                   clickedElement.closest('.modal') ||
                   clickedElement.closest('.planet-hud') ||
                   clickedElement.closest('.close') ||
                   clickedElement.closest('button') ||
                   clickedElement.closest('a') ||
                   (clickedElement.matches('canvas') && clickedElement.id === 'solar-system-canvas');
      // Only trigger fireworks if we're in space and clicked empty background
      if (!isUI) {
        const color = monokaiColors[Math.floor(Math.random() * monokaiColors.length)];
        explode(e.clientX, e.clientY, color, 100);
      }
    }
  });

  function updatePhoneVisibility() {
    const contactPhone = document.getElementById('contact-phone');
    const aboutModal = document.getElementById('about-modal');
    const contactModal = document.getElementById('contact-modal');
    const projectModal = document.getElementById('project-modal');
    const isAboutOpen = aboutModal && aboutModal.classList.contains('show');
    const isContactOpen = contactModal && contactModal.classList.contains('show');
    const isProjectOpen = projectModal && projectModal.classList.contains('show');
    if (contactPhone) {
      if (isAboutOpen || isContactOpen || isProjectOpen) {
        contactPhone.style.display = 'none';
      } else {
        contactPhone.style.display = 'flex';
      }
    }
  }

  // Call updatePhoneVisibility on modal open/close
  [document.getElementById('about-modal'), document.getElementById('contact-modal'), document.getElementById('project-modal')].forEach(modal => {
    if (modal) {
      modal.addEventListener('transitionend', updatePhoneVisibility);
      modal.addEventListener('animationend', updatePhoneVisibility);
    }
  });
  document.addEventListener('keydown', updatePhoneVisibility);
  document.addEventListener('click', updatePhoneVisibility);
}

// === Window Events ===
window.addEventListener('resize', () => {
  // Update canvases
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  fireworkCanvas.width = window.innerWidth;
  fireworkCanvas.height = window.innerHeight;
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
  resizeOrbitCanvas(); // Update orbit canvas
  
  // Update 3D camera and renderer
  if (solarCamera && solarRenderer) {
    solarCamera.aspect = window.innerWidth / window.innerHeight;
    solarCamera.updateProjectionMatrix();
    solarRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  // Update star positions
  stars.forEach(star => {
    star.originalX = Math.random() * starCanvas.width;
    star.originalY = Math.random() * starCanvas.height;
    star.x = star.originalX;
    star.y = star.originalY;
  });
});

// === Initialize Everything ===
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Portfolio initializing...');
  console.log('DOM Content Loaded');
  
  // Start animations immediately (including on launch screen)
  animateStarField();
  updateFireworks();
  drawCursor();
  
  // Setup interactions
  setupEventListeners();
  
  // Initialize launch screen with multiple retry attempts
  let initAttempts = 0;
  const maxAttempts = 10;
  
  const tryInitLaunch = () => {
    initAttempts++;
    console.log(`🚀 Launch init attempt ${initAttempts}/${maxAttempts}`);
    
    const launchBtn = document.getElementById('launch-btn');
    if (launchBtn) {
      console.log('✅ Launch button found, initializing...');
      initLaunchScreen();
    } else if (initAttempts < maxAttempts) {
      console.log('⏳ Launch button not ready, retrying...');
      setTimeout(tryInitLaunch, 200);
    } else {
      console.error('❌ Could not find launch button after maximum attempts');
      console.log('Available elements:', {
        'launch-screen': !!document.getElementById('launch-screen'),
        'launch-btn': !!document.getElementById('launch-btn'),
        'spaceship': !!document.getElementById('spaceship')
      });
    }
  };
  
  tryInitLaunch();
  
  console.log('✨ Portfolio initialization complete!');
});

// === Fallback for immediate testing ===
window.addEventListener('load', () => {
  console.log('🌟 Window fully loaded');
  
  // Last resort: add click handler to any launch button found
  setTimeout(() => {
    const launchBtn = document.getElementById('launch-btn');
    if (launchBtn && !launchBtn.onclick) {
      console.log('🔧 Adding fallback click handler');
      launchBtn.onclick = () => {
        console.log('🚀 Fallback launch triggered!');
        window.startLaunch();
      };
    }
  }, 500);
});

function zoomToSun() {
  if (!solarControls) return;
  
  // Disable controls during animation
  solarControls.enabled = false;
  
  // Sun is at the center (0, 0, 0)
  const sunPos = new THREE.Vector3(0, 0, 0);
  
  console.log('☀️ Zooming to sun at center');
  
  // Calculate optimal camera position for viewing the sun
  const cameraDistance = 10;
  const cameraHeight = 4;
  
  // Position camera at a nice angle to view the sun
  const targetPosition = new THREE.Vector3(8, cameraHeight, 8);
  
  const startPosition = solarCamera.position.clone();
  const startTarget = solarControls.target.clone();
  const startTime = Date.now();
  const duration = 2500;
  
  function animateZoomToSun() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing
    const eased = 1 - Math.pow(1 - progress, 3);
    
    // Animate camera position
    solarCamera.position.lerpVectors(startPosition, targetPosition, eased);
    
    // Animate camera look-at target to sun
    const currentLookAt = new THREE.Vector3().lerpVectors(startTarget, sunPos, eased);
    solarCamera.lookAt(currentLookAt);
    solarControls.target.copy(currentLookAt);
    
    // Make sun more prominent during zoom (optional visual enhancement)
    if (progress > 0.3 && solarSun) {
      // You can add sun enhancement effects here if desired
      solarSun.material.emissiveIntensity = 0.8 + (progress * 0.4);
    }
    
    if (progress < 1) {
      requestAnimationFrame(animateZoomToSun);
    } else {
      // Final positioning
      solarCamera.lookAt(sunPos);
      solarControls.target.copy(sunPos);
      
      setTimeout(() => {
        openAboutModal();
        explode(window.innerWidth / 2, window.innerHeight / 2, '#ffaa00', 150);
      }, 300);
    }
  }
  
  animateZoomToSun();
}

// === Hero Section Camera Modal ===
let heroStream = null;

// === Swipe Support ===
function isMobile() {
  return window.innerWidth <= 900;
}
// Project Gallery Swipe
let galleryTouchStartX = null;
let galleryTouchStartY = null;
const galleryImage = document.getElementById('gallery-image');
if (galleryImage) {
  galleryImage.addEventListener('touchstart', e => {
    if (!isMobile() || !e.touches[0]) return;
    galleryTouchStartX = e.touches[0].clientX;
    galleryTouchStartY = e.touches[0].clientY;
  });
  galleryImage.addEventListener('touchend', e => {
    if (!isMobile() || galleryTouchStartX === null) return;
    const dx = e.changedTouches[0].clientX - galleryTouchStartX;
    const dy = e.changedTouches[0].clientY - galleryTouchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        // Swipe left: next image
        const galleryNext = document.getElementById('gallery-next');
        if (galleryNext && !galleryNext.disabled) galleryNext.click();
      } else {
        // Swipe right: prev image
        const galleryPrev = document.getElementById('gallery-prev');
        if (galleryPrev && !galleryPrev.disabled) galleryPrev.click();
      }
    }
    galleryTouchStartX = null;
    galleryTouchStartY = null;
  });
}
// Planet Navigation Swipe
let solarTouchStartX = null;
let solarTouchStartY = null;
const solarCanvas = document.getElementById('solar-system-canvas');
if (solarCanvas) {
  solarCanvas.addEventListener('touchstart', e => {
    if (!isMobile() || !e.touches[0]) return;
    solarTouchStartX = e.touches[0].clientX;
    solarTouchStartY = e.touches[0].clientY;
  });
  solarCanvas.addEventListener('touchend', e => {
    if (!isMobile() || solarTouchStartY === null) return;
    const dx = e.changedTouches[0].clientX - solarTouchStartX;
    const dy = e.changedTouches[0].clientY - solarTouchStartY;
    if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx)) {
      // Up/down swipe: planet navigation
      let current = hoveredPlanet ? hoveredPlanet.userData.index : 0;
      if (dy < 0 && current < projectData.length - 1) {
        focusOnPlanet(current + 1);
      } else if (dy > 0 && current > 0) {
        focusOnPlanet(current - 1);
      }
    }
    solarTouchStartX = null;
    solarTouchStartY = null;
  });
}

// Helper function for smooth camera zoom out
function smoothCameraReset(duration = 1000) {
  if (!solarCamera || !solarControls) return;
  const startPos = solarCamera.position.clone();
  const startTarget = solarControls.target.clone();
  const endPos = new THREE.Vector3(0, 20, 30);
  const endTarget = new THREE.Vector3(0, 0, 0);
  const startTime = Date.now();
  function animate() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    // Ease out
    const ease = 1 - Math.pow(1 - t, 2);
    solarCamera.position.lerpVectors(startPos, endPos, ease);
    solarControls.target.lerpVectors(startTarget, endTarget, ease);
    solarControls.update();
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      solarCamera.position.copy(endPos);
      solarControls.target.copy(endTarget);
      solarControls.update();
    }
  }
  animate();
}

// Helper function for smooth camera reset (reset view button)
function resetView(duration = 1000) {
  if (!solarCamera || !solarControls) return;
  const startPos = solarCamera.position.clone();
  const startTarget = solarControls.target.clone();
  const endPos = new THREE.Vector3(0, 20, 30);
  const endTarget = new THREE.Vector3(0, 0, 0);
  const startTime = Date.now();
  function animate() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - t, 2);
    solarCamera.position.lerpVectors(startPos, endPos, ease);
    solarControls.target.lerpVectors(startTarget, endTarget, ease);
    solarControls.update();
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      solarCamera.position.copy(endPos);
      solarControls.target.copy(endTarget);
      solarControls.update();
    }
  }
  animate();
}
window.resetView = resetView;
// Only add event listener if the reset button exists
const resetBtn = document.getElementById('reset-view-btn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => window.resetView());
}

// === Enhanced Mobile UX Improvements ===

// Improved Hero Modal with Camera Permission
function openHeroModal() {
  console.log('Opening hero modal...');
  const modal = document.getElementById('hero-modal');
  const video = document.getElementById('hero-video');
  const heroMsg = modal.querySelector('.hero-message');
  const cameraPermission = document.getElementById('camera-permission');
  
  if (!modal) {
    console.error('Hero modal not found!');
    return;
  }
  
  // Reset modal state completely
  modal.classList.remove('show');
  modal.style.display = 'none';
  modal.style.visibility = 'hidden';
  modal.style.opacity = '0';
  
  // Force a reflow to ensure reset
  modal.offsetHeight;
  
  // Now open the modal
  modal.classList.add('show');
  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  
  // Hide camera permission dialog - don't show popup
  if (cameraPermission) {
    cameraPermission.style.display = 'none';
    cameraPermission.style.visibility = 'hidden';
    cameraPermission.style.opacity = '0';
    console.log('Camera permission dialog hidden');
  } else {
    console.error('Camera permission dialog not found!');
  }
  
  // Hide the hero message initially
  if (heroMsg) {
    heroMsg.style.display = 'none';
  }
  
  // Hide video initially
  if (video) {
    video.style.display = 'none';
    video.style.visibility = 'hidden';
  }
  
  // Auto-enable camera immediately
  setTimeout(() => {
    console.log('Auto-enabling camera...');
    enableCamera();
  }, 100);
}

// Enhanced camera enable function
function enableCamera() {
  console.log('Enabling camera...');
  const video = document.getElementById('hero-video');
  const heroMsg = document.querySelector('.hero-message');
  const cameraPermission = document.getElementById('camera-permission');
  
  if (!video) {
    console.error('Video element not found!');
    return;
  }
  
  // Hide permission dialog
  if (cameraPermission) {
    cameraPermission.style.display = 'none';
    cameraPermission.style.visibility = 'hidden';
    console.log('Camera permission dialog hidden');
  }
  
  // Show video
  video.style.display = 'block';
  video.style.visibility = 'visible';
  
  // Check if getUserMedia is supported
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('getUserMedia not supported');
    showCameraError('Camera not supported in this browser');
    return;
  }
  
  // Request camera with simpler constraints for better compatibility
  const constraints = {
    video: { 
      facingMode: 'user'
    }, 
    audio: false 
  };
  
  console.log('Requesting camera with constraints:', constraints);
  
  navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    console.log('Camera stream obtained successfully');
    heroStream = stream;
    video.srcObject = stream;
    
    // Play video immediately
    video.play().then(() => {
      console.log('Video started playing successfully');
      // Show hero message after camera starts
      if (heroMsg) {
        heroMsg.style.display = 'block';
        heroMsg.style.animation = 'fadeIn 0.5s ease-in';
      }
    }).catch(e => {
      console.error('Error playing video:', e);
      // Try to play without user interaction
      video.muted = true;
      video.play().catch(e2 => {
        console.error('Error playing muted video:', e2);
        showCameraError('Error starting video playback');
      });
    });
  })
  .catch(error => {
    console.error('Camera error:', error);
    let errorMessage = 'Camera access denied';
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found on this device.';
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Camera is already in use by another application.';
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'Camera does not meet the required constraints.';
    } else if (error.name === 'NotSupportedError') {
      errorMessage = 'Camera not supported on this device.';
    }
    
    showCameraError(errorMessage);
  });
}

function showCameraError(message) {
  const video = document.getElementById('hero-video');
  const heroMsg = document.querySelector('.hero-message');
  
  // Show error message
  const errorMsg = document.createElement('div');
  errorMsg.innerHTML = `
    <div style="text-align: center; padding: 2rem; color: #fff; background: rgba(255,0,0,0.2); border-radius: 8px;">
      <p>Camera Error: ${message}</p>
      <p style="font-size: 0.9rem; opacity: 0.8;">Please check your camera permissions</p>
    </div>
  `;
  video.parentNode.appendChild(errorMsg);
  
  // Show hero message anyway
  if (heroMsg) {
    heroMsg.style.display = 'block';
  }
}

function closeHeroModal() {
  console.log('Closing hero modal...');
  const modal = document.getElementById('hero-modal');
  const video = document.getElementById('hero-video');
  const cameraPermission = document.getElementById('camera-permission');
  
  // Hide modal completely
  modal.classList.remove('show');
  modal.style.display = 'none';
  modal.style.visibility = 'hidden';
  modal.style.opacity = '0';
  
  // Stop camera stream
  if (heroStream) {
    heroStream.getTracks().forEach(track => track.stop());
    heroStream = null;
    console.log('Camera stream stopped');
  }
  
  // Reset video
  if (video) {
    video.srcObject = null;
    video.style.display = 'none';
  }
  
  // Hide permission dialog permanently
  if (cameraPermission) {
    cameraPermission.style.display = 'none';
    cameraPermission.style.visibility = 'hidden';
    cameraPermission.style.opacity = '0';
  }
  
  // Remove any error messages
  if (video && video.parentNode) {
    const errorMsg = video.parentNode.querySelector('div');
    if (errorMsg && errorMsg.innerHTML.includes('Camera access denied')) {
      errorMsg.remove();
    }
  }
  
  console.log('Hero modal closed successfully');
  
  // Ensure hero button is re-enabled
  const heroBtn = document.getElementById('hero-btn');
  if (heroBtn) {
    heroBtn.style.pointerEvents = 'auto';
    heroBtn.style.cursor = 'pointer';
  }
}

// Enhanced mobile touch interactions
function enhanceMobileTouch() {
  // Add touch feedback to launch button
  const launchBtn = document.getElementById('launch-btn');
  if (launchBtn) {
    launchBtn.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
      this.style.boxShadow = '0 0 30px rgba(102, 217, 239, 0.8)';
    });
    
    launchBtn.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '';
    });
  }
  
  // Add touch feedback to planet dots
  const planetDots = document.querySelectorAll('.planet-dot');
  planetDots.forEach(dot => {
    dot.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.9)';
    });
    
    dot.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Add touch feedback to gallery navigation
  const galleryNavs = document.querySelectorAll('.gallery-nav');
  galleryNavs.forEach(nav => {
    nav.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.9)';
    });
    
    nav.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Initialize mobile enhancements
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, setting up hero modal...');
  
  // Set up camera enable button
  const enableCameraBtn = document.getElementById('enable-camera-btn');
  if (enableCameraBtn) {
    console.log('Camera enable button found, adding listener');
    enableCameraBtn.addEventListener('click', enableCamera);
    // Also add touch event for mobile
    enableCameraBtn.addEventListener('touchend', enableCamera);
  } else {
    console.error('Camera enable button not found!');
  }
  
  // Set up hero close button
  const heroCloseBtn = document.getElementById('hero-close-btn');
  if (heroCloseBtn) {
    console.log('Hero close button found, adding listener');
    heroCloseBtn.addEventListener('click', closeHeroModal);
    // Also add touch event for mobile
    heroCloseBtn.addEventListener('touchend', closeHeroModal);
  } else {
    console.error('Hero close button not found!');
  }
  
  // Set up click outside to close for hero modal
  const heroModal = document.getElementById('hero-modal');
  if (heroModal) {
    heroModal.addEventListener('click', function(e) {
      // Close if clicking on the modal backdrop (not the content)
      if (e.target === heroModal) {
        console.log('Clicked outside hero modal, closing...');
        closeHeroModal();
      }
    });
    
    // Also add touch event for mobile
    heroModal.addEventListener('touchend', function(e) {
      if (e.target === heroModal) {
        console.log('Touched outside hero modal, closing...');
        closeHeroModal();
      }
    });
  }
  
  // Set up click outside to close for project modal
  const projectModal = document.getElementById('project-modal');
  if (projectModal) {
    projectModal.addEventListener('click', function(e) {
      // Close if clicking on the modal backdrop (not the content)
      if (e.target === projectModal) {
        console.log('Clicked outside project modal, closing...');
        closeProjectModal();
      }
    });
    
    // Also add touch event for mobile
    projectModal.addEventListener('touchend', function(e) {
      if (e.target === projectModal) {
        console.log('Touched outside project modal, closing...');
        closeProjectModal();
      }
    });
  }
  
  // Add keyboard support for escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const heroModal = document.getElementById('hero-modal');
      if (heroModal && heroModal.style.display === 'flex') {
        console.log('Escape key pressed, closing hero modal...');
        closeHeroModal();
      }
    }
  });
  
  // Set up hero button
  const heroBtn = document.getElementById('hero-btn');
  if (heroBtn) {
    console.log('Hero button found, adding listener');
    heroBtn.addEventListener('click', openHeroModal);
  } else {
    console.error('Hero button not found!');
  }
  
  // Enhance mobile touch interactions
  if (isMobile()) {
    enhanceMobileTouch();
    
    // Add touch feedback to close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
      btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.9)';
        this.style.background = 'rgba(102, 217, 239, 0.3)';
      });
      
      btn.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
        this.style.background = 'rgba(0, 0, 0, 0.9)';
      });
    });
  }
  
  // Add escape key support for modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const heroModal = document.getElementById('hero-modal');
      const projectModal = document.getElementById('project-modal');
      const contactModal = document.getElementById('contact-modal');
      const aboutModal = document.getElementById('about-modal');
      
      if (heroModal && heroModal.classList.contains('show')) {
        closeHeroModal();
      } else if (projectModal && projectModal.classList.contains('show')) {
        closeProjectModal();
      } else if (contactModal && contactModal.classList.contains('show')) {
        closeContactModal();
      } else if (aboutModal && aboutModal.classList.contains('show')) {
        closeAboutModal();
      }
    }
  });
  
  console.log('Hero modal setup complete');
});

// Add CSS animation for fade in
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }
`;
document.head.appendChild(style);
