import React, { useState } from 'react';
import {
  Award,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileBadge2,
  FolderKanban,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { KpiCard, StatusLabel } from '../../components/ui/Common';
import {
  AreaTrendChart,
  DonutChart,
  HorizontalBarList,
  PipelineFunnel,
} from '../../components/ui/Charts';

export const AdminDashboard: React.FC = () => {
  const {
    campaigns,
    candidates,
    centres,
    selectedCampaignId,
    setSelectedCampaignId,
    setAdminNav,
    activityLogs,
  } = useAima();

  const [dateFilter, setDateFilter] = useState<'30d' | '90d' | 'ytd'>('30d');

  const scopedCampaigns =
    selectedCampaignId === 'ALL'
      ? campaigns
      : campaigns.filter((c) => c.id === selectedCampaignId);

  const totalApps = scopedCampaigns.reduce((a, b) => a + b.applicationCount, 0);
  const totalVerified = scopedCampaigns.reduce((a, b) => a + b.verifiedCount, 0);
  const totalVacancies = scopedCampaigns.reduce((a, b) => a + b.totalVacancies, 0);
  const admitIssued = selectedCampaignId === 'ALL' ? 16420 : Math.round(totalVerified * 0.96);

  const applicationSeries =
    dateFilter === '30d'
      ? [
          { label: '01 Jan', value: 2450 },
          { label: '06 Jan', value: 4820 },
          { label: '11 Jan', value: 8910 },
          { label: '16 Jan', value: 14680 },
          { label: '21 Jan', value: 21400 },
          { label: '26 Jan', value: 33250 },
          { label: '31 Jan', value: totalApps },
        ]
      : [
          { label: 'Oct', value: 4200 },
          { label: 'Nov', value: 11800 },
          { label: 'Dec', value: 24500 },
          { label: 'Jan', value: 38900 },
          { label: 'Feb', value: totalApps },
        ];

  const statusSegments = [
    { label: 'Verified & Approved', value: totalVerified, color: '#16A34A' },
    { label: 'Under Scrutiny', value: Math.round((totalApps - totalVerified) * 0.58), color: '#1D4ED8' },
    { label: 'Discrepancy Flagged', value: Math.round((totalApps - totalVerified) * 0.24), color: '#D97706' },
    { label: 'Payment Pending', value: Math.round((totalApps - totalVerified) * 0.18), color: '#64748B' },
  ];

  const centreUtil = centres.map((ctr) => {
    const cap = ctr.halls.reduce((s, h) => s + h.totalCapacity, 0);
    const alloc = ctr.halls.reduce(
      (s, h) => s + h.seats.filter((st) => st.status === 'allocated').length,
      0
    );
    return {
      label: `${ctr.city} · ${ctr.name}`,
      value: alloc * 32,
      max: cap * 32,
      color: '#0B1F3A',
    };
  });

  const readinessItems = [
    { label: 'Document Verification Completion', pct: Math.round((totalVerified / Math.max(totalApps, 1)) * 100) },
    { label: 'Centre & Seat Allocation Lock', pct: 94 },
    { label: 'Admit Card Generation & QR Signing', pct: 91 },
    { label: 'Biometric & CCTV Hall Readiness', pct: 97 },
  ];

  const pipelineStages = [
    { stage: 'Applied', count: totalApps, pct: 100 },
    { stage: 'Verified', count: totalVerified, pct: Math.round((totalVerified / Math.max(totalApps, 1)) * 100) },
    { stage: 'Allocated', count: Math.round(totalVerified * 0.98), pct: 81 },
    { stage: 'Appeared', count: Math.round(totalVerified * 0.89), pct: 74 },
    { stage: 'Qualified', count: 1420, pct: 18 },
    { stage: 'Interviewed', count: 540, pct: 8 },
    { stage: 'Selected', count: totalVacancies, pct: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#0B1F3A] tracking-tight">
            Examination & Recruitment Command Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cycle 2027 Operations · {scopedCampaigns.length} Active Notification(s) · {candidates.length} tracked sample dossiers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
          >
            <option value="ALL">All 2027 Campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <div className="flex items-center p-1 bg-slate-200/70 rounded-lg">
            {(['30d', '90d', 'ytd'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDateFilter(d)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  dateFilter === d ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d === '30d' ? 'Last 30 Days' : d === '90d' ? 'Quarter' : 'Cycle YTD'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          label="Active Recruitments"
          value={campaigns.length}
          delta="2027 Notification Cycle"
          icon={FolderKanban}
          accent="navy"
          onClick={() => setAdminNav('campaigns')}
        />
        <KpiCard
          label="Total Applications"
          value={totalApps.toLocaleString('en-IN')}
          delta="+14.2% vs 2026"
          icon={Users}
          accent="blue"
          onClick={() => setAdminNav('applications')}
        />
        <KpiCard
          label="Verified Applications"
          value={totalVerified.toLocaleString('en-IN')}
          delta={`${Math.round((totalVerified / Math.max(totalApps, 1)) * 100)}% scrutiny rate`}
          icon={CheckCircle2}
          accent="emerald"
          onClick={() => setAdminNav('verification')}
        />
        <KpiCard
          label="Examinations Scheduled"
          value={3}
          delta="Next: 14 Mar 2027"
          icon={CalendarDays}
          accent="amber"
          onClick={() => setAdminNav('exam-planning')}
        />
        <KpiCard
          label="Admit Cards Issued"
          value={admitIssued.toLocaleString('en-IN')}
          delta="94.1% downloaded"
          icon={FileBadge2}
          accent="blue"
          onClick={() => setAdminNav('admit-cards')}
        />
        <KpiCard
          label="Candidates Selected"
          value={totalVacancies}
          delta="Total sanctioned posts"
          icon={Award}
          accent="emerald"
          onClick={() => setAdminNav('final-selection')}
        />
      </div>

      {/* Row 2: Applications Over Time + Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Applications Over Time</h2>
              <p className="text-xs text-slate-500">Cumulative registrations across active notifications</p>
            </div>
            <button
              onClick={() => setAdminNav('applications')}
              className="text-xs font-medium text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              View Ledger <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <AreaTrendChart data={applicationSeries} primaryLabel="Cumulative" />
        </section>

        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
          <div className="mb-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Application Verification Status</h2>
            <p className="text-xs text-slate-500">Current scrutiny distribution across dossiers</p>
          </div>
          <DonutChart
            segments={statusSegments}
            centerValue={totalApps.toLocaleString('en-IN')}
            centerLabel="Total Dossiers"
          />
        </section>
      </div>

      {/* Row 3: Recruitment-wise Applications + Examination Readiness + Centre Utilisation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Recruitment-wise Volume</h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">{totalVacancies} Posts</span>
          </div>
          <HorizontalBarList
            items={campaigns.map((c, i) => ({
              label: c.title,
              sublabel: `${c.totalVacancies} Vacancies · Exam ${c.examDate}`,
              value: c.applicationCount,
              color: i === 0 ? '#1D4ED8' : i === 1 ? '#0B1F3A' : '#D97706',
            }))}
          />
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Examination Readiness</h2>
            <button
              onClick={() => setAdminNav('seat-allocation')}
              className="text-xs font-medium text-blue-700 hover:underline"
            >
              Seat Map
            </button>
          </div>
          <div className="space-y-4">
            {readinessItems.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">{r.label}</span>
                  <span className="font-mono tabular-nums font-semibold text-[#0B1F3A]">{r.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.pct >= 95 ? 'bg-emerald-600' : 'bg-blue-700'}`}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Centre Capacity Utilisation</h2>
            <button
              onClick={() => setAdminNav('exam-centres')}
              className="text-xs font-medium text-blue-700 hover:underline"
            >
              Centres
            </button>
          </div>
          <HorizontalBarList items={centreUtil} />
        </section>
      </div>

      {/* Row 4: Horizontal Recruitment Pipeline Funnel */}
      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">End-to-End Recruitment Pipeline</h2>
            <p className="text-xs text-slate-500">Stage conversion from registration through final appointment</p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            Selectivity Ratio: {(totalApps / Math.max(totalVacancies, 1)).toFixed(0)}:1
          </span>
        </div>
        <PipelineFunnel stages={pipelineStages} />
      </section>

      {/* Row 5: Upcoming Exam/Interview Schedule + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Upcoming Examination & Interview Schedule</h2>
            <button
              onClick={() => setAdminNav('exam-planning')}
              className="text-xs font-medium text-blue-700 hover:underline"
            >
              Full Calendar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-medium">Date & Shift</th>
                  <th className="py-2 px-3 font-medium">Event</th>
                  <th className="py-2 px-3 font-medium">Location</th>
                  <th className="py-2 pl-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 pr-3 font-mono tabular-nums text-slate-700">14 Mar 2027 · 09:30</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">AO Written Examination (Papers I–IV)</td>
                  <td className="py-2.5 px-3 text-slate-600">New Delhi, Mumbai, Bengaluru, Chennai</td>
                  <td className="py-2.5 pl-3 text-right"><StatusLabel label="Published" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 pr-3 font-mono tabular-nums text-slate-700">28 Mar 2027 · 09:30</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Finance Officer Technical Exam</td>
                  <td className="py-2.5 px-3 text-slate-600">All 4 Regional Hubs</td>
                  <td className="py-2.5 pl-3 text-right"><StatusLabel label="Scheduled" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 pr-3 font-mono tabular-nums text-slate-700">06 Apr 2027 · 10:30</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Panel A Interviews · AO Grade A</td>
                  <td className="py-2.5 px-3 text-slate-600">AIMA HQ Board Room I</td>
                  <td className="py-2.5 pl-3 text-right"><StatusLabel label="Active" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 pr-3 font-mono tabular-nums text-slate-700">11 Apr 2027 · 14:30</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">IT Officer Systems & Security Exam</td>
                  <td className="py-2.5 px-3 text-slate-600">CBT Testing Labs</td>
                  <td className="py-2.5 pl-3 text-right"><StatusLabel label="Scheduled" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Recent Operational Activities</h2>
            <ClipboardList className="w-4 h-4 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100">
            {activityLogs.slice(0, 5).map((act) => (
              <div key={act.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-800">{act.module}</span>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{act.action}</p>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {act.actor}{act.referenceId ? ` · ${act.referenceId}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
