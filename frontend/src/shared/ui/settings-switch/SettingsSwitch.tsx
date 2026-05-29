type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function SettingsSwitch(props: Props) {
  const id = props.label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="trello-settings-switch-row">
      <div className="trello-settings-switch-copy">
        <span className="trello-settings-switch-label" id={`${id}-label`}>
          {props.label}
        </span>
        {props.description ? (
          <span className="trello-settings-switch-desc">{props.description}</span>
        ) : null}
      </div>
      <label className="theme-switch trello-settings-switch" aria-labelledby={`${id}-label`}>
        <input
          className="theme-switch-input"
          type="checkbox"
          checked={props.checked}
          disabled={props.disabled}
          onChange={(e) => props.onChange(e.target.checked)}
        />
        <span className="theme-switch-track" aria-hidden>
          <span className="theme-switch-thumb" />
        </span>
      </label>
    </div>
  );
}
