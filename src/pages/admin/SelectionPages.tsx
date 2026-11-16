import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { InterviewStage } from '../../types/aima';
import { CandidateAvatar, KpiCard, PageHeader, StatusLabel } from '../../components/ui/Common';
import { HorizontalBarList } from '../../components/ui/Charts';

const INTERVIEW_STAGES: InterviewStage[] = [
  'Qualified',
  'Shortlisted',
  'AI Interview Pending',
  'AI Interview Completed',
  'Panel Interview Scheduled',
  'Interview Completed',
  'Recommended',
  'Not Selected',
];

export const SelectionPages: React.FC<{
  mode: 'interview-management' | 'ai-interviews' | 'final-selection';
}> = ({ mode }) => {
  const {
    candidates,
    campaigns,
    updateInterviewStage,
    issueAppointmentLetter,
    pushToast,
  } = useAima();

  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [selectedAiId, setSelectedAiId] = useState<string>('AIMA-2027-001245');

  const qualifiedPool = candidates.filter((c) => c.qualifiedWritten || c.aiScorecard);

  if (mode === 'ai-interviews') {
    const aiPool = candidates.filter((c) => c.aiScorecard || c.interviewStage.includes('AI'));
    const activeCand = aiPool.find((c) => c.id === selectedAiId) ?? aiPool[0] ?? candidates[0];

    return (
      <div className="space-y-6">
        <PageHeader
          title="AI Interview Structured Assessments"
          subtitle="Structured communication and domain-clarity advisory scorecards supporting Panel Boards"
          actions={
            <div className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              Advisory Evaluation Only · Human Panel Holds Final Decision Authority
            </div>
          }
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <section className="xl:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 font-display font-bold text-sm text-[#0B1F3A]">
              AI Video Assessment Queue
            </div>
            <div className="divide-y divide-slate-100">
              {aiPool.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedAiId(c.id)}
                  className={`w-full text-left p-4 flex items-center justify-between gap-3 transition-colors ${
                    activeCand?.id === c.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CandidateAvatar src={c.photoUrl} name={c.name} size="sm" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">{c.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{c.rollNumber} · {c.position}</div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {c.aiScorecard && (
                      <span className="font-mono text-xs font-bold text-[#0B1F3A]">
                        {c.aiScorecard.overallAdvisory}/100
                      </span>
                    )}
                    <StatusLabel label={c.interviewStage} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {activeCand && (
            <section className="xl:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <CandidateAvatar src={activeCand.photoUrl} name={activeCand.name} size="md" />
                  <div>
                    <h2 className="text-base font-display font-bold text-[#0B1F3A]">{activeCand.name}</h2>
                    <div className="text-xs text-slate-500 font-mono">
                      {activeCand.id} · {activeCand.interviewPanel ?? 'Panel A'}
                    </div>
                  </div>
                </div>
                <StatusLabel label={activeCand.interviewStage} />
              </div>

              {activeCand.aiScorecard ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      ['Communication', activeCand.aiScorecard.communication],
                      ['Domain Clarity', activeCand.aiScorecard.domainClarity],
                      ['Analytical Depth', activeCand.aiScorecard.analyticalDepth],
                      ['Policy Awareness', activeCand.aiScorecard.policyAwareness],
                    ].map(([lbl, val]) => (
                      <div key={String(lbl)} className="border border-slate-200 rounded-lg p-3">
                        <div className="text-[11px] text-slate-500">{lbl}</div>
                        <div className="text-xl font-display font-bold text-[#0B1F3A] font-mono mt-1">
                          {val}%
                        </div>
                        <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-700 rounded-full" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
                    <div className="text-xs font-semibold text-[#0B1F3A] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" /> Structured Observations for Interview Panel
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                      {activeCand.aiScorecard.summaryPoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  Candidate has not completed the structured AI pre-interview module yet.
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  Forward dossier to human selection panel for final scoring:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateInterviewStage(activeCand.id, 'Panel Interview Scheduled', 'Panel A (Board Room I)')}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Forward to Panel Interview
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'final-selection') {
    const selected = candidates.filter((c) => c.finalSelected || c.interviewStage === 'Recommended');
    const totalVacancies = campaigns.reduce((s, c) => s + c.totalVacancies, 0);

    return (
      <div className="space-y-6">
        <PageHeader
          title="Final Selection & Merit Approval"
          subtitle="Composite ranking (75% Written + 25% Panel Interview), category balance, and establishment sign-off"
          actions={
            <button
              onClick={() => pushToast('Final Merit List Approved', 'Signed by Chairman, AIMA Selection Board.', 'success')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Approve Final Selection List
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
              Vacancy vs Selection Fulfillment ({totalVacancies} Posts)
            </h2>
            <HorizontalBarList
              items={[
                { label: 'Administrative Officer 2027', value: 118, max: 120, color: '#16A34A' },
                { label: 'Finance Officer 2027', value: 58, max: 65, color: '#1D4ED8' },
                { label: 'IT Officer 2027', value: 0, max: 85, color: '#D97706', sublabel: 'Exam scheduled 11 Apr 2027' },
              ]}
            />
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
              Category-wise Recommended Candidates
            </h2>
            <HorizontalBarList
              items={[
                { label: 'General (UR)', value: 78, max: 82, color: '#0B1F3A' },
                { label: 'OBC-NCL', value: 49, max: 52, color: '#1D4ED8' },
                { label: 'SC', value: 26, max: 28, color: '#16A34A' },
                { label: 'EWS', value: 15, max: 16, color: '#D97706' },
                { label: 'ST', value: 11, max: 13, color: '#64748B' },
              ]}
            />
          </section>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-3">
            Recommended Final Merit List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-medium">Merit Rank</th>
                  <th className="py-2 px-3 font-medium">Candidate</th>
                  <th className="py-2 px-3 font-medium">Position & Category</th>
                  <th className="py-2 px-3 font-medium text-right">Written (/200)</th>
                  <th className="py-2 px-3 font-medium text-right">Panel (/50)</th>
                  <th className="py-2 px-3 font-medium text-right">Composite %</th>
                  <th className="py-2 pl-3 font-medium text-right">Appointment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selected.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-3 font-mono font-bold text-[#0B1F3A]">#{c.meritRank ?? '-'}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <CandidateAvatar src={c.photoUrl} name={c.name} size="sm" />
                        <div>
                          <div className="font-semibold text-slate-900">{c.name}</div>
                          <div className="font-mono text-[11px] text-slate-500">{c.rollNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {c.position} · {c.category}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">{c.writtenMarks?.total ?? '-'}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{c.panelScore ?? 42}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                      {c.finalCompositeScore ?? 81.4}%
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      {c.appointmentLetterIssued ? (
                        <StatusLabel label="Letter Issued" />
                      ) : (
                        <button
                          onClick={() => issueAppointmentLetter(c.id)}
                          className="px-3 py-1 rounded text-[11px] font-semibold bg-blue-700 text-white hover:bg-blue-800"
                        >
                          Issue Letter
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  // INTERVIEW MANAGEMENT PIPELINE
  const filteredPool =
    stageFilter === 'ALL'
      ? qualifiedPool
      : qualifiedPool.filter((c) => c.interviewStage === stageFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Pipeline & Panel Management"
        subtitle="Track qualified candidates across AI screening, panel scheduling, and board recommendations"
      />

      {/* 8-Stage Pipeline Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {INTERVIEW_STAGES.map((st) => {
          const cnt = candidates.filter((c) => c.interviewStage === st).length;
          const active = stageFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStageFilter(active ? 'ALL' : st)}
              className={`text-left p-2.5 rounded-xl border transition-colors ${
                active
                  ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className={`text-[10px] font-medium line-clamp-2 ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                {st}
              </div>
              <div className="text-lg font-display font-bold font-mono mt-1">{cnt}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Qualified Pool" value={qualifiedPool.length} icon={UsersRound} accent="navy" />
        <KpiCard label="Scheduled Panels" value={2} delta="Panel A & Panel B" icon={Calendar} accent="blue" />
        <KpiCard label="Recommended" value={candidates.filter((c) => c.interviewStage === 'Recommended').length} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="AI Advisory Completed" value={candidates.filter((c) => Boolean(c.aiScorecard)).length} icon={Award} accent="amber" />
      </div>

      {/* Candidate Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPool.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <CandidateAvatar src={c.photoUrl} name={c.name} size="md" />
                <div>
                  <div className="text-sm font-display font-bold text-[#0B1F3A]">{c.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {c.rollNumber} · {c.position}
                  </div>
                </div>
              </div>
              <StatusLabel label={c.interviewStage} />
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-xs">
              <div>
                <div className="text-slate-500">Written</div>
                <div className="font-mono font-bold text-slate-900">{c.writtenMarks?.total ?? '-'}/200</div>
              </div>
              <div>
                <div className="text-slate-500">AI Advisory</div>
                <div className="font-mono font-bold text-blue-700">{c.aiScorecard?.overallAdvisory ?? '-'}%</div>
              </div>
              <div>
                <div className="text-slate-500">Panel</div>
                <div className="font-semibold text-slate-800 truncate">{c.interviewPanel?.split(' ')[1] ?? 'Unassigned'}</div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <select
                value={c.interviewStage}
                onChange={(e) => updateInterviewStage(c.id, e.target.value as InterviewStage)}
                className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50 font-medium text-slate-800"
              >
                {INTERVIEW_STAGES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <button
                onClick={() => updateInterviewStage(c.id, 'Recommended', c.interviewPanel ?? 'Panel A', 44)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shrink-0"
              >
                Recommend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
