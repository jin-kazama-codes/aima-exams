import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  Search,
  XCircle,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { CandidateApplication, VerificationStatus } from '../../types/aima';
import { CandidateAvatar, PageHeader, StatusLabel } from '../../components/ui/Common';

export const ApplicationsPage: React.FC<{ verificationMode?: boolean }> = ({
  verificationMode = false,
}) => {
  const {
    candidates,
    campaigns,
    selectedCampaignId,
    globalSearch,
    updateVerification,
  } = useAima();

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(
    verificationMode ? 'Pending Review' : 'ALL'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<
    'personal' | 'education' | 'category' | 'documents' | 'payment' | 'timeline' | 'actions'
  >('personal');
  const [verifierRemark, setVerifierRemark] = useState('');

  const query = (localSearch || globalSearch).trim().toLowerCase();

  const filtered = candidates.filter((c) => {
    if (selectedCampaignId !== 'ALL' && c.campaignId !== selectedCampaignId) return false;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Pending Queue') {
        if (!['Pending Review', 'Under Scrutiny', 'Discrepancy Flagged'].includes(c.verificationStatus)) {
          return false;
        }
      } else if (c.verificationStatus !== statusFilter) {
        return false;
      }
    }
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (query) {
      const hay = `${c.name} ${c.id} ${c.rollNumber} ${c.position} ${c.city}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  const selectedCandidate = selectedCandidateId
    ? candidates.find((c) => c.id === selectedCandidateId) ?? null
    : null;

  if (selectedCandidate) {
    const campaign = campaigns.find((cp) => cp.id === selectedCandidate.campaignId);
    const tabs = [
      { id: 'personal', label: 'Personal Information' },
      { id: 'education', label: 'Education' },
      { id: 'category', label: 'Category & Eligibility' },
      { id: 'documents', label: 'Uploaded Documents' },
      { id: 'payment', label: 'Payment History' },
      { id: 'timeline', label: 'Application Timeline' },
      { id: 'actions', label: 'Verification Actions' },
    ] as const;

    const handleVerify = (status: VerificationStatus) => {
      updateVerification(
        selectedCandidate.id,
        status,
        verifierRemark.trim() || selectedCandidate.verifierNote
      );
      setVerifierRemark('');
    };

    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <CandidateAvatar src={selectedCandidate.photoUrl} name={selectedCandidate.name} size="lg" />
            <div>
              <button
                onClick={() => setSelectedCandidateId(null)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dossiers
              </button>
              <h1 className="text-xl font-display font-bold text-[#0B1F3A]">
                {selectedCandidate.name}
              </h1>
              <div className="text-xs text-slate-500 font-mono">
                {selectedCandidate.id} · Roll: {selectedCandidate.rollNumber} · {selectedCandidate.position}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusLabel label={selectedCandidate.verificationStatus} />
            <StatusLabel label={selectedCandidate.paymentStatus} />
            <button
              onClick={() => handleVerify('Verified')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Verify
            </button>
          </div>
        </div>

        {/* Detail Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setDetailTab(t.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                detailTab === t.id
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {detailTab === 'personal' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div>
              <div className="text-slate-500">Full Name</div>
              <div className="font-semibold text-slate-900 mt-0.5">{selectedCandidate.name}</div>
            </div>
            <div>
              <div className="text-slate-500">Father's / Guardian's Name</div>
              <div className="font-semibold text-slate-900 mt-0.5">{selectedCandidate.fatherName}</div>
            </div>
            <div>
              <div className="text-slate-500">Date of Birth & Gender</div>
              <div className="font-mono font-semibold text-slate-900 mt-0.5">
                {selectedCandidate.dob} · {selectedCandidate.gender}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Email Address</div>
              <div className="font-medium text-slate-900 mt-0.5">{selectedCandidate.email}</div>
            </div>
            <div>
              <div className="text-slate-500">Mobile Number</div>
              <div className="font-mono font-medium text-slate-900 mt-0.5">{selectedCandidate.phone}</div>
            </div>
            <div>
              <div className="text-slate-500">Recruitment Notification</div>
              <div className="font-medium text-slate-900 mt-0.5">{campaign?.title ?? selectedCandidate.campaignId}</div>
            </div>
            <div className="md:col-span-3 pt-3 border-t border-slate-100">
              <div className="text-slate-500">Permanent Residential Address</div>
              <div className="font-medium text-slate-900 mt-0.5">
                {selectedCandidate.address}, {selectedCandidate.city}, {selectedCandidate.state} — {selectedCandidate.pincode}
              </div>
            </div>
          </div>
        )}

        {detailTab === 'education' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Academic & Experience Credentials</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-3 font-medium">Qualification</th>
                    <th className="py-2 px-3 font-medium">Institution</th>
                    <th className="py-2 px-3 font-medium">University / Board</th>
                    <th className="py-2 px-3 font-medium text-right">Year</th>
                    <th className="py-2 pl-3 font-medium text-right">Score / %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedCandidate.education.map((edu, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-3 font-semibold text-slate-900">{edu.degree}</td>
                      <td className="py-3 px-3 text-slate-700">{edu.institution}</td>
                      <td className="py-3 px-3 text-slate-600">{edu.university}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{edu.year}</td>
                      <td className="py-3 pl-3 text-right font-mono tabular-nums font-semibold text-[#0B1F3A]">{edu.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Post-Qualification Experience: </span>
              <span className="font-semibold text-slate-900 font-mono">
                {selectedCandidate.experienceYears} Year(s)
              </span>
              {selectedCandidate.currentOrg && (
                <span className="text-slate-600"> · {selectedCandidate.currentOrg}</span>
              )}
            </div>
          </div>
        )}

        {detailTab === 'category' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="text-slate-500">Reservation Category</div>
              <div className="text-base font-display font-bold text-[#0B1F3A] mt-1">
                {selectedCandidate.category}
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="text-slate-500">PwBD / Ground-Floor Accommodation</div>
              <div className="text-base font-display font-bold text-[#0B1F3A] mt-1">
                {selectedCandidate.pwbdRequired ? 'Required (Mandatory)' : 'Not Required'}
              </div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="text-slate-500">Preferred Exam City & Shift</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">
                {selectedCandidate.preferredCity} · {selectedCandidate.preferredShift}
              </div>
            </div>
          </div>
        )}

        {detailTab === 'documents' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Submitted KYC & Academic Enclosures</h2>
            {selectedCandidate.documents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No documents uploaded by candidate yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {selectedCandidate.documents.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900">{doc.name}</div>
                        <div className="text-slate-500">
                          {doc.type} · Uploaded {doc.uploadedAt} · {doc.fileSize}
                        </div>
                      </div>
                    </div>
                    <StatusLabel label={doc.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {detailTab === 'payment' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-slate-500">Application Fee</div>
              <div className="font-mono text-base font-bold text-[#0B1F3A] mt-0.5">
                ₹{selectedCandidate.paymentAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Payment Status</div>
              <div className="mt-1"><StatusLabel label={selectedCandidate.paymentStatus} /></div>
            </div>
            <div>
              <div className="text-slate-500">Transaction Reference</div>
              <div className="font-mono font-semibold text-slate-900 mt-0.5">{selectedCandidate.transactionId}</div>
            </div>
            <div>
              <div className="text-slate-500">Payment Date</div>
              <div className="font-mono text-slate-700 mt-0.5">{selectedCandidate.appliedDate}</div>
            </div>
          </div>
        )}

        {detailTab === 'timeline' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">10-Stage Lifecycle Progress</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {selectedCandidate.timeline.map((step, i) => (
                <div
                  key={step.step}
                  className={`p-3 rounded-lg border text-xs ${
                    step.completed
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : step.active
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="font-mono text-[11px] text-slate-500">Stage {String(i + 1).padStart(2, '0')}</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{step.step}</div>
                  <div className="text-[11px] text-slate-600 mt-1 font-mono">{step.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {detailTab === 'actions' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Scrutiny Decision & Official Remarks</h2>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Verification Officer Remark
              </label>
              <textarea
                rows={3}
                value={verifierRemark}
                onChange={(e) => setVerifierRemark(e.target.value)}
                placeholder={selectedCandidate.verifierNote ?? 'Enter scrutiny note, discrepancy reason, or DigiLocker verification reference...'}
                className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleVerify('Verified')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Verify & Approve
              </button>
              <button
                onClick={() => handleVerify('Under Scrutiny')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800"
              >
                Mark Under Scrutiny
              </button>
              <button
                onClick={() => handleVerify('Discrepancy Flagged')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 inline-flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Flag Discrepancy
              </button>
              <button
                onClick={() => handleVerify('Rejected')}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 inline-flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject Application
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={verificationMode ? 'Candidate Verification Queue' : 'Applications Ledger'}
        subtitle={
          verificationMode
            ? 'Review uploaded KYC certificates, category proofs, and academic eligibility'
            : 'Search, filter, and inspect candidate applications across active AIMA recruitments'
        }
      />

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search candidate name, application ID, city..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="General">General</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {(['ALL', 'Verified', 'Pending Review', 'Under Scrutiny', 'Discrepancy Flagged'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-[#0B1F3A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All Statuses' : st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Compact Data Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="py-3 px-4 font-medium">Candidate</th>
                <th className="py-3 px-3 font-medium">Application No.</th>
                <th className="py-3 px-3 font-medium">Position Applied</th>
                <th className="py-3 px-3 font-medium">Category</th>
                <th className="py-3 px-3 font-medium">Payment</th>
                <th className="py-3 px-3 font-medium">Verification</th>
                <th className="py-3 px-3 font-medium">Applied Date</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No applications match the active search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c: CandidateApplication) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <CandidateAvatar src={c.photoUrl} name={c.name} size="sm" />
                        <div>
                          <div className="font-semibold text-slate-900">{c.name}</div>
                          <div className="text-[11px] text-slate-500">{c.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{c.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{c.position}</td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {c.category}
                      {c.pwbdRequired ? ' · PwBD' : ''}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusLabel label={c.paymentStatus} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusLabel label={c.verificationStatus} />
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">{c.appliedDate}</td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {verificationMode && c.verificationStatus !== 'Verified' && (
                          <button
                            onClick={() => updateVerification(c.id, 'Verified')}
                            className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCandidateId(c.id);
                            setDetailTab(verificationMode ? 'actions' : 'personal');
                          }}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Inspect
                        </button>
                      </div>
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
};
