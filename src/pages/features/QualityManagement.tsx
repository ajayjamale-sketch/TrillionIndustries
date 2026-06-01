import { FeaturePageTemplate } from '@/components/features/FeaturePageTemplate';
import { ShieldCheck, Search, FileText, CheckSquare } from 'lucide-react';

export default function QualityManagement() {
  return (
    <FeaturePageTemplate
      title="Quality Management"
      subtitle="(QMS)"
      heroDescription="Ensure every product meets exact specifications. Automate inspections, manage CAPAs, and maintain rigorous digital traceability."
      capabilities={[
        { icon: CheckSquare, title: 'Digital Inspections', description: 'Replace paper checklists with tablet-friendly digital inspection forms.' },
        { icon: Search, title: 'Defect Tracking', description: 'Log, categorize, and track defects with photographic evidence.' },
        { icon: ShieldCheck, title: 'CAPA Management', description: 'Automate Corrective and Preventive Action workflows to resolve systemic issues.' },
        { icon: FileText, title: 'Compliance & Audit', description: 'Maintain complete digital histories for FDA, ISO, and customer audits.' },
      ]}
      benefits={[
        { metric: '-60%', label: 'Escaped Defects', icon: Search },
        { metric: '+40%', label: 'First Pass Yield', icon: ShieldCheck },
        { metric: '100%', label: 'Traceability', icon: FileText },
      ]}
      workflows={[
        { title: 'Define Standards', description: 'Set quality parameters and acceptable tolerances.' },
        { title: 'Inspect & Test', description: 'Operators log quality data during production runs.' },
        { title: 'Analyze & Improve', description: 'Use pareto charts to identify and eliminate root causes.' },
      ]}
    />
  );
}
