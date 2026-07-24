import { X } from "lucide-react";
import type { AcademyMember, AcademyMemberRole } from "@/data/academyMembers";
import StudentAdmissionFields from "@/components/students/StudentAdmissionFields";
import { parseStudentAdmissionForm } from "@/constants/studentAdmission";

const ROLE_LABELS: Record<AcademyMemberRole, string> = {
  student: "Student",
  coach: "Coach",
  admin: "Admin",
  accessory: "Accessory",
};

interface MemberViewModalProps {
  member: AcademyMember;
  onClose: () => void;
  onEdit: () => void;
}

export function MemberViewModal({ member, onClose, onEdit }: MemberViewModalProps) {
  return (
    <ModalShell title={`View ${ROLE_LABELS[member.role]}`} onClose={onClose} wide={member.role === "student"}>
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Detail label="Name" value={member.name} />
          <Detail label="Email" value={member.email} />
          <Detail label="Phone" value={member.phone} />
          <Detail label="Role" value={ROLE_LABELS[member.role]} />
          <Detail label="Joined On" value={member.joinedOn} />
          <Detail label="Status" value={member.status} />
          {member.role === "student" && (
            <>
              <Detail label="Batch" value={member.batchName || "Not assigned"} />
              <Detail label="Blood Group" value={member.bloodGroup || "—"} />
              <Detail label="Date of Birth" value={member.dateOfBirth || "—"} />
              <Detail label="Gender" value={member.gender || "—"} />
              <Detail label="Playing Role" value={member.playingRole || "—"} />
              <Detail label="Sport Experience" value={member.sportExperience || "—"} />
              <Detail label="Parent / Guardian" value={member.parentName || "—"} />
              <Detail label="Parent Phone" value={member.parentPhone || "—"} />
              <Detail label="City" value={member.city || "—"} />
              <Detail label="Address" value={member.address || "—"} />
            </>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="btn-ghost px-4 py-2 rounded-lg border" onClick={onClose}>
          Close
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold"
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
    </ModalShell>
  );
}

export type MemberFormSaveData = {
  name: string;
  email: string;
  phone: string;
  status: AcademyMember["status"];
  academyId?: number;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  parentName?: string;
  parentPhone?: string;
  playingRole?: string;
  sportExperience?: string;
  address?: string;
  city?: string;
};

interface MemberFormModalProps {
  mode: "add" | "edit";
  memberRole: AcademyMemberRole;
  initial?: Partial<AcademyMember>;
  defaultAcademyId?: number;
  academyOptions?: { id: number; label: string }[];
  onClose: () => void;
  onSave: (data: MemberFormSaveData) => void;
}

export function MemberFormModal({
  mode,
  memberRole,
  initial,
  defaultAcademyId,
  academyOptions,
  onClose,
  onSave,
}: MemberFormModalProps) {
  const isStudent = memberRole === "student";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload: MemberFormSaveData = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      status: String(fd.get("status") ?? "Active") as AcademyMember["status"],
    };

    const academyIdRaw = fd.get("academyId");
    const resolvedAcademyId = academyIdRaw
      ? Number(academyIdRaw)
      : defaultAcademyId ?? initial?.academyId;

    if (resolvedAcademyId != null && !Number.isNaN(resolvedAcademyId)) {
      payload.academyId = resolvedAcademyId;
    }

    if (isStudent) {
      const admission = parseStudentAdmissionForm(fd);
      payload.dateOfBirth = admission.dateOfBirth;
      payload.gender = admission.gender;
      payload.bloodGroup = admission.bloodGroup;
      payload.parentName = admission.parentName;
      payload.parentPhone = admission.parentPhone;
      payload.playingRole = admission.playingRole;
      payload.sportExperience = admission.sportExperience;
      payload.address = admission.address;
      payload.city = admission.city;
      // Identity fields come from admission when student form includes them
      payload.name = admission.name || payload.name;
      payload.email = admission.email || payload.email;
      payload.phone = admission.phone || payload.phone;
    }

    if (!payload.name || !payload.email || !payload.phone) return;

    onSave(payload);
  };

  return (
    <ModalShell
      title={`${mode === "add" ? "Add" : "Edit"} ${ROLE_LABELS[memberRole]}`}
      onClose={onClose}
      wide={isStudent}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "add" && academyOptions && academyOptions.length > 1 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
            <select
              name="academyId"
              defaultValue={defaultAcademyId ?? academyOptions[0].id}
              className="mt-1 w-full h-10 px-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-input)] text-sm"
            >
              {academyOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {isStudent ? (
          <StudentAdmissionFields
            variant="dashboard"
            initial={{
              name: initial?.name,
              email: initial?.email,
              phone: initial?.phone,
              dateOfBirth: initial?.dateOfBirth,
              gender: (initial?.gender as "Male" | "Female" | "Other") || "Male",
              bloodGroup: initial?.bloodGroup,
              parentName: initial?.parentName,
              parentPhone: initial?.parentPhone,
              playingRole: initial?.playingRole,
              sportExperience: initial?.sportExperience,
              address: initial?.address,
              city: initial?.city,
            }}
          />
        ) : (
          <>
            <Field label="Name" name="name" defaultValue={initial?.name} required />
            <Field label="Email" name="email" type="email" defaultValue={initial?.email} required />
            <Field label="Phone" name="phone" defaultValue={initial?.phone} required />
          </>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
          <select
            name="status"
            defaultValue={initial?.status ?? "Active"}
            className="mt-1 w-full h-10 px-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-input)] text-sm"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-2 rounded-lg border" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold">
            Save
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div
        className={`relative w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto ${
          wide ? "sm:max-w-2xl" : "sm:max-w-md"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase text-gray-400">{label}</p>
      <p className="mt-0.5 font-medium text-[var(--text-primary)] break-words">{value}</p>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 w-full h-10 px-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-input)] text-sm"
      />
    </div>
  );
}
