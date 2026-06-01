import { FeaturePageTemplate } from '@/components/features/FeaturePageTemplate';
import { Cpu, Wifi, HardDrive, Shield } from 'lucide-react';

export default function IIoTIntegration() {
  return (
    <FeaturePageTemplate
      title="Industrial IoT"
      subtitle="(IIoT) Integration"
      heroDescription="Bridge the gap between physical machines and digital systems. Connect PLCs, sensors, and legacy equipment to the cloud securely."
      capabilities={[
        { icon: Cpu, title: 'Edge Computing', description: 'Process high-frequency data locally to reduce latency and bandwidth usage.' },
        { icon: Wifi, title: 'Universal Connectivity', description: 'Support for OPC-UA, MQTT, Modbus, and proprietary legacy protocols.' },
        { icon: HardDrive, title: 'Data Lake Integration', description: 'Store massive volumes of time-series data for historical analysis and AI training.' },
        { icon: Shield, title: 'Enterprise Security', description: 'End-to-end encryption and zero-trust network architecture for your factory floor.' },
      ]}
      benefits={[
        { metric: '100k+', label: 'Events Per Second', icon: Cpu },
        { metric: '<10ms', label: 'Latency', icon: Wifi },
        { metric: 'Zero', label: 'Security Breaches', icon: Shield },
      ]}
      workflows={[
        { title: 'Deploy Edge Devices', description: 'Install our secure edge gateways on your factory floor.' },
        { title: 'Map Tags', description: 'Map PLC tags to our standardized digital twin schemas.' },
        { title: 'Stream Data', description: 'Visualize live machine telemetry instantly in the dashboard.' },
      ]}
    />
  );
}
