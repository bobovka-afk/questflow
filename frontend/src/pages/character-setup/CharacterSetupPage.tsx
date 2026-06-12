import { CharacterCreateForm } from '@features/character-create/ui/CharacterCreateForm';
import { type CharacterDto } from '@entities/character';
import { api } from '@shared/api/api';
import { navigate } from '@shared/lib/navigation-core';
import { AppLogo } from '@shared/ui/app-logo/AppLogo';

type Props = {
  accessToken: string;
  onCharacterCreated: (c: CharacterDto) => void;
};

export function CharacterSetupPage(props: Props) {
  async function handleCreated(c: CharacterDto) {
    props.onCharacterCreated(c);
    try {
      const workspaces = await api<unknown[]>(
        '/workspace/get-user-workspaces?limit=1&offset=0',
        { method: 'GET', accessToken: props.accessToken },
      );
      navigate(Array.isArray(workspaces) && workspaces.length > 0 ? '/workspaces' : '/personal');
    } catch {
      navigate('/personal');
    }
  }

  return (
    <div className="trello-app-shell">
      <div className="trello-boards-main">
        <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
          <div className="trello-topbar-stripe-left">
            <span className="trello-top-left-brand trello-top-left-brand--stripe trello-top-left-brand--static">
              <AppLogo />
              <span className="trello-top-left-brand-text">Questflow</span>
            </span>
          </div>
          <h1 className="trello-topbar-stripe-center">Создайте своего персонажа</h1>
          <div className="trello-topbar-actions">
          </div>
        </header>

        <CharacterCreateForm
          accessToken={props.accessToken}
          onCreated={handleCreated}
          submitLabel="Создать персонажа и продолжить"
        />
      </div>
    </div>
  );
}
