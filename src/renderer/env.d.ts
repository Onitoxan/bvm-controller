/// <reference types="vite/client" />

interface PortInfo {
  path: string;
  manufacturer?: string;
}

interface SerialAPI {
  listPorts: () => Promise<PortInfo[]>;
  connect: (path: string) => Promise<void>;
  disconnect: () => Promise<void>;
  sendKey: (group: number, mask: number) => void;
  sendEncoder: (id: number, ticks: number) => void;
  sendPower: () => Promise<void>;
  onLedState: (cb: (state: Record<number, number>) => void) => () => void;
  onError: (cb: (msg: string) => void) => () => void;
  onDisconnect: (cb: () => void) => () => void;
}

declare interface Window {
  serial: SerialAPI;
}
