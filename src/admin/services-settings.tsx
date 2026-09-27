import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, Save, Plus, Trash2, Check, AlertCircle, Loader2 } from "lucide-react";
import {
  fetchServicesSettings, saveServicesSettings,
  type ServicesSettings, type ServicePillarItem,
  DEFAULT_SERVICES_SETTINGS,
} from "@/lib/supabase";
import { ImageUploadField } from "@/admin/image-upload-field";

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

export default function AdminServicesSettings() {
  const [settings, setSettings] = useState<ServicesSettings>(DEFAULT_SERVICES_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchServicesSettings().then(data => { setSettings(data); setLoading(false); });
  }, []);

  const update = useCallback(<K extends keyof ServicesSettings>(key: K, value: ServicesSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }, []);

  const updatePillar = (field: keyof ServicePillarItem, val: string | string[]) => {
    const updated = settings.pillars.map((p, idx) => idx === activeTab ? { ...p, [field]: val } : p);
    update("pillars", updated);
  };

  const updateHighlight = (hi: number, val: string) => {
    const p = settings.pillars[activeTab];
    const updatedHighlights = [...p.highlights];
    updatedHighlights[hi] = val;
    updatePillar("highlights", updatedHighlights);
  };

  const addHighlight = () => {
    const p = settings.pillars[activeTab];
    updatePillar("highlights", [...p.highlights, "New service bullet point"]);
  };

  const removeHighlight = (hi: number) => {
    const p = settings.pillars[activeTab];
    updatePillar("highlights", p.highlights.filter((_, idx) => idx !== hi));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await saveServicesSettings(settings);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-[#5C2A57]" /></div>;

  const currentPillar = settings.pillars[activeTab];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 md:px-10 py-6 border-b border-[#E4DEE6] bg-white flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 rounded-lg hover:bg-[#F6F4F7] text-[#504852] hover:text-[#1E1A24] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1E1A24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Services Page</h1>
          <p className="text-sm text-[#504852]">4 Service Pillars (Training, Consulting, Keynotes, Research)</p>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-10 py-8 space-y-6 max-w-3xl">
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1E1A24]">Services Header</h2>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Page Title</label>
            <input value={settings.hero_title} onChange={e => update("hero_title", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Subtitle</label>
            <input value={settings.hero_subtitle} onChange={e => update("hero_subtitle", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm" />
          </div>
        </div>

        {/* Pillars Tabbed Editor */}
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-[#1E1A24]">Edit Service Pillars</h2>
          <div className="flex gap-2 border-b border-[#E4DEE6] pb-3">
            {settings.pillars.map((pillar, i) => (
              <button
                key={pillar.id || i}
                onClick={() => setActiveTab(i)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === i ? "bg-[#5C2A57] text-white" : "bg-[#F6F4F7] text-[#504852] hover:text-[#1E1A24]"
                }`}
              >
                {pillar.title.split("&")[0]}
              </button>
            ))}
          </div>

          {currentPillar && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#1E1A24] block mb-1">Pillar Title</label>
                <input value={currentPillar.title} onChange={e => updatePillar("title", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] text-sm font-semibold" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#1E1A24] block mb-1">Target Audience Subtitle</label>
                <input value={currentPillar.subtitle} onChange={e => updatePillar("subtitle", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#1E1A24] block mb-1">Description Paragraph</label>
                <textarea value={currentPillar.description} onChange={e => updatePillar("description", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-[#E4DEE6] text-xs resize-none" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#1E1A24] block mb-2">Service Bullet Points ({currentPillar.highlights.length})</label>
                <div className="space-y-2">
                  {currentPillar.highlights.map((h, hi) => (
                    <div key={hi} className="flex items-center gap-2">
                      <span className="text-[#5C2A57] font-bold">•</span>
                      <input value={h} onChange={e => updateHighlight(hi, e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DEE6] text-xs" />
                      <button onClick={() => removeHighlight(hi)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={addHighlight} className="w-full py-2 rounded-lg border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-xs font-medium hover:bg-[#5C2A57]/5 flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Bullet Point
                  </button>
                </div>
              </div>

              <ImageUploadField label="Service Pillar Photo" value={currentPillar.photoUrl} onChange={v => updatePillar("photoUrl", v)} hint="Upload image from computer or paste link" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#1E1A24] block mb-1">CTA Label</label>
                  <input value={currentPillar.ctaLabel} onChange={e => updatePillar("ctaLabel", e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[#E4DEE6] text-xs" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1E1A24] block mb-1">CTA Link</label>
                  <input value={currentPillar.ctaHref} onChange={e => updatePillar("ctaHref", e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[#E4DEE6] text-xs font-mono" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>

      <SaveBar onSave={handleSave} status={saveStatus} />
    </div>
  );
}
