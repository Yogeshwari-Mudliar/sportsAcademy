import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import { useAppSelector } from "../app/hooks";
import { applyThemeColor } from "../theme";
import "../styles/common/dashboardLayout.css";
import "../styles/common/header.css";

export default function DashboardLayout() {
  const themeColor = useAppSelector((state) => state.ui.themeColor);

  useEffect(() => {
    applyThemeColor(themeColor);
  }, [themeColor]);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Header />

        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
