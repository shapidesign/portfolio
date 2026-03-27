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
  const [lang, setLangRaw] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return readStoredLang() ?? "en";
  });

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
      applyDirAndLang(stored);
      return;
    }

    applyDirAndLang(lang);

    let cancelled = false;

    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
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
