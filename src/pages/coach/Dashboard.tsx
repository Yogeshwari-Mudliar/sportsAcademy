import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setPageHeader } from "../../features/ui/uiSlice";

export default function CoachDashboard() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Coach Dashboard",
        breadcrumb: ["Dashboard"],
      })
    );
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <div className="account-panel">
        <h2 className="account-panel-title">Coach Dashboard</h2>
        <p className="account-help">Coach account area.</p>
      </div>
    </div>
  );
}
