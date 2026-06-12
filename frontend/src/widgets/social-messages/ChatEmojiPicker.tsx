import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CHAT_EMOJIS } from './chatEmojis';

type Props = {
  disabled?: boolean;
  onPick: (emoji: string) => void;
};

const PANEL_WIDTH = 280;

function clampPanelLeft(buttonLeft: number): number {
  const maxLeft = window.innerWidth - PANEL_WIDTH - 8;
  return Math.max(8, Math.min(buttonLeft, maxLeft));
}

export function ChatEmojiPicker({ disabled, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<{ left: number; bottom: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updatePanelPos = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setPanelPos({
      left: clampPanelLeft(rect.left),
      bottom: window.innerHeight - rect.top + 6,
    });
  }, []);

  useEffect(() => {
    if (!open) {
      setPanelPos(null);
      return;
    }
    updatePanelPos();
    window.addEventListener('resize', updatePanelPos);
    window.addEventListener('scroll', updatePanelPos, true);
    return () => {
      window.removeEventListener('resize', updatePanelPos);
      window.removeEventListener('scroll', updatePanelPos, true);
    };
  }, [open, updatePanelPos]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const panel =
    open && panelPos
      ? createPortal(
          <div
            ref={panelRef}
            className="trello-social-emoji-panel trello-social-emoji-panel--floating"
            role="dialog"
            aria-label="Выбор эмодзи"
            style={{ left: panelPos.left, bottom: panelPos.bottom }}
          >
            {CHAT_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="trello-social-emoji-option"
                aria-label={emoji}
                onClick={() => {
                  onPick(emoji);
                  setOpen(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="trello-social-emoji-picker">
        <button
          ref={btnRef}
          type="button"
          className="trello-social-emoji-picker-btn"
          disabled={disabled}
          aria-label="Эмодзи"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden>😊</span>
        </button>
      </div>
      {panel}
    </>
  );
}
