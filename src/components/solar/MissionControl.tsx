"use client";

import type { PlanetConfig } from "./Planet";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { preventOrphan } from "@/i18n/typography";
import { SITE_COPY_DEFAULTS, type SiteCopy } from "@/lib/site-copy";

type MissionControlProps = {
  siteCopy?: SiteCopy;
  planets: PlanetConfig[];
  visited: Set<string>;
  hoveredSlug: string | null;
  focusedSlug: string | null;
  listMode: boolean;
  rideActive: boolean;
  rideComplete: boolean;
  activeIndex: number | null;
  isHebrew: boolean;
  onPlanetSelect: (slug: string) => void;
  onAboutSelect: () => void;
  onShirtsSelect: () => void;
  onListToggle: () => void;
  onStartRide: () => void;
  onPreviousStop: () => void;
  onNextStop: () => void;
  onExitRide: () => void;
};

const STRINGS = {
  en: {
    steps: ["Guided ride", "Project planets", "Quick list"],
    rideHint: "Next and Previous move between stops. Escape exits the ride.",
    threeView: "3D View",
    missionControl: "Mission Control",
    progress: (v: number, t: number) => `${v}/${t} missions explored`,
    next: "Next",
    previous: "Previous",
    exitRide: "Exit Ride",
    restartRide: "Restart Ride",
    shirts: "Shirts",
  },
  he: {
    steps: ["מסלול מודרך", "כוכבי פרויקטים", "רשימה מהירה"],
    rideHint: "הבא והקודם מעבירים בין תחנות. Escape מחזיר אותך החוצה.",
    threeView: "לתצוגה מרחבית",
    missionControl: "בקרת משימה",
    progress: (v: number, t: number) => `${v}/${t} משימות נחקרו`,
    next: "הבא",
    previous: "הקודם",
    exitRide: "לצאת מהמסלול",
    restartRide: "להתחיל שוב",
    shirts: "חולצות",
  },
} as const;

export function MissionControl({
  siteCopy,
  planets,
  visited,
  hoveredSlug,
  focusedSlug,
  listMode,
  rideActive,
  rideComplete,
  activeIndex,
  isHebrew,
  onPlanetSelect,
  onAboutSelect,
  onShirtsSelect,
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
  };
  const currentStop = rideComplete ? planets.length : activeIndex === null ? 0 : activeIndex + 1;

  return (
    <>
      <div className="solar-info" dir={isHebrew ? "rtl" : "ltr"}>
        <span className="solar-info-eyebrow">{preventOrphan(t.universe)}</span>
        <h1 className="solar-info-title">{preventOrphan(t.title)}</h1>
        <p className="solar-info-text">{preventOrphan(t.intro)}</p>
        <ol className="solar-info-steps" aria-label={isHebrew ? "איך לחקור" : "How to explore"}>
          {t.steps.map((step) => (
            <li key={step}>{preventOrphan(step)}</li>
          ))}
        </ol>
        <button
          type="button"
          className="solar-info-cta"
          onClick={onStartRide}
          aria-label={rideComplete ? t.restartRide : t.startRide}
        >
          {preventOrphan(rideComplete ? t.restartRide : t.startRide)}
        </button>
        <p className="solar-info-hint">{preventOrphan(t.rideHint)}</p>
      </div>

      <div className="solar-actions">
        <button
          type="button"
          className={`solar-btn solar-btn-primary ${rideActive ? "is-active" : ""}`}
          onClick={rideActive ? onExitRide : onStartRide}
          aria-label={rideActive ? t.exitRide : t.startRide}
        >
          {preventOrphan(rideComplete ? t.restartRide : rideActive ? t.exitRide : t.startRide)}
        </button>
        <button type="button" className="solar-btn" onClick={onAboutSelect} aria-label={t.about}>
          {preventOrphan(t.about)}
        </button>
        <button
          type="button"
          className="solar-btn solar-btn-store"
          onClick={onShirtsSelect}
          aria-label={t.shirts}
          title={t.shirts}
        >
          <span aria-hidden>⚽</span>
          <span className="solar-btn-store-label">{preventOrphan(t.shirts)}</span>
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
        <div className="solar-mission-title">{preventOrphan(t.missionControl)}</div>
        <div className={`solar-ride-console ${rideActive ? "is-active" : ""}`}>
          <button type="button" onClick={onPreviousStop} disabled={!rideActive || activeIndex === 0}>
            {t.previous}
          </button>
          <span>
            {currentStop}/{planets.length}
          </span>
          <button type="button" onClick={onNextStop} disabled={!rideActive}>
            {t.next}
          </button>
        </div>
        <div className="solar-mission-grid">
          {planets.map((p) => {
            const isVisited = visited.has(p.slug);
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
                onClick={() => onPlanetSelect(p.slug)}
                title={title}
                aria-label={title}
              >
                <svg viewBox="0 0 45 43" aria-hidden focusable="false">
                  <path
                    d="M16.1348 3.41309C19.1227 -1.13732 25.8401 -1.13732 28.8281 3.41309L28.5186 10.1064C29.534 11.6529 31.0958 12.7732 32.8877 13.2334L39.4678 10.8838C44.6726 12.2206 46.7028 18.5295 43.2549 22.6514L36.6475 24.4316C35.4529 25.8598 34.8488 27.697 34.958 29.5557L39.1621 34.7588C39.4765 40.1103 34.1666 44.03 29.1572 42.1211L25.1846 36.4492C23.4435 35.7858 21.5193 35.7858 19.7783 36.4492L15.8057 42.1211C10.7963 44.03 5.48741 40.1103 5.80176 34.7588L10.0049 29.5557C10.1141 27.6969 9.51001 25.8598 8.31543 24.4316L1.70801 22.6514C-1.73991 18.5295 0.290269 12.2206 5.49512 10.8838L12.0752 13.2334C13.8671 12.7732 15.4289 11.6529 16.4443 10.1064L16.1348 3.41309Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            );
          })}
        </div>
        <div className="solar-mission-progress">{t.progress(visited.size, planets.length)}</div>
      </div>
    </>
  );
}
