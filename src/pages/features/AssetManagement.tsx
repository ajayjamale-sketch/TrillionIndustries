import { FeaturePageTemplate } from '@/components/features/FeaturePageTemplate';
import { Wrench, Settings, ClipboardList, PenTool } from 'lucide-react';

export default function AssetManagement() {
  return (
    <FeaturePageTemplate
      title="Asset Management"
      subtitle="(EAM)"
      heroDescription="Maximize the lifespan and ROI of your industrial equipment with predictive maintenance and comprehensive lifecycle tracking."
      capabilities={[
        { icon: Wrench, title: 'Predictive Maintenance', description: 'Leverage machine learning to predict failures before they disrupt production.' },
        { icon: Settings, title: 'Spare Parts Management', description: 'Automatically order spare parts when inventory runs low based on upcoming maintenance schedules.' },
        { icon: ClipboardList, title: 'Work Order Automation', description: 'Generate and assign digital work orders to technicians automatically.' },
        { icon: PenTool, title: 'Lifecycle Tracking', description: 'Monitor depreciation, warranty status, and total cost of ownership for every asset.' },
      ]}
      benefits={[
        { metric: '-50%', label: 'Unplanned Downtime', icon: Wrench },
        { metric: '+20%', label: 'Asset Lifespan', icon: Settings },
        { metric: '-15%', label: 'Maintenance Costs', icon: ClipboardList },
      ]}
      workflows={[
        { title: 'Register Assets', description: 'Input equipment details, manuals, and warranties.' },
        { title: 'Monitor Health', description: 'Use IIoT sensors to track vibration, temperature, and wear.' },
        { title: 'Execute Maintenance', description: 'Technicians receive alerts and step-by-step repair guides.' },
      ]}
    />
  );
}
