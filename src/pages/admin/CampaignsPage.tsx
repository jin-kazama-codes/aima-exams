import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Check,
  FileSpreadsheet,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { Campaign } from '../../types/aima';
import { PageHeader, StatusLabel } from '../../components/ui/Common';
import { DonutChart, HorizontalBarList } from '../../components/ui/Charts';

export const CampaignsPage: React.FC<{ initialMode?: 'campaigns' | 'positions' }> = ({
  initialMode = 'campaigns',
}) => {
  const { campaigns, updateCampaign, pushToast } = useAima();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [configTab, setConfigTab] = useState<
    | 'overview'
    | 'positions'
    | 'eligibility'
    | 'reservation'
    | 'form'
    | 'scheme'
    | 'rules'
  >('overview');

  const [formPreviewFields, setFormPreviewFields] = useState([
    { key: 'Personal & Identity (Aadhaar/PAN)', required: true, enabled: true },
    { key: 'Category & PwBD UDID Verification', required: true, enabled: true },
    { key: 'Academic Transcripts (10th, 12th, Degree)', required: true, enabled: true },
    { key: 'Post-Qualification Work Experience', required: false, enabled: true },
    { key: 'Examination City & Shift Preferences (3 Choices)', required: true, enabled: true },
  ]);

  if (initialMode === 'positions' && !selectedCampaign) {
    const allRows = campaigns.flatMap((c) =>
      c.reservationMatrix.map((row) => ({ ...row, campaignId: c.id, campaignTitle: c.shortTitle }))
    );
    const totals = allRows.reduce(
      (acc, r) => ({
        General: acc.General + r.General,
        OBC: acc.OBC + r['OBC-NCL'],
        SC: acc.SC + r.SC,
        ST: acc.ST + r.ST,
        EWS: acc.EWS + r.EWS,
        PwBD: acc.PwBD + r.pwbdReserved,
      }),
      { General: 0, OBC: 0, SC: 0, ST: 0, EWS: 0, PwBD: 0 }
    );
    const grandTotal = totals.General + totals.OBC + totals.SC + totals.ST + totals.EWS;

    return (
      <div className="space-y-6">
        <PageHeader
          title="Positions & Sanctioned Vacancies"
          subtitle="Category-wise vacancy roster and pay-level matrix across 2027 recruitment notifications"
          actions={
            <button
              onClick={() => pushToast('Roster Exported', 'Sanctioned vacancy matrix downloaded as CSV.', 'info')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Roster CSV
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
              Reservation Category Distribution
            </h2>
            <DonutChart
              centerValue={String(grandTotal)}
              centerLabel="Sanctioned Posts"
              segments={[
                { label: 'General (UR)', value: totals.General, color: '#0B1F3A' },
                { label: 'OBC-NCL (27%)', value: totals.OBC, color: '#1D4ED8' },
                { label: 'SC (15%)', value: totals.SC, color: '#16A34A' },
                { label: 'EWS (10%)', value: totals.EWS, color: '#D97706' },
                { label: 'ST (7.5%)', value: totals.ST, color: '#64748B' },
              ]}
            />
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
              Cadre-wise Vacancy Allocation
            </h2>
            <HorizontalBarList
              items={allRows.map((r) => ({
                label: `${r.position}`,
                sublabel: `${r.campaignTitle} · ${r.grade} · ${r.payLevel}`,
                value: r.General + r['OBC-NCL'] + r.SC + r.ST + r.EWS,
                color: '#1D4ED8',
              }))}
            />
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
            Master Category-wise Vacancy Matrix
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 pr-3 font-medium">Position Title</th>
                  <th className="py-2.5 px-3 font-medium">Campaign</th>
                  <th className="py-2.5 px-3 font-medium">Pay Level</th>
                  <th className="py-2.5 px-3 font-medium text-right">UR</th>
                  <th className="py-2.5 px-3 font-medium text-right">OBC-NCL</th>
                  <th className="py-2.5 px-3 font-medium text-right">SC</th>
                  <th className="py-2.5 px-3 font-medium text-right">ST</th>
                  <th className="py-2.5 px-3 font-medium text-right">EWS</th>
                  <th className="py-2.5 px-3 font-medium text-right">PwBD*</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allRows.map((row) => {
                  const rowSum = row.General + row['OBC-NCL'] + row.SC + row.ST + row.EWS;
                  return (
                    <tr key={`${row.campaignId}-${row.position}`} className="hover:bg-slate-50">
                      <td className="py-3 pr-3 font-semibold text-slate-900">{row.position}</td>
                      <td className="py-3 px-3 text-slate-600">{row.campaignTitle}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{row.payLevel}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{row.General}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{row['OBC-NCL']}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{row.SC}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{row.ST}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{row.EWS}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-700 font-medium">{row.pwbdReserved}</td>
                      <td className="py-3 pl-3 text-right font-mono tabular-nums font-bold text-[#0B1F3A]">{rowSum}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">*PwBD horizontal reservation applies across all vertical categories per DoPT guidelines.</p>
        </section>
      </div>
    );
  }

  if (selectedCampaign) {
    const activeCp = campaigns.find((c) => c.id === selectedCampaign.id) ?? selectedCampaign;
    const catTotals = activeCp.reservationMatrix.reduce(
      (acc, r) => ({
        General: acc.General + r.General,
        OBC: acc.OBC + r['OBC-NCL'],
        SC: acc.SC + r.SC,
        ST: acc.ST + r.ST,
        EWS: acc.EWS + r.EWS,
      }),
      { General: 0, OBC: 0, SC: 0, ST: 0, EWS: 0 }
    );

    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'positions', label: 'Positions & Vacancies' },
      { id: 'eligibility', label: 'Eligibility' },
      { id: 'reservation', label: 'Reservation Matrix' },
      { id: 'form', label: 'Application Form' },
      { id: 'scheme', label: 'Examination Scheme' },
      { id: 'rules', label: 'Selection Rules' },
    ] as const;

    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <button
              onClick={() => setSelectedCampaign(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline mb-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaigns
            </button>
            <h1 className="text-xl font-display font-bold text-[#0B1F3A]">{activeCp.title}</h1>
            <div className="text-xs text-slate-500 mt-0.5 font-mono">
              {activeCp.id} · {activeCp.department} · Exam Date: {activeCp.examDate}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <StatusLabel label={activeCp.status} />
            <button
              onClick={() =>
                updateCampaign(activeCp.id, {
                  status: activeCp.status === 'Active' ? 'Scheduled' : 'Active',
                })
              }
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561]"
            >
              Toggle Notification Status
            </button>
          </div>
        </div>

        {/* Configuration Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setConfigTab(t.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                configTab === t.id
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {configTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Notification Parameters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-500">Recruitment ID</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5">{activeCp.id}</div>
                </div>
                <div>
                  <div className="text-slate-500">Current Stage</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{activeCp.stage}</div>
                </div>
                <div>
                  <div className="text-slate-500">Total Vacancies</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5">{activeCp.totalVacancies}</div>
                </div>
                <div>
                  <div className="text-slate-500">Applications Received</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5">{activeCp.applicationCount.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-slate-500">Application Deadline</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5">{activeCp.deadline}</div>
                </div>
                <div>
                  <div className="text-slate-500">Fee (UR / Reserved)</div>
                  <div className="font-mono font-semibold text-slate-900 mt-0.5">₹{activeCp.feeGeneral} / ₹{activeCp.feeReserved}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-3">Vacancy Distribution</h2>
              <DonutChart
                size={140}
                centerValue={String(activeCp.totalVacancies)}
                centerLabel="Total Posts"
                segments={[
                  { label: 'General', value: catTotals.General, color: '#0B1F3A' },
                  { label: 'OBC-NCL', value: catTotals.OBC, color: '#1D4ED8' },
                  { label: 'SC', value: catTotals.SC, color: '#16A34A' },
                  { label: 'EWS', value: catTotals.EWS, color: '#D97706' },
                  { label: 'ST', value: catTotals.ST, color: '#64748B' },
                ]}
              />
            </div>
          </div>
        )}

        {(configTab === 'positions' || configTab === 'reservation') && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
                Category-wise Vacancy Matrix ({activeCp.totalVacancies} Sanctioned Posts)
              </h2>
              <span className="text-xs text-slate-500">Horizontal PwBD reservation: 4%</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-3 font-medium">Cadre / Position</th>
                    <th className="py-2 px-3 font-medium">Grade</th>
                    <th className="py-2 px-3 font-medium">Pay Level</th>
                    <th className="py-2 px-3 font-medium text-right">General</th>
                    <th className="py-2 px-3 font-medium text-right">OBC-NCL</th>
                    <th className="py-2 px-3 font-medium text-right">SC</th>
                    <th className="py-2 px-3 font-medium text-right">ST</th>
                    <th className="py-2 px-3 font-medium text-right">EWS</th>
                    <th className="py-2 pl-3 font-medium text-right">PwBD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCp.reservationMatrix.map((r) => (
                    <tr key={r.position}>
                      <td className="py-3 pr-3 font-semibold text-slate-900">{r.position}</td>
                      <td className="py-3 px-3 text-slate-600">{r.grade}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{r.payLevel}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{r.General}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{r['OBC-NCL']}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{r.SC}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{r.ST}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{r.EWS}</td>
                      <td className="py-3 pl-3 text-right font-mono tabular-nums font-semibold text-amber-700">{r.pwbdReserved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {configTab === 'eligibility' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Statutory Eligibility Criteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="text-slate-500">Age Bracket (as on 01 Jan 2027)</div>
                <div className="text-lg font-display font-bold text-[#0B1F3A] mt-1 font-mono">
                  {activeCp.minAge} – {activeCp.maxAge} Years
                </div>
                <div className="text-slate-500 mt-1">Relaxation: OBC +3 yrs · SC/ST +5 yrs · PwBD +10 yrs</div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg md:col-span-2">
                <div className="text-slate-500">Essential Educational Qualification</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{activeCp.qualification}</div>
                <div className="text-slate-500 mt-1">Degrees must be recognized by UGC / AICTE / Statutory Councils.</div>
              </div>
            </div>
          </div>
        )}

        {configTab === 'form' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Candidate Application Form Sections</h2>
              <button
                onClick={() => pushToast('Form Schema Saved', 'Application form rules updated.', 'success')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800"
              >
                Save Schema
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {formPreviewFields.map((f, idx) => (
                <div key={f.key} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">{f.key}</div>
                    <div className="text-slate-500">{f.required ? 'Mandatory section' : 'Optional / Conditional'}</div>
                  </div>
                  <button
                    onClick={() =>
                      setFormPreviewFields((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, enabled: !item.enabled } : item))
                      )
                    }
                    className={`px-3 py-1 rounded border text-xs font-medium ${
                      f.enabled
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {f.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {configTab === 'scheme' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Written Examination Scheme</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-3 font-medium">Paper</th>
                    <th className="py-2 px-3 font-medium">Subject Domain</th>
                    <th className="py-2 px-3 font-medium text-right">Questions</th>
                    <th className="py-2 px-3 font-medium text-right">Max Marks</th>
                    <th className="py-2 px-3 font-medium text-right">Duration</th>
                    <th className="py-2 pl-3 font-medium">Negative Marking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCp.examScheme.map((p) => (
                    <tr key={p.paper}>
                      <td className="py-3 pr-3 font-mono font-semibold text-[#0B1F3A]">{p.paper}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">{p.subject}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{p.questions}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{p.maxMarks}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{p.durationMins} mins</td>
                      <td className="py-3 pl-3 text-slate-600">{p.negativeMarking}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {configTab === 'rules' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Merit & Selection Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                <div className="text-slate-500">Composite Merit Weightage</div>
                <div className="font-display text-base font-bold text-[#0B1F3A]">
                  Written {activeCp.selectionRules.writtenWeightage}% + Panel Interview {activeCp.selectionRules.interviewWeightage}%
                </div>
                <div className="text-slate-600">
                  AI Interview Evaluation: Structured advisory scorecard only (human panel holds final authority).
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg space-y-2">
                <div className="text-slate-500">Tie-Breaker Protocol</div>
                <div className="font-semibold text-slate-900">{activeCp.selectionRules.tieBreaker}</div>
                <div className="text-slate-600 font-mono">
                  Qualifying Floor: UR {activeCp.selectionRules.minimumQualifyingGeneral} · Reserved {activeCp.selectionRules.minimumQualifyingReserved}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Campaigns"
        subtitle="Manage active 2027 recruitment notifications, vacancy rosters, and examination rules"
        actions={
          <button
            onClick={() => setSelectedCampaign(campaigns[0])}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Configure Active Campaign
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {campaigns.map((c) => {
          const verifyPct = Math.round((c.verifiedCount / Math.max(c.applicationCount, 1)) * 100);
          return (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[11px] font-medium text-slate-500">{c.id}</span>
                  <StatusLabel label={c.status} />
                </div>
                <h2 className="text-base font-display font-bold text-[#0B1F3A] mt-2">{c.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{c.department}</p>

                <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <div className="text-slate-500">Applications</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {c.applicationCount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Vacancies</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {c.totalVacancies}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Deadline</div>
                    <div className="font-mono font-semibold text-slate-800 mt-0.5 tabular-nums">
                      {c.deadline}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{c.stage}</span>
                    <span className="font-mono tabular-nums font-semibold text-[#0B1F3A]">{verifyPct}% verified</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-700 rounded-full" style={{ width: `${verifyPct}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCampaign(c);
                    setConfigTab('overview');
                  }}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                >
                  Open Configuration
                </button>
                <button
                  onClick={() => {
                    setSelectedCampaign(c);
                    setConfigTab('reservation');
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Vacancies
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Campaign Ledger */}
      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-3">Notification Comparison Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3 font-medium">Recruitment ID</th>
                <th className="py-2 px-3 font-medium">Recruitment Title</th>
                <th className="py-2 px-3 font-medium text-right">Applications</th>
                <th className="py-2 px-3 font-medium text-right">Vacancies</th>
                <th className="py-2 px-3 font-medium">Deadline</th>
                <th className="py-2 px-3 font-medium">Current Stage</th>
                <th className="py-2 pl-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-2.5 pr-3 font-mono text-slate-700">{c.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{c.title}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{c.applicationCount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{c.totalVacancies}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">{c.deadline}</td>
                  <td className="py-2.5 px-3 text-slate-700">{c.stage}</td>
                  <td className="py-2.5 pl-3 text-right">
                    <button
                      onClick={() => setSelectedCampaign(c)}
                      className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
