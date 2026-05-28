import { chestClosedUrl } from '@entities/chest/lib/chestAssets';
import type { ChestTier } from '@entities/quest';

type Props = {
  tier: ChestTier;
  className?: string;
  size?: number;
};

export function ChestIcon(props: Props) {
  const src = chestClosedUrl(props.tier);
  const size = props.size ?? 32;
  if (!src) {
    return (
      <span className={props.className} aria-hidden>
        🎁
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`trello-character-chest-icon-img ${props.className ?? ''}`}
      loading="lazy"
    />
  );
}
