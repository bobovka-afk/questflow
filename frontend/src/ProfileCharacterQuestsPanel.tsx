import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { api, formatApiError } from './lib/api';
import {
  CHEST_TIER_LABEL_RU,
  COSMETIC_TYPE_LABEL_RU,
  cosmeticTypeCanEquip,
  DUST_FOR_DUPLICATE_BY_TIER,
  type AchievementProgressItem,
  type CharacterAchievementsView,
  type CharacterQuestsView,
  type DustShopView,
  type InventoryItemDto,
  type OpenChestResult,
  type QuestPeriodGroup,
  type QuestProgressItem,
  type ChestTier,
} from './lib/quests';

type Props = {
  accessToken: string;
};

function QuestRow(props: {
  quest: QuestProgressItem;
  onOpenChest: (chestId: number) => void;
  openingChestId: number | null;
}) {
  const { quest } = props;
  const pct = quest.target > 0 ? Math.min(100, Math.round((quest.current / quest.target) * 100)) : 0;
  const chest = quest.chest;
  const canOpen = chest && !chest.openedAt;

  return (
    <li className="trello-character-quest-row">
      <div className="trello-character-quest-row-head">
        <span className="trello-character-quest-title">{quest.titleRu}</span>
        {quest.completed && (
          <span className="trello-character-quest-done-badge" aria-label="Выполнено">
            ✓
          </span>
        )}
      </div>
      {quest.descriptionRu && (
        <p className="trello-character-quest-desc">{quest.descriptionRu}</p>
      )}
      <div className="trello-character-quest-progress">
        <div
          className="trello-character-quest-progress-fill"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
        <span className="trello-character-quest-progress-label">
          {Math.min(quest.current, quest.target)} / {quest.target}
        </span>
      </div>
      {chest && (
        <div className="trello-character-quest-chest-row">
          <span
            className={`trello-character-chest-icon trello-character-chest-icon--${chest.tier.toLowerCase()}`}
            aria-hidden
          >
            🎁
          </span>
          <span className="trello-character-quest-chest-label">
            {CHEST_TIER_LABEL_RU[chest.tier]} сундук
            {chest.openedAt ? ' · открыт' : ' · ждёт открытия'}
          </span>
          {canOpen && (
            <button
              type="button"
              className="trello-btn trello-btn-primary trello-btn-sm"
              disabled={props.openingChestId === chest.id}
              onClick={() => props.onOpenChest(chest.id)}
            >
              {props.openingChestId === chest.id ? 'Открываем…' : 'Открыть'}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function QuestGroup(props: {
  title: string;
  group: QuestPeriodGroup;
  onOpenChest: (chestId: number) => void;
  openingChestId: number | null;
}) {
  if (props.group.quests.length === 0) return null;
  return (
    <div className="trello-character-quest-group">
      <h3 className="trello-character-quest-group-title">
        {props.title}
        <span className="trello-character-quest-period-key">{props.group.periodKey}</span>
      </h3>
      <ul className="trello-character-quest-list">
        {props.group.quests.map((q) => (
          <QuestRow
            key={q.templateId}
            quest={q}
            onOpenChest={props.onOpenChest}
            openingChestId={props.openingChestId}
          />
        ))}
      </ul>
    </div>
  );
}

function AchievementRow({ item }: { item: AchievementProgressItem }) {
  const pct =
    item.target > 0 ? Math.min(100, Math.round((item.current / item.target) * 100)) : 0;
  return (
    <li
      className={
        item.unlocked
          ? 'trello-character-achievement-row trello-character-achievement-row--unlocked'
          : 'trello-character-achievement-row'
      }
    >
      <div className="trello-character-achievement-head">
        <span className="trello-character-achievement-title">{item.titleRu}</span>
        {item.unlocked && <span className="trello-character-quest-done-badge">✓</span>}
      </div>
      {item.descriptionRu && (
        <p className="trello-character-quest-desc">{item.descriptionRu}</p>
      )}
      {item.rewardDust > 0 && (
        <p className="trello-character-achievement-reward">+{item.rewardDust} пыли за получение</p>
      )}
      {!item.unlocked && (
        <div className="trello-character-quest-progress trello-character-quest-progress--sm">
          <div
            className="trello-character-quest-progress-fill"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
          <span className="trello-character-quest-progress-label">
            {Math.min(item.current, item.target)} / {item.target}
          </span>
        </div>
      )}
    </li>
  );
}

export function ProfileCharacterQuestsPanel(props: Props) {
  const [quests, setQuests] = useState<CharacterQuestsView | null>(null);
  const [inventory, setInventory] = useState<InventoryItemDto[]>([]);
  const [dustShop, setDustShop] = useState<DustShopView | null>(null);
  const [achievements, setAchievements] = useState<CharacterAchievementsView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [openingChestId, setOpeningChestId] = useState<number | null>(null);
  const [openResult, setOpenResult] = useState<OpenChestResult | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  const reload = useCallback(async () => {
    setLoadError(null);
    const [q, inv, shop, ach] = await Promise.all([
      api<CharacterQuestsView>('/character/quests', {
        method: 'GET',
        accessToken: props.accessToken,
      }),
      api<InventoryItemDto[]>('/character/inventory', {
        method: 'GET',
        accessToken: props.accessToken,
      }),
      api<DustShopView>('/character/dust/shop', {
        method: 'GET',
        accessToken: props.accessToken,
      }),
      api<CharacterAchievementsView>('/character/achievements', {
        method: 'GET',
        accessToken: props.accessToken,
      }),
    ]);
    setQuests(q);
    setInventory(inv);
    setDustShop(shop);
    setAchievements(ach);
  }, [props.accessToken]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await reload();
      } catch (e) {
        if (!cancelled) setLoadError(formatApiError(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const unopenedCount = useMemo(() => {
    if (!quests) return 0;
    const all = [...quests.daily.quests, ...quests.weekly.quests];
    return all.filter((q) => q.chest && !q.chest.openedAt).length;
  }, [quests]);

  const equippableInventory = useMemo(
    () => inventory.filter((i) => cosmeticTypeCanEquip(i.cosmeticItem.type)),
    [inventory],
  );

  async function handleOpenChest(chestId: number) {
    setOpeningChestId(chestId);
    setBusy(true);
    setLoadError(null);
    try {
      const result = await api<OpenChestResult>(`/character/chests/${chestId}/open`, {
        method: 'POST',
        accessToken: props.accessToken,
      });
      setOpenResult(result);
      await reload();
    } catch (e) {
      setLoadError(formatApiError(e));
    } finally {
      setOpeningChestId(null);
      setBusy(false);
    }
  }

  async function handlePurchaseChest(tier: ChestTier) {
    setBusy(true);
    setLoadError(null);
    try {
      await api('/character/dust/purchase', {
        method: 'POST',
        accessToken: props.accessToken,
        body: JSON.stringify({ tier }),
      });
      await reload();
    } catch (e) {
      setLoadError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleEquip(inventoryItemId: number) {
    setBusy(true);
    setLoadError(null);
    try {
      await api('/character/cosmetics/equip', {
        method: 'PATCH',
        accessToken: props.accessToken,
        body: JSON.stringify({ inventoryItemId }),
      });
      await reload();
    } catch (e) {
      setLoadError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="trello-character-quests-section" aria-labelledby="character-quests-heading">
      <button
        type="button"
        className="trello-character-guide-toggle trello-character-quests-toggle"
        onClick={() => setSectionOpen((o) => !o)}
        aria-expanded={sectionOpen}
        id="character-quests-heading"
      >
        {sectionOpen ? '▼' : '▶'} Квесты и сундуки
        {unopenedCount > 0 && (
          <span className="trello-character-quests-badge">{unopenedCount}</span>
        )}
      </button>

      {sectionOpen && (
        <div className="trello-character-quests-body">
          {loadError && <div className="trello-banner trello-banner-error">{loadError}</div>}
          {!quests && !loadError && (
            <p className="trello-muted">Загрузка квестов…</p>
          )}
          {dustShop && (
            <div className="trello-character-dust-block">
              <p className="trello-character-dust-balance">
                Пыль: <strong>{dustShop.balance}</strong>
                <span className="trello-muted trello-character-dust-hint">
                  {' '}
                  (дубликат: {DUST_FOR_DUPLICATE_BY_TIER.COMMON} / {DUST_FOR_DUPLICATE_BY_TIER.RARE}{' '}
                  / {DUST_FOR_DUPLICATE_BY_TIER.EPIC} за обычный / редкий / эпик)
                </span>
              </p>
              <p className="trello-character-dust-shop-label">Обменять пыль на сундук:</p>
              <div className="trello-character-dust-shop-grid">
                {dustShop.options.map((option) => (
                  <div key={option.tier} className="trello-character-dust-shop-card">
                    <span className="trello-character-dust-shop-tier">
                      {CHEST_TIER_LABEL_RU[option.tier]}
                    </span>
                    <span className="trello-character-dust-shop-title">{option.titleRu}</span>
                    <span className="trello-muted trello-character-dust-shop-desc">
                      {option.descriptionRu}
                    </span>
                    <span className="trello-character-dust-shop-cost">{option.cost} пыли</span>
                    <button
                      type="button"
                      className="trello-btn trello-btn-primary trello-btn-sm"
                      disabled={busy || !option.canAfford}
                      onClick={() => void handlePurchaseChest(option.tier)}
                    >
                      Купить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quests && (
            <>
              <QuestGroup
                title="Сегодня"
                group={quests.daily}
                onOpenChest={(id) => void handleOpenChest(id)}
                openingChestId={openingChestId}
              />
              <QuestGroup
                title="На неделю"
                group={quests.weekly}
                onOpenChest={(id) => void handleOpenChest(id)}
                openingChestId={openingChestId}
              />
            </>
          )}

          <button
            type="button"
            className="trello-character-inventory-toggle"
            onClick={() => setAchievementsOpen((o) => !o)}
            aria-expanded={achievementsOpen}
          >
            {achievementsOpen ? '▼' : '▶'} Достижения (
            {achievements?.achievements.filter((a) => a.unlocked).length ?? 0}/
            {achievements?.achievements.length ?? 0})
          </button>
          {achievementsOpen && achievements && (
            <ul className="trello-character-achievement-list">
              {achievements.achievements.map((a) => (
                <AchievementRow key={a.key} item={a} />
              ))}
            </ul>
          )}

          <button
            type="button"
            className="trello-character-inventory-toggle"
            onClick={() => setInventoryOpen((o) => !o)}
            aria-expanded={inventoryOpen}
          >
            {inventoryOpen ? '▼' : '▶'} Косметика ({equippableInventory.length})
          </button>
          {inventoryOpen && equippableInventory.length > 0 && (
            <ul className="trello-character-inventory-list">
              {equippableInventory.map((item) => (
                <li key={item.id} className="trello-character-inventory-item">
                  <div>
                    <span className="trello-character-inventory-name">
                      {item.cosmeticItem.nameRu}
                    </span>
                    <span className="trello-character-inventory-type">
                      {COSMETIC_TYPE_LABEL_RU[item.cosmeticItem.type]}
                    </span>
                  </div>
                  {item.equipped ? (
                    <span className="trello-character-inventory-equipped">Надето</span>
                  ) : (
                    <button
                      type="button"
                      className="trello-btn trello-btn-ghost trello-btn-sm"
                      disabled={busy}
                      onClick={() => void handleEquip(item.id)}
                    >
                      Надеть
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {inventoryOpen && equippableInventory.length === 0 && (
            <p className="trello-muted trello-character-inventory-empty">
              Пока нет косметики. Выполняйте квесты и открывайте сундуки.
            </p>
          )}
        </div>
      )}

      {openResult &&
        createPortal(
          <div
            className="trello-modal-backdrop"
            role="presentation"
            onClick={() => !busy && setOpenResult(null)}
          >
            <div
              className="trello-modal trello-character-chest-open-modal"
              role="dialog"
              aria-modal
              aria-labelledby="chest-open-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="trello-modal-head">
                <h2 id="chest-open-title" className="trello-modal-title">
                  Сундук открыт
                </h2>
                <button
                  type="button"
                  className="trello-modal-close"
                  onClick={() => !busy && setOpenResult(null)}
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>
              <div className="trello-modal-body">
                <p className="trello-character-chest-loot-name">{openResult.cosmeticNameRu}</p>
                <p className="trello-muted">
                  {COSMETIC_TYPE_LABEL_RU[openResult.cosmeticType]}
                </p>
                {openResult.alreadyOwned && openResult.dustGranted > 0 && (
                  <p className="trello-banner trello-banner-warn" style={{ marginTop: 12 }}>
                    Предмет уже был у вас. Получено {openResult.dustGranted} пыли (баланс:{' '}
                    {openResult.dustBalance}).
                  </p>
                )}
              </div>
              <div className="trello-modal-foot">
                {openResult.inventoryItemId &&
                  cosmeticTypeCanEquip(openResult.cosmeticType) && (
                    <button
                      type="button"
                      className="trello-btn trello-btn-primary"
                      disabled={busy}
                      onClick={() => {
                        void handleEquip(openResult.inventoryItemId!).then(() =>
                          setOpenResult(null),
                        );
                      }}
                    >
                      Надеть
                    </button>
                  )}
                <button
                  type="button"
                  className="trello-btn trello-btn-ghost"
                  onClick={() => setOpenResult(null)}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
