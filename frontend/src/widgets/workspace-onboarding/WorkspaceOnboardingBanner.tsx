type Props = {
  onCreateBoard: () => void;
};

export function WorkspaceOnboardingBanner({ onCreateBoard }: Props) {
  return (
    <div className="trello-ws-onboarding">
      <h2 className="trello-ws-onboarding-title">Начните с первой доски</h2>
      <ol className="trello-ws-onboarding-steps">
        <li>Создайте доску</li>
        <li>Добавьте колонки</li>
        <li>Создайте карточку и назначьте исполнителя</li>
      </ol>
      <button type="button" className="trello-btn trello-btn-primary" onClick={onCreateBoard}>
        Создать доску
      </button>
    </div>
  );
}
