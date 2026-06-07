import { useCallback, useEffect, useState } from 'react';
import { formatApiError } from '@shared/api';
import { fetchFriends, type FriendView } from '@entities/social';
import { MANA_MAX, BOSS_ATTACK_MANA_COST } from '@entities/reward/lib/xpRewards';
import {
  acceptPartyInvite,
  attackPartyBoss,
  cancelPartyRaid,
  createPartyKickVote,
  createPartyRaid,
  declinePartyInvite,
  fetchBossCatalog,
  fetchPartyMine,
  kickPartyMember,
  startPartyRaid,
  votePartyKick,
  type BossCatalogItem,
  type PartyRaidView,
} from '@entities/party';
import { BOSS_ICON_SIZE, BOSS_ICON_SIZE_PICK, BOSS_ICON_SIZE_SM, bossIconUrl } from '@entities/party/lib/bossAssets';

type Props = {
  accessToken: string;
  currentUserId: number;
  manaCurrent: number;
  onRefreshCharacter?: () => Promise<void>;
};

function memberLabel(name: string, characterName: string | null): string {
  return characterName?.trim() || name;
}

export function RaidPanel({
  accessToken,
  currentUserId,
  manaCurrent,
  onRefreshCharacter,
}: Props) {
  const [bosses, setBosses] = useState<BossCatalogItem[]>([]);
  const [friends, setFriends] = useState<FriendView[]>([]);
  const [raid, setRaid] = useState<PartyRaidView | null>(null);
  const [invites, setInvites] = useState<PartyRaidView[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState<string | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const [bossList, mine, friendsList] = await Promise.all([
        fetchBossCatalog(accessToken),
        fetchPartyMine(accessToken),
        fetchFriends(accessToken),
      ]);
      setBosses(bossList);
      setRaid(mine.raid);
      setInvites(mine.pendingInvites);
      setFriends(friendsList);
      if (!selectedBoss && bossList[0]) {
        setSelectedBoss(bossList[0].key);
      }
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setLoading(false);
    }
  }, [accessToken, selectedBoss]);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function afterAction(update: PartyRaidView | null = raid) {
    if (update) setRaid(update);
    await reload();
    await onRefreshCharacter?.();
  }

  function toggleFriend(userId: number) {
    setSelectedFriends((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  }

  async function handleCreate() {
    if (!selectedBoss || selectedFriends.length === 0) {
      setMsg('Выберите босса и хотя бы одного друга');
      return;
    }
    setBusy(true);
    try {
      const created = await createPartyRaid(accessToken, selectedBoss, selectedFriends);
      setCreateOpen(false);
      setSelectedFriends([]);
      setRaid(created);
      await reload();
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  async function runRaidAction(fn: () => Promise<PartyRaidView>) {
    setBusy(true);
    setMsg(null);
    try {
      const updated = await fn();
      await afterAction(updated);
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  function renderRaidCard(r: PartyRaidView, options?: { invite?: boolean }) {
    const isLeader = r.leaderId === currentUserId;
    const hpPct = Math.max(0, Math.min(100, r.remainingPct));
    const canAttack =
      r.status === 'ACTIVE' &&
      r.myStatus === 'ACTIVE' &&
      manaCurrent >= BOSS_ATTACK_MANA_COST;

    return (
      <div key={r.id} className="trello-party-raid-card">
        <div className="trello-party-raid-head">
          <img
            src={bossIconUrl(r.bossKey)}
            alt=""
            width={BOSS_ICON_SIZE_SM}
            height={BOSS_ICON_SIZE_SM}
            className="trello-party-boss-icon"
            loading="lazy"
            draggable={false}
          />
          <h3 className="trello-party-raid-title">{r.bossNameRu}</h3>
          <span className="trello-party-raid-status">{r.status}</span>
        </div>
        <p className="trello-party-raid-desc">{r.bossDescriptionRu}</p>
        {r.status === 'ACTIVE' || r.status === 'DEFEATED' ? (
          <div className="trello-party-boss-hp" aria-label={`HP босса ${hpPct.toFixed(1)}%`}>
            <div className="trello-party-boss-hp-fill" style={{ width: `${hpPct}%` }} />
            <span className="trello-party-boss-hp-label">{hpPct.toFixed(1)}%</span>
          </div>
        ) : null}
        <ul className="trello-party-member-list">
          {r.members.map((m) => (
            <li key={m.userId} className="trello-party-member-item">
              <span>
                {memberLabel(m.name, m.characterName)}
                {m.role === 'LEADER' ? ' · лидер' : ''}
                {m.status === 'INVITED' ? ' · приглашён' : ''}
              </span>
              <span className="trello-party-member-meta">
                {m.contributionPct > 0 ? `${m.contributionPct.toFixed(1)}% урона` : ''}
              </span>
              {r.status === 'ACTIVE' &&
              m.status === 'ACTIVE' &&
              m.userId !== currentUserId &&
              (isLeader || r.myStatus === 'ACTIVE') ? (
                <span className="trello-party-member-actions">
                  {isLeader && m.role !== 'LEADER' ? (
                    <button
                      type="button"
                      className="trello-btn trello-btn-ghost trello-btn-sm"
                      disabled={busy}
                      onClick={() =>
                        void runRaidAction(() =>
                          kickPartyMember(accessToken, r.id, m.userId),
                        )
                      }
                    >
                      Исключить
                    </button>
                  ) : null}
                  {!isLeader && m.userId !== r.leaderId ? (
                    <button
                      type="button"
                      className="trello-btn trello-btn-ghost trello-btn-sm"
                      disabled={busy}
                      onClick={() =>
                        void runRaidAction(() =>
                          createPartyKickVote(accessToken, r.id, m.userId),
                        )
                      }
                    >
                      Голосовать
                    </button>
                  ) : null}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        {r.openKickVote ? (
          <div className="trello-party-kick-vote">
            Голосование за исключение: {r.openKickVote.approveCount}/
            {r.openKickVote.requiredCount}
            {r.openKickVote.targetUserId !== currentUserId ? (
              <button
                type="button"
                className="trello-btn trello-btn-ghost trello-btn-sm"
                disabled={busy}
                onClick={() =>
                  void runRaidAction(() =>
                    votePartyKick(accessToken, r.id, r.openKickVote!.id),
                  )
                }
              >
                Поддержать
              </button>
            ) : null}
          </div>
        ) : null}
        {r.status === 'ACTIVE' ? (
          <p className="trello-party-raid-meta">
            Урон за удар: {r.damagePerAttack.toFixed(2)}% · мана {manaCurrent}/{MANA_MAX}
          </p>
        ) : null}
        <div className="trello-party-raid-actions">
          {options?.invite ? (
            <>
              <button
                type="button"
                className="trello-btn trello-btn-primary"
                disabled={busy}
                onClick={() => void runRaidAction(() => acceptPartyInvite(accessToken, r.id))}
              >
                Принять
              </button>
              <button
                type="button"
                className="trello-btn trello-btn-ghost"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await declinePartyInvite(accessToken, r.id);
                    await reload();
                  } catch (e) {
                    setMsg(formatApiError(e));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Отклонить
              </button>
            </>
          ) : null}
          {!options?.invite && r.status === 'INVITING' && isLeader ? (
            <>
              <button
                type="button"
                className="trello-btn trello-btn-primary"
                disabled={busy || r.activeMemberCount < 2}
                onClick={() => void runRaidAction(() => startPartyRaid(accessToken, r.id))}
              >
                Начать рейд
              </button>
              <button
                type="button"
                className="trello-btn trello-btn-ghost"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await cancelPartyRaid(accessToken, r.id);
                    setRaid(null);
                    await reload();
                  } catch (e) {
                    setMsg(formatApiError(e));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Отменить
              </button>
            </>
          ) : null}
          {!options?.invite && r.status === 'ACTIVE' && r.myStatus === 'ACTIVE' ? (
            <button
              type="button"
              className="trello-btn trello-btn-primary"
              disabled={busy || !canAttack}
              onClick={() => void runRaidAction(() => attackPartyBoss(accessToken, r.id))}
            >
              Атака (−{BOSS_ATTACK_MANA_COST} маны)
            </button>
          ) : null}
        </div>
        {r.recentHits.length > 0 ? (
          <ul className="trello-party-hit-log">
            {r.recentHits.slice(0, 8).map((h) => (
              <li key={h.id}>
                {h.userName} −{h.damagePct.toFixed(2)}%
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  if (loading) {
    return <div className="trello-party-loading">Загрузка рейда…</div>;
  }

  return (
    <div className="trello-party-panel">
      {msg ? <div className="trello-banner trello-banner-error">{msg}</div> : null}

      {invites.length > 0 ? (
        <section className="trello-party-section">
          <h2 className="trello-party-section-title">Приглашения в рейд</h2>
          {invites.map((inv) => renderRaidCard(inv, { invite: true }))}
        </section>
      ) : null}

      {raid ? (
        <section className="trello-party-section">
          <h2 className="trello-party-section-title">Текущий рейд</h2>
          {renderRaidCard(raid)}
        </section>
      ) : (
        <section className="trello-party-section">
          <h2 className="trello-party-section-title">Рейд с друзьями</h2>
          <p className="trello-party-intro">
            Закрывайте карточки — получайте ману. Атакуйте босса вместе с друзьями и
            забирайте boss-сундук.
          </p>
          {!createOpen ? (
            <button
              type="button"
              className="trello-btn trello-btn-primary"
              disabled={friends.length === 0}
              onClick={() => setCreateOpen(true)}
            >
              Собрать пати
            </button>
          ) : (
            <div className="trello-party-create">
              <h3 className="trello-party-create-subtitle">Выберите босса</h3>
              <div className="trello-party-boss-grid">
                {bosses.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    className={
                      selectedBoss === b.key
                        ? 'trello-party-boss-card trello-party-boss-card--active'
                        : 'trello-party-boss-card'
                    }
                    data-boss-tier={b.chestTier.toLowerCase()}
                    onClick={() => setSelectedBoss(b.key)}
                  >
                    <div className="trello-party-boss-card-visual">
                      <img
                        src={bossIconUrl(b.key)}
                        alt=""
                        width={BOSS_ICON_SIZE_PICK}
                        height={BOSS_ICON_SIZE_PICK}
                        className="trello-party-boss-icon trello-party-boss-icon--pick"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <div className="trello-party-boss-card-body">
                      <strong className="trello-party-boss-card-name">{b.nameRu}</strong>
                      <span className="trello-party-boss-card-desc">{b.descriptionRu}</span>
                    </div>
                  </button>
                ))}
              </div>
              <h3 className="trello-party-create-subtitle">Друзья</h3>
              {friends.length === 0 ? (
                <p>Добавьте друзей, чтобы начать рейд.</p>
              ) : (
                <ul className="trello-party-friend-pick">
                  {friends.map((f) => (
                    <li key={f.user.userId}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedFriends.includes(f.user.userId)}
                          onChange={() => toggleFriend(f.user.userId)}
                        />
                        {memberLabel(f.user.name, f.user.characterName)}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <div className="trello-party-raid-actions">
                <button
                  type="button"
                  className="trello-btn trello-btn-primary"
                  disabled={busy}
                  onClick={() => void handleCreate()}
                >
                  Отправить приглашения
                </button>
                <button
                  type="button"
                  className="trello-btn trello-btn-ghost"
                  onClick={() => setCreateOpen(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
