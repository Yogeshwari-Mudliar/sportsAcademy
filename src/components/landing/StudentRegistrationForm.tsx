import { useState } from "react";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { addStudentRegistration } from "@/data/studentRegistrations";
import type { AcademyWebsiteContent } from "@/data/academyWebsite";
import StudentAdmissionFields from "@/components/students/StudentAdmissionFields";
import { parseStudentAdmissionForm } from "@/constants/studentAdmission";

interface StudentRegistrationFormProps {
  data: AcademyWebsiteContent;
}

export default function StudentRegistrationForm({ data }: StudentRegistrationFormProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!data.showRegistrationForm) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const admission = parseStudentAdmissionForm(new FormData(e.currentTarget));

    if (!admission.name || !admission.email || !admission.phone) {
      setError("Please fill name, email and phone.");
      return;
    }

    addStudentRegistration({
      academyId: data.academyId,
      academyName: data.academyName,
      ...admission,
    });

    setSuccess(true);
    e.currentTarget.reset();
  };

  return (
    <section id="register" className="py-14 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
            style={{ background: "var(--landing-primary)" }}
          >
            <GraduationCap size={13} /> Student Admission
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-900">
            Student Registration
          </h2>
          <p className="mt-3 text-slate-600">
            Fill the form below to apply for admission at {data.academyName}.
          </p>
        </div>

        {success ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <CheckCircle2 className="mx-auto text-green-600 mb-3" size={40} />
            <h3 className="text-xl font-bold text-green-800">Registration Submitted</h3>
            <p className="mt-2 text-sm text-green-700">
              Thank you! Your registration is complete. You are now added as a student at{" "}
              {data.academyName}.
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--landing-accent)" }}
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-8 shadow-sm space-y-5"
          >
            <StudentAdmissionFields variant="landing" />

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-white shadow-md"
              style={{ background: "var(--landing-accent)" }}
            >
              Submit Registration
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
