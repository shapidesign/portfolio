"use client";

import type { PlanetConfig } from "./Planet";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { preventOrphan } from "@/i18n/typography";
import { SITE_COPY_DEFAULTS, type SiteCopy } from "@/lib/site-copy";

type MissionControlProps = {
  siteCopy?: SiteCopy;
  planets: PlanetConfig[];
  projectCount?: number;
  visited: Set<string>;
  hoveredSlug: string | null;
  focusedSlug: string | null;
  /** When set, the markers are this subject's project moons. */
  zoomedPlanet: PlanetConfig | null;
  listMode: boolean;
  rideActive: boolean;
  rideComplete: boolean;
  activeIndex: number | null;
  isHebrew: boolean;
  onPlanetSelect: (slug: string) => void;
  onMoonSelect: (slug: string) => void;
  onAboutSelect: () => void;
  onListToggle: () => void;
  onStartRide: () => void;
  onPreviousStop: () => void;
  onNextStop: () => void;
  onExitRide: () => void;
};

const SHORT_SUBJECT_LABELS: Record<string, { en: string; he: string }> = {
  "subject-brand": { en: "Brand", he: "מיתוג" },
  "subject-type": { en: "Type", he: "טיפוגרפיה" },
  "subject-web": { en: "Web", he: "אתרים" },
  "subject-experimental": { en: "Lab", he: "ניסיוני" },
};

const STRINGS = {
  en: {
    orbitProjects: (n: number) => `${n} ${n === 1 ? "project" : "projects"} in this orbit`,
    rideHint: "Next and Previous move between stops. Escape exits the ride.",
    mobileSwipeHint: "Swipe or tap a category below to explore",
    allProjectsChip: (n: number) => `All ${n} projects`,
    threeView: "3D View",
    missionControl: "Mission Control",
    progress: (v: number, t: number) => `${v}/${t} missions explored`,
    next: "Next",
    previous: "Previous",
    exitRide: "Exit Ride",
    restartRide: "Restart Ride",
  },
  he: {
    orbitProjects: (n: number) => (n === 1 ? "פרויקט אחד במסלול" : `${n} פרויקטים במסלול`),
    rideHint: "הבא והקודם מעבירים בין תחנות. Escape מחזיר אותך החוצה.",
    mobileSwipeHint: "החליקו או בחרו תחום למטה",
    allProjectsChip: (n: number) => `כל ${n} הפרויקטים`,
    threeView: "לתצוגה מרחבית",
    missionControl: "בקרת משימה",
    progress: (v: number, t: number) => `${v}/${t} משימות נחקרו`,
    next: "הבא",
    previous: "הקודם",
    exitRide: "לצאת מהמסלול",
    restartRide: "להתחיל שוב",
  },
} as const;

