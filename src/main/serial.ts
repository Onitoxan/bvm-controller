import { ipcMain, BrowserWindow } from "electron";
import { SerialPort } from "serialport";

const BANK_ISW = Buffer.from([0x49, 0x53, 0x57]);
const BANK_IEN = Buffer.from([0x49, 0x45, 0x4e]);
const BANK_ICC = Buffer.from([0x49, 0x43, 0x43]);
const BANK_IMT = Buffer.from([0x49, 0x4d, 0x54]);
const KNOWN_BANKS = new Set(["IEN", "ISW", "ILE", "ICC", "IMT"]);

let port: SerialPort | null = null;
let receiveBuffer = Buffer.alloc(0);
let inLedBank = false;
const ledState: Record<number, number> = {};

const KEY_GAP_MS = 50;
let lastSendAt = 0;

function broadcast(channel: string, ...args: unknown[]): void {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(channel, ...args);
  }
}

function sendBytes(data: Buffer): void {
  if (port?.isOpen) {
    console.log("TX:", data.toString("hex"));
    port.write(data);
  }
}

function buildCommand(bank: Buffer, data: Buffer): Buffer {
  return Buffer.concat([bank, data]);
}

async function sendWithGap(bank: Buffer, data: Buffer): Promise<void> {
  const wait = KEY_GAP_MS - (Date.now() - lastSendAt);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  sendBytes(buildCommand(bank, data));
  lastSendAt = Date.now();
}

function parseIncoming(chunk: Buffer): void {
  receiveBuffer = Buffer.concat([receiveBuffer, chunk]);

  while (receiveBuffer.length >= 3) {
    if (receiveBuffer[0] === 0x49) {
      const tag = receiveBuffer.slice(0, 3).toString("ascii");
      if (KNOWN_BANKS.has(tag)) {
        inLedBank = tag === "ILE";
        receiveBuffer = receiveBuffer.slice(3);
        continue;
      }
    }

    if (receiveBuffer[0] === 0x44) {
      const group = receiveBuffer[1];
      const mask = receiveBuffer[2];
      if (inLedBank) {
        ledState[group] = mask;
        broadcast("serial:led-state", { ...ledState });
      }
      receiveBuffer = receiveBuffer.slice(3);
      continue;
    }

    receiveBuffer = receiveBuffer.slice(1);
  }
}

export function setupSerial(): void {
  ipcMain.handle("serial:list-ports", async () => {
    const list = await SerialPort.list();
    return list.map((p) => ({ path: p.path, manufacturer: p.manufacturer }));
  });

  ipcMain.handle("serial:connect", async (_event, path: string) => {
    if (port?.isOpen) {
      await new Promise<void>((res) => port!.close(() => res()));
    }
    return new Promise<void>((resolve, reject) => {
      port = new SerialPort(
        { path, baudRate: 38400, dataBits: 8, stopBits: 1, parity: "none" },
        (err) => {
          if (err) return reject(err.message);
          receiveBuffer = Buffer.alloc(0);
          inLedBank = false;
          resolve();
          setTimeout(() => {
            sendBytes(
              Buffer.concat([
                BANK_ISW,
                BANK_ICC,
                BANK_IMT,
                Buffer.from([0x44, 0x33, 0x31])
              ])
            );
          }, 300);
        }
      );
      port.on("data", (chunk: Buffer) => {
        console.log("RX:", chunk.toString("hex"));
        parseIncoming(chunk);
      });
      port.on("error", (err) => broadcast("serial:error", err.message));
      port.on("close", () => {
        broadcast("serial:disconnected");
        port = null;
      });
    });
  });

  ipcMain.handle("serial:disconnect", async () => {
    if (port?.isOpen) {
      await new Promise<void>((res) => port!.close(() => res()));
    }
    port = null;
  });

  ipcMain.on("serial:send-key", (_event, group: number, mask: number) => {
    sendWithGap(BANK_ISW, Buffer.from([0x44, group, mask]));
  });

  ipcMain.on("serial:send-encoder", (_event, id: number, ticks: number) => {
    const t = Math.max(-128, Math.min(127, Math.round(ticks)));
    sendWithGap(BANK_IEN, Buffer.from([0x44, id, t < 0 ? t + 256 : t]));
  });

  ipcMain.handle("serial:send-power", async () => {
    sendBytes(buildCommand(BANK_ISW, Buffer.from([0x44, 0x01, 0x10])));
    await new Promise((r) => setTimeout(r, 1000));
    sendBytes(
      Buffer.concat([BANK_ICC, BANK_IMT, Buffer.from([0x44, 0x33, 0x31])])
    );
  });
}
