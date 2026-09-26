import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
  title?: string;
}

interface LightboxContextType {
  openLightbox: (item: LightboxItem) => void;
  closeLightbox: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<LightboxItem | null>(null);

  const openLightbox = (item: LightboxItem) => {
    setActiveItem(item);
  };

  const closeLightbox = () => {
    setActiveItem(null);
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeItem) {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem]);

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all animate-in fade-in duration-200"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt || "Expanded image view"}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors cursor-pointer"
            aria-label="Close image viewer"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeItem.src}
              alt={activeItem.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            {(activeItem.title || activeItem.caption || activeItem.alt) && (
              <div className="text-center text-white px-4 max-w-2xl space-y-1">
                {activeItem.title && (
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-white" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    {activeItem.title}
                  </h3>
                )}
                {(activeItem.caption || activeItem.alt) && (
                  <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                    {activeItem.caption || activeItem.alt}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}

export function ClickableImage({
  src,
  alt,
  caption,
  title,
  className = "",
  aspectRatio,
  containerClassName = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  title?: string;
  className?: string;
  aspectRatio?: string;
  containerClassName?: string;
}) {
  const { openLightbox } = useLightbox();

  return (
    <div
      onClick={() => openLightbox({ src, alt, caption, title })}
      className={`group relative cursor-zoom-in overflow-hidden ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      title="Click to view full size photo"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox({ src, alt, caption, title });
        }
      }}
    >
      <img src={src} alt={alt} className={className} loading="lazy" />
      <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-xs shadow-xs">
        <ZoomIn className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
