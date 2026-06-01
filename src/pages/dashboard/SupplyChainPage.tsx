import { Network } from 'lucide-react';
import { User } from '@/types';

export function SupplyChainPage({ user }: { user: User }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Supply Chain Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">End-to-end supply chain visibility and tracking.</p>
      </div>

      <div className="flex flex-col items-center justify-center bg-card border border-border rounded-xl p-12 text-center h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
          <Network className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Supply Chain Module Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This comprehensive supply chain management module is currently under development. It will feature real-time supplier tracking, logistics integration, and multi-tier network visualization.
        </p>
      </div>
    </div>
  );
}
