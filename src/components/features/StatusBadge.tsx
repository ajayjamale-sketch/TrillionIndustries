import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'orange' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      variant === 'default' && 'bg-primary/10 text-primary border border-primary/20',
      variant === 'success' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      variant === 'warning' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      variant === 'error' && 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
      variant === 'orange' && 'bg-accent/10 text-accent border border-accent/20',
      variant === 'outline' && 'border border-border text-muted-foreground',
      className
    )}>
      {children}
    </span>
  );
}
