import { X } from "lucide-react";
import AcademyForm from "@/components/forms/AcademyForm";
import { updateAcademy } from "@/data/academies";
import { academyToFormData, type AcademyListItem, type AcademyFormData } from "@/types/academy";

interface AcademyEditModalProps {
  academy: AcademyListItem;
  onClose: () => void;
  onSaved?: (updated: AcademyListItem) => void;
}

export default function AcademyEditModal({ academy, onClose, onSaved }: AcademyEditModalProps) {
  const handleSubmit = (data: AcademyFormData) => {
    const list = updateAcademy(academy.id, data);
    const updated = list.find((a) => a.id === academy.id);
    if (updated) onSaved?.(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Edit Academy</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-3 sm:px-4 pb-4">
          <AcademyForm
            mode="edit"
            initialData={academyToFormData(academy)}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
