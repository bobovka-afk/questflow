import { chestClosedUrl } from '@entities/chest/lib/chestAssets';
import type { ChestTier } from '@entities/quest';

type Props = {
  tier: ChestTier;
  className?: string;
  size?: number;
};

export function ChestIcon(props: Props) {
  const src = chestClosedUrl(props.tier);
  if (!src) {
    return (
      <span className={props.className} aria-hidden>
        🎁
      </span>
    );
  }
  const sizeAttrs =
    props.size != null ? { width: props.size, height: props.size } : undefined;
  return (
    <img
      src={src}
      alt=""
      {...sizeAttrs}
      className={`trello-character-chest-icon-img ${props.className ?? ''}`}
      loading="lazy"
    />
  );
}
