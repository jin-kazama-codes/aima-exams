import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Info,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { ReservationCategory } from '../../types/aima';
import { PORTRAITS } from '../../data/mockData';

const PARTS = [
  { part: 'Part I', title: 'Identity, Community & Photo ID' },
  { part: 'Part I', title: 'Qualification & Address' },
  { part: 'Part II', title: 'Centre Choice & Uploads' },
  { part: 'Part II', title: 'Summary, Fee & Declaration' },
];

const INDIAN_STATES = [
  'Delhi (NCT)',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Telangana',
  'Kerala',
];

export const MultiStepApplicationForm: React.FC<{
  initialCampaignId?: string;
  onComplete: (newAppId: string) => void;
  onCancel: () => void;
}> = ({ initialCampaignId, onComplete, onCancel }) => {
  const { campaigns, submitNewCandidateApplication } = useAima();

  const defaultCp =
    campaigns.find((c) => c.id === initialCampaignId) ?? campaigns[0];

  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    campaignId: defaultCp.id,
    position: defaultCp.reservationMatrix[0]?.position ?? 'Administrative Officer',
    // Part I - Identity (OTR style)
    name: 'Rahul Sharma',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '1999-07-18',
    fatherName: 'Rajeshwar Prasad Sharma',
    motherName: 'Sunita Sharma',
    nationality: 'Citizen of India',
    maritalStatus: 'Unmarried',
    photoIdType: 'Aadhaar Card',
    photoIdNumber: 'XXXX-XXXX-4821',
    // Part I - Community & PwBD
    category: 'General' as ReservationCategory,
    categoryCertNo: '',
    categoryCertDate: '',
    pwbdRequired: false,
    pwbdType: 'Locomotor Disability (OH)',
    scribeRequired: false,
    // Part I - Education & Experience
    matricBoard: 'CBSE (Central Board of Secondary Education)',
    matricYear: '2015',
    qualifyingStatus: 'Passed',
    degree: 'Master of Public Policy',
    institution: 'Delhi School of Economics, University of Delhi',
    gradYear: '2023',
    percentage: '76.4%',
    experienceYears: 3,
    currentOrg: 'National Institute of Administrative Research',
    // Part I - Contact & Address
    email: 'rahul.sharma@alumni.du.ac.in',
    phone: '+91 98114 56290',
    addressLine: 'B-42, Sector 15, Rohini',
    city: 'New Delhi',
    state: 'Delhi (NCT)',
    pincode: '110085',
    // Part II - Exam Centres & Uploads
    preferredCity: 'New Delhi',
    backupCity: 'Mumbai',
    preferredShift: 'Shift 1 (09:30 AM)' as 'Shift 1 (09:30 AM)' | 'Shift 2 (02:30 PM)',
    photoFile: 'rahul_passport_35x45mm.jpg',
    signFile: 'rahul_signature_black_ink.jpg',
    idProofFile: 'aadhaar_masked_kyc.pdf',
    degreeFile: 'mpp_consolidated_marksheet.pdf',
    // Part II - Payment & Declaration
    paymentGateway: 'SBI ePay (NetBanking / Card / UPI)',
    declarationAccepted: false,
  });

  const activeCampaign =
    campaigns.find((c) => c.id === form.campaignId) ?? campaigns[0];

  const isFeeExempted =
    form.category !== 'General' || form.pwbdRequired || form.gender === 'Female';
  const payableFee = isFeeExempted
    ? activeCampaign.feeReserved
    : activeCampaign.feeGeneral;

  const validateStep = (idx: number): boolean => {
    setErrorMsg(null);
    if (idx === 0) {
      if (!form.name.trim() || !form.fatherName.trim() || !form.motherName.trim() || !form.photoIdNumber.trim()) {
        setErrorMsg('Please complete all mandatory Part I identity fields marked with (*).');
        return false;
      }
      if (form.category !== 'General' && !form.categoryCertNo.trim()) {
        setErrorMsg(`Please enter your ${form.category} Certificate Number as required for reserved category claims.`);
        return false;
      }
    }
    if (idx === 1) {
      if (!form.email.trim() || !form.phone.trim() || !form.addressLine.trim() || !/^\d{6}$/.test(form.pincode.trim())) {
        setErrorMsg('Please provide valid contact details, address, and a 6-digit PIN code.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(PARTS.length - 1, s + 1));
    }
  };

  const handleSubmit = () => {
    if (!form.declarationAccepted) {
      setErrorMsg('You must accept the statutory declaration before final submission.');
      return;
    }
    setErrorMsg(null);
    const newId = submitNewCandidateApplication({
      campaignId: form.campaignId,
      position: form.position,
      name: form.name,
      fatherName: form.fatherName,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      dob: form.dob,
      address: form.addressLine,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      preferredCity: form.preferredCity,
      preferredShift: form.preferredShift,
      category: form.category,
      pwbdRequired: form.pwbdRequired,
      degree: form.degree,
      institution: form.institution,
      percentage: form.percentage,
      experienceYears: form.experienceYears,
      currentOrg: form.currentOrg,
    });
    onComplete(newId);
  };

  const handleFileChange = (
    field: 'photoFile' | 'signFile' | 'idProofFile' | 'degreeFile',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, [field]: file.name }));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* UPSC-Style Institutional Form Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono font-semibold text-blue-700 uppercase tracking-wide">
            {PARTS[step].part} · Step {step + 1} of {PARTS.length}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] mt-0.5">
            {activeCampaign.title} — Application Form
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 underline self-start sm:self-auto"
        >
          Close Form
        </button>
      </div>

      {/* Clean 4-Stage Part I / Part II Step Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-200 bg-white">
        {PARTS.map((p, idx) => {
          const active = idx === step;
          const done = idx < step;
          return (
            <button
              key={p.title}
              onClick={() => {
                if (idx < step || validateStep(step)) setStep(idx);
              }}
              className={`text-left px-4 py-3 border-b-2 transition-colors ${
                active
                  ? 'border-blue-700 bg-blue-50/40'
                  : done
                  ? 'border-emerald-600 bg-emerald-50/20'
                  : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={active ? 'text-blue-700 font-semibold' : done ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                  {p.part} · 0{idx + 1}
                </span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className={`text-xs font-semibold mt-0.5 truncate ${active ? 'text-[#0B1F3A]' : 'text-slate-700'}`}>
                {p.title}
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-6 space-y-6">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
            {errorMsg}
          </div>
        )}

        {/* STAGE 1: PART I — IDENTITY, COMMUNITY & PHOTO ID */}
        {step === 0 && (
          <div className="space-y-6 text-xs">
            {/* Section A: Examination Selection */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide pb-1.5 border-b border-slate-200">
                1. Examination & Cadre Applied For
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Examination Notification <span className="text-red-600">*</span>
                  </label>
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
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Cadre / Post Preference <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900"
                  >
                    {activeCampaign.reservationMatrix.map((r) => (
                      <option key={r.position} value={r.position}>
                        {r.position} ({r.payLevel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section B: OTR Personal Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide">
                  2. Candidate Personal Profile (As per Matriculation Certificate)
                </span>
                <span className="text-[11px] text-slate-500">Do not use Shri / Smt / Dr</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Candidate Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Gender <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value as 'Male' | 'Female' | 'Other' })
                    }
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Transgender / Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Date of Birth <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Father&apos;s Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fatherName}
                    onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Mother&apos;s Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.motherName}
                    onChange={(e) => setForm({ ...form, motherName: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nationality</label>
                    <select
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                      className="w-full border border-slate-300 rounded-md px-2.5 py-2 bg-white"
                    >
                      <option value="Citizen of India">Indian</option>
                      <option value="Subject of Nepal/Bhutan">Nepal / Bhutan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Marital Status</label>
                    <select
                      value={form.maritalStatus}
                      onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                      className="w-full border border-slate-300 rounded-md px-2.5 py-2 bg-white"
                    >
                      <option value="Unmarried">Unmarried</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Photo Identity & Community */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide pb-1.5 border-b border-slate-200">
                3. Photo Identity Card, Community & PwBD Reservation
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Photo Identity Card <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.photoIdType}
                    onChange={(e) => setForm({ ...form, photoIdType: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Voter ID (EPIC)">Voter ID (EPIC)</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Driving Licence">Driving Licence</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Photo ID Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.photoIdNumber}
                    onChange={(e) => setForm({ ...form, photoIdNumber: e.target.value })}
                    placeholder="Carry same original ID to exam hall"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Community / Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as ReservationCategory })
                    }
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="General">General (Unreserved)</option>
                    <option value="OBC-NCL">OBC (Non-Creamy Layer)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>

                {form.category !== 'General' && (
                  <>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        {form.category} Certificate Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.categoryCertNo}
                        onChange={(e) => setForm({ ...form, categoryCertNo: e.target.value })}
                        placeholder="e.g. DL/REV/2026/88412"
                        className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Certificate Date of Issue
                      </label>
                      <input
                        type="date"
                        value={form.categoryCertDate}
                        onChange={(e) => setForm({ ...form, categoryCertDate: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.pwbdRequired}
                    onChange={(e) => setForm({ ...form, pwbdRequired: e.target.checked })}
                    className="w-4 h-4 accent-blue-700"
                  />
                  <span className="font-medium text-slate-800">
                    Person with Benchmark Disability (PwBD ≥ 40%) — Requires Ground-Floor Hall
                  </span>
                </label>

                {form.pwbdRequired && (
                  <div className="flex flex-wrap items-center gap-4">
                    <select
                      value={form.pwbdType}
                      onChange={(e) => setForm({ ...form, pwbdType: e.target.value })}
                      className="border border-slate-300 rounded-md px-2.5 py-1.5 bg-white"
                    >
                      <option value="Locomotor Disability (OH)">Locomotor Disability (OH)</option>
                      <option value="Visual Impairment (VI)">Visual Impairment (VI)</option>
                      <option value="Hearing Impairment (HI)">Hearing Impairment (HI)</option>
                    </select>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.scribeRequired}
                        onChange={(e) => setForm({ ...form, scribeRequired: e.target.checked })}
                        className="w-4 h-4 accent-blue-700"
                      />
                      <span>Require Scribe Assistance</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: PART I — QUALIFICATION, EXPERIENCE & ADDRESS */}
        {step === 1 && (
          <div className="space-y-6 text-xs">
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide pb-1.5 border-b border-slate-200">
                4. Educational Qualification & Service Experience
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Matriculation (10th) Examination Board
                  </label>
                  <input
                    type="text"
                    value={form.matricBoard}
                    onChange={(e) => setForm({ ...form, matricBoard: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    10th Passing Year
                  </label>
                  <input
                    type="text"
                    value={form.matricYear}
                    onChange={(e) => setForm({ ...form, matricYear: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Qualifying Degree Status <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.qualifyingStatus}
                    onChange={(e) => setForm({ ...form, qualifyingStatus: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="Passed">Already Passed Degree</option>
                    <option value="Appearing">Final Year / Appearing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Degree / Qualification Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Marks / CGPA (%) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.percentage}
                    onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    University / Institution Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Passing Year
                  </label>
                  <input
                    type="text"
                    value={form.gradYear}
                    onChange={(e) => setForm({ ...form, gradYear: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Work Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Current / Last Employer Organization
                  </label>
                  <input
                    type="text"
                    value={form.currentOrg}
                    onChange={(e) => setForm({ ...form, currentOrg: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide pb-1.5 border-b border-slate-200">
                5. Contact Details & Permanent Address
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Email Address (OTR Verified) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    State / Union Territory <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    House No., Street / Locality <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.addressLine}
                    onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      City / District <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full border border-slate-300 rounded-md px-2.5 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      PIN Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="w-full border border-slate-300 rounded-md px-2.5 py-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: PART II — EXAM CENTRE PREFERENCES & SCANNED UPLOADS */}
        {step === 2 && (
          <div className="space-y-6 text-xs">
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide pb-1.5 border-b border-slate-200">
                6. Examination Centre & Shift Preferences
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Centre Choice 1 (Primary) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={form.preferredCity}
                    onChange={(e) => setForm({ ...form, preferredCity: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    {['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai'].map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Centre Choice 2 (Alternate)
                  </label>
                  <select
                    value={form.backupCity}
                    onChange={(e) => setForm({ ...form, backupCity: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    {['Mumbai', 'New Delhi', 'Bengaluru', 'Chennai'].map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Preferred Examination Shift
                  </label>
                  <select
                    value={form.preferredShift}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        preferredShift: e.target.value as 'Shift 1 (09:30 AM)' | 'Shift 2 (02:30 PM)',
                      })
                    }
                    className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="Shift 1 (09:30 AM)">Shift 1 (09:30 AM)</option>
                    <option value="Shift 2 (02:30 PM)">Shift 2 (02:30 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide">
                  7. Photograph, Signature & Photo ID Upload (Part II)
                </span>
                <span className="text-[11px] text-slate-500">JPG 20–300 KB · PDF ≤ 1 MB</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={form.gender === 'Female' ? PORTRAITS.priya : PORTRAITS.rahul}
                      alt="Candidate passport preview"
                      className="w-14 h-16 rounded border border-slate-300 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">Passport Photograph (3.5×4.5 cm)</div>
                      <div className="font-mono text-[11px] text-emerald-700 truncate mt-0.5">
                        {form.photoFile}
                      </div>
                    </div>
                  </div>
                  <label className="px-3 py-1.5 rounded-md border border-slate-300 font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer inline-flex items-center justify-center gap-1 shrink-0 self-start sm:self-center">
                    <Upload className="w-3.5 h-3.5" /> Replace
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('photoFile', e)} />
                  </label>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900">Scanned Signature (Black Ink)</div>
                    <div className="mt-1 px-3 py-1.5 border border-dashed border-slate-300 rounded bg-slate-50 font-mono text-slate-700 truncate">
                      {form.name}
                    </div>
                    <div className="font-mono text-[11px] text-emerald-700 truncate mt-1">
                      {form.signFile}
                    </div>
                  </div>
                  <label className="px-3 py-1.5 rounded-md border border-slate-300 font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer inline-flex items-center justify-center gap-1 shrink-0 self-start sm:self-center">
                    <Upload className="w-3.5 h-3.5" /> Replace
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('signFile', e)} />
                  </label>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">{form.photoIdType} (PDF)</div>
                    <div className="font-mono text-[11px] text-emerald-700 truncate mt-0.5">
                      {form.idProofFile}
                    </div>
                  </div>
                  <label className="px-3 py-1.5 rounded-md border border-slate-300 font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer inline-flex items-center justify-center gap-1 shrink-0 self-start sm:self-center">
                    <Upload className="w-3.5 h-3.5" /> Upload PDF
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange('idProofFile', e)} />
                  </label>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">Qualifying Degree Marksheet (PDF)</div>
                    <div className="font-mono text-[11px] text-emerald-700 truncate mt-0.5">
                      {form.degreeFile}
                    </div>
                  </div>
                  <label className="px-3 py-1.5 rounded-md border border-slate-300 font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer inline-flex items-center justify-center gap-1 shrink-0 self-start sm:self-center">
                    <Upload className="w-3.5 h-3.5" /> Upload PDF
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange('degreeFile', e)} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: PART II — VERIFICATION SUMMARY, FEE & STATUTORY DECLARATION */}
        {step === 3 && (
          <div className="space-y-5 text-xs">
            <div className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide pb-1.5 border-b border-slate-200">
              8. Pre-Submission Summary, Fee Payment & Declaration
            </div>

            {/* Structured UPSC-style Verification Grid */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-slate-500">Examination & Post</div>
                <div className="font-semibold text-slate-900 mt-0.5">{activeCampaign.title} · {form.position}</div>
              </div>
              <div>
                <div className="text-slate-500">Candidate Name</div>
                <div className="font-semibold text-slate-900 mt-0.5">{form.name}</div>
              </div>
              <div>
                <div className="text-slate-500">Father&apos;s / Mother&apos;s Name</div>
                <div className="text-slate-800 mt-0.5">{form.fatherName} / {form.motherName}</div>
              </div>
              <div>
                <div className="text-slate-500">Date of Birth & Gender</div>
                <div className="font-mono text-slate-800 mt-0.5">{form.dob} ({form.gender})</div>
              </div>
              <div>
                <div className="text-slate-500">Community / PwBD</div>
                <div className="text-slate-800 mt-0.5">{form.category} {form.pwbdRequired ? `· PwBD (${form.pwbdType})` : ''}</div>
              </div>
              <div>
                <div className="text-slate-500">Photo Identity</div>
                <div className="font-mono text-slate-800 mt-0.5">{form.photoIdType}: {form.photoIdNumber}</div>
              </div>
              <div>
                <div className="text-slate-500">Qualification & Experience</div>
                <div className="text-slate-800 mt-0.5">{form.degree} ({form.percentage}) · {form.experienceYears} yrs exp</div>
              </div>
              <div>
                <div className="text-slate-500">Centre Choice 1 & 2</div>
                <div className="font-semibold text-blue-700 mt-0.5">{form.preferredCity} (Backup: {form.backupCity})</div>
              </div>
            </div>

            {/* Fee Calculation & Payment Gateway */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div>
                <div className="text-slate-500">Applicable Examination Fee</div>
                <div className="text-xl font-bold text-[#0B1F3A] font-mono mt-0.5">
                  ₹{payableFee.toLocaleString('en-IN')}.00
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-700" />
                  {isFeeExempted
                    ? 'Concessional / Reserved category fee applied.'
                    : 'Standard Unreserved male candidate fee.'}
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={form.paymentGateway}
                  onChange={(e) => setForm({ ...form, paymentGateway: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value="SBI ePay (NetBanking / Card / UPI)">SBI ePay (NetBanking / Card / UPI)</option>
                  <option value="UPI / BHIM Instant">UPI / BHIM Instant</option>
                  <option value="Razorpay Gov Treasury">Razorpay Gov Treasury</option>
                </select>
              </div>
            </div>

            {/* Statutory Declaration */}
            <label className="flex items-start gap-2.5 p-4 border border-amber-200 bg-amber-50/50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={form.declarationAccepted}
                onChange={(e) => setForm({ ...form, declarationAccepted: e.target.checked })}
                className="w-4 h-4 accent-blue-700 mt-0.5 shrink-0"
              />
              <span className="text-slate-700 leading-relaxed">
                <strong>Declaration:</strong> I hereby declare that all statements made in this application are true, complete, and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or ineligible at any stage, my candidature is liable to be cancelled by AIMA.
              </span>
            </label>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                Pay ₹{payableFee} & Final Submit Application
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Step Controls */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => {
            setErrorMsg(null);
            setStep((s) => Math.max(0, s - 1));
          }}
          disabled={step === 0}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-slate-700 disabled:opacity-40 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>OTR-Compliant Registration Workflow</span>
        </div>

        {step < PARTS.length - 1 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1"
          >
            Save & Continue <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
