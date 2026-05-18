import {
  ShiftIcon, OverScanIcon, HSyncIcon, VSyncIcon,
  MonoIcon, AptIcon, CombIcon, SafeAreaIcon,
} from "../components/ButtonIcons";

// Keyed by "group-mask" to match how buttons are identified in the UI
export const BUTTON_ICONS: Record<string, JSX.Element> = {
  "3-1":  <ShiftIcon />,
  "3-2":  <OverScanIcon />,
  "3-4":  <HSyncIcon />,
  "3-8":  <VSyncIcon />,
  "3-16": <MonoIcon />,
  "4-1":  <AptIcon />,
  "4-2":  <CombIcon />,
  "4-16": <SafeAreaIcon />,
};

export interface ButtonDef {
  label: string;
  shiftedLabel?: string;
  group: number;
  mask: number;
}

export interface EncoderDef {
  label: string;
  id: number;
  manualGroup: number;
  manualMask: number;
}

export const ENCODERS: EncoderDef[] = [
  { label: "CONTRAST", id: 0x00, manualGroup: 0x02, manualMask: 0x01 },
  { label: "BRIGHT",   id: 0x01, manualGroup: 0x02, manualMask: 0x02 },
  { label: "CHROMA",   id: 0x02, manualGroup: 0x02, manualMask: 0x04 },
  { label: "PHASE",    id: 0x03, manualGroup: 0x02, manualMask: 0x08 },
];

export const FUNCTION_BUTTONS: ButtonDef[] = [
  { label: "SHIFT",        group: 0x03, mask: 0x01 },
  { label: "OVERSCAN",     shiftedLabel: "16:9",      group: 0x03, mask: 0x02 },
  { label: "H.SYNC VIEW",  shiftedLabel: "SYNC",      group: 0x03, mask: 0x04 },
  { label: "V.SYNC VIEW",  shiftedLabel: "BLUE ONLY", group: 0x03, mask: 0x08 },
  { label: "MONO",         shiftedLabel: "R",         group: 0x03, mask: 0x10 },
  { label: "APT",          shiftedLabel: "G",         group: 0x04, mask: 0x01 },
  { label: "COMB",         shiftedLabel: "B",         group: 0x04, mask: 0x02 },
  { label: "F1",           shiftedLabel: "F3",        group: 0x04, mask: 0x04 },
  { label: "F2",           shiftedLabel: "F4",        group: 0x04, mask: 0x08 },
  { label: "SAFE AREA",    shiftedLabel: "ADDRESS",   group: 0x04, mask: 0x10 },
];

export const NAV_BUTTONS: ButtonDef[] = [
  { label: "UP",    group: 0x02, mask: 0x40 },
  { label: "MENU",  group: 0x02, mask: 0x10 },
  { label: "ENTER", group: 0x02, mask: 0x20 },
  { label: "DOWN",  group: 0x02, mask: 0x80 },
];

// Ordered for 3-column grid layout: 1-9, 0, DEL, ENT
export const NUMERIC_BUTTONS: ButtonDef[] = [
  { label: "1",   group: 0x00, mask: 0x02 },
  { label: "2",   group: 0x00, mask: 0x04 },
  { label: "3",   group: 0x00, mask: 0x08 },
  { label: "4",   group: 0x00, mask: 0x10 },
  { label: "5",   group: 0x00, mask: 0x20 },
  { label: "6",   group: 0x00, mask: 0x40 },
  { label: "7",   group: 0x00, mask: 0x80 },
  { label: "8",   group: 0x01, mask: 0x01 },
  { label: "9",   group: 0x01, mask: 0x02 },
  { label: "0",   group: 0x00, mask: 0x01 },
  { label: "DEL", group: 0x01, mask: 0x04 },
  { label: "ENT", group: 0x01, mask: 0x08 },
];

export const POWER_BUTTON: ButtonDef   = { label: "POWER",   group: 0x01, mask: 0x10 };
export const DEGAUSS_BUTTON: ButtonDef = { label: "DEGAUSS", group: 0x01, mask: 0x20 };

export const SHIFT_GROUP = 0x03;
export const SHIFT_MASK  = 0x01;

export function isLedOn(
  ledState: Record<number, number>,
  group: number,
  mask: number,
): boolean {
  return Boolean((ledState[group] ?? 0) & mask);
}
