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
import LandingCursor from "@/components/landing/LandingCursor";
import LandingScrollEffects from "@/components/landing/LandingScrollEffects";

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
    setData(getPublicAcademyWebsite(id));
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
      <div className="landing-shell min-h-screen flex items-center justify-center bg-[#F5F3FF]">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium tracking-wide">Loading</p>
        </div>
      </div>
    );
  }

  if (!data || !academy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF] px-4">
        <div className="text-center max-w-md">
          <h1 className="landing-display text-2xl font-bold text-slate-900 mb-2">Website not available</h1>
          <p className="text-slate-600 text-sm">
            This academy registration page is inactive or does not exist. Please contact the academy.
          </p>
        </div>
      </div>
    );
  }

  const themeStyle = {
    "--landing-primary": data.primaryColor || "#312E81",
    "--landing-accent": data.accentColor || "#7C3AED",
  } as React.CSSProperties;

  return (
    <div className="landing-shell min-h-screen bg-[#F7F8FC] text-slate-900" style={themeStyle}>
      <LandingCursor />
      <LandingScrollEffects />
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
