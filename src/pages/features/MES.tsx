import { FeaturePageTemplate } from '@/components/features/FeaturePageTemplate';
import { Factory, Activity, MonitorPlay, AlertTriangle } from 'lucide-react';

export default function MES() {
  return (
    <FeaturePageTemplate
      title="Manufacturing Execution System"
      subtitle="(MES)"
      heroDescription="Digitize your shop floor, optimize production scheduling, and monitor overall equipment effectiveness (OEE) in real-time."
      capabilities={[
        { icon: Factory, title: 'Production Scheduling', description: 'Dynamically schedule production runs based on machine availability and priority.' },
        { icon: Activity, title: 'Real-time OEE Tracking', description: 'Monitor availability, performance, and quality metrics live from the shop floor.' },
        { icon: MonitorPlay, title: 'Digital Work Instructions', description: 'Provide operators with interactive, up-to-date procedures directly at their stations.' },
        { icon: AlertTriangle, title: 'Downtime Analysis', description: 'Automatically categorize and analyze the root causes of machine downtime.' },
      ]}
      benefits={[
        { metric: '+34%', label: 'OEE Improvement', icon: Activity },
        { metric: '-25%', label: 'Scrap Reduction', icon: Factory },
        { metric: '99%', label: 'Traceability', icon: MonitorPlay },
      ]}
      workflows={[
        { title: 'Connect Machines', description: 'Integrate PLCs to stream real-time telemetry.' },
        { title: 'Define Routings', description: 'Set up your Bill of Materials and manufacturing steps.' },
        { title: 'Execute & Monitor', description: 'Operators log progress while managers oversee live metrics.' },
      ]}
    />
  );
}
