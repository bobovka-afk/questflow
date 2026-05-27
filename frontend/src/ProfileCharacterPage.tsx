import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { api, formatApiError, type ApiError } from './lib/api';
import {
  CHARACTER_ROLES,
  type CharacterDto,
  type CharacterRole,
  type GenderCharacter,
  characterPortraitUrl,
  presetForRole,
  ROLE_LABEL_RU,
} from './lib/character';
import { getCharacterXpTowardNext } from './lib/level-curve';
import { CheckinStreakProfileRow } from './CheckinStreakProfileRow';
import { GamificationGuide } from './GamificationGuide';
import {
  computeStreakProfileFeedback,
  readCharacterStreakSnapshot,
  snapshotFromCharacter,
  writeCharacterStreakSnapshot,
  type StreakProfileFeedback,
} from './lib/characterStreakSnapshot';
import { CHARACTER_HEALTH_MAX } from './lib/xpRewards';
import { CharacterCreateForm } from './CharacterCreateForm';
import { SpaLink } from './lib/navigation';
import { ProfileToolbarAnchor } from './profileToolbarOutlet';
import { ProfileCharacterQuestsPanel } from './ProfileCharacterQuestsPanel';
import { CharacterPortraitWithFrame } from './CharacterPortraitWithFrame';

type Props = {
  accessToken: string;
  onCharacterUpdated?: (c: CharacterDto) => void;
};

function roleFromPreset(preset: string): CharacterRole {
  const base = preset.replace(/_MAN$|_WOMAN$/i, '').replace(/^QUEST_/, '').toUpperCase();
  return (CHARACTER_ROLES as readonly string[]).includes(base)
    ? (base as CharacterRole)
    : 'DRUID';
}

