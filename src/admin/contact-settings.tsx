import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, Save, Check, AlertCircle, Loader2, Plus, Trash2, Mail, Link as LinkIcon, Settings2 } from "lucide-react";
import {
  fetchContactSettings, saveContactSettings,
  type ContactSettings,
  DEFAULT_CONTACT_SETTINGS,
} from "@/lib/supabase";

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

export default function AdminContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newInquiryType, setNewInquiryType] = useState("");

  useEffect(() => {
    fetchContactSettings().then(data => {
      setSettings({ ...DEFAULT_CONTACT_SETTINGS, ...data });
      setLoading(false);
    });
  }, []);

  const update = useCallback(<K extends keyof ContactSettings>(key: K, value: ContactSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await saveContactSettings(settings);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  const addInquiryType = () => {
    if (!newInquiryType.trim()) return;
    update("inquiry_types", [...(settings.inquiry_types || []), newInquiryType.trim()]);
    setNewInquiryType("");
  };

  const removeInquiryType = (index: number) => {
    const updated = (settings.inquiry_types || []).filter((_, i) => i !== index);
    update("inquiry_types", updated);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-[#5C2A57]" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8FA]">
      {/* Header */}
      <div className="px-6 md:px-10 py-6 border-b border-[#E4DEE6] bg-white flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 rounded-lg hover:bg-[#F6F4F7] text-[#504852] hover:text-[#1E1A24] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1E1A24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Contact Form & Email Settings</h1>
          <p className="text-sm text-[#504852]">Configure email routing, webhook URLs, fields, and inquiry types</p>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-10 py-8 space-y-6 max-w-4xl mx-auto w-full">
        
        {/* Section 1: Email Routing & Destination */}
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#5C2A57] font-semibold text-base pb-2 border-b border-[#E4DEE6]">
            <Mail className="w-5 h-5 text-[#B84472]" />
            <h2>Email Routing Destinations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#1E1A24] block mb-1">
                Primary Contact Email (Pratik)
              </label>
              <p className="text-xs text-[#6B636C] mb-2">Receives all general inquiries, keynote speaking, & consulting</p>
              <input
                type="email"
                value={settings.recipient_email}
                onChange={e => update("recipient_email", e.target.value)}
                placeholder="Pratik@asthaindia.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#B84472]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#1E1A24] block mb-1">
                Blooming in Pain Secondary Email
              </label>
              <p className="text-xs text-[#6B636C] mb-2">Notified ONLY when inquiry is about Blooming in Pain</p>
              <input
                type="email"
                value={settings.blooming_email}
                onChange={e => update("blooming_email", e.target.value)}
                placeholder="hello@bloominginpain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#B84472]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Webhook Endpoint */}
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#5C2A57] font-semibold text-base pb-2 border-b border-[#E4DEE6]">
            <LinkIcon className="w-5 h-5 text-[#B84472]" />
            <h2>Google Apps Script / Webhook Endpoint</h2>
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1E1A24] block mb-1">Google Webhook URL</label>
            <p className="text-xs text-[#6B636C] mb-2">The Google Apps Script Web App URL where submissions are sent to Google Sheets & Email.</p>
            <input
              type="text"
              value={settings.webhook_url}
              onChange={e => update("webhook_url", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#B84472]"
            />
          </div>
        </div>

        {/* Section 3: Field Customization & Visibility */}
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#5C2A57] font-semibold text-base pb-2 border-b border-[#E4DEE6]">
            <Settings2 className="w-5 h-5 text-[#B84472]" />
            <h2>Form Fields & Visibility Controls</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3.5 border border-[#E4DEE6] rounded-xl hover:bg-[#F9F8FA] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.show_organisation_field}
                onChange={e => update("show_organisation_field", e.target.checked)}
                className="w-4 h-4 accent-[#B84472]"
              />
              <div>
                <span className="text-sm font-semibold text-[#1E1A24] block">Show Organisation Field</span>
                <span className="text-xs text-[#6B636C]">Allow users to enter Company / Institution</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 border border-[#E4DEE6] rounded-xl hover:bg-[#F9F8FA] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.show_phone_field}
                onChange={e => update("show_phone_field", e.target.checked)}
                className="w-4 h-4 accent-[#B84472]"
              />
              <div>
                <span className="text-sm font-semibold text-[#1E1A24] block">Show Phone Field</span>
                <span className="text-xs text-[#6B636C]">Include optional phone number input</span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-sm font-semibold text-[#1E1A24] block mb-1">Organisation Input Label</label>
              <input
                value={settings.organisation_label}
                onChange={e => update("organisation_label", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#1E1A24] block mb-1">Submit Button Label</label>
              <input
                value={settings.button_label}
                onChange={e => update("button_label", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#1E1A24] block mb-1">Message Prompt Label</label>
            <input
              value={settings.message_label}
              onChange={e => update("message_label", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm"
            />
          </div>
        </div>

        {/* Section 4: Dynamic Inquiry Types List */}
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-[#1E1A24] pb-2 border-b border-[#E4DEE6]">Inquiry Types Dropdown Options</h2>
          <p className="text-xs text-[#6B636C]">Customize the dropdown list options presented to visitors on the contact form.</p>
          
          <div className="space-y-2">
            {(settings.inquiry_types || []).map((type, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-3 border border-[#E4DEE6] rounded-xl bg-[#FDFCFD]">
                <span className="text-sm font-medium text-[#1E1A24]">{type}</span>
                <button
                  type="button"
                  onClick={() => removeInquiryType(idx)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  title="Remove option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newInquiryType}
              onChange={e => setNewInquiryType(e.target.value)}
              placeholder="e.g., Advisory & Workshops"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm"
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addInquiryType(); } }}
            />
            <button
              type="button"
              onClick={addInquiryType}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center gap-1.5 transition-all hover:opacity-90"
              style={{ background: "#5C2A57" }}
            >
              <Plus className="w-4 h-4" /> Add Option
            </button>
          </div>
        </div>

        {/* Section 5: Header Titles & Subtitles */}
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-[#1E1A24] pb-2 border-b border-[#E4DEE6]">Contact Page Header Text</h2>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Page Heading</label>
            <input value={settings.hero_title} onChange={e => update("hero_title", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Intro Subtitle</label>
            <textarea value={settings.hero_subtitle} onChange={e => update("hero_subtitle", e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Response Expectation Note</label>
            <input value={settings.response_time_note} onChange={e => update("response_time_note", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm" />
          </div>
        </div>

        <div className="h-6" />
      </div>

      <SaveBar onSave={handleSave} status={saveStatus} />
    </div>
  );
}
