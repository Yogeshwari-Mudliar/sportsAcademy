import { useCallback, useMemo } from "react";
import MembersTable from "@/components/members/MembersTable";
import { getMembersByAcademyAndRole, type AcademyMemberRole } from "@/data/academyMembers";

const ROLE_LABELS: Record<AcademyMemberRole, string> = {
  student: "Student",
  coach: "Coach",
  admin: "Admin",
  accessory: "Accessory",
};

interface AcademyMembersTabProps {
  academyId: number;
  memberRole: AcademyMemberRole;
}

export default function AcademyMembersTab({ academyId, memberRole }: AcademyMembersTabProps) {
  const getMembers = useCallback(
    () => getMembersByAcademyAndRole(academyId, memberRole),
    [academyId, memberRole]
  );

  const count = useMemo(() => getMembers().length, [getMembers]);

  return (
    <MembersTable
      memberRole={memberRole}
      getMembers={getMembers}
      defaultAcademyId={academyId}
      showLocationColumn={false}
      subtitle={`${count} ${ROLE_LABELS[memberRole].toLowerCase()}${count !== 1 ? "s" : ""} in this location`}
    />
  );
}
