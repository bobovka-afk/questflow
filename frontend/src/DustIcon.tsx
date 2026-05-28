import { dustIconUrl } from './lib/dustAssets';

type Props = {
  size?: number;
  className?: string;
};

export function DustIcon(props: Props) {
  const size = props.size ?? 24;
  return (
    <img
      src={dustIconUrl()}
      alt=""
      width={size}
      height={size}
      className={`trello-dust-icon ${props.className ?? ''}`}
      loading="lazy"
      draggable={false}
    />
  );
}
