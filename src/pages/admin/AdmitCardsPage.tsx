import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  FileBadge2,
  Send,
  Users,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { KpiCard, PageHeader, StatusLabel } from '../../components/ui/Common';
import { AdmitCardPreview } from '../../components/shared/AdmitCardPreview';

export const AdmitCardsPage: React.FC = () => {
  const { candidates, selectedCampaignId, generateAdmitCards } = useAima();

  const scoped = candidates.filter(
    (c) =>
      (selectedCampaignId === 'ALL' || c.campaignId === selectedCampaignId) &&
      c.allocatedSeat
  );

  const [previewId, setPreviewId] = useState<string>('AIMA-2027-001245');
  const previewCandidate =
    candidates.find((c) => c.id === previewId) ?? scoped[0] ?? candidates[0];

  const generated = scoped.filter((c) => c.admitCardStatus !== 'Pending').length;
  const published = scoped.filter((c) => c.admitCardStatus === 'Published').length;
  const pending = scoped.filter((c) => c.admitCardStatus === 'Pending').length;
  const downloaded = scoped.filter((c) => c.admitCardDownloaded).length;

  const handleBulkGenerate = () => {
    const pendingIds = scoped.filter((c) => c.admitCardStatus === 'Pending').map((c) => c.id);
    if (pendingIds.length === 0) {
      generateAdmitCards(scoped.map((c) => c.id), false);
    } else {
      generateAdmitCards(pendingIds, false);
    }
  };

  const handleBulkPublish = () => {
    generateAdmitCards(
      scoped.map((c) => c.id),
      true
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admit Card Generation & Publishing"
        subtitle="Generate QR-verified E-Admit Cards for seated candidates and manage portal release"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkGenerate}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <FileBadge2 className="w-3.5 h-3.5 text-blue-700" /> Bulk Generate PDFs
            </button>
            <button
              onClick={handleBulkPublish}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" /> Publish All to Candidate Portal
            </button>
          </div>
        }
      />

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard label="Candidates Allocated" value={scoped.length} icon={Users} accent="navy" />
        <KpiCard label="Cards Generated" value={generated} icon={FileBadge2} accent="blue" />
        <KpiCard label="Cards Published" value={published} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Pending Cards" value={pending} icon={Clock} accent="amber" />
        <KpiCard label="Downloaded Cards" value={downloaded} icon={Download} accent="blue" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Candidate Admit Card Ledger */}
        <section className="xl:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">
              Seated Candidate Registry
            </h2>
            <span className="text-xs font-mono text-slate-500">{scoped.length} Seated</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto">
            {scoped.map((c) => {
              const isSelected = previewCandidate?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setPreviewId(c.id)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">{c.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {c.rollNumber} · Hall {c.allocatedHallCode} · Seat {c.allocatedSeat}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusLabel label={c.admitCardStatus} />
                    {c.admitCardStatus !== 'Published' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateAdmitCards([c.id], true);
                        }}
                        className="px-2 py-1 rounded text-[11px] font-semibold bg-blue-700 text-white hover:bg-blue-800"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Admit Card Preview */}
        <section className="xl:col-span-7">
          {previewCandidate && <AdmitCardPreview candidate={previewCandidate} />}
        </section>
      </div>
    </div>
  );
};
