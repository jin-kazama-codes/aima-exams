import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActivityLog,
  AdminNavKey,
  AdmitCardStatus,
  AllocationRules,
  AptitudeTestConfig,
  AttendanceStatus,
  Campaign,
  CandidateApplication,
  CandidateNavKey,
  ExamCentre,
  InterviewStage,
  PaymentTransaction,
  PortalMode,
  StaffUser,
  VerificationStatus,
} from '../types/aima';
import {
  DEFAULT_ALLOCATION_RULES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_APTITUDE_TESTS,
  INITIAL_CAMPAIGNS,
  INITIAL_CANDIDATES,
  INITIAL_CENTRES,
  INITIAL_PAYMENTS,
  INITIAL_STAFF_USERS,
  PORTRAITS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
  tone: 'success' | 'info' | 'warning' | 'error';
}

interface AimaState {
  portalMode: PortalMode;
  adminNav: AdminNavKey;
  candidateNav: CandidateNavKey;
  selectedCampaignId: string; // 'ALL' or campaign.id
  globalSearch: string;
  activeCandidateId: string; // Logged-in candidate in Candidate Portal (Rahul Sharma by default)
  campaigns: Campaign[];
  candidates: CandidateApplication[];
  centres: ExamCentre[];
  allocationRules: AllocationRules;
  allocationApproved: boolean;
  payments: PaymentTransaction[];
  aptitudeTests: AptitudeTestConfig[];
  staffUsers: StaffUser[];
  activityLogs: ActivityLog[];
}

const STORAGE_KEY = 'aima_platform_state_v2';

const defaultState: AimaState = {
  portalMode: 'home',
  adminNav: 'dashboard',
  candidateNav: 'c-dashboard',
  selectedCampaignId: 'ALL',
  globalSearch: '',
  activeCandidateId: 'AIMA-2027-001245',
  campaigns: INITIAL_CAMPAIGNS,
  candidates: INITIAL_CANDIDATES,
  centres: INITIAL_CENTRES,
  allocationRules: DEFAULT_ALLOCATION_RULES,
  allocationApproved: false,
  payments: INITIAL_PAYMENTS,
  aptitudeTests: INITIAL_APTITUDE_TESTS,
  staffUsers: INITIAL_STAFF_USERS,
  activityLogs: INITIAL_ACTIVITY_LOGS,
};

function loadInitialState(): AimaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AimaState>;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

interface AimaContextValue extends AimaState {
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  pushToast: (title: string, detail?: string, tone?: ToastMessage['tone']) => void;
  setPortalMode: (mode: PortalMode) => void;
  setAdminNav: (nav: AdminNavKey) => void;
  setCandidateNav: (nav: CandidateNavKey) => void;
  setSelectedCampaignId: (id: string) => void;
  setGlobalSearch: (q: string) => void;
  setActiveCandidateId: (id: string) => void;
  updateVerification: (candidateId: string, status: VerificationStatus, note?: string) => void;
  updateCampaign: (campaignId: string, patch: Partial<Campaign>) => void;
  updateAllocationRules: (patch: Partial<AllocationRules>) => void;
  toggleSeatBlock: (centreId: string, hallId: string, seatNumber: string) => void;
  assignCandidateCentre: (candidateId: string, centreId: string) => void;
  autoAllocateCentres: () => number;
  runAutoAllocation: (previewOnly?: boolean) => { allocatedCount: number; pwbdGroundCount: number; unallocatedCount: number };
  approveAllocation: () => void;
  resolveConflicts: () => void;
  generateAdmitCards: (candidateIds: string[], publish?: boolean) => void;
  markAdmitCardDownloaded: (candidateId: string) => void;
  updateAttendance: (candidateId: string, status: AttendanceStatus) => void;
  updateWrittenMarks: (candidateId: string, total: number) => void;
  toggleResultsPublished: (campaignId: string) => void;
  updateInterviewStage: (candidateId: string, stage: InterviewStage, panel?: string, panelScore?: number) => void;
  issueAppointmentLetter: (candidateId: string, dept?: string, location?: string, joiningDate?: string) => void;
  reconcilePayment: (txnId: string) => void;
  updateCandidateProfile: (candidateId: string, patch: Partial<CandidateApplication>) => void;
  uploadCandidateDocument: (candidateId: string, docName: string, docType: string) => void;
  submitNewCandidateApplication: (payload: {
    campaignId: string;
    position: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    city: string;
    preferredCity: string;
    preferredShift: 'Shift 1 (09:30 AM)' | 'Shift 2 (02:30 PM)';
    category: CandidateApplication['category'];
    pwbdRequired: boolean;
    degree: string;
    institution: string;
    percentage: string;
    experienceYears: number;
  }) => string;
  toggleTestAnswerKey: (testId: string) => void;
  simulateMarksImport: (testId: string) => void;
  resetDemoData: () => void;
}

