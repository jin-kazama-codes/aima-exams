import React, { useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Landmark,
  MapPin,
  Play,
  Users,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { CandidateAvatar, KpiCard, PageHeader, StatusLabel } from '../../components/ui/Common';
import { HorizontalBarList } from '../../components/ui/Charts';

export const CentreAllocationPage: React.FC = () => {
  const {
    campaigns,
    candidates,
    centres,
    selectedCampaignId,
    autoAllocateCentres,
    assignCandidateCentre,
    setAdminNav,
  } = useAima();

  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [assignmentFilter, setAssignmentFilter] = useState<'ALL' | 'Assigned' | 'Unassigned'>('ALL');

  const verifiedPool = candidates.filter(
    (c) =>
      c.verificationStatus === 'Verified' &&
      (selectedCampaignId === 'ALL' || c.campaignId === selectedCampaignId)
  );

  const assignedToCentre = verifiedPool.filter((c) => Boolean(c.allocatedCentreId));
  const unassignedToCentre = verifiedPool.filter((c) => !c.allocatedCentreId);
  const totalShift1Cap = centres.reduce((s, ctr) => s + ctr.shift1Capacity, 0);

  const filteredCandidates = verifiedPool.filter((c) => {
    if (cityFilter !== 'ALL' && c.preferredCity !== cityFilter) return false;
    if (assignmentFilter === 'Assigned' && !c.allocatedCentreId) return false;
    if (assignmentFilter === 'Unassigned' && c.allocatedCentreId) return false;
    return true;
  });

  const cityDemandBars = Array.from(new Set(centres.map((c) => c.city))).map((city) => {
    const demand = verifiedPool.filter((c) => c.preferredCity === city).length;
    const cap = centres
      .filter((ctr) => ctr.city === city)
      .reduce((s, ctr) => s + ctr.halls.reduce((hs, h) => hs + h.totalCapacity, 0), 0);
    return {
      label: `${city} City Demand vs Capacity`,
      sublabel: `${demand} verified applicant(s) · ${cap} hall seats available`,
      value: demand,
      max: cap,
      color: '#1D4ED8',
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Centre Allocation (Stage 1 · City & Nodal Hub Mapping)"
        subtitle="Assign verified candidates from preferred exam cities to Nodal Examination Centres before hall & seat numbering"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => autoAllocateCentres()}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Auto-Assign Centres by City
            </button>
            <button
              onClick={() => setAdminNav('seat-allocation')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
            >
              Stage 2: Seat Allocation Map <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        }
      />

      {/* Macro Workflow Distinction Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-lg bg-blue-700 text-white font-mono font-bold flex items-center justify-center shrink-0">
            01
          </span>
          <div>
            <div className="font-display font-bold text-[#0B1F3A]">
              Centre Allocation (Current Screen · Macro Level)
            </div>
            <p className="text-slate-600 mt-0.5">
              Balances candidate city preferences, shift capacities, and PwBD ramp availability across regional examination centres.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 md:border-l md:border-slate-200 md:pl-4">
          <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold flex items-center justify-center shrink-0">
            02
          </span>
          <div>
            <div className="font-display font-bold text-slate-800">
              Seat Allocation Map (Next Stage · Micro Level)
            </div>
            <p className="text-slate-600 mt-0.5">
              Places centre-assigned candidates into specific buildings, floors, halls (G-01, G-02), and numbered seats (001–040).
            </p>
          </div>
        </div>
      </div>

      {/* Macro KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Verified Candidates" value={verifiedPool.length} icon={Users} accent="navy" />
        <KpiCard label="Centre Assigned" value={assignedToCentre.length} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Awaiting Centre Match" value={unassignedToCentre.length} icon={Clock} accent="amber" />
        <KpiCard
          label="Nodal Centres Active"
          value={centres.length}
          delta={`${totalShift1Cap} Shift 1 seats`}
          icon={Landmark}
          accent="blue"
        />
      </div>

      {/* City Demand + Nodal Centre Load Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              City Demand vs Centre Capacity
            </h2>
            <MapPin className="w-4 h-4 text-blue-700" />
          </div>
          <HorizontalBarList items={cityDemandBars} />
        </section>

        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Nodal Examination Centre Load Matrix
            </h2>
            <span className="text-xs text-slate-500">{campaigns[0]?.examDate}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {centres.map((ctr) => {
              const assignedHere = verifiedPool.filter((c) => c.allocatedCentreId === ctr.id);
              const totalCap = ctr.halls.reduce((s, h) => s + h.totalCapacity, 0);
              const gfCap = ctr.halls
                .filter((h) => h.isGroundFloor)
                .reduce((s, h) => s + h.totalCapacity, 0);
              const loadPct = Math.min(100, Math.round((assignedHere.length / Math.max(totalCap, 1)) * 100));

              return (
                <div
                  key={ctr.id}
                  className="border border-slate-200 rounded-lg p-3.5 space-y-2.5 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-[11px] font-semibold text-blue-700">
                        {ctr.code} · {ctr.city}
                      </div>
                      <div className="text-xs font-display font-bold text-[#0B1F3A] mt-0.5">
                        {ctr.name}
                      </div>
                    </div>
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                    <span>Assigned: {assignedHere.length} / {totalCap}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <Accessibility className="w-3 h-3" /> {gfCap} GF
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0B1F3A] rounded-full" style={{ width: `${loadPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Candidate-to-Centre Assignment Ledger */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Candidate-to-Centre Assignment Roster
            </h2>
            <p className="text-xs text-slate-500">
              Reassign a candidate&apos;s examination centre directly; hall and seat assignment happens in Stage 2
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
            >
              <option value="ALL">All Preferred Cities</option>
              {Array.from(new Set(centres.map((c) => c.city))).map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>

            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              {(['ALL', 'Assigned', 'Unassigned'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setAssignmentFilter(f)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                    assignmentFilter === f ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3 font-medium">Candidate</th>
                <th className="py-2 px-3 font-medium">Preferred City & Shift</th>
                <th className="py-2 px-3 font-medium">Accessibility</th>
                <th className="py-2 px-3 font-medium">Centre Status</th>
                <th className="py-2 pl-3 font-medium text-right">Assigned Examination Centre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2.5">
                      <CandidateAvatar src={c.photoUrl} name={c.name} size="sm" />
                      <div>
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="font-mono text-[11px] text-slate-500">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    <div className="font-medium">{c.preferredCity}</div>
                    <div className="text-[11px] text-slate-500">{c.preferredShift}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    {c.pwbdRequired ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <Accessibility className="w-3.5 h-3.5" /> PwBD (GF Required)
                      </span>
                    ) : (
                      <span className="text-slate-500">Standard</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusLabel
                      label={c.allocatedCentreId ? 'Centre Assigned' : 'Pending Match'}
                      tone={c.allocatedCentreId ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    <select
                      value={c.allocatedCentreId ?? ''}
                      onChange={(e) => {
                        if (e.target.value) assignCandidateCentre(c.id, e.target.value);
                      }}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium text-slate-800 max-w-[240px]"
                    >
                      <option value="">-- Select Nodal Centre --</option>
                      {centres.map((ctr) => (
                        <option key={ctr.id} value={ctr.id}>
                          {ctr.city} · {ctr.name} ({ctr.code})
                        </option>
                      ))}
                    </select>
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
