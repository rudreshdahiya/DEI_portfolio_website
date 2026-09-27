import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, Save, Plus, Trash2, GripVertical, Check, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import {
  fetchHomeSettings, saveHomeSettings,
  type HomeSettings, type HomeStat, type HomeOrgLogo, type HomeMediaHighlight, type HomePersonaHighlight, type HomeRoleWord,
  DEFAULT_HOME_SETTINGS,
} from "@/lib/supabase";
import { ImageUploadField } from "@/admin/image-upload-field";

// ── Shared UI atoms ────────────────────────────────────────────────────────────

function Field({ label, id, value, onChange, type = "text", placeholder, hint, multiline }: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string; multiline?: boolean;
}) {
  const cls = "w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] bg-white text-[#1E1A24] text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30 focus:border-[#5C2A57]/60 transition-all placeholder:text-[#504852]/40";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#1E1A24] block">{label}</label>
      {multiline
        ? <textarea id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls + " resize-none"} />
        : <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
      {hint && <p className="text-xs text-[#504852]/70">{hint}</p>}
    </div>
  );
}

function SectionCard({ title, children, collapsible }: { title: string; children: React.ReactNode; collapsible?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white border border-[#E4DEE6] rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setOpen(v => !v)}
        className={`w-full px-6 py-4 border-b border-[#E4DEE6] bg-[#F6F4F7]/60 flex items-center justify-between ${collapsible ? "cursor-pointer hover:bg-[#F6F4F7]" : ""}`}
      >
        <h2 className="text-base font-semibold text-[#1E1A24] text-left">{title}</h2>
        {collapsible && (open ? <ChevronUp className="w-4 h-4 text-[#504852]/60" /> : <ChevronDown className="w-4 h-4 text-[#504852]/60" />)}
      </button>
      {open && <div className="p-6 space-y-5">{children}</div>}
    </div>
  );
}

function SaveBar({ onSave, status }: { onSave: () => void; status: "idle" | "saving" | "saved" | "error" }) {
  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-t border-[#E4DEE6]" style={{ background: "rgba(246,244,247,0.95)", backdropFilter: "blur(8px)" }}>
      <div className="flex items-center gap-2 text-sm">
        {status === "saving" && <span className="flex items-center gap-1.5 text-[#504852]"><Loader2 className="w-4 h-4 animate-spin" />Saving…</span>}
        {status === "saved" && <span className="flex items-center gap-1.5 text-green-700"><Check className="w-4 h-4" />Saved! Changes are live.</span>}
        {status === "error" && <span className="flex items-center gap-1.5 text-red-600"><AlertCircle className="w-4 h-4" />Error — please try again.</span>}
      </div>
      <button onClick={onSave} disabled={status === "saving"} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60 hover:opacity-90 active:scale-[0.98]" style={{ background: "linear-gradient(135deg,#B84472,#5C2A57)" }}>
        {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
      </button>
    </div>
  );
}

// ── Stats editor ───────────────────────────────────────────────────────────────

function StatsEditor({ stats, onChange }: { stats: HomeStat[]; onChange: (s: HomeStat[]) => void }) {
  const update = (i: number, field: keyof HomeStat, val: string | number) =>
    onChange(stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const add = () => onChange([...stats, { numeric: 0, suffix: "+", label: "New Stat" }]);
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F4F7] border border-[#E4DEE6]">
          <input type="number" value={s.numeric} onChange={e => update(i, "numeric", Number(e.target.value))} className="w-20 px-2.5 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-center font-bold text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          <input value={s.suffix} onChange={e => update(i, "suffix", e.target.value)} placeholder="+" className="w-12 px-2 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-center text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          <input value={s.label} onChange={e => update(i, "label", e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <button onClick={add} className="w-full py-2.5 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-sm font-medium hover:bg-[#5C2A57]/5 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Stat</button>
    </div>
  );
}

// ── Org logos editor ───────────────────────────────────────────────────────────

function OrgLogosEditor({ logos, onChange }: { logos: HomeOrgLogo[]; onChange: (l: HomeOrgLogo[]) => void }) {
  const update = (i: number, field: keyof HomeOrgLogo, val: string) =>
    onChange(logos.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  const add = () => onChange([...logos, { name: "New Organisation", initials: "NO", bg: "#F0F0F0", color: "#333333" }]);
  const remove = (i: number) => onChange(logos.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {logos.map((logo, i) => (
        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F6F4F7] border border-[#E4DEE6]">
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 border border-[#E4DEE6]" style={{ background: logo.bg, color: logo.color }}>{logo.initials}</div>
          <input value={logo.name} onChange={e => update(i, "name", e.target.value)} placeholder="Org name" className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          <input value={logo.initials} onChange={e => update(i, "initials", e.target.value)} placeholder="AB" className="w-12 px-2 py-1.5 rounded-lg border border-[#E4DEE6] bg-white text-sm text-center text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          <div className="flex items-center gap-1">
            <input type="color" value={logo.bg} onChange={e => update(i, "bg", e.target.value)} title="Background colour" className="w-7 h-7 rounded cursor-pointer border-0 p-0" />
            <input type="color" value={logo.color} onChange={e => update(i, "color", e.target.value)} title="Text colour" className="w-7 h-7 rounded cursor-pointer border-0 p-0" />
          </div>
          <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <button onClick={add} className="w-full py-2.5 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-sm font-medium hover:bg-[#5C2A57]/5 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Organisation</button>
    </div>
  );
}

// ── Media highlights editor ────────────────────────────────────────────────────

function MediaEditor({ items, onChange }: { items: HomeMediaHighlight[]; onChange: (m: HomeMediaHighlight[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const update = (i: number, field: keyof HomeMediaHighlight, val: string) =>
    onChange(items.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  const add = () => { onChange([...items, { outlet: "New Outlet", category: "Category", title: "Article Title", description: "Description", url: "https://" }]); setExpanded(items.length); };
  const remove = (i: number) => { onChange(items.filter((_, idx) => idx !== i)); setExpanded(null); };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-[#E4DEE6] bg-[#F6F4F7] overflow-hidden">
          <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#EDE9EF] transition-colors">
            <GripVertical className="w-4 h-4 text-[#504852]/30 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#5C2A57] block">{item.outlet}</span>
              <span className="text-xs text-[#504852]/80 truncate block">{item.title}</span>
            </div>
            {expanded === i ? <ChevronUp className="w-4 h-4 shrink-0 text-[#504852]/50" /> : <ChevronDown className="w-4 h-4 shrink-0 text-[#504852]/50" />}
            <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </button>
          {expanded === i && (
            <div className="px-4 pb-4 space-y-3 border-t border-[#E4DEE6] pt-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={item.outlet} onChange={e => update(i, "outlet", e.target.value)} placeholder="Outlet name" className="px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
                <input value={item.category} onChange={e => update(i, "category", e.target.value)} placeholder="Category" className="px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
              </div>
              <input value={item.title} onChange={e => update(i, "title", e.target.value)} placeholder="Article title" className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
              <textarea value={item.description} onChange={e => update(i, "description", e.target.value)} placeholder="Short description" rows={2} className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30 resize-none" />
              <input value={item.url} onChange={e => update(i, "url", e.target.value)} placeholder="https://..." type="url" className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm font-mono text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
            </div>
          )}
        </div>
      ))}
      <button onClick={add} className="w-full py-2.5 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-sm font-medium hover:bg-[#5C2A57]/5 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Media Feature</button>
    </div>
  );
}

// ── Role words editor ──────────────────────────────────────────────────────────

function RoleWordsEditor({ words, onChange }: { words: HomeRoleWord[]; onChange: (w: HomeRoleWord[]) => void }) {
  const update = (i: number, field: keyof HomeRoleWord, val: string) =>
    onChange(words.map((w, idx) => idx === i ? { ...w, [field]: val } : w));
  const add = () => onChange([...words, { word: "New Word", styleClass: "text-plum font-bold" }]);
  const remove = (i: number) => onChange(words.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      <p className="text-xs text-[#504852]/70">These words cycle in the hero heading. The order here is the order on screen.</p>
      {words.map((w, i) => (
        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F4F7] border border-[#E4DEE6]">
          <GripVertical className="w-4 h-4 text-[#504852]/30 shrink-0" />
          <input value={w.word} onChange={e => update(i, "word", e.target.value)} placeholder="Word/phrase" className="w-48 px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm font-semibold text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          <input value={w.styleClass} onChange={e => update(i, "styleClass", e.target.value)} placeholder="Tailwind classes" className="flex-1 px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-xs font-mono text-[#504852] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <button onClick={add} className="w-full py-2.5 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-sm font-medium hover:bg-[#5C2A57]/5 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Role Word</button>
    </div>
  );
}

// ── Persona editor ─────────────────────────────────────────────────────────────

function PersonaEditor({ personas, onChange }: { personas: HomePersonaHighlight[]; onChange: (p: HomePersonaHighlight[]) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const update = (field: keyof HomePersonaHighlight, val: string | string[]) =>
    onChange(personas.map((p, i) => i === activeTab ? { ...p, [field]: val } : p));
  const updateHighlight = (hi: number, val: string) => {
    const updated = [...personas[activeTab].keyHighlights];
    updated[hi] = val;
    update("keyHighlights", updated);
  };
  const addHighlight = () => update("keyHighlights", [...personas[activeTab].keyHighlights, "New highlight"]);
  const removeHighlight = (hi: number) => update("keyHighlights", personas[activeTab].keyHighlights.filter((_, idx) => idx !== hi));

  if (!personas.length) return null;
  const p = personas[activeTab];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {personas.map((persona, i) => (
          <button key={i} onClick={() => setActiveTab(i)} type="button"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: activeTab === i ? "#5C2A57" : "#F6F4F7", color: activeTab === i ? "#fff" : "#504852" }}>
            {persona.shortLabel}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1A24]">Full Label</label>
            <input value={p.label} onChange={e => update("label", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1A24]">Short Label (tab)</label>
            <input value={p.shortLabel} onChange={e => update("shortLabel", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1A24]">Badge text</label>
          <input value={p.badge} onChange={e => update("badge", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1A24]">Tagline</label>
          <input value={p.tagline} onChange={e => update("tagline", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1A24]">Lead text (paragraph)</label>
          <textarea value={p.leadText} onChange={e => update("leadText", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30 resize-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1E1A24]">Key Highlights (bullet points)</label>
          {p.keyHighlights.map((h, hi) => (
            <div key={hi} className="flex items-center gap-2">
              <span className="text-[#5C2A57] text-sm shrink-0">•</span>
              <input value={h} onChange={e => updateHighlight(hi, e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
              <button onClick={() => removeHighlight(hi)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          <button onClick={addHighlight} className="w-full py-2 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-xs font-medium hover:bg-[#5C2A57]/5 transition-colors flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5" />Add Highlight</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1A24]">CTA Button Label</label>
            <input value={p.ctaLabel} onChange={e => update("ctaLabel", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1A24]">CTA Link</label>
            <input value={p.ctaHref} onChange={e => update("ctaHref", e.target.value)} placeholder="/services#training" className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm font-mono text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          </div>
        </div>

        <ImageUploadField label="Persona Photo" value={p.photoUrl} onChange={v => update("photoUrl", v)} hint="Upload a photo from your computer or paste an image link" />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1A24]">Photo Alt text</label>
            <input value={p.photoAlt} onChange={e => update("photoAlt", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1A24]">Photo Caption</label>
            <input value={p.photoCaption} onChange={e => update("photoCaption", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AdminHomeSettings() {
  const [settings, setSettings] = useState<HomeSettings>(DEFAULT_HOME_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetchHomeSettings().then(data => { setSettings(data); setLoading(false); });
  }, []);

  const update = useCallback(<K extends keyof HomeSettings>(key: K, value: HomeSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await saveHomeSettings(settings);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-[#5C2A57]" /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 md:px-10 py-6 border-b border-[#E4DEE6] bg-white flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 rounded-lg hover:bg-[#F6F4F7] text-[#504852] hover:text-[#1E1A24] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1E1A24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Home Page</h1>
          <p className="text-sm text-[#504852]">Hero, stats, personas, partner logos & press features</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 md:px-10 py-8 space-y-6 max-w-3xl">

        {/* Hero */}
        <SectionCard title="Hero Section">
          <Field label="Heading Prefix (before the cycling word)" id="hero_prefix" value={settings.hero_prefix} onChange={v => update("hero_prefix", v)} placeholder="Disability Inclusion" />
          <Field label="Bio paragraph" id="hero_bio" value={settings.hero_bio} onChange={v => update("hero_bio", v)} multiline placeholder="Bringing together…" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA label" id="cta1l" value={settings.hero_cta1_label} onChange={v => update("hero_cta1_label", v)} />
            <Field label="Primary CTA link" id="cta1h" value={settings.hero_cta1_href} onChange={v => update("hero_cta1_href", v)} placeholder="/work" />
            <Field label="Secondary CTA label" id="cta2l" value={settings.hero_cta2_label} onChange={v => update("hero_cta2_label", v)} />
            <Field label="Secondary CTA link" id="cta2h" value={settings.hero_cta2_href} onChange={v => update("hero_cta2_href", v)} placeholder="/contact" />
          </div>
          <ImageUploadField label="Hero Photo" value={settings.hero_photo_url} onChange={v => update("hero_photo_url", v)} hint="Upload a photo from your computer or paste an image link" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Photo alt text" id="hero_alt" value={settings.hero_photo_alt} onChange={v => update("hero_photo_alt", v)} />
            <Field label="Photo caption" id="hero_caption" value={settings.hero_photo_caption} onChange={v => update("hero_photo_caption", v)} />
          </div>
        </SectionCard>

        {/* Cycling role words */}
        <SectionCard title="Cycling Role Words" collapsible>
          <RoleWordsEditor words={settings.role_words} onChange={v => update("role_words", v)} />
        </SectionCard>

        {/* Stats */}
        <SectionCard title="Impact Stats (9+, 40+, 20+)" collapsible>
          <StatsEditor stats={settings.stats} onChange={v => update("stats", v)} />
        </SectionCard>

        {/* Personas */}
        <SectionCard title="Audience Personas" collapsible>
          <div className="space-y-2 -mt-1">
            <label className="text-sm font-medium text-[#1E1A24]">Section heading</label>
            <input value={settings.persona_section_heading} onChange={e => update("persona_section_heading", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1E1A24]">Section subheading</label>
            <input value={settings.persona_section_subheading} onChange={e => update("persona_section_subheading", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] bg-white text-sm text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30" />
          </div>
          <PersonaEditor personas={settings.personas} onChange={v => update("personas", v)} />
        </SectionCard>

        {/* Partner logos */}
        <SectionCard title="Partner Organisation Logos (marquee)" collapsible>
          <OrgLogosEditor logos={settings.org_logos} onChange={v => update("org_logos", v)} />
        </SectionCard>

        {/* Authentic Gallery */}
        <SectionCard title="Authentic Practice Gallery Section" collapsible>
          <Field label="Section Badge text" id="gallery_badge" value={settings.gallery_section_badge} onChange={v => update("gallery_section_badge", v)} />
          <Field label="Section Heading" id="gallery_heading" value={settings.gallery_section_heading} onChange={v => update("gallery_section_heading", v)} />
        </SectionCard>

        {/* Podcasts & Discussions */}
        <SectionCard title="Podcasts & Media Section" collapsible>
          <Field label="Section Badge text" id="podcasts_badge" value={settings.podcasts_section_badge} onChange={v => update("podcasts_section_badge", v)} />
          <Field label="Section Heading" id="podcasts_heading" value={settings.podcasts_section_heading} onChange={v => update("podcasts_section_heading", v)} />
          <Field label="Section Subheading / Description" id="podcasts_subheading" value={settings.podcasts_section_subheading} onChange={v => update("podcasts_section_subheading", v)} multiline />
        </SectionCard>

        {/* Media highlights */}
        <SectionCard title="Press & Media Features (marquee)" collapsible>
          <Field label="Marquee Heading (e.g. National Media Features & Thought Leadership)" id="media_heading" value={settings.media_section_heading} onChange={v => update("media_section_heading", v)} />
          <MediaEditor items={settings.media_highlights} onChange={v => update("media_highlights", v)} />
        </SectionCard>

        {/* Blooming in Pain Banner */}
        <SectionCard title="Blooming in Pain Community Footer Banner" collapsible>
          <Field label="Badge text" id="bip_badge" value={settings.bip_section_badge} onChange={v => update("bip_section_badge", v)} />
          <Field label="Banner Heading" id="bip_heading" value={settings.bip_section_heading} onChange={v => update("bip_section_heading", v)} />
          <Field label="Description text" id="bip_text" value={settings.bip_section_text} onChange={v => update("bip_section_text", v)} multiline />
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA Button Label" id="bip_cta_l" value={settings.bip_cta_label} onChange={v => update("bip_cta_label", v)} />
            <Field label="CTA Button Link" id="bip_cta_h" value={settings.bip_cta_href} onChange={v => update("bip_cta_href", v)} />
          </div>
        </SectionCard>

        <div className="h-4" />
      </div>

      <SaveBar onSave={handleSave} status={saveStatus} />
    </div>
  );
}

