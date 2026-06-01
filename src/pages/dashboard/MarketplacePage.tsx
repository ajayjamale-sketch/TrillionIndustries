import { Store } from 'lucide-react';
import { User } from '@/types';

export function MarketplacePage({ user }: { user: User }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">B2B Marketplace</h1>
        <p className="text-sm text-muted-foreground mt-1">Discover, negotiate, and transact with verified industrial suppliers.</p>
      </div>

      <div className="flex flex-col items-center justify-center bg-card border border-border rounded-xl p-12 text-center h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
          <Store className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">B2B Marketplace Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          The TrillionIndustries vendor marketplace is launching soon. You will be able to browse catalogs, issue RFQs directly, and form new supply partnerships all within the platform.
        </p>
      </div>
    </div>
  );
}
