import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface AcademyContextValue {
  activeAcademyId: number | null;
  setActiveAcademyId: (id: number | null) => void;
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

const STORAGE_KEY = "active_academy_id";

export function AcademyProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [activeAcademyId, setActiveAcademyIdState] = useState<number | null>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  });

  const setActiveAcademyId = useCallback((id: number | null) => {
    setActiveAcademyIdState(id);
    if (id === null) {
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, String(id));
    }
  }, []);

  useEffect(() => {
    const detailMatch = location.pathname.match(/\/academies\/(\d+)/);
    if (detailMatch) {
      setActiveAcademyId(Number(detailMatch[1]));
      return;
    }

    if (/\/dashboard\/?$/.test(location.pathname) || /\/academies\/?$/.test(location.pathname)) {
      setActiveAcademyId(null);
    }
  }, [location.pathname, setActiveAcademyId]);

  const value = useMemo(
    () => ({ activeAcademyId, setActiveAcademyId }),
    [activeAcademyId]
  );

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademyContext() {
  const ctx = useContext(AcademyContext);
  if (!ctx) {
    throw new Error("useAcademyContext must be used within AcademyProvider");
  }
  return ctx;
}
