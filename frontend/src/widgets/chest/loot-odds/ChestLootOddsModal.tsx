import { useMemo, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import {
  buildChestLootOdds,
  CHEST_LOOT_ODDS_MODAL_SIZE_PX,
  CHEST_LOOT_ODDS_ROWS_PER_PAGE,
  formatLootOddsPercent,
} from '@entities/chest/lib/chestLootOdds';
import { CHEST_TIER_LABEL_RU, type ChestTier } from '@entities/quest';

type Props = {
  tier: ChestTier;
  onClose: () => void;
};

export function ChestLootOddsModal(props: Props) {
  const [page, setPage] = useState(0);
  const odds = useMemo(() => buildChestLootOdds(props.tier), [props.tier]);

  const totalPages = Math.max(1, Math.ceil(odds.flatRows.length / CHEST_LOOT_ODDS_ROWS_PER_PAGE));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const pageStart = safePage * CHEST_LOOT_ODDS_ROWS_PER_PAGE;
  const pageRows = odds.flatRows.slice(pageStart, pageStart + CHEST_LOOT_ODDS_ROWS_PER_PAGE);

  return createPortal(
    <div className="trello-modal-backdrop" role="presentation" onClick={() => props.onClose()}>
      <div
        className="trello-modal trello-character-loot-popup trello-character-loot-popup--static trello-chest-loot-odds-modal"
        role="dialog"
        aria-modal
        aria-labelledby="chest-loot-odds-title"
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={
          {
            '--chest-loot-odds-size': `min(${CHEST_LOOT_ODDS_MODAL_SIZE_PX}px, 92vw, 90vh)`,
          } as CSSProperties
        }
      >
        <div className="trello-modal-head trello-character-loot-popup-head--centered">
          <h2 id="chest-loot-odds-title" className="trello-modal-title trello-character-loot-popup-title--hero">
            {odds.chestTitleRu}
          </h2>
          <button type="button" className="trello-modal-close" onClick={props.onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <div className="trello-modal-body trello-chest-loot-odds-body">
          <ul className="trello-chest-loot-odds-list" role="list">
            {pageRows.map((row, index) => {
              const globalIndex = pageStart + index;
              const prevRow = globalIndex > 0 ? odds.flatRows[globalIndex - 1] : null;
              const showSectionLabel = !prevRow || prevRow.sectionKey !== row.sectionKey;
              return (
                <li key={`${row.key}-${row.sectionKey}`} className="trello-chest-loot-odds-list-item">
                  {showSectionLabel && (
                    <>
                      {globalIndex > 0 && <div className="trello-chest-loot-odds-divider" role="separator" />}
                      <p className="trello-chest-loot-odds-section-label">{row.sectionKey}</p>
                    </>
                  )}
                  <div className="trello-chest-loot-odds-row">
                    <span
                      className={[
                        'trello-chest-loot-odds-row-tier',
                        row.cosmeticTier === 'RARE'
                          ? 'trello-chest-loot-odds-row-tier--rare'
                          : '',
                        row.cosmeticTier === 'EPIC'
                          ? 'trello-chest-loot-odds-row-tier--epic'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {CHEST_TIER_LABEL_RU[row.cosmeticTier]}
                    </span>
                    <div className="trello-chest-loot-odds-row-details">
                      <span className="trello-chest-loot-odds-row-name">{row.nameRu}</span>
                      <span className="trello-chest-loot-odds-row-percent">
                        {formatLootOddsPercent(row.percent)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {pageRows.length === 0 && <p className="trello-muted">Нет данных о луте.</p>}

          {totalPages > 1 && (
            <nav className="trello-character-storage-pager" aria-label="Страницы списка шансов">
              <button
                type="button"
                className="trello-character-storage-pager-btn"
                disabled={safePage <= 0}
                onClick={() => setPage(safePage - 1)}
                aria-label="Предыдущая страница"
              >
                ←
              </button>
              <span className="trello-character-storage-pager-label">
                {safePage + 1} / {totalPages}
              </span>
              <button
                type="button"
                className="trello-character-storage-pager-btn"
                disabled={safePage >= totalPages - 1}
                onClick={() => setPage(safePage + 1)}
                aria-label="Следующая страница"
              >
                →
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
