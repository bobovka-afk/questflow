import { IconAttach } from '@shared/ui/icons/IconAttach';
import type { RefObject } from 'react';
import {
  cycleHeading,
  insertBulletList,
  insertChecklist,
  insertHorizontalRule,
  insertImageUrl,
  insertLink,
  toggleBold,
  toggleItalic,
} from '../lib/richTextEditor';

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value?: string;
  onChange: (v: string) => void;
  showAttach?: boolean;
  onAttach?: () => void;
  attachDisabled?: boolean;
  attachBusy?: boolean;
};

export function CardDetailEditorToolbar({
  textareaRef,
  onChange,
  showAttach = false,
  onAttach,
  attachDisabled,
  attachBusy,
}: Props) {
  const ta = () => textareaRef.current;

  const run = (fn: (el: HTMLTextAreaElement, onChange: (v: string) => void) => void) => {
    const el = ta();
    if (!el) return;
    fn(el, onChange);
  };

  return (
    <div className="trello-card-detail-editor-toolbar" role="toolbar" aria-label="Форматирование">
      <div className="trello-card-detail-editor-toolbar-start">
        <button
          type="button"
          className="trello-card-detail-editor-tool"
          title="Заголовок"
          onClick={() => run(cycleHeading)}
        >
          Tt <span className="trello-card-detail-tool-caret">▾</span>
        </button>
        <button
          type="button"
          className="trello-card-detail-editor-tool"
          title="Жирный"
          onClick={() => run(toggleBold)}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className="trello-card-detail-editor-tool"
          title="Курсив"
          onClick={() => run(toggleItalic)}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className="trello-card-detail-editor-tool"
          title="Разделитель"
          onClick={() => run(insertHorizontalRule)}
        >
          …
        </button>
        <button
          type="button"
          className="trello-card-detail-editor-tool"
          title="Маркированный список"
          onClick={() => run(insertBulletList)}
        >
          ≡ <span className="trello-card-detail-tool-caret">▾</span>
        </button>
        <button
          type="button"
          className="trello-card-detail-editor-tool"
          title="Ссылка"
          onClick={() => run(insertLink)}
        >
          ⛓
        </button>
        <button
          type="button"
          className="trello-card-detail-editor-tool"
          title="Изображение по URL"
          onClick={() => run(insertImageUrl)}
        >
          ▣
        </button>
        <button
          type="button"
          className="trello-card-detail-editor-tool"
          title="Чек-лист"
          onClick={() => run(insertChecklist)}
        >
          + <span className="trello-card-detail-tool-caret">▾</span>
        </button>
      </div>
      {showAttach ? (
        <div className="trello-card-detail-editor-toolbar-end">
          <button
            type="button"
            className="trello-card-detail-editor-tool trello-card-detail-editor-tool--attach"
            title="Прикрепить файл"
            disabled={attachDisabled || attachBusy}
            onClick={onAttach}
          >
            <IconAttach />
          </button>
        </div>
      ) : null}
    </div>
  );
}
