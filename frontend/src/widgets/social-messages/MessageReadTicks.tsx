type Props = {
  read: boolean;
};

export function MessageReadTicks({ read }: Props) {
  return (
    <span
      className={
        read
          ? 'trello-social-msg-ticks trello-social-msg-ticks--read'
          : 'trello-social-msg-ticks'
      }
      title={read ? 'Прочитано' : 'Доставлено'}
      aria-label={read ? 'Прочитано' : 'Доставлено'}
    >
      <span className="trello-social-msg-tick">✓</span>
      {read && <span className="trello-social-msg-tick trello-social-msg-tick--second">✓</span>}
    </span>
  );
}
