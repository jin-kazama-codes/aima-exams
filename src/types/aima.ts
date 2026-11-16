export type PortalMode = 'home' | 'admin' | 'candidate';

export type AdminNavKey =
  | 'dashboard'
  | 'campaigns'
  | 'positions'
  | 'applications'
  | 'verification'
  | 'exam-planning'
  | 'exam-centres'
  | 'centre-allocation'
  | 'seat-allocation'
  | 'admit-cards'
  | 'attendance'
  | 'aptitude-tests'
  | 'answer-evaluation'
  | 'results'
  | 'interview-management'
  | 'ai-interviews'
  | 'final-selection'
  | 'appointment-letters'
  | 'department-allocation'
  | 'posting-joining'
  | 'payments'
  | 'reconciliation'
  | 'reports'
  | 'users-permissions'
  | 'system-settings';

export type CandidateNavKey =
  | 'c-dashboard'
  | 'c-notifications'
  | 'c-applications'
  | 'c-profile'
  | 'c-documents'
  | 'c-payments'
  | 'c-admit-cards'
  | 'c-exam-details'
  | 'c-results'
  | 'c-interviews'
  | 'c-appointment';

export type ReservationCategory = 'General' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS';

export type VerificationStatus =
  | 'Verified'
  | 'Pending Review'
  | 'Under Scrutiny'
  | 'Discrepancy Flagged'
  | 'Rejected';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export type InterviewStage =
  | 'Qualified'
  | 'Shortlisted'
  | 'AI Interview Pending'
  | 'AI Interview Completed'
  | 'Panel Interview Scheduled'
  | 'Interview Completed'
  | 'Recommended'
  | 'Not Selected';

export type AttendanceStatus = 'Present' | 'Absent' | 'Pending' | 'Late Entry';

export type AdmitCardStatus = 'Published' | 'Generated' | 'Pending';

export type SeatStatus = 'allocated' | 'vacant' | 'reserved' | 'accessibility';

export interface ReservationMatrixRow {
  position: string;
  grade: string;
  payLevel: string;
  General: number;
  'OBC-NCL': number;
  SC: number;
  ST: number;
  EWS: number;
  pwbdReserved: number;
}

export interface Campaign {
  id: string;
  title: string;
  shortTitle: string;
  department: string;
  stage:
    | 'Applications Open'
    | 'Verification & Scrutiny'
    | 'Exam & Seat Allocation'
    | 'Assessment & Results'
    | 'Interview & Selection';
  status: 'Active' | 'Scheduled' | 'Closed';
  applicationCount: number;
  verifiedCount: number;
  totalVacancies: number;
  deadline: string;
  examDate: string;
  feeGeneral: number;
  feeReserved: number;
  minAge: number;
  maxAge: number;
  qualification: string;
  examScheme: {
    paper: string;
    subject: string;
    questions: number;
    maxMarks: number;
    durationMins: number;
    negativeMarking: string;
  }[];
  selectionRules: {
    writtenWeightage: number;
    interviewWeightage: number;
    aiAssessmentAdvisory: boolean;
    minimumQualifyingGeneral: number;
    minimumQualifyingReserved: number;
    tieBreaker: string;
  };
  reservationMatrix: ReservationMatrixRow[];
  resultsPublished: boolean;
  cutoffGeneral: number;
  cutoffObc: number;
  cutoffSc: number;
  cutoffSt: number;
  cutoffEws: number;
}

export interface CandidateDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  fileSize: string;
  status: 'Verified' | 'Pending' | 'Flagged';
}

export interface TimelineEvent {
  step: string;
  date: string;
  completed: boolean;
  active?: boolean;
  note?: string;
}

