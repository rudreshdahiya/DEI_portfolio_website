import { Link } from "react-router";
import {
  Settings,
  Home,
  User,
  Briefcase,
  HeartHandshake,
  Mail,
  ArrowRight,
  Globe,
  CheckCircle2,
  Clock,
} from "lucide-react";

const sections = [
  {
    href: "/admin/global",
    icon: Settings,
    label: "Global Settings",
    desc: "Nav links, footer text, contact email, social media URLs",
    status: "ready",
    color: "#5C2A57",
  },
  {
    href: "/admin/home",
    icon: Home,
    label: "Home Page",
    desc: "Hero, stats, audience personas, partner logos, media highlights",
    status: "ready",
    color: "#1B3A5B",
  },
  {
    href: "/admin/about",
    icon: User,
    label: "About Page",
    desc: "Bio paragraphs, Ask AI FAQ presets",
    status: "ready",
    color: "#1F3D2A",
  },
  {
    href: "/admin/services",
    icon: Briefcase,
    label: "Services Page",
    desc: "4 service pillars, bullet points, photos, CTAs",
    status: "ready",
    color: "#3D1E3C",
  },
  {
    href: "/admin/work",
    icon: Briefcase,
    label: "Work Page",
    desc: "Engagements list, speaking, role, & event descriptions",
    status: "ready",
    color: "#3D6B8F",
  },
  {
    href: "/admin/blooming-in-pain",
    icon: HeartHandshake,
    label: "Blooming in Pain",
    desc: "Stories carousel, intro text, community items",
    status: "ready",
    color: "#AA151B",
  },
  {
    href: "/admin/contact",
    icon: Mail,
    label: "Contact Page",
    desc: "Header text, recipient email, & response expectation note",
    status: "ready",
    color: "#2B5329",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #B84472, #5C2A57)" }}
          >
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#1E1A24" }}>
              Content Dashboard
            </h1>
            <p className="text-sm" style={{ color: "#504852" }}>
              Select a section to edit website content
            </p>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(({ href, icon: Icon, label, desc, status, color }) => {
          const isReady = status === "ready";
          return (
            <div
              key={href}
              className="relative group"
            >
              {isReady ? (
                <Link
                  to={href}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-[#E4DEE6] bg-white hover:border-[#B84472]/40 hover:shadow-md transition-all duration-200 block"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: color + "18" }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1E1A24] text-sm">{label}</span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Ready
                      </span>
                    </div>
                    <p className="text-xs text-[#504852] leading-relaxed">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#B84472] shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#E4DEE6] bg-white/60 opacity-70 cursor-not-allowed">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: color + "10" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: color + "80" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1E1A24]/50 text-sm">{label}</span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Coming soon
                      </span>
                    </div>
                    <p className="text-xs text-[#504852]/60 leading-relaxed">{desc}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help text */}
      <div className="mt-8 p-4 rounded-2xl border border-[#E4DEE6] bg-white/50 text-sm text-[#504852]">
        <p>
          <strong className="text-[#1E1A24]">How it works:</strong>{" "}
          Edit any section, click <strong>Save</strong>, and changes go live on the website instantly — no rebuild needed.
        </p>
      </div>
    </div>
  );
}
