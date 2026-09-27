import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, Save, Plus, Trash2, GripVertical, Check, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import {
  fetchBipSettings, saveBipSettings,
  type BipSettings, type BipStoryItem,
  DEFAULT_BIP_SETTINGS,
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

function StoriesEditor({ stories, onChange }: { stories: BipStoryItem[]; onChange: (s: BipStoryItem[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const update = (i: number, field: keyof BipStoryItem, val: string | number) => {
    onChange(stories.map((st, idx) => idx === i ? { ...st, [field]: val } : st));
  };

  const add = () => {
    const nextId = stories.length > 0 ? Math.max(...stories.map(s => s.id)) + 1 : 1;
    onChange([
      ...stories,
      {
        id: nextId,
        tag: "General Story",
        title: "New Story Title",
        excerpt: "Story summary or excerpt...",
        readTime: "5 min",
        author: "Pratik Aggarwal",
        mediumUrl: "https://medium.com/@BloomingInPain",
        imgUrl: "/medium/Living%20with%20Endometriosis-%20Srinikhita%20Pole%E2%80%99s%20Story%20of%20Chronic%20Pain,%20Surgery,%20and%20Resilience_image.webp",
      },
    ]);
    setExpanded(stories.length);
  };

  const remove = (i: number) => {
    onChange(stories.filter((_, idx) => idx !== i));
    setExpanded(null);
  };

  return (
    <div className="space-y-3">
      {stories.map((story, i) => (
        <div key={story.id || i} className="rounded-xl border border-[#E4DEE6] bg-[#F6F4F7] overflow-hidden">
          <button type="button" onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-[#EDE9EF] transition-colors">
            <GripVertical className="w-4 h-4 text-[#504852]/30 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#5C2A57] uppercase tracking-wider block">{story.tag}</span>
              <span className="text-sm font-semibold text-[#1E1A24] truncate block">{story.title}</span>
              <span className="text-xs text-[#504852]/70 block">{story.author} • {story.readTime}</span>
            </div>
            {expanded === i ? <ChevronUp className="w-4 h-4 text-[#504852]/60" /> : <ChevronDown className="w-4 h-4 text-[#504852]/60" />}
            <button type="button" onClick={e => { e.stopPropagation(); remove(i); }} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </button>
          {expanded === i && (
            <div className="p-4 space-y-4 border-t border-[#E4DEE6] bg-white">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#1E1A24]">Category / Tag</label>
                  <input value={story.tag} onChange={e => update(i, "tag", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1E1A24]">Author Name</label>
                  <input value={story.author} onChange={e => update(i, "author", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#1E1A24]">Story Title</label>
                <input value={story.title} onChange={e => update(i, "title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm font-semibold" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#1E1A24]">Excerpt / Summary</label>
                <textarea value={story.excerpt} onChange={e => update(i, "excerpt", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#1E1A24]">Read Time (e.g. 5 min)</label>
                  <input value={story.readTime} onChange={e => update(i, "readTime", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1E1A24]">Medium Article Link</label>
                  <input value={story.mediumUrl} onChange={e => update(i, "mediumUrl", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[#E4DEE6] bg-white text-sm font-mono text-xs" />
                </div>
              </div>
              <ImageUploadField label="Cover Image" value={story.imgUrl} onChange={v => update(i, "imgUrl", v)} hint="Upload story thumbnail from computer or paste link" />
            </div>
          )}
        </div>
      ))}
      <button onClick={add} className="w-full py-3 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-sm font-semibold hover:bg-[#5C2A57]/5 transition-colors flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Story to Carousel
      </button>
    </div>
  );
}

export default function AdminBipSettings() {
  const [settings, setSettings] = useState<BipSettings>(DEFAULT_BIP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetchBipSettings().then(data => { setSettings(data); setLoading(false); });
  }, []);

  const update = useCallback(<K extends keyof BipSettings>(key: K, value: BipSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await saveBipSettings(settings);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-[#5C2A57]" /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 md:px-10 py-6 border-b border-[#E4DEE6] bg-white flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 rounded-lg hover:bg-[#F6F4F7] text-[#504852] hover:text-[#1E1A24] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1E1A24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Blooming in Pain Page</h1>
          <p className="text-sm text-[#504852]">Stories carousel, intro text, community items</p>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-10 py-8 space-y-6 max-w-3xl">
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1E1A24]">Page Header & Introduction</h2>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Page Title</label>
            <input value={settings.hero_title} onChange={e => update("hero_title", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] bg-white text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Subhead / Tagline</label>
            <input value={settings.hero_subtitle} onChange={e => update("hero_subtitle", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] bg-white text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Section Heading</label>
            <input value={settings.intro_heading} onChange={e => update("intro_heading", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] bg-white text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Introductory Body Paragraph</label>
            <textarea value={settings.intro_body} onChange={e => update("intro_body", e.target.value)} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] bg-white text-sm resize-none" />
          </div>
        </div>

        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1E1A24]">Community Stories Carousel ({settings.stories.length} Stories)</h2>
          <StoriesEditor stories={settings.stories} onChange={v => update("stories", v)} />
        </div>
        <div className="h-4" />
      </div>

      <SaveBar onSave={handleSave} status={saveStatus} />
    </div>
  );
}
