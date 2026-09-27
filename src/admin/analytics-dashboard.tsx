import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Send,
  Users,
  RefreshCw,
  Trash2,
  ExternalLink,
  ChevronLeft,
  Loader2,
  Globe,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  PieChart,
  Download,
  PlusCircle,
} from "lucide-react";
import {
  fetchAnalyticsSummary,
  clearAnalyticsData,
  loadDemoSeedData,
  type AnalyticsSummary,
} from "@/lib/analytics";

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async (range = timeRange) => {
    setIsRefreshing(true);
    try {
      const data = await fetchAnalyticsSummary(range);
      setSummary(data);
    } catch (err) {
      console.warn("Analytics load error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadData(timeRange);

    // Listen for real-time tracking events across window tabs & clicks
    const handleUpdate = () => loadData(timeRange);
    window.addEventListener("dei-analytics-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("dei-analytics-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [timeRange, loadData]);

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to clear all recorded analytics events? This will reset metrics to zero.")) {
      await clearAnalyticsData();
      await loadData(timeRange);
    }
  };

  const handleLoadSeed = async () => {
    await loadDemoSeedData();
    await loadData(timeRange);
  };

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#5C2A57]" />
      </div>
    );
  }

  const maxCtaCount = Math.max(...summary.topCTAs.map((c) => c.count), 1);
  const maxPageViews = Math.max(...summary.popularPages.map((p) => p.views), 1);
  const maxOutboundCount = Math.max(...summary.topOutbound.map((o) => o.count), 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4F7]">
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-10 py-6 border-b border-[#E4DEE6] bg-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="p-2 rounded-xl hover:bg-[#F6F4F7] text-[#504852] hover:text-[#1E1A24] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1
              className="text-2xl font-bold text-[#1E1A24]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Analytics &amp; Conversion Funnel
            </h1>
            <p className="text-xs text-[#504852] mt-0.5">
              Portfolio Engagement, Conversion Funnel &amp; Strategic Insights
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Time Filter Pills */}
          <div className="flex items-center bg-[#F6F4F7] p-1 rounded-xl border border-[#E4DEE6]">
            {(
              [
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === t.id
                    ? "bg-white text-[#5C2A57] shadow-2xs"
                    : "text-[#504852] hover:text-[#1E1A24]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadData()}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-[#E4DEE6] bg-white text-[#504852] hover:text-[#1E1A24] hover:bg-[#F6F4F7] transition-all cursor-pointer"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          {summary.totalViews === 0 ? (
            <button
              onClick={handleLoadSeed}
              className="px-3.5 py-2 rounded-xl border border-[#5C2A57]/30 bg-[#5C2A57]/5 text-[#5C2A57] hover:bg-[#5C2A57]/10 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Load Demo Seed Data
            </button>
          ) : (
            <button
              onClick={handleClear}
              className="p-2.5 rounded-xl border border-[#E4DEE6] bg-white text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              title="Reset Analytics Data"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Dashboard Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 md:px-10 py-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* ── 1. Top KPI Summary Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E4DEE6] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#504852]">
              <span className="text-xs font-semibold uppercase tracking-wider">Page Views</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1E1A24] font-serif">{summary.totalViews}</p>
            <p className="text-[11px] text-[#504852]/70">Total page visits</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DEE6] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#504852]">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Clicks</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1E1A24] font-serif">{summary.totalClicks}</p>
            <p className="text-[11px] text-[#504852]/70">CTA &amp; link interactions</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DEE6] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#504852]">
              <span className="text-xs font-semibold uppercase tracking-wider">Inquiries Sent</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1E1A24] font-serif">{summary.formSubmissions}</p>
            <p className="text-[11px] text-[#504852]/70">Contact form submissions</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DEE6] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#504852]">
              <span className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1E1A24] font-serif">{summary.conversionRate}%</p>
            <p className="text-[11px] text-[#504852]/70">Visitors → Inquiries</p>
          </div>
        </div>

        {/* ── 2. PM Insights & Recommendations ─────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#1E1A24] to-[#3D1E3C] text-white rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base font-bold font-serif">Product Manager Strategic Insights</h2>
                <p className="text-xs text-white/70">Actionable recommendations based on user engagement patterns</p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-white/90">
              PM Report
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {summary.pmInsights.map((insight, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-2 backdrop-blur-xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{insight.type.replace("_", " ")}</span>
                </div>
                <h3 className="text-sm font-semibold text-white leading-snug">{insight.title}</h3>
                <p className="text-xs text-white/80 leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Conversion Funnel Visualizer ─────────────────────────────────── */}
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1E1A24]">Conversion Funnel</h2>
              <p className="text-xs text-[#504852]">User progression from initial visit to contact inquiry</p>
            </div>
            <span className="text-xs font-bold text-[#5C2A57] bg-[#5C2A57]/10 px-3 py-1 rounded-full">
              {summary.uniqueSessions} Unique Visitor Sessions
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-2">
            {summary.funnel.map((step, idx) => (
              <div
                key={step.step}
                className="p-4 rounded-xl border border-[#E4DEE6] bg-[#F6F4F7] space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#1E1A24]">
                  <span>{step.step}</span>
                  <span className="text-[#5C2A57]">{step.percentage}%</span>
                </div>
                <p className="text-2xl font-bold text-[#1E1A24] font-serif">{step.count}</p>
                <div className="w-full bg-[#E4DEE6] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${step.percentage}%`,
                      background:
                        idx === 0
                          ? "linear-gradient(90deg, #3B82F6, #1D4ED8)"
                          : idx === 1
                          ? "linear-gradient(90deg, #8B5CF6, #6D28D9)"
                          : "linear-gradient(90deg, #10B981, #047857)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Top Clicked CTAs & Outbound Links Grid ───────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Clicked CTAs */}
          <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div>
              <h2 className="text-base font-semibold text-[#1E1A24]">Most Clicked Buttons &amp; CTAs</h2>
              <p className="text-xs text-[#504852]">Which actions generate the highest engagement</p>
            </div>

            {summary.topCTAs.length === 0 ? (
              <p className="text-xs text-[#504852]/60 italic py-4">No CTA click events recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {summary.topCTAs.map((cta) => {
                  const pct = Math.round((cta.count / maxCtaCount) * 100);
                  return (
                    <div key={`${cta.label}_${cta.location}`} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1E1A24] truncate max-w-[220px]" title={cta.label}>
                          {cta.label}
                        </span>
                        <span className="text-[#504852] font-mono">
                          {cta.count} clicks ({cta.uniqueCount} unique)
                        </span>
                      </div>
                      <div className="w-full bg-[#F6F4F7] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: "linear-gradient(90deg, #B84472, #5C2A57)",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[#504852]/60 uppercase tracking-wider block">
                        Location: {cta.location}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Outbound Links */}
          <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div>
              <h2 className="text-base font-semibold text-[#1E1A24]">Outbound Traffic Destinations</h2>
              <p className="text-xs text-[#504852]">Clicks leaving for Medium, Instagram, LinkedIn &amp; Forms</p>
            </div>

            {summary.topOutbound.length === 0 ? (
              <p className="text-xs text-[#504852]/60 italic py-4">No outbound clicks recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {summary.topOutbound.map((out) => {
                  const pct = Math.round((out.count / maxOutboundCount) * 100);
                  return (
                    <div key={out.destination} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1E1A24] flex items-center gap-1.5">
                          <ExternalLink className="w-3 h-3 text-[#5C2A57]" />
                          {out.destination}
                        </span>
                        <span className="text-[#504852] font-mono">{out.count} clicks</span>
                      </div>
                      <div className="w-full bg-[#F6F4F7] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: "linear-gradient(90deg, #3B82F6, #6366F1)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── 5. Page Popularity & Real-Time Stream Grid ──────────────────────── */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* Page Popularity Breakdown */}
          <div className="md:col-span-5 bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div>
              <h2 className="text-base font-semibold text-[#1E1A24]">Most Popular Pages</h2>
              <p className="text-xs text-[#504852]">Traffic distribution across site routes</p>
            </div>

            {summary.popularPages.length === 0 ? (
              <p className="text-xs text-[#504852]/60 italic py-4">No page views recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {summary.popularPages.map((page) => {
                  const pct = Math.round((page.views / maxPageViews) * 100);
                  return (
                    <div key={page.path} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[#1E1A24]">{page.path}</span>
                        <span className="text-[#504852]">{page.views} views</span>
                      </div>
                      <div className="w-full bg-[#F6F4F7] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-Time Live Activity Feed */}
          <div className="md:col-span-7 bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#1E1A24] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Real-Time Live Activity Stream
                </h2>
                <p className="text-xs text-[#504852]">Instant chronological log of visitor clicks &amp; views</p>
              </div>
              <span className="text-[11px] font-mono text-[#504852]/70">
                {summary.recentActivity.length} events
              </span>
            </div>

            {summary.recentActivity.length === 0 ? (
              <p className="text-xs text-[#504852]/60 italic py-8 text-center">
                No real-time events logged yet. Open the website in another tab and click any button to test live tracking!
              </p>
            ) : (
              <div className="divide-y divide-[#E4DEE6] max-h-[340px] overflow-y-auto pr-1">
                {summary.recentActivity.map((evt, idx) => (
                  <div key={evt.id || idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          evt.eventName === "contact_form_submitted"
                            ? "bg-emerald-500"
                            : evt.eventName === "cta_clicked"
                            ? "bg-purple-500"
                            : evt.eventName === "outbound_click"
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-[#1E1A24] truncate">
                          {evt.eventName === "contact_form_submitted"
                            ? `Submitted Contact Form (${evt.properties?.inquiry_type || "inquiry"})`
                            : evt.eventName === "cta_clicked"
                            ? `Clicked "${evt.properties?.label || "CTA"}"`
                            : evt.eventName === "outbound_click"
                            ? `Visited Outbound: ${evt.properties?.destination}`
                            : `Viewed Page ${evt.path}`}
                        </p>
                        <p className="text-[10px] text-[#504852]/70 truncate">
                          Route: {evt.path} • Session: {evt.sessionId.substring(0, 12)}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#504852]/70 shrink-0">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
