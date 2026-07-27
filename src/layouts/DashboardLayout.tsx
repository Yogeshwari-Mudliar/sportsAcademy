import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { AcademyProvider } from "../context/AcademyContext";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSidebarCollapsed } from "../features/ui/uiSlice";
import { applyThemeColor } from "../theme";
import "../styles/common/dashboardLayout.css";
import "../styles/common/header.css";

const MOBILE_MQ = "(max-width: 1024px)";

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const themeColor = useAppSelector((state) => state.ui.themeColor);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  useEffect(() => {
    applyThemeColor(themeColor);
  }, [themeColor]);

  // Sync sidebar: open on desktop, closed on mobile (only when breakpoint crosses)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => {
      dispatch(setSidebarCollapsed(mq.matches));
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [dispatch]);

  // Close drawer when route changes on mobile
  useEffect(() => {
    if (window.matchMedia(MOBILE_MQ).matches) {
      dispatch(setSidebarCollapsed(true));
    }
  }, [location.pathname, dispatch]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_MQ).matches;
    if (!mobile || sidebarCollapsed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarCollapsed]);

  return (
    <AcademyProvider>
      <div className="dashboard-layout">
        <button
          type="button"
          className={`sidebar-backdrop ${!sidebarCollapsed ? "visible" : ""}`}
          aria-label="Close menu"
          tabIndex={sidebarCollapsed ? -1 : 0}
          onClick={() => dispatch(setSidebarCollapsed(true))}
        />

        <Sidebar />

        <main className="dashboard-main">
          <Header />

          <section className="dashboard-content">
            <Outlet />
          </section>
        </main>
      </div>
    </AcademyProvider>
  );
}
