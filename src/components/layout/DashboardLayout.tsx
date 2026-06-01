import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Factory, Network, ShoppingCart, Package,
  Wrench, Users, Cpu, ShieldCheck, BarChart3, Store, DollarSign,
  Settings, Bell, Menu, X, ChevronDown, ChevronRight, LogOut,
  User as UserIcon, Sun, Moon, Search, Activity, Building2, Layers,
  ClipboardList, Calendar, Truck, FileText, AlertTriangle, Target,
  TrendingUp, HardDrive, Clock, Award, BookOpen, MessageSquare,
  Bot, History, HelpCircle, LifeBuoy, Download, Globe, Lock,
  Shield, CreditCard, PieChart, Zap, MapPin, CheckSquare,
  Briefcase, UserCheck, AlertOctagon, Gauge, List, Plus, Eye,
  ArrowUpRight, Inbox
} from 'lucide-react';
import { useThemeContext } from '@/components/features/ThemeProvider';
import { useAuth, ROLE_LABELS } from '@/hooks/useAuth';
import { cn, getInitials } from '@/lib/utils';
import { UserRole } from '@/types';

// ──────────────────────────────────────────────
// Role-based navigation config
// ──────────────────────────────────────────────
type NavSection = { label: string; items: NavItem[] };
type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
};

