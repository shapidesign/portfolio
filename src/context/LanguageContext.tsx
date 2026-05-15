"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "he";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isHebrew: boolean;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  isHebrew: false,
});

const STORAGE_KEY = "lang-override";

function readStoredLang(): Lang | null {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v === "he" || v === "en") return v;
  } catch {}
  return null;
}

function applyDirAndLang(lang: Lang) {
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = useState<Lang>("en");

  const setLang = useCallback((next: Lang) => {
    setLangRaw(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {}
    applyDirAndLang(next);
  }, []);

  useEffect(() => {
    const stored = readStoredLang();
    if (stored) {
      const timer = window.setTimeout(() => {
        setLangRaw(stored);
        applyDirAndLang(stored);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const initialTimer = window.setTimeout(() => {
      applyDirAndLang(lang);
    }, 0);

    if (typeof AbortSignal === "undefined" || !("timeout" in AbortSignal)) {
      window.clearTimeout(initialTimer);
      return;
    }

    let cancelled = false;
    const signal = AbortSignal.timeout(3000);

    fetch("https://ipapi.co/json/", { signal })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const detected: Lang = data?.country_code === "IL" ? "he" : "en";
        setLangRaw(detected);
        applyDirAndLang(detected);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      window.clearTimeout(initialTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LanguageContext.Provider value={{ lang, setLang, isHebrew: lang === "he" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