const AimaContext = createContext<AimaContextValue | null>(null);

export const AimaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AimaState>(loadInitialState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const pushToast = (title: string, detail?: string, tone: ToastMessage['tone'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, detail, tone }]);
    setTimeout(() => dismissToast(id), 4000);
  };

  const addLog = (actor: string, module: string, action: string, referenceId?: string): ActivityLog => ({
    id: `ACT-${Date.now().toString().slice(-5)}`,
    timestamp: 'Just now',
    actor,
    module,
    action,
    referenceId,
  });

  const setPortalMode = (portalMode: PortalMode) => setState((s) => ({ ...s, portalMode }));
  const setAdminNav = (adminNav: AdminNavKey) => setState((s) => ({ ...s, adminNav }));
  const setCandidateNav = (candidateNav: CandidateNavKey) => setState((s) => ({ ...s, candidateNav }));
  const setSelectedCampaignId = (selectedCampaignId: string) => setState((s) => ({ ...s, selectedCampaignId }));
  const setGlobalSearch = (globalSearch: string) => setState((s) => ({ ...s, globalSearch }));
  const setActiveCandidateId = (activeCandidateId: string) => setState((s) => ({ ...s, activeCandidateId }));

  const updateVerification = (candidateId: string, status: VerificationStatus, note?: string) => {
    setState((s) => {
      const target = s.candidates.find((c) => c.id === candidateId);
      const nextCandidates = s.candidates.map((c) => {
        if (c.id !== candidateId) return c;
        const timeline = c.timeline.map((step) => {
          if (step.step === 'Verification') {
            return { ...step, completed: status === 'Verified', date: status === 'Verified' ? 'Verified' : status, active: status !== 'Verified' };
          }
          if (step.step === 'Approved') {
            return { ...step, completed: status === 'Verified', date: status === 'Verified' ? 'Approved' : '-' };
          }
          return step;
        });
        return {
          ...c,
          verificationStatus: status,
          verifierNote: note ?? c.verifierNote,
          timeline,
        };
      });
      return {
        ...s,
        candidates: nextCandidates,
        activityLogs: [addLog('Verification Officer', 'Verification', `Updated ${target?.name ?? candidateId} to ${status}`, candidateId), ...s.activityLogs.slice(0, 14)],
      };
    });
    pushToast(`Verification updated: ${status}`, `Application ${candidateId}`, status === 'Verified' ? 'success' : 'warning');
  };

  const updateCampaign = (campaignId: string, patch: Partial<Campaign>) => {
    setState((s) => ({
      ...s,
      campaigns: s.campaigns.map((cp) => (cp.id === campaignId ? { ...cp, ...patch } : cp)),
    }));
    pushToast('Campaign configuration saved', campaignId, 'success');
  };

  const updateAllocationRules = (patch: Partial<AllocationRules>) => {
    setState((s) => ({
      ...s,
      allocationRules: { ...s.allocationRules, ...patch },
    }));
  };

  const toggleSeatBlock = (centreId: string, hallId: string, seatNumber: string) => {
    setState((s) => ({
      ...s,
      centres: s.centres.map((ctr) => {
        if (ctr.id !== centreId) return ctr;
        return {
          ...ctr,
          halls: ctr.halls.map((hall) => {
            if (hall.id !== hallId) return hall;
            return {
              ...hall,
              seats: hall.seats.map((seat) => {
                if (seat.seatNumber !== seatNumber) return seat;
                if (seat.status === 'allocated') return seat;
                const nextStatus = seat.status === 'reserved' ? (seat.isAccessibilityZone ? 'accessibility' : 'vacant') : 'reserved';
                return { ...seat, status: nextStatus };
              }),
            };
          }),
        };
      }),
    }));
  };

  const assignCandidateCentre = (candidateId: string, centreId: string) => {
    const targetCentre = state.centres.find((ctr) => ctr.id === centreId);
    if (!targetCentre) return;
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => {
        if (c.id !== candidateId) return c;
        const centreChanged = c.allocatedCentreId !== targetCentre.id;
        return {
          ...c,
          allocatedCity: targetCentre.city,
          allocatedCentreId: targetCentre.id,
          allocatedCentreName: targetCentre.name,
          allocatedBuilding: centreChanged ? undefined : c.allocatedBuilding,
          allocatedFloor: centreChanged ? undefined : c.allocatedFloor,
          allocatedHallId: centreChanged ? undefined : c.allocatedHallId,
          allocatedHallCode: centreChanged ? undefined : c.allocatedHallCode,
          allocatedSeat: centreChanged ? undefined : c.allocatedSeat,
        };
      }),
      activityLogs: [
        addLog('Centre Allocation', 'Centre Assignment', `Assigned ${candidateId} to ${targetCentre.name} (${targetCentre.city})`, candidateId),
        ...s.activityLogs.slice(0, 14),
      ],
    }));
    pushToast('Examination Centre Assigned', `${candidateId} → ${targetCentre.name}`, 'success');
  };

  const autoAllocateCentres = () => {
    let assignedCount = 0;
    setState((s) => {
      const nextCandidates = s.candidates.map((c) => {
        if (c.verificationStatus !== 'Verified' || c.allocatedCentreId) return c;
        const match = s.centres.find((ctr) => ctr.city === c.preferredCity) ?? s.centres[0];
        if (!match) return c;
        assignedCount++;
        return {
          ...c,
          allocatedCity: match.city,
          allocatedCentreId: match.id,
          allocatedCentreName: match.name,
        };
      });
      return {
        ...s,
        candidates: nextCandidates,
        activityLogs: [
          addLog('Centre Allocation', 'Batch Centre Match', `Matched ${assignedCount} verified candidate(s) to regional examination centres`),
          ...s.activityLogs.slice(0, 14),
        ],
      };
    });
    pushToast(
      assignedCount > 0 ? `Allocated ${assignedCount} Candidate(s) to Centres` : 'All Verified Candidates Already Assigned to Centres',
      'Proceed to Seat Allocation Map to assign individual hall seats.',
      'success'
    );
    return assignedCount;
  };

  const runAutoAllocation = (previewOnly = false) => {
    let allocatedCount = 0;
    let pwbdGroundCount = 0;
    let unallocatedCount = 0;

    // Clone centres and candidates to compute deterministic allocation
    const nextCentres: ExamCentre[] = JSON.parse(JSON.stringify(state.centres));
    const nextCandidates: CandidateApplication[] = JSON.parse(JSON.stringify(state.candidates));

    const eligibleUnallocated = nextCandidates.filter(
      (c) => c.verificationStatus === 'Verified' && !c.allocatedSeat
    );

    // Sort PwBD candidates first so ground-floor accessibility seats are prioritized
    eligibleUnallocated.sort((a, b) => Number(b.pwbdRequired) - Number(a.pwbdRequired));

    for (const cand of eligibleUnallocated) {
      const preferredCentre =
        nextCentres.find((ctr) => ctr.city === cand.preferredCity) ||
        (state.allocationRules.respectCityPreference ? undefined : nextCentres[0]);

      if (!preferredCentre) {
        unallocatedCount++;
        continue;
      }

      const candidateHalls = [...preferredCentre.halls].sort((a, b) => {
        if (cand.pwbdRequired && state.allocationRules.groundFloorForPwbd) {
          return Number(b.isGroundFloor) - Number(a.isGroundFloor);
        }
        if (state.allocationRules.balancedOccupancy) {
          const occA = a.seats.filter((st) => st.status === 'allocated').length / a.totalCapacity;
          const occB = b.seats.filter((st) => st.status === 'allocated').length / b.totalCapacity;
          return occA - occB;
        }
        return 0;
      });

      let assigned = false;
      for (const hall of candidateHalls) {
        if (cand.pwbdRequired && state.allocationRules.groundFloorForPwbd && !hall.isGroundFloor) {
          continue;
        }
        const currentAllocated = hall.seats.filter((st) => st.status === 'allocated').length;
        const maxAllowed = Math.floor((hall.totalCapacity * state.allocationRules.maxHallOccupancyPct) / 100);
        if (currentAllocated >= maxAllowed) continue;

        const targetSeat = hall.seats.find((st) =>
          cand.pwbdRequired
            ? st.status === 'accessibility' || st.status === 'vacant'
            : st.status === 'vacant'
        );

        if (targetSeat) {
          targetSeat.status = 'allocated';
          targetSeat.candidateId = cand.id;
          targetSeat.candidateName = cand.name;
          targetSeat.rollNumber = cand.rollNumber;

          cand.allocatedCity = preferredCentre.city;
          cand.allocatedCentreId = preferredCentre.id;
          cand.allocatedCentreName = preferredCentre.name;
          cand.allocatedBuilding = hall.building;
          cand.allocatedFloor = hall.floor;
          cand.allocatedHallId = hall.id;
          cand.allocatedHallCode = hall.code;
          cand.allocatedSeat = targetSeat.seatNumber;
          cand.admitCardStatus = cand.admitCardStatus === 'Published' ? 'Published' : 'Generated';
          cand.timeline = cand.timeline.map((t) =>
            t.step === 'Examination Allotted' ? { ...t, completed: true, date: 'Allotted' } : t
          );

          allocatedCount++;
          if (cand.pwbdRequired && hall.isGroundFloor) pwbdGroundCount++;
          assigned = true;
          break;
        }
      }
      if (!assigned) unallocatedCount++;
    }

    if (!previewOnly) {
      setState((s) => ({
        ...s,
        centres: nextCentres,
        candidates: nextCandidates,
        activityLogs: [
          addLog('Allocation Engine', 'Seat Allocation', `Allocated ${allocatedCount} verified candidates (${pwbdGroundCount} PwBD ground-floor)`),
          ...s.activityLogs.slice(0, 14),
        ],
      }));
      pushToast(
        allocatedCount > 0 ? `Auto Allocation Complete: ${allocatedCount} seated` : 'All verified candidates already seated',
        `${pwbdGroundCount} ground-floor accessibility seats assigned · ${unallocatedCount} pending`,
        'success'
      );
    } else {
      pushToast(
        `Allocation Preview Ready`,
        `${eligibleUnallocated.length} verified unallocated candidate(s) evaluated against rules`,
        'info'
      );
    }

    return { allocatedCount, pwbdGroundCount, unallocatedCount };
  };

  const approveAllocation = () => {
    setState((s) => ({
      ...s,
      allocationApproved: true,
      activityLogs: [addLog('Controller of Examinations', 'Centre Allocation', 'Approved final examination centre & seat allocation matrix'), ...s.activityLogs.slice(0, 14)],
    }));
    pushToast('Centre & Seat Allocation Approved', 'Admit card generation is unlocked for all allocated candidates.', 'success');
  };

  const resolveConflicts = () => {
    setState((s) => {
      // Ensure any PwBD candidate on non-ground floor is moved or flagged cleanly
      const updated = s.candidates.map((c) => {
        if (c.pwbdRequired && c.allocatedFloor && c.allocatedFloor !== 'Ground Floor') {
          return { ...c, allocatedFloor: 'Ground Floor', allocatedHallCode: 'G-01' };
        }
        return c;
      });
      return {
        ...s,
        candidates: updated,
        activityLogs: [addLog('Allocation Engine', 'Conflict Resolution', 'Resolved duplicate & accessibility floor constraints'), ...s.activityLogs.slice(0, 14)],
      };
    });
    pushToast('Conflicts Resolved', 'Zero duplicate roll numbers or accessibility mismatches remaining.', 'success');
  };

  const generateAdmitCards = (candidateIds: string[], publish = false) => {
    const nextStatus: AdmitCardStatus = publish ? 'Published' : 'Generated';
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => {
        if (!candidateIds.includes(c.id)) return c;
        return {
          ...c,
          admitCardStatus: nextStatus,
          timeline: c.timeline.map((t) =>
            t.step === 'Admit Card Issued' ? { ...t, completed: publish, date: publish ? 'Issued' : 'Generated' } : t
          ),
        };
      }),
      activityLogs: [
        addLog('Examination Cell', 'Admit Cards', `${publish ? 'Published' : 'Generated'} ${candidateIds.length} admit card(s)`),
        ...s.activityLogs.slice(0, 14),
      ],
    }));
    pushToast(`${candidateIds.length} Admit Card(s) ${nextStatus}`, 'QR-verified PDF packets prepared.', 'success');
  };

  const markAdmitCardDownloaded = (candidateId: string) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => (c.id === candidateId ? { ...c, admitCardDownloaded: true } : c)),
    }));
    pushToast('Admit Card PDF Ready', `Roll Number printout downloaded for ${candidateId}`, 'success');
  };

  const updateAttendance = (candidateId: string, status: AttendanceStatus) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => (c.id === candidateId ? { ...c, attendance: status } : c)),
    }));
  };

  const updateWrittenMarks = (candidateId: string, total: number) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => {
        if (c.id !== candidateId) return c;
        const cp = s.campaigns.find((x) => x.id === c.campaignId);
        const cutoff = cp?.cutoffGeneral ?? 135;
        const part = Math.round(total / 4);
        return {
          ...c,
          writtenMarks: {
            quant: part,
            reasoning: part,
            verbal: part,
            domain: total - part * 3,
            total,
            maxTotal: 200,
          },
          qualifiedWritten: total >= cutoff,
        };
      }),
    }));
    pushToast('Marks updated', `Updated total score for ${candidateId}`, 'success');
  };

  const toggleResultsPublished = (campaignId: string) => {
    setState((s) => ({
      ...s,
      campaigns: s.campaigns.map((cp) => (cp.id === campaignId ? { ...cp, resultsPublished: !cp.resultsPublished } : cp)),
      activityLogs: [
        addLog('Controller of Examinations', 'Results & Merit Lists', `Toggled result publication for ${campaignId}`),
        ...s.activityLogs.slice(0, 14),
      ],
    }));
    pushToast('Result Publication Status Updated', campaignId, 'success');
  };

  const updateInterviewStage = (
    candidateId: string,
    stage: InterviewStage,
    panel?: string,
    panelScore?: number
  ) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => {
        if (c.id !== candidateId) return c;
        const nextPanelScore = panelScore ?? c.panelScore;
        const writtenPct = c.writtenMarks ? (c.writtenMarks.total / c.writtenMarks.maxTotal) * 75 : 0;
        const panelPct = nextPanelScore !== undefined ? (nextPanelScore / 50) * 25 : 0;
        return {
          ...c,
          interviewStage: stage,
          interviewPanel: panel ?? c.interviewPanel,
          panelScore: nextPanelScore,
          finalCompositeScore: nextPanelScore !== undefined ? Number((writtenPct + panelPct).toFixed(1)) : c.finalCompositeScore,
          finalSelected: stage === 'Recommended' ? true : c.finalSelected,
        };
      }),
      activityLogs: [addLog('Interview Board', 'Selection', `Updated ${candidateId} interview stage to ${stage}`, candidateId), ...s.activityLogs.slice(0, 14)],
    }));
    pushToast('Interview Status Updated', `${candidateId} → ${stage}`, 'success');
  };

  const issueAppointmentLetter = (candidateId: string, dept?: string, location?: string, joiningDate?: string) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          finalSelected: true,
          appointmentLetterIssued: true,
          appointmentNumber: c.appointmentNumber ?? `AIMA/ESTT/2027/${candidateId.slice(-3)}`,
          allocatedDepartment: dept ?? c.allocatedDepartment ?? 'General Administration & Policy',
          allocatedDesignation: c.allocatedDesignation ?? `${c.position} (Grade A)`,
          postingLocation: location ?? c.postingLocation ?? 'AIMA Headquarters, New Delhi',
          joiningDate: joiningDate ?? c.joiningDate ?? '2027-06-01',
          joiningStatus: 'Letter Issued',
        };
      }),
      activityLogs: [addLog('Establishment Cell', 'Appointment', `Issued formal appointment letter for ${candidateId}`, candidateId), ...s.activityLogs.slice(0, 14)],
    }));
    pushToast('Appointment Letter Issued', `Establishment order generated for ${candidateId}`, 'success');
  };

  const reconcilePayment = (txnId: string) => {
    setState((s) => ({
      ...s,
      payments: s.payments.map((p) => (p.id === txnId ? { ...p, reconciled: true, status: p.status === 'Pending' ? 'Paid' : p.status } : p)),
      activityLogs: [addLog('Finance Officer', 'Reconciliation', `Reconciled bank UTR for ${txnId}`, txnId), ...s.activityLogs.slice(0, 14)],
    }));
    pushToast('Transaction Reconciled', `${txnId} matched with bank settlement batch`, 'success');
  };

  const updateCandidateProfile = (candidateId: string, patch: Partial<CandidateApplication>) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => (c.id === candidateId ? { ...c, ...patch } : c)),
    }));
    pushToast('Profile Information Saved', 'Your candidate dossier has been updated.', 'success');
  };

  const uploadCandidateDocument = (candidateId: string, docName: string, docType: string) => {
    setState((s) => ({
      ...s,
      candidates: s.candidates.map((c) => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          documents: [
            ...c.documents,
            {
              id: `DOC-${Date.now().toString().slice(-4)}`,
              name: docName,
              type: docType,
              uploadedAt: '2027-01-20',
              fileSize: '485 KB',
              status: 'Pending',
            },
          ],
        };
      }),
    }));
    pushToast('Document Uploaded', `${docName} queued for verification scrutiny.`, 'success');
  };

  const submitNewCandidateApplication: AimaContextValue['submitNewCandidateApplication'] = (payload) => {
    const seq = Math.floor(1600 + Math.random() * 800);
    const appId = `AIMA-2027-00${seq}`;
    const roll = `AIMA-270${seq}`;
    const cp = state.campaigns.find((x) => x.id === payload.campaignId);
    const fee = payload.category === 'General' ? (cp?.feeGeneral ?? 1000) : (cp?.feeReserved ?? 250);

    const newApp: CandidateApplication = {
      id: appId,
      rollNumber: roll,
      campaignId: payload.campaignId,
      position: payload.position,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      dob: payload.dob,
      gender: 'Male',
      photoUrl: PORTRAITS.rahul,
      fatherName: 'Rajeshwar Prasad Sharma',
      address: 'B-42, Sector 15, Rohini',
      city: payload.city,
      state: 'Delhi',
      pincode: '110085',
      category: payload.category,
      pwbdRequired: payload.pwbdRequired,
      education: [
        { degree: payload.degree, institution: payload.institution, university: 'Recognized University', year: 2023, percentage: payload.percentage },
      ],
      experienceYears: payload.experienceYears,
      appliedDate: '2027-01-20',
      paymentStatus: 'Paid',
      paymentAmount: fee,
      transactionId: `SBI-EPAY-${seq}991`,
      verificationStatus: 'Pending Review',
      documents: [
        { id: `DOC-${seq}-1`, name: 'Photo & Signature Bundle', type: 'KYC Document', uploadedAt: '2027-01-20', fileSize: '340 KB', status: 'Pending' },
        { id: `DOC-${seq}-2`, name: `${payload.degree} Marksheet`, type: 'Academic', uploadedAt: '2027-01-20', fileSize: '780 KB', status: 'Pending' },
      ],
      preferredCity: payload.preferredCity,
      preferredShift: payload.preferredShift,
      admitCardStatus: 'Pending',
      admitCardDownloaded: false,
      attendance: 'Pending',
      interviewStage: 'Qualified',
      timeline: [
        { step: 'Application Submitted', date: '20 Jan 2027', completed: true },
        { step: 'Payment Confirmed', date: '20 Jan 2027', completed: true },
        { step: 'Verification', date: 'In Queue', completed: false, active: true },
        { step: 'Approved', date: '-', completed: false },
        { step: 'Examination Allotted', date: '-', completed: false },
        { step: 'Admit Card Issued', date: '-', completed: false },
        { step: 'Examination Completed', date: '-', completed: false },
        { step: 'Result Published', date: '-', completed: false },
        { step: 'Interview', date: '-', completed: false },
        { step: 'Final Selection', date: '-', completed: false },
      ],
    };

    setState((s) => ({
      ...s,
      candidates: [newApp, ...s.candidates],
      campaigns: s.campaigns.map((c) => (c.id === payload.campaignId ? { ...c, applicationCount: c.applicationCount + 1 } : c)),
      payments: [
        {
          id: `TXN-${seq}`,
          applicationId: appId,
          candidateName: payload.name,
          campaignId: payload.campaignId,
          category: payload.category,
          amount: fee,
          gateway: 'SBI ePay',
          utrNumber: `SBIN42700${seq}11`,
          date: '2027-01-20 12:15',
          status: 'Paid',
          reconciled: false,
        },
        ...s.payments,
      ],
      activityLogs: [addLog(payload.name, 'Application', `Submitted new application ${appId} for ${payload.position}`, appId), ...s.activityLogs.slice(0, 14)],
    }));

    pushToast('Application Submitted Successfully', `Application ID ${appId} · Fee ₹${fee} confirmed`, 'success');
    return appId;
  };

  const toggleTestAnswerKey = (testId: string) => {
    setState((s) => ({
      ...s,
      aptitudeTests: s.aptitudeTests.map((t) => {
        if (t.id !== testId) return t;
        const nextStatus =
          t.answerKeyStatus === 'Under Moderation'
            ? 'Provisional Published'
            : t.answerKeyStatus === 'Provisional Published'
            ? 'Final Locked'
            : 'Provisional Published';
        return { ...t, answerKeyStatus: nextStatus };
      }),
    }));
    pushToast('Answer Key Status Updated', testId, 'success');
  };

  const simulateMarksImport = (testId: string) => {
    setState((s) => ({
      ...s,
      aptitudeTests: s.aptitudeTests.map((t) =>
        t.id === testId ? { ...t, evaluationProgress: 100, scriptsEvaluated: t.totalScripts } : t
      ),
    }));
    pushToast('OMR / CBT Marks Batch Imported', `100% scripts evaluated for ${testId}`, 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
    pushToast('Demo Workspace Reset', 'All mock records restored to baseline state.', 'info');
  };

  return (
    <AimaContext.Provider
      value={{
        ...state,
        toasts,
        dismissToast,
        pushToast,
        setPortalMode,
        setAdminNav,
        setCandidateNav,
        setSelectedCampaignId,
        setGlobalSearch,
        setActiveCandidateId,
        updateVerification,
        updateCampaign,
        updateAllocationRules,
        toggleSeatBlock,
        assignCandidateCentre,
        autoAllocateCentres,
        runAutoAllocation,
        approveAllocation,
        resolveConflicts,
        generateAdmitCards,
        markAdmitCardDownloaded,
        updateAttendance,
        updateWrittenMarks,
        toggleResultsPublished,
        updateInterviewStage,
        issueAppointmentLetter,
        reconcilePayment,
        updateCandidateProfile,
        uploadCandidateDocument,
        submitNewCandidateApplication,
        toggleTestAnswerKey,
        simulateMarksImport,
        resetDemoData,
      }}
    >
      {children}
    </AimaContext.Provider>
  );
};

export function useAima() {
  const ctx = useContext(AimaContext);
  if (!ctx) throw new Error('useAima must be used inside AimaProvider');
  return ctx;
}
