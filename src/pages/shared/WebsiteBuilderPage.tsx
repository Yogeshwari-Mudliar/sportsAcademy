import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setPageHeader } from "@/features/ui/uiSlice";
import { getCurrentUser } from "@/data/account";
import { ROLES } from "@/constants/roles";
import {
  getAcademies,
  getAcademiesByBrandId,
  getAcademyById,
} from "@/data/academies";
import {
  createDefaultWebsite,
  createWebsiteId,
  getAcademyWebsite,
  getLandingPageUrl,
  saveAcademyWebsite,
  type AcademyWebsiteContent,
  type WebsiteSocialAccount,
} from "@/data/academyWebsite";
import WebsiteImageField from "@/components/website/WebsiteImageField";

type StepId =
  | "basic"
  | "contact"
  | "slider"
  | "features"
  | "rules"
  | "gallery"
  | "faq";

const STEPS: { id: StepId; label: string; description: string }[] = [
  { id: "basic", label: "Basic Info", description: "Title, description & visibility" },
  { id: "contact", label: "Contact", description: "Phone, email & social links" },
  { id: "slider", label: "Slider", description: "Hero banner images" },
  { id: "features", label: "Features", description: "Why students should join" },
  { id: "rules", label: "Guidelines", description: "Admission rules" },
  { id: "gallery", label: "Gallery", description: "Academy photos" },
  { id: "faq", label: "FAQ", description: "Common questions" },
];

const SOCIAL_PLATFORMS: WebsiteSocialAccount["platform"][] = [
  "instagram",
  "facebook",
  "youtube",
  "twitter",
  "linkedin",
];

