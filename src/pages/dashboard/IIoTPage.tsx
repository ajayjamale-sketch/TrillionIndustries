import { Cpu } from 'lucide-react';
import { User } from '@/types';

export function IIoTPage({ user }: { user: User }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">IIoT Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Industrial Internet of Things sensor network dashboard.</p>
      </div>

      <div className="flex flex-col items-center justify-center bg-card border border-border rounded-xl p-12 text-center h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
          <Cpu className="h-8 w-8 text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">IIoT Central Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          The central hub for all IIoT sensor data is under construction. Soon you will be able to monitor real-time telemetry, configure alerts, and visualize sensor topology across your entire plant network.
        </p>
      </div>
    </div>
  );
}
