import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarClock,
  CheckSquare,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileBadge2,
  FileCheck2,
  FileSpreadsheet,
  FolderKanban,
  Grid3X3,
  Landmark,
  LayoutDashboard,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { AdminNavKey } from '../../types/aima';
import { AimaCrest, CandidateAvatar } from '../ui/Common';
import { PORTRAITS } from '../../data/mockData';

interface NavGroup {
  group: string;
  items: { key: AdminNavKey; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    group: 'Overview',
    items: [{ key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    group: 'Recruitment',
    items: [
      { key: 'campaigns', label: 'Recruitment Campaigns', icon: FolderKanban },
      { key: 'positions', label: 'Positions & Vacancies', icon: Briefcase },
      { key: 'applications', label: 'Applications', icon: Users },
      { key: 'verification', label: 'Candidate Verification', icon: UserCheck },
    ],
  },
  {
    group: 'Examination',
    items: [
      { key: 'exam-planning', label: 'Examination Planning', icon: CalendarClock },
      { key: 'exam-centres', label: 'Examination Centres', icon: Building2 },
      { key: 'centre-allocation', label: 'Centre Allocation', icon: Landmark },
      { key: 'seat-allocation', label: 'Seat Allocation Map', icon: Grid3X3 },
      { key: 'admit-cards', label: 'Admit Cards', icon: FileBadge2 },
      { key: 'attendance', label: 'Attendance Management', icon: CheckSquare },
    ],
  },
  {
    group: 'Assessment',
    items: [
      { key: 'aptitude-tests', label: 'Aptitude Tests', icon: ClipboardCheck },
      { key: 'answer-evaluation', label: 'Answer Evaluation', icon: FileCheck2 },
      { key: 'results', label: 'Results & Merit Lists', icon: Award },
    ],
  },
  {
    group: 'Selection',
    items: [
      { key: 'interview-management', label: 'Interview Management', icon: UsersRound },
      { key: 'ai-interviews', label: 'AI Interviews', icon: Sparkles },
      { key: 'final-selection', label: 'Final Selection', icon: ShieldCheck },
    ],
  },
  {
    group: 'Appointment',
    items: [
      { key: 'appointment-letters', label: 'Appointment Letters', icon: FileBadge2 },
      { key: 'department-allocation', label: 'Department Allocation', icon: Briefcase },
      { key: 'posting-joining', label: 'Posting & Joining', icon: MapPin },
    ],
  },
  {
    group: 'Finance',
    items: [
      { key: 'payments', label: 'Payments', icon: CreditCard },
      { key: 'reconciliation', label: 'Reconciliation', icon: FileSpreadsheet },
    ],
  },
  {
    group: 'Reporting',
    items: [{ key: 'reports', label: 'Reports & Analytics', icon: BarChart3 }],
  },
  {
    group: 'Administration',
    items: [
      { key: 'users-permissions', label: 'Users & Permissions', icon: Users },
      { key: 'system-settings', label: 'System Settings', icon: Settings },
    ],
  },
];

export const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    adminNav,
    setAdminNav,
    setPortalMode,
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    globalSearch,
    setGlobalSearch,
    activityLogs,
  } = useAima();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const currentMeta = (() => {
    for (const g of ADMIN_NAV_GROUPS) {
      const found = g.items.find((i) => i.key === adminNav);
      if (found) return { group: g.group, label: found.label };
    }
    return { group: 'Overview', label: 'Dashboard' };
  })();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      setAdminNav('applications');
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1F3A] text-slate-200 select-none">
      <div className={`h-14 flex items-center border-b border-white/10 px-3.5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <AimaCrest dark compact={collapsed} />
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:inline-flex p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="hidden lg:flex justify-center py-2 border-b border-white/10">
          <button
            onClick={() => setCollapsed(false)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {ADMIN_NAV_GROUPS.map((grp) => (
          <div key={grp.group}>
            {!collapsed && (
              <div className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {grp.group}
              </div>
            )}
            <div className="space-y-0.5">
              {grp.items.map((item) => {
                const Icon = item.icon;
                const active = adminNav === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setAdminNav(item.key);
                      setMobileOpen(false);
                    }}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-blue-700 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-white/8'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-300' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setPortalMode('candidate')}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/25 text-xs font-semibold transition-colors whitespace-nowrap ${
            collapsed ? 'px-1.5' : ''
          }`}
        >
          <UsersRound className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Switch to Candidate Portal</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F4F6F9]">
      {/* Desktop Fixed Collapsible Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-200 z-30 ${
          collapsed ? 'w-[72px]' : 'w-[252px]'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-[260px] h-full shadow-xl">{SidebarContent}</div>
          <div
            className="flex-1 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white text-slate-800 shadow"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Compact Top Navigation Bar */}
        <header className="sticky top-0 z-20 h-14 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
              <span className="font-medium text-slate-600">AIMA MIS</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentMeta.group}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-[#0B1F3A]">{currentMeta.label}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Global Search */}
            <div className="relative hidden md:block w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search ID, name, roll no..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Recruitment Campaign Selector */}
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              aria-label="Recruitment Campaign"
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-600 max-w-[200px]"
            >
              <option value="ALL">All 2027 Recruitments</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.shortTitle}
                </option>
              ))}
            </select>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-mono flex items-center justify-center">
                  {Math.min(activityLogs.length, 9)}
                </span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-40">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-[#0B1F3A]">Operational Notifications</span>
                    <button onClick={() => setNotifOpen(false)} className="text-xs text-slate-400 hover:text-slate-700">
                      Close
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="py-2.5 text-xs">
                        <div className="font-medium text-slate-800">{log.action}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {log.module} · {log.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Home & Candidate Portal Quick Switch */}
            <button
              onClick={() => setPortalMode('home')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              Examinations Home
            </button>
            <button
              onClick={() => setPortalMode('candidate')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] transition-colors whitespace-nowrap shrink-0"
            >
              Candidate Portal
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <CandidateAvatar src={PORTRAITS.admin} name="Dr. Arvind Narayanan" size="sm" />
              <div className="hidden xl:block leading-tight">
                <div className="text-xs font-semibold text-slate-800">Dr. Arvind Narayanan</div>
                <div className="text-[11px] text-slate-500">Controller of Exams</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
