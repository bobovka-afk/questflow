import { CharacterCreateForm } from './CharacterCreateForm';
import { type CharacterDto } from './lib/character';
import { navigate } from './lib/navigation';
import { ProfileToolbarAnchor } from './profileToolbarOutlet';

type Props = {
  accessToken: string;
  onCharacterCreated: (c: CharacterDto) => void;
};

export function CharacterSetupPage(props: Props) {
  function handleCreated(c: CharacterDto) {
    props.onCharacterCreated(c);
    navigate('/workspaces');
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

        <CharacterCreateForm
          accessToken={props.accessToken}
          onCreated={handleCreated}
          submitLabel="Создать персонажа и продолжить"
        />
      </div>
    </div>
  );
}
