import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useScrollTop } from '@/hooks/useScrollTop';
import { useNavigate, useLocation } from 'react-router-dom';

// Role dashboards
import { ProductionDashboard } from '@/components/features/dashboards/ProductionDashboard';
import { ProcurementDashboard } from '@/components/features/dashboards/ProcurementDashboard';
import { WarehouseDashboard } from '@/components/features/dashboards/WarehouseDashboard';
import { MaintenanceDashboard } from '@/components/features/dashboards/MaintenanceDashboard';
import { SupplierDashboard } from '@/components/features/dashboards/SupplierDashboard';
import { FinanceDashboard } from '@/components/features/dashboards/FinanceDashboard';
import { SuperAdminDashboard } from '@/components/features/dashboards/SuperAdminDashboard';
import { WorkforceDashboard } from '@/components/features/dashboards/WorkforceDashboard';
import { QualityDashboard } from '@/components/features/dashboards/QualityDashboard';

// Sub-pages (global modules)
import { NotificationsPage } from '@/pages/dashboard/NotificationsPage';
import { MessagesPage } from '@/pages/dashboard/MessagesPage';
import { AIAssistantPage } from '@/pages/dashboard/AIAssistantPage';
import { ActivityPage } from '@/pages/dashboard/ActivityPage';
import { ReportsPage } from '@/pages/dashboard/ReportsPage';
import { HelpPage } from '@/pages/dashboard/HelpPage';
import { SupportPage } from '@/pages/dashboard/SupportPage';
import { DashboardSettingsPage } from '@/pages/dashboard/DashboardSettingsPage';

// Role-specific module pages
import { OrganizationsPage } from '@/pages/dashboard/OrganizationsPage';
import { PlantsPage } from '@/pages/dashboard/PlantsPage';
import { DepartmentsPage } from '@/pages/dashboard/DepartmentsPage';
import { EmployeesPage } from '@/pages/dashboard/EmployeesPage';
import { AccessControlPage } from '@/pages/dashboard/AccessControlPage';
import { EnterpriseAnalyticsPage } from '@/pages/dashboard/EnterpriseAnalyticsPage';

import { ProductionPlanningPage } from '@/pages/dashboard/ProductionPlanningPage';
import { WorkOrdersPage } from '@/pages/dashboard/WorkOrdersPage';
import { BatchesPage } from '@/pages/dashboard/BatchesPage';
import { ShopFloorPage } from '@/pages/dashboard/ShopFloorPage';
import { ProductionReportsPage } from '@/pages/dashboard/ProductionReportsPage';
import { DowntimePage } from '@/pages/dashboard/DowntimePage';

import { PurchaseRequestsPage } from '@/pages/dashboard/PurchaseRequestsPage';
import { PurchaseOrdersPage } from '@/pages/dashboard/PurchaseOrdersPage';
import { RFQPage } from '@/pages/dashboard/RFQPage';
import { ApprovalsPage } from '@/pages/dashboard/ApprovalsPage';
import { VendorsPage } from '@/pages/dashboard/VendorsPage';
import { ContractsPage } from '@/pages/dashboard/ContractsPage';
import { SpendAnalysisPage } from '@/pages/dashboard/SpendAnalysisPage';

import { InventoryListPage } from '@/pages/dashboard/InventoryListPage';
import { GRNPage } from '@/pages/dashboard/GRNPage';
import { TransfersPage } from '@/pages/dashboard/TransfersPage';
import { DispatchPage } from '@/pages/dashboard/DispatchPage';
import { WarehouseReportsPage } from '@/pages/dashboard/WarehouseReportsPage';

import { AssetRegistryPage } from '@/pages/dashboard/AssetRegistryPage';
import { MaintenanceSchedulePage } from '@/pages/dashboard/MaintenanceSchedulePage';
import { BreakdownsPage } from '@/pages/dashboard/BreakdownsPage';
import { MaintenanceWorkOrdersPage } from '@/pages/dashboard/MaintenanceWorkOrdersPage';
import { AssetPerformancePage } from '@/pages/dashboard/AssetPerformancePage';

