import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { api, formatApiError } from '@shared/api';
import {
  type GenderCharacter,
  isQuestAvatarPreset,
} from '@entities/character';
import { cosmeticAssetUrl } from '@entities/character/lib/cosmetics';
import { ChestIcon } from '@widgets/chest/icon/ChestIcon';
import { ChestLootOddsButton } from '@widgets/chest/loot-odds/ChestLootOddsButton';
import { ChestTapOpenView } from '@widgets/chest/tap-open/ChestTapOpenModal';
import { DustIcon } from '@widgets/dust/icon/DustIcon';
import {
  achievementIconUrl,
  achievementIconLockedClassName,
  ACHIEVEMENT_ICON_CARD_SIZE,
} from '@entities/achievement/lib/achievementAssets';
import {
  DUST_ICON_SIZE_MD,
  DUST_ICON_SIZE_SHOP,
  DUST_ICON_SIZE_SM,
} from '@entities/dust/lib/dustAssets';
import {
  chestHasTapOpen,
  chestTapFrameUrls,
  chestTapsRequired,
} from '@entities/chest/lib/chestAssets';
import {
  CHEST_TIER_LABEL_RU,
  COSMETIC_TYPE_LABEL_RU,
  cosmeticTypeCanEquip,
  isTitleBadgeCosmetic,
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
  type CosmeticType,
  type UserChestDto,
} from '@entities/quest';
import { GamificationGuide } from '@widgets/gamification-guide/GamificationGuide';
import { CharacterPortraitWithFrame } from '@widgets/character-portrait/CharacterPortraitWithFrame';

type ChestModalState =
  | { phase: 'tapping'; tier: ChestTier; chestId: number; frameIndex: number }
  | { phase: 'reveal'; tier: ChestTier; result: OpenChestResult };

function chestItemNameRu(tier: ChestTier): string {
  if (tier === 'RARE') return 'Редкий сундук';
  if (tier === 'EPIC') return 'Эпический сундук';
  return 'Обычный сундук';
}

const STORAGE_SLOTS_PER_PAGE = 12;

function getStorageTotalPages(itemCount: number): number {
  return Math.max(1, Math.ceil(itemCount / STORAGE_SLOTS_PER_PAGE));
}

function sliceStoragePage<T>(items: T[], page: number): T[] {
  const totalPages = getStorageTotalPages(items.length);
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const start = safePage * STORAGE_SLOTS_PER_PAGE;
  return items.slice(start, start + STORAGE_SLOTS_PER_PAGE);
}

