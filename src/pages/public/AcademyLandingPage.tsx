import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getAcademyById } from "@/data/academies";
import { getPublicAcademyWebsite, type AcademyWebsiteContent } from "@/data/academyWebsite";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingSlider from "@/components/landing/LandingSlider";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingRules from "@/components/landing/LandingRules";
import LandingGallery from "@/components/landing/LandingGallery";
import LandingFAQ from "@/components/landing/LandingFAQ";
import StudentRegistrationForm from "@/components/landing/StudentRegistrationForm";

export default function AcademyLandingPage() {
  const { academyId } = useParams();
  const id = Number(academyId);
  const [data, setData] = useState<AcademyWebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  const academy = useMemo(() => (Number.isFinite(id) ? getAcademyById(id) : undefined), [id]);

  useEffect(() => {
    setLoading(true);
    if (!Number.isFinite(id)) {
      setData(null);
      setLoading(false);
      return;
    }
    const website = getPublicAcademyWebsite(id);
    setData(website);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!data) return;
    document.title = data.metaTitle || `${data.academyName} | Registration`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", data.metaDescription || data.description);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin" />
          <p className="text-slate-600">Loading academy website...</p>
        </div>
      </div>
    );
  }

  if (!data || !academy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Website not available</h1>
          <p className="text-slate-600 text-sm">
            This academy registration page is inactive or does not exist. Please contact the academy.
          </p>
        </div>
      </div>
    );
  }

  const themeStyle = {
    "--landing-primary": data.primaryColor || "#0f172a",
    "--landing-accent": data.accentColor || "#ff6b00",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-white" style={themeStyle}>
      <LandingHeader data={data} />
      <main>
        <LandingSlider data={data} />
        <StudentRegistrationForm data={data} />
        <LandingFeatures data={data} />
        <LandingRules data={data} />
        <LandingGallery data={data} />
        <LandingFAQ data={data} />
      </main>
      <LandingFooter data={data} academy={academy} />
    </div>
  );
}
