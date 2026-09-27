import { supabase } from "@/lib/supabase";
import { track as vercelTrack } from "@vercel/analytics";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  id?: string;
  eventName: string;
  path: string;
  sessionId: string;
  properties?: Record<string, any>;
  timestamp: number;
}

export interface FunnelStep {
  step: string;
  count: number;
  percentage: number;
}

export interface TopCTAItem {
  label: string;
  location: string;
  count: number;
  uniqueCount: number;
}

export interface OutboundClickItem {
  destination: string;
  count: number;
}

export interface PageViewItem {
  path: string;
  views: number;
}

export interface InquiryTypeBreakdown {
  type: string;
  count: number;
  percentage: number;
}

export interface PMInsight {
  type: "top_pillar" | "conversion_driver" | "engagement" | "recommendation";
  title: string;
  description: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  formSubmissions: number;
  uniqueSessions: number;
  conversionRate: number;
  funnel: FunnelStep[];
  topCTAs: TopCTAItem[];
  topOutbound: OutboundClickItem[];
  popularPages: PageViewItem[];
  inquiryBreakdown: InquiryTypeBreakdown[];
  pmInsights: PMInsight[];
  recentActivity: AnalyticsEvent[];
}

// ── Session Helper ─────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sid = sessionStorage.getItem("dei_session_id");
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem("dei_session_id", sid);
  }
  return sid;
}

// ── Track Event Helper (Instant Local + Async Cloud) ───────────────────────────

export async function trackEvent(
  eventName: string,
  properties: Record<string, any> = {}
): Promise<void> {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname || "/";
  const sessionId = getOrCreateSessionId();
  const timestamp = Date.now();

  const eventObj: AnalyticsEvent = {
    eventName,
    path: currentPath,
    sessionId,
    properties,
    timestamp,
  };

  // 1. Save to LocalStorage array for instant resilience
  try {
    const raw = localStorage.getItem("dei_analytics_events");
    const existing: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    // Keep max 1000 recent events in localStorage
    const updated = [eventObj, ...existing].slice(0, 1000);
    localStorage.setItem("dei_analytics_events", JSON.stringify(updated));
    localStorage.removeItem("dei_analytics_cleared"); // User performed an action, clear flag
  } catch {
    // Ignore storage write errors
  }

  // Broadcast event so Admin Analytics Dashboard updates INSTANTLY in real time!
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("dei-analytics-updated", { detail: eventObj }));
  }

  // 2. Persist to Supabase analytics_events table
  try {
    await supabase.from("analytics_events").insert({
      event_name: eventName,
      path: currentPath,
      session_id: sessionId,
      properties: properties,
      created_at: new Date(timestamp).toISOString(),
    });
  } catch (err) {
    console.warn("Analytics event log warning:", err);
  }

  // 3. Track in Vercel Analytics if available
  try {
    vercelTrack(eventName, properties);
  } catch {
    // Silently continue
  }
}

// ── Fetch Analytics Summary ────────────────────────────────────────────────────

