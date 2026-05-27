import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, MousePointerClick, TrendingUp, Clock, RefreshCw,
  ArrowUp, ArrowDown, Minus, Monitor, Smartphone, Tablet,
  Globe, BarChart2, Lightbulb, Eye, ExternalLink
} from 'lucide-react';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

const DOMAIN = 'tielo-digital.nl';
const ADMIN_EMAIL = 'tim@tielo-digital.nl';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DateRange {
  label: string;
  start: Date;
  end: Date;
}

interface KpiData {
  visitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSessionSeconds: number;
  totalClicks: number;
  prevVisitors: number;
  prevClicks: number;
  prevAvgSession: number;
}

interface DailyData {
  date: string;
  visitors: number;
  clicks: number;
  avgSession: number;
}

interface ButtonStat {
  event_name: string;
  button_name: string;
  button_location: string;
  clicks: number;
  unique_clicks: number;
  last_click: string | null;
}

interface TrafficSource {
  source: string;
  visitors: number;
  clicks: number;
  avgSession: number;
}

interface DeviceStat {
  device: string;
  visitors: number;
  clicks: number;
  avgSession: number;
}

interface PageStat {
  page_path: string;
  views: number;
  unique_sessions: number;
  avg_time: number;
}

interface ReferrerStat {
  referrer: string;
  visitors: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDateRanges(): Record<string, DateRange> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const last7 = new Date(today); last7.setDate(today.getDate() - 6);
  const last30 = new Date(today); last30.setDate(today.getDate() - 29);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    today: { label: 'Vandaag', start: today, end: now },
    yesterday: { label: 'Gisteren', start: yesterday, end: new Date(today.getTime() - 1) },
    last7: { label: 'Laatste 7 dagen', start: last7, end: now },
    last30: { label: 'Laatste 30 dagen', start: last30, end: now },
    month: { label: 'Deze maand', start: monthStart, end: now },
  };
}

