import { FeaturePageTemplate } from '@/components/features/FeaturePageTemplate';
import { Package, Layers, QrCode, ArrowDownUp } from 'lucide-react';

export default function Inventory() {
  return (
    <FeaturePageTemplate
      title="Inventory & Warehouse"
      subtitle="Management (WMS)"
      heroDescription="Eliminate stockouts and reduce carrying costs with AI-driven inventory tracking, intelligent slotting, and automated replenishment."
      capabilities={[
        { icon: Package, title: 'Real-time Stock Tracking', description: 'Monitor raw materials, WIP, and finished goods across multiple facilities.' },
        { icon: QrCode, title: 'Barcode & RFID Scanning', description: 'Seamlessly integrate with industrial scanners for instant data capture.' },
        { icon: Layers, title: 'Intelligent Slotting', description: 'Optimize warehouse layout based on velocity and pick frequency.' },
        { icon: ArrowDownUp, title: 'Automated Replenishment', description: 'Set dynamic reorder points driven by machine learning forecasts.' },
      ]}
      benefits={[
        { metric: '99.9%', label: 'Inventory Accuracy', icon: Package },
        { metric: '-30%', label: 'Carrying Costs', icon: ArrowDownUp },
        { metric: '+45%', label: 'Picking Speed', icon: Layers },
      ]}
      workflows={[
        { title: 'Inbound Logistics', description: 'Receive, scan, and put away goods efficiently.' },
        { title: 'Storage & Counting', description: 'Conduct cycle counts without pausing operations.' },
        { title: 'Pick, Pack, Ship', description: 'Fulfill orders with wave and batch picking strategies.' },
      ]}
    />
  );
}
