import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, Save, Plus, Trash2, GripVertical, Check, AlertCircle, Loader2 } from "lucide-react";
import { fetchGlobalSettings, saveGlobalSettings, type GlobalSettings, type NavLink, type SocialLink, DEFAULT_GLOBAL_SETTINGS } from "@/lib/supabase";

// ── Sub-components ─────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#1E1A24] block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] bg-white text-[#1E1A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30 focus:border-[#5C2A57]/60 transition-all placeholder:text-[#504852]/40"
      />
      {hint && <p className="text-xs text-[#504852]/70">{hint}</p>}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E4DEE6] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E4DEE6] bg-[#F6F4F7]/60">
        <h2 className="text-base font-semibold text-[#1E1A24]">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ── Nav Links Editor ───────────────────────────────────────────────────────────

function NavLinksEditor({ links, onChange }: { links: NavLink[]; onChange: (links: NavLink[]) => void }) {
  const addLink = () => {
    onChange([...links, { href: "/", label: "New Link", mobileDesc: "", order: links.length + 1 }]);
  };
  const removeLink = (i: number) => {
    onChange(links.filter((_, idx) => idx !== i));
  };
  const updateLink = (i: number, field: keyof NavLink, value: string | number) => {
    onChange(links.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };

  return (
    <div className="space-y-3">
      {links.map((link, i) => (
        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-[#F6F4F7] border border-[#E4DEE6]">
          <div className="mt-2.5 text-[#504852]/40 cursor-grab">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              placeholder="Label"
              className="px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30"
            />
            <input
              value={link.href}
              onChange={(e) => updateLink(i, "href", e.target.value)}
              placeholder="/path"
              className="px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30 font-mono"
            />
            <input
              value={link.mobileDesc || ""}
              onChange={(e) => updateLink(i, "mobileDesc", e.target.value)}
              placeholder="Mobile description (optional)"
              className="px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30 col-span-2"
            />
          </div>
          <button
            onClick={() => removeLink(i)}
            className="mt-2 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Remove link"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={addLink}
        className="w-full py-2.5 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-sm font-medium hover:bg-[#5C2A57]/5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Nav Link
      </button>
    </div>
  );
}

// ── Social Links Editor ────────────────────────────────────────────────────────

const ICON_OPTIONS = ["instagram", "linkedin", "youtube", "medium", "twitter", "facebook", "email", "website"];

function SocialLinksEditor({ links, onChange }: { links: SocialLink[]; onChange: (links: SocialLink[]) => void }) {
  const addLink = () => {
    onChange([...links, { key: `link_${Date.now()}`, label: "New Link", url: "https://", icon: "instagram" }]);
  };
  const removeLink = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: keyof SocialLink, value: string) => {
    onChange(links.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };

  return (
    <div className="space-y-3">
      {links.map((link, i) => (
        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-[#F6F4F7] border border-[#E4DEE6]">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              placeholder="Label"
              className="px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30"
            />
            <select
              value={link.icon}
              onChange={(e) => updateLink(i, "icon", e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
            <input
              value={link.url}
              onChange={(e) => updateLink(i, "url", e.target.value)}
              placeholder="https://..."
              type="url"
              className="px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30 col-span-2 font-mono text-xs"
            />
          </div>
          <button
            onClick={() => removeLink(i)}
            className="mt-2 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Remove social link"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={addLink}
        className="w-full py-2.5 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-sm font-medium hover:bg-[#5C2A57]/5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Social Link
      </button>
    </div>
  );
}

// ── Save Bar ───────────────────────────────────────────────────────────────────

function SaveBar({ onSave, status }: { onSave: () => void; status: "idle" | "saving" | "saved" | "error" }) {
  return (
    <div
      className="sticky bottom-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-t border-[#E4DEE6]"
      style={{ background: "rgba(246,244,247,0.95)", backdropFilter: "blur(8px)" }}
    >
      <div className="flex items-center gap-2 text-sm">
        {status === "saving" && (
          <span className="flex items-center gap-1.5 text-[#504852]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving to Supabase…
          </span>
        )}
        {status === "saved" && (
          <span className="flex items-center gap-1.5 text-green-700">
            <Check className="w-4 h-4" />
            Saved! Changes are live on the website.
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1.5 text-red-600">
            <AlertCircle className="w-4 h-4" />
            Error saving. Please try again.
          </span>
        )}
      </div>
      <button
        onClick={onSave}
        disabled={status === "saving"}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #B84472, #5C2A57)" }}
      >
        {status === "saving" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Save Changes
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetchGlobalSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const update = useCallback(<K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await saveGlobalSettings(settings);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-[#5C2A57]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Page Header */}
      <div className="px-6 md:px-10 py-6 border-b border-[#E4DEE6] bg-white flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 rounded-lg hover:bg-[#F6F4F7] text-[#504852] hover:text-[#1E1A24] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1E1A24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Global Settings
          </h1>
          <p className="text-sm text-[#504852]">Changes here affect every page of the website</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 md:px-10 py-8 space-y-6 max-w-3xl">

        {/* Site Identity */}
        <SectionCard title="Site Identity">
          <Field
            label="Site Name"
            id="site_name"
            value={settings.site_name}
            onChange={(v) => update("site_name", v)}
            placeholder="Pratik Aggarwal"
            hint="Appears in the header logo and browser tab"
          />
          <Field
            label="Site Tagline"
            id="site_tagline"
            value={settings.site_tagline}
            onChange={(v) => update("site_tagline", v)}
            placeholder="Disability Inclusion & Storytelling"
            hint="Short description shown in the footer and meta tags"
          />
          <Field
            label="Contact Email"
            id="contact_email"
            value={settings.contact_email}
            onChange={(v) => update("contact_email", v)}
            type="email"
            placeholder="hello@bloominginpain.com"
            hint="Shown in the footer"
          />
        </SectionCard>

        {/* Footer */}
        <SectionCard title="Footer">
          <Field
            label="Footer Tagline"
            id="footer_tagline"
            value={settings.footer_tagline}
            onChange={(v) => update("footer_tagline", v)}
            placeholder="Disability Inclusion & Storytelling"
          />
          <Field
            label="Footer Copyright Text"
            id="footer_copyright"
            value={settings.footer_copyright}
            onChange={(v) => update("footer_copyright", v)}
            placeholder="© 2025"
            hint="The year is usually set automatically — override here if needed"
          />
        </SectionCard>

        {/* CTA Button */}
        <SectionCard title="Primary Call-to-Action Button">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Button Label"
              id="cta_label"
              value={settings.cta_label}
              onChange={(v) => update("cta_label", v)}
              placeholder="Start a Partnership"
            />
            <Field
              label="Button Link"
              id="cta_href"
              value={settings.cta_href}
              onChange={(v) => update("cta_href", v)}
              placeholder="/contact"
              hint="The page it goes to when clicked"
            />
          </div>
        </SectionCard>

        {/* Navigation */}
        <SectionCard title="Navigation Links">
          <p className="text-xs text-[#504852]/70 -mt-2">
            These links appear in the top navigation bar and mobile menu.
          </p>
          <NavLinksEditor
            links={settings.nav_links}
            onChange={(v) => update("nav_links", v)}
          />
        </SectionCard>

        {/* Social Links */}
        <SectionCard title="Social Media Links">
          <p className="text-xs text-[#504852]/70 -mt-2">
            These icons appear in the footer of every page.
          </p>
          <SocialLinksEditor
            links={settings.social_links}
            onChange={(v) => update("social_links", v)}
          />
        </SectionCard>

        <div className="h-4" />
      </div>

      <SaveBar onSave={handleSave} status={saveStatus} />
    </div>
  );
}
