import {
  BLOOD_GROUPS,
  PLAYING_ROLES,
  type StudentAdmissionData,
} from "@/constants/studentAdmission";

const inputClass =
  "mt-1 w-full h-10 sm:h-11 px-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-input)] text-sm outline-none focus:border-[var(--accent)]";

const landingInputClass =
  "mt-1 w-full h-11 px-3 rounded-2xl border border-violet-100 bg-white text-slate-800 placeholder:text-slate-400 text-sm outline-none focus:border-[var(--landing-accent)] shadow-sm";

interface StudentAdmissionFieldsProps {
  /** Prefill values (edit mode) */
  initial?: Partial<StudentAdmissionData>;
  /** Landing page uses slate styling */
  variant?: "dashboard" | "landing";
  /** Hide name/email/phone when parent already renders them (unused for now) */
  showIdentityFields?: boolean;
}

export default function StudentAdmissionFields({
  initial,
  variant = "dashboard",
  showIdentityFields = true,
}: StudentAdmissionFieldsProps) {
  const cls = variant === "landing" ? landingInputClass : inputClass;
  const labelCls =
    variant === "landing"
      ? "text-xs font-semibold uppercase text-slate-500"
      : "text-xs font-semibold uppercase text-gray-500";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showIdentityFields && (
          <>
            <Field
              label="Student Name *"
              name="name"
              required
              defaultValue={initial?.name}
              className={cls}
              labelClassName={labelCls}
            />
            <Field
              label="Email *"
              name="email"
              type="email"
              required
              defaultValue={initial?.email}
              className={cls}
              labelClassName={labelCls}
            />
            <Field
              label="Phone *"
              name="phone"
              required
              defaultValue={initial?.phone}
              className={cls}
              labelClassName={labelCls}
            />
          </>
        )}
        <Field
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          defaultValue={initial?.dateOfBirth}
          className={cls}
          labelClassName={labelCls}
        />
        <div>
          <label className={labelCls}>Gender</label>
          <select name="gender" className={cls} defaultValue={initial?.gender ?? "Male"}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Blood Group</label>
          <select
            name="bloodGroup"
            className={cls}
            defaultValue={initial?.bloodGroup ?? "Unknown"}
          >
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Playing Role / Position</label>
          <select
            name="playingRole"
            className={cls}
            defaultValue={initial?.playingRole ?? "Beginner"}
          >
            {PLAYING_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Parent / Guardian Name"
          name="parentName"
          defaultValue={initial?.parentName}
          className={cls}
          labelClassName={labelCls}
        />
        <Field
          label="Parent Phone"
          name="parentPhone"
          defaultValue={initial?.parentPhone}
          className={cls}
          labelClassName={labelCls}
        />
        <Field
          label="City"
          name="city"
          defaultValue={initial?.city}
          className={cls}
          labelClassName={labelCls}
        />
        <Field
          label="Sport Experience"
          name="sportExperience"
          placeholder="e.g. 2 years school / club level"
          defaultValue={initial?.sportExperience}
          className={cls}
          labelClassName={labelCls}
        />
      </div>
      <div>
        <label className={labelCls}>Address</label>
        <textarea
          name="address"
          rows={3}
          defaultValue={initial?.address}
          className={`${cls} py-2 h-auto`}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  className,
  labelClassName,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  className: string;
  labelClassName: string;
}) {
  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={className}
      />
    </div>
  );
}
