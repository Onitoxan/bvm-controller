interface ControlButtonProps {
  label: string;
  shiftedLabel?: string;
  group: number;
  mask: number;
  ledState: Record<number, number>;
  isShifted?: boolean;
  disabled?: boolean;
  variant?: "normal" | "power" | "nav" | "numeric";
  icon?: JSX.Element;
  onPress: (group: number, mask: number) => void;
}

export function ControlButton({
  label,
  shiftedLabel,
  group,
  mask,
  ledState,
  isShifted = false,
  disabled = false,
  variant = "normal",
  icon,
  onPress,
}: ControlButtonProps): JSX.Element {
  const ledOn        = Boolean((ledState[group] ?? 0) & mask);
  const displayLabel = isShifted && shiftedLabel ? shiftedLabel : label;

  return (
    <button
      className={[
        "ctrl-btn",
        `ctrl-btn--${variant}`,
        ledOn    ? "ctrl-btn--led-on"   : "",
        disabled ? "ctrl-btn--disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onPress(group, mask);
      }}
      disabled={disabled}
    >
      <div className="ctrl-btn__top">
        {icon && <span className="ctrl-btn__icon">{icon}</span>}
        <span className="ctrl-btn__led" />
      </div>
      <span className="ctrl-btn__label">{displayLabel}</span>
      {shiftedLabel && (
        <span className="ctrl-btn__alt">{isShifted ? label : shiftedLabel}</span>
      )}
    </button>
  );
}
