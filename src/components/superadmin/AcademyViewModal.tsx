import { X, MapPin, Users, Mail, Phone, Globe, Building2 } from "lucide-react";
import { Country, State } from "country-state-city";
import type { AcademyListItem, AcademyStatus } from "@/types/academy";

const statusStyles: Record<AcademyStatus, string> = {
  Active: "bg-green-50 text-green-600 border border-green-100",
  Inactive: "bg-red-50 text-red-500 border border-red-100",
  Pending: "bg-orange-50 text-orange-600 border border-orange-100",
};

interface AcademyViewModalProps {
  academy: AcademyListItem;
  onClose: () => void;
  onEdit: (id: number) => void;
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)] break-words">
        {value}
      </p>
    </div>
  );
}

export default function AcademyViewModal({
  academy,
  onClose,
  onEdit,
}: AcademyViewModalProps) {
  const countryName =
    Country.getCountryByCode(academy.country)?.name ?? academy.country;
  const stateName =
    State.getStateByCodeAndCountry(academy.state, academy.country)?.name ??
    academy.state;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="academy-view-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 bg-white">
          <h2
            id="academy-view-title"
            className="text-lg font-bold text-[var(--text-primary)]"
          >
            Academy Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-5">
          <div className="flex items-start gap-3">
            <img
              src={academy.logo}
              alt=""
              className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] break-words">
                  {academy.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[academy.status]}`}
                >
                  {academy.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <Building2 size={12} /> {academy.type}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={12} /> {academy.studentCount} students
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Detail label="Owner" value={academy.ownerName} />
            <Detail label="Email" value={academy.email} />
            <Detail label="Phone" value={academy.phone} />
            <Detail label="Established" value={academy.establishedYear} />
            <Detail label="Country" value={countryName} />
            <Detail label="State" value={stateName} />
            <Detail label="City" value={academy.city} />
            <Detail label="Pincode" value={academy.pincode} />
          </div>

          {(academy.addressLine1 || academy.addressLine2) && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-1">
                <MapPin size={12} /> Address
              </p>
              <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                {[academy.addressLine1, academy.addressLine2]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}

          {academy.about && <Detail label="About" value={academy.about} />}

          {academy.facilities.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Facilities
              </p>
              <div className="flex flex-wrap gap-2">
                {academy.facilities.map((f) => (
                  <span
                    key={f}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(academy.website || academy.email || academy.phone) && (
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {academy.email && (
                <span className="inline-flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" /> {academy.email}
                </span>
              )}
              {academy.phone && (
                <span className="inline-flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" /> {academy.phone}
                </span>
              )}
              {academy.website && (
                <a
                  href={academy.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
                >
                  <Globe size={14} /> {academy.website}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse sm:flex-row gap-2 px-4 sm:px-6 py-4 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 text-xs font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-[var(--text-primary)] transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(academy.id)}
            className="h-10 px-4 text-xs font-semibold rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white transition sm:ml-auto"
          >
            Edit Academy
          </button>
        </div>
      </div>
    </div>
  );
}