export default function WebsiteBuilderPage() {
  const dispatch = useAppDispatch();
  const user = getCurrentUser();
  const [step, setStep] = useState<StepId>("basic");
  const [copied, setCopied] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const academies = useMemo(() => {
    if (user?.role === ROLES.admin && user.academyId) {
      return getAcademiesByBrandId(user.academyId);
    }
    return getAcademies();
  }, [user]);

  const [academyId, setAcademyId] = useState<number>(() => academies[0]?.id ?? 1);
  const [form, setForm] = useState<AcademyWebsiteContent | null>(null);

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Website Builder",
        breadcrumb: ["Dashboard", "Website Builder"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const academy = getAcademyById(academyId);
    if (!academy) {
      setForm(null);
      return;
    }
    const existing = getAcademyWebsite(academyId);
    setForm(existing ?? createDefaultWebsite(academy));
    setSavedMsg("");
  }, [academyId]);

  if (!form) {
    return (
      <div className="dashboard-page p-6">
        <p className="text-sm text-gray-500">No academy available to configure.</p>
      </div>
    );
  }

  const landingUrl = getLandingPageUrl(form.academyId);

  const update = <K extends keyof AcademyWebsiteContent>(key: K, value: AcademyWebsiteContent[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = () => {
    if (!form.academyTitle.trim() || !form.academyName.trim()) {
      setSavedMsg("Please fill academy title and name in Basic Info.");
      setStep("basic");
      return;
    }
    saveAcademyWebsite(form);
    setSavedMsg("Website saved successfully.");
  };

  const handlePreview = () => {
    saveAcademyWebsite(form);
    window.open(landingUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(landingUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="dashboard-page w-full min-w-0 max-w-full space-y-4">
      <div className="bg-white rounded-2xl border border-[var(--border-soft)] p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Student Registration Website</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Fill website sections below. Public link opens like a full academy website.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleCopyLink} className="h-10 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Link"}
            </button>
            <button type="button" onClick={handlePreview} className="h-10 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5">
              <Eye size={14} /> Preview
            </button>
            <a
              href={landingUrl}
              target="_blank"
              rel="noreferrer"
              className="h-10 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <ExternalLink size={14} /> Open Site
            </a>
            <button
              type="button"
              onClick={handleSave}
              className="h-10 px-4 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Save size={14} /> Save Website
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <select
            value={academyId}
            onChange={(e) => setAcademyId(Number(e.target.value))}
            className="h-10 px-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-input)] text-sm"
          >
            {academies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.city}
              </option>
            ))}
          </select>
          <input
            readOnly
            value={landingUrl}
            className="flex-1 h-10 px-3 rounded-xl border border-[var(--border-soft)] bg-gray-50 text-xs text-gray-600"
          />
        </div>

        {savedMsg && (
          <div className="mt-3 text-sm font-medium text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
            {savedMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        <aside className="bg-white rounded-2xl border border-[var(--border-soft)] p-3 shadow-sm h-fit">
          <nav className="space-y-1">
            {STEPS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition ${
                  step === s.id
                    ? "bg-[var(--accent)] text-white"
                    : "hover:bg-gray-50 text-[var(--text-primary)]"
                }`}
              >
                <p className="text-sm font-semibold">{s.label}</p>
                <p className={`text-[11px] ${step === s.id ? "text-white/80" : "text-gray-400"}`}>
                  {s.description}
                </p>
              </button>
            ))}
          </nav>
        </aside>

        <section className="bg-white rounded-2xl border border-[var(--border-soft)] p-4 sm:p-6 shadow-sm">
          {step === "basic" && (
            <div className="space-y-4">
              <SectionTitle title="Basic Info" />
              <Field label="Page Title">
                <input
                  value={form.academyTitle}
                  onChange={(e) => update("academyTitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Academy Name">
                <input
                  value={form.academyName}
                  onChange={(e) => update("academyName", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={4}
                  className={`${inputClass} h-auto py-2`}
                />
              </Field>
              <WebsiteImageField
                label="Logo"
                recommendedSize="200 × 200 px (square)"
                maxMb={1}
                hint="Upload academy logo (or paste URL below)."
                value={form.logo}
                onChange={(url) => update("logo", url)}
              />
              <WebsiteImageField
                label="Banner Watermark Image"
                recommendedSize="800 × 800 px (PNG with transparent background preferred)"
                maxMb={2}
                hint="Optional soft watermark shown on the hero banner image only."
                value={form.heroWatermark || ""}
                onChange={(url) => update("heroWatermark", url)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Primary Color">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => update("primaryColor", e.target.value)}
                    className="h-10 w-full rounded-xl border"
                  />
                </Field>
                <Field label="Accent Color">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => update("accentColor", e.target.value)}
                    className="h-10 w-full rounded-xl border"
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.showRegistrationForm}
                  onChange={(e) => update("showRegistrationForm", e.target.checked)}
                />
                Show student registration form
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                />
                Website active (publicly visible)
              </label>
              <Field label="SEO Meta Title">
                <input
                  value={form.metaTitle}
                  onChange={(e) => update("metaTitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="SEO Meta Description">
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => update("metaDescription", e.target.value)}
                  rows={2}
                  className={`${inputClass} h-auto py-2`}
                />
              </Field>
            </div>
          )}

          {step === "contact" && (
            <div className="space-y-4">
              <SectionTitle title="Contact & Social" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Mobile">
                  <input
                    value={form.contactInfo.mobileNumber}
                    onChange={(e) =>
                      update("contactInfo", { ...form.contactInfo, mobileNumber: e.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={form.contactInfo.phoneNumber}
                    onChange={(e) =>
                      update("contactInfo", { ...form.contactInfo, phoneNumber: e.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={form.contactInfo.email}
                    onChange={(e) =>
                      update("contactInfo", { ...form.contactInfo, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Website">
                  <input
                    value={form.contactInfo.website}
                    onChange={(e) =>
                      update("contactInfo", { ...form.contactInfo, website: e.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between pt-2">
                <h4 className="font-semibold text-sm">Social Accounts</h4>
                <button
                  type="button"
                  className="text-xs font-semibold inline-flex items-center gap-1 text-[var(--accent)]"
                  onClick={() =>
                    update("socialAccounts", [
                      ...form.socialAccounts,
                      {
                        id: createWebsiteId(),
                        platform: "instagram",
                        url: "",
                        order: form.socialAccounts.length + 1,
                      },
                    ])
                  }
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-3">
                {form.socialAccounts.map((social, idx) => (
                  <div key={social.id} className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={social.platform}
                      onChange={(e) => {
                        const next = [...form.socialAccounts];
                        next[idx] = {
                          ...social,
                          platform: e.target.value as WebsiteSocialAccount["platform"],
                        };
                        update("socialAccounts", next);
                      }}
                      className={inputClass}
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <input
                      value={social.url}
                      onChange={(e) => {
                        const next = [...form.socialAccounts];
                        next[idx] = { ...social, url: e.target.value };
                        update("socialAccounts", next);
                      }}
                      placeholder="https://"
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      className="h-10 px-3 rounded-xl border text-red-500"
                      onClick={() =>
                        update(
                          "socialAccounts",
                          form.socialAccounts.filter((s) => s.id !== social.id)
                        )
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "slider" && (
            <ArraySection
              title="Hero Slider Images"
              onAdd={() =>
                update("sliderImages", [
                  ...form.sliderImages,
                  { id: createWebsiteId(), imageUrl: "", title: "", subtitle: "" },
                ])
              }
            >
              {form.sliderImages.map((slide, idx) => (
                <div key={slide.id} className="rounded-xl border p-3 space-y-2">
                  <WebsiteImageField
                    label={`Slide ${idx + 1} image`}
                    recommendedSize="1600 × 1000 px (landscape)"
                    maxMb={2.5}
                    hint="Hero banner photo for this slide."
                    value={slide.imageUrl}
                    onChange={(url) => {
                      const next = [...form.sliderImages];
                      next[idx] = { ...slide, imageUrl: url };
                      update("sliderImages", next);
                    }}
                  />
                  <input
                    value={slide.title ?? ""}
                    onChange={(e) => {
                      const next = [...form.sliderImages];
                      next[idx] = { ...slide, title: e.target.value };
                      update("sliderImages", next);
                    }}
                    placeholder="Slide title"
                    className={inputClass}
                  />
                  <input
                    value={slide.subtitle ?? ""}
                    onChange={(e) => {
                      const next = [...form.sliderImages];
                      next[idx] = { ...slide, subtitle: e.target.value };
                      update("sliderImages", next);
                    }}
                    placeholder="Slide subtitle"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-500 font-semibold"
                    onClick={() =>
                      update(
                        "sliderImages",
                        form.sliderImages.filter((s) => s.id !== slide.id)
                      )
                    }
                  >
                    Remove slide
                  </button>
                </div>
              ))}
            </ArraySection>
          )}

          {step === "features" && (
            <div className="space-y-4">
              <Field label="Section Title">
                <input
                  value={form.keyFeatures.title}
                  onChange={(e) =>
                    update("keyFeatures", { ...form.keyFeatures, title: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <ArraySection
                title="Features"
                onAdd={() =>
                  update("keyFeatures", {
                    ...form.keyFeatures,
                    features: [
                      ...form.keyFeatures.features,
                      { id: createWebsiteId(), title: "", description: "" },
                    ],
                  })
                }
              >
                {form.keyFeatures.features.map((feat, idx) => (
                  <div key={feat.id} className="rounded-xl border p-3 space-y-2">
                    <input
                      value={feat.title}
                      onChange={(e) => {
                        const features = [...form.keyFeatures.features];
                        features[idx] = { ...feat, title: e.target.value };
                        update("keyFeatures", { ...form.keyFeatures, features });
                      }}
                      placeholder="Feature title"
                      className={inputClass}
                    />
                    <textarea
                      value={feat.description}
                      onChange={(e) => {
                        const features = [...form.keyFeatures.features];
                        features[idx] = { ...feat, description: e.target.value };
                        update("keyFeatures", { ...form.keyFeatures, features });
                      }}
                      placeholder="Feature description"
                      rows={2}
                      className={`${inputClass} h-auto py-2`}
                    />
                    <button
                      type="button"
                      className="text-xs text-red-500 font-semibold"
                      onClick={() =>
                        update("keyFeatures", {
                          ...form.keyFeatures,
                          features: form.keyFeatures.features.filter((f) => f.id !== feat.id),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </ArraySection>
            </div>
          )}

          {step === "rules" && (
            <div className="space-y-4">
              <Field label="Section Title">
                <input
                  value={form.rules.title}
                  onChange={(e) => update("rules", { ...form.rules, title: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Section Description">
                <textarea
                  value={form.rules.description}
                  onChange={(e) => update("rules", { ...form.rules, description: e.target.value })}
                  rows={2}
                  className={`${inputClass} h-auto py-2`}
                />
              </Field>
              <ArraySection
                title="Guideline Items"
                onAdd={() =>
                  update("rules", {
                    ...form.rules,
                    items: [
                      ...form.rules.items,
                      { id: createWebsiteId(), title: "", description: "" },
                    ],
                  })
                }
              >
                {form.rules.items.map((item, idx) => (
                  <div key={item.id} className="rounded-xl border p-3 space-y-2">
                    <input
                      value={item.title}
                      onChange={(e) => {
                        const items = [...form.rules.items];
                        items[idx] = { ...item, title: e.target.value };
                        update("rules", { ...form.rules, items });
                      }}
                      placeholder="Rule title"
                      className={inputClass}
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const items = [...form.rules.items];
                        items[idx] = { ...item, description: e.target.value };
                        update("rules", { ...form.rules, items });
                      }}
                      placeholder="Rule description"
                      rows={2}
                      className={`${inputClass} h-auto py-2`}
                    />
                    <button
                      type="button"
                      className="text-xs text-red-500 font-semibold"
                      onClick={() =>
                        update("rules", {
                          ...form.rules,
                          items: form.rules.items.filter((r) => r.id !== item.id),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </ArraySection>
            </div>
          )}

          {step === "gallery" && (
            <ArraySection
              title="Gallery Images"
              onAdd={() =>
                update("galleryImages", [
                  ...form.galleryImages,
                  { id: createWebsiteId(), imageUrl: "", caption: "" },
                ])
              }
            >
              {form.galleryImages.map((img, idx) => (
                <div key={img.id} className="rounded-xl border p-3 space-y-2">
                  <input
                    value={img.imageUrl}
                    onChange={(e) => {
                      const next = [...form.galleryImages];
                      next[idx] = { ...img, imageUrl: e.target.value };
                      update("galleryImages", next);
                    }}
                    placeholder="Image URL"
                    className={inputClass}
                  />
                  <input
                    value={img.caption ?? ""}
                    onChange={(e) => {
                      const next = [...form.galleryImages];
                      next[idx] = { ...img, caption: e.target.value };
                      update("galleryImages", next);
                    }}
                    placeholder="Caption"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-500 font-semibold"
                    onClick={() =>
                      update(
                        "galleryImages",
                        form.galleryImages.filter((g) => g.id !== img.id)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </ArraySection>
          )}

          {step === "faq" && (
            <ArraySection
              title="FAQs"
              onAdd={() =>
                update("questionsAnswers", [
                  ...form.questionsAnswers,
                  { id: createWebsiteId(), question: "", answer: "" },
                ])
              }
            >
              {form.questionsAnswers.map((faq, idx) => (
                <div key={faq.id} className="rounded-xl border p-3 space-y-2">
                  <input
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...form.questionsAnswers];
                      next[idx] = { ...faq, question: e.target.value };
                      update("questionsAnswers", next);
                    }}
                    placeholder="Question"
                    className={inputClass}
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const next = [...form.questionsAnswers];
                      next[idx] = { ...faq, answer: e.target.value };
                      update("questionsAnswers", next);
                    }}
                    placeholder="Answer"
                    rows={3}
                    className={`${inputClass} h-auto py-2`}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-500 font-semibold"
                    onClick={() =>
                      update(
                        "questionsAnswers",
                        form.questionsAnswers.filter((q) => q.id !== faq.id)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </ArraySection>
          )}
        </section>
      </div>
    </div>
  );
}

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-input)] text-sm outline-none focus:border-[var(--accent)]";

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{title}</h3>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-gray-500">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ArraySection({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{title}</h4>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs font-semibold inline-flex items-center gap-1 text-[var(--accent)]"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
