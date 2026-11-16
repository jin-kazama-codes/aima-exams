import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Lock,
  RotateCcw,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { PageHeader, StatusLabel } from '../../components/ui/Common';
import { AreaTrendChart, DonutChart, HorizontalBarList } from '../../components/ui/Charts';

export const ReportsPage: React.FC = () => {
  const { campaigns, pushToast } = useAima();

  const downloadableReports = [
    { name: 'Recruitment Performance & Pipeline Conversion Summary', format: 'PDF / CSV', scope: 'All 2027 Cycles' },
    { name: 'Category-wise Reservation & Demographics Audit', format: 'XLSX', scope: 'DoPT Statutory Roster' },
    { name: 'Centre Utilisation & PwBD Ground-Floor Compliance', format: 'PDF', scope: '4 Nodal Cities' },
    { name: 'Biometric Attendance & Shift Turnout Report', format: 'CSV', scope: 'Shift 1 & Shift 2' },
    { name: 'Nodal Bank Reconciliation & Fee Ledger', format: 'XLSX', scope: '₹2.48 Cr Settled' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Institutional Analytics"
        subtitle="Cross-cycle recruitment performance, demographics, centre utilisation, and financial audits"
        actions={
          <button
            onClick={() => pushToast('Executive Report Pack Exported', 'AIMA_2027_MIS_Executive_Pack.pdf ready.', 'success')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Executive Pack
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Year-over-Year Application Growth (2023–2027)
            </h2>
            <BarChart3 className="w-4 h-4 text-blue-700" />
          </div>
          <AreaTrendChart
            primaryLabel="Applicants"
            data={[
              { label: '2023', value: 26400 },
              { label: '2024', value: 31200 },
              { label: '2025', value: 35800 },
              { label: '2026', value: 38900 },
              { label: '2027', value: campaigns.reduce((s, c) => s + c.applicationCount, 0) },
            ]}
          />
        </section>

        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
            Applicant Gender & Diversity Mix
          </h2>
          <DonutChart
            centerValue="44,440"
            centerLabel="Applicants"
            segments={[
              { label: 'Male Candidates', value: 26840, color: '#0B1F3A' },
              { label: 'Female Candidates', value: 17420, color: '#1D4ED8' },
              { label: 'PwBD Candidates', value: 180, color: '#D97706' },
            ]}
          />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
            Selection Ratio & Attendance Analytics (%)
          </h2>
          <HorizontalBarList
            unit=""
            items={[
              { label: 'Written Exam Attendance Rate', value: 89, max: 100, color: '#16A34A' },
              { label: 'Centre Hall Capacity Utilisation', value: 86, max: 100, color: '#1D4ED8' },
              { label: 'Document Verification First-Pass Yield', value: 92, max: 100, color: '#0B1F3A' },
              { label: 'Panel Interview Turnout', value: 96, max: 100, color: '#D97706' },
            ]}
          />
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
            Standard Statutory Report Downloads
          </h2>
          <div className="divide-y divide-slate-100">
            {downloadableReports.map((rep) => (
              <div key={rep.name} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-900">{rep.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {rep.scope} · Format: {rep.format}
                  </div>
                </div>
                <button
                  onClick={() => pushToast('Report Generated', `${rep.name} downloaded.`, 'success')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const UsersPermissionsPage: React.FC = () => {
  const { staffUsers, pushToast } = useAima();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Role-Based Permissions"
        subtitle="Manage MIS directorate officers, examination superintendents, and selection board access"
        actions={
          <button
            onClick={() => pushToast('Access Audit Verified', 'All 5 statutory roles comply with 2FA policy.', 'info')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Audit Role Matrix
          </button>
        }
      />

      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-700" />
          <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Authorized Directorate Accounts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-4 font-medium">Officer</th>
                <th className="py-2.5 px-3 font-medium">Statutory Role</th>
                <th className="py-2.5 px-3 font-medium">Department</th>
                <th className="py-2.5 px-3 font-medium">Permissions</th>
                <th className="py-2.5 px-3 font-medium">Last Active</th>
                <th className="py-2.5 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{u.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{u.email}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#0B1F3A]">{u.role}</td>
                  <td className="py-3 px-3 text-slate-600">{u.department}</td>
                  <td className="py-3 px-3 text-slate-600">{u.permissions.join(' · ')}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{u.lastActive}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusLabel label={u.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export const SystemSettingsPage: React.FC = () => {
  const { resetDemoData, pushToast } = useAima();
  const [settings, setSettings] = useState({
    biometricMandatory: true,
    digilockerAutoFetch: true,
    smsEmailAlerts: true,
    maskedRollInEvaluation: true,
    admitCardQrSigning: true,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings & Examination Governance"
        subtitle="Configure security controls, DigiLocker verification, and prototype dataset state"
        actions={
          <button
            onClick={resetDemoData}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Examination Security & Compliance Controls
            </h2>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {(
              [
                ['biometricMandatory', 'Mandatory Biometric Thumbprint Check-In at Exam Centres'],
                ['digilockerAutoFetch', 'Enable DigiLocker Verification Cross-Check during Scrutiny'],
                ['maskedRollInEvaluation', 'Mask Candidate Names During Answer Script Evaluation'],
                ['admitCardQrSigning', 'Sign E-Admit Cards with Tamper-Evident QR Hash'],
                ['smsEmailAlerts', 'Dispatch Automated SMS & Email Alerts on Stage Transitions'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="py-3 flex items-center justify-between gap-4 cursor-pointer">
                <span className="font-medium text-slate-800">{label}</span>
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => {
                    setSettings((s) => ({ ...s, [key]: e.target.checked }));
                    pushToast('Governance Setting Updated', label, 'info');
                  }}
                  className="w-4 h-4 accent-blue-700"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Nodal Organization Profile
            </h2>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-500">Recruiting Institution</div>
              <div className="font-semibold text-slate-900 mt-0.5">
                All India Management & Administration Authority (AIMA)
              </div>
            </div>
            <div>
              <div className="text-slate-500">Headquarters Address</div>
              <div className="text-slate-800 mt-0.5">
                14 Institutional Area, Lodhi Road, New Delhi - 110003
              </div>
            </div>
            <div>
              <div className="text-slate-500">Active Fiscal Recruitment Cycle</div>
              <div className="font-mono font-semibold text-blue-700 mt-0.5">
                AIMA-CYCLE-2027 (Local Prototype State Persisted)
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
