import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Upload,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { ReservationCategory } from '../../types/aima';
import { PORTRAITS } from '../../data/mockData';

const STEPS = [
  'Personal Information',
  'Contact Information',
  'Category & Eligibility',
  'Educational Qualification',
  'Experience',
  'Photograph & Signature',
  'KYC & Certificates',
  'Review & Payment',
];

export const MultiStepApplicationForm: React.FC<{
  initialCampaignId?: string;
  onComplete: (newAppId: string) => void;
  onCancel: () => void;
}> = ({ initialCampaignId, onComplete, onCancel }) => {
  const { campaigns, submitNewCandidateApplication } = useAima();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    campaignId: initialCampaignId ?? campaigns[2]?.id ?? campaigns[0].id,
    position: 'Systems & Cloud Officer',
    name: 'Rahul Sharma',
    dob: '1999-07-18',
    fatherName: 'Rajeshwar Prasad Sharma',
    email: 'rahul.sharma@alumni.du.ac.in',
    phone: '+91 98114 56290',
    city: 'New Delhi',
    address: 'B-42, Sector 15, Rohini',
    category: 'General' as ReservationCategory,
    pwbdRequired: false,
    preferredCity: 'New Delhi',
    preferredShift: 'Shift 1 (09:30 AM)' as 'Shift 1 (09:30 AM)' | 'Shift 2 (02:30 PM)',
    degree: 'Master of Public Policy',
    institution: 'Delhi School of Economics',
    percentage: '76.4%',
    experienceYears: 3,
    photoUploaded: true,
    signUploaded: true,
    kycUploaded: true,
    degreeUploaded: true,
  });

  const activeCampaign = campaigns.find((c) => c.id === form.campaignId) ?? campaigns[0];
  const feeAmount = form.category === 'General' ? activeCampaign.feeGeneral : activeCampaign.feeReserved;

  const handleSubmit = () => {
    const newId = submitNewCandidateApplication({
      campaignId: form.campaignId,
      position: form.position,
      name: form.name,
      email: form.email,
      phone: form.phone,
      dob: form.dob,
      city: form.city,
      preferredCity: form.preferredCity,
      preferredShift: form.preferredShift,
      category: form.category,
      pwbdRequired: form.pwbdRequired,
      degree: form.degree,
      institution: form.institution,
      percentage: form.percentage,
      experienceYears: form.experienceYears,
    });
    onComplete(newId);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-blue-700 font-semibold">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </div>
          <h2 className="text-lg font-display font-bold text-[#0B1F3A] mt-0.5">
            Online Recruitment Application Form
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline self-start sm:self-auto"
        >
          Cancel & Return
        </button>
      </div>

      {/* Stepper Indicator */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {STEPS.map((label, idx) => (
          <button
            key={label}
            onClick={() => setStep(idx)}
            className={`text-left p-2 rounded-lg border text-[11px] transition-colors ${
              idx === step
                ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                : idx < step
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <div className="font-mono font-bold">{String(idx + 1).padStart(2, '0')}</div>
            <div className="truncate mt-0.5 font-medium">{label.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[240px]">
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Recruitment Notification</label>
              <select
                value={form.campaignId}
                onChange={(e) => {
                  const cp = campaigns.find((c) => c.id === e.target.value);
                  setForm({
                    ...form,
                    campaignId: e.target.value,
                    position: cp?.reservationMatrix[0]?.position ?? 'Officer',
                  });
                }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Post Applied For</label>
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium"
              >
                {activeCampaign.reservationMatrix.map((r) => (
                  <option key={r.position} value={r.position}>
                    {r.position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Candidate Full Name (as per 10th Certificate)</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Mobile Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Correspondence Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Reservation Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ReservationCategory })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium"
              >
                {(['General', 'OBC-NCL', 'SC', 'ST', 'EWS'] as const).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Preferred Examination City</label>
              <select
                value={form.preferredCity}
                onChange={(e) => setForm({ ...form, preferredCity: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium"
              >
                {['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai'].map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Preferred Shift</label>
              <select
                value={form.preferredShift}
                onChange={(e) =>
                  setForm({ ...form, preferredShift: e.target.value as 'Shift 1 (09:30 AM)' | 'Shift 2 (02:30 PM)' })
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium"
              >
                <option value="Shift 1 (09:30 AM)">Shift 1 (09:30 AM)</option>
                <option value="Shift 2 (02:30 PM)">Shift 2 (02:30 PM)</option>
              </select>
            </div>
            <label className="flex items-center gap-2.5 pt-5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.pwbdRequired}
                onChange={(e) => setForm({ ...form, pwbdRequired: e.target.checked })}
                className="w-4 h-4 accent-blue-700"
              />
              <span className="font-medium text-slate-800">
                Require PwBD Ground-Floor Examination Accommodation
              </span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Highest Qualifying Degree</label>
              <input
                type="text"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Institution / University</label>
              <input
                type="text"
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Aggregate Percentage / CGPA</label>
              <input
                type="text"
                value={form.percentage}
                onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Relevant Work Experience (Years)</label>
              <input
                type="number"
                min={0}
                max={20}
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono"
              />
            </div>
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-600">
              Prior public-sector or institutional administration experience is verified during document scrutiny prior to interview shortlisting.
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={PORTRAITS.rahul}
                  alt="Candidate portrait"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <div className="font-semibold text-slate-900">Passport Photograph</div>
                  <div className="text-slate-500">JPG · 48 KB · 200×230px verified</div>
                </div>
              </div>
              <button
                onClick={() => setForm({ ...form, photoUploaded: true })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Re-upload
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-900">Scanned Signature</div>
                <div className="mt-1 px-3 py-2 border border-dashed border-slate-300 rounded bg-slate-50 font-mono text-slate-700">
                  {form.name} (Verified Specimen)
                </div>
              </div>
              <button
                onClick={() => setForm({ ...form, signUploaded: true })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Re-upload
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3 text-xs">
            {[
              { key: 'kycUploaded', title: 'Government Photo ID (Aadhaar / Passport)', size: '412 KB PDF' },
              { key: 'degreeUploaded', title: `${form.degree} Consolidated Marksheet & Certificate`, size: '840 KB PDF' },
            ].map((doc) => (
              <div key={doc.key} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{doc.title}</div>
                  <div className="text-slate-500">{doc.size} · Ready for submission</div>
                </div>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Attached
                </span>
              </div>
            ))}
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <div className="text-slate-500">Campaign</div>
                <div className="font-semibold text-slate-900">{activeCampaign.shortTitle}</div>
              </div>
              <div>
                <div className="text-slate-500">Position</div>
                <div className="font-semibold text-slate-900">{form.position}</div>
              </div>
              <div>
                <div className="text-slate-500">Candidate & Category</div>
                <div className="font-semibold text-slate-900">{form.name} ({form.category})</div>
              </div>
              <div>
                <div className="text-slate-500">Exam City Preference</div>
                <div className="font-semibold text-slate-900">{form.preferredCity}</div>
              </div>
            </div>

            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-slate-600">Applicable Examination Fee ({form.category})</div>
                <div className="text-xl font-display font-bold text-[#0B1F3A] font-mono mt-0.5">
                  ₹{feeAmount.toLocaleString('en-IN')}.00
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-amber-300" /> Confirm Fee Payment & Submit Application
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 disabled:opacity-40 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous Step
        </button>

        {step < STEPS.length - 1 && (
          <button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1"
          >
            Save & Continue <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
