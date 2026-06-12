type IconProps = {
  className?: string;
};

/** W1 — канбан, 3 колонки с карточками */
export function RailIconWorkspaces({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="1" y="2" width="4" height="12" />
      <rect x="6" y="2" width="4" height="12" />
      <rect x="11" y="2" width="4" height="12" />
      <rect x="2" y="4" width="2" height="2" className="px-rail-ico-cutout" />
      <rect x="2" y="7" width="2" height="3" className="px-rail-ico-cutout" />
      <rect x="7" y="5" width="2" height="2" className="px-rail-ico-cutout" />
      <rect x="12" y="6" width="2" height="4" className="px-rail-ico-cutout" />
    </svg>
  );
}

/** P2 — звезда / личные дела */
export function RailIconPersonal({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.5l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6L8 1.5z" />
    </svg>
  );
}

/** C3 — портрет в рамке + полоска HP */
export function RailIconCharacter({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="4" y="2" width="8" height="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="6" r="2" />
      <rect x="6" y="9" width="4" height="2" />
      <rect x="3" y="12" width="10" height="2" opacity="0.5" />
    </svg>
  );
}

/** B2 — контурный колокол */
export function RailIconNotifications({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
      <path d="M8 2c-2 0-3.5 1.5-3.5 4v3.5L3 12h10l-1.5-2.5V6c0-2.5-1.5-4-3.5-4z" />
      <path d="M6.5 12a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}

/** G4 — гайка, шестигранник с отверстием */
export function RailIconSettings({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 2l5 3v6l-5 3-5-3V5l5-3z" />
      <circle cx="8" cy="8" r="2.2" className="px-rail-ico-cutout" />
    </svg>
  );
}

/** T1 — лунный серп (светлая тема → переключить на тёмную) */
export function RailIconThemeMoon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8A9.02 9.02 0 0 0 12 3z" />
    </svg>
  );
}

/** S3 — контурное солнце (тёмная тема → переключить на светлую) */
export function RailIconThemeSun({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M5 19l2-2" />
    </svg>
  );
}

/** P1 — контурный power (выход) */
export function RailIconLogoutPower({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden
    >
      <path d="M12 3v7" />
      <circle cx="12" cy="13" r="8" />
    </svg>
  );
}