export async function fetchAnalyticsSummary(
  timeRange: "7d" | "30d" | "all" = "30d"
): Promise<AnalyticsSummary> {
  let events: AnalyticsEvent[] = [];
  const isCleared = typeof window !== "undefined" && localStorage.getItem("dei_analytics_cleared") === "true";

  const now = Date.now();
  const cutoff =
    timeRange === "7d"
      ? now - 7 * 24 * 60 * 60 * 1000
      : timeRange === "30d"
      ? now - 30 * 24 * 60 * 60 * 1000
      : 0;

  // 1. Read from LocalStorage first for instant 0ms load
  try {
    const raw = localStorage.getItem("dei_analytics_events");
    if (raw) {
      const localEvents: AnalyticsEvent[] = JSON.parse(raw);
      events = cutoff > 0 ? localEvents.filter((e) => e.timestamp >= cutoff) : localEvents;
    }
  } catch {
    // Ignore
  }

  // 2. Fetch from Supabase analytics_events table
  try {
    let query = supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (cutoff > 0) {
      query = query.gte("created_at", new Date(cutoff).toISOString());
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      const remoteEvents: AnalyticsEvent[] = data.map((d) => ({
        id: d.id,
        eventName: d.event_name,
        path: d.path || "/",
        sessionId: d.session_id || "anonymous",
        properties: d.properties || {},
        timestamp: new Date(d.created_at).getTime(),
      }));

      // Merge remote with local events, removing duplicates
      const existingKeys = new Set(events.map((e) => `${e.timestamp}_${e.eventName}_${e.sessionId}`));
      for (const re of remoteEvents) {
        const key = `${re.timestamp}_${re.eventName}_${re.sessionId}`;
        if (!existingKeys.has(key)) {
          events.push(re);
        }
      }
      events.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (err) {
    console.warn("Supabase analytics query warning:", err);
  }

  // If brand new and not explicitly cleared by user, load initial seed stats
  if (events.length === 0 && !isCleared) {
    events = generateDefaultSeedEvents();
  }

  // Calculate Metrics
  const pageViewEvents = events.filter((e) => e.eventName === "page_view");
  const clickEvents = events.filter((e) => e.eventName === "cta_clicked" || e.eventName === "outbound_click");
  const formEvents = events.filter((e) => e.eventName === "contact_form_submitted");

  const totalViews = pageViewEvents.length;
  const totalClicks = clickEvents.length;
  const formSubmissions = formEvents.length;

  const sessionIds = new Set(events.map((e) => e.sessionId));
  const uniqueSessions = Math.max(sessionIds.size, totalViews > 0 ? 1 : 0);

  const conversionRate = uniqueSessions > 0 ? Number(((formSubmissions / uniqueSessions) * 100).toFixed(1)) : 0;

  // Funnel Calculation
  const sessionsWithClick = new Set(clickEvents.map((e) => e.sessionId)).size;
  const sessionsWithSubmit = new Set(formEvents.map((e) => e.sessionId)).size;

  const funnel: FunnelStep[] = [
    { step: "1. Unique Visitors", count: uniqueSessions, percentage: uniqueSessions > 0 ? 100 : 0 },
    {
      step: "2. Engaged (Clicked CTA/Link)",
      count: sessionsWithClick,
      percentage: uniqueSessions > 0 ? Math.round((sessionsWithClick / uniqueSessions) * 100) : 0,
    },
    {
      step: "3. Conversion (Inquiry Sent)",
      count: sessionsWithSubmit,
      percentage: uniqueSessions > 0 ? Math.round((sessionsWithSubmit / uniqueSessions) * 100) : 0,
    },
  ];

  // Top CTAs
  const ctaMap: Record<string, { label: string; location: string; count: number; sessions: Set<string> }> = {};
  clickEvents
    .filter((e) => e.eventName === "cta_clicked")
    .forEach((e) => {
      const label = e.properties?.label || "Primary Action";
      const location = e.properties?.location || "Page";
      const key = `${label}_${location}`;
      if (!ctaMap[key]) {
        ctaMap[key] = { label, location, count: 0, sessions: new Set() };
      }
      ctaMap[key].count++;
      ctaMap[key].sessions.add(e.sessionId);
    });

  const topCTAs: TopCTAItem[] = Object.values(ctaMap)
    .map((item) => ({
      label: item.label,
      location: item.location,
      count: item.count,
      uniqueCount: item.sessions.size,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Top Outbound Clicks
  const outboundMap: Record<string, number> = {};
  clickEvents
    .filter((e) => e.eventName === "outbound_click")
    .forEach((e) => {
      const dest = e.properties?.destination || "external_link";
      outboundMap[dest] = (outboundMap[dest] || 0) + 1;
    });

  const topOutbound: OutboundClickItem[] = Object.entries(outboundMap)
    .map(([destination, count]) => ({ destination, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Popular Pages
  const pageMap: Record<string, number> = {};
  pageViewEvents.forEach((e) => {
    const p = e.path || "/";
    pageMap[p] = (pageMap[p] || 0) + 1;
  });

  const popularPages: PageViewItem[] = Object.entries(pageMap)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views);

  // Inquiry Type Breakdown
  const inquiryMap: Record<string, number> = {};
  formEvents.forEach((e) => {
    const type = e.properties?.inquiry_type || "general";
    inquiryMap[type] = (inquiryMap[type] || 0) + 1;
  });

  const inquiryBreakdown: InquiryTypeBreakdown[] = Object.entries(inquiryMap)
    .map(([type, count]) => ({
      type: formatInquiryLabel(type),
      count,
      percentage: formSubmissions > 0 ? Math.round((count / formSubmissions) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // PM Insights & Recommendations
  const pmInsights = generatePMInsights(events, funnel, topCTAs, popularPages, formSubmissions);

  return {
    totalViews,
    totalClicks,
    formSubmissions,
    uniqueSessions,
    conversionRate,
    funnel,
    topCTAs,
    topOutbound,
    popularPages,
    inquiryBreakdown,
    pmInsights,
    recentActivity: events.slice(0, 20),
  };
}

// ── Clear Analytics Data ───────────────────────────────────────────────────────

export async function clearAnalyticsData(): Promise<void> {
  try {
    localStorage.setItem("dei_analytics_events", "[]");
    localStorage.setItem("dei_analytics_cleared", "true");
  } catch {
    // Ignore
  }
  try {
    await supabase.from("analytics_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  } catch {
    // Ignore
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("dei-analytics-updated"));
  }
}

// ── Load Demo Seed Data ────────────────────────────────────────────────────────

export async function loadDemoSeedData(): Promise<void> {
  const seedEvents = generateDefaultSeedEvents();
  try {
    localStorage.setItem("dei_analytics_events", JSON.stringify(seedEvents));
    localStorage.removeItem("dei_analytics_cleared");
  } catch {
    // Ignore
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("dei-analytics-updated"));
  }
}

// ── PM Insights Generator ─────────────────────────────────────────────────────

function formatInquiryLabel(raw: string): string {
  switch (raw) {
    case "speaking": return "Keynote & Speaking Engagements";
    case "consulting": return "Consulting & Institutional Advisory";
    case "partner": return "Strategic Partnerships";
    case "community": return "Blooming in Pain Community";
    default: return "General Inquiry";
  }
}

function generatePMInsights(
  events: AnalyticsEvent[],
  funnel: FunnelStep[],
  topCTAs: TopCTAItem[],
  popularPages: PageViewItem[],
  formSubmissions: number
): PMInsight[] {
  const insights: PMInsight[] = [];

  const topPage = popularPages[0]?.path || "/";
  insights.push({
    type: "engagement",
    title: `Top Traffic Entry: ${topPage === "/" ? "Home Page" : topPage}`,
    description: `The ${topPage === "/" ? "Home Page" : topPage} drives the highest initial visitor engagement across sessions.`,
  });

  if (topCTAs.length > 0) {
    const topCTA = topCTAs[0];
    insights.push({
      type: "top_pillar",
      title: `Highest Converting CTA: "${topCTA.label}"`,
      description: `Located in '${topCTA.location}', this button generated ${topCTA.count} total clicks from ${topCTA.uniqueCount} unique sessions.`,
    });
  }

  const engagementPct = funnel[1]?.percentage || 0;
  insights.push({
    type: "conversion_driver",
    title: `Engagement Conversion: ${engagementPct}%`,
    description: `${engagementPct}% of overall visitors interact with a CTA or outbound media link before leaving.`,
  });

  if (formSubmissions > 0) {
    insights.push({
      type: "recommendation",
      title: "PM Recommendation: Strategic Focus",
      description: `Inquiry conversions are active (${formSubmissions} submissions). Keep primary CTAs prominent above the fold on mobile and desktop.`,
    });
  } else {
    insights.push({
      type: "recommendation",
      title: "PM Recommendation: Boost Contact Visibility",
      description: "Consider placing the primary 'Start a Partnership' CTA button higher on the Home and Services pages to increase form submissions.",
    });
  }

  return insights;
}

// ── Seed Events Generator ──────────────────────────────────────────────────────

function generateDefaultSeedEvents(): AnalyticsEvent[] {
  const now = Date.now();
  const session1 = "sess_demo_01";
  const session2 = "sess_demo_02";
  const session3 = "sess_demo_03";
  const session4 = "sess_demo_04";

  return [
    { eventName: "page_view", path: "/", sessionId: session1, timestamp: now - 300000 },
    { eventName: "cta_clicked", path: "/", sessionId: session1, properties: { label: "Start a Partnership", location: "hero" }, timestamp: now - 280000 },
    { eventName: "page_view", path: "/services", sessionId: session1, timestamp: now - 250000 },
    { eventName: "cta_clicked", path: "/services", sessionId: session1, properties: { label: "Schedule a Capacity Workshop", location: "services_pillar_1" }, timestamp: now - 220000 },
    { eventName: "page_view", path: "/contact", sessionId: session1, timestamp: now - 200000 },
    { eventName: "cta_clicked", path: "/contact", sessionId: session1, properties: { label: "Send message", location: "contact_form" }, timestamp: now - 180000 },
    { eventName: "contact_form_submitted", path: "/contact", sessionId: session1, properties: { inquiry_type: "speaking" }, timestamp: now - 170000 },
    
    { eventName: "page_view", path: "/", sessionId: session2, timestamp: now - 1200000 },
    { eventName: "page_view", path: "/blooming-in-pain", sessionId: session2, timestamp: now - 900000 },
    { eventName: "outbound_click", path: "/blooming-in-pain", sessionId: session2, properties: { destination: "medium_bip" }, timestamp: now - 850000 },

    { eventName: "page_view", path: "/about", sessionId: session3, timestamp: now - 3600000 },
    { eventName: "cta_clicked", path: "/about", sessionId: session3, properties: { label: "Ask AI Preset Question", location: "about_ask_ai" }, timestamp: now - 3400000 },

    { eventName: "page_view", path: "/work", sessionId: session4, timestamp: now - 7200000 },
    { eventName: "outbound_click", path: "/work", sessionId: session4, properties: { destination: "purple_fest_keynote" }, timestamp: now - 7000000 },
  ];
}
