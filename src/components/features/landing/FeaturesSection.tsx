import { Link } from 'react-router-dom';
import {
  Factory, Network, ShoppingCart, Package, Wrench, Users,
  Cpu, ShieldCheck, BarChart3, Store, DollarSign, Lock, ArrowRight
} from 'lucide-react';

const FEATURES = [
  { id: 'mes', icon: Factory, label: 'Manufacturing (MES)', desc: 'Production scheduling, work orders, shop floor monitoring, batch processing, and quality checks.', badge: 'Core', badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { id: 'supply', icon: Network, label: 'Supply Chain', desc: 'End-to-end visibility, supplier management, logistics coordination, and vendor performance tracking.', badge: 'Core', badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { id: 'procurement', icon: ShoppingCart, label: 'Procurement & Vendor', desc: 'Digital RFQ, purchase orders, vendor comparison, contract management, and approval automation.', badge: 'Core', badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { id: 'inventory', icon: Package, label: 'Inventory & Warehouse', desc: 'Industrial inventory control, RFID support, batch tracking, stock transfers, and material movement.', badge: 'Operations', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { id: 'assets', icon: Wrench, label: 'Asset Management', desc: 'Equipment registry, preventive maintenance, breakdown management, and performance monitoring.', badge: 'Operations', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { id: 'workforce', icon: Users, label: 'Workforce Management', desc: 'Employee records, attendance tracking, shift scheduling, productivity, and safety compliance.', badge: 'Operations', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { id: 'iiot', icon: Cpu, label: 'Industrial IoT (IIoT)', desc: 'Sensor integration, machine monitoring, real-time telemetry, predictive maintenance, and energy monitoring.', badge: 'Smart Factory', badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
  { id: 'quality', icon: ShieldCheck, label: 'Quality Management (QMS)', desc: 'Quality inspections, CAPA management, compliance audits, non-conformance handling, and QMS reporting.', badge: 'Smart Factory', badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
  { id: 'bi', icon: BarChart3, label: 'Business Intelligence', desc: 'Production analytics, demand forecasting, KPI dashboards, and strategic executive insights.', badge: 'Analytics', badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  { id: 'marketplace', icon: Store, label: 'B2B Marketplace', desc: 'Industrial marketplace, supplier listings, tender management, B2B networking, and lead generation.', badge: 'Commerce', badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
  { id: 'finance', icon: DollarSign, label: 'Finance & Compliance', desc: 'GST/tax management, financial reporting, budget control, ERP integration, and compliance monitoring.', badge: 'Commerce', badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
  { id: 'security', icon: Lock, label: 'Enterprise Security', desc: 'Multi-company RBAC, SSO, audit trails, department hierarchy management, and access controls.', badge: 'Security', badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — left-aligned with accent rail */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-primary rounded-sm" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Platform Modules</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                  12 Integrated Modules.<br />One Unified Platform.
                </h2>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-base leading-relaxed">
              From raw material intake to finished goods dispatch — every operation managed on a single connected system. No integrations required.
            </p>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore all modules <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                to={`/features#${feature.id}`}
                className="group bg-card p-5 hover:bg-muted/40 transition-colors duration-200 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors duration-200">
                    <Icon className="h-4.5 w-4.5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug">
                    {feature.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
