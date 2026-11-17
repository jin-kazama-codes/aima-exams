import React, { useState } from 'react';
import {
  Briefcase,
  Building,
  CheckCircle2,
  Download,
  FileBadge2,
  MapPin,
  Send,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { AimaCrest, CandidateAvatar, PageHeader, StatusLabel } from '../../components/ui/Common';

const DEPARTMENTS = [
  'Policy & Examination Governance',
  'Regional Operations & Accreditation',
  'Finance, Audit & Treasury Division',
  'Digital Examination Systems & Cyber Security',
  'Student & Candidate Welfare Cell',
];

const LOCATIONS = [
  'AIMA Headquarters, New Delhi',
  'AIMA Southern Regional Office, Bengaluru',
  'AIMA Western Regional Hub, Mumbai',
  'AIMA Eastern Regional Centre, Kolkata',
  'AIMA Guindy Campus, Chennai',
];

export const AppointmentPages: React.FC<{
  mode: 'appointment-letters' | 'department-allocation' | 'posting-joining';
}> = ({ mode }) => {
  const { candidates, issueAppointmentLetter, pushToast } = useAima();

  const selectedPool = candidates.filter(
    (c) => c.finalSelected || c.interviewStage === 'Recommended'
  );
  const [previewId, setPreviewId] = useState<string>(selectedPool[0]?.id ?? 'AIMA-2027-001245');
  const activeCandidate =
    selectedPool.find((c) => c.id === previewId) ?? selectedPool[0] ?? candidates[0];

  const [deptDraft, setDeptDraft] = useState<string>(
    activeCandidate?.allocatedDepartment ?? DEPARTMENTS[0]
  );
  const [locDraft, setLocDraft] = useState<string>(
    activeCandidate?.postingLocation ?? LOCATIONS[0]
  );
  const [dateDraft, setDateDraft] = useState<string>(
    activeCandidate?.joiningDate ?? '2027-05-15'
  );

  if (mode === 'department-allocation') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Department & Cadre Allocation"
          subtitle="Assign recommended Grade A officers across AIMA functional directorates"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map((dept) => {
            const assigned = selectedPool.filter((c) => c.allocatedDepartment === dept);
            return (
              <div key={dept} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Briefcase className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {assigned.length} Assigned
                  </span>
                </div>
                <h2 className="text-sm font-display font-bold text-[#0B1F3A]">{dept}</h2>
                <div className="divide-y divide-slate-100 text-xs">
                  {assigned.length === 0 ? (
                    <div className="py-3 text-slate-400">No officers assigned to this wing yet.</div>
                  ) : (
                    assigned.map((c) => (
                      <div key={c.id} className="py-2 flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <span className="font-mono text-[11px] text-slate-500">{c.rollNumber}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'posting-joining') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Posting Locations & Joining Tracker"
          subtitle="Manage regional posting orders, joining dates, and induction onboarding status"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedPool.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <CandidateAvatar src={c.photoUrl} name={c.name} size="md" />
                  <div>
                    <div className="text-sm font-display font-bold text-[#0B1F3A]">{c.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{c.appointmentNumber ?? c.rollNumber}</div>
                  </div>
                </div>
                <StatusLabel label={c.joiningStatus ?? 'Pending Offer'} />
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">{c.allocatedDesignation ?? c.position}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{c.allocatedDepartment ?? 'General Administration'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span className="font-semibold text-[#0B1F3A]">{c.postingLocation ?? 'New Delhi HQ'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Joining Date:</span>
                <span className="font-mono font-bold text-slate-900">{c.joiningDate ?? '2027-06-01'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // APPOINTMENT LETTERS
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointment Letter Management"
        subtitle="Generate, sign, and dispatch official establishment appointment orders"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <section className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
            Selected Officers ({selectedPool.length})
          </h2>
          <div className="divide-y divide-slate-100">
            {selectedPool.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setPreviewId(c.id);
                  setDeptDraft(c.allocatedDepartment ?? DEPARTMENTS[0]);
                  setLocDraft(c.postingLocation ?? LOCATIONS[0]);
                  setDateDraft(c.joiningDate ?? '2027-05-15');
                }}
                className={`py-3 px-2 rounded-lg cursor-pointer flex items-center justify-between gap-3 ${
                  activeCandidate?.id === c.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CandidateAvatar src={c.photoUrl} name={c.name} size="sm" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">{c.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Rank #{c.meritRank ?? '-'} · {c.position}
                    </div>
                  </div>
                </div>
                <StatusLabel label={c.appointmentLetterIssued ? 'Issued' : 'Pending'} />
              </div>
            ))}
          </div>

          {activeCandidate && (
            <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
              <div className="font-semibold text-[#0B1F3A]">Update Posting & Issue Order</div>
              <div>
                <label className="block text-slate-500 mb-1">Allocated Department</label>
                <select
                  value={deptDraft}
                  onChange={(e) => setDeptDraft(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Posting Location</label>
                <select
                  value={locDraft}
                  onChange={(e) => setLocDraft(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-2 bg-white"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Joining Date</label>
                <input
                  type="date"
                  value={dateDraft}
                  onChange={(e) => setDateDraft(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-2 font-mono"
                />
              </div>
              <button
                onClick={() => issueAppointmentLetter(activeCandidate.id, deptDraft, locDraft, dateDraft)}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" /> Issue / Re-issue Appointment Letter
              </button>
            </div>
          )}
        </section>

        {/* Formal Appointment Letter Preview */}
        {activeCandidate && (
          <section className="xl:col-span-7 bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-[#0B1F3A] text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-4 border-amber-500">
              <AimaCrest dark />
              <div className="text-left sm:text-right">
                <div className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                  Establishment Directorate
                </div>
                <div className="font-mono text-xs">
                  Order No: {activeCandidate.appointmentNumber ?? `AIMA/ESTT/2027/${activeCandidate.id.slice(-3)}`}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-900">To,</div>
                  <div className="font-display font-bold text-sm text-[#0B1F3A] mt-0.5">{activeCandidate.name}</div>
                  <div>Roll No: <span className="font-mono">{activeCandidate.rollNumber}</span></div>
                  <div>{activeCandidate.address}, {activeCandidate.city}</div>
                </div>
                <div className="text-left sm:text-right font-mono text-slate-500">
                  Date: 20 Apr 2027
                </div>
              </div>

              <div className="font-display font-bold text-sm text-[#0B1F3A] pt-2">
                Subject: Offer of Appointment to the post of {activeCandidate.allocatedDesignation ?? activeCandidate.position} in AIMA
              </div>

              <p>
                Consequent upon your selection in the AIMA Recruitment Examination 2027 (Merit Rank #{activeCandidate.meritRank ?? 14}), the Management of AIMA is pleased to offer you appointment to the post of{' '}
                <strong className="text-slate-900">{activeCandidate.allocatedDesignation ?? activeCandidate.position}</strong>{' '}
                in Pay Level 10 (₹56,100 – ₹1,77,500) on probation for two years.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <div className="text-slate-500">Allocated Department</div>
                  <div className="font-semibold text-[#0B1F3A] mt-0.5">
                    {activeCandidate.allocatedDepartment ?? deptDraft}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Place of Posting</div>
                  <div className="font-semibold text-[#0B1F3A] mt-0.5">
                    {activeCandidate.postingLocation ?? locDraft}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Report for Joining On</div>
                  <div className="font-mono font-bold text-blue-700 mt-0.5">
                    {activeCandidate.joiningDate ?? dateDraft}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Digitally Authenticated Establishment Order</span>
                </div>
                <button
                  onClick={() =>
                    pushToast('Appointment Order Downloaded', `${activeCandidate.rollNumber}_Appointment.pdf`, 'success')
                  }
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Offer PDF
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
