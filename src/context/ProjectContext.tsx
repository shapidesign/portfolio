"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ProjectContextValue = {
  title: string | null;
  setTitle: (title: string | null) => void;
};

const ProjectContext = createContext<ProjectContextValue>({
  title: null,
  setTitle: () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [title, setTitleRaw] = useState<string | null>(null);
  const setTitle = useCallback((t: string | null) => setTitleRaw(t), []);

  return (
    <ProjectContext.Provider value={{ title, setTitle }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectTitle() {
  return useContext(ProjectContext);
}
