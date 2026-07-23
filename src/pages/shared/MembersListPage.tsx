import { useCallback, useMemo } from "react";
import { getCurrentUser } from "@/data/account";
import { ROLES } from "@/constants/roles";
import { getAcademies, getAcademiesByBrandId, getLocationIdsByBrandId } from "@/data/academies";
import {
  getMembersForScope,
  type AcademyMemberRole,
} from "@/data/academyMembers";
import MembersTable from "@/components/members/MembersTable";

interface MembersListPageProps {
  memberRole: Extract<AcademyMemberRole, "coach" | "student">;
  title: string;
}

export default function MembersListPage({ memberRole, title }: MembersListPageProps) {
  const user = getCurrentUser();

  const allowedAcademyIds = useMemo(() => {
    if (user?.role === ROLES.admin && user.academyId) {
      return getLocationIdsByBrandId(user.academyId);
    }
    return undefined;
  }, [user]);

  const academyOptions = useMemo(() => {
    if (user?.role === ROLES.admin && user.academyId) {
      return getAcademiesByBrandId(user.academyId).map((a) => ({
        id: a.id,
        label: `${a.name} — ${a.city}`,
      }));
    }
    return getAcademies().map((a) => ({
      id: a.id,
      label: `${a.name} — ${a.city}`,
    }));
  }, [user]);

  const getMembers = useCallback(
    () =>
      getMembersForScope(memberRole, {
        activeAcademyId: null,
        allowedAcademyIds,
      }),
    [memberRole, allowedAcademyIds]
  );

  const count = useMemo(() => getMembers().length, [getMembers]);

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden p-4 sm:p-6">
        <MembersTable
          memberRole={memberRole}
          getMembers={getMembers}
          title={title}
          showAcademyColumn={user?.role === ROLES.superadmin}
          showLocationColumn
          academyOptions={academyOptions}
          defaultAcademyId={academyOptions[0]?.id}
          subtitle={
            user?.role === ROLES.admin
              ? `Total ${title.toLowerCase()} across all your academy locations · ${count} records`
              : `Total ${title.toLowerCase()} across all academies · ${count} records`
          }
        />
      </div>
    </div>
  );
}
