/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AimaProvider, useAima } from './context/AimaContext';
import { AdminShell } from './components/layout/AdminShell';
import { CandidateShell } from './components/layout/CandidateShell';
import { ToastContainer } from './components/ui/Common';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CampaignsPage } from './pages/admin/CampaignsPage';
import { ApplicationsPage } from './pages/admin/ApplicationsPage';
import { ExamPlanningPage } from './pages/admin/ExamPlanningPage';
import { CentreAllocationPage } from './pages/admin/CentreAllocationPage';
import { SeatAllocationPage } from './pages/admin/SeatAllocationPage';
import { AdmitCardsPage } from './pages/admin/AdmitCardsPage';
import { AttendancePage } from './pages/admin/AttendancePage';
import { AssessmentPages } from './pages/admin/AssessmentPages';
import { SelectionPages } from './pages/admin/SelectionPages';
import { AppointmentPages } from './pages/admin/AppointmentPages';
import { FinancePages } from './pages/admin/FinancePages';
import {
  ReportsPage,
  SystemSettingsPage,
  UsersPermissionsPage,
} from './pages/admin/ReportsAndAdminPages';
import { CandidatePortal } from './pages/candidate/CandidatePortal';
import { PublicHomePage } from './pages/PublicHomePage';

const AdminRouter: React.FC = () => {
  const { adminNav } = useAima();

  switch (adminNav) {
    case 'dashboard':
      return <AdminDashboard />;
    case 'campaigns':
      return <CampaignsPage initialMode="campaigns" />;
    case 'positions':
      return <CampaignsPage initialMode="positions" />;
    case 'applications':
      return <ApplicationsPage verificationMode={false} />;
    case 'verification':
      return <ApplicationsPage verificationMode={true} />;
    case 'exam-planning':
      return <ExamPlanningPage mode="planning" />;
    case 'exam-centres':
      return <ExamPlanningPage mode="centres" />;
    case 'centre-allocation':
      return <CentreAllocationPage />;
    case 'seat-allocation':
      return <SeatAllocationPage />;
    case 'admit-cards':
      return <AdmitCardsPage />;
    case 'attendance':
      return <AttendancePage />;
    case 'aptitude-tests':
      return <AssessmentPages mode="aptitude-tests" />;
    case 'answer-evaluation':
      return <AssessmentPages mode="answer-evaluation" />;
    case 'results':
      return <AssessmentPages mode="results" />;
    case 'interview-management':
      return <SelectionPages mode="interview-management" />;
    case 'ai-interviews':
      return <SelectionPages mode="ai-interviews" />;
    case 'final-selection':
      return <SelectionPages mode="final-selection" />;
    case 'appointment-letters':
      return <AppointmentPages mode="appointment-letters" />;
    case 'department-allocation':
      return <AppointmentPages mode="department-allocation" />;
    case 'posting-joining':
      return <AppointmentPages mode="posting-joining" />;
    case 'payments':
      return <FinancePages mode="payments" />;
    case 'reconciliation':
      return <FinancePages mode="reconciliation" />;
    case 'reports':
      return <ReportsPage />;
    case 'users-permissions':
      return <UsersPermissionsPage />;
    case 'system-settings':
      return <SystemSettingsPage />;
    default:
      return <AdminDashboard />;
  }
};

const AppShell: React.FC = () => {
  const { portalMode, toasts, dismissToast } = useAima();

  return (
    <>
      {portalMode === 'home' ? (
        <PublicHomePage />
      ) : portalMode === 'admin' ? (
        <AdminShell>
          <AdminRouter />
        </AdminShell>
      ) : (
        <CandidateShell>
          <CandidatePortal />
        </CandidateShell>
      )}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default function App() {
  return (
    <AimaProvider>
      <AppShell />
    </AimaProvider>
  );
}
