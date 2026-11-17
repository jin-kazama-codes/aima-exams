import React, { useState } from 'react';
import {
  CheckCircle2,
  CheckSquare,
  Clock,
  Users,
  XCircle,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { AttendanceStatus } from '../../types/aima';
import { CandidateAvatar, KpiCard, PageHeader, StatusLabel } from '../../components/ui/Common';
import { HorizontalBarList } from '../../components/ui/Charts';

export const AttendancePage: React.FC = () => {
  const { candidates, centres, updateAttendance, pushToast } = useAima();

  const seated = candidates.filter((c) => Boolean(c.allocatedSeat));
  const [selectedCentreId, setSelectedCentreId] = useState<string>('ALL');
  const [selectedHallCode, setSelectedHallCode] = useState<string>('ALL');

  const presentCount = seated.filter((c) => c.attendance === 'Present').length;
  const absentCount = seated.filter((c) => c.attendance === 'Absent').length;
  const attendancePct = seated.length > 0 ? Math.round((presentCount / seated.length) * 100) : 0;

  const filtered = seated.filter((c) => {
    if (selectedCentreId !== 'ALL' && c.allocatedCentreId !== selectedCentreId) return false;
    if (selectedHallCode !== 'ALL' && c.allocatedHallCode !== selectedHallCode) return false;
    return true;
  });

  const centreStats = centres.map((ctr) => {
    const inCtr = seated.filter((c) => c.allocatedCentreId === ctr.id);
    const pres = inCtr.filter((c) => c.attendance === 'Present').length;
    return {
      label: `${ctr.city} · ${ctr.name}`,
      value: pres,
      max: Math.max(inCtr.length, 1),
      color: '#16A34A',
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination-Day Attendance Management"
        subtitle="Live biometric check-in and invigilator hall attendance roster"
        actions={
          <button
            onClick={() => pushToast('Attendance Sheet Certified', 'Hall-wise attendance synced with Examination Directorate.', 'success')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561]"
          >
            Certify Session Attendance
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Registered & Seated" value={seated.length} icon={Users} accent="navy" />
        <KpiCard label="Candidates Present" value={presentCount} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Candidates Absent" value={absentCount} icon={XCircle} accent="amber" />
        <KpiCard
          label="Attendance Percentage"
          value={`${attendancePct}%`}
          delta="Biometric verified"
          icon={CheckSquare}
          accent="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
            Centre-wise Attendance Turnout
          </h2>
          <HorizontalBarList items={centreStats} />
        </section>

        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Hall-wise Candidate Attendance Register
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCentreId}
                onChange={(e) => {
                  setSelectedCentreId(e.target.value);
                  setSelectedHallCode('ALL');
                }}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
              >
                <option value="ALL">All Centres</option>
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.city} · {c.code}
                  </option>
                ))}
              </select>

              <select
                value={selectedHallCode}
                onChange={(e) => setSelectedHallCode(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
              >
                <option value="ALL">All Halls</option>
                <option value="G-01">Hall G-01</option>
                <option value="G-02">Hall G-02</option>
                <option value="F-101">Hall F-101</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-medium">Candidate</th>
                  <th className="py-2 px-3 font-medium">Roll No.</th>
                  <th className="py-2 px-3 font-medium">Hall / Seat</th>
                  <th className="py-2 px-3 font-medium">Status</th>
                  <th className="py-2 pl-3 font-medium text-right">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <CandidateAvatar src={c.photoUrl} name={c.name} size="sm" />
                        <span className="font-semibold text-slate-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{c.rollNumber}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {c.allocatedHallCode} · Seat {c.allocatedSeat}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusLabel label={c.attendance} />
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {(['Present', 'Absent', 'Late Entry'] as AttendanceStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateAttendance(c.id, st)}
                            className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                              c.attendance === st
                                ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {st === 'Late Entry' ? (
                              <span className="inline-flex items-center gap-0.5">
                                <Clock className="w-3 h-3" /> Late
                              </span>
                            ) : (
                              st
                            )}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
