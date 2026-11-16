import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileBadge2,
  Shield,
  Users,
  X,
} from 'lucide-react';
import { useAima } from '../context/AimaContext';
import { Campaign } from '../types/aima';
import { AimaCrest, StatusLabel } from '../components/ui/Common';
import { MultiStepApplicationForm } from '../components/candidate/MultiStepApplicationForm';

export const PublicHomePage: React.FC = () => {
  const {
    campaigns,
    candidates,
    centres,
    setPortalMode,
    setCandidateNav,
    setActiveCandidateId,
  } = useAima();

  const [selectedRegCampaignId, setSelectedRegCampaignId] = useState<string>(
    campaigns[0]?.id ?? 'AIMA-REC-2027-AO'
  );
  const [inspectCampaign, setInspectCampaign] = useState<Campaign | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const examsSectionRef = useRef<HTMLElement>(null);
  const regSectionRef = useRef<HTMLElement>(null);

  const totalVacancies = campaigns.reduce((sum, c) => sum + c.totalVacancies, 0);
  const citiesCount = Array.from(new Set(centres.map((c) => c.city))).length;

  const scrollToExams = () => {
    examsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openRegistrationFor = (campaignId: string) => {
    setSelectedRegCampaignId(campaignId);
    setSubmittedAppId(null);
    setTimeout(() => {
      regSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  };

  const submittedCandidate = submittedAppId
    ? candidates.find((c) => c.id === submittedAppId)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9]">
      {/* 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="whitespace-nowrap shrink-0"
          >
            <AimaCrest />
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={scrollToExams}
              className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0"
            >
              Examinations
            </button>
            <button
              onClick={() => openRegistrationFor(selectedRegCampaignId)}
              className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0"
            >
              Registration Form
            </button>
            <button
              onClick={() => setPortalMode('candidate')}
              className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0"
            >
              Candidate Portal
            </button>
            <button
              onClick={() => setPortalMode('admin')}
              className="hover:text-[#0B1F3A] transition-colors whitespace-nowrap shrink-0"
            >
              MIS / Admin Portal
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openRegistrationFor(campaigns[0]?.id ?? 'AIMA-REC-2027-AO')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Apply Online
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Clean Institutional Hero */}
        <section className="bg-[#0B1F3A] text-white border-b-4 border-amber-500">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12 lg:py-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold tracking-wide text-amber-300 uppercase">
                All India Management & Administration Authority · Cycle 2027
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-balance">
                National Recruitment Examinations & Online Registration
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Review active 2027 recruitment notifications, inspect category-wise vacancies, and submit your online examination registration form directly.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={scrollToExams}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-600 text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  Browse Examinations <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setCandidateNav('c-admit-cards');
                    setPortalMode('candidate');
                  }}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 inline-flex items-center gap-1.5 transition-colors"
                >
                  <FileBadge2 className="w-3.5 h-3.5 text-amber-300" /> Download E-Admit Card
                </button>
              </div>
            </div>

            {/* Direct Portal Switch Card */}
            <div className="bg-white/8 border border-white/15 rounded-xl p-5 lg:w-[340px] space-y-3 shrink-0">
              <div className="text-xs font-semibold text-amber-300">Quick Portal Access</div>
              <button
                onClick={() => setPortalMode('candidate')}
                className="w-full p-3 rounded-lg bg-white text-[#0B1F3A] hover:bg-slate-100 text-left flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-xs font-display font-bold">Candidate Self-Service Portal</div>
                  <div className="text-[11px] text-slate-500">Track status, admit cards & results</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-700 shrink-0" />
              </button>
              <button
                onClick={() => setPortalMode('admin')}
                className="w-full p-3 rounded-lg bg-[#102B4E] hover:bg-[#163968] text-white border border-white/15 text-left flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-xs font-display font-bold">AIMA Internal MIS Portal</div>
                  <div className="text-[11px] text-slate-300">Scrutiny, seat maps & selection</div>
                </div>
                <Shield className="w-4 h-4 text-amber-300 shrink-0" />
              </button>
            </div>
          </div>
        </section>

        {/* 4-Column Institutional Summary Strip */}
        <section className="max-w-[1280px] mx-auto px-4 lg:px-6 -mt-5">
          <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="p-4 flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <div className="text-lg font-display font-bold text-[#0B1F3A] font-mono tabular-nums">
                  {campaigns.length}
                </div>
                <div className="text-xs text-slate-500">Active Examinations 2027</div>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <div className="text-lg font-display font-bold text-[#0B1F3A] font-mono tabular-nums">
                  {totalVacancies}
                </div>
                <div className="text-xs text-slate-500">Sanctioned Grade A Posts</div>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-lg font-display font-bold text-[#0B1F3A] font-mono tabular-nums">
                  {citiesCount} Nodal Cities
                </div>
                <div className="text-xs text-slate-500">Delhi, Mumbai, Bengaluru, Chennai</div>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#0B1F3A] shrink-0" />
              <div>
                <div className="text-lg font-display font-bold text-[#0B1F3A] font-mono tabular-nums">
                  14 Mar 2027
                </div>
                <div className="text-xs text-slate-500">Next Written Examination</div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Examinations Directory */}
        <section
          ref={examsSectionRef}
          id="examinations"
          className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-display font-bold text-[#0B1F3A]">
                Active Recruitment Examinations 2027
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Select any examination below to inspect vacancy details or open its online registration form
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {campaigns.length} Open Notifications
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {campaigns.map((cp) => {
              const isSelectedForForm = selectedRegCampaignId === cp.id;
              return (
                <div
                  key={cp.id}
                  className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-colors ${
                    isSelectedForForm ? 'border-blue-600' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold text-slate-500">
                        {cp.id}
                      </span>
                      <StatusLabel label={cp.status} />
                    </div>

                    <h3 className="text-base font-display font-bold text-[#0B1F3A] mt-2">
                      {cp.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">{cp.department}</div>

                    <p className="text-xs text-slate-700 mt-3 leading-relaxed">
                      {cp.qualification}
                    </p>

                    <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-100 text-xs">
                      <div>
                        <div className="text-slate-500">Vacancies</div>
                        <div className="font-mono font-bold text-[#0B1F3A] mt-0.5 tabular-nums">
                          {cp.totalVacancies} Posts
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Last Date</div>
                        <div className="font-mono font-semibold text-slate-900 mt-0.5 tabular-nums">
                          {cp.deadline}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Exam Date</div>
                        <div className="font-mono font-semibold text-blue-700 mt-0.5 tabular-nums">
                          {cp.examDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                      <span>Age Limit: {cp.minAge}–{cp.maxAge} yrs</span>
                      <span className="font-mono">
                        Fee: ₹{cp.feeGeneral} / ₹{cp.feeReserved}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openRegistrationFor(cp.id)}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                    >
                      Open Registration Form
                    </button>
                    <button
                      onClick={() => setInspectCampaign(cp)}
                      className="py-2 px-3 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Direct Online Registration Form Section */}
        <section
          ref={regSectionRef}
          id="registration"
          className="max-w-[1280px] mx-auto px-4 lg:px-6 pb-14 space-y-5"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-display font-bold text-[#0B1F3A]">
                Online Examination Registration Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Choose an examination tab below to complete and submit your official 2027 registration dossier
              </p>
            </div>

            {/* Examination Form Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              {campaigns.map((cp) => (
                <button
                  key={cp.id}
                  onClick={() => {
                    setSelectedRegCampaignId(cp.id);
                    setSubmittedAppId(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedRegCampaignId === cp.id
                      ? 'bg-white text-[#0B1F3A] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cp.shortTitle}
                </button>
              ))}
            </div>
          </div>

          {submittedCandidate ? (
            <div className="bg-white border border-emerald-200 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-display font-bold text-[#0B1F3A]">
                    Registration Submitted & Fee Confirmed
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your application for <strong>{submittedCandidate.position}</strong> has been recorded in the AIMA Recruitment Registry.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <div className="text-slate-500">Application ID</div>
                  <div className="font-mono font-bold text-blue-700 mt-0.5">{submittedCandidate.id}</div>
                </div>
                <div>
                  <div className="text-slate-500">Provisional Roll No.</div>
                  <div className="font-mono font-bold text-[#0B1F3A] mt-0.5">{submittedCandidate.rollNumber}</div>
                </div>
                <div>
                  <div className="text-slate-500">Preferred Exam City</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{submittedCandidate.preferredCity}</div>
                </div>
                <div>
                  <div className="text-slate-500">Verification Status</div>
                  <div className="mt-0.5"><StatusLabel label={submittedCandidate.verificationStatus} /></div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setActiveCandidateId(submittedCandidate.id);
                    setCandidateNav('c-applications');
                    setPortalMode('candidate');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561]"
                >
                  Track in Candidate Portal
                </button>
                <button
                  onClick={() => setSubmittedAppId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Submit Another Registration
                </button>
              </div>
            </div>
          ) : (
            <MultiStepApplicationForm
              key={selectedRegCampaignId}
              initialCampaignId={selectedRegCampaignId}
              onComplete={(newAppId) => setSubmittedAppId(newAppId)}
              onCancel={scrollToExams}
            />
          )}
        </section>
      </main>

      {/* Clean Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 px-4 lg:px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            All India Management & Administration Authority (AIMA) · Examination Directorate, New Delhi
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setPortalMode('candidate')} className="hover:text-[#0B1F3A] font-medium">
              Candidate Portal
            </button>
            <button onClick={() => setPortalMode('admin')} className="hover:text-[#0B1F3A] font-medium">
              Internal MIS Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Examination Scheme & Vacancy Details Modal */}
      {inspectCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
              <div>
                <div className="font-mono text-xs text-blue-700 font-semibold">{inspectCampaign.id}</div>
                <h3 className="text-lg font-display font-bold text-[#0B1F3A] mt-0.5">
                  {inspectCampaign.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectCampaign(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-[#0B1F3A]">Category-wise Vacancy Breakdown</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-2 font-medium">Post</th>
                      <th className="py-2 px-2 font-medium text-right">UR</th>
                      <th className="py-2 px-2 font-medium text-right">OBC</th>
                      <th className="py-2 px-2 font-medium text-right">SC</th>
                      <th className="py-2 px-2 font-medium text-right">ST</th>
                      <th className="py-2 pl-2 font-medium text-right">EWS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inspectCampaign.reservationMatrix.map((r) => (
                      <tr key={r.position}>
                        <td className="py-2 pr-2 font-medium text-slate-900">{r.position}</td>
                        <td className="py-2 px-2 text-right font-mono">{r.General}</td>
                        <td className="py-2 px-2 text-right font-mono">{r['OBC-NCL']}</td>
                        <td className="py-2 px-2 text-right font-mono">{r.SC}</td>
                        <td className="py-2 px-2 text-right font-mono">{r.ST}</td>
                        <td className="py-2 pl-2 text-right font-mono">{r.EWS}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-[#0B1F3A]">Examination Scheme</div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg px-3">
                {inspectCampaign.examScheme.map((p) => (
                  <div key={p.paper} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-semibold text-[#0B1F3A]">{p.paper}:</span>{' '}
                      <span className="text-slate-800">{p.subject}</span>
                    </div>
                    <span className="font-mono text-slate-600 shrink-0">
                      {p.questions} Qs · {p.maxMarks} Marks · {p.durationMins}m
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectCampaign(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = inspectCampaign.id;
                  setInspectCampaign(null);
                  openRegistrationFor(id);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800"
              >
                Register for this Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
