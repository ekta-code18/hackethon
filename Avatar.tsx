import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover bg-secondary-200`}
      />
    );
  }

  if (initials) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-secondary-200 flex items-center justify-center text-secondary-500`}>
      <User className="w-4 h-4" />
    </div>
  );
}