export function MissionControl({
  siteCopy,
  planets,
  projectCount = 6,
  visited,
  hoveredSlug,
  focusedSlug,
  zoomedPlanet,
  listMode,
  rideActive,
  rideComplete,
  activeIndex,
  isHebrew,
  onPlanetSelect,
  onMoonSelect,
  onAboutSelect,
  onListToggle,
  onStartRide,
  onPreviousStop,
  onNextStop,
  onExitRide,
}: MissionControlProps) {
  const base = isHebrew ? STRINGS.he : STRINGS.en;
  // Admin-editable copy: stored value wins, defaults otherwise.
  const copy = (enKey: string, heKey: string) => {
    const key = isHebrew ? heKey : enKey;
    const value = siteCopy?.[key]?.trim();
    return value || SITE_COPY_DEFAULTS[key];
  };
  const t = {
    ...base,
    universe: copy("homeEyebrow", "heHomeEyebrow"),
    title: copy("homeTitle", "heHomeTitle"),
    intro: copy("homeIntro", "heHomeIntro"),
    startRide: copy("homeCtaStart", "heHomeCtaStart"),
    about: copy("homeCtaAbout", "heHomeCtaAbout"),
    listView: copy("homeCtaList", "heHomeCtaList"),
    brandName: copy("aboutPopupName", "heAboutPopupName"),
  };
  const currentStop = rideComplete ? planets.length : activeIndex === null ? 0 : activeIndex + 1;
  const activeSubjectMode = rideActive || rideComplete || zoomedPlanet !== null;

  return (
    <>
      <div className="solar-mobile-topbar" dir={isHebrew ? "rtl" : "ltr"}>
        <button
          type="button"
          className="solar-mobile-brand"
          onClick={onAboutSelect}
          aria-label={t.about}
        >
          <span className="solar-mobile-brand-dot" aria-hidden />
          <span className="solar-mobile-brand-name">{preventOrphan(t.brandName)}</span>
        </button>
        <div className="solar-mobile-top-actions">
          <button
            type="button"
            className="solar-btn solar-mobile-list-pill"
            onClick={onListToggle}
            aria-label={listMode ? t.threeView : t.listView}
          >
            {preventOrphan(t.listView)}
          </button>
          <LanguageToggle />
        </div>
      </div>

      <div className="solar-info" dir={isHebrew ? "rtl" : "ltr"}>
        <span className="solar-info-eyebrow">{preventOrphan(t.universe)}</span>
        <h1 className="solar-info-title">{preventOrphan(t.title)}</h1>
        <p className="solar-info-text">{preventOrphan(t.intro)}</p>
        <p className="solar-info-mobile-sub">{preventOrphan(t.mobileSwipeHint)}</p>
        <div className="solar-info-cta-group">
          <button
            type="button"
            className="solar-info-cta"
            onClick={onStartRide}
            aria-label={rideComplete ? t.restartRide : t.startRide}
          >
            {preventOrphan(rideComplete ? t.restartRide : t.startRide)}
            <span aria-hidden>{isHebrew ? "←" : "→"}</span>
          </button>
          <button
            type="button"
            className="solar-info-secondary-chip"
            onClick={onListToggle}
          >
            {preventOrphan(t.allProjectsChip(projectCount))}
          </button>
        </div>
        <p className="solar-info-hint">{preventOrphan(t.rideHint)}</p>
      </div>

      <div className="solar-actions">
        <button
          type="button"
          className={`solar-btn solar-btn-primary ${activeSubjectMode ? "is-active" : ""}`}
          onClick={activeSubjectMode ? onExitRide : onStartRide}
          aria-label={activeSubjectMode ? t.exitRide : t.startRide}
        >
          {preventOrphan(rideComplete ? t.restartRide : activeSubjectMode ? t.exitRide : t.startRide)}
        </button>
        <button type="button" className="solar-btn" onClick={onAboutSelect} aria-label={t.about}>
          {preventOrphan(t.about)}
        </button>
        <button
          type="button"
          className={`solar-btn ${listMode ? "is-active" : ""}`}
          onClick={onListToggle}
          aria-label={listMode ? t.threeView : t.listView}
        >
          {preventOrphan(listMode ? t.threeView : t.listView)}
        </button>
        <LanguageToggle />
      </div>

      <div className="solar-mission-control" dir={isHebrew ? "rtl" : "ltr"}>
        <div className="solar-mission-title">
          {preventOrphan(
            zoomedPlanet ? (isHebrew && zoomedPlanet.heTitle) || zoomedPlanet.title : t.missionControl,
          )}
        </div>
        <div className={`solar-ride-console ${rideActive || zoomedPlanet ? "is-active" : ""}`}>
          <button
            type="button"
            onClick={onPreviousStop}
            disabled={rideComplete ? false : activeIndex === null}
          >
            {t.previous}
          </button>
          <span>
            {currentStop}/{planets.length}
          </span>
          <button
            type="button"
            onClick={onNextStop}
            disabled={!rideActive && !rideComplete && !zoomedPlanet && activeIndex === planets.length - 1}
          >
            {t.next}
          </button>
        </div>
        <div className="solar-mission-grid solar-mission-grid--desktop">
          {(zoomedPlanet?.moons ?? planets).map((p) => {
            const isVisited = !!zoomedPlanet || visited.has(p.slug);
            const isHovered = hoveredSlug === p.slug;
            const isFocused = focusedSlug === p.slug;
            const title = (isHebrew && p.heTitle) || p.title;
            return (
              <button
                key={p.slug}
                type="button"
                className={`solar-mission-dot ${isVisited ? "is-visited" : ""} ${
                  isHovered ? "is-hovered" : ""
                } ${isFocused ? "is-focused" : ""}`}
                style={{ ["--dot-accent" as string]: p.accent }}
                onClick={() => (zoomedPlanet ? onMoonSelect(p.slug) : onPlanetSelect(p.slug))}
                title={title}
                aria-label={title}
              >
                <span className={`solar-mission-orb ${p.ringed ? "is-ringed" : ""}`} aria-hidden />
              </button>
            );
          })}
        </div>
        <div className="solar-mission-grid solar-mission-grid--mobile">
          {planets.map((p, idx) => {
            const isVisited = visited.has(p.slug);
            const isFocused = focusedSlug === p.slug || activeIndex === idx;
            const title = (isHebrew && p.heTitle) || p.title;
            const shortEntry = SHORT_SUBJECT_LABELS[p.slug];
            const shortLabel = shortEntry ? (isHebrew ? shortEntry.he : shortEntry.en) : title;
            return (
              <button
                key={p.slug}
                type="button"
                className={`solar-mission-dot solar-mission-subject-pill ${
                  isVisited ? "is-visited" : ""
                } ${isFocused ? "is-focused" : ""}`}
                style={{ ["--dot-accent" as string]: p.accent }}
                onClick={() => onPlanetSelect(p.slug)}
                title={title}
                aria-label={title}
                aria-pressed={isFocused}
              >
                <span className={`solar-mission-orb ${p.ringed ? "is-ringed" : ""}`} aria-hidden />
                <span className="solar-mission-subject-label">{preventOrphan(shortLabel)}</span>
              </button>
            );
          })}
        </div>
        <div className="solar-mission-progress">
          {zoomedPlanet
            ? t.orbitProjects(zoomedPlanet.moons?.length ?? 0)
            : t.progress(visited.size, planets.length)}
        </div>
      </div>
    </>
  );
}