import { WorkforceEmployeesPage } from '@/pages/dashboard/WorkforceEmployeesPage';
import { AttendancePage } from '@/pages/dashboard/AttendancePage';
import { ShiftsPage } from '@/pages/dashboard/ShiftsPage';
import { SkillsPage } from '@/pages/dashboard/SkillsPage';
import { SafetyPage } from '@/pages/dashboard/SafetyPage';

import { InspectionsPage } from '@/pages/dashboard/InspectionsPage';
import { NCRPage } from '@/pages/dashboard/NCRPage';
import { CAPAPage } from '@/pages/dashboard/CAPAPage';
import { AuditsPage } from '@/pages/dashboard/AuditsPage';
import { QualityReportsPage } from '@/pages/dashboard/QualityReportsPage';

import { SupplierProfilePage } from '@/pages/dashboard/SupplierProfilePage';
import { ProductListingsPage } from '@/pages/dashboard/ProductListingsPage';
import { SupplierOrdersPage } from '@/pages/dashboard/SupplierOrdersPage';
import { SupplierContractsPage } from '@/pages/dashboard/SupplierContractsPage';
import { PaymentsPage } from '@/pages/dashboard/PaymentsPage';

import { BudgetPage } from '@/pages/dashboard/BudgetPage';
import { GSTPage } from '@/pages/dashboard/GSTPage';
import { CompliancePage } from '@/pages/dashboard/CompliancePage';
import { FinancialReportsPage } from '@/pages/dashboard/FinancialReportsPage';
import { AuditCenterPage } from '@/pages/dashboard/AuditCenterPage';

import { AdminOrgsPage } from '@/pages/dashboard/AdminOrgsPage';
import { SubscriptionsPage } from '@/pages/dashboard/SubscriptionsPage';
import { SecurityCenterPage } from '@/pages/dashboard/SecurityCenterPage';
import { PlatformAnalyticsPage } from '@/pages/dashboard/PlatformAnalyticsPage';
import { SystemHealthPage } from '@/pages/dashboard/SystemHealthPage';

// Main Enterprise Admin Dashboard
import {
  TrendingUp, TrendingDown, Package, Factory, Wrench, Users,
  AlertTriangle, CheckCircle2, Clock, ArrowRight, Activity,
  BarChart3, ShoppingCart, Cpu, Plus, Download, RefreshCw, Bot, Zap
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatusBadge } from '@/components/features/StatusBadge';
import { toast } from 'sonner';

const productionData = [
  { month: 'Jan', production: 820, target: 900 },
  { month: 'Feb', production: 870, target: 900 },
  { month: 'Mar', production: 910, target: 900 },
  { month: 'Apr', production: 940, target: 950 },
  { month: 'May', production: 925, target: 950 },
  { month: 'Jun', production: 980, target: 1000 },
];

const inventoryData = [
  { name: 'Raw Materials', value: 35, color: '#1E40AF' },
  { name: 'WIP', value: 25, color: '#F97316' },
  { name: 'Finished Goods', value: 30, color: '#10B981' },
  { name: 'Consumables', value: 10, color: '#8B5CF6' },
];

const ALERTS = [
  { id: 1, type: 'warning', message: 'Machine #A204 vibration above threshold', time: '5 min ago' },
  { id: 2, type: 'error', message: 'Stock alert: Bearing housing below reorder point', time: '12 min ago' },
  { id: 3, type: 'success', message: 'PO-7821 approved and sent to supplier', time: '28 min ago' },
  { id: 4, type: 'warning', message: 'Maintenance due: Hydraulic Press Line B', time: '1 hr ago' },
];

