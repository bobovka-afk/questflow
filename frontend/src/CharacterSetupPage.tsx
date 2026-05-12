import { useMemo, useState } from 'react';
import { api, formatApiError } from './lib/api';
import {
  CHARACTER_ROLES,
  type CharacterDto,
  type CharacterRole,
  type GenderCharacter,
  characterPortraitUrl,
  presetForRole,
  ROLE_LABEL_RU,
} from './lib/character';
import { navigate } from './lib/navigation';
import { ProfileToolbarAnchor } from './profileToolbarOutlet';

type Props = {
  accessToken: string;
  onCharacterCreated: (c: CharacterDto) => void;
};

export function CharacterSetupPage(props: Props) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<GenderCharacter>('MALE');
  const [role, setRole] = useState<CharacterRole>('DRUID');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const avatarPreset = useMemo(() => presetForRole(gender, role), [gender, role]);

  async function submit() {
    setMsg(null);
    const trimmed = name.trim();
    if (trimmed.length < 3 || trimmed.length > 40) {
      setMsg('Имя персонажа: от 3 до 40 символов.');
      return;
    }
    setBusy(true);
    try {
      const created = await api<CharacterDto>('/character', {
        method: 'POST',
        accessToken: props.accessToken,
        json: {
          name: trimmed,
          gender,
          avatarPreset,
        },
      });
      props.onCharacterCreated(created);
      navigate('/workspaces');
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="trello-app-shell">
      <div className="trello-boards-main">
        <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
          <div className="trello-topbar-stripe-left">
            <span className="trello-top-left-brand trello-top-left-brand--stripe trello-top-left-brand--static">
              <span className="trello-logo" aria-hidden />
              <span className="trello-top-left-brand-text">Questflow</span>
            </span>
          </div>
          <h1 className="trello-topbar-stripe-center">Создайте своего персонажа</h1>
          <div className="trello-topbar-actions">
            <ProfileToolbarAnchor />
          </div>
        </header>

        {msg && <div className="trello-banner trello-banner-error">{msg}</div>}

        <section className="trello-character-setup">
          <label className="trello-field">
            <span className="trello-label">Имя персонажа</span>
            <input
              className="trello-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              autoComplete="off"
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
            <div className="trello-character-avatar-grid">
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

          <button
            type="button"
            className="trello-btn trello-btn-primary trello-character-submit-full"
            disabled={busy}
            onClick={() => void submit()}
          >
            {busy ? 'Создаём…' : 'Создать персонажа и продолжить'}
          </button>
        </section>
      </div>
    </div>
  );
}