function StoragePagedGrid(props: {
  page: number;
  itemCount: number;
  onPageChange: (page: number) => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  const totalPages = getStorageTotalPages(props.itemCount);
  const safePage = Math.min(Math.max(0, props.page), totalPages - 1);

  return (
    <div className="trello-character-storage-page">
      <ul
        className="trello-character-inventory-grid trello-character-inventory-grid--storage"
        role="list"
        aria-label={props.ariaLabel}
      >
        {props.children}
      </ul>
      <nav className="trello-character-storage-pager" aria-label="Навигация по страницам">
          <button
            type="button"
            className="trello-character-storage-pager-btn"
            disabled={safePage <= 0}
            onClick={() => props.onPageChange(safePage - 1)}
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
            onClick={() => props.onPageChange(safePage + 1)}
            aria-label="Следующая страница"
          >
            →
          </button>
      </nav>
    </div>
  );
}

function sortByObtainedAtAsc(items: InventoryItemDto[]): InventoryItemDto[] {
  return [...items].sort((a, b) => {
    const timeDiff = new Date(a.obtainedAt).getTime() - new Date(b.obtainedAt).getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.id - b.id;
  });
}

function sortChestsByCreatedAtAsc(chests: UserChestDto[]): UserChestDto[] {
  return [...chests].sort((a, b) => {
    const timeDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.id - b.id;
  });
}

function renderEmptyStorageSlots(count: number, keyPrefix: string) {
  return Array.from({ length: count }).map((_, index) => (
    <li key={`${keyPrefix}-empty-${index}`} className="trello-character-inventory-grid-item">
      <div className="trello-character-inventory-slot trello-character-inventory-slot--empty" />
    </li>
  ));
}

type CharacterPortraitPreview = {
  avatarPreset: string;
  frameKey?: string | null;
  profileBackgroundKey?: string | null;
};

type Props = {
  accessToken: string;
  characterGender?: GenderCharacter;
  characterPortrait?: CharacterPortraitPreview;
  activeTab: ProfileCharacterTabKey;
  tabOpenSignal?: number;
  onCharacterRefresh?: () => Promise<void>;
};

export type ProfileCharacterTabKey =
  | 'inventory'
  | 'quests'
  | 'shop'
  | 'achievements'
  | 'rules';

type StorageInnerTabKey = 'chests' | 'cosmetics' | 'items';

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
      <div className="trello-character-achievement-visual">
        <img
          src={achievementIconUrl(item.key)}
          alt=""
          width={ACHIEVEMENT_ICON_CARD_SIZE}
          height={ACHIEVEMENT_ICON_CARD_SIZE}
          className={achievementIconLockedClassName(item.unlocked)}
          loading="lazy"
          draggable={false}
        />
      </div>
      <div className="trello-character-achievement-body">
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
      </div>
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
  const [popupTab, setPopupTab] = useState<'inventory' | 'achievements' | null>(null);
  const [storageInnerTab, setStorageInnerTab] = useState<StorageInnerTabKey>('chests');
  const [storageChestPage, setStorageChestPage] = useState(0);
  const [storageCosmeticsPage, setStorageCosmeticsPage] = useState(0);
  const [storageItemsPage, setStorageItemsPage] = useState(0);
  const [cosmeticPreviewItem, setCosmeticPreviewItem] = useState<InventoryItemDto | null>(null);

  useEffect(() => {
    if (props.activeTab === 'inventory' || props.activeTab === 'achievements') {
      setPopupTab(props.activeTab);
      if (props.activeTab === 'inventory') {
        setStorageInnerTab('chests');
      }
      return;
    }
    setPopupTab(null);
  }, [props.activeTab, props.tabOpenSignal]);
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

  const unlockedAchievementsCount = achievements?.achievements.filter((a) => a.unlocked).length ?? 0;
  const unopenedChests = useMemo(
    () => sortChestsByCreatedAtAsc(userChests.filter((chest) => !chest.openedAt)),
    [userChests],
  );
  const isPopupOnlyTab =
    props.activeTab === 'inventory' || props.activeTab === 'achievements';

  const inventoryWithoutBadges = useMemo(
    () => inventory.filter((i) => !isTitleBadgeCosmetic(i.cosmeticItem.type)),
    [inventory],
  );

  const equippableInventory = useMemo(
    () =>
      sortByObtainedAtAsc(
        inventoryWithoutBadges.filter((i) => cosmeticTypeCanEquip(i.cosmeticItem.type)),
      ),
    [inventoryWithoutBadges],
  );
  const otherInventoryItems = useMemo(
    () =>
      sortByObtainedAtAsc(
        inventoryWithoutBadges.filter((i) => !cosmeticTypeCanEquip(i.cosmeticItem.type)),
      ),
    [inventoryWithoutBadges],
  );

  useEffect(() => {
    setStorageChestPage(0);
    setStorageCosmeticsPage(0);
    setStorageItemsPage(0);
    setCosmeticPreviewItem(null);
  }, [storageInnerTab]);

  const equippedCosmeticKey = useCallback(
    (type: CosmeticType) =>
      equippableInventory.find((i) => i.equipped && i.cosmeticItem.type === type)?.cosmeticItem.key ??
      null,
    [equippableInventory],
  );

  const portraitPreviewFrameKey = useMemo(() => {
    if (cosmeticPreviewItem?.cosmeticItem.type === 'PORTRAIT_FRAME') {
      return cosmeticPreviewItem.cosmeticItem.key;
    }
    return (
      equippedCosmeticKey('PORTRAIT_FRAME') ?? props.characterPortrait?.frameKey ?? null
    );
  }, [cosmeticPreviewItem, equippedCosmeticKey, props.characterPortrait?.frameKey]);

  const portraitPreviewBackgroundKey = useMemo(() => {
    if (cosmeticPreviewItem?.cosmeticItem.type === 'PROFILE_BACKGROUND') {
      return cosmeticPreviewItem.cosmeticItem.key;
    }
    return (
      equippedCosmeticKey('PROFILE_BACKGROUND') ??
      props.characterPortrait?.profileBackgroundKey ??
      null
    );
  }, [cosmeticPreviewItem, equippedCosmeticKey, props.characterPortrait?.profileBackgroundKey]);

  useEffect(() => {
    setStorageChestPage((page) => Math.min(page, getStorageTotalPages(unopenedChests.length) - 1));
  }, [unopenedChests.length]);

  useEffect(() => {
    setStorageCosmeticsPage((page) =>
      Math.min(page, getStorageTotalPages(equippableInventory.length) - 1),
    );
  }, [equippableInventory.length]);

  useEffect(() => {
    setStorageItemsPage((page) => Math.min(page, getStorageTotalPages(otherInventoryItems.length) - 1));
  }, [otherInventoryItems.length]);
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

  async function handleCosmeticSlotActivate(item: InventoryItemDto) {
    if (item.equipped) {
      setCosmeticPreviewItem(null);
      await handleUnequip(item.id);
      return;
    }
    setCosmeticPreviewItem(item);
    await handleEquip(item.id);
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

  return (
    <section
      className="trello-character-quests-section"
      aria-labelledby={isPopupOnlyTab ? undefined : 'character-quests-heading'}
    >
      {!isPopupOnlyTab && (
        <h3 id="character-quests-heading" className="trello-character-rpg-panel-title">
          Арсенал и прогресс
        </h3>
      )}

      <div className="trello-character-quests-body trello-character-rpg-tab-panel">
        {loadError && <div className="trello-banner trello-banner-error">{loadError}</div>}
        {!quests && !loadError && !isPopupOnlyTab && <p className="trello-muted">Загрузка данных персонажа…</p>}

        {props.activeTab === 'shop' && dustShop && (
          <>
            <p className="trello-character-rpg-overview-subtitle">Магазин сундуков</p>
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
            <div className="trello-character-dust-shop-grid">
              {dustShop.options.map((option) => (
                <div key={option.tier} className="trello-character-dust-shop-card">
                  <div
                    className="trello-character-shop-chest-visual trello-character-chest-slot-wrap"
                    data-chest-tier={option.tier.toLowerCase()}
                  >
                    <ChestIcon tier={option.tier} size={161} />
                    <ChestLootOddsButton tier={option.tier} />
                  </div>
                  <span className="trello-character-dust-shop-title">{chestItemNameRu(option.tier)}</span>
                  <button
                    type="button"
                    className="trello-btn trello-btn-primary trello-btn-sm trello-character-shop-buy-btn"
                    disabled={busy || !option.canAfford}
                    onClick={() => void handlePurchaseChest(option.tier)}
                  >
                    <span className="trello-character-shop-buy-content">
                      <span>Купить</span>
                      <span className="trello-character-shop-buy-price">{option.cost}</span>
                      <DustIcon size={DUST_ICON_SIZE_SHOP} />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {props.activeTab === 'quests' && quests && (
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
            <QuestGroup
              title="За месяц"
              group={quests.monthly}
              onOpenChest={(id, tier) => void handleOpenChest(id, tier)}
              openingChestId={openingChestId}
            />
          </>
        )}

        {!isPopupOnlyTab && props.activeTab === 'achievements' && achievements && (
          <>
            <p className="trello-character-rpg-overview-subtitle">
              Достижения ({unlockedAchievementsCount}/{achievements.achievements.length})
            </p>
            <ul className="trello-character-achievement-list trello-character-achievement-list--columns">
              {achievements.achievements.map((a) => (
                <AchievementRow key={a.key} item={a} />
              ))}
            </ul>
          </>
        )}

        {props.activeTab === 'rules' && (
          <div className="trello-character-rules-panel">
            <GamificationGuide />
          </div>
        )}
      </div>

      {popupTab &&
        createPortal(
          <div className="trello-modal-backdrop" role="presentation" onClick={() => setPopupTab(null)}>
            <div
              className={[
                'trello-modal',
                'trello-character-loot-popup',
                popupTab === 'inventory'
                  ? 'trello-character-loot-popup--static trello-character-loot-popup--storage'
                  : '',
                popupTab === 'achievements' ? 'trello-character-loot-popup--static' : '',
                popupTab === 'inventory' && storageInnerTab === 'cosmetics'
                  ? 'trello-character-loot-popup--storage-cosmetics'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="dialog"
              aria-modal
              aria-labelledby="character-loot-popup-title"
              onClick={(e) => e.stopPropagation()}
              onTouchMove={popupTab === 'inventory' ? (e) => e.stopPropagation() : undefined}
            >
              <div
                className={[
                  'trello-modal-head',
                  popupTab === 'inventory' ? 'trello-character-loot-popup-head--centered' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <h2
                  id="character-loot-popup-title"
                  className={[
                    'trello-modal-title',
                    popupTab === 'inventory' ? 'trello-character-loot-popup-title--hero' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {popupTab === 'inventory' ? 'Хранилище' : 'Достижения'}
                </h2>
                <button
                  type="button"
                  className="trello-modal-close"
                  onClick={() => setPopupTab(null)}
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>
              <div
                className={
                  popupTab === 'inventory' ? 'trello-modal-body trello-character-storage-modal-body' : 'trello-modal-body'
                }
              >
                {popupTab === 'inventory' && (
                  <>
                    <div
                      className="trello-character-storage-inner-tabs"
                      role="tablist"
                      aria-label="Разделы хранилища"
                    >
                      {(
                        [
                          { key: 'chests', label: 'Сундуки' },
                          { key: 'cosmetics', label: 'Косметика' },
                          { key: 'items', label: 'Предметы' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          aria-selected={storageInnerTab === tab.key}
                          className={
                            storageInnerTab === tab.key
                              ? 'trello-character-storage-inner-tab trello-character-storage-inner-tab--active'
                              : 'trello-character-storage-inner-tab'
                          }
                          onClick={() => setStorageInnerTab(tab.key)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    {storageInnerTab === 'chests' && (() => {
                      const pageChests = sliceStoragePage(unopenedChests, storageChestPage);
                      const emptyCount = STORAGE_SLOTS_PER_PAGE - pageChests.length;
                      return (
                        <StoragePagedGrid
                          page={storageChestPage}
                          itemCount={unopenedChests.length}
                          onPageChange={setStorageChestPage}
                          ariaLabel="Сундуки в хранилище"
                        >
                          {pageChests.map((chest) => (
                            <li key={`popup-inventory-${chest.id}`} className="trello-character-inventory-grid-item">
                              <button
                                type="button"
                                className="trello-character-inventory-slot trello-character-inventory-slot--clickable"
                                disabled={busy || openingChestId === chest.id}
                                onClick={() => void handleOpenChest(chest.id, chest.tier)}
                              >
                                <div className="trello-character-chest-slot-wrap">
                                  <ChestIcon tier={chest.tier} size={100} />
                                  <ChestLootOddsButton tier={chest.tier} />
                                </div>
                                <strong className="trello-character-inventory-slot-title">
                                  {CHEST_TIER_LABEL_RU[chest.tier]} сундук
                                </strong>
                              </button>
                            </li>
                          ))}
                          {renderEmptyStorageSlots(emptyCount, `chest-${storageChestPage}`)}
                        </StoragePagedGrid>
                      );
                    })()}
                    {storageInnerTab === 'cosmetics' && props.characterPortrait && (() => {
                      const pageItems = sliceStoragePage(equippableInventory, storageCosmeticsPage);
                      const emptyCount = STORAGE_SLOTS_PER_PAGE - pageItems.length;
                      return (
                        <div className="trello-character-storage-cosmetics-layout trello-character-storage-cosmetics-layout--with-preview">
                          <aside
                            className="trello-character-storage-preview-column"
                            aria-label="Предпросмотр персонажа"
                          >
                            <div className="trello-character-storage-preview-portrait">
                              <CharacterPortraitWithFrame
                                avatarPreset={props.characterPortrait.avatarPreset}
                                frameKey={portraitPreviewFrameKey}
                                profileBackgroundKey={portraitPreviewBackgroundKey}
                              />
                            </div>
                            <p className="trello-character-storage-preview-hint">
                              Нажмите предмет, чтобы примерить на аватаре
                            </p>
                          </aside>
                          <div className="trello-character-storage-grid-column">
                            <StoragePagedGrid
                              page={storageCosmeticsPage}
                              itemCount={equippableInventory.length}
                              onPageChange={setStorageCosmeticsPage}
                              ariaLabel="Косметика в хранилище"
                            >
                              {pageItems.map((item) => {
                                const previewUrl = cosmeticAssetUrl(item.cosmeticItem.key);
                                return (
                                  <li
                                    key={`popup-cosmetic-${item.id}`}
                                    className="trello-character-inventory-grid-item"
                                  >
                                    <button
                                      type="button"
                                      className={
                                        item.equipped
                                          ? 'trello-character-inventory-slot trello-character-inventory-slot--clickable trello-character-cosmetic-storage-slot trello-character-cosmetic-storage-slot--equipped'
                                          : 'trello-character-inventory-slot trello-character-inventory-slot--clickable trello-character-cosmetic-storage-slot'
                                      }
                                      disabled={busy}
                                      aria-pressed={item.equipped}
                                      aria-label={`${item.cosmeticItem.nameRu}. ${item.equipped ? 'Надето' : 'Не надето'}`}
                                      onClick={() => void handleCosmeticSlotActivate(item)}
                                    >
                                      {previewUrl ? (
                                        <img
                                          src={previewUrl}
                                          alt=""
                                          className="trello-character-storage-slot-visual"
                                        />
                                      ) : (
                                        <span
                                          className="trello-character-storage-slot-fallback"
                                          aria-hidden
                                        >
                                          {COSMETIC_TYPE_LABEL_RU[item.cosmeticItem.type]}
                                        </span>
                                      )}
                                      <span className="trello-character-inventory-slot-title">
                                        {item.cosmeticItem.nameRu}
                                      </span>
                                      <span className="trello-character-inventory-slot-meta">
                                        {item.equipped ? 'Надето' : 'Не надето'}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                              {renderEmptyStorageSlots(emptyCount, `cosmetic-${storageCosmeticsPage}`)}
                            </StoragePagedGrid>
                          </div>
                        </div>
                      );
                    })()}
                    {storageInnerTab === 'cosmetics' && !props.characterPortrait && (
                      <p className="trello-muted">Загрузка предпросмотра…</p>
                    )}
                    {storageInnerTab === 'items' && (() => {
                      const pageItems = sliceStoragePage(otherInventoryItems, storageItemsPage);
                      const emptyCount = STORAGE_SLOTS_PER_PAGE - pageItems.length;
                      return (
                        <StoragePagedGrid
                          page={storageItemsPage}
                          itemCount={otherInventoryItems.length}
                          onPageChange={setStorageItemsPage}
                          ariaLabel="Предметы в хранилище"
                        >
                          {pageItems.map((item) => {
                            const previewUrl = cosmeticAssetUrl(item.cosmeticItem.key);
                            return (
                              <li key={`popup-item-${item.id}`} className="trello-character-inventory-grid-item">
                                <div className="trello-character-inventory-slot trello-character-inventory-slot--clickable">
                                  {previewUrl ? (
                                    <img
                                      src={previewUrl}
                                      alt=""
                                      className="trello-character-storage-slot-visual"
                                    />
                                  ) : (
                                    <span className="trello-character-storage-slot-fallback" aria-hidden>
                                      {item.cosmeticItem.nameRu.slice(0, 1)}
                                    </span>
                                  )}
                                  <span className="trello-character-inventory-slot-title">
                                    {item.cosmeticItem.nameRu}
                                  </span>
                                  <span className="trello-character-inventory-slot-meta">
                                    {COSMETIC_TYPE_LABEL_RU[item.cosmeticItem.type]}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                          {renderEmptyStorageSlots(emptyCount, `item-${storageItemsPage}`)}
                        </StoragePagedGrid>
                      );
                    })()}
                  </>
                )}
                {popupTab === 'achievements' && achievements && (
                  <>
                    <p className="trello-character-loot-popup-subtitle">Доска достижений героя</p>
                    <ul className="trello-character-achievement-list trello-character-achievement-list--columns">
                      {achievements.achievements.map((a) => (
                        <AchievementRow key={`popup-achievement-${a.key}`} item={a} />
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
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
