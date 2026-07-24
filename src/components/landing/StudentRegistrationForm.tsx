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
    <section id="register" className="relative py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10" data-reveal>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
            style={{ background: "var(--landing-accent)" }}
          >
            <GraduationCap size={13} /> Student Admission
          </span>
          <h2 className="landing-display mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Student Registration
          </h2>
          <div data-line className="mx-auto mt-5 h-1 w-16 rounded-full bg-[var(--landing-accent)] origin-left" />
          <p className="mt-5 text-slate-600 font-medium">
            Fill the form below to apply for admission at {data.academyName}.
          </p>
        </div>

        {success ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center" data-reveal>
            <CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={40} />
            <h3 className="text-xl font-bold text-emerald-800">Registration Submitted</h3>
            <p className="mt-2 text-sm text-emerald-700">
              Thank you! Your registration is complete. You are now added as a student at{" "}
              {data.academyName}.
            </p>
            <button
              type="button"
              data-magnetic
              onClick={() => setSuccess(false)}
              className="magnetic mt-5 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ background: "var(--landing-accent)" }}
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            data-reveal
            className="rounded-3xl border border-violet-100 bg-[#FBFBFF] p-5 sm:p-8 shadow-xl shadow-violet-100/50 space-y-5"
          >
            <StudentAdmissionFields variant="landing" />
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            <button
              type="submit"
              data-magnetic
              className="magnetic w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white shadow-lg shadow-violet-200"
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
