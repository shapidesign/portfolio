"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "../../types/project";
import { StarShapesProvider } from "./StarShapesProvider";
import { SolarScene } from "./SolarScene";
import { buildPlanetConfigs } from "./planet-config";
import type { CameraTarget } from "./CameraRig";
import type { PlanetConfig } from "./Planet";
import { PlanetHUD } from "./PlanetHUD";
import { MissionControl } from "./MissionControl";
import { ProjectModal } from "./ProjectModal";
import { AboutDrawer } from "./AboutDrawer";
import { ContactDrawer } from "./ContactDrawer";
import { ListView } from "./ListView";
import { VoyageHUD } from "./VoyageHUD";
import { useLanguage } from "../../context/LanguageContext";
import { preventOrphan } from "@/i18n/typography";

type SolarSystemProps = {
  projects: Project[];
};

type VoyageMode = "idle" | "riding" | "complete";

const GESTURE_COOLDOWN_MS = 720;
const TOUCH_SWIPE_THRESHOLD = 54;
const WHEEL_SWIPE_THRESHOLD = 72;
const WHEEL_RESET_MS = 180;
const GESTURE_BLOCK_SELECTOR =
  ".solar-actions, .solar-mission-control, .solar-voyage-hud, .solar-phone, .solar-modal, .solar-drawer, .solar-list, button, a, input, textarea, select, [contenteditable='true']";

/** Captures the live camera ref from inside the Canvas so DOM overlays can project planet positions. */
function CameraExporter({ targetRef }: { targetRef: React.MutableRefObject<THREE.Camera | null> }) {
  const { camera } = useThree();
  useEffect(() => {
    targetRef.current = camera;
  }, [camera, targetRef]);
  return null;
}

