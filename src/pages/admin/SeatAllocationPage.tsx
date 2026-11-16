import React, { useState } from 'react';
import {
  Accessibility,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Play,
  Sliders,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { HallSeat } from '../../types/aima';
import { PageHeader, StatusLabel } from '../../components/ui/Common';
import { HorizontalBarList } from '../../components/ui/Charts';

export const SeatAllocationPage: React.FC = () => {
  const {
    campaigns,
    candidates,
    centres,
    allocationRules,
    allocationApproved,
    updateAllocationRules,
    toggleSeatBlock,
    runAutoAllocation,
    approveAllocation,
    resolveConflicts,
    setAdminNav,
  } = useAima();

  const [campaignFilter, setCampaignFilter] = useState<string>(campaigns[0]?.id ?? 'AIMA-REC-2027-AO');
  const [examDate, setExamDate] = useState<string>('2027-03-14');
  const [shift, setShift] = useState<string>('Shift 1 (09:30 AM)');
  const [cityFilter, setCityFilter] = useState<string>('New Delhi');

  const cityCentres = centres.filter((c) => c.city === cityFilter);
  const [centreId, setCentreId] = useState<string>('CTR-DEL-01');
  const activeCentre = centres.find((c) => c.id === centreId) ?? cityCentres[0] ?? centres[0];

  const [hallId, setHallId] = useState<string>('HALL-DEL-G02');
  const activeHall =
    activeCentre?.halls.find((h) => h.id === hallId) ?? activeCentre?.halls[0];

  const [selectedSeat, setSelectedSeat] = useState<HallSeat | null>(null);
  const [rulesDrawerOpen, setRulesDrawerOpen] = useState<boolean>(false);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  const verifiedCandidates = candidates.filter((c) => c.verificationStatus === 'Verified');
  const allocatedCandidates = verifiedCandidates.filter((c) => Boolean(c.allocatedSeat));
  const unallocatedCandidates = verifiedCandidates.filter((c) => !c.allocatedSeat);
  const pwbdGroundAllocated = verifiedCandidates.filter(
    (c) => c.pwbdRequired && c.allocatedFloor === 'Ground Floor'
  );
  const pwbdFloorConflict = verifiedCandidates.filter(
    (c) => c.pwbdRequired && c.allocatedFloor && c.allocatedFloor !== 'Ground Floor'
  );

  const totalCapacityAll = centres.reduce(
    (sum, c) => sum + c.halls.reduce((hs, h) => hs + h.totalCapacity, 0),
    0
  );
  const totalSeatedAll = centres.reduce(
    (sum, c) =>
      sum + c.halls.reduce((hs, h) => hs + h.seats.filter((st) => st.status === 'allocated').length, 0),
    0
  );

  const handleCityChange = (city: string) => {
    setCityFilter(city);
    const firstCtr = centres.find((c) => c.city === city);
    if (firstCtr) {
      setCentreId(firstCtr.id);
      if (firstCtr.halls[0]) setHallId(firstCtr.halls[0].id);
    }
    setSelectedSeat(null);
  };

  const handleCentreChange = (id: string) => {
    setCentreId(id);
    const ctr = centres.find((c) => c.id === id);
    if (ctr?.halls[0]) setHallId(ctr.halls[0].id);
    setSelectedSeat(null);
  };

  const handlePreview = () => {
    const res = runAutoAllocation(true);
    setPreviewBanner(
      `Preview simulation: ${unallocatedCandidates.length} unallocated verified candidate(s) ready · ${res.unallocatedCount} overflow`
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Seat Allocation Map (Stage 2 · Hall & Numbered Seat Assignment)"
        subtitle="Assign centre-allocated candidates to specific Buildings, Floors, Halls, and numbered seats (001–040)"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusLabel label={allocationApproved ? 'Approved' : 'Pending Approval'} />
            <button
              onClick={() => setAdminNav('centre-allocation')}
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Stage 1: Centre Allocation
            </button>
            <button
              onClick={() => setRulesDrawerOpen(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" /> Allocation Rules
            </button>
            <button
              onClick={() => runAutoAllocation(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Run Auto Allocation
            </button>
          </div>
        }
      />

      {previewBanner && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span className="font-medium">{previewBanner}</span>
          </div>
          <button onClick={() => setPreviewBanner(null)} className="text-blue-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 3-Column Operational Seat Allocation Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT PANEL: Filters & Parameters */}
        <aside className="xl:col-span-3 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          <h2 className="text-xs font-display font-bold uppercase tracking-wider text-slate-500">
            Session Parameters
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Recruitment Campaign</label>
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-800 font-medium"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">Examination Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">Examination Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-800 font-medium"
              >
                <option value="Shift 1 (09:30 AM)">Shift 1 (09:30 AM)</option>
                <option value="Shift 2 (02:30 PM)">Shift 2 (02:30 PM)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">Examination City</label>
              <select
                value={cityFilter}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-800 font-medium"
              >
                {Array.from(new Set(centres.map((c) => c.city))).map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">Examination Centre</label>
              <select
                value={activeCentre?.id}
                onChange={(e) => handleCentreChange(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-800 font-medium"
              >
                {cityCentres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} · {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500">Active Rule Constraints</div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center justify-between">
                <span>Max Hall Occupancy</span>
                <span className="font-mono font-semibold text-[#0B1F3A]">
                  {allocationRules.maxHallOccupancyPct}%
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>PwBD Ground Floor</span>
                <span className="font-semibold text-emerald-700">
                  {allocationRules.groundFloorForPwbd ? 'Enforced' : 'Optional'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Balanced Occupancy</span>
                <span className="font-semibold text-slate-800">
                  {allocationRules.balancedOccupancy ? 'On' : 'Off'}
                </span>
              </li>
            </ul>
          </div>
        </aside>

        {/* MAIN PANEL: Interactive Hall Selector & Numbered Seat Grid */}
        <section className="xl:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
                {activeCentre?.name} · {activeHall?.building}
              </h2>
              <p className="text-xs text-slate-500">
                Select a hall below and click any seat to inspect or toggle reservation lock
              </p>
            </div>
          </div>

          {/* Hall Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {activeCentre?.halls.map((h) => {
              const occ = h.seats.filter((s) => s.status === 'allocated').length;
              return (
                <button
                  key={h.id}
                  onClick={() => {
                    setHallId(h.id);
                    setSelectedSeat(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    activeHall?.id === h.id
                      ? 'bg-white text-[#0B1F3A] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {h.code} ({h.floor === 'Ground Floor' ? 'GF' : h.floor === 'First Floor' ? '1F' : '2F'}) · {occ}/{h.totalCapacity}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pb-2 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#0B1F3A] inline-block" /> Allocated
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300 inline-block" /> Vacant
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-400 inline-block" /> Accessibility (GF)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-400 inline-block" /> Reserved / Blocked
            </span>
          </div>

          {/* Invigilator Desk Banner */}
          <div className="bg-slate-100 border border-slate-200 rounded-lg py-1.5 text-center text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Invigilator Desk & Biometric Verification Entry ({activeHall?.floor})
          </div>

          {/* Numbered Seat Matrix (8 columns x 5 rows = 40 seats) */}
          {activeHall && (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {activeHall.seats.map((seat) => {
                const isSelected = selectedSeat?.seatNumber === seat.seatNumber;
                const tone =
                  seat.status === 'allocated'
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] hover:bg-[#163663]'
                    : seat.status === 'reserved'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    : seat.status === 'accessibility'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40';

                return (
                  <button
                    key={seat.seatNumber}
                    onClick={() => setSelectedSeat(seat)}
                    title={
                      seat.candidateName
                        ? `Seat ${seat.seatNumber}: ${seat.candidateName} (${seat.rollNumber})`
                        : `Seat ${seat.seatNumber} (${seat.status})`
                    }
                    className={`h-11 rounded-lg border text-xs font-mono font-semibold flex flex-col items-center justify-center transition-all ${tone} ${
                      isSelected ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                    }`}
                  >
                    <span>{seat.seatNumber}</span>
                    {seat.status === 'allocated' && (
                      <span className="text-[9px] font-sans font-normal text-amber-300 leading-none mt-0.5 truncate max-w-[44px]">
                        {seat.candidateName?.split(' ')[0]}
                      </span>
                    )}
                    {seat.status === 'accessibility' && (
                      <Accessibility className="w-3 h-3 text-emerald-700 mt-0.5" />
                    )}
                    {seat.status === 'reserved' && (
                      <Lock className="w-2.5 h-2.5 text-amber-700 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected Seat Inspector */}
          {selectedSeat && activeCentre && activeHall && (
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-mono font-bold text-[#0B1F3A]">
                  Seat {selectedSeat.seatNumber} · Hall {activeHall.code} ({activeHall.floor})
                </div>
                {selectedSeat.candidateName ? (
                  <div className="text-slate-700 mt-0.5">
                    Assigned to <span className="font-semibold">{selectedSeat.candidateName}</span> · Roll{' '}
                    <span className="font-mono">{selectedSeat.rollNumber}</span> ({selectedSeat.candidateId})
                  </div>
                ) : (
                  <div className="text-slate-600 mt-0.5">
                    Current Status: <span className="font-semibold capitalize">{selectedSeat.status}</span>
                    {selectedSeat.isAccessibilityZone ? ' · Ground-Floor PwBD Accessible Seat' : ''}
                  </div>
                )}
              </div>
              {selectedSeat.status !== 'allocated' && (
                <button
                  onClick={() => {
                    toggleSeatBlock(activeCentre.id, activeHall.id, selectedSeat.seatNumber);
                    setSelectedSeat(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 shrink-0"
                >
                  {selectedSeat.status === 'reserved' ? 'Unblock Seat' : 'Reserve / Block Seat'}
                </button>
              )}
            </div>
          )}
        </section>

        {/* RIGHT PANEL: Capacity Summary, Warnings & Actions */}
        <aside className="xl:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h2 className="text-xs font-display font-bold uppercase tracking-wider text-slate-500">
              Allocation Summary
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Verified Candidates</span>
                <span className="font-mono font-bold text-slate-900">{verifiedCandidates.length}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Total Centre Capacity</span>
                <span className="font-mono font-bold text-slate-900">{totalCapacityAll}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Allocated Candidates</span>
                <span className="font-mono font-bold text-blue-700">{allocatedCandidates.length}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Unallocated Verified</span>
                <span className="font-mono font-bold text-amber-700">{unallocatedCandidates.length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Ground-Floor PwBD</span>
                <span className="font-mono font-bold text-emerald-700">{pwbdGroundAllocated.length}</span>
              </div>
            </div>

            {/* Warnings */}
            {(unallocatedCandidates.length > 0 || pwbdFloorConflict.length > 0) && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Allocation Notices
                </div>
                {unallocatedCandidates.length > 0 && (
                  <p>{unallocatedCandidates.length} verified candidate(s) awaiting seat assignment.</p>
                )}
                {pwbdFloorConflict.length > 0 && (
                  <p>{pwbdFloorConflict.length} PwBD candidate(s) require ground-floor relocation.</p>
                )}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={() => runAutoAllocation(false)}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Run Auto Allocation
              </button>
              <button
                onClick={handlePreview}
                className="w-full py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Preview Allocation
              </button>
              <button
                onClick={resolveConflicts}
                className="w-full py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Resolve Conflicts
              </button>
              <button
                onClick={approveAllocation}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> Approve Allocation
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-display font-bold text-[#0B1F3A] mb-3">
              Centre-wise Distribution ({totalSeatedAll}/{totalCapacityAll})
            </h3>
            <HorizontalBarList
              items={centres.map((c) => ({
                label: `${c.city} (${c.code})`,
                value: c.halls.reduce(
                  (s, h) => s + h.seats.filter((st) => st.status === 'allocated').length,
                  0
                ),
                max: c.halls.reduce((s, h) => s + h.totalCapacity, 0),
                color: '#1D4ED8',
              }))}
            />
          </div>
        </aside>
      </div>

      {/* Allocation Configuration Drawer */}
      {rulesDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <div className="w-full max-w-md bg-white h-full shadow-xl border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h2 className="text-base font-display font-bold text-[#0B1F3A]">
                  Automated Allocation Rules
                </h2>
                <button
                  onClick={() => setRulesDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span>Maximum Hall Capacity Limit</span>
                  <span className="font-mono font-bold text-blue-700">
                    {allocationRules.maxHallOccupancyPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={100}
                  step={5}
                  value={allocationRules.maxHallOccupancyPct}
                  onChange={(e) =>
                    updateAllocationRules({ maxHallOccupancyPct: Number(e.target.value) })
                  }
                  className="w-full accent-blue-700"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Maintains buffer seats per hall for contingencies and biometric re-seating.
                </p>
              </div>

              {(
                [
                  ['groundFloorForPwbd', 'Mandatory Ground-Floor Accommodation for PwBD'],
                  ['respectCityPreference', 'Enforce Candidate First-Choice City Preference'],
                  ['respectShiftPreference', 'Respect Candidate Shift Preference'],
                  ['balancedOccupancy', 'Balanced Occupancy Across Available Halls'],
                  ['preventDuplicateAllocation', 'Prevent Duplicate Roll / Seat Assignment'],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 text-xs cursor-pointer"
                >
                  <span className="font-medium text-slate-800">{label}</span>
                  <input
                    type="checkbox"
                    checked={allocationRules[key]}
                    onChange={(e) => updateAllocationRules({ [key]: e.target.checked })}
                    className="w-4 h-4 accent-blue-700 rounded"
                  />
                </label>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
              <button
                onClick={() => {
                  setRulesDrawerOpen(false);
                  runAutoAllocation(false);
                }}
                className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" /> Apply & Run Allocation
              </button>
              <button
                onClick={() => setRulesDrawerOpen(false)}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
