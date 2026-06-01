import { useState, useMemo } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Download, FileText,
  PieChart as PieIcon, BarChart3, AlertTriangle, CheckCircle2,
  Plus, ArrowRight, Calendar, CreditCard, X, Eye
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';
import { User } from '@/types';

// Static data
const cashflowData = [
  { month: 'Jan', income: 2100000, expense: 1840000 },
  { month: 'Feb', income: 2240000, expense: 1920000 },
  { month: 'Mar', income: 1980000, expense: 1780000 },
  { month: 'Apr', income: 2380000, expense: 2050000 },
  { month: 'May', income: 2520000, expense: 2120000 },
  { month: 'Jun', income: 2680000, expense: 2240000 },
];

const expenseBreakdown = [
  { name: 'Raw Materials', value: 42, color: '#1E40AF' },
  { name: 'Labor', value: 28, color: '#F97316' },
  { name: 'Energy', value: 12, color: '#10B981' },
  { name: 'Maintenance', value: 10, color: '#8B5CF6' },
  { name: 'Other', value: 8, color: '#6B7280' },
];

const INITIAL_INVOICES = [
  { id: 'INV-4421', vendor: 'SteelPro Ltd.', amount: 48200, due: 'Jun 5', status: 'Overdue', poNumber: 'PO-12345', items: 'Steel coils 5000 units', notes: 'Payment due upon receipt' },
  { id: 'INV-4422', vendor: 'Hydraulic Systems Inc.', amount: 32500, due: 'Jun 15', status: 'Pending', poNumber: 'PO-12346', items: 'Hydraulic pumps 25 units', notes: 'Net 30' },
  { id: 'INV-4423', vendor: 'FastenTech Corp.', amount: 12750, due: 'Jun 20', status: 'Approved', poNumber: 'PO-12347', items: 'Fasteners - assorted', notes: 'Approved for payment' },
  { id: 'INV-4424', vendor: 'Global Bearings', amount: 67100, due: 'May 30', status: 'Paid', poNumber: 'PO-12348', items: 'Bearings 2000 units', notes: 'Paid via wire transfer' },
  { id: 'INV-4425', vendor: 'Polymer World', amount: 24300, due: 'Jun 25', status: 'Pending', poNumber: 'PO-12349', items: 'Polymer resin 500kg', notes: 'Awaiting approval' },
];

const INITIAL_BUDGETS = [
  { dept: 'Production', allocated: 1200000, spent: 980000, remaining: 220000 },
  { dept: 'Procurement', allocated: 800000, spent: 720000, remaining: 80000 },
  { dept: 'Maintenance', allocated: 250000, spent: 198000, remaining: 52000 },
  { dept: 'HR & Workforce', allocated: 450000, spent: 412000, remaining: 38000 },
];

// Helper: Format currency
const formatCurrency = (amount: number) => `$${(amount / 1000).toFixed(0)}K`;