const GLOBAL_BOTTOM: NavItem[] = [
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: '4' },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  { label: 'Activity Logs', href: '/dashboard/activity', icon: History },
  { label: 'Reports & Exports', href: '/dashboard/reports', icon: Download },
  { label: 'Help Center', href: '/dashboard/help', icon: HelpCircle },
  { label: 'Support Tickets', href: '/dashboard/support', icon: LifeBuoy },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function getRoleNav(role: UserRole): NavSection[] {
  switch (role) {
    case 'enterprise_admin':
      return [
        {
          label: 'Overview', items: [
            { label: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Organization', items: [
            { label: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
            { label: 'Plant Management', href: '/dashboard/plants', icon: Factory },
            { label: 'Departments', href: '/dashboard/departments', icon: Layers },
            { label: 'Employees', href: '/dashboard/employees', icon: Users },
            { label: 'User Access (RBAC)', href: '/dashboard/access', icon: Shield },
          ]
        },
        {
          label: 'Operations', items: [
            { label: 'Production', href: '/dashboard/production', icon: Factory },
            { label: 'Supply Chain', href: '/dashboard/supply-chain', icon: Network },
            { label: 'Procurement', href: '/dashboard/procurement', icon: ShoppingCart },
            { label: 'Inventory', href: '/dashboard/inventory', icon: Package },
            { label: 'Asset Management', href: '/dashboard/assets', icon: Wrench },
            { label: 'Workforce', href: '/dashboard/workforce', icon: Users },
            { label: 'IIoT Monitoring', href: '/dashboard/iiot', icon: Cpu },
            { label: 'Quality', href: '/dashboard/quality', icon: ShieldCheck },
          ]
        },
        {
          label: 'Analytics', items: [
            { label: 'Enterprise Analytics', href: '/dashboard/analytics', icon: BarChart3 },
            { label: 'Financial Analytics', href: '/dashboard/finance', icon: DollarSign },
            { label: 'B2B Marketplace', href: '/dashboard/marketplace', icon: Store },
          ]
        },
      ];

    case 'production_manager':
      return [
        {
          label: 'Overview', items: [
            { label: 'Production Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Planning', items: [
            { label: 'Production Planning', href: '/dashboard/production/planning', icon: Calendar },
            { label: 'Scheduling Board', href: '/dashboard/production/scheduling', icon: ClipboardList },
            { label: 'Capacity Planning', href: '/dashboard/production/capacity', icon: Gauge },
          ]
        },
        {
          label: 'Execution', items: [
            { label: 'Work Orders', href: '/dashboard/production/work-orders', icon: FileText },
            { label: 'Batch Management', href: '/dashboard/production/batches', icon: Layers },
            { label: 'Shop Floor Monitor', href: '/dashboard/production/shop-floor', icon: Activity },
          ]
        },
        {
          label: 'Quality & Reports', items: [
            { label: 'Production Reports', href: '/dashboard/production/reports', icon: BarChart3 },
            { label: 'Downtime Analysis', href: '/dashboard/production/downtime', icon: AlertTriangle },
          ]
        },
      ];

    case 'procurement_manager':
      return [
        {
          label: 'Overview', items: [
            { label: 'Procurement Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Procurement', items: [
            { label: 'Purchase Requests', href: '/dashboard/procurement/requests', icon: Plus },
            { label: 'Purchase Orders', href: '/dashboard/procurement/orders', icon: ShoppingCart },
            { label: 'RFQ Management', href: '/dashboard/procurement/rfq', icon: FileText },
            { label: 'Approval Workflow', href: '/dashboard/procurement/approvals', icon: CheckSquare },
          ]
        },
        {
          label: 'Vendors', items: [
            { label: 'Vendor Profiles', href: '/dashboard/procurement/vendors', icon: Building2 },
            { label: 'Vendor Performance', href: '/dashboard/procurement/vendor-performance', icon: TrendingUp },
            { label: 'Contract Management', href: '/dashboard/procurement/contracts', icon: Briefcase },
          ]
        },
        {
          label: 'Analytics', items: [
            { label: 'Spend Analysis', href: '/dashboard/procurement/spend', icon: BarChart3 },
            { label: 'Supplier Analytics', href: '/dashboard/procurement/analytics', icon: PieChart },
          ]
        },
      ];

    case 'warehouse_manager':
      return [
        {
          label: 'Overview', items: [
            { label: 'Warehouse Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Inventory', items: [
            { label: 'Inventory List', href: '/dashboard/warehouse/inventory', icon: Package },
            { label: 'Add Inventory', href: '/dashboard/warehouse/add-inventory', icon: Plus },
            { label: 'Batch & Lot Tracking', href: '/dashboard/warehouse/batches', icon: List },
          ]
        },
        {
          label: 'Operations', items: [
            { label: 'Goods Receiving (GRN)', href: '/dashboard/warehouse/grn', icon: Truck },
            { label: 'Stock Transfers', href: '/dashboard/warehouse/transfers', icon: ArrowUpRight },
            { label: 'Dispatch Management', href: '/dashboard/warehouse/dispatch', icon: MapPin },
          ]
        },
        {
          label: 'Reports', items: [
            { label: 'Inventory Reports', href: '/dashboard/warehouse/reports', icon: BarChart3 },
            { label: 'Audit Reports', href: '/dashboard/warehouse/audits', icon: Eye },
          ]
        },
      ];

    case 'maintenance_engineer':
      return [
        {
          label: 'Overview', items: [
            { label: 'Maintenance Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Assets', items: [
            { label: 'Asset Registry', href: '/dashboard/maintenance/assets', icon: HardDrive },
            { label: 'Asset Profiles', href: '/dashboard/maintenance/asset-profiles', icon: FileText },
            { label: 'IIoT Sensors', href: '/dashboard/maintenance/sensors', icon: Cpu },
          ]
        },
        {
          label: 'Maintenance', items: [
            { label: 'Maintenance Schedule', href: '/dashboard/maintenance/schedule', icon: Calendar },
            { label: 'Preventive PM', href: '/dashboard/maintenance/preventive', icon: ShieldCheck },
            { label: 'Breakdown Tickets', href: '/dashboard/maintenance/breakdowns', icon: AlertOctagon },
            { label: 'Work Orders', href: '/dashboard/maintenance/work-orders', icon: ClipboardList },
          ]
        },
        {
          label: 'Performance', items: [
            { label: 'Asset Performance', href: '/dashboard/maintenance/performance', icon: BarChart3 },
            { label: 'Failure Analysis', href: '/dashboard/maintenance/failure-analysis', icon: AlertTriangle },
          ]
        },
      ];

    case 'workforce_manager':
      return [
        {
          label: 'Overview', items: [
            { label: 'Workforce Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'People', items: [
            { label: 'Employee Directory', href: '/dashboard/workforce/employees', icon: Users },
            { label: 'Skill Matrix', href: '/dashboard/workforce/skills', icon: Award },
            { label: 'Certifications', href: '/dashboard/workforce/certifications', icon: BookOpen },
          ]
        },
        {
          label: 'Operations', items: [
            { label: 'Attendance', href: '/dashboard/workforce/attendance', icon: UserCheck },
            { label: 'Shift Scheduling', href: '/dashboard/workforce/shifts', icon: Clock },
            { label: 'Productivity Tracking', href: '/dashboard/workforce/productivity', icon: TrendingUp },
          ]
        },
        {
          label: 'Compliance', items: [
            { label: 'Safety Compliance', href: '/dashboard/workforce/safety', icon: Shield },
            { label: 'Compliance Reports', href: '/dashboard/workforce/compliance', icon: FileText },
          ]
        },
      ];

    case 'quality_manager':
      return [
        {
          label: 'Overview', items: [
            { label: 'Quality Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Inspections', items: [
            { label: 'Create Inspection', href: '/dashboard/quality/create-inspection', icon: Plus },
            { label: 'Inspection Results', href: '/dashboard/quality/inspections', icon: CheckSquare },
            { label: 'Supplier QC', href: '/dashboard/quality/supplier-qc', icon: Building2 },
          ]
        },
        {
          label: 'Issues & Actions', items: [
            { label: 'Non-Conformance (NCR)', href: '/dashboard/quality/ncr', icon: AlertOctagon },
            { label: 'CAPA Management', href: '/dashboard/quality/capa', icon: Target },
            { label: 'Defect Tracking', href: '/dashboard/quality/defects', icon: AlertTriangle },
          ]
        },
        {
          label: 'Audits & Reports', items: [
            { label: 'Compliance Audits', href: '/dashboard/quality/audits', icon: Shield },
            { label: 'Quality Reports', href: '/dashboard/quality/reports', icon: BarChart3 },
          ]
        },
      ];

    case 'supplier':
      return [
        {
          label: 'Overview', items: [
            { label: 'Vendor Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Business', items: [
            { label: 'Company Profile', href: '/dashboard/supplier/profile', icon: Building2 },
            { label: 'Product Listings', href: '/dashboard/supplier/products', icon: Package },
            { label: 'Add Product', href: '/dashboard/supplier/add-product', icon: Plus },
          ]
        },
        {
          label: 'Orders', items: [
            { label: 'Incoming Orders', href: '/dashboard/supplier/orders', icon: Inbox },
            { label: 'Order Fulfillment', href: '/dashboard/supplier/fulfillment', icon: CheckSquare },
            { label: 'Delivery Tracking', href: '/dashboard/supplier/tracking', icon: Truck },
          ]
        },
        {
          label: 'Finance', items: [
            { label: 'Contract Management', href: '/dashboard/supplier/contracts', icon: Briefcase },
            { label: 'Payment History', href: '/dashboard/supplier/payments', icon: CreditCard },
            { label: 'Performance Score', href: '/dashboard/supplier/performance', icon: TrendingUp },
          ]
        },
      ];

    case 'finance_officer':
      return [
        {
          label: 'Overview', items: [
            { label: 'Finance Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        },
        {
          label: 'Finance', items: [
            { label: 'Budget Management', href: '/dashboard/finance/budget', icon: DollarSign },
            { label: 'GST & Tax', href: '/dashboard/finance/gst', icon: FileText },
            { label: 'Accounts Payable', href: '/dashboard/finance/payable', icon: CreditCard },
            { label: 'Accounts Receivable', href: '/dashboard/finance/receivable', icon: ArrowUpRight },
          ]
        },
        {
          label: 'Compliance', items: [
            { label: 'Compliance Center', href: '/dashboard/finance/compliance', icon: ShieldCheck },
            { label: 'Audit Center', href: '/dashboard/finance/audit', icon: Eye },
            { label: 'Regulatory Reports', href: '/dashboard/finance/regulatory', icon: Globe },
          ]
        },
        {
          label: 'Reports', items: [
            { label: 'Financial Reports', href: '/dashboard/finance/reports', icon: BarChart3 },
            { label: 'ERP Integration', href: '/dashboard/finance/erp', icon: Network },
          ]
        },
      ];

    case 'super_admin':
      return [
        {
          label: 'Platform', items: [
            { label: 'Platform Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { label: 'Org Monitoring', href: '/dashboard/admin/organizations', icon: Building2 },
            { label: 'Subscription Mgmt', href: '/dashboard/admin/subscriptions', icon: CreditCard },
          ]
        },
        {
          label: 'Security', items: [
            { label: 'Security Center', href: '/dashboard/admin/security', icon: Lock },
            { label: 'Threat Detection', href: '/dashboard/admin/threats', icon: AlertOctagon },
            { label: 'Audit Logs', href: '/dashboard/admin/audit', icon: History },
          ]
        },
        {
          label: 'Compliance', items: [
            { label: 'Compliance Monitor', href: '/dashboard/admin/compliance', icon: ShieldCheck },
            { label: 'Platform Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
            { label: 'System Health', href: '/dashboard/admin/health', icon: Activity },
          ]
        },
      ];

    default:
      return [{ label: 'Overview', items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] }];
  }
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const { theme, toggleTheme } = useThemeContext();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const roleNav = user ? getRoleNav(user.role) : [];

  useEffect(() => {
    setMobileSidebarOpen(false);
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const toggleSection = (label: string) => {
    setExpandedSections(p => ({ ...p, [label]: !p[label] }));
  };

  const isActive = (href: string) =>
    href === '/dashboard' ? location.pathname === href : location.pathname === href || location.pathname.startsWith(href + '/');

  const NOTIFICATIONS = [
    { id: 1, type: 'warning', title: 'Machine #A204 Alert', msg: 'Vibration above threshold', time: '5m ago', read: false },
    { id: 2, type: 'error', title: 'Low Stock Alert', msg: 'Bearing housing below reorder point', time: '12m ago', read: false },
    { id: 3, type: 'success', title: 'PO-7821 Approved', msg: 'Order sent to SteelPro Ltd.', time: '28m ago', read: false },
    { id: 4, type: 'info', title: 'Maintenance Due', msg: 'Hydraulic Press Line B — scheduled today', time: '1h ago', read: true },
  ];

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => {
    const expanded = mobile || sidebarOpen;
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-[60px] border-b border-sidebar-border shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-brand shrink-0">
            <Factory className="h-4 w-4 text-white" />
          </div>
          {expanded && (
            <span className="font-bold text-[15px] text-white tracking-tight whitespace-nowrap overflow-hidden">
              Trillion<span className="text-blue-400">Industries</span>
            </span>
          )}
        </div>

        {/* User Role Badge */}
        {expanded && user && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-xl bg-sidebar-accent border border-sidebar-border">
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Signed in as</p>
            <p className="text-xs font-bold text-white mt-0.5 truncate">{ROLE_LABELS[user.role]}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin space-y-4">
          {roleNav.map(section => (
            <div key={section.label}>
              {expanded && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => mobile && setMobileSidebarOpen(false)}
                      title={!expanded ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative',
                        active
                          ? 'bg-blue-600/20 text-white'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
                      )}
                    >
                      <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-blue-400' : 'text-sidebar-foreground/60 group-hover:text-white')} />
                      {expanded && (
                        <>
                          <span className="text-sm flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-bold bg-accent text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{item.badge}</span>
                          )}
                          {active && <span className="w-1 h-4 rounded-full bg-blue-400 absolute right-2" />}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Global modules */}
          {expanded && (
            <div>
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">Global</p>
              <div className="space-y-0.5">
                {GLOBAL_BOTTOM.map(item => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => mobile && setMobileSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                        active ? 'bg-blue-600/20 text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
                      )}
                    >
                      <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-blue-400' : 'text-sidebar-foreground/60 group-hover:text-white')} />
                      <span className="text-sm flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-accent text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          {!expanded && (
            <div className="space-y-0.5 border-t border-sidebar-border pt-2">
              {GLOBAL_BOTTOM.slice(0, 4).map(item => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} title={item.label}
                    className="flex items-center justify-center py-2.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-white transition-colors relative">
                    <Icon className="h-[18px] w-[18px]" />
                    {item.badge && <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User Section */}
        {user && (
          <div className="shrink-0 p-2.5 border-t border-sidebar-border">
            {sidebarOpen || mobile ? (
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-sidebar-accent transition-colors cursor-pointer"
                onClick={() => navigate('/profile')}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-sidebar-foreground/50 truncate">{user.email}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                  className="p-1 rounded-lg hover:bg-red-500/20 text-sidebar-foreground/50 hover:text-red-400 transition-colors shrink-0">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center py-1">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => navigate('/profile')} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer" onClick={() => navigate('/profile')}>
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-[hsl(var(--sidebar-background))] shrink-0 transition-all duration-300 border-r border-sidebar-border',
        sidebarOpen ? 'w-[240px]' : 'w-[56px]'
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-64 bg-[hsl(var(--sidebar-background))] flex flex-col z-10 shadow-2xl">
            <button onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-3.5 right-3 p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent z-10">
              <X className="h-4 w-4" />
            </button>
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-[60px] border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-5 shrink-0 gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              onClick={() => { setSidebarOpen(v => !v); setMobileSidebarOpen(v => !v); }}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb path */}
            <div className="hidden md:flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Dashboard</span>
              {location.pathname !== '/dashboard' && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <span className="font-medium text-foreground capitalize">
                    {location.pathname.split('/').filter(Boolean).slice(1).join(' › ').replace(/-/g, ' ')}
                  </span>
                </>
              )}
            </div>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border w-56 ml-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input type="text" placeholder="Search modules, data..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1 min-w-0" />
              <kbd className="hidden lg:inline-flex items-center text-[10px] text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* System Status */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden lg:block">All Systems Operational</span>
            </div>

            {/* AI Assistant shortcut */}
            <Link to="/dashboard/ai-assistant"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-xs font-medium text-muted-foreground hover:text-foreground">
              <Bot className="h-3.5 w-3.5 text-blue-500" />
              <span className="hidden lg:block">AI Assistant</span>
            </Link>

            <button onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button onClick={() => setNotifOpen(v => !v)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <p className="font-semibold text-sm">Notifications</p>
                    <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="divide-y divide-border max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map(n => (
                      <div key={n.id} className={cn('flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer', !n.read && 'bg-primary/5')}>
                        <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500')} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.msg}</p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-border bg-muted/30">
                    <Link to="/dashboard/notifications" className="text-xs text-primary hover:underline font-medium">View all notifications →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {user ? getInitials(user.name) : 'U'}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium">{user?.name.split(' ')[0]}</span>
                <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-2xl shadow-xl py-1.5 z-50">
                  <div className="px-3.5 py-2.5 border-b border-border mb-1">
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                    <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                      {user ? ROLE_LABELS[user.role] : ''}
                    </span>
                  </div>
                  {[
                    { icon: UserIcon, label: 'My Profile', href: '/profile' },
                    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
                    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
                    { icon: HelpCircle, label: 'Help Center', href: '/dashboard/help' },
                  ].map(item => (
                    <Link key={item.href} to={item.href}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-muted transition-colors">
                      <item.icon className="h-4 w-4 text-muted-foreground" />{item.label}
                    </Link>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors">
                      <LogOut className="h-4 w-4" />Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
