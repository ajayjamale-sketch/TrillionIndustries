import { FeaturePageTemplate } from '@/components/features/FeaturePageTemplate';
import { Network, Globe2, Truck, ShieldAlert } from 'lucide-react';

export default function SupplyChain() {
  return (
    <FeaturePageTemplate
      title="Supply Chain Management"
      subtitle="(SCM)"
      heroDescription="Gain end-to-end visibility across your entire global logistics network. Anticipate delays and optimize routes automatically."
      capabilities={[
        { icon: Globe2, title: 'Global Visibility', description: 'Track shipments and supplier status across borders in real-time.' },
        { icon: Truck, title: 'Route Optimization', description: 'AI-driven logistics routing to minimize transit times and freight costs.' },
        { icon: ShieldAlert, title: 'Risk Management', description: 'Automated alerts for geopolitical, weather, or supplier-specific disruptions.' },
        { icon: Network, title: 'Multi-tier Supplier Mapping', description: 'Map out your Tier 1, 2, and 3 suppliers to uncover hidden dependencies.' },
      ]}
      benefits={[
        { metric: '-18%', label: 'Logistics Costs', icon: Truck },
        { metric: '95%', label: 'On-Time Delivery', icon: Globe2 },
        { metric: '360°', label: 'Network Visibility', icon: Network },
      ]}
      workflows={[
        { title: 'Onboard Vendors', description: 'Bring your logistics partners onto the unified platform.' },
        { title: 'Map Supply Lines', description: 'Define the nodes and edges of your global supply chain.' },
        { title: 'Monitor & Adapt', description: 'Watch live shipments and let AI reroute around disruptions.' },
      ]}
    />
  );
}
