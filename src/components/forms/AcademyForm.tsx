import { useState } from "react";
import { ChevronDown, CalendarDays, Plus } from "lucide-react";
import FacilitySelector from "./FacilitySelector";
import ImageUploader from "./ImageUploader";
import {
  ACADEMY_TYPES,
  INDIAN_STATES,
  type AcademyFormData,
} from "../../types/academy";
import "../../styles/superadmin/createAcademy.css";

const EMPTY_FORM: AcademyFormData = {
  name: "",
  ownerName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  about: "",
  establishedYear: "",
  academyType: "",
  facilities: [],
  website: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

export default function AcademyForm() {
  const [form, setForm] = useState<AcademyFormData>(EMPTY_FORM);

  const update = <K extends keyof AcademyFormData>(
    key: K,
    value: AcademyFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleFacility = (facility: string) =>
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create Academy", form);
  };

  return (
    <form className="academy-form" onSubmit={handleSubmit}>
      <div className="academy-grid">
        {/* Left: Academy Information */}
        <section className="panel">
          <h2 className="panel-title">Academy Information</h2>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">
                Academy Name<span className="required">*</span>
              </label>
              <input
                className="form-input"
                placeholder="Enter academy name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Owner Name<span className="required">*</span>
              </label>
              <input
                className="form-input"
                placeholder="Enter owner full name"
                value={form.ownerName}
                onChange={(e) => update("ownerName", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">
                Email Address<span className="required">*</span>
              </label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Phone Number<span className="required">*</span>
              </label>
              <div className="phone-input">
                <span className="phone-prefix">
                  🇮🇳 +91 <ChevronDown size={14} />
                </span>
                <input
                  className="form-input"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">
                Address Line 1<span className="required">*</span>
              </label>
              <input
                className="form-input"
                placeholder="House no, Building, Street"
                value={form.addressLine1}
                onChange={(e) => update("addressLine1", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Address Line 2</label>
              <input
                className="form-input"
                placeholder="Area, Landmark (Optional)"
                value={form.addressLine2}
                onChange={(e) => update("addressLine2", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row three">
            <div className="form-field">
              <label className="form-label">
                City<span className="required">*</span>
              </label>
              <input
                className="form-input"
                placeholder="Enter city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                State<span className="required">*</span>
              </label>
              <div className="select-wrap">
                <select
                  className="form-input"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="select-caret" />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                Pincode<span className="required">*</span>
              </label>
              <input
                className="form-input"
                placeholder="Enter pincode"
                value={form.pincode}
                onChange={(e) => update("pincode", e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">About Academy</label>
            <div className="textarea-wrap">
              <textarea
                className="form-input form-textarea"
                placeholder="Write something about the academy..."
                maxLength={500}
                value={form.about}
                onChange={(e) => update("about", e.target.value)}
              />
              <span className="char-count">{form.about.length}/500</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Established Year</label>
              <div className="select-wrap">
                <CalendarDays size={16} className="input-leading-icon" />
                <input
                  className="form-input with-icon"
                  placeholder="Select year"
                  value={form.establishedYear}
                  onChange={(e) => update("establishedYear", e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                Academy Type<span className="required">*</span>
              </label>
              <div className="select-wrap">
                <select
                  className="form-input"
                  value={form.academyType}
                  onChange={(e) => update("academyType", e.target.value)}
                >
                  <option value="">Select academy type</option>
                  {ACADEMY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="select-caret" />
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Academy Facilities</label>
            <FacilitySelector
              selected={form.facilities}
              onToggle={toggleFacility}
            />
          </div>
        </section>

        {/* Right column */}
        <div className="right-column">
          <section className="panel">
            <h2 className="panel-title">Academy Images</h2>

            <div className="image-row">
              <ImageUploader
                title="Logo"
                required
                hint="PNG, JPG up to 2MB"
              />
              <ImageUploader
                title="Cover Image"
                required
                variant="wide"
                hint="JPG up to 5MB"
              />
            </div>
            <p className="image-note">Recommended size: 1200x400px</p>

            <ImageUploader
              title="Gallery Images (Optional)"
              variant="wide"
              multiple
              hint="JPG, PNG up to 5MB each"
            />
          </section>

          <section className="panel">
            <h2 className="panel-title">Contact &amp; Social Links</h2>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Website (Optional)</label>
                <input
                  className="form-input"
                  placeholder="https://www.example.com"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Instagram (Optional)</label>
                <input
                  className="form-input"
                  placeholder="https://instagram.com/academy"
                  value={form.instagram}
                  onChange={(e) => update("instagram", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Facebook (Optional)</label>
                <input
                  className="form-input"
                  placeholder="https://facebook.com/academy"
                  value={form.facebook}
                  onChange={(e) => update("facebook", e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="form-label">YouTube (Optional)</label>
                <input
                  className="form-input"
                  placeholder="https://youtube.com/academy"
                  value={form.youtube}
                  onChange={(e) => update("youtube", e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setForm(EMPTY_FORM)}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <Plus size={18} /> Create Academy
        </button>
      </div>
    </form>
  );
}
