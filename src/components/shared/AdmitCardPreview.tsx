import React from 'react';
import { Download, Printer, ShieldCheck } from 'lucide-react';
import { CandidateApplication } from '../../types/aima';
import { AimaCrest, CandidateAvatar, QrCodeGraphic } from '../ui/Common';
import { useAima } from '../../context/AimaContext';

export const AdmitCardPreview: React.FC<{
  candidate: CandidateApplication;
  examTitle?: string;
  examDate?: string;
}> = ({ candidate, examTitle, examDate }) => {
  const { campaigns, centres, markAdmitCardDownloaded, pushToast } = useAima();
  const campaign = campaigns.find((c) => c.id === candidate.campaignId);
  const centre = centres.find((ctr) => ctr.id === candidate.allocatedCentreId);

  const handleDownloadPdf = () => {
    markAdmitCardDownloaded(candidate.id);
    pushToast(
      'E-Admit Card PDF Generated',
      `${candidate.rollNumber}_AdmitCard.pdf ready`,
      'success'
    );
  };

  return (
    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
      {/* Institutional Banner Header */}
      <div className="bg-[#0B1F3A] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-amber-500">
        <AimaCrest dark />
        <div className="text-left sm:text-right">
          <div className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
            Provisional E-Admit Card · Examination 2027
          </div>
          <div className="text-sm font-display font-bold">
            {examTitle ?? campaign?.title ?? 'AIMA Recruitment Examination 2027'}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-5">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Candidate & Exam Details */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-slate-500">Candidate Name</div>
              <div className="font-display font-bold text-sm text-[#0B1F3A] mt-0.5">
                {candidate.name}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Roll Number</div>
              <div className="font-mono font-bold text-sm text-blue-700 mt-0.5">
                {candidate.rollNumber}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Application Number</div>
              <div className="font-mono font-semibold text-slate-900 mt-0.5">
                {candidate.id}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Post Applied For</div>
              <div className="font-semibold text-slate-900 mt-0.5">{candidate.position}</div>
            </div>
            <div>
              <div className="text-slate-500">Category / PwBD</div>
              <div className="font-semibold text-slate-900 mt-0.5">
                {candidate.category} {candidate.pwbdRequired ? '· PwBD (Ground Floor)' : ''}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Date of Birth</div>
              <div className="font-mono text-slate-800 mt-0.5">{candidate.dob}</div>
            </div>
            <div>
              <div className="text-slate-500">Examination Date</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {examDate ?? campaign?.examDate ?? '2027-03-14'}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Shift & Reporting</div>
              <div className="font-mono font-semibold text-slate-900 mt-0.5">
                {candidate.preferredShift} · Report 08:00 AM
              </div>
            </div>
            <div>
              <div className="text-slate-500">Gate Closing Time</div>
              <div className="font-mono font-bold text-red-700 mt-0.5">09:00 AM Sharp</div>
            </div>
          </div>

          {/* Photo & QR Verification Block */}
          <div className="flex items-start gap-4 shrink-0">
            <div className="text-center">
              <CandidateAvatar src={candidate.photoUrl} name={candidate.name} size="xl" />
              <div className="mt-1.5 px-2 py-0.5 border border-slate-200 rounded text-[10px] font-mono text-slate-600 bg-slate-50">
                {candidate.name.split(' ')[0]}_Sign
              </div>
            </div>
            <div className="text-center">
              <QrCodeGraphic value={`${candidate.rollNumber}|${candidate.id}|${candidate.allocatedSeat ?? 'UNASSIGNED'}`} size={92} />
              <div className="text-[10px] font-mono text-slate-500 mt-1">QR Verified</div>
            </div>
          </div>
        </div>

        {/* Venue & Seat Box */}
        <div className="border border-slate-200 rounded-lg bg-slate-50 p-4 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          <div className="md:col-span-6">
            <div className="text-slate-500 font-medium">Allotted Examination Centre & Address</div>
            <div className="font-display font-bold text-sm text-[#0B1F3A] mt-0.5">
              {candidate.allocatedCentreName ?? 'Pending Centre Allocation'}
            </div>
            <div className="text-slate-600 mt-0.5">
              {centre?.address ?? `${candidate.allocatedCity ?? candidate.preferredCity} Examination Hub`}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-slate-500 font-medium">Building</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {candidate.allocatedBuilding ?? '-'}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-slate-500 font-medium">Floor & Hall</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {candidate.allocatedFloor ?? '-'} ·{' '}
              <span className="font-mono text-blue-700">{candidate.allocatedHallCode ?? '-'}</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-slate-500 font-medium">Seat Number</div>
            <div className="font-mono text-xl font-bold text-[#0B1F3A] mt-0.5">
              {candidate.allocatedSeat ?? '--'}
            </div>
          </div>
        </div>

        {/* Statutory Instructions */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0B1F3A] mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Important Examination Instructions</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] text-slate-600 list-disc pl-4">
            <li>Bring this printed E-Admit Card along with an original Government Photo ID (Aadhaar / Passport / PAN).</li>
            <li>Biometric thumbprint and photograph verification will be completed prior to hall entry.</li>
            <li>No candidate shall be permitted inside the centre after gate closing time (09:00 AM for Shift 1).</li>
            <li>Calculators, mobile phones, smartwatches, and electronic communication devices are strictly prohibited.</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="text-[11px] text-slate-500 font-mono">
            Digitally Signed by Controller of Examinations · AIMA
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download E-Admit Card PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
