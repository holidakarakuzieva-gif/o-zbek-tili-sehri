import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'interactive-btn inline-flex h-9 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-semibold whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-[var(--primary)] text-white dark:text-slate-950 hover:bg-[var(--primary-hover)] shadow-sm',
    secondary:
      'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-subtle)]',
    ghost:
      'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]',
    danger:
      'bg-[var(--error)] text-white hover:opacity-90 shadow-sm',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
