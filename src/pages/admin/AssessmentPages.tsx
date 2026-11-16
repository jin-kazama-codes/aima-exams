import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileSpreadsheet,
  KeyRound,
  Lock,
  Upload,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { CandidateAvatar, KpiCard, PageHeader, StatusLabel } from '../../components/ui/Common';
import { HorizontalBarList, ScoreHistogram } from '../../components/ui/Charts';

export const AssessmentPages: React.FC<{
  mode: 'aptitude-tests' | 'answer-evaluation' | 'results';
}> = ({ mode }) => {
  const {
    campaigns,
    candidates,
    aptitudeTests,
    selectedCampaignId,
    updateCampaign,
    toggleResultsPublished,
    toggleTestAnswerKey,
    simulateMarksImport,
    updateWrittenMarks,
    pushToast,
  } = useAima();

  const activeCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) ?? campaigns[0];

  const [scorecardId, setScorecardId] = useState<string>('AIMA-2027-001245');
  const [editingMarksId, setEditingMarksId] = useState<string | null>(null);
  const [marksDraft, setMarksDraft] = useState<number>(150);

  if (mode === 'aptitude-tests') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Aptitude Test Configuration & Question Papers"
          subtitle="Manage CBT/OMR test schedules, randomized booklet sets (A–D), and participation readiness"
          actions={
            <button
              onClick={() => pushToast('Question Paper Sets Sealed', 'Encrypted master keys dispatched to regional hubs.', 'success')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" /> Seal Question Paper Vault
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {aptitudeTests.map((t) => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-blue-700">{t.id}</span>
                <StatusLabel label={t.answerKeyStatus} />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-[#0B1F3A]">{t.title}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t.date} · {t.shift}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs">
                <div>
                  <div className="text-slate-500">Questions</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{t.totalQuestions}</div>
                </div>
                <div>
                  <div className="text-slate-500">Max Marks</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{t.maxMarks}</div>
                </div>
                <div>
                  <div className="text-slate-500">Duration</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{t.durationMins}m</div>
                </div>
              </div>
              <div className="text-xs">
                <div className="text-slate-500 mb-1.5">Booklet Sets Configured</div>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-700">
                  {t.setsPrepared.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Script Evaluation</span>
                  <span className="font-mono font-semibold">{t.evaluationProgress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-700 rounded-full" style={{ width: `${t.evaluationProgress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paper Blueprint Table */}
        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-3">
            Active Examination Blueprint ({activeCampaign.title})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-medium">Section</th>
                  <th className="py-2 px-3 font-medium">Subject Area</th>
                  <th className="py-2 px-3 font-medium text-right">Questions</th>
                  <th className="py-2 px-3 font-medium text-right">Max Marks</th>
                  <th className="py-2 pl-3 font-medium">Negative Marking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeCampaign.examScheme.map((p) => (
                  <tr key={p.paper}>
                    <td className="py-2.5 pr-3 font-mono font-semibold text-[#0B1F3A]">{p.paper}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{p.subject}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{p.questions}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{p.maxMarks}</td>
                    <td className="py-2.5 pl-3 text-slate-600">{p.negativeMarking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  if (mode === 'answer-evaluation') {
    const scoredCandidates = candidates.filter((c) => c.writtenMarks);
    return (
      <div className="space-y-6">
        <PageHeader
          title="Answer Key Management & Script Evaluation"
          subtitle="Moderate provisional answer keys, import OMR/CBT response scores, and audit candidate marks"
          actions={
            <button
              onClick={() => simulateMarksImport(aptitudeTests[1].id)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Simulate Batch Marks Import
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {aptitudeTests.map((t) => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">{t.id}</span>
                <StatusLabel label={t.answerKeyStatus} />
              </div>
              <div className="text-sm font-display font-bold text-[#0B1F3A]">{t.title}</div>
              <div className="text-xs font-mono text-slate-600">
                {t.scriptsEvaluated.toLocaleString('en-IN')} / {t.totalScripts.toLocaleString('en-IN')} scripts evaluated
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => toggleTestAnswerKey(t.id)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 inline-flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-700" /> Cycle Key Status
                </button>
                {t.evaluationProgress < 100 && (
                  <button
                    onClick={() => simulateMarksImport(t.id)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561]"
                  >
                    Evaluate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Marks Entry & Override Grid */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Section-wise Evaluated Marks Ledger
            </h2>
            <FileCheck2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-medium">Roll No.</th>
                  <th className="py-2 px-3 font-medium">Candidate</th>
                  <th className="py-2 px-3 font-medium text-right">Quant</th>
                  <th className="py-2 px-3 font-medium text-right">Reasoning</th>
                  <th className="py-2 px-3 font-medium text-right">Verbal</th>
                  <th className="py-2 px-3 font-medium text-right">Domain</th>
                  <th className="py-2 px-3 font-medium text-right">Total (/200)</th>
                  <th className="py-2 pl-3 font-medium text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scoredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-3 font-mono text-slate-700">{c.rollNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{c.writtenMarks?.quant}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{c.writtenMarks?.reasoning}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{c.writtenMarks?.verbal}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{c.writtenMarks?.domain}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-[#0B1F3A]">
                      {editingMarksId === c.id ? (
                        <input
                          type="number"
                          min={0}
                          max={200}
                          value={marksDraft}
                          onChange={(e) => setMarksDraft(Number(e.target.value))}
                          className="w-16 border border-blue-600 rounded px-1.5 py-0.5 text-right"
                        />
                      ) : (
                        c.writtenMarks?.total
                      )}
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      {editingMarksId === c.id ? (
                        <button
                          onClick={() => {
                            updateWrittenMarks(c.id, marksDraft);
                            setEditingMarksId(null);
                          }}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-600 text-white"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingMarksId(c.id);
                            setMarksDraft(c.writtenMarks?.total ?? 150);
                          }}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100"
                        >
                          Edit Score
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

  // RESULTS & MERIT LISTS
  const scoredList = candidates
    .filter((c) => c.writtenMarks)
    .sort((a, b) => (b.writtenMarks?.total ?? 0) - (a.writtenMarks?.total ?? 0));

  const qualifiedCount = scoredList.filter((c) => c.qualifiedWritten).length;
  const scorecardCandidate =
    candidates.find((c) => c.id === scorecardId) ?? scoredList[0] ?? candidates[0];

  const histogramBins = [
    { range: '90-109', count: 1420, qualified: false },
    { range: '110-124', count: 3180, qualified: false },
    { range: '125-137', count: 4860, qualified: false },
    { range: '138-154', count: 3940, qualified: true },
    { range: '155-169', count: 2120, qualified: true },
    { range: '170-200', count: 690, qualified: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results, Cut-Offs & Merit Lists"
        subtitle="Configure category cut-offs, verify merit rankings, and publish official examination scorecards"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusLabel label={activeCampaign.resultsPublished ? 'Published' : 'Pending'} />
            <button
              onClick={() => pushToast('CSV Merit List Imported', '16,210 evaluated scores verified.', 'info')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Import Excel/CSV
            </button>
            <button
              onClick={() => toggleResultsPublished(activeCampaign.id)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561]"
            >
              {activeCampaign.resultsPublished ? 'Unpublish Result' : 'Publish Merit List'}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Scripts Evaluated" value="16,210" icon={ClipboardCheck} accent="navy" />
        <KpiCard label="Qualified for Interview" value={qualifiedCount * 240} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="General Cut-off" value={`${activeCampaign.cutoffGeneral} / 200`} icon={Award} accent="blue" />
        <KpiCard label="Top Written Score" value="172 / 200" icon={Award} accent="amber" />
      </div>

      {/* Cut-off Configuration + Score Distribution + Category Qualification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
            Category Cut-Off Configuration (/200)
          </h2>
          <div className="space-y-2.5 text-xs">
            {(
              [
                ['cutoffGeneral', 'General (UR)'],
                ['cutoffObc', 'OBC-NCL'],
                ['cutoffEws', 'EWS'],
                ['cutoffSc', 'SC'],
                ['cutoffSt', 'ST'],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="font-medium text-slate-700">{label}</span>
                <input
                  type="number"
                  value={activeCampaign[key]}
                  onChange={(e) =>
                    updateCampaign(activeCampaign.id, { [key]: Number(e.target.value) })
                  }
                  className="w-20 border border-slate-200 rounded-lg px-2.5 py-1.5 text-right font-mono font-semibold text-[#0B1F3A]"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Score Distribution</h2>
          <p className="text-xs text-slate-500">Blue bars indicate scores meeting General cut-off</p>
          <ScoreHistogram bins={histogramBins} />
        </section>

        <section className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-3">
            Category-wise Qualification
          </h2>
          <HorizontalBarList
            items={[
              { label: 'General (UR)', value: 584, max: 1440, color: '#0B1F3A' },
              { label: 'OBC-NCL', value: 392, max: 1440, color: '#1D4ED8' },
              { label: 'SC', value: 215, max: 1440, color: '#16A34A' },
              { label: 'EWS', value: 142, max: 1440, color: '#D97706' },
              { label: 'ST', value: 87, max: 1440, color: '#64748B' },
            ]}
          />
        </section>
      </div>

      {/* Merit Table + Scorecard Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <section className="xl:col-span-7 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-3">
            Provisional Merit Ranking Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-2 font-medium">Rank</th>
                  <th className="py-2 px-2 font-medium">Roll No.</th>
                  <th className="py-2 px-2 font-medium">Candidate</th>
                  <th className="py-2 px-2 font-medium">Category</th>
                  <th className="py-2 px-2 font-medium text-right">Marks</th>
                  <th className="py-2 pl-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scoredList.map((c, idx) => (
                  <tr
                    key={c.id}
                    onClick={() => setScorecardId(c.id)}
                    className={`cursor-pointer transition-colors ${
                      scorecardCandidate?.id === c.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 pr-2 font-mono font-bold text-[#0B1F3A]">#{c.meritRank ?? idx + 1}</td>
                    <td className="py-2.5 px-2 font-mono text-slate-700">{c.rollNumber}</td>
                    <td className="py-2.5 px-2 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-2.5 px-2 text-slate-600">{c.category}</td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold">
                      {c.writtenMarks?.total} / 200
                    </td>
                    <td className="py-2.5 pl-2 text-right">
                      <StatusLabel label={c.qualifiedWritten ? 'Qualified' : 'Not Qualified'} tone={c.qualifiedWritten ? 'success' : 'danger'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Candidate Scorecard Preview */}
        {scorecardCandidate && (
          <section className="xl:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#0B1F3A] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                  Official Examination Scorecard
                </div>
                <div className="text-sm font-display font-bold mt-0.5">{scorecardCandidate.name}</div>
              </div>
              <CandidateAvatar src={scorecardCandidate.photoUrl} name={scorecardCandidate.name} size="md" />
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="text-slate-500">Roll Number</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{scorecardCandidate.rollNumber}</div>
                </div>
                <div>
                  <div className="text-slate-500">Merit Rank</div>
                  <div className="font-mono font-bold text-blue-700 mt-0.5">
                    #{scorecardCandidate.meritRank ?? '-'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Result</div>
                  <div className="mt-0.5">
                    <StatusLabel
                      label={scorecardCandidate.qualifiedWritten ? 'Qualified' : 'Disqualified'}
                      tone={scorecardCandidate.qualifiedWritten ? 'success' : 'danger'}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  ['Paper I · Quantitative Aptitude', scorecardCandidate.writtenMarks?.quant ?? 0, 50],
                  ['Paper II · Analytical Reasoning', scorecardCandidate.writtenMarks?.reasoning ?? 0, 50],
                  ['Paper III · English Comprehension', scorecardCandidate.writtenMarks?.verbal ?? 0, 50],
                  ['Paper IV · Governance & Domain', scorecardCandidate.writtenMarks?.domain ?? 0, 50],
                ].map(([label, score, max]) => (
                  <div key={String(label)} className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-700">{label}</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {score} / {max}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 text-sm font-bold text-[#0B1F3A]">
                  <span>Aggregate Total Score</span>
                  <span className="font-mono">{scorecardCandidate.writtenMarks?.total ?? 0} / 200</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
