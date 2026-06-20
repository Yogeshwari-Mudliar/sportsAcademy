import { useEffect } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setPageHeader, setThemeColor } from "../../features/ui/uiSlice";
import {
  DEFAULT_BASE_COLOR,
  THEME_PRESETS,
  buildPalette,
  isValidHexColor,
} from "../../theme";
import "../../styles/superadmin/settings.css";

export default function Settings() {
  const dispatch = useAppDispatch();
  const themeColor = useAppSelector((state) => state.ui.themeColor);
  const palette = buildPalette(
    isValidHexColor(themeColor) ? themeColor : DEFAULT_BASE_COLOR
  );

  useEffect(() => {
    dispatch(
      setPageHeader({
        title: "Settings",
        breadcrumb: ["Dashboard", "Settings"],
      })
    );
  }, [dispatch]);

  const changeColor = (value: string) => {
    dispatch(setThemeColor(value));
  };

  return (
    <div className="dashboard-page">
      <div className="settings-grid">
        <div className="panel">
          <h2 className="panel-title">Appearance</h2>
          <p className="settings-help">
            Choose a base color for the dashboard. The sidebar, header, cards and
            inputs are automatically derived from it. Your choice is saved on this
            device.
          </p>

          <div className="form-field">
            <label className="form-label">Base color</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-swatch-input"
                value={isValidHexColor(themeColor) ? themeColor : DEFAULT_BASE_COLOR}
                onChange={(e) => changeColor(e.target.value)}
                aria-label="Pick base color"
              />
              <input
                type="text"
                className="form-input hex-input"
                value={themeColor}
                onChange={(e) => changeColor(e.target.value)}
                placeholder="#012551"
              />
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => changeColor(DEFAULT_BASE_COLOR)}
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
            {!isValidHexColor(themeColor) && (
              <span className="hex-error">Enter a valid hex color (e.g. #012551)</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Presets</label>
            <div className="preset-grid">
              {THEME_PRESETS.map((preset) => {
                const active =
                  preset.color.toLowerCase() === themeColor.toLowerCase();
                return (
                  <button
                    type="button"
                    key={preset.color}
                    className={`preset-chip${active ? " active" : ""}`}
                    onClick={() => changeColor(preset.color)}
                  >
                    <span
                      className="preset-dot"
                      style={{ background: preset.color }}
                    >
                      {active && <Check size={14} />}
                    </span>
                    <span className="preset-name">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">Live preview</h2>
          <div
            className="theme-preview"
            style={{ background: palette.app, borderColor: palette.nav }}
          >
            <div className="theme-preview-nav" style={{ background: palette.nav }}>
              <span className="theme-preview-brand">Cricket Academy</span>
              <span className="theme-preview-navitem">Dashboard</span>
              <span className="theme-preview-navitem">Academies</span>
            </div>
            <div className="theme-preview-body">
              <div className="theme-preview-card" style={{ background: palette.card }}>
                Total Academies
                <strong>128</strong>
              </div>
              <div className="theme-preview-card" style={{ background: palette.card }}>
                Total Students
                <strong>24,560</strong>
              </div>
              <input
                className="theme-preview-input"
                style={{ background: palette.input }}
                placeholder="Input field"
                readOnly
              />
            </div>
          </div>

          <div className="swatch-legend">
            {(
              [
                ["App", palette.app],
                ["Nav", palette.nav],
                ["Card", palette.card],
                ["Input", palette.input],
              ] as const
            ).map(([label, color]) => (
              <div className="swatch-legend-item" key={label}>
                <span className="swatch-box" style={{ background: color }} />
                <span>
                  {label}
                  <code>{color}</code>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
