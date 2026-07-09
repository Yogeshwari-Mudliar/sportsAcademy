import { useOutletContext } from "react-router-dom";
import AcademyMembersTab from "@/components/academy/AcademyMembersTab";

interface OutletContext {
  academyId: number;
}

export default function AcademyAccessoryTab() {
  const { academyId } = useOutletContext<OutletContext>();
  return <AcademyMembersTab academyId={academyId} memberRole="accessory" />;
}
