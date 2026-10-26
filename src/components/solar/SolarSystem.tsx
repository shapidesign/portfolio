"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "../../types/project";
import { StarShapesProvider } from "./StarShapesProvider";
import { SolarScene } from "./SolarScene";
import { buildPlanetConfigs, outerMoonRadius } from "./planet-config";
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
import type { SiteCopy } from "@/lib/site-copy";

type SolarSystemProps = {
  projects: Project[];
  siteCopy?: SiteCopy;
};

type VoyageMode = "idle" | "riding" | "complete";

const GESTURE_COOLDOWN_MS = 720;
const TOUCH_SWIPE_THRESHOLD = 46;
const WHEEL_SWIPE_THRESHOLD = 72;
const WHEEL_RESET_MS = 180;
const GESTURE_BLOCK_SELECTOR =
  ".solar-actions, .solar-phone, .solar-mobile-tabbar, .solar-modal, .solar-drawer, .solar-list, button, a, input, textarea, select, [contenteditable='true']";

/** Captures the live camera ref from inside the Canvas so DOM overlays can project planet positions. */
function CameraExporter({ targetRef }: { targetRef: React.MutableRefObject<THREE.Camera | null> }) {
  const { camera } = useThree();
  useEffect(() => {
    targetRef.current = camera;
  }, [camera, targetRef]);
  return null;
}

