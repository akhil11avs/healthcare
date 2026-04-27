
import './Badge.css';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantMap: Record<string, BadgeVariant> = {
  Active:     'success',
  Recovering: 'info',
  Discharged: 'neutral',
  Critical:   'danger',
  Scheduled:  'purple',
  Confirmed:  'success',
  Pending:    'warning',
  Cancelled:  'danger',
  normal:     'success',
  warning:    'warning',
  critical:   'danger',
};

export function Badge({ children, variant, size = 'md', dot = false }: BadgeProps) {
  const resolvedVariant: BadgeVariant =
    variant ?? variantMap[String(children)] ?? 'neutral';

  return (
    <span className={`badge badge--${resolvedVariant} badge--${size}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}


