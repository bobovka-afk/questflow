import { appLogoUrl } from '@shared/assets/uiAssets';

type Props = {
  className?: string;
};

export function AppLogo({ className = 'trello-logo' }: Props) {
  return (
    <img
      src={appLogoUrl()}
      alt=""
      aria-hidden
      className={className}
      decoding="async"
    />
  );
}
