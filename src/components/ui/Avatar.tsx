import './Avatar.css';

interface AvatarProps {
  initials: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
}

export function Avatar({ initials, color = '#2563eb', size = 'md', name }: AvatarProps) {
  return (
    <div
      className={`avatar avatar--${size}`}
      style={{ background: `linear-gradient(135deg, ${color}cc, ${color}80)`, border: `1.5px solid ${color}50` }}
      title={name}
      aria-label={name}
    >
      <span className="avatar-initials">{initials}</span>
    </div>
  );
}
