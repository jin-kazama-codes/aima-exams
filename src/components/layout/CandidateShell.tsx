import React, { useState } from 'react';
import {
  Award,
  Bell,
  Briefcase,
  CalendarClock,
  CreditCard,
  FileBadge2,
  FileCheck2,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Shield,
  User,
  UsersRound,
  X,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { CandidateNavKey } from '../../types/aima';
import { AimaCrest, CandidateAvatar } from '../ui/Common';

const CANDIDATE_NAV: {
  key: CandidateNavKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'c-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'c-notifications', label: 'Recruitment Notifications', icon: Bell },
  { key: 'c-applications', label: 'My Applications', icon: FolderOpen },
  { key: 'c-profile', label: 'My Profile', icon: User },
  { key: 'c-documents', label: 'Documents & KYC', icon: FileCheck2 },
  { key: 'c-payments', label: 'Payments & Receipts', icon: CreditCard },
  { key: 'c-admit-cards', label: 'Admit Cards', icon: FileBadge2 },
  { key: 'c-exam-details', label: 'Examination Details', icon: CalendarClock },
  { key: 'c-results', label: 'Results & Scorecards', icon: Award },
  { key: 'c-interviews', label: 'Interviews', icon: UsersRound },
  { key: 'c-appointment', label: 'Selection & Appointment', icon: Briefcase },
];

export const CandidateShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    candidateNav,
    setCandidateNav,
    setPortalMode,
    candidates,
    activeCandidateId,
    setActiveCandidateId,
  } = useAima();

  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCandidate =
    candidates.find((c) => c.id === activeCandidateId) ?? candidates[0];

  const SidebarBody = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      <div className="h-14 flex items-center px-4 border-b border-slate-200">
        <AimaCrest />
      </div>

      {/* Candidate Identity Card */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <CandidateAvatar src={activeCandidate.photoUrl} name={activeCandidate.name} size="md" />
          <div className="min-w-0">
            <div className="text-sm font-display font-bold text-[#0B1F3A] truncate">
              {activeCandidate.name}
            </div>
            <div className="text-[11px] font-mono text-slate-500 truncate">
              {activeCandidate.id}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-[10px] font-medium text-slate-500 mb-1">
            Preview Candidate Profile
          </label>
          <select
            value={activeCandidate.id}
            onChange={(e) => setActiveCandidateId(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 font-medium"
          >
            {candidates.slice(0, 5).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id.slice(-4)})
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2.5 space-y-0.5">
        {CANDIDATE_NAV.map((item) => {
          const Icon = item.icon;
          const active = candidateNav === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setCandidateNav(item.key);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#0B1F3A] text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#0B1F3A]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-300' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 space-y-2">
        <button
          onClick={() => {
            setMobileOpen(false);
            setPortalMode('home');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
        >
          <span>Examinations Home</span>
        </button>
        <button
          onClick={() => {
            setMobileOpen(false);
            setPortalMode('admin');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#0B1F3A] text-xs font-semibold transition-colors"
        >
          <Shield className="w-3.5 h-3.5 text-blue-700" />
          <span>Switch to Admin MIS Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F4F6F9]">
      <aside className="hidden lg:block w-[260px] shrink-0 sticky top-0 h-screen z-30">
        {SidebarBody}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-[265px] h-full shadow-xl">{SidebarBody}</div>
          <div className="flex-1 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white text-slate-800 shadow"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-xs sm:text-sm font-display font-bold text-[#0B1F3A] truncate">
              AIMA Candidate Portal
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden md:inline text-xs font-mono text-slate-500">
              Roll No: {activeCandidate.rollNumber}
            </span>
            <button
              onClick={() => setPortalMode('home')}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              Examinations Home
            </button>
            <button
              onClick={() => setPortalMode('admin')}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] whitespace-nowrap"
            >
              MIS / Admin Portal
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-[1280px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
