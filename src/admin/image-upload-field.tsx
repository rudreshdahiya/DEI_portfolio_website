import { useState, useRef } from "react";
import { Upload, Loader2, Image as ImageIcon, Link as LinkIcon, Check } from "lucide-react";
import { uploadImageFile } from "@/lib/supabase";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageUploadField({ label, value, onChange, hint }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (err) {
      console.error("Failed to upload image:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#1E1A24]">{label}</label>
        <button
          type="button"
          onClick={() => setMode(mode === "upload" ? "url" : "upload")}
          className="text-xs text-[#5C2A57] font-medium hover:underline flex items-center gap-1"
        >
          {mode === "upload" ? <><LinkIcon className="w-3 h-3" /> Paste URL instead</> : <><ImageIcon className="w-3 h-3" /> Upload File instead</>}
        </button>
      </div>

      {mode === "upload" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#5C2A57]/40 bg-[#5C2A57]/5 hover:bg-[#5C2A57]/10 text-[#5C2A57] text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-[#5C2A57]" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading Image..." : "Choose Image File from Computer"}
            </button>
            {value && <span className="text-xs text-green-700 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Image set</span>}
          </div>
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="/images/... or https://..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] bg-white text-xs font-mono text-[#1E1A24] focus:outline-none focus:ring-2 focus:ring-[#5C2A57]/30"
        />
      )}

      {/* Image Preview Box */}
      {value && (
        <div className="relative group rounded-xl overflow-hidden border border-[#E4DEE6] bg-[#F6F4F7] p-2 flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="h-16 w-24 object-cover rounded-lg border border-[#E4DEE6] shrink-0"
            onError={e => (e.currentTarget.style.display = "none")}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#1E1A24] truncate">{value}</p>
            <p className="text-[10px] text-[#504852]/70">Live Preview</p>
          </div>
        </div>
      )}

      {hint && <p className="text-xs text-[#504852]/70">{hint}</p>}
    </div>
  );
}
