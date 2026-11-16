import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import { ToastMessage } from '../../context/AimaContext';

export const AimaCrest: React.FC<{ dark?: boolean; compact?: boolean }> = ({
  dark = false,
  compact = false,
}) => (
  <div className="flex items-center gap-2.5 shrink-0">
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
        dark
          ? 'bg-[#102B4E] border-amber-400/40 text-amber-400'
          : 'bg-[#0B1F3A] border-[#0B1F3A] text-amber-400'
      }`}
    >
      <svg viewBox="0 0 28 28" className="w-5 h-5" fill="none" aria-hidden="true">
        <path
          d="M14 2.5L23.5 6.8V13.6C23.5 19.3 19.4 23.9 14 25.5C8.6 23.9 4.5 19.3 4.5 13.6V6.8L14 2.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M14 7.5L18.2 18.5H16.1L15.2 16H12.8L11.9 18.5H9.8L14 7.5ZM13.3 14.3H14.7L14 11.7L13.3 14.3Z"
          fill="currentColor"
        />
      </svg>
    </div>
    {!compact && (
      <div className="leading-tight whitespace-nowrap">
        <div
          className={`font-display font-bold tracking-tight text-sm ${
            dark ? 'text-white' : 'text-[#0B1F3A]'
          }`}
        >
          AIMA Recruitment
        </div>
        <div
          className={`text-[11px] font-medium ${
            dark ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          Examination & Selection Directorate
        </div>
      </div>
    )}
  </div>
);

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export function getStatusTone(status: string): StatusTone {
  const s = status.toLowerCase();
  if (
    s.includes('verified') ||
    s.includes('paid') ||
    s.includes('published') ||
    s.includes('present') ||
    s.includes('recommended') ||
    s.includes('accepted') ||
    s.includes('joined') ||
    s.includes('final locked') ||
    s.includes('active') ||
    s.includes('reconciled') ||
    s.includes('issued') ||
    s.includes('qualified') && !s.includes('dis')
  ) {
    return 'success';
  }
  if (
    s.includes('pending') ||
    s.includes('scrutiny') ||
    s.includes('generated') ||
    s.includes('scheduled') ||
    s.includes('provisional') ||
    s.includes('shortlisted') ||
    s.includes('late') ||
    s.includes('moderation')
  ) {
    return 'warning';
  }
  if (
    s.includes('flagged') ||
    s.includes('rejected') ||
    s.includes('failed') ||
    s.includes('absent') ||
    s.includes('discrepancy') ||
    s.includes('not selected') ||
    s.includes('restricted')
  ) {
    return 'danger';
  }
  if (s.includes('completed') || s.includes('refunded')) {
    return 'info';
  }
  return 'neutral';
}

export const StatusLabel: React.FC<{ label: string; tone?: StatusTone }> = ({
  label,
  tone,
}) => {
  const resolved = tone ?? getStatusTone(label);
  const styles: Record<StatusTone, string> = {
    success: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    warning: 'text-amber-800 bg-amber-50 border-amber-200',
    danger: 'text-red-700 bg-red-50 border-red-200',
    info: 'text-blue-700 bg-blue-50 border-blue-200',
    neutral: 'text-slate-700 bg-slate-100 border-slate-200',
  };

  const Icon =
    resolved === 'success'
      ? CheckCircle2
      : resolved === 'warning'
      ? Clock
      : resolved === 'danger'
      ? XCircle
      : AlertTriangle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border whitespace-nowrap shrink-0 ${styles[resolved]}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
};

export const CandidateAvatar: React.FC<{
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ src, name, size = 'md' }) => {
  const [failed, setFailed] = useState(false);
  const dims = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  }[size];

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (failed || !src) {
    return (
      <div
        className={`${dims} rounded-lg bg-[#0B1F3A] text-white font-display font-semibold flex items-center justify-center shrink-0 border border-slate-200`}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${dims} rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100`}
    />
  );
};

export const QrCodeGraphic: React.FC<{ value: string; size?: number }> = ({
  value,
  size = 84,
}) => {
  // Deterministic 11x11 crisp QR-style verification matrix
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  const cells: boolean[] = [];
  const grid = 13;
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const inTopLeft = r < 4 && c < 4;
      const inTopRight = r < 4 && c >= grid - 4;
      const inBottomLeft = r >= grid - 4 && c < 4;
      if (inTopLeft || inTopRight || inBottomLeft) {
        const lr = r < 4 ? r : r - (grid - 4);
        const lc = c < 4 ? c : c - (grid - 4);
        const border = lr === 0 || lr === 3 || lc === 0 || lc === 3;
        const center = (lr === 1 || lr === 2) && (lc === 1 || lc === 2);
        cells.push(border || (center && lr === 1 && lc === 1) || (lr === 2 && lc === 2));
      } else {
        const bit = ((hash >> ((r * grid + c) % 29)) ^ (r * 7 + c * 13)) & 1;
        cells.push(bit === 1);
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      className="bg-white p-1 border border-slate-300 rounded"
      aria-label={`Verification QR for ${value}`}
    >
      {cells.map((filled, idx) => {
        if (!filled) return null;
        const x = idx % grid;
        const y = Math.floor(idx / grid);
        return <rect key={idx} x={x} y={y} width="0.92" height="0.92" fill="#0B1F3A" />;
      })}
    </svg>
  );
};

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
    <div>
      <h1 className="text-xl sm:text-2xl font-display font-bold text-[#0B1F3A] tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
  </div>
);

export const KpiCard: React.FC<{
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: 'navy' | 'blue' | 'amber' | 'emerald';
  onClick?: () => void;
}> = ({ label, value, delta, icon: Icon, accent = 'blue', onClick }) => {
  const iconTone = {
    navy: 'bg-[#0B1F3A]/8 text-[#0B1F3A]',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  }[accent];

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={`text-left bg-white border border-slate-200 rounded-xl p-4 transition-colors ${
        onClick ? 'hover:border-blue-300 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconTone}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className="mt-2.5 text-2xl font-display font-bold text-slate-900 tabular-nums">
        {value}
      </div>
      {delta && <div className="mt-1 text-xs text-slate-500 tabular-nums">{delta}</div>}
    </Tag>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#0B1F3A] text-white rounded-lg shadow-lg border border-slate-700 px-4 py-3 flex items-start gap-3"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold">{t.title}</div>
            {t.detail && <div className="text-[11px] text-slate-300 mt-0.5">{t.detail}</div>}
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-400 hover:text-white shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