const METRICS = [
  { label: 'Production Rate', value: '98.4%', change: '+2.1%', trend: 'up', icon: Factory, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Active Orders', value: '1,247', change: '+14', trend: 'up', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Inventory Value', value: '$4.2M', change: '-$142K', trend: 'down', icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { label: 'Equipment Health', value: '96.2%', change: '+0.8%', trend: 'up', icon: Wrench, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Workforce Active', value: '1,840', change: '+12', trend: 'up', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { label: 'IIoT Sensors', value: '847', change: '2 offline', trend: 'down', icon: Cpu, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

const WORK_ORDERS = [
  { id: 'WO-4421', product: 'Steel Shaft Assembly', line: 'Line A', progress: 78, qty: 500, due: 'Jun 3' },
  { id: 'WO-4422', product: 'Hydraulic Cylinder', line: 'Line B', progress: 45, qty: 200, due: 'Jun 4' },
  { id: 'WO-4423', product: 'Bearing Housing', line: 'Line C', progress: 100, qty: 750, due: 'Jun 2' },
  { id: 'WO-4424', product: 'Pump Impeller', line: 'Line A', progress: 12, qty: 300, due: 'Jun 6' },
];

const AI_INSIGHTS = [
  { type: 'forecast', text: 'Demand for Steel Shaft Assembly projected to increase 18% in Q3. Consider advancing PO-7826 by 2 weeks.' },
  { type: 'alert', text: 'Machine CNC-12 shows early signs of bearing failure. Preventive replacement recommended within 14 days.' },
  { type: 'optimize', text: 'Line C idle 4h daily. Reassigning 2 operators from Line D could improve overall OEE by 3.2%.' },
];

function EnterpriseAdminDashboard({ user }: { user: any }) {
  const [timeRange, setTimeRange] = useState('6M');
  const [alerts, setAlerts] = useState(ALERTS);

  const dismissAlert = (id: number) => { setAlerts(p => p.filter(a => a.id !== id)); toast.success('Alert dismissed'); };

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Good morning, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.company} · Enterprise Admin · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <Activity className="h-3.5 w-3.5" />All Systems Live
          </div>
          <button onClick={() => toast.success('New Work Order created')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-brand">
            <Plus className="h-4 w-4" />New Work Order
          </button>
          <button onClick={() => toast.info('Refreshing dashboard...')}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="h-4 w-4 text-blue-500" />
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">AI COPILOT — 3 New Insights</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {AI_INSIGHTS.map((ins, i) => (
            <div key={i} className="bg-background/60 rounded-lg p-3 flex gap-2.5">
              <Zap className={`h-4 w-4 shrink-0 mt-0.5 ${ins.type === 'alert' ? 'text-amber-500' : ins.type === 'forecast' ? 'text-blue-500' : 'text-emerald-500'}`} />
              <p className="text-xs text-muted-foreground leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {METRICS.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => toast.info(`Viewing ${m.label} details`)}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`h-3.5 w-3.5 ${m.color}`} />
                </div>
              </div>
              <p className="text-lg font-bold text-foreground">{m.value}</p>
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
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Production vs Target</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly output comparison</p>
            </div>
            <div className="flex gap-1">
              {['3M', '6M', '1Y'].map(r => (
                <button key={r} onClick={() => { setTimeRange(r); toast.info(`Showing ${r} data`); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${timeRange === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={productionData}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="target" stroke="hsl(var(--border))" strokeDasharray="4 4" fill="none" strokeWidth={1.5} />
              <Area type="monotone" dataKey="production" stroke="#1E40AF" fill="url(#prodGrad)" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-1">Inventory Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">By category — $4.2M total</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={inventoryData} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={35} paddingAngle={3}>
                {inventoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {inventoryData.map(d => (
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

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">Active Work Orders</h3>
            <button onClick={() => toast.info('Opening full work orders list')} className="flex items-center gap-1 text-xs text-primary hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {WORK_ORDERS.map(wo => (
              <div key={wo.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => toast.info(`Opening ${wo.id}`)}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{wo.id}</span>
                    <span className="text-xs font-medium text-foreground">{wo.product}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{wo.line}</span>
                    <StatusBadge variant={wo.progress === 100 ? 'success' : wo.progress < 20 ? 'warning' : 'default'} size="sm">
                      {wo.progress === 100 ? 'Done' : `${wo.progress}%`}
                    </StatusBadge>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${wo.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${wo.progress}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">Qty: {wo.qty.toLocaleString()} units</span>
                  <span className="text-[10px] text-muted-foreground">Due: {wo.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">System Alerts</h3>
            <StatusBadge variant="warning" size="sm">{alerts.length} Active</StatusBadge>
          </div>
          <div className="divide-y divide-border">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-sm font-medium text-foreground">All clear!</p>
              </div>
            ) : alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${alert.type === 'warning' ? 'bg-amber-500/10' : alert.type === 'error' ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                  {alert.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <AlertTriangle className={`h-3.5 w-3.5 ${alert.type === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" />{alert.time}</p>
                </div>
                <button onClick={() => dismissAlert(alert.id)} className="text-[10px] text-red-500 hover:underline shrink-0">Dismiss</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Route → Component mapping ──
function useDashboardPage(user: NonNullable<ReturnType<typeof useAuth>['user']>) {
  const location = useLocation();
  const path = location.pathname;

  // Global modules
  if (path === '/dashboard/notifications') return <NotificationsPage user={user} />;
  if (path === '/dashboard/messages') return <MessagesPage user={user} />;
  if (path === '/dashboard/ai-assistant') return <AIAssistantPage user={user} />;
  if (path === '/dashboard/activity') return <ActivityPage user={user} />;
  if (path === '/dashboard/reports') return <ReportsPage user={user} />;
  if (path === '/dashboard/help') return <HelpPage user={user} />;
  if (path === '/dashboard/support') return <SupportPage user={user} />;
  if (path === '/dashboard/settings') return <DashboardSettingsPage user={user} />;

  // Enterprise admin
  if (path === '/dashboard/organizations') return <OrganizationsPage user={user} />;
  if (path === '/dashboard/plants') return <PlantsPage user={user} />;
  if (path === '/dashboard/departments') return <DepartmentsPage user={user} />;
  if (path === '/dashboard/employees') return <EmployeesPage user={user} />;
  if (path === '/dashboard/access') return <AccessControlPage user={user} />;
  if (path === '/dashboard/analytics') return <EnterpriseAnalyticsPage user={user} />;

  // Production
  if (path === '/dashboard/production/planning' || path === '/dashboard/production/scheduling' || path === '/dashboard/production/capacity') return <ProductionPlanningPage user={user} />;
  if (path === '/dashboard/production/work-orders') return <WorkOrdersPage user={user} />;
  if (path === '/dashboard/production/batches') return <BatchesPage user={user} />;
  if (path === '/dashboard/production/shop-floor') return <ShopFloorPage user={user} />;
  if (path === '/dashboard/production/reports') return <ProductionReportsPage user={user} />;
  if (path === '/dashboard/production/downtime') return <DowntimePage user={user} />;

  // Procurement
  if (path === '/dashboard/procurement/requests') return <PurchaseRequestsPage user={user} />;
  if (path === '/dashboard/procurement/orders') return <PurchaseOrdersPage user={user} />;
  if (path === '/dashboard/procurement/rfq') return <RFQPage user={user} />;
  if (path === '/dashboard/procurement/approvals') return <ApprovalsPage user={user} />;
  if (path === '/dashboard/procurement/vendors' || path === '/dashboard/procurement/vendor-performance') return <VendorsPage user={user} />;
  if (path === '/dashboard/procurement/contracts') return <ContractsPage user={user} />;
  if (path === '/dashboard/procurement/spend' || path === '/dashboard/procurement/analytics') return <SpendAnalysisPage user={user} />;

  // Warehouse
  if (path === '/dashboard/warehouse/inventory' || path === '/dashboard/warehouse/add-inventory' || path === '/dashboard/warehouse/batches') return <InventoryListPage user={user} />;
  if (path === '/dashboard/warehouse/grn') return <GRNPage user={user} />;
  if (path === '/dashboard/warehouse/transfers') return <TransfersPage user={user} />;
  if (path === '/dashboard/warehouse/dispatch') return <DispatchPage user={user} />;
  if (path === '/dashboard/warehouse/reports' || path === '/dashboard/warehouse/audits') return <WarehouseReportsPage user={user} />;

  // Maintenance
  if (path === '/dashboard/maintenance/assets' || path === '/dashboard/maintenance/asset-profiles') return <AssetRegistryPage user={user} />;
  if (path === '/dashboard/maintenance/schedule' || path === '/dashboard/maintenance/preventive' || path === '/dashboard/maintenance/sensors') return <MaintenanceSchedulePage user={user} />;
  if (path === '/dashboard/maintenance/breakdowns') return <BreakdownsPage user={user} />;
  if (path === '/dashboard/maintenance/work-orders') return <MaintenanceWorkOrdersPage user={user} />;
  if (path === '/dashboard/maintenance/performance' || path === '/dashboard/maintenance/failure-analysis') return <AssetPerformancePage user={user} />;

  // Workforce
  if (path === '/dashboard/workforce/employees') return <WorkforceEmployeesPage user={user} />;
  if (path === '/dashboard/workforce/attendance') return <AttendancePage user={user} />;
  if (path === '/dashboard/workforce/shifts') return <ShiftsPage user={user} />;
  if (path === '/dashboard/workforce/skills' || path === '/dashboard/workforce/certifications' || path === '/dashboard/workforce/productivity') return <SkillsPage user={user} />;
  if (path === '/dashboard/workforce/safety' || path === '/dashboard/workforce/compliance') return <SafetyPage user={user} />;

  // Quality
  if (path === '/dashboard/quality/inspections' || path === '/dashboard/quality/create-inspection' || path === '/dashboard/quality/supplier-qc') return <InspectionsPage user={user} />;
  if (path === '/dashboard/quality/ncr' || path === '/dashboard/quality/defects') return <NCRPage user={user} />;
  if (path === '/dashboard/quality/capa') return <CAPAPage user={user} />;
  if (path === '/dashboard/quality/audits') return <AuditsPage user={user} />;
  if (path === '/dashboard/quality/reports') return <QualityReportsPage user={user} />;

  // Supplier
  if (path === '/dashboard/supplier/profile') return <SupplierProfilePage user={user} />;
  if (path === '/dashboard/supplier/products' || path === '/dashboard/supplier/add-product') return <ProductListingsPage user={user} />;
  if (path === '/dashboard/supplier/orders' || path === '/dashboard/supplier/fulfillment' || path === '/dashboard/supplier/tracking') return <SupplierOrdersPage user={user} />;
  if (path === '/dashboard/supplier/contracts') return <SupplierContractsPage user={user} />;
  if (path === '/dashboard/supplier/payments' || path === '/dashboard/supplier/performance') return <PaymentsPage user={user} />;

  // Finance
  if (path === '/dashboard/finance/budget') return <BudgetPage user={user} />;
  if (path === '/dashboard/finance/gst') return <GSTPage user={user} />;
  if (path === '/dashboard/finance/compliance' || path === '/dashboard/finance/regulatory' || path === '/dashboard/finance/erp') return <CompliancePage user={user} />;
  if (path === '/dashboard/finance/reports') return <FinancialReportsPage user={user} />;
  if (path === '/dashboard/finance/audit') return <AuditCenterPage user={user} />;

  // Super Admin
  if (path === '/dashboard/admin/organizations') return <AdminOrgsPage user={user} />;
  if (path === '/dashboard/admin/subscriptions') return <SubscriptionsPage user={user} />;
  if (path === '/dashboard/admin/security' || path === '/dashboard/admin/threats' || path === '/dashboard/admin/audit') return <SecurityCenterPage user={user} />;
  if (path === '/dashboard/admin/analytics') return <PlatformAnalyticsPage user={user} />;
  if (path === '/dashboard/admin/health' || path === '/dashboard/admin/compliance') return <SystemHealthPage user={user} />;

  // Role main dashboards (also handles /dashboard/production, /dashboard/supply-chain, etc.)
  return null;
}

export default function Dashboard() {
  useScrollTop();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  const SubPage = useDashboardPage(user);

  const renderMainDashboard = () => {
    switch (user.role) {
      case 'production_manager': return <ProductionDashboard user={user} />;
      case 'procurement_manager': return <ProcurementDashboard user={user} />;
      case 'warehouse_manager': return <WarehouseDashboard user={user} />;
      case 'maintenance_engineer': return <MaintenanceDashboard user={user} />;
      case 'supplier': return <SupplierDashboard user={user} />;
      case 'finance_officer': return <FinanceDashboard user={user} />;
      case 'super_admin': return <SuperAdminDashboard user={user} />;
      case 'workforce_manager': return <WorkforceDashboard user={user} />;
      case 'quality_manager': return <QualityDashboard user={user} />;
      case 'enterprise_admin':
      default: return <EnterpriseAdminDashboard user={user} />;
    }
  };

  return (
    <DashboardLayout>
      {SubPage ?? renderMainDashboard()}
    </DashboardLayout>
  );
}