// CSV export
const downloadCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Modal Components
function AddInvoiceModal({ onClose, onAdd }: { onClose: () => void; onAdd: (invoice: any) => void }) {
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');
  const [status, setStatus] = useState('Pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !amount || !due) {
      toast.error('Please fill all fields');
      return;
    }
    const newInvoice = {
      id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      vendor,
      amount: parseFloat(amount),
      due,
      status,
      poNumber: 'N/A',
      items: 'N/A',
      notes: 'No notes',
    };
    onAdd(newInvoice);
    onClose();
    toast.success(`Invoice ${newInvoice.id} created`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-foreground">New Invoice</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Vendor name" value={vendor} onChange={e => setVendor(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-muted/30 text-sm" />
          <input type="number" placeholder="Amount ($)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-muted/30 text-sm" />
          <input type="text" placeholder="Due date (e.g., Jul 10)" value={due} onChange={e => setDue(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-muted/30 text-sm" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-muted/30 text-sm">
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button type="submit" className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Create Invoice</button>
        </form>
      </div>
    </div>
  );
}

function ViewInvoiceModal({ invoice, onClose }: { invoice: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-foreground">Invoice Details</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Invoice ID:</span>
            <span className="font-mono font-medium">{invoice.id}</span>
            <span className="text-muted-foreground">Vendor:</span>
            <span className="font-medium">{invoice.vendor}</span>
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-bold">${invoice.amount.toLocaleString()}</span>
            <span className="text-muted-foreground">Due Date:</span>
            <span>{invoice.due}</span>
            <span className="text-muted-foreground">Status:</span>
            <StatusBadge variant={invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'error' : invoice.status === 'Approved' ? 'default' : 'warning'} size="sm">{invoice.status}</StatusBadge>
            <span className="text-muted-foreground">PO Number:</span>
            <span>{invoice.poNumber || '—'}</span>
            <span className="text-muted-foreground">Items/Services:</span>
            <span>{invoice.items || '—'}</span>
            <span className="text-muted-foreground">Notes:</span>
            <span>{invoice.notes || '—'}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

export function FinanceDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<'cashflow' | 'invoices' | 'budget'>('cashflow');
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Compute KPIs dynamically
  const kpis = useMemo(() => {
    const latestMonth = cashflowData[cashflowData.length - 1];
    const revenue = latestMonth.income;
    const expenses = latestMonth.expense;
    const netProfit = revenue - expenses;
    const accountsPayable = invoices
      .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;
    return { revenue, expenses, netProfit, accountsPayable, overdueCount };
  }, [invoices]);

  const hasOverdue = kpis.overdueCount > 0;

  // Handlers
  const handleExportReport = () => {
    const exportData = invoices.map(inv => ({
      'Invoice ID': inv.id,
      Vendor: inv.vendor,
      Amount: `$${inv.amount.toLocaleString()}`,
      'Due Date': inv.due,
      Status: inv.status,
    }));
    downloadCSV(exportData, `financial_report_${new Date().toISOString().slice(0,19)}.csv`);
    toast.success('Financial report exported');
  };

  const handleAddNewEntry = () => {
    setShowAddModal(true);
  };

  const handleAddInvoice = (newInvoice: any) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handlePayInvoice = (id: string) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === id && inv.status !== 'Paid' ? { ...inv, status: 'Paid' } : inv
      )
    );
    toast.success(`Invoice ${id} marked as paid`);
  };

  const handleProcessOverdue = () => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.status === 'Overdue' ? { ...inv, status: 'Paid' } : inv
      )
    );
    toast.success(`${kpis.overdueCount} overdue invoice(s) processed and paid`);
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  const handleViewBudgetDetails = (dept: string) => {
    toast.info(`Detailed budget for ${dept} — open the full budget report for more insights.`);
  };

  const handleGenerateBudgetReport = () => {
    const budgetData = budgets.map(b => ({
      Department: b.dept,
      Allocated: b.allocated,
      Spent: b.spent,
      Remaining: b.remaining,
      Utilization: `${Math.round((b.spent / b.allocated) * 100)}%`,
    }));
    downloadCSV(budgetData, `budget_report_${new Date().toISOString().slice(0,19)}.csv`);
    toast.success('Budget report generated');
  };

  const handleKPIClick = (label: string) => {
    toast.info(`Detailed ${label} analysis available in the full financial report.`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Modals */}
      {showAddModal && <AddInvoiceModal onClose={() => setShowAddModal(false)} onAdd={handleAddInvoice} />}
      {selectedInvoice && <ViewInvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Finance & Compliance Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.name} · {user.department} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Download className="h-4 w-4" />Export Report
          </button>
          <button onClick={handleAddNewEntry}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors">
            <Plus className="h-4 w-4" />New Entry
          </button>
        </div>
      </div>

      {/* Overdue Alert */}
      {hasOverdue && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">
            <span className="font-semibold">{kpis.overdueCount} overdue invoice(s)</span> require immediate payment processing.
          </p>
          <button onClick={handleProcessOverdue} className="ml-auto shrink-0 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
            Process Now
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue (Jun)', value: formatCurrency(kpis.revenue), change: '+6.3%', trend: 'up', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Expenses', value: formatCurrency(kpis.expenses), change: '+5.7%', trend: 'down', icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Net Profit', value: formatCurrency(kpis.netProfit), change: '+8.2%', trend: 'up', icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Accounts Payable', value: formatCurrency(kpis.accountsPayable), change: `${kpis.overdueCount} overdue`, trend: 'down', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => handleKPIClick(m.label)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {m.trend === 'up' ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-red-400" />}
                <span className={`text-xs ${m.trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-1">Cash Flow — Income vs Expenses</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cashflowData} barGap={3}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={v => [`$${(Number(v) / 1000).toFixed(0)}K`, '']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="income" fill="#1E40AF" radius={[3, 3, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#F97316" radius={[3, 3, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-primary inline-block" />Income</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-orange-500 inline-block" />Expenses</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-1">Expense Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-3">By category — Jun 2026</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={expenseBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={30} paddingAngle={3}>
                {expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, '']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {expenseBreakdown.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-medium text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          {[['cashflow', 'Invoices & AP'], ['invoices', 'All Invoices'], ['budget', 'Budget Tracking']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {label}
            </button>
          ))}
        </div>

        {(tab === 'cashflow' || tab === 'invoices') && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Invoice ID</th>
                  <th className="text-left px-5 py-3 font-medium">Vendor</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Due Date</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{inv.id}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">{inv.vendor}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">${inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{inv.due}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'error' : inv.status === 'Approved' ? 'default' : 'warning'} size="sm">{inv.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        {inv.status !== 'Paid' && (
                          <button onClick={() => handlePayInvoice(inv.id)} className="text-xs text-emerald-600 hover:underline">Pay</button>
                        )}
                        <button onClick={() => handleViewInvoice(inv)} className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Eye className="h-3 w-3" /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'budget' && (
          <div className="p-5 space-y-4">
            {budgets.map(b => (
              <div key={b.dept} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{b.dept}</span>
                  <span className="text-xs text-muted-foreground">
                    ${b.spent.toLocaleString()} / ${b.allocated.toLocaleString()}
                    <span className={`ml-2 font-semibold ${b.remaining < 50000 ? 'text-red-500' : 'text-emerald-500'}`}>
                      (${b.remaining.toLocaleString()} left)
                    </span>
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${(b.spent / b.allocated) > 0.9 ? 'bg-red-500' : (b.spent / b.allocated) > 0.75 ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${(b.spent / b.allocated) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{Math.round((b.spent / b.allocated) * 100)}% utilized</span>
                  <button onClick={() => handleViewBudgetDetails(b.dept)} className="text-primary hover:underline">Details</button>
                </div>
              </div>
            ))}
            <button onClick={handleGenerateBudgetReport}
              className="w-full py-2.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">
              Generate Full Budget Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}