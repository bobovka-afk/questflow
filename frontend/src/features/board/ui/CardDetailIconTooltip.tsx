import {
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

const TOOLTIP_DELAY_MS = 300;

type Props = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function CardDetailIconTooltip({ label, children, className }: Props) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function scheduleShow() {
    clearTimer();
    timerRef.current = setTimeout(() => setVisible(true), TOOLTIP_DELAY_MS);
  }

  function hide() {
    clearTimer();
    setVisible(false);
  }

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const child = children as ReactElement<{
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
  }>;

  const merged = cloneElement(child, {
    onMouseEnter: (e: React.MouseEvent) => {
      scheduleShow();
      child.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      child.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      scheduleShow();
      child.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      child.props.onBlur?.(e);
    },
  });

  return (
    <span
      className={['trello-card-detail-icon-tooltip', className]
        .filter(Boolean)
        .join(' ')}
    >
      {merged}
      {visible ? (
        <span
          className="trello-card-detail-icon-tooltip__bubble"
          role="tooltip"
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