export function ProfileCharacterPage(props: Props) {
  const [character, setCharacter] = useState<CharacterDto | null>(null);
  const [loadPhase, setLoadPhase] = useState<'loading' | 'ready' | 'missing' | 'error'>(
    'loading',
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<GenderCharacter>('MALE');
  const [role, setRole] = useState<CharacterRole>('DRUID');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saveCheckVisible, setSaveCheckVisible] = useState(false);
  const [streakAnimateFrom, setStreakAnimateFrom] = useState<number | null>(null);
  const [streakCelebrate, setStreakCelebrate] = useState(false);
  const [streakLostNotice, setStreakLostNotice] = useState<Extract<
    StreakProfileFeedback,
    { kind: 'lost' }
  > | null>(null);

  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoadPhase('loading');
      setLoadError(null);
      try {
        const c = await api<CharacterDto>('/character/me', {
          method: 'GET',
          accessToken: props.accessToken,
        });
        if (cancelled) return;
        setCharacter(c);
        setName(c.name);
        setGender(c.gender);
        setRole(roleFromPreset(c.avatarPreset));
        setLoadPhase('ready');
      } catch (e) {
        if (cancelled) return;
        const err = e as ApiError;
        if (
          err.status === 404 &&
          (!err.code || err.code === 'CHARACTER_NOT_FOUND')
        ) {
          setCharacter(null);
          setLoadPhase('missing');
          return;
        }
        setLoadPhase('error');
        setLoadError(formatApiError(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [props.accessToken, loadKey]);

  useEffect(() => {
    if (!saveCheckVisible) return;
    const id = window.setTimeout(() => setSaveCheckVisible(false), 1000);
    return () => window.clearTimeout(id);
  }, [saveCheckVisible]);

  useEffect(() => {
    if (!character) return;

    const current = snapshotFromCharacter(character);
    const previous = readCharacterStreakSnapshot(character.userId);
    const feedback = computeStreakProfileFeedback(previous, current);

    setStreakLostNotice(null);
    setStreakAnimateFrom(null);
    setStreakCelebrate(false);

    if (feedback?.kind === 'increased') {
      setStreakAnimateFrom(feedback.from);
      setStreakCelebrate(true);
      const timer = window.setTimeout(() => setStreakCelebrate(false), 720);
      writeCharacterStreakSnapshot(character.userId, current);
      return () => window.clearTimeout(timer);
    }

    if (feedback?.kind === 'lost') {
      setStreakLostNotice(feedback);
    }

    writeCharacterStreakSnapshot(character.userId, current);
  }, [character?.userId, character?.checkinStreak, character?.lastCheckinDayKey]);

  useEffect(() => {
    if (!character) return;
    setName(character.name);
    setGender(character.gender);
    setRole(roleFromPreset(character.avatarPreset));
  }, [character]);

  const avatarPreset = useMemo(() => presetForRole(gender, role), [gender, role]);

  const xpToward = useMemo(() => {
    if (!character) {
      return { atMaxLevel: false, into: 0, needed: 0, pct: 0 } as const;
    }
    return getCharacterXpTowardNext(character.level, character.currentXp);
  }, [character]);

  function openEdit() {
    if (!character) return;
    setName(character.name);
    setGender(character.gender);
    setRole(roleFromPreset(character.avatarPreset));
    setMsg(null);
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setMsg(null);
    if (character) {
      setName(character.name);
      setGender(character.gender);
      setRole(roleFromPreset(character.avatarPreset));
    }
  }

  async function save() {
    if (!character) return;
    setMsg(null);
    const trimmed = name.trim();
    if (trimmed.length < 3 || trimmed.length > 40) {
      setMsg('Имя: от 3 до 40 символов.');
      return;
    }
    const patch: { name?: string; gender?: GenderCharacter; avatarPreset?: string } = {};
    if (trimmed !== character.name) patch.name = trimmed;
    if (gender !== character.gender) patch.gender = gender;
    const nextPreset = avatarPreset;
    if (nextPreset !== character.avatarPreset) patch.avatarPreset = nextPreset;
    if (Object.keys(patch).length === 0) {
      setMsg('Нет изменений.');
      return;
    }
    setBusy(true);
    try {
      const updated = await api<CharacterDto>('/character/me', {
        method: 'PATCH',
        accessToken: props.accessToken,
        json: patch,
      });
      setCharacter(updated);
      props.onCharacterUpdated?.(updated);
      setEditOpen(false);
      setMsg(null);
      setSaveCheckVisible(true);
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  function handleCharacterCreated(c: CharacterDto) {
    setCharacter(c);
    setName(c.name);
    setGender(c.gender);
    setRole(roleFromPreset(c.avatarPreset));
    setLoadPhase('ready');
    props.onCharacterUpdated?.(c);
  }

  if (loadPhase === 'missing') {
    return (
      <div className="trello-app-shell">
        <div className="trello-boards-main">
          <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
            <div className="trello-topbar-stripe-left">
              <SpaLink className="trello-top-left-brand trello-top-left-brand--stripe" to="/workspaces">
                <span className="trello-logo" aria-hidden />
                <span className="trello-top-left-brand-text">Questflow</span>
              </SpaLink>
            </div>
            <h1 className="trello-topbar-stripe-center">Создайте своего персонажа</h1>
            <div className="trello-topbar-actions">
              <SpaLink className="trello-btn trello-btn-ghost" to="/workspaces">
                Назад
              </SpaLink>
              <SpaLink className="trello-btn trello-btn-ghost" to="/profile/me">
                Профиль
              </SpaLink>
              <ProfileToolbarAnchor />
            </div>
          </header>
          <CharacterCreateForm
            accessToken={props.accessToken}
            onCreated={handleCharacterCreated}
            submitLabel="Создать персонажа"
          />
        </div>
      </div>
    );
  }

  if (loadPhase === 'error' && loadError) {
    return (
      <div className="trello-app-shell">
        <div className="trello-boards-main">
          <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
            <div className="trello-topbar-stripe-left">
              <SpaLink className="trello-top-left-brand trello-top-left-brand--stripe" to="/workspaces">
                <span className="trello-logo" aria-hidden />
                <span className="trello-top-left-brand-text">Questflow</span>
              </SpaLink>
            </div>
            <h1 className="trello-topbar-stripe-center">Персонаж</h1>
            <div className="trello-topbar-actions">
              <SpaLink className="trello-btn trello-btn-ghost" to="/profile/me">
                Профиль
              </SpaLink>
              <ProfileToolbarAnchor />
            </div>
          </header>
          <div className="trello-banner trello-banner-error">{loadError}</div>
          <div className="trello-panel" style={{ maxWidth: 480, margin: '16px auto 0' }}>
            <button
              type="button"
              className="trello-btn trello-btn-primary"
              onClick={() => setLoadKey((k) => k + 1)}
            >
              Повторить
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadPhase === 'loading' || !character) {
    return (
      <div className="trello-app-shell">
        <div className="trello-boards-main trello-character-loading">Загрузка персонажа…</div>
      </div>
    );
  }

  return (
    <div className="trello-app-shell">
      <div className="trello-boards-main">
        <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
          <div className="trello-topbar-stripe-left">
            <SpaLink className="trello-top-left-brand trello-top-left-brand--stripe" to="/workspaces">
              <span className="trello-logo" aria-hidden />
              <span className="trello-top-left-brand-text">Questflow</span>
            </SpaLink>
          </div>
          <h1 className="trello-topbar-stripe-center trello-topbar-stripe-center--ellipsis" title={character.name}>
            {character.name}
          </h1>
          <div className="trello-topbar-actions">
            <SpaLink className="trello-btn trello-btn-ghost" to="/profile/me">
              Аккаунт
            </SpaLink>
            <SpaLink className="trello-btn trello-btn-ghost" to="/workspaces">
              Назад
            </SpaLink>
            <ProfileToolbarAnchor />
          </div>
        </header>

        {msg && <div className="trello-banner trello-banner-error">{msg}</div>}

        <section className="trello-character-profile">
          <div className="trello-character-profile-hero trello-character-profile-hero--stacked">
            <div className="trello-character-profile-portrait-column">
              <div className="trello-character-profile-portrait-wrap trello-character-profile-portrait-wrap--square">
                <CharacterPortraitWithFrame
                  avatarPreset={character.avatarPreset}
                  frameKey={character.equippedPortraitFrameKey}
                  profileBackgroundKey={character.equippedProfileBackgroundKey}
                />
              </div>
              <button type="button" className="trello-btn trello-btn-primary trello-character-edit-trigger" onClick={openEdit}>
                Редактировать
              </button>
            </div>
            <div className="trello-character-profile-info-col">
              <CheckinStreakProfileRow
                streak={character.checkinStreak ?? 0}
                animateFrom={streakAnimateFrom}
                celebrate={streakCelebrate}
                lostNotice={streakLostNotice}
                onDismissLost={() => setStreakLostNotice(null)}
              />
              <div className="trello-character-stat-row">
                <div className="trello-character-stat-pill trello-character-stat-pill--level">
                  <span className="trello-character-stat-label">Уровень</span>
                  <div
                    className="trello-character-stat-meter"
                    role="img"
                    aria-label={`Уровень ${character.level}`}
                  >
                    <div
                      className="trello-character-stat-bar-fill trello-character-stat-bar-fill--level"
                      style={{ width: '100%' }}
                      aria-hidden
                    />
                    <span className="trello-character-stat-meter-value">{character.level}</span>
                  </div>
                </div>
                <div className="trello-character-stat-pill trello-character-stat-pill--xp">
                  <span className="trello-character-stat-label">Опыт</span>
                  <div
                    className="trello-character-stat-meter"
                    role="img"
                    aria-label={
                      xpToward.atMaxLevel
                        ? 'Опыт: максимальный уровень'
                        : `Опыт ${xpToward.into} из ${xpToward.needed}`
                    }
                  >
                    <div
                      className="trello-character-stat-bar-fill trello-character-stat-bar-fill--xp"
                      style={{ width: `${xpToward.pct}%` }}
                      aria-hidden
                    />
                    <span className="trello-character-stat-meter-value trello-character-stat-meter-value--xp">
                      {xpToward.atMaxLevel ? (
                        <>Макс. уровень</>
                      ) : (
                        <>
                          {xpToward.into} / {xpToward.needed}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className="trello-character-stat-pill trello-character-stat-pill--health">
                  <span className="trello-character-stat-label">Здоровье</span>
                  <div
                    className="trello-character-stat-meter"
                    role="img"
                    aria-label={`Здоровье ${character.health}`}
                  >
                    <div
                      className="trello-character-stat-bar-fill trello-character-stat-bar-fill--health"
                      style={{
                        width: `${Math.min(100, Math.round((character.health / CHARACTER_HEALTH_MAX) * 100))}%`,
                      }}
                      aria-hidden
                    />
                    <span className="trello-character-stat-meter-value">{character.health}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="trello-character-guide-toggle"
            onClick={() => setGuideOpen((o) => !o)}
            aria-expanded={guideOpen}
          >
            {guideOpen ? '▼' : '▶'} Как это работает
          </button>
          {guideOpen && <GamificationGuide />}

          <ProfileCharacterQuestsPanel
            accessToken={props.accessToken}
            characterGender={character.gender}
            onCharacterRefresh={async () => {
              const c = await api<CharacterDto>('/character/me', {
                method: 'GET',
                accessToken: props.accessToken,
              });
              setCharacter(c);
              props.onCharacterUpdated?.(c);
            }}
          />
        </section>
      </div>

      {editOpen && (
        <div
          className="trello-modal-backdrop trello-character-edit-modal-backdrop"
          role="presentation"
          onClick={() => !busy && closeEdit()}
        >
          <div
            className="trello-modal trello-character-edit-modal"
            role="dialog"
            aria-modal
            aria-labelledby="character-edit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trello-modal-head">
              <h2 id="character-edit-title" className="trello-modal-title">
                Редактирование персонажа
              </h2>
              <button
                type="button"
                className="trello-modal-close"
                onClick={() => !busy && closeEdit()}
                disabled={busy}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="trello-modal-body trello-character-edit-modal-body">
              {msg && editOpen && (
                <div className="trello-banner trello-banner-error" style={{ marginBottom: 12 }}>
                  {msg}
                </div>
              )}
              <label className="trello-field">
                <span className="trello-label">Имя персонажа</span>
                <input
                  className="trello-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                />
              </label>

              <div className="trello-character-gender-row">
                <span className="trello-label">Пол</span>
                <div className="trello-character-gender-toggle trello-character-gender-toggle--full">
                  <button
                    type="button"
                    className={
                      gender === 'MALE'
                        ? 'trello-btn trello-btn-primary trello-btn-sm'
                        : 'trello-btn trello-btn-ghost trello-btn-sm'
                    }
                    onClick={() => setGender('MALE')}
                  >
                    Мужской
                  </button>
                  <button
                    type="button"
                    className={
                      gender === 'FEMALE'
                        ? 'trello-btn trello-btn-primary trello-btn-sm'
                        : 'trello-btn trello-btn-ghost trello-btn-sm'
                    }
                    onClick={() => setGender('FEMALE')}
                  >
                    Женский
                  </button>
                </div>
              </div>

              <div className="trello-character-avatar-block trello-character-avatar-block--no-label">
                <div className="trello-character-avatar-grid trello-character-avatar-grid--compact">
                  {CHARACTER_ROLES.map((r) => {
                    const p = presetForRole(gender, r);
                    const selected = r === role;
                    return (
                      <button
                        key={r}
                        type="button"
                        className={
                          selected
                            ? 'trello-character-avatar-card trello-character-avatar-card--selected'
                            : 'trello-character-avatar-card'
                        }
                        onClick={() => setRole(r)}
                        aria-pressed={selected}
                      >
                        <img
                          src={characterPortraitUrl(p)}
                          alt=""
                          className="trello-character-avatar-img"
                          loading="lazy"
                        />
                        <span className="trello-character-avatar-label">{ROLE_LABEL_RU[r]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="trello-modal-foot trello-character-edit-modal-foot">
              <button type="button" className="trello-btn trello-btn-ghost" disabled={busy} onClick={closeEdit}>
                Отмена
              </button>
              <button type="button" className="trello-btn trello-btn-primary" disabled={busy} onClick={() => void save()}>
                {busy ? 'Сохранение…' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {saveCheckVisible &&
        createPortal(
          <div className="trello-character-save-check-root" aria-live="polite">
            <div className="trello-character-save-check-mark" aria-hidden>
              ✓
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
