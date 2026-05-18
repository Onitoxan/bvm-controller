const S = 14; // icon canvas size
const c = S / 2;

function Icon({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <svg
      width={S}
      height={S}
      viewBox={`0 0 ${S} ${S}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="btn-icon"
    >
      {children}
    </svg>
  );
}

// OVERSCAN — outer frame with inner frame
export function OverScanIcon(): JSX.Element {
  return (
    <Icon>
      <rect x="1" y="2" width="12" height="10" rx="0.5" />
      <rect x="3.5" y="4" width="7" height="6" rx="0.5" />
    </Icon>
  );
}

// H.SYNC VIEW — screen split into vertical columns
export function HSyncIcon(): JSX.Element {
  return (
    <Icon>
      <rect x="1" y="2" width="12" height="10" rx="0.5" />
      <line x1="5" y1="2" x2="5" y2="12" />
      <line x1="9" y1="2" x2="9" y2="12" />
    </Icon>
  );
}

// V.SYNC VIEW / BLUE ONLY — screen split into horizontal rows
export function VSyncIcon(): JSX.Element {
  return (
    <Icon>
      <rect x="1" y="2" width="12" height="10" rx="0.5" />
      <line x1="1" y1="5.5" x2="13" y2="5.5" />
      <line x1="1" y1="8.5" x2="13" y2="8.5" />
    </Icon>
  );
}

// MONO — single solid screen fill
export function MonoIcon(): JSX.Element {
  return (
    <Icon>
      <rect x="1" y="2" width="12" height="10" rx="0.5" />
      <rect
        x="3"
        y="4"
        width="8"
        height="6"
        rx="0.5"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  );
}

// APT — screen with small corner marker (aperture correction)
export function AptIcon(): JSX.Element {
  return (
    <Icon>
      <rect x="1" y="2" width="12" height="10" rx="0.5" />
      <polyline points="1,5 4,2" />
      <polyline points="10,2 13,5" />
      <polyline points="1,9 4,12" />
      <polyline points="10,12 13,9" />
    </Icon>
  );
}

// COMB — interleaved horizontal lines (comb filter)
export function CombIcon(): JSX.Element {
  return (
    <Icon>
      <rect x="1" y="2" width="12" height="10" rx="0.5" />
      <line x1="3" y1="5" x2="11" y2="5" />
      <line x1="3" y1="7" x2="11" y2="7" />
      <line x1="3" y1="9" x2="11" y2="9" />
    </Icon>
  );
}

// SAFE AREA — nested inset rectangle
export function SafeAreaIcon(): JSX.Element {
  return (
    <Icon>
      <rect x="1" y="2" width="12" height="10" rx="0.5" />
      <rect
        x="3"
        y="3.8"
        width="8"
        height="6.4"
        rx="0.3"
        strokeDasharray="1.5 1"
      />
    </Icon>
  );
}

// SHIFT — up arrow
export function ShiftIcon(): JSX.Element {
  return (
    <Icon>
      <polyline
        points={`${c},2 ${S - 2},8 ${S - 4},8 ${S - 4},${S - 2} ${4},${S - 2} ${4},8 2,8`}
      />
    </Icon>
  );
}