export interface CandidateApplication {
  id: string; // e.g. AIMA-2027-001245
  rollNumber: string; // e.g. AIMA-2701245
  campaignId: string;
  position: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  photoUrl: string;
  fatherName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  category: ReservationCategory;
  pwbdRequired: boolean;
  education: {
    degree: string;
    institution: string;
    university: string;
    year: number;
    percentage: string;
  }[];
  experienceYears: number;
  currentOrg?: string;
  appliedDate: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  transactionId: string;
  verificationStatus: VerificationStatus;
  verifierNote?: string;
  documents: CandidateDocument[];
  // Examination & Seat Allocation
  preferredCity: string;
  preferredShift: 'Shift 1 (09:30 AM)' | 'Shift 2 (02:30 PM)';
  allocatedCity?: string;
  allocatedCentreId?: string;
  allocatedCentreName?: string;
  allocatedBuilding?: string;
  allocatedFloor?: string;
  allocatedHallId?: string;
  allocatedHallCode?: string;
  allocatedSeat?: string;
  admitCardStatus: AdmitCardStatus;
  admitCardDownloaded: boolean;
  attendance: AttendanceStatus;
  // Marks & Results
  writtenMarks?: {
    quant: number;
    reasoning: number;
    verbal: number;
    domain: number;
    total: number;
    maxTotal: number;
  };
  meritRank?: number;
  qualifiedWritten?: boolean;
  // Interview
  interviewStage: InterviewStage;
  interviewDate?: string;
  interviewPanel?: string;
  aiScorecard?: {
    communication: number;
    domainClarity: number;
    analyticalDepth: number;
    policyAwareness: number;
    overallAdvisory: number;
    summaryPoints: string[];
  };
  panelScore?: number;
  finalCompositeScore?: number;
  // Appointment
  finalSelected?: boolean;
  appointmentLetterIssued?: boolean;
  appointmentNumber?: string;
  allocatedDepartment?: string;
  allocatedDesignation?: string;
  postingLocation?: string;
  joiningDate?: string;
  joiningStatus?: 'Joined' | 'Accepted' | 'Letter Issued' | 'Pending Offer';
  timeline: TimelineEvent[];
}

export interface HallSeat {
  seatNumber: string; // "001" .. "040"
  row: number;
  col: number;
  status: SeatStatus;
  candidateId?: string;
  candidateName?: string;
  rollNumber?: string;
  isAccessibilityZone: boolean;
}

export interface ExamHall {
  id: string;
  code: string; // e.g., G-02
  name: string;
  building: string;
  floor: 'Ground Floor' | 'First Floor' | 'Second Floor';
  isGroundFloor: boolean;
  totalCapacity: number;
  accessibilitySeatsCount: number;
  reservedBlockedCount: number;
  wheelchairRamp: boolean;
  cctvVerified: boolean;
  biometricDesk: boolean;
  seats: HallSeat[];
}

export interface ExamCentre {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string;
  superintendent: string;
  contactPhone: string;
  shift1Capacity: number;
  shift2Capacity: number;
  halls: ExamHall[];
}

export interface AllocationRules {
  maxHallOccupancyPct: number;
  groundFloorForPwbd: boolean;
  respectCityPreference: boolean;
  respectShiftPreference: boolean;
  balancedOccupancy: boolean;
  preventDuplicateAllocation: boolean;
}

export interface PaymentTransaction {
  id: string;
  applicationId: string;
  candidateName: string;
  campaignId: string;
  category: ReservationCategory;
  amount: number;
  gateway: 'SBI ePay' | 'Razorpay Gov' | 'UPI BHIM' | 'HDFC NetBanking';
  utrNumber: string;
  date: string;
  status: PaymentStatus;
  reconciled: boolean;
}

export interface AptitudeTestConfig {
  id: string;
  campaignId: string;
  title: string;
  date: string;
  shift: string;
  durationMins: number;
  totalQuestions: number;
  maxMarks: number;
  setsPrepared: string[];
  answerKeyStatus: 'Provisional Published' | 'Final Locked' | 'Under Moderation';
  evaluationProgress: number;
  scriptsEvaluated: number;
  totalScripts: number;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role:
    | 'Controller of Examinations'
    | 'Verification Officer'
    | 'Centre Superintendent'
    | 'Interview Panel Chair'
    | 'Finance & Reconciliation Officer';
  department: string;
  lastActive: string;
  status: 'Active' | 'Restricted';
  permissions: string[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  module: string;
  action: string;
  referenceId?: string;
}
