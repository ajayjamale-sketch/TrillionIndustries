import { FeaturePageTemplate } from '@/components/features/FeaturePageTemplate';
import { ShoppingCart, FileCheck, Users, Calculator } from 'lucide-react';

export default function Procurement() {
  return (
    <FeaturePageTemplate
      title="Procurement Automation"
      subtitle=""
      heroDescription="Transform your sourcing strategy. Automate purchase orders, track supplier performance, and optimize spend dynamically."
      capabilities={[
        { icon: ShoppingCart, title: 'Automated PO Generation', description: 'Trigger purchase orders automatically based on inventory thresholds or production schedules.' },
        { icon: FileCheck, title: 'Smart Approval Workflows', description: 'Route requisitions through customizable approval chains based on cost or department.' },
        { icon: Users, title: 'Vendor Scorecards', description: 'Evaluate suppliers on price, quality, and delivery speed.' },
        { icon: Calculator, title: 'Spend Analytics', description: 'Identify cost-saving opportunities by aggregating spend data across facilities.' },
      ]}
      benefits={[
        { metric: '-40%', label: 'Procurement Cycle Time', icon: ShoppingCart },
        { metric: '+15%', label: 'Cost Savings', icon: Calculator },
        { metric: '100%', label: 'Compliance Rate', icon: FileCheck },
      ]}
      workflows={[
        { title: 'Set Rules', description: 'Configure reorder points and approval hierarchies.' },
        { title: 'Source & Procure', description: 'Let the system generate RFQs and negotiate terms.' },
        { title: 'Receive & Pay', description: 'Automate 3-way matching for invoice processing.' },
      ]}
    />
  );
}
