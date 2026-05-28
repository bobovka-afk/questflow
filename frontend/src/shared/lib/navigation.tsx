import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { navigate } from './navigation-core';

export type SpaLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  disabled?: boolean;
};

export function SpaLink({ to, className, onClick, children, disabled, ...rest }: SpaLinkProps) {
  if (disabled) {
    return (
      <span className={className} aria-disabled="true" {...rest}>
        {children}
      </span>
    );
  }

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
    onClick?.(e);
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
