import React, { useState } from 'react';
import {
  Award,
  Bell,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Download,
  FileBadge2,
  FileText,
  MapPin,
  Plus,
  Upload,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { CandidateAvatar, PageHeader, StatusLabel } from '../../components/ui/Common';
import { AdmitCardPreview } from '../../components/shared/AdmitCardPreview';
import { MultiStepApplicationForm } from '../../components/candidate/MultiStepApplicationForm';

export const CandidatePortal: React.FC = () => {
  const {
    candidateNav,
    setCandidateNav,
    campaigns,
    candidates,
    activeCandidateId,
    setActiveCandidateId,
    payments,
    updateCandidateProfile,
    uploadCandidateDocument,
    pushToast,
  } = useAima();

  const candidate =
    candidates.find((c) => c.id === activeCandidateId) ?? candidates[0];
  const activeCampaign =
    campaigns.find((cp) => cp.id === candidate.campaignId) ?? campaigns[0];

  const [showApplyWizard, setShowApplyWizard] = useState(false);
  const [applyCampaignId, setApplyCampaignId] = useState<string | undefined>(undefined);

  // Editable profile state
  const [profilePhone, setProfilePhone] = useState(candidate.phone);
  const [profileAddress, setProfileAddress] = useState(candidate.address);
  const [profileCity, setProfileCity] = useState(candidate.city);
  const [profilePrefCity, setProfilePrefCity] = useState(candidate.preferredCity);

  // Sync profile draft when switching preview candidate
  React.useEffect(() => {
    setProfilePhone(candidate.phone);
    setProfileAddress(candidate.address);
    setProfileCity(candidate.city);
    setProfilePrefCity(candidate.preferredCity);
  }, [candidate.id, candidate.phone, candidate.address, candidate.city, candidate.preferredCity]);

  const candidatePayments = payments.filter((p) => p.applicationId === candidate.id);

  if (showApplyWizard) {
    return (
      <MultiStepApplicationForm
        initialCampaignId={applyCampaignId}
        onComplete={(newId) => {
          setShowApplyWizard(false);
          setActiveCandidateId(newId);
          setCandidateNav('c-applications');
        }}
        onCancel={() => setShowApplyWizard(false)}
      />
    );
  }

  // 1. CANDIDATE HOME DASHBOARD
  if (candidateNav === 'c-dashboard') {
    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <section className="bg-[#0B1F3A] text-white rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <CandidateAvatar src={candidate.photoUrl} name={candidate.name} size="lg" />
            <div>
              <div className="text-xs font-medium text-amber-300">
                Welcome back to AIMA Candidate Portal
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold mt-0.5">
                {candidate.name}
              </h1>
              <div className="text-xs text-slate-300 font-mono mt-1">
                Application ID: {candidate.id} · Roll No: {candidate.rollNumber} · {candidate.position}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCandidateNav('c-admit-cards')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 hover:bg-blue-600 text-white inline-flex items-center gap-1.5"
            >
              <FileBadge2 className="w-4 h-4" /> View E-Admit Card
            </button>
            <button
              onClick={() => {
                setApplyCampaignId(campaigns[2]?.id);
                setShowApplyWizard(true);
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Apply New Post
            </button>
          </div>
        </section>

        {/* 4 Summary Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500">Application Status</div>
            <div className="mt-2"><StatusLabel label={candidate.verificationStatus} /></div>
            <div className="text-xs text-slate-600 mt-2">{activeCampaign.title}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500">Examination Countdown</div>
            <div className="text-xl font-display font-bold text-[#0B1F3A] font-mono mt-1">
              12 Days · 09:30 AM
            </div>
            <div className="text-xs text-slate-500 mt-1">{activeCampaign.examDate} · {candidate.preferredCity}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500">Admit Card Availability</div>
            <div className="mt-2"><StatusLabel label={candidate.admitCardStatus} /></div>
            <div className="text-xs text-slate-600 mt-2 font-mono">
              {candidate.allocatedHallCode ? `Hall ${candidate.allocatedHallCode} · Seat ${candidate.allocatedSeat}` : 'Seat allocation pending'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500">Next Scheduled Activity</div>
            <div className="text-sm font-display font-bold text-[#0B1F3A] mt-1">
              {candidate.finalSelected ? 'Joining Formalities · May 2027' : candidate.interviewDate ?? 'Written Examination'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {candidate.postingLocation ?? candidate.allocatedCentreName ?? 'AIMA Examination Hub'}
            </div>
          </div>
        </div>

        {/* 10-Stage Graphical Application Progress */}
        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Recruitment Journey Tracker ({candidate.id})
            </h2>
            <button
              onClick={() => setCandidateNav('c-applications')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Detailed Tracking
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {candidate.timeline.map((step, idx) => (
              <div
                key={step.step}
                className={`p-3 rounded-lg border text-xs ${
                  step.completed
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : step.active
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="font-semibold text-slate-900 mt-1">{step.step}</div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">{step.date}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Latest Directorate Notices</h2>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="font-medium text-slate-800">
                E-Admit Cards for Administrative Officer Recruitment 2027 are live for download.
              </span>
              <span className="font-mono text-slate-400 shrink-0">01 Mar 2027</span>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="font-medium text-slate-800">
                PwBD ground-floor accessibility desks confirmed across New Delhi, Mumbai, Bengaluru & Chennai.
              </span>
              <span className="font-mono text-slate-400 shrink-0">25 Feb 2027</span>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-3">
              <span className="font-medium text-slate-800">
                IT Officer Recruitment 2027 online applications open until 28 Feb 2027.
              </span>
              <span className="font-mono text-slate-400 shrink-0">15 Jan 2027</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 2. RECRUITMENT NOTIFICATIONS
  if (candidateNav === 'c-notifications') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Active AIMA Recruitment Notifications 2027"
          subtitle="Review official eligibility, vacancy rosters, and apply online"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {campaigns.map((cp) => (
            <div key={cp.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500">{cp.id}</span>
                  <StatusLabel label={cp.status} />
                </div>
                <h2 className="text-base font-display font-bold text-[#0B1F3A] mt-2">{cp.title}</h2>
                <p className="text-xs text-slate-600 mt-1">{cp.qualification}</p>

                <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <div className="text-slate-500">Vacancies</div>
                    <div className="font-mono font-bold text-slate-900">{cp.totalVacancies}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Deadline</div>
                    <div className="font-mono font-semibold text-slate-900">{cp.deadline}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Exam Date</div>
                    <div className="font-mono font-semibold text-blue-700">{cp.examDate}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setApplyCampaignId(cp.id);
                  setShowApplyWizard(true);
                }}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800"
              >
                Apply Now Online
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. MY APPLICATIONS & TRACKING TIMELINE
  if (candidateNav === 'c-applications') {
    const myApps = candidates.filter((c) => c.email === candidate.email || c.id === candidate.id);
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Applications & Lifecycle Tracking"
          subtitle="Track real-time verification, allotment, admit card, result, and selection milestones"
          actions={
            <button
              onClick={() => setShowApplyWizard(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> New Application
            </button>
          }
        />

        {myApps.map((app) => (
          <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="font-mono text-xs font-semibold text-blue-700">
                  {app.id} · Roll No: {app.rollNumber}
                </div>
                <h2 className="text-base font-display font-bold text-[#0B1F3A] mt-0.5">
                  {app.position} ({app.category})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <StatusLabel label={app.paymentStatus} />
                <StatusLabel label={app.verificationStatus} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {app.timeline.map((step, i) => (
                <div
                  key={step.step}
                  className={`p-3 rounded-lg border text-xs ${
                    step.completed
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : step.active
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="font-mono text-[10px] text-slate-500">
                    Stage {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-semibold text-slate-900 mt-0.5">{step.step}</div>
                  <div className="text-[11px] font-mono text-slate-600 mt-1">{step.date}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 4. MY PROFILE (EDITABLE PERMITTED FIELDS)
  if (candidateNav === 'c-profile') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Candidate Profile"
          subtitle="Update permitted contact and examination preference details"
        />

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <CandidateAvatar src={candidate.photoUrl} name={candidate.name} size="lg" />
            <div>
              <h2 className="text-base font-display font-bold text-[#0B1F3A]">{candidate.name}</h2>
              <div className="text-xs text-slate-500 font-mono">
                DOB: {candidate.dob} (Locked) · Category: {candidate.category} (Locked)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Registered Mobile Number</label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">City</label>
              <input
                type="text"
                value={profileCity}
                onChange={(e) => setProfileCity(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Correspondence Address</label>
              <input
                type="text"
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Preferred Exam City</label>
              <select
                value={profilePrefCity}
                onChange={(e) => setProfilePrefCity(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white"
              >
                {['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai'].map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() =>
                updateCandidateProfile(candidate.id, {
                  phone: profilePhone,
                  address: profileAddress,
                  city: profileCity,
                  preferredCity: profilePrefCity,
                })
              }
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561]"
            >
              Save Profile Updates
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. DOCUMENTS & KYC
  if (candidateNav === 'c-documents') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Documents & KYC Vault"
          subtitle="Verified identity proofs, academic transcripts, and statutory enclosures"
          actions={
            <button
              onClick={() =>
                uploadCandidateDocument(
                  candidate.id,
                  'No Objection Certificate (Current Employer)',
                  'Employment'
                )
              }
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Enclosure (PDF)
            </button>
          }
        />

        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {candidate.documents.map((d) => (
            <div key={d.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">{d.name}</div>
                  <div className="text-slate-500">
                    {d.type} · Uploaded {d.uploadedAt} · {d.fileSize}
                  </div>
                </div>
              </div>
              <StatusLabel label={d.status} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. PAYMENTS & RECEIPTS
  if (candidateNav === 'c-payments') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Fee Payments & Official Receipts"
          subtitle="Download verified transaction receipts for your submitted applications"
        />

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="py-3 px-4 font-medium">Receipt / Txn ID</th>
                <th className="py-3 px-3 font-medium">Application No.</th>
                <th className="py-3 px-3 font-medium">Gateway & UTR</th>
                <th className="py-3 px-3 font-medium text-right">Amount</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidatePayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-slate-500">
                    Transaction reference {candidate.transactionId} · ₹{candidate.paymentAmount} ({candidate.paymentStatus})
                  </td>
                </tr>
              ) : (
                candidatePayments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">{p.id}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{p.applicationId}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {p.gateway} · <span className="font-mono">{p.utrNumber}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">₹{p.amount}</td>
                    <td className="py-3 px-3"><StatusLabel label={p.status} /></td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => pushToast('Fee Receipt Downloaded', `${p.id}_Receipt.pdf`, 'success')}
                        className="px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    );
  }

  // 7. ADMIT CARDS
  if (candidateNav === 'c-admit-cards') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Download E-Admit Card"
          subtitle="Verify your allotted examination centre, floor, hall, and seat number prior to examination day"
        />
        <AdmitCardPreview candidate={candidate} />
      </div>
    );
  }

  // 8. EXAMINATION DETAILS
  if (candidateNav === 'c-exam-details') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Allotted Examination Venue & Schedule"
          subtitle={`${activeCampaign.title} · ${activeCampaign.examDate}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-display font-bold text-[#0B1F3A]">
                  {candidate.allocatedCentreName ?? 'AIMA Examination Centre'}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  14 Institutional Area, Lodhi Road, {candidate.allocatedCity ?? candidate.preferredCity}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <div className="text-slate-500">Building</div>
                <div className="font-semibold text-slate-900 mt-0.5">{candidate.allocatedBuilding ?? 'Academic Block A'}</div>
              </div>
              <div>
                <div className="text-slate-500">Floor</div>
                <div className="font-semibold text-slate-900 mt-0.5">{candidate.allocatedFloor ?? 'Ground Floor'}</div>
              </div>
              <div>
                <div className="text-slate-500">Hall Code</div>
                <div className="font-mono font-bold text-blue-700 mt-0.5">{candidate.allocatedHallCode ?? 'G-02'}</div>
              </div>
              <div>
                <div className="text-slate-500">Seat Number</div>
                <div className="font-mono font-bold text-lg text-[#0B1F3A]">{candidate.allocatedSeat ?? '024'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-[#0B1F3A]">
              <CalendarClock className="w-4 h-4 text-amber-600" />
              <span>Reporting Timings</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Examination Date</span>
              <span className="font-mono font-semibold">{activeCampaign.examDate}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Reporting Time</span>
              <span className="font-mono font-semibold">08:00 AM</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Gate Closes</span>
              <span className="font-mono font-bold text-red-700">09:00 AM</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Exam Session</span>
              <span className="font-mono font-semibold">09:30 AM – 12:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 9. RESULTS & SCORECARDS
  if (candidateNav === 'c-results') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Examination Results & Official Scorecard"
          subtitle={`${activeCampaign.title} · Roll Number ${candidate.rollNumber}`}
          actions={
            <button
              onClick={() => pushToast('Scorecard PDF Downloaded', `${candidate.rollNumber}_Scorecard.pdf`, 'success')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Scorecard
            </button>
          }
        />

        {candidate.writtenMarks ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h2 className="text-base font-display font-bold text-[#0B1F3A]">Paper-wise Marks Statement</h2>
                </div>
                <StatusLabel label={candidate.qualifiedWritten ? 'Qualified for Interview' : 'Not Qualified'} tone={candidate.qualifiedWritten ? 'success' : 'danger'} />
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  ['Paper I · Quantitative & Data Interpretation', candidate.writtenMarks.quant, 50],
                  ['Paper II · Analytical & Logical Reasoning', candidate.writtenMarks.reasoning, 50],
                  ['Paper III · English Comprehension & Drafting', candidate.writtenMarks.verbal, 50],
                  ['Paper IV · Public Administration & Governance', candidate.writtenMarks.domain, 50],
                ].map(([label, val, max]) => (
                  <div key={String(label)} className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-700">{label}</span>
                    <span className="font-mono font-bold text-slate-900">{val} / {max}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 text-sm font-bold text-[#0B1F3A]">
                  <span>Aggregate Total Marks</span>
                  <span className="font-mono">{candidate.writtenMarks.total} / {candidate.writtenMarks.maxTotal}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
              <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Merit & Cut-Off Benchmark</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500">All-India Merit Rank</div>
                  <div className="text-2xl font-display font-bold text-blue-700 font-mono mt-1">
                    #{candidate.meritRank ?? '-'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-slate-500">{candidate.category} Cut-off</div>
                  <div className="text-2xl font-display font-bold text-[#0B1F3A] font-mono mt-1">
                    {activeCampaign.cutoffGeneral} / 200
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
            Examination results for your dossier have not been published yet.
          </div>
        )}
      </div>
    );
  }

  // 10. INTERVIEWS
  if (candidateNav === 'c-interviews') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Selection Interviews & Schedule"
          subtitle="Track AI pre-interview readiness and final panel interview schedule"
        />
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs text-slate-500">Current Interview Stage</div>
              <div className="text-base font-display font-bold text-[#0B1F3A] mt-0.5">
                {candidate.interviewStage}
              </div>
            </div>
            <StatusLabel label={candidate.interviewStage} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="text-slate-500">Assigned Selection Board</div>
              <div className="font-semibold text-slate-900 mt-1">
                {candidate.interviewPanel ?? 'Panel Assignment Pending'}
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="text-slate-500">Scheduled Date & Slot</div>
              <div className="font-mono font-semibold text-blue-700 mt-1">
                {candidate.interviewDate ?? 'To be notified'}
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="text-slate-500">Venue</div>
              <div className="font-semibold text-slate-900 mt-1">
                AIMA HQ Board Room I, New Delhi
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 11. SELECTION & APPOINTMENT
  return (
    <div className="space-y-6">
      <PageHeader
        title="Final Selection & Appointment Offer"
        subtitle="View your final posting allocation, establishment order, and joining instructions"
      />

      {candidate.finalSelected ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-display font-bold text-[#0B1F3A]">
                  Recommended & Selected · {candidate.allocatedDesignation ?? candidate.position}
                </h2>
                <div className="text-xs font-mono text-slate-500">
                  Order No: {candidate.appointmentNumber ?? 'AIMA/ESTT/AO/2027/014'}
                </div>
              </div>
            </div>
            <StatusLabel label={candidate.joiningStatus ?? 'Letter Issued'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500">Allocated Department</div>
              <div className="font-semibold text-[#0B1F3A] mt-1">
                {candidate.allocatedDepartment ?? 'Policy & Examination Governance'}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500">Posting Location</div>
              <div className="font-semibold text-[#0B1F3A] mt-1">
                {candidate.postingLocation ?? 'AIMA Headquarters, New Delhi'}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-slate-500">Reporting Date for Joining</div>
              <div className="font-mono font-bold text-blue-700 mt-1">
                {candidate.joiningDate ?? '2027-05-15'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-600">
              Carry original academic degrees, relieving letter, and medical fitness certificate on joining day.
            </span>
            <button
              onClick={() =>
                pushToast('Appointment Letter PDF Downloaded', `${candidate.rollNumber}_Offer.pdf`, 'success')
              }
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Appointment Letter
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
          Final selection & appointment orders are released after completion of Panel Interviews.
        </div>
      )}
    </div>
  );
};
