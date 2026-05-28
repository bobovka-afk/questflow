import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { api, formatApiError } from './lib/api';
import {
  type GenderCharacter,
  isQuestAvatarPreset,
} from './lib/character';
import { ChestIcon } from './ChestIcon';
import { ChestTapOpenView } from './ChestTapOpenModal';
import { DustIcon } from './DustIcon';
import {
  achievementIconUrl,
  ACHIEVEMENT_ICON_LIST_SIZE,
} from './lib/achievementAssets';
import { DUST_ICON_SIZE_MD, DUST_ICON_SIZE_SM } from './lib/dustAssets';
import {
  chestHasTapOpen,
  chestTapFrameUrls,
  chestTapsRequired,
} from './lib/chestAssets';
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
  type UserChestDto,
} from './lib/quests';

type ChestModalState =
  | { phase: 'tapping'; tier: ChestTier; chestId: number; frameIndex: number }
  | { phase: 'reveal'; tier: ChestTier; result: OpenChestResult };

type Props = {
  accessToken: string;
  characterGender: GenderCharacter;
  onCharacterRefresh?: () => Promise<void>;
};

function QuestRow(props: {
  quest: QuestProgressItem;
  onOpenChest: (chestId: number, tier: ChestTier) => void;
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
          <ChestIcon tier={chest.tier} size={32} />
          <span className="trello-character-quest-chest-label">
            {CHEST_TIER_LABEL_RU[chest.tier]} сундук
            {chest.openedAt ? ' · открыт' : ' · ждёт открытия'}
          </span>
          {canOpen && (
            <button
              type="button"
              className="trello-btn trello-btn-primary trello-btn-sm"
              disabled={props.openingChestId === chest.id}
              onClick={() => props.onOpenChest(chest.id, chest.tier)}
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
  onOpenChest: (chestId: number, tier: ChestTier) => void;
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
      <img
        src={achievementIconUrl(item.unlocked)}
        alt=""
        width={ACHIEVEMENT_ICON_LIST_SIZE}
        height={ACHIEVEMENT_ICON_LIST_SIZE}
        className="trello-character-achievement-icon"
        loading="lazy"
        draggable={false}
      />
      <div className="trello-character-achievement-head">
        <span className="trello-character-achievement-title">{item.titleRu}</span>
        {item.unlocked && <span className="trello-character-quest-done-badge">✓</span>}
      </div>
      {item.descriptionRu && (
        <p className="trello-character-quest-desc">{item.descriptionRu}</p>
      )}
      {item.rewardDust > 0 && (
        <p className="trello-character-achievement-reward">
          +{item.rewardDust}{' '}
          <DustIcon size={DUST_ICON_SIZE_SM} />
          {' '}пыли за получение
        </p>
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
  const [userChests, setUserChests] = useState<UserChestDto[]>([]);
  const [inventory, setInventory] = useState<InventoryItemDto[]>([]);
  const [dustShop, setDustShop] = useState<DustShopView | null>(null);
  const [achievements, setAchievements] = useState<CharacterAchievementsView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [openingChestId, setOpeningChestId] = useState<number | null>(null);
  const [chestModal, setChestModal] = useState<ChestModalState | null>(null);
  const [pendingChestOpen, setPendingChestOpen] = useState<{
    result: OpenChestResult | null;
    error: string | null;
  }>({ result: null, error: null });
  const [sectionOpen, setSectionOpen] = useState(true);
  const [myChestsOpen, setMyChestsOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  const reload = useCallback(async () => {
    setLoadError(null);
    const [q, chests, inv, shop, ach] = await Promise.all([
      api<CharacterQuestsView>('/character/quests', {
        method: 'GET',
        accessToken: props.accessToken,
      }),
      api<UserChestDto[]>('/character/chests', {
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
    setUserChests(chests);
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

  const unopenedChests = useMemo(
    () => userChests.filter((c) => !c.openedAt),
    [userChests],
  );

  const unopenedCount = unopenedChests.length;

  const equippableInventory = useMemo(
    () => inventory.filter((i) => cosmeticTypeCanEquip(i.cosmeticItem.type)),
    [inventory],
  );
  const frameInventory = useMemo(
    () => equippableInventory.filter((i) => i.cosmeticItem.type === 'PORTRAIT_FRAME'),
    [equippableInventory],
  );
  const backgroundInventory = useMemo(
    () => equippableInventory.filter((i) => i.cosmeticItem.type === 'PROFILE_BACKGROUND'),
    [equippableInventory],
  );
  const otherEquippableInventory = useMemo(
    () =>
      equippableInventory.filter(
        (i) =>
          i.cosmeticItem.type !== 'PORTRAIT_FRAME' &&
          i.cosmeticItem.type !== 'PROFILE_BACKGROUND',
      ),
    [equippableInventory],
  );

  const finishTapChestReveal = useCallback(
    async (tier: ChestTier, result: OpenChestResult) => {
      setChestModal({ phase: 'reveal', tier, result });
      try {
        await reload();
      } catch (e) {
        setLoadError(formatApiError(e));
      } finally {
        setOpeningChestId(null);
        setBusy(false);
      }
    },
    [reload],
  );

  useEffect(() => {
    if (chestModal?.phase !== 'tapping') return;
    const required = chestTapsRequired(chestModal.tier);
    if (chestModal.frameIndex < required) return;

    if (pendingChestOpen.error) {
      setChestModal(null);
      setLoadError(pendingChestOpen.error);
      setOpeningChestId(null);
      setBusy(false);
      return;
    }
    if (pendingChestOpen.result) {
      void finishTapChestReveal(chestModal.tier, pendingChestOpen.result);
    }
  }, [chestModal, pendingChestOpen, finishTapChestReveal]);

  async function handleOpenChest(chestId: number, tier: ChestTier) {
    setOpeningChestId(chestId);
    setBusy(true);
    setLoadError(null);
    setPendingChestOpen({ result: null, error: null });

    const useTap =
      chestHasTapOpen(tier) &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (useTap) {
      setChestModal({ phase: 'tapping', tier, chestId, frameIndex: 0 });
      try {
        const result = await api<OpenChestResult>(`/character/chests/${chestId}/open`, {
          method: 'POST',
          accessToken: props.accessToken,
        });
        setPendingChestOpen({ result, error: null });
      } catch (e) {
        setPendingChestOpen({ result: null, error: formatApiError(e) });
      }
      return;
    }

    try {
      const result = await api<OpenChestResult>(`/character/chests/${chestId}/open`, {
        method: 'POST',
        accessToken: props.accessToken,
      });
      setChestModal({ phase: 'reveal', tier, result });
      await reload();
    } catch (e) {
      setLoadError(formatApiError(e));
    } finally {
      setOpeningChestId(null);
      setBusy(false);
    }
  }

  function handleChestTap() {
    if (chestModal?.phase !== 'tapping') return;
    const required = chestTapsRequired(chestModal.tier);
    if (chestModal.frameIndex >= required) return;
    setChestModal({ ...chestModal, frameIndex: chestModal.frameIndex + 1 });
  }

  async function handlePurchaseChest(tier: ChestTier) {
    setBusy(true);
    setLoadError(null);
    try {
      await api('/character/dust/purchase', {
        method: 'POST',
        accessToken: props.accessToken,
        json: { tier },
      });
      await reload();
    } catch (e) {
      setLoadError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleApplyQuestAvatar(avatarPreset: string) {
    setBusy(true);
    setLoadError(null);
    try {
      await api('/character/me', {
        method: 'PATCH',
        accessToken: props.accessToken,
        json: { avatarPreset },
      });
      await reload();
      await props.onCharacterRefresh?.();
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
        json: { inventoryItemId },
      });
      await reload();
      await props.onCharacterRefresh?.();
    } catch (e) {
      setLoadError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleUnequip(inventoryItemId: number) {
    setBusy(true);
    setLoadError(null);
    try {
      await api('/character/cosmetics/unequip', {
        method: 'PATCH',
        accessToken: props.accessToken,
        json: { inventoryItemId },
      });
      await reload();
      await props.onCharacterRefresh?.();
    } catch (e) {
      setLoadError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  function renderInventoryItems(items: InventoryItemDto[]) {
    return (
      <ul className="trello-character-inventory-list">
        {items.map((item) => (
          <li key={item.id} className="trello-character-inventory-item">
            <div>
              <span className="trello-character-inventory-name">{item.cosmeticItem.nameRu}</span>
              <span className="trello-character-inventory-type">
                {COSMETIC_TYPE_LABEL_RU[item.cosmeticItem.type]}
              </span>
            </div>
            <button
              type="button"
              className={
                item.equipped
                  ? 'trello-btn trello-btn-ghost trello-btn-sm trello-character-inventory-equip-btn'
                  : 'trello-btn trello-btn-primary trello-btn-sm trello-character-inventory-equip-btn'
              }
              disabled={busy}
              aria-pressed={item.equipped}
              onClick={() =>
                void (item.equipped ? handleUnequip(item.id) : handleEquip(item.id))
              }
            >
              {item.equipped ? 'Снять' : 'Надеть'}
            </button>
          </li>
        ))}
      </ul>
    );
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
          <button
            type="button"
            className="trello-character-inventory-toggle"
            onClick={() => setMyChestsOpen((o) => !o)}
            aria-expanded={myChestsOpen}
          >
            {myChestsOpen ? '▼' : '▶'} Мои сундуки ({unopenedChests.length} не открыто)
          </button>
          {myChestsOpen && (
            <ul className="trello-character-my-chests-list">
              {userChests.length === 0 && (
                <li className="trello-muted trello-character-my-chests-empty">
                  Нет сундуков. Выполните квест, купите за пыль или получите награду.
                </li>
              )}
              {userChests.map((chest) => {
                const canOpen = !chest.openedAt;
                return (
                  <li key={chest.id} className="trello-character-my-chests-item">
                    <div className="trello-character-quest-chest-row trello-character-quest-chest-row--flat">
                      <ChestIcon tier={chest.tier} size={32} />
                      <span className="trello-character-quest-chest-label">
                        {CHEST_TIER_LABEL_RU[chest.tier]} сундук
                        {canOpen ? ' · ждёт открытия' : ' · открыт'}
                      </span>
                      {canOpen && (
                        <button
                          type="button"
                          className="trello-btn trello-btn-primary trello-btn-sm"
                          disabled={busy || openingChestId === chest.id}
                          onClick={() => void handleOpenChest(chest.id, chest.tier)}
                        >
                          {openingChestId === chest.id ? 'Открываем…' : 'Открыть'}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {dustShop && (
            <div className="trello-character-dust-block">
              <p className="trello-character-dust-balance">
                <DustIcon size={DUST_ICON_SIZE_SM} />
                <span>
                  Пыль: <strong>{dustShop.balance}</strong>
                  <span className="trello-muted trello-character-dust-hint">
                  {' '}
                  (дубликат: {DUST_FOR_DUPLICATE_BY_TIER.COMMON} / {DUST_FOR_DUPLICATE_BY_TIER.RARE}{' '}
                  / {DUST_FOR_DUPLICATE_BY_TIER.EPIC} за обычный / редкий / эпик)
                  </span>
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
                    <span className="trello-character-dust-shop-cost">
                      <DustIcon size={DUST_ICON_SIZE_SM} />
                      {option.cost} пыли
                    </span>
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
                onOpenChest={(id, tier) => void handleOpenChest(id, tier)}
                openingChestId={openingChestId}
              />
              <QuestGroup
                title="На неделю"
                group={quests.weekly}
                onOpenChest={(id, tier) => void handleOpenChest(id, tier)}
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
            <>
              {frameInventory.length > 0 && (
                <>
                  <p className="trello-character-dust-shop-label">Рамки портрета</p>
                  {renderInventoryItems(frameInventory)}
                </>
              )}
              {backgroundInventory.length > 0 && (
                <>
                  <p className="trello-character-dust-shop-label">Фоны профиля</p>
                  {renderInventoryItems(backgroundInventory)}
                </>
              )}
              {otherEquippableInventory.length > 0 && (
                <>
                  <p className="trello-character-dust-shop-label">Другая косметика</p>
                  {renderInventoryItems(otherEquippableInventory)}
                </>
              )}
            </>
          )}
          {inventoryOpen && equippableInventory.length === 0 && (
            <p className="trello-muted trello-character-inventory-empty">
              Пока нет косметики. Выполняйте квесты и открывайте сундуки.
            </p>
          )}
        </div>
      )}

      {chestModal &&
        createPortal(
          <div
            className={[
              'trello-modal-backdrop',
              chestModal.phase === 'tapping' ? 'trello-chest-tap-modal-backdrop' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role="presentation"
            onClick={() => chestModal.phase === 'reveal' && !busy && setChestModal(null)}
          >
            <div
              className={[
                'trello-modal',
                chestModal.phase === 'tapping'
                  ? 'trello-chest-tap-open-modal'
                  : 'trello-character-chest-open-modal',
              ].join(' ')}
              role="dialog"
              aria-modal
              aria-labelledby="chest-open-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="trello-modal-head">
                <h2 id="chest-open-title" className="trello-modal-title">
                  {chestModal.phase === 'tapping' ? 'Откройте сундук' : 'Сундук открыт'}
                </h2>
                {chestModal.phase === 'reveal' && (
                  <button
                    type="button"
                    className="trello-modal-close"
                    onClick={() => !busy && setChestModal(null)}
                    aria-label="Закрыть"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="trello-modal-body">
                {chestModal.phase === 'tapping' ? (
                  <ChestTapOpenView
                    tier={chestModal.tier}
                    frameIndex={chestModal.frameIndex}
                    waitingForApi={
                      chestModal.frameIndex >= chestTapsRequired(chestModal.tier) &&
                      !pendingChestOpen.result &&
                      !pendingChestOpen.error
                    }
                    onTap={handleChestTap}
                  />
                ) : (
                  <>
                    {(() => {
                      const openFrame = chestTapFrameUrls(chestModal.tier)?.at(-1);
                      return openFrame ? (
                        <div className="trello-chest-open-sprite-wrap">
                          <img
                            src={openFrame}
                            alt=""
                            width={96}
                            height={96}
                            className="trello-character-chest-icon-img"
                          />
                        </div>
                      ) : null;
                    })()}
                    <p className="trello-character-chest-loot-name">
                      {chestModal.result.cosmeticNameRu}
                    </p>
                    <p className="trello-muted">
                      {COSMETIC_TYPE_LABEL_RU[chestModal.result.cosmeticType]}
                    </p>
                    {chestModal.result.alreadyOwned && chestModal.result.dustGranted > 0 && (
                      <p
                        className="trello-banner trello-banner-warn trello-character-chest-dust-banner"
                        style={{ marginTop: 12 }}
                      >
                        <DustIcon size={DUST_ICON_SIZE_MD} />
                        <span>
                          Предмет уже был у вас. Получено {chestModal.result.dustGranted} пыли
                          (баланс: {chestModal.result.dustBalance}).
                        </span>
                      </p>
                    )}
                  </>
                )}
              </div>
              {chestModal.phase === 'reveal' && (
                <div className="trello-modal-foot">
                  {chestModal.result.inventoryItemId &&
                    cosmeticTypeCanEquip(chestModal.result.cosmeticType) && (
                      <button
                        type="button"
                        className="trello-btn trello-btn-primary"
                        disabled={busy}
                        onClick={() => {
                          void handleEquip(chestModal.result.inventoryItemId!).then(() =>
                            setChestModal(null),
                          );
                        }}
                      >
                        Надеть
                      </button>
                    )}
                  {!chestModal.result.alreadyOwned &&
                    chestModal.result.cosmeticType === 'AVATAR_PRESET' &&
                    isQuestAvatarPreset(chestModal.result.cosmeticKey) && (
                      <button
                        type="button"
                        className="trello-btn trello-btn-primary"
                        disabled={busy}
                        onClick={() => {
                          void handleApplyQuestAvatar(chestModal.result.cosmeticKey).then(() =>
                            setChestModal(null),
                          );
                        }}
                      >
                        Применить образ
                      </button>
                    )}
                  <button
                    type="button"
                    className="trello-btn trello-btn-ghost"
                    onClick={() => setChestModal(null)}
                  >
                    Закрыть
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