function formatSeconds(s: number): string {
  if (!s || s < 0) return '0s';
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function formatPct(n: number): string {
  return n.toFixed(1) + '%';
}

function pctChange(curr: number, prev: number): number {
  if (!prev) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

function classifySource(referrer: string, utmSource: string): string {
  if (utmSource) {
    const s = utmSource.toLowerCase();
    if (s.includes('google') || s.includes('ads')) return 'Google Ads';
    if (s.includes('facebook') || s.includes('instagram') || s.includes('social')) return 'Social';
    return utmSource;
  }
  if (!referrer) return 'Direct';
  const r = referrer.toLowerCase();
  if (r.includes('google') && !r.includes('ads')) return 'Organic';
  if (r.includes('google')) return 'Google Ads';
  if (r.includes('facebook') || r.includes('instagram') || r.includes('twitter') || r.includes('linkedin')) return 'Social';
  if (r.includes('tielo-digital')) return 'Intern';
  return 'Referral';
}

function getConversionColor(pct: number): string {
  if (pct >= 5) return 'bg-emerald-500';
  if (pct >= 2) return 'bg-amber-500';
  return 'bg-red-500';
}

function getConversionTextColor(pct: number): string {
  if (pct >= 5) return 'text-emerald-400';
  if (pct >= 2) return 'text-amber-400';
  return 'text-red-400';
}

const BUTTON_LABELS: Record<string, { name: string; location: string }> = {
  cta_primary_hero_click: { name: 'Primaire CTA', location: 'Hero' },
  cta_secondary_hero_click: { name: 'Secundaire CTA', location: 'Hero' },
  contact_nav_click: { name: 'Contact', location: 'Navigatie' },
  cta_primary_floating_click: { name: 'Primaire CTA', location: 'Floating box' },
  cta_secondary_floating_click: { name: 'Secundaire CTA', location: 'Floating box' },
  cta_tertiary_floating_click: { name: 'Tertiaire CTA', location: 'Floating box' },
  whatsapp_click: { name: 'WhatsApp', location: 'Algemeen' },
};

// ─── Mini chart components (pure SVG / canvas-free) ───────────────────────────

function SparkLine({ data, color = '#e96020' }: { data: number[]; color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 120; const h = 36; const pad = 4;
  const pts = data.map((v, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  });
  const fill = [...pts, `${w - pad},${h - pad}`, `${pad},${h - pad}`].join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
      <polygon points={fill} fill={color} fillOpacity="0.15" />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <div className="text-white/40 text-sm text-center py-4">Geen data</div>;
  let offset = 0;
  const r = 60; const cx = 75; const cy = 75;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="20" />
        {data.map((d) => {
          const pct = d.value / total;
          const dash = pct * circumference;
          const el = (
            <circle
              key={d.label}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset * circumference}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dasharray 0.4s' }}
            />
          );
          offset += pct;
          return el;
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize="10">sessies</text>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-white/70">{d.label}</span>
            <span className="text-white font-bold ml-auto pl-4">{total ? Math.round((d.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, color = '#e96020' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-white/50 w-24 truncate flex-shrink-0">{d.label}</span>
          <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, background: color }}
            />
          </div>
          <span className="text-xs text-white font-bold w-8 text-right">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, xKey, yKey, color = '#e96020', label = '' }: {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  color?: string;
  label?: string;
}) {
  if (!data.length) return <div className="text-white/40 text-sm text-center py-8">Geen data</div>;
  const values = data.map(d => Number(d[yKey]) || 0);
  const max = Math.max(...values, 1);
  const w = 600; const h = 140; const padX = 40; const padY = 16;
  const pts = data.map((d, i) => {
    const x = padX + (i / Math.max(data.length - 1, 1)) * (w - padX * 2);
    const y = padY + (1 - (Number(d[yKey]) || 0) / max) * (h - padY * 2);
    return { x, y, val: d[yKey], label: d[xKey] };
  });
  const polyPts = pts.map(p => `${p.x},${p.y}`).join(' ');
  const fillPts = [...pts.map(p => `${p.x},${p.y}`), `${pts[pts.length - 1].x},${h - padY}`, `${pts[0].x},${h - padY}`].join(' ');

  const tickCount = Math.min(7, data.length);
  const tickStep = Math.max(1, Math.floor(data.length / tickCount));
  const ticks = pts.filter((_, i) => i % tickStep === 0 || i === data.length - 1);

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minHeight: 100 }}>
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={padX} x2={w - padX} y1={padY + (1 - t) * (h - padY * 2)} y2={padY + (1 - t) * (h - padY * 2)}
            stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        <polygon points={fillPts} fill={color} fillOpacity="0.12" />
        <polyline points={polyPts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {ticks.map((p, i) => (
          <text key={i} x={p.x} y={h - 2} textAnchor="middle" fill="#64748b" fontSize="9">
            {String(p.label).slice(5)}
          </text>
        ))}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="#0f172a" strokeWidth="1.5" />
        ))}
      </svg>
      {label && <p className="text-xs text-white/40 mt-1 text-center">{label}</p>}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  title, value, subtitle, icon: Icon, change, sparkData, accent = '#e96020'
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  change?: number;
  sparkData?: number[];
  accent?: string;
}) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] rounded-2xl p-5 border border-white/5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + '20' }}>
            <Icon className="w-4 h-4" style={{ color: accent }} />
          </div>
          <span className="text-sm text-white/60 font-medium">{title}</span>
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(change).toFixed(0)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-xs text-white/40 mt-1">{subtitle}</p>
      </div>
      {sparkData && sparkData.length > 1 && (
        <SparkLine data={sparkData} color={accent} />
      )}
    </motion.div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
        <Icon className="w-4 h-4 text-[#e96020]" />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AnalyticsPage() {
  const { user } = useAuth();
  const ranges = getDateRanges();
  const [activeRange, setActiveRange] = useState<string>('last7');
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KpiData>({
    visitors: 0, uniqueVisitors: 0, pageViews: 0,
    avgSessionSeconds: 0, totalClicks: 0,
    prevVisitors: 0, prevClicks: 0, prevAvgSession: 0,
  });
  const [daily, setDaily] = useState<DailyData[]>([]);
  const [buttons, setButtons] = useState<ButtonStat[]>([]);
  const [traffic, setTraffic] = useState<TrafficSource[]>([]);
  const [devices, setDevices] = useState<DeviceStat[]>([]);
  const [pages, setPages] = useState<PageStat[]>([]);
  const [referrers, setReferrers] = useState<ReferrerStat[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_profiles')
      .select('is_admin, email')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.is_admin && data?.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          setAccessDenied(true);
        }
      });
  }, [user]);

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const range = ranges[activeRange];
      const start = range.start.toISOString();
      const end = range.end.toISOString();

      // Previous period for comparison
      const duration = range.end.getTime() - range.start.getTime();
      const prevStart = new Date(range.start.getTime() - duration).toISOString();
      const prevEnd = start;

      // Visitors in range
      const [visitorsRes, prevVisitorsRes, pageViewsRes, eventsRes, prevEventsRes] = await Promise.all([
        supabase.from('visitors').select('session_id, visitor_id, device_type, referrer, utm_source, utm_medium, utm_campaign, time_on_site_seconds, created_at')
          .eq('domain', DOMAIN)
          .gte('created_at', start).lte('created_at', end),
        supabase.from('visitors').select('session_id, visitor_id, time_on_site_seconds')
          .eq('domain', DOMAIN)
          .gte('created_at', prevStart).lte('created_at', prevEnd),
        supabase.from('page_views').select('session_id, page_path, page_title, created_at, time_on_page_seconds, referrer')
          .eq('domain', DOMAIN)
          .gte('created_at', start).lte('created_at', end),
        supabase.from('events').select('event_name, button_name, button_location, session_id, visitor_id, created_at, metadata')
          .eq('domain', DOMAIN)
          .gte('created_at', start).lte('created_at', end),
        supabase.from('events').select('session_id')
          .eq('domain', DOMAIN)
          .gte('created_at', prevStart).lte('created_at', prevEnd),
      ]);

      const visitors = visitorsRes.data || [];
      const prevVisitors = prevVisitorsRes.data || [];
      const pageViewsData = pageViewsRes.data || [];
      const eventsData = eventsRes.data || [];
      const prevEventsData = prevEventsRes.data || [];

      const uniqueVisitorIds = new Set(visitors.map(v => v.visitor_id)).size;
      const totalTimeOnSite = visitors.reduce((s, v) => s + (v.time_on_site_seconds || 0), 0);
      const avgSession = visitors.length ? totalTimeOnSite / visitors.length : 0;
      const prevAvgSession = prevVisitors.length
        ? prevVisitors.reduce((s, v) => s + (v.time_on_site_seconds || 0), 0) / prevVisitors.length
        : 0;

      setKpi({
        visitors: visitors.length,
        uniqueVisitors: uniqueVisitorIds,
        pageViews: pageViewsData.length,
        avgSessionSeconds: avgSession,
        totalClicks: eventsData.length,
        prevVisitors: prevVisitors.length,
        prevClicks: prevEventsData.length,
        prevAvgSession,
      });

      // Daily breakdown
      const dayMap: Record<string, { visitors: Set<string>; clicks: number; time: number; sessions: number }> = {};
      visitors.forEach(v => {
        const day = v.created_at.slice(0, 10);
        if (!dayMap[day]) dayMap[day] = { visitors: new Set(), clicks: 0, time: 0, sessions: 0 };
        dayMap[day].visitors.add(v.visitor_id);
        dayMap[day].time += v.time_on_site_seconds || 0;
        dayMap[day].sessions++;
      });
      eventsData.forEach(e => {
        const day = e.created_at.slice(0, 10);
        if (!dayMap[day]) dayMap[day] = { visitors: new Set(), clicks: 0, time: 0, sessions: 0 };
        dayMap[day].clicks++;
      });
      const dailyArr: DailyData[] = Object.entries(dayMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, d]) => ({
          date,
          visitors: d.visitors.size,
          clicks: d.clicks,
          avgSession: d.sessions ? d.time / d.sessions : 0,
        }));
      setDaily(dailyArr);

      // Button stats
      const btnMap: Record<string, { clicks: number; sessions: Set<string>; last: string | null }> = {};
      eventsData.forEach(e => {
        const key = e.event_name || 'unknown';
        if (!btnMap[key]) btnMap[key] = { clicks: 0, sessions: new Set(), last: null };
        btnMap[key].clicks++;
        btnMap[key].sessions.add(e.session_id);
        if (!btnMap[key].last || e.created_at > btnMap[key].last!) btnMap[key].last = e.created_at;
      });
      const btnArr: ButtonStat[] = Object.entries(btnMap)
        .sort(([, a], [, b]) => b.clicks - a.clicks)
        .map(([event_name, d]) => {
          const label = BUTTON_LABELS[event_name];
          return {
            event_name,
            button_name: label?.name || event_name,
            button_location: label?.location || '-',
            clicks: d.clicks,
            unique_clicks: d.sessions.size,
            last_click: d.last,
          };
        });
      setButtons(btnArr);

      // Traffic sources
      const srcMap: Record<string, { sessions: Set<string>; time: number; sessionCount: number }> = {};
      visitors.forEach(v => {
        const src = classifySource(v.referrer || '', v.utm_source || '');
        if (!srcMap[src]) srcMap[src] = { sessions: new Set(), time: 0, sessionCount: 0 };
        srcMap[src].sessions.add(v.session_id);
        srcMap[src].time += v.time_on_site_seconds || 0;
        srcMap[src].sessionCount++;
      });
      const srcClicks: Record<string, number> = {};
      eventsData.forEach(e => {
        const v = visitors.find(vis => vis.session_id === e.session_id);
        const src = v ? classifySource(v.referrer || '', v.utm_source || '') : 'Direct';
        srcClicks[src] = (srcClicks[src] || 0) + 1;
      });
      const trafficArr: TrafficSource[] = Object.entries(srcMap)
        .sort(([, a], [, b]) => b.sessions.size - a.sessions.size)
        .map(([source, d]) => ({
          source,
          visitors: d.sessions.size,
          clicks: srcClicks[source] || 0,
          avgSession: d.sessionCount ? d.time / d.sessionCount : 0,
        }));
      setTraffic(trafficArr);

      // Devices
      const devMap: Record<string, { sessions: Set<string>; time: number; cnt: number }> = {};
      visitors.forEach(v => {
        const dev = v.device_type || 'desktop';
        if (!devMap[dev]) devMap[dev] = { sessions: new Set(), time: 0, cnt: 0 };
        devMap[dev].sessions.add(v.session_id);
        devMap[dev].time += v.time_on_site_seconds || 0;
        devMap[dev].cnt++;
      });
      const devClicks: Record<string, number> = {};
      eventsData.forEach(e => {
        const v = visitors.find(vis => vis.session_id === e.session_id);
        const dev = v?.device_type || 'desktop';
        devClicks[dev] = (devClicks[dev] || 0) + 1;
      });
      setDevices(
        Object.entries(devMap)
          .sort(([, a], [, b]) => b.sessions.size - a.sessions.size)
          .map(([device, d]) => ({
            device,
            visitors: d.sessions.size,
            clicks: devClicks[device] || 0,
            avgSession: d.cnt ? d.time / d.cnt : 0,
          }))
      );

      // Page stats
      const pgMap: Record<string, { views: number; sessions: Set<string>; time: number }> = {};
      pageViewsData.forEach(pv => {
        const p = pv.page_path || '/';
        if (!pgMap[p]) pgMap[p] = { views: 0, sessions: new Set(), time: 0 };
        pgMap[p].views++;
        pgMap[p].sessions.add(pv.session_id);
        pgMap[p].time += pv.time_on_page_seconds || 0;
      });
      setPages(
        Object.entries(pgMap)
          .sort(([, a], [, b]) => b.views - a.views)
          .slice(0, 15)
          .map(([page_path, d]) => ({
            page_path,
            views: d.views,
            unique_sessions: d.sessions.size,
            avg_time: d.views ? d.time / d.views : 0,
          }))
      );

      // Referrers
      const refMap: Record<string, number> = {};
      visitors.forEach(v => {
        const ref = v.referrer || '(direct)';
        if (!ref || ref === '' || ref.includes('tielo-digital')) return;
        // Shorten referrer to domain
        let domain = ref;
        try { domain = new URL(ref).hostname.replace('www.', ''); } catch {}
        refMap[domain] = (refMap[domain] || 0) + 1;
      });
      const refArr: ReferrerStat[] = Object.entries(refMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([referrer, visitors]) => ({ referrer, visitors }));
      setReferrers(refArr);

    } catch (e) {
      console.error('Analytics load error', e);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, activeRange]);

  useEffect(() => { load(); }, [load]);

  // ─── Insights ───────────────────────────────────────────────────────────────

  const insights: string[] = [];
  if (buttons.length) {
    insights.push(`De "${buttons[0].button_name}" knop (${buttons[0].button_location}) levert momenteel de meeste conversies op met ${buttons[0].clicks} klikken.`);
  }
  if (devices.length >= 2) {
    const best = [...devices].sort((a, b) => {
      const ra = kpi.visitors ? a.clicks / a.visitors : 0;
      const rb = kpi.visitors ? b.clicks / b.visitors : 0;
      return rb - ra;
    })[0];
    const labels: Record<string, string> = { mobile: 'Mobiele', desktop: 'Desktop', tablet: 'Tablet' };
    insights.push(`${labels[best.device] || best.device} bezoekers converteren het beste van alle apparaten.`);
  }
  if (traffic.length) {
    const bestSrc = [...traffic].sort((a, b) => b.avgSession - a.avgSession)[0];
    insights.push(`Bezoekers via "${bestSrc.source}" blijven gemiddeld het langst op de website (${formatSeconds(bestSrc.avgSession)}).`);
  }
  if (kpi.visitors > 0) {
    const cr = (kpi.totalClicks / kpi.visitors) * 100;
    if (cr < 2) insights.push('De totale conversieratio ligt onder 2%. Overweeg de CTA-knoppen prominenter te plaatsen.');
    else if (cr >= 5) insights.push(`Uitstekend! De totale conversieratio is ${formatPct(cr)} — ruim boven het gemiddelde.`);
  }

  if (accessDenied) {
    return (
      <ProtectedRoute>
        <DashboardLayout currentPage="home">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-400 font-medium">Geen toegang — alleen beschikbaar voor de admin.</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const conversionRate = kpi.visitors > 0 ? (kpi.totalClicks / kpi.visitors) * 100 : 0;
  const sparkVisitors = daily.map(d => d.visitors);
  const sparkClicks = daily.map(d => d.clicks);
  const deviceColors: Record<string, string> = { mobile: '#e96020', desktop: '#40798c', tablet: '#70a9a1' };
  const donutData = devices.map(d => ({
    label: d.device.charAt(0).toUpperCase() + d.device.slice(1),
    value: d.visitors,
    color: deviceColors[d.device] || '#cfd7c7',
  }));

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="analytics">
        <div className="min-h-screen bg-[#0f172a] -m-4 md:-m-6 lg:-m-8 p-4 md:p-6 lg:p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Analytics</h1>
              <p className="text-sm text-white/50 mt-0.5">tielo-digital.nl — website statistieken</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-sm transition-all border border-white/10"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Vernieuwen
              </button>
            </div>
          </div>

          {/* Date range filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(ranges).map(([key, r]) => (
              <button
                key={key}
                onClick={() => setActiveRange(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeRange === key
                    ? 'bg-[#e96020] text-white shadow'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-[#e96020] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">

              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                  title="Totaal bezoekers"
                  value={kpi.visitors.toLocaleString('nl')}
                  subtitle="Alle websitesessies"
                  icon={Users}
                  change={pctChange(kpi.visitors, kpi.prevVisitors)}
                  sparkData={sparkVisitors}
                />
                <KpiCard
                  title="Totale klikken"
                  value={kpi.totalClicks.toLocaleString('nl')}
                  subtitle="Alle CTA-knoppen"
                  icon={MousePointerClick}
                  change={pctChange(kpi.totalClicks, kpi.prevClicks)}
                  sparkData={sparkClicks}
                  accent="#40798c"
                />
                <KpiCard
                  title="Conversieratio"
                  value={formatPct(conversionRate)}
                  subtitle="Klikken / bezoekers"
                  icon={TrendingUp}
                  accent="#70a9a1"
                />
                <KpiCard
                  title="Gem. sessieduur"
                  value={formatSeconds(kpi.avgSessionSeconds)}
                  subtitle="Gemiddelde tijd per bezoeker"
                  icon={Clock}
                  change={pctChange(kpi.avgSessionSeconds, kpi.prevAvgSession)}
                  accent="#cfd7c7"
                />
              </div>

              {/* Extra KPI row */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#111827] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#e96020]/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-[#e96020]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{kpi.pageViews.toLocaleString('nl')}</p>
                    <p className="text-xs text-white/50">Paginaweergaven</p>
                  </div>
                </div>
                <div className="bg-[#111827] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#40798c]/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[#40798c]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{kpi.uniqueVisitors.toLocaleString('nl')}</p>
                    <p className="text-xs text-white/50">Unieke bezoekers</p>
                  </div>
                </div>
                <div className="bg-[#111827] rounded-2xl p-4 border border-white/5 flex items-center gap-4 col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 rounded-xl bg-[#70a9a1]/10 flex items-center justify-center flex-shrink-0">
                    <BarChart2 className="w-5 h-5 text-[#70a9a1]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{kpi.visitors > 0 ? (kpi.pageViews / kpi.visitors).toFixed(1) : '0'}</p>
                    <p className="text-xs text-white/50">Pag. per sessie</p>
                  </div>
                </div>
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Section title="Bezoekers per dag" icon={Users}>
                  <LineChart data={daily} xKey="date" yKey="visitors" color="#e96020" label="Sessies per dag" />
                </Section>
                <Section title="Klikken per dag" icon={MousePointerClick}>
                  <LineChart data={daily} xKey="date" yKey="clicks" color="#40798c" label="CTA-klikken per dag" />
                </Section>
              </div>

              {/* Session duration chart */}
              <Section title="Gemiddelde sessieduur per dag" icon={Clock}>
                <LineChart
                  data={daily.map(d => ({ ...d, avgSessionMin: +(d.avgSession / 60).toFixed(2) }))}
                  xKey="date" yKey="avgSessionMin" color="#70a9a1"
                  label="Minuten per dag"
                />
              </Section>

              {/* Conversion buttons table */}
              <Section title="Conversieknoppen" icon={MousePointerClick}>
                {buttons.length === 0 ? (
                  <p className="text-white/40 text-sm">Nog geen klikdata. Tracking wordt automatisch bijgewerkt.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          {['Knop', 'Locatie', 'Klikken', 'Uniek', 'Conv.%', 'Laatste klik'].map(h => (
                            <th key={h} className="text-left py-2 pr-4 text-xs text-white/40 font-semibold uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {buttons.map((b) => {
                          const cr = kpi.visitors > 0 ? (b.clicks / kpi.visitors) * 100 : 0;
                          return (
                            <tr key={b.event_name} className="hover:bg-white/2 transition-colors">
                              <td className="py-3 pr-4 font-medium text-white">{b.button_name}</td>
                              <td className="py-3 pr-4 text-white/50">{b.button_location}</td>
                              <td className="py-3 pr-4 font-bold text-white">{b.clicks}</td>
                              <td className="py-3 pr-4 text-white/70">{b.unique_clicks}</td>
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-white/5 rounded-full h-1.5">
                                    <div className={`h-full rounded-full ${getConversionColor(cr)}`} style={{ width: `${Math.min(cr * 10, 100)}%` }} />
                                  </div>
                                  <span className={`text-xs font-bold ${getConversionTextColor(cr)}`}>{formatPct(cr)}</span>
                                </div>
                              </td>
                              <td className="py-3 pr-4 text-white/40 text-xs">
                                {b.last_click ? new Date(b.last_click).toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Section>

              {/* Pages table */}
              <Section title="Paginaweergaven" icon={Eye}>
                {pages.length === 0 ? (
                  <p className="text-white/40 text-sm">Geen paginadata beschikbaar.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          {['Pagina', 'Weergaven', 'Unieke sess.', 'Gem. tijd'].map(h => (
                            <th key={h} className="text-left py-2 pr-4 text-xs text-white/40 font-semibold uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {pages.map((p) => (
                          <tr key={p.page_path} className="hover:bg-white/2 transition-colors">
                            <td className="py-2.5 pr-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-white font-medium truncate max-w-[200px]">{p.page_path}</span>
                                <a href={`https://${DOMAIN}${p.page_path}`} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[#e96020] transition-colors flex-shrink-0">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </td>
                            <td className="py-2.5 pr-4 font-bold text-white">{p.views}</td>
                            <td className="py-2.5 pr-4 text-white/60">{p.unique_sessions}</td>
                            <td className="py-2.5 pr-4 text-white/60">{formatSeconds(p.avg_time)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Section>

              {/* Bottom row: traffic, devices, referrers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Traffic sources */}
                <Section title="Verkeersbronnen" icon={Globe}>
                  {traffic.length === 0 ? (
                    <p className="text-white/40 text-sm">Geen data.</p>
                  ) : (
                    <div className="space-y-3">
                      {traffic.map(s => {
                        const cr = s.visitors > 0 ? (s.clicks / s.visitors) * 100 : 0;
                        return (
                          <div key={s.source} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-white font-medium truncate">{s.source}</span>
                                <span className="text-xs text-white/50 ml-2 flex-shrink-0">{s.visitors} sess.</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white/5 rounded-full h-1.5">
                                  <div className="h-full rounded-full bg-[#e96020]" style={{ width: `${Math.min((s.visitors / (kpi.visitors || 1)) * 100, 100)}%` }} />
                                </div>
                                <span className={`text-[11px] font-bold flex-shrink-0 ${getConversionTextColor(cr)}`}>{formatPct(cr)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Section>

                {/* Devices */}
                <Section title="Apparaten" icon={Monitor}>
                  <DonutChart data={donutData} />
                  {devices.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
                      {devices.map(d => {
                        const cr = d.visitors > 0 ? (d.clicks / d.visitors) * 100 : 0;
                        const icons: Record<string, React.ElementType> = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };
                        const DevIcon = icons[d.device] || Monitor;
                        return (
                          <div key={d.device} className="flex items-center gap-2 text-sm">
                            <DevIcon className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                            <span className="text-white/60 capitalize flex-1">{d.device}</span>
                            <span className="text-white/40 text-xs">{formatSeconds(d.avgSession)}</span>
                            <span className={`text-xs font-bold ${getConversionTextColor(cr)}`}>{formatPct(cr)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Section>

                {/* Referrers */}
                <Section title="Referrers" icon={ExternalLink}>
                  {referrers.length === 0 ? (
                    <p className="text-white/40 text-sm">Geen externe referrers gevonden.</p>
                  ) : (
                    <BarChart data={referrers.map(r => ({ label: r.referrer, value: r.visitors }))} color="#40798c" />
                  )}
                </Section>

              </div>

              {/* Insights */}
              {insights.length > 0 && (
                <Section title="Automatische inzichten" icon={Lightbulb}>
                  <div className="space-y-3">
                    {insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                        <div className="w-6 h-6 rounded-lg bg-[#e96020]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Lightbulb className="w-3.5 h-3.5 text-[#e96020]" />
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
