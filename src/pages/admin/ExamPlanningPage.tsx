import React, { useState } from 'react';
import {
  Accessibility,
  Building2,
  CalendarClock,
  Camera,
  CheckCircle2,
  Clock,
  Fingerprint,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { PageHeader, StatusLabel } from '../../components/ui/Common';

export const ExamPlanningPage: React.FC<{ mode?: 'planning' | 'centres' }> = ({
  mode = 'planning',
}) => {
  const { campaigns, centres, setAdminNav } = useAima();

  const cities = Array.from(new Set(centres.map((c) => c.city)));
  const [selectedCity, setSelectedCity] = useState<string>(cities[0] ?? 'New Delhi');
  const cityCentres = centres.filter((c) => c.city === selectedCity);
  const [selectedCentreId, setSelectedCentreId] = useState<string>(cityCentres[0]?.id ?? centres[0]?.id);
  const activeCentre = centres.find((c) => c.id === selectedCentreId) ?? cityCentres[0] ?? centres[0];

  const buildings = activeCentre
    ? Array.from(new Set(activeCentre.halls.map((h) => h.building)))
    : [];
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');

  const visibleHalls = (activeCentre?.halls ?? []).filter((h) => {
    if (selectedBuilding !== 'ALL' && h.building !== selectedBuilding) return false;
    if (selectedFloor !== 'ALL' && h.floor !== selectedFloor) return false;
    return true;
  });

  if (mode === 'planning') {
    const totalSeats = centres.reduce(
      (sum, c) => sum + c.halls.reduce((hs, h) => hs + h.totalCapacity, 0),
      0
    );

    return (
      <div className="space-y-6">
        <PageHeader
          title="Examination Planning & Shift Schedule"
          subtitle="Configure examination dates, shift reporting windows, centre allocations, and hall readiness"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAdminNav('exam-centres')}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                Explore Centres & Halls
              </button>
              <button
                onClick={() => setAdminNav('seat-allocation')}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800"
              >
                Open Seat Allocation Map
              </button>
            </div>
          }
        />

        {/* Shift Timing Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
                  Shift 1 · Forenoon Session
                </h2>
              </div>
              <StatusLabel label="Active" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
              <div>
                <div className="text-slate-500">Reporting Time</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">08:00 AM</div>
              </div>
              <div>
                <div className="text-slate-500">Gate Closing</div>
                <div className="font-mono font-bold text-red-700 mt-0.5">09:00 AM</div>
              </div>
              <div>
                <div className="text-slate-500">Exam Window</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">09:30 – 12:30</div>
              </div>
              <div>
                <div className="text-slate-500">Biometric Desk</div>
                <div className="font-semibold text-emerald-700 mt-0.5">Mandatory</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
                  Shift 2 · Afternoon Session
                </h2>
              </div>
              <StatusLabel label="Scheduled" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
              <div>
                <div className="text-slate-500">Reporting Time</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">01:00 PM</div>
              </div>
              <div>
                <div className="text-slate-500">Gate Closing</div>
                <div className="font-mono font-bold text-red-700 mt-0.5">02:00 PM</div>
              </div>
              <div>
                <div className="text-slate-500">Exam Window</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">02:30 – 05:00</div>
              </div>
              <div>
                <div className="text-slate-500">PwBD Extra Time</div>
                <div className="font-mono font-semibold text-slate-800 mt-0.5">+20 min/hr</div>
              </div>
            </div>
          </div>
        </div>

        {/* Examination Master Plan Table */}
        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
                2027 Examination Schedule & Capacity Allocation
              </h2>
              <p className="text-xs text-slate-500">
                {centres.length} Nodal Centres · {totalSeats} Sample Hall Seats Configured across {cities.length} Cities
              </p>
            </div>
            <CalendarClock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 pr-3 font-medium">Examination Name</th>
                  <th className="py-2.5 px-3 font-medium">Exam Date</th>
                  <th className="py-2.5 px-3 font-medium">Shifts</th>
                  <th className="py-2.5 px-3 font-medium">Cities Covered</th>
                  <th className="py-2.5 px-3 font-medium text-right">Verified Candidates</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      <div className="font-semibold text-slate-900">{c.title}</div>
                      <div className="font-mono text-[11px] text-slate-500">{c.id}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800">{c.examDate}</td>
                    <td className="py-3 px-3 text-slate-700">
                      {idx === 2 ? 'Shift 2 (02:30 PM)' : 'Shift 1 (09:30 AM)'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{cities.join(', ')}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold">
                      {c.verifiedCount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <StatusLabel label={idx === 0 ? 'Published' : 'Scheduled'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* City-wise Centre Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {centres.map((ctr) => {
            const cap = ctr.halls.reduce((s, h) => s + h.totalCapacity, 0);
            const alloc = ctr.halls.reduce(
              (s, h) => s + h.seats.filter((st) => st.status === 'allocated').length,
              0
            );
            const groundHalls = ctr.halls.filter((h) => h.isGroundFloor).length;
            return (
              <button
                key={ctr.id}
                onClick={() => {
                  setSelectedCity(ctr.city);
                  setSelectedCentreId(ctr.id);
                  setAdminNav('exam-centres');
                }}
                className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-blue-700">{ctr.code}</span>
                  <span className="text-slate-500">{ctr.city}</span>
                </div>
                <div className="font-display font-bold text-sm text-[#0B1F3A] mt-1.5">{ctr.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{ctr.address}</div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono tabular-nums">
                  <span>{ctr.halls.length} Halls ({groundHalls} GF)</span>
                  <span className="font-semibold text-slate-900">{alloc}/{cap} Seated</span>
                </div>
              </button>
            );
          })}
        </section>
      </div>
    );
  }

  // Visual Examination Centre Hierarchy Navigator: City -> Centre -> Building -> Floor -> Hall
  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination Centres & Hall Infrastructure"
        subtitle="Navigate City → Centre → Building → Floor → Hall to inspect capacities and accessibility compliance"
        actions={
          <button
            onClick={() => setAdminNav('seat-allocation')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800"
          >
            Allocate Seats in Selected Centre
          </button>
        }
      />

      {/* Step 1: City Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B1F3A]">
            <MapPin className="w-4 h-4 text-blue-700" />
            <span>1. Select Examination City</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  const first = centres.find((c) => c.city === city);
                  if (first) setSelectedCentreId(first.id);
                  setSelectedBuilding('ALL');
                  setSelectedFloor('ALL');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  selectedCity === city
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 & 3: Centre, Building, Floor selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              2. Examination Centre
            </label>
            <select
              value={activeCentre?.id}
              onChange={(e) => {
                setSelectedCentreId(e.target.value);
                setSelectedBuilding('ALL');
                setSelectedFloor('ALL');
              }}
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-800"
            >
              {cityCentres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              3. Building / Block
            </label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-800"
            >
              <option value="ALL">All Buildings ({buildings.length})</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              4. Floor Level
            </label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-800"
            >
              <option value="ALL">All Floors</option>
              <option value="Ground Floor">Ground Floor (Accessible)</option>
              <option value="First Floor">First Floor</option>
              <option value="Second Floor">Second Floor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Selected Centre Metadata Bar */}
      {activeCentre && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] text-amber-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#0B1F3A]">
                {activeCentre.name} ({activeCentre.code})
              </div>
              <div className="text-slate-600 mt-0.5">{activeCentre.address}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-slate-600">
            <div>
              <span className="text-slate-400">Superintendent: </span>
              <span className="font-semibold text-slate-800">{activeCentre.superintendent}</span>
            </div>
            <div className="font-mono">{activeCentre.contactPhone}</div>
          </div>
        </div>
      )}

      {/* Step 5: Visual Hall Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleHalls.map((hall) => {
          const allocated = hall.seats.filter((s) => s.status === 'allocated').length;
          const reserved = hall.seats.filter((s) => s.status === 'reserved').length;
          const available = hall.totalCapacity - allocated - reserved;
          const pct = Math.round((allocated / hall.totalCapacity) * 100);

          return (
            <div
              key={hall.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-xs font-semibold text-blue-700">
                      {hall.building} · {hall.floor}
                    </div>
                    <h3 className="text-base font-display font-bold text-[#0B1F3A] mt-0.5">
                      {hall.name}
                    </h3>
                  </div>
                  {hall.isGroundFloor && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium shrink-0">
                      <Accessibility className="w-3 h-3" /> Ground Floor
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <div className="text-slate-500">Capacity</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {hall.totalCapacity}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Allocated</div>
                    <div className="font-mono font-bold text-blue-700 mt-0.5 tabular-nums">
                      {allocated}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Available</div>
                    <div className="font-mono font-bold text-emerald-700 mt-0.5 tabular-nums">
                      {available}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Occupancy</span>
                    <span className="font-mono font-semibold text-slate-800">{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0B1F3A] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Infrastructure & Accessibility Readiness */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Accessibility className="w-3.5 h-3.5 text-slate-500" />
                    {hall.wheelchairRamp ? 'Wheelchair Ramp' : 'Stair Access'}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    CCTV
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5 text-blue-700" />
                    Biometric Desk
                  </span>
                </div>
              </div>

              <button
                onClick={() => setAdminNav('seat-allocation')}
                className="mt-4 w-full py-2 rounded-lg text-xs font-semibold border border-slate-200 text-[#0B1F3A] hover:bg-slate-50 inline-flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> View Hall Seat Grid
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
