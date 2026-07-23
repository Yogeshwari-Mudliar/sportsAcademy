import { X } from "lucide-react";
import type { AcademyMember, AcademyMemberRole } from "@/data/academyMembers";

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
    <ModalShell title={`View ${ROLE_LABELS[member.role]}`} onClose={onClose}>
      <div className="space-y-3 text-sm">
        <Detail label="Name" value={member.name} />
        <Detail label="Email" value={member.email} />
        <Detail label="Phone" value={member.phone} />
        <Detail label="Role" value={ROLE_LABELS[member.role]} />
        <Detail label="Joined On" value={member.joinedOn} />
        <Detail label="Status" value={member.status} />
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

interface MemberFormModalProps {
  mode: "add" | "edit";
  memberRole: AcademyMemberRole;
  initial?: Partial<AcademyMember>;
  defaultAcademyId?: number;
  academyOptions?: { id: number; label: string }[];
  onClose: () => void;
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    status: AcademyMember["status"];
    academyId?: number;
  }) => void;
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: {
      name: string;
      email: string;
      phone: string;
      status: AcademyMember["status"];
      academyId?: number;
    } = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      status: String(fd.get("status") ?? "Active") as AcademyMember["status"],
    };

    const academyIdRaw = fd.get("academyId");
    const resolvedAcademyId = academyIdRaw
      ? Number(academyIdRaw)
      : defaultAcademyId ?? initial?.academyId;

    if (resolvedAcademyId != null && !Number.isNaN(resolvedAcademyId)) {
      payload.academyId = resolvedAcademyId;
    }

    onSave(payload);
  };

  return (
    <ModalShell
      title={`${mode === "add" ? "Add" : "Edit"} ${ROLE_LABELS[memberRole]}`}
      onClose={onClose}
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
        <Field label="Name" name="name" defaultValue={initial?.name} required />
        <Field label="Email" name="email" type="email" defaultValue={initial?.email} required />
        <Field label="Phone" name="phone" defaultValue={initial?.phone} required />
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
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6">
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
      <p className="mt-0.5 font-medium text-[var(--text-primary)]">{value}</p>
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
