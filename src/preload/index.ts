import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const serialAPI = {
  listPorts: () => ipcRenderer.invoke("serial:list-ports"),
  connect: (path: string) => ipcRenderer.invoke("serial:connect", path),
  disconnect: () => ipcRenderer.invoke("serial:disconnect"),
  sendKey: (group: number, mask: number) => ipcRenderer.send("serial:send-key", group, mask),
  sendEncoder: (id: number, ticks: number) => ipcRenderer.send("serial:send-encoder", id, ticks),
  sendPower: () => ipcRenderer.invoke("serial:send-power"),
  onLedState: (cb: (state: Record<number, number>) => void) => {
    const listener = (_: unknown, state: Record<number, number>) => cb(state);
    ipcRenderer.on("serial:led-state", listener);
    return () => ipcRenderer.removeListener("serial:led-state", listener);
  },
  onError: (cb: (msg: string) => void) => {
    const listener = (_: unknown, msg: string) => cb(msg);
    ipcRenderer.on("serial:error", listener);
    return () => ipcRenderer.removeListener("serial:error", listener);
  },
  onDisconnect: (cb: () => void) => {
    ipcRenderer.on("serial:disconnected", cb);
    return () => ipcRenderer.removeListener("serial:disconnected", cb);
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("serial", serialAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore
  window.electron = electronAPI;
  // @ts-ignore
  window.serial = serialAPI;
}
