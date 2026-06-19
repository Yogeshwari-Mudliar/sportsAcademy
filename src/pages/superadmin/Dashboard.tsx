import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";
import StatsOverview from "../../components/dashboard/StatsOverview";
import "../../styles/superadmin/dashboard.css";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Dashboard",
        breadcrumb: ["Dashboard"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <StatsOverview />

      <div className="dashboard-panels">
        <div className="dashboard-card">
          <h3>Recent Academies</h3>
          <p>Latest academy registrations...</p>
        </div>

        <div className="dashboard-card">
          <h3>Revenue Analytics</h3>
          <p>Chart goes here...</p>
        </div>

        <div className="dashboard-card full-width">
          <h3>Pending Approvals</h3>
          <p>Approval queue...</p>
        </div>
      </div>
    </div>
  );
}
