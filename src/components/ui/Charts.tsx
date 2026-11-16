import React, { useState } from 'react';

export interface SeriesPoint {
  label: string;
  value: number;
  secondary?: number;
}

export const AreaTrendChart: React.FC<{
  data: SeriesPoint[];
  height?: number;
  primaryLabel?: string;
  color?: string;
  unit?: string;
}> = ({ data, height = 210, primaryLabel = 'Applications', color = '#1D4ED8', unit = '' }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const w = 560;
  const h = height;
  const padL = 36;
  const padR = 14;
  const padT = 16;
  const padB = 28;
  const maxVal = Math.max(...data.map((d) => d.value), 1) * 1.12;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const points = data.map((d, idx) => {
    const x = padL + (idx / Math.max(data.length - 1, 1)) * innerW;
    const y = padT + innerH - (d.value / maxVal) * innerH;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padT + innerH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {yTicks.map((t, i) => {
          const y = padT + innerH - t * innerH;
          const val = Math.round(t * maxVal);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
              <text x={padL - 6} y={y + 3} textAnchor="end" className="fill-slate-400 text-[10px] font-mono">
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill={`url(#grad-${color.replace('#', '')})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i}>
            <text
              x={p.x}
              y={h - 6}
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              {p.label}
            </text>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIdx === i ? 5 : 3}
              fill={hoverIdx === i ? '#D97706' : color}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <rect
              x={p.x - innerW / data.length / 2}
              y={padT}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className="cursor-crosshair"
            />
          </g>
        ))}

        {hoverIdx !== null && points[hoverIdx] && (
          <g transform={`translate(${Math.min(Math.max(points[hoverIdx].x - 45, padL), w - 110)}, ${Math.max(points[hoverIdx].y - 38, 4)})`}>
            <rect width="98" height="28" rx="5" fill="#0B1F3A" />
            <text x="49" y="12" textAnchor="middle" className="fill-slate-300 text-[9px]">
              {points[hoverIdx].label} · {primaryLabel}
            </text>
            <text x="49" y="23" textAnchor="middle" className="fill-white text-[10px] font-mono font-semibold">
              {unit}{points[hoverIdx].value.toLocaleString('en-IN')}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export const DonutChart: React.FC<{
  segments: DonutSegment[];
  centerValue: string;
  centerLabel: string;
  size?: number;
}> = ({ segments, centerValue, centerLabel, size = 168 }) => {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  const r = 56;
  const c = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 150 150" className="w-full h-full -rotate-90">
          {segments.map((seg, idx) => {
            const pct = seg.value / total;
            const dash = pct * c;
            const offset = -cumulative * c;
            cumulative += pct;
            return (
              <circle
                key={seg.label}
                cx="75"
                cy="75"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={active === idx ? 20 : 16}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={offset}
                onMouseEnter={() => setActive(idx)}
                onMouseLeave={() => setActive(null)}
                className="transition-all duration-150 cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="text-lg font-display font-bold text-[#0B1F3A] tabular-nums">
            {active !== null ? segments[active].value.toLocaleString('en-IN') : centerValue}
          </div>
          <div className="text-[11px] text-slate-500 max-w-[90px] truncate">
            {active !== null ? segments[active].label : centerLabel}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {segments.map((seg, idx) => {
          const pct = ((seg.value / total) * 100).toFixed(1);
          return (
            <div
              key={seg.label}
              onMouseEnter={() => setActive(idx)}
              onMouseLeave={() => setActive(null)}
              className={`flex items-center justify-between text-xs py-1 px-2 rounded transition-colors ${
                active === idx ? 'bg-slate-50' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-slate-700 truncate">{seg.label}</span>
              </div>
              <div className="font-mono tabular-nums text-slate-900 font-medium shrink-0 ml-2">
                {seg.value.toLocaleString('en-IN')} <span className="text-slate-400">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HorizontalBarList: React.FC<{
  items: { label: string; value: number; max?: number; color?: string; sublabel?: string }[];
  unit?: string;
}> = ({ items, unit = '' }) => {
  const maxVal = Math.max(...items.map((i) => i.max ?? i.value), 1);
  return (
    <div className="space-y-3.5">
      {items.map((item) => {
        const pct = Math.min(100, Math.round((item.value / maxVal) * 100));
        return (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-2 text-xs mb-1.5">
              <div className="min-w-0">
                <span className="font-medium text-slate-800 truncate block">{item.label}</span>
                {item.sublabel && <span className="text-[11px] text-slate-500">{item.sublabel}</span>}
              </div>
              <span className="font-mono tabular-nums font-semibold text-slate-900 shrink-0">
                {unit}{item.value.toLocaleString('en-IN')}
                {item.max ? <span className="text-slate-400 font-normal"> / {item.max.toLocaleString('en-IN')}</span> : ''}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: item.color ?? '#1D4ED8' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PipelineFunnel: React.FC<{
  stages: { stage: string; count: number; pct: number }[];
}> = ({ stages }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
    {stages.map((st, idx) => (
      <div
        key={st.stage}
        className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 flex flex-col justify-between"
      >
        <div className="text-[11px] font-medium text-slate-500">
          {String(idx + 1).padStart(2, '0')}. {st.stage}
        </div>
        <div className="mt-2">
          <div className="text-lg font-display font-bold text-[#0B1F3A] tabular-nums">
            {st.count.toLocaleString('en-IN')}
          </div>
          <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-700"
              style={{ width: `${st.pct}%` }}
            />
          </div>
          <div className="text-[11px] font-mono tabular-nums text-slate-500 mt-1">{st.pct}%</div>
        </div>
      </div>
    ))}
  </div>
);

export const ScoreHistogram: React.FC<{
  bins: { range: string; count: number; qualified: boolean }[];
}> = ({ bins }) => {
  const max = Math.max(...bins.map((b) => b.count), 1);
  return (
    <div className="flex items-end gap-2 h-44 pt-4">
      {bins.map((b) => {
        const hPct = Math.max(8, Math.round((b.count / max) * 100));
        return (
          <div key={b.range} className="flex-1 flex flex-col items-center h-full justify-end group">
            <div className="text-[10px] font-mono tabular-nums text-slate-500 mb-1 opacity-80 group-hover:opacity-100">
              {b.count}
            </div>
            <div
              className={`w-full rounded-t transition-colors ${
                b.qualified ? 'bg-blue-700 group-hover:bg-blue-800' : 'bg-slate-300 group-hover:bg-slate-400'
              }`}
              style={{ height: `${hPct}%` }}
            />
            <div className="text-[10px] font-mono text-slate-600 mt-1.5 whitespace-nowrap">
              {b.range}
            </div>
          </div>
        );
      })}
    </div>
  );
};
