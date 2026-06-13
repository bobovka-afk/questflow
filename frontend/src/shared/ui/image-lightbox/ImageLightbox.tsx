import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ImageLightboxItem = {
  src: string;
  alt?: string;
  title?: string;
};

type Props = {
  items: ImageLightboxItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function ImageLightbox({ items, index, onClose, onIndexChange }: Props) {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  useEffect(() => {
    if (!item) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault();
        onIndexChange(index - 1);
        return;
      }
      if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault();
        onIndexChange(index + 1);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [item, index, hasPrev, hasNext, onClose, onIndexChange]);

  if (!item) return null;

  return createPortal(
    <div
      className="qf-image-lightbox-backdrop"
      role="dialog"
      aria-modal
      aria-label={item.title ?? item.alt ?? 'Просмотр изображения'}
      onClick={onClose}
    >
      <button
        type="button"
        className="qf-image-lightbox-close"
        aria-label="Закрыть"
        onClick={onClose}
      >
        ×
      </button>

      {hasPrev ? (
        <button
          type="button"
          className="qf-image-lightbox-nav qf-image-lightbox-nav--prev"
          aria-label="Предыдущее изображение"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(index - 1);
          }}
        >
          ‹
        </button>
      ) : null}

      <figure className="qf-image-lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img className="qf-image-lightbox-img" src={item.src} alt={item.alt ?? ''} />
        {item.title ? (
          <figcaption className="qf-image-lightbox-caption">{item.title}</figcaption>
        ) : null}
      </figure>

      {hasNext ? (
        <button
          type="button"
          className="qf-image-lightbox-nav qf-image-lightbox-nav--next"
          aria-label="Следующее изображение"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(index + 1);
          }}
        >
          ›
        </button>
      ) : null}

      {items.length > 1 ? (
        <div className="qf-image-lightbox-counter" aria-live="polite">
          {index + 1} / {items.length}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