export function SolarSystem({ projects }: SolarSystemProps) {
  const planets = useMemo(() => buildPlanetConfigs(projects), [projects]);

  // Refs: live world position for each planet (updated each frame from Planet)
  const planetPositions = useMemo(() => {
    const map: Record<string, React.MutableRefObject<THREE.Vector3>> = {};
    for (const p of planets) {
      map[p.slug] = { current: new THREE.Vector3() };
    }
    return map;
  }, [planets]);

  const cameraRef = useRef<THREE.Camera | null>(null);
  const touchGesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const wheelGesture = useRef({ deltaX: 0, deltaY: 0, timer: 0 });
  const lastGestureAt = useRef(0);

  const { isHebrew } = useLanguage();

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [sunHovered, setSunHovered] = useState(false);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [listMode, setListMode] = useState(false);
  const [voyageMode, setVoyageMode] = useState<VoyageMode>("idle");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactScene, setCompactScene] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const modalOpen = focusedSlug !== null;
  const overlayBlocked = modalOpen || aboutOpen || contactOpen || listMode;

  // One-pager: hide global header + footer while the solar homepage is mounted
  useEffect(() => {
    document.body.classList.add("solar-home");
    return () => {
      document.body.classList.remove("solar-home");
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px), (max-height: 760px)");
    const handleChange = () => setCompactScene(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const activePlanet = activeIndex === null ? null : planets[activeIndex] ?? null;
  const activeSlug = activePlanet?.slug ?? null;

  const focusedProject = useMemo(
    () => (focusedSlug ? projects.find((p) => p.slug === focusedSlug) ?? null : null),
    [focusedSlug, projects],
  );
  const activeProject = useMemo(
    () => (activeSlug ? projects.find((p) => p.slug === activeSlug) ?? null : null),
    [activeSlug, projects],
  );
  const allProjectsOpened = useMemo(
    () => planets.length > 0 && planets.every((planet) => visited.has(planet.slug)),
    [planets, visited],
  );

  const markVisited = useCallback((slug: string) => {
    setVisited((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
  }, []);

  const focusVoyageStop = useCallback(
    (index: number) => {
      if (!planets.length) return;
      const safeIndex = Math.max(0, Math.min(index, planets.length - 1));
      setVoyageMode("riding");
      setActiveIndex(safeIndex);
      setAboutOpen(false);
      setContactOpen(false);
      setListMode(false);
    },
    [planets],
  );

  const startRide = useCallback(() => {
    focusVoyageStop(0);
  }, [focusVoyageStop]);

  const exitRide = useCallback(() => {
    setVoyageMode("idle");
    setActiveIndex(null);
  }, []);

  const goNext = useCallback(() => {
    if (!planets.length) return;
    if (voyageMode !== "riding" || activeIndex === null) {
      focusVoyageStop(0);
      return;
    }
    if (activeIndex >= planets.length - 1) {
      if (allProjectsOpened) {
        setVoyageMode("complete");
        setActiveIndex(null);
        return;
      }
      const firstUnopenedIndex = planets.findIndex((planet) => !visited.has(planet.slug));
      focusVoyageStop(firstUnopenedIndex >= 0 ? firstUnopenedIndex : 0);
      return;
    }
    focusVoyageStop(activeIndex + 1);
  }, [activeIndex, allProjectsOpened, focusVoyageStop, planets, visited, voyageMode]);

  const goPrevious = useCallback(() => {
    if (!planets.length) return;
    if (voyageMode === "complete") {
      focusVoyageStop(planets.length - 1);
      return;
    }
    if (voyageMode !== "riding" || activeIndex === null) return;
    focusVoyageStop(activeIndex - 1);
  }, [activeIndex, focusVoyageStop, planets.length, voyageMode]);

  const isGestureBlocked = useCallback(
    (target: EventTarget | null) => {
      if (overlayBlocked || voyageMode === "idle" || !(target instanceof Element)) return true;
      return !!target.closest(GESTURE_BLOCK_SELECTOR);
    },
    [overlayBlocked, voyageMode],
  );

  const navigateByGesture = useCallback(
    (direction: "next" | "previous") => {
      const now = performance.now();
      if (now - lastGestureAt.current < GESTURE_COOLDOWN_MS) return;
      lastGestureAt.current = now;
      if (direction === "next") goNext();
      else goPrevious();
    },
    [goNext, goPrevious],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" || isGestureBlocked(event.target)) {
        touchGesture.current = null;
        return;
      }
      touchGesture.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
    },
    [isGestureBlocked],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const start = touchGesture.current;
      touchGesture.current = null;
      if (!start || start.id !== event.pointerId || isGestureBlocked(event.target)) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < TOUCH_SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      navigateByGesture(dx < 0 ? "next" : "previous");
    },
    [isGestureBlocked, navigateByGesture],
  );

  const handlePointerCancel = useCallback(() => {
    touchGesture.current = null;
  }, []);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (isGestureBlocked(event.target)) return;
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < 8 || absX < absY * 1.1) return;

      event.preventDefault();
      window.clearTimeout(wheelGesture.current.timer);
      wheelGesture.current.deltaX += event.deltaX;
      wheelGesture.current.deltaY += event.deltaY;
      wheelGesture.current.timer = window.setTimeout(() => {
        wheelGesture.current.deltaX = 0;
        wheelGesture.current.deltaY = 0;
      }, WHEEL_RESET_MS);

      if (Math.abs(wheelGesture.current.deltaX) < WHEEL_SWIPE_THRESHOLD) return;
      const direction = wheelGesture.current.deltaX > 0 ? "next" : "previous";
      wheelGesture.current.deltaX = 0;
      wheelGesture.current.deltaY = 0;
      navigateByGesture(direction);
    },
    [isGestureBlocked, navigateByGesture],
  );

  // Determine the camera target based on current state. Voyage mode uses the
  // planet target path; project modals cover the canvas but keep the stop behind it.
  const cameraTarget: CameraTarget = useMemo(() => {
    if (aboutOpen) return { kind: "sun" };
    if (voyageMode === "complete") return { kind: "sun" };
    if (voyageMode === "riding" && activePlanet && planetPositions[activePlanet.slug]) {
      return {
        kind: "planet",
        positionRef: planetPositions[activePlanet.slug],
        offset: Math.max(24, activePlanet.size * 17),
      };
    }
    return voyageMode === "riding" ? { kind: "overview" } : { kind: "home" };
  }, [aboutOpen, activePlanet, planetPositions, voyageMode]);

  const openProject = useCallback((slug: string) => {
    markVisited(slug);
    setFocusedSlug(slug);
  }, [markVisited]);

  const closeProject = useCallback(() => {
    setFocusedSlug(null);
  }, []);

  const openActiveProject = useCallback(() => {
    if (activeSlug) openProject(activeSlug);
  }, [activeSlug, openProject]);

  const openAbout = () => setAboutOpen(true);
  const closeAbout = () => setAboutOpen(false);

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);

  const selectMissionPlanet = useCallback(
    (slug: string) => {
      const index = planets.findIndex((planet) => planet.slug === slug);
      if (voyageMode !== "idle" && index >= 0) {
        focusVoyageStop(index);
        return;
      }
      openProject(slug);
    },
    [focusVoyageStop, openProject, planets, voyageMode],
  );

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isControl = !!target?.closest("button, a, input, textarea, select, [contenteditable='true']");

      if (e.key === "Escape") {
        if (modalOpen || focusedSlug) closeProject();
        else if (aboutOpen) closeAbout();
        else if (contactOpen) closeContact();
        else if (listMode) setListMode(false);
        else if (voyageMode !== "idle") exitRide();
        return;
      }

      if (isControl || overlayBlocked || voyageMode === "idle") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrevious();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openActiveProject();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    aboutOpen,
    closeProject,
    contactOpen,
    exitRide,
    focusedSlug,
    goNext,
    goPrevious,
    listMode,
    modalOpen,
    openActiveProject,
    overlayBlocked,
    voyageMode,
  ]);

  const hoveredPlanet: PlanetConfig | null =
    (hoveredSlug && planets.find((p) => p.slug === hoveredSlug)) || null;
  const hoveredPositionRef =
    hoveredSlug && planetPositions[hoveredSlug] ? planetPositions[hoveredSlug] : null;

  return (
    <div
      className={`solar-root ${voyageMode !== "idle" ? "is-ride-active" : ""}`}
      dir={isHebrew ? "rtl" : "ltr"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onWheel={handleWheel}
    >
      <StarShapesProvider>
        <div className="solar-canvas-wrap" aria-hidden={listMode}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 8, 32], fov: 45, near: 0.1, far: 200 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <CameraExporter targetRef={cameraRef} />
            <SolarScene
              planets={planets}
              hoveredSlug={hoveredSlug}
              focusedSlug={focusedSlug ?? activeSlug}
              cameraTarget={cameraTarget}
              reducedMotion={reducedMotion}
              spacecraftVisible={!modalOpen}
              compact={compactScene}
              voyageMotion={voyageMode === "riding"}
              planetPositions={planetPositions}
              onPlanetHover={(slug) => setHoveredSlug(slug)}
              onPlanetClick={(slug) => openProject(slug)}
              onSunHover={(h) => setSunHovered(h)}
              onSunClick={() => openAbout()}
            />
          </Canvas>

          <PlanetHUD
            visible={!!hoveredSlug && !modalOpen && !aboutOpen}
            planet={hoveredPlanet}
            positionRef={hoveredPositionRef}
            cameraRef={cameraRef}
            isHebrew={isHebrew}
          />

          {sunHovered && !aboutOpen && !focusedSlug ? (
            <div
              className="solar-hud solar-hud-sun"
              dir={isHebrew ? "rtl" : "ltr"}
              style={{ left: "50%", top: "50%" }}
            >
              <span className="solar-hud-label">{preventOrphan(isHebrew ? "טייס" : "Pilot")}</span>
              <span className="solar-hud-title">
                {preventOrphan(isHebrew ? "עליי — יהונתן" : "About — Yehonatan")}
              </span>
            </div>
          ) : null}
        </div>

        {!listMode ? (
          <>
            <MissionControl
              planets={planets}
              visited={visited}
              hoveredSlug={hoveredSlug}
              focusedSlug={focusedSlug ?? activeSlug}
              listMode={listMode}
              rideActive={voyageMode === "riding"}
              rideComplete={voyageMode === "complete"}
              activeIndex={activeIndex}
              isHebrew={isHebrew}
              onPlanetSelect={selectMissionPlanet}
              onAboutSelect={openAbout}
              onListToggle={() => setListMode((v) => !v)}
              onStartRide={startRide}
              onPreviousStop={goPrevious}
              onNextStop={goNext}
              onExitRide={exitRide}
            />

            <VoyageHUD
              mode={voyageMode}
              project={activeProject}
              planet={activePlanet}
              activeIndex={activeIndex}
              total={planets.length}
              isHebrew={isHebrew}
              modalOpen={modalOpen}
              onPrevious={goPrevious}
              onNext={goNext}
              onOpenProject={openActiveProject}
              onExit={exitRide}
              onContact={() => {
                setVoyageMode("idle");
                setActiveIndex(null);
                openContact();
              }}
            />
          </>
        ) : null}

        <ListView
          open={listMode}
          projects={projects}
          planets={planets}
          isHebrew={isHebrew}
          onSelect={(slug) => {
            setListMode(false);
            openProject(slug);
          }}
          onClose={() => setListMode(false)}
        />

        <ProjectModal
          open={modalOpen}
          project={focusedProject}
          isHebrew={isHebrew}
          onClose={closeProject}
          onSelectProject={openProject}
        />

        <AboutDrawer open={aboutOpen} isHebrew={isHebrew} onClose={closeAbout} />
        <ContactDrawer open={contactOpen} isHebrew={isHebrew} onClose={closeContact} />

        {!listMode ? (
          <button
            type="button"
            className={`solar-phone ${contactOpen ? "is-active" : ""}`}
            onClick={openContact}
            aria-label={isHebrew ? "צור קשר" : "Contact"}
            title={isHebrew ? "צור קשר" : "Contact"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden focusable="false">
              <path
                fill="currentColor"
                d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2Z"
              />
            </svg>
          </button>
        ) : null}
      </StarShapesProvider>
    </div>
  );
}
