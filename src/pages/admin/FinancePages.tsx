import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  IndianRupee,
  RefreshCcw,
  XCircle,
} from 'lucide-react';
import { useAima } from '../../context/AimaContext';
import { KpiCard, PageHeader, StatusLabel } from '../../components/ui/Common';
import { AreaTrendChart, DonutChart, HorizontalBarList } from '../../components/ui/Charts';

export const FinancePages: React.FC<{ mode: 'payments' | 'reconciliation' }> = ({ mode }) => {
  const { payments, campaigns, reconcilePayment, pushToast } = useAima();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const totalCollection = 24865000; // ₹2.48 Cr realistic cycle collection
  const successCount = 39840;
  const pendingCount = payments.filter((p) => p.status === 'Pending').length * 142;
  const failedCount = payments.filter((p) => p.status === 'Failed').length * 195;
  const refundCount = 84;

  const filteredPayments =
    statusFilter === 'ALL' ? payments : payments.filter((p) => p.status === statusFilter);

  if (mode === 'reconciliation') {
    const unreconciled = payments.filter((p) => !p.reconciled);
    return (
      <div className="space-y-6">
        <PageHeader
          title="Bank Settlement & Fee Reconciliation"
          subtitle="Match payment gateway UTR references against AIMA Nodal Treasury Account statements"
          actions={
            <button
              onClick={() => pushToast('Settlement Batch Synced', 'SBI ePay & Razorpay Gov T+1 scrolls imported.', 'info')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#0B1F3A] text-white hover:bg-[#143561] inline-flex items-center gap-1.5"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Sync T+1 Bank Scroll
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard label="Reconciled Transactions" value={payments.filter((p) => p.reconciled).length} icon={CheckCircle2} accent="emerald" />
          <KpiCard label="Awaiting Settlement Match" value={unreconciled.length} icon={Clock} accent="amber" />
          <KpiCard label="Treasury Settlement Rate" value="99.4%" icon={IndianRupee} accent="navy" />
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
            Gateway UTR Reconciliation Register
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-medium">Txn ID</th>
                  <th className="py-2 px-3 font-medium">Bank UTR Reference</th>
                  <th className="py-2 px-3 font-medium">Candidate</th>
                  <th className="py-2 px-3 font-medium">Gateway</th>
                  <th className="py-2 px-3 font-medium text-right">Amount</th>
                  <th className="py-2 px-3 font-medium">Ledger Status</th>
                  <th className="py-2 pl-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-3 font-mono font-semibold text-slate-800">{p.id}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{p.utrNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {p.candidateName} <span className="text-slate-400 font-mono">({p.applicationId})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{p.gateway}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">₹{p.amount}</td>
                    <td className="py-2.5 px-3">
                      <StatusLabel label={p.reconciled ? 'Reconciled' : 'Pending Match'} tone={p.reconciled ? 'success' : 'warning'} />
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      {!p.reconciled ? (
                        <button
                          onClick={() => reconcilePayment(p.id)}
                          className="px-3 py-1 rounded text-[11px] font-semibold bg-blue-700 text-white hover:bg-blue-800"
                        >
                          Reconcile Now
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-medium">Matched</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  // PAYMENT DASHBOARD
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Collection & Payment Analytics"
        subtitle="Monitor examination fee revenue, payment gateway reliability, and transaction ledger"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          label="Total Collection"
          value={`₹${(totalCollection / 10000000).toFixed(2)} Cr`}
          delta="FY 2026-27 Cycle"
          icon={IndianRupee}
          accent="navy"
        />
        <KpiCard label="Successful Txns" value={successCount.toLocaleString('en-IN')} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Pending Txns" value={pendingCount} icon={Clock} accent="amber" />
        <KpiCard label="Failed Txns" value={failedCount} icon={XCircle} accent="amber" />
        <KpiCard label="Refunds Processed" value={refundCount} icon={RefreshCcw} accent="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-3">
            Daily Fee Collections (₹ Lakhs)
          </h2>
          <AreaTrendChart
            color="#0B1F3A"
            primaryLabel="Collection"
            unit="₹"
            data={[
              { label: '05 Jan', value: 1840000 },
              { label: '10 Jan', value: 3250000 },
              { label: '15 Jan', value: 4920000 },
              { label: '20 Jan', value: 5890000 },
              { label: '25 Jan', value: 4710000 },
              { label: '31 Jan', value: 4255000 },
            ]}
          />
        </section>

        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
            Payment Gateway Distribution
          </h2>
          <DonutChart
            centerValue="100%"
            centerLabel="Gateway Mix"
            segments={[
              { label: 'SBI ePay (Nodal)', value: 18400, color: '#0B1F3A' },
              { label: 'UPI / BHIM', value: 12100, color: '#1D4ED8' },
              { label: 'Razorpay Gov', value: 6420, color: '#16A34A' },
              { label: 'HDFC NetBanking', value: 2920, color: '#D97706' },
            ]}
          />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
            Recruitment-wise Fee Revenue (₹ Lakhs)
          </h2>
          <HorizontalBarList
            unit="₹"
            items={campaigns.map((c, idx) => ({
              label: c.title,
              value: Math.round(c.applicationCount * 560),
              color: idx === 0 ? '#1D4ED8' : idx === 1 ? '#0B1F3A' : '#D97706',
            }))}
          />
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-display font-bold text-[#0B1F3A] mb-4">
            Category-wise Fee Collection
          </h2>
          <HorizontalBarList
            unit="₹"
            items={[
              { label: 'General (UR) · ₹1,000 fee', value: 16840000, color: '#0B1F3A' },
              { label: 'OBC-NCL · ₹250 concession', value: 3920000, color: '#1D4ED8' },
              { label: 'EWS · ₹250 concession', value: 1850000, color: '#D97706' },
              { label: 'SC / ST / PwBD · ₹250 concession', value: 2255000, color: '#16A34A' },
            ]}
          />
        </section>
      </div>

      {/* Transaction Listing */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-display font-bold text-[#0B1F3A]">Recent Fee Transactions</h2>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['ALL', 'Paid', 'Pending', 'Failed', 'Refunded'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                  statusFilter === st ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3 font-medium">Txn ID</th>
                <th className="py-2 px-3 font-medium">Candidate</th>
                <th className="py-2 px-3 font-medium">Gateway</th>
                <th className="py-2 px-3 font-medium">Date & Time</th>
                <th className="py-2 px-3 font-medium text-right">Amount</th>
                <th className="py-2 pl-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-2.5 pr-3 font-mono text-slate-700">{p.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {p.candidateName}{' '}
                    <span className="font-mono font-normal text-slate-500">({p.applicationId})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{p.gateway}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{p.date}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">₹{p.amount}</td>
                  <td className="py-2.5 pl-3 text-right">
                    <StatusLabel label={p.status} />
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