export function SolarSystem({ projects, siteCopy }: SolarSystemProps) {
  const router = useRouter();
  const planets = useMemo(() => buildPlanetConfigs(projects), [projects]);
  const moons = useMemo(() => planets.flatMap((p) => p.moons ?? []), [planets]);
  const subjectByProject = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of planets) for (const m of p.moons ?? []) map.set(m.slug, p.slug);
    return map;
  }, [planets]);

  // Refs: live world position for each planet and moon (updated each frame from Planet)
  const planetPositions = useMemo(() => {
    const map: Record<string, React.MutableRefObject<THREE.Vector3>> = {};
    for (const p of [...planets, ...moons]) {
      map[p.slug] = { current: new THREE.Vector3() };
    }
    return map;
  }, [planets, moons]);

  const cameraRef = useRef<THREE.Camera | null>(null);
  const touchGesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const wheelGesture = useRef({ deltaX: 0, deltaY: 0, timer: 0 });
  const lastGestureAt = useRef(0);

  const { isHebrew } = useLanguage();

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [sunHovered, setSunHovered] = useState(false);
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);
  /** Subject zoomed into outside the guided ride. */
  const [zoomedId, setZoomedId] = useState<string | null>(null);
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
  const zoomedPlanet =
    voyageMode === "riding" ? activePlanet : planets.find((p) => p.slug === zoomedId) ?? null;
  const zoomedSlug = zoomedPlanet?.slug ?? null;

  const focusedProject = useMemo(
    () => (focusedSlug ? projects.find((p) => p.slug === focusedSlug) ?? null : null),
    [focusedSlug, projects],
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

  // A planet that becomes selected stops reporting hover, so drop any hover it held.
  const clearHover = useCallback(() => {
    setHoveredSlug(null);
    document.body.style.cursor = "";
  }, []);

  const focusVoyageStop = useCallback(
    (index: number) => {
      if (!planets.length) return;
      const safeIndex = Math.max(0, Math.min(index, planets.length - 1));
      markVisited(planets[safeIndex].slug);
      clearHover();
      setZoomedId(null);
      setVoyageMode("riding");
      setActiveIndex(safeIndex);
      setAboutOpen(false);
      setContactOpen(false);
      setListMode(false);
    },
    [clearHover, markVisited, planets],
  );

  /** Free exploration: zoom into a subject without starting the guided ride. */
  const zoomIdle = useCallback(
    (index: number) => {
      const planet = planets[index];
      if (!planet) return;
      markVisited(planet.slug);
      clearHover();
      setZoomedId(planet.slug);
      setAboutOpen(false);
    },
    [clearHover, markVisited, planets],
  );
  const zoomedIndex = zoomedId ? planets.findIndex((p) => p.slug === zoomedId) : -1;

  const startRide = useCallback(() => {
    focusVoyageStop(0);
  }, [focusVoyageStop]);

  const exitRide = useCallback(() => {
    setVoyageMode("idle");
    setActiveIndex(null);
    setZoomedId(null);
  }, []);

  const goNext = useCallback(() => {
    if (!planets.length) return;
    if (voyageMode === "idle") {
      if (zoomedIndex >= planets.length - 1) {
        if (allProjectsOpened) {
          setVoyageMode("complete");
          setZoomedId(null);
          return;
        }
        const firstUnopenedIndex = planets.findIndex((planet) => !visited.has(planet.slug));
        zoomIdle(firstUnopenedIndex >= 0 ? firstUnopenedIndex : 0);
        return;
      }
      zoomIdle(Math.min(zoomedIndex + 1, planets.length - 1));
      return;
    }
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
  }, [activeIndex, allProjectsOpened, focusVoyageStop, planets, visited, voyageMode, zoomIdle, zoomedIndex]);

  const goPrevious = useCallback(() => {
    if (!planets.length) return;
    if (voyageMode === "complete") {
      focusVoyageStop(planets.length - 1);
      return;
    }
    if (voyageMode === "idle") {
      if (zoomedIndex > 0) zoomIdle(zoomedIndex - 1);
      else if (zoomedIndex === 0) setZoomedId(null);
      else zoomIdle(planets.length - 1);
      return;
    }
    if (voyageMode !== "riding" || activeIndex === null) return;
    if (activeIndex === 0) {
      exitRide();
      return;
    }
    focusVoyageStop(activeIndex - 1);
  }, [activeIndex, exitRide, focusVoyageStop, planets.length, voyageMode, zoomIdle, zoomedIndex]);

  const isGestureBlocked = useCallback(
    (target: EventTarget | null, allowIdle = false) => {
      if (overlayBlocked || (!allowIdle && voyageMode === "idle") || !(target instanceof Element)) return true;
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
      if (event.pointerType === "mouse" || isGestureBlocked(event.target, true)) {
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
      if (!start || start.id !== event.pointerId || isGestureBlocked(event.target, true)) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < TOUCH_SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      const nextOnLeftSwipe = !isHebrew;
      const isLeftSwipe = dx < 0;
      navigateByGesture(isLeftSwipe === nextOnLeftSwipe ? "next" : "previous");
    },
    [isGestureBlocked, isHebrew, navigateByGesture],
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
    if (zoomedPlanet && planetPositions[zoomedPlanet.slug]) {
      // Frame the planet plus its outermost moon orbit (fov 45 => ~2.4x radius to fit).
      return {
        kind: "planet",
        positionRef: planetPositions[zoomedPlanet.slug],
        // Portrait screens crop horizontally, so pull back further to keep moons in frame.
        offset: Math.max(7, outerMoonRadius(zoomedPlanet) * (compactScene ? 3.6 : 2.2)),
      };
    }
    return voyageMode === "riding" ? { kind: "overview" } : { kind: "home" };
  }, [aboutOpen, compactScene, zoomedPlanet, planetPositions, voyageMode]);

  const openProject = useCallback((slug: string) => {
    const subject = subjectByProject.get(slug);
    if (subject) markVisited(subject);
    // Projects with their own page (e.g. /kibbutz-type/) navigate instead of opening the modal.
    const href = projects.find((p) => p.slug === slug)?.href;
    if (href) {
      router.push(href);
      return;
    }
    setFocusedSlug(slug);
  }, [markVisited, projects, router, subjectByProject]);

  const closeProject = useCallback(() => {
    setFocusedSlug(null);
  }, []);

  const openActiveProject = useCallback(() => {
    const first = zoomedPlanet?.moons?.[0];
    if (first) openProject(first.slug);
  }, [zoomedPlanet, openProject]);

  const zoomInto = useCallback(
    (slug: string) => {
      const index = planets.findIndex((planet) => planet.slug === slug);
      if (index < 0) return;
      if (voyageMode === "riding") {
        focusVoyageStop(index);
        return;
      }
      zoomIdle(index);
    },
    [focusVoyageStop, planets, voyageMode, zoomIdle],
  );

  const zoomOut = useCallback(() => setZoomedId(null), []);

  const openAbout = () => setAboutOpen(true);
  const closeAbout = () => setAboutOpen(false);

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);


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
        else if (zoomedId) zoomOut();
        else if (voyageMode !== "idle") exitRide();
        return;
      }

      if (isControl || overlayBlocked || (voyageMode === "idle" && !zoomedId)) return;
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
    zoomedId,
    zoomOut,
  ]);

  const hoveredPlanet: PlanetConfig | null =
    (hoveredSlug && [...planets, ...moons].find((p) => p.slug === hoveredSlug)) || null;
  const hoveredIsMoon = !!hoveredSlug && subjectByProject.has(hoveredSlug);
  const hoveredMoonCount = hoveredPlanet?.moons?.length ?? 0;
  const hoverLabel = hoveredIsMoon
    ? isHebrew
      ? "פרויקט"
      : "Project"
    : isHebrew
      ? `תחום · ${hoveredMoonCount} ${hoveredMoonCount === 1 ? "פרויקט" : "פרויקטים"}`
      : `Subject · ${hoveredMoonCount} ${hoveredMoonCount === 1 ? "project" : "projects"}`;
  const hoveredPositionRef =
    hoveredSlug && planetPositions[hoveredSlug] ? planetPositions[hoveredSlug] : null;

  return (
    <div
      className={`solar-root ${
        voyageMode !== "idle" || (compactScene && zoomedId) ? "is-ride-active" : ""
      }`}
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
            onPointerMissed={() => {
              if (zoomedId && !modalOpen) zoomOut();
            }}
          >
            <CameraExporter targetRef={cameraRef} />
            <SolarScene
              planets={planets}
              hoveredSlug={hoveredSlug}
              focusedSlug={focusedSlug ?? zoomedSlug}
              zoomedSlug={zoomedSlug}
              cameraTarget={cameraTarget}
              reducedMotion={reducedMotion}
              spacecraftVisible={!modalOpen}
              compact={compactScene}
              voyageMotion={voyageMode === "riding" || zoomedId !== null}
              planetPositions={planetPositions}
              onPlanetHover={setHoveredSlug}
              onPlanetClick={(slug) => zoomInto(slug)}
              onMoonClick={openProject}
              onSunHover={(h) => setSunHovered(h)}
              onSunClick={openAbout}
            />
          </Canvas>

          <PlanetHUD
            visible={!!hoveredSlug && !modalOpen && !aboutOpen}
            planet={hoveredPlanet}
            positionRef={hoveredPositionRef}
            cameraRef={cameraRef}
            isHebrew={isHebrew}
            label={hoverLabel}
          />

          {zoomedId && voyageMode === "idle" && !modalOpen ? (
            <button type="button" className="solar-btn solar-zoom-back" onClick={zoomOut}>
              {preventOrphan(isHebrew ? "חזרה למערכת" : "Back to system")}
            </button>
          ) : null}

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
              siteCopy={siteCopy}
              planets={planets}
              projectCount={projects.length}
              visited={visited}
              hoveredSlug={hoveredSlug}
              focusedSlug={zoomedSlug}
              zoomedPlanet={zoomedPlanet}
              listMode={listMode}
              rideActive={voyageMode === "riding"}
              rideComplete={voyageMode === "complete"}
              activeIndex={voyageMode === "riding" ? activeIndex : zoomedIndex >= 0 ? zoomedIndex : null}
              isHebrew={isHebrew}
              onPlanetSelect={zoomInto}
              onMoonSelect={openProject}
              onAboutSelect={openAbout}
              onListToggle={() => setListMode((v) => !v)}
              onStartRide={startRide}
              onPreviousStop={goPrevious}
              onNextStop={goNext}
              onExitRide={exitRide}
            />

            <VoyageHUD
              mode={compactScene && voyageMode === "idle" && zoomedPlanet ? "riding" : voyageMode}
              planet={compactScene ? zoomedPlanet : activePlanet}
              activeIndex={
                voyageMode === "riding"
                  ? activeIndex
                  : compactScene && zoomedIndex >= 0
                    ? zoomedIndex
                    : null
              }
              total={planets.length}
              isHebrew={isHebrew}
              modalOpen={modalOpen}
              onPrevious={goPrevious}
              onNext={goNext}
              onOpenProject={openProject}
              onExit={exitRide}
              onContact={() => {
                exitRide();
                openContact();
              }}
            />
          </>
        ) : null}

        <ListView
          open={listMode}
          projects={projects}
          planets={moons}
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
          allProjects={projects}
          isHebrew={isHebrew}
          onClose={closeProject}
          onSelectProject={openProject}
        />

        <AboutDrawer open={aboutOpen} isHebrew={isHebrew} siteCopy={siteCopy} onClose={closeAbout} />
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

        <nav
          className="solar-mobile-tabbar"
          aria-label={isHebrew ? "ניווט מהיר" : "Mobile navigation"}
          dir={isHebrew ? "rtl" : "ltr"}
        >
          <button
            type="button"
            className={`solar-mobile-tab ${!listMode && !aboutOpen && !contactOpen ? "is-active" : ""}`}
            onClick={() => {
              setListMode(false);
              setAboutOpen(false);
              setContactOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-24 12 12)" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>{isHebrew ? "מסלול" : "Explore"}</span>
          </button>
          <button
            type="button"
            className={`solar-mobile-tab ${listMode ? "is-active" : ""}`}
            onClick={() => {
              setAboutOpen(false);
              setContactOpen(false);
              setListMode((v) => !v);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3.5" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
              <rect x="13.5" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
              <rect x="3.5" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
              <rect x="13.5" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            <span>{isHebrew ? `עבודות (${projects.length})` : `Work (${projects.length})`}</span>
          </button>
          <button
            type="button"
            className={`solar-mobile-tab ${aboutOpen ? "is-active" : ""}`}
            onClick={() => {
              setListMode(false);
              setContactOpen(false);
              setAboutOpen((v) => !v);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M5 19.5c1.6-3.2 4.1-4.8 7-4.8s5.4 1.6 7 4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <span>{isHebrew ? "אודות" : "About"}</span>
          </button>
          <button
            type="button"
            className={`solar-mobile-tab ${contactOpen ? "is-active" : ""}`}
            onClick={() => {
              setListMode(false);
              setAboutOpen(false);
              setContactOpen((v) => !v);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{isHebrew ? "קשר" : "Contact"}</span>
          </button>
        </nav>
      </StarShapesProvider>
    </div>
  );
}
