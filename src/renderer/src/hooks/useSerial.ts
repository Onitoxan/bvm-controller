import { useState, useEffect, useCallback } from "react";

export interface PortInfo {
  path: string;
  manufacturer?: string;
}

export function useSerial() {
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [selectedPort, setSelectedPort] = useState("");
  const [connected, setConnected] = useState(false);
  const [powering, setPowering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ledState, setLedState] = useState<Record<number, number>>({});

  const refreshPorts = useCallback(async () => {
    const list = await window.serial.listPorts();
    setPorts(list);
    setSelectedPort((prev) => prev || list[0]?.path || "");
  }, []);

  useEffect(() => {
    refreshPorts();
    const unsubLed = window.serial.onLedState(setLedState);
    const unsubErr = window.serial.onError((msg) => setError(msg));
    const unsubDisc = window.serial.onDisconnect(() => {
      setConnected(false);
      setLedState({});
    });
    return () => {
      unsubLed();
      unsubErr();
      unsubDisc();
    };
  }, [refreshPorts]);

  const connect = useCallback(async () => {
    if (!selectedPort) return;
    setError(null);
    try {
      await window.serial.connect(selectedPort);
      setConnected(true);
    } catch (err) {
      setError(String(err));
    }
  }, [selectedPort]);

  const disconnect = useCallback(async () => {
    await window.serial.disconnect();
    setConnected(false);
    setLedState({});
  }, []);

  const sendKey = useCallback(
    (group: number, mask: number) => {
      if (connected) window.serial.sendKey(group, mask);
    },
    [connected]
  );

  const sendEncoder = useCallback(
    (id: number, ticks: number) => {
      if (connected) window.serial.sendEncoder(id, ticks);
    },
    [connected]
  );

  const sendPower = useCallback(async () => {
    if (!connected || powering) return;
    setPowering(true);
    try {
      await window.serial.sendPower();
    } finally {
      setPowering(false);
    }
  }, [connected, powering]);

  return {
    ports,
    selectedPort,
    setSelectedPort,
    connected,
    powering,
    error,
    ledState,
    refreshPorts,
    connect,
    disconnect,
    sendKey,
    sendEncoder,
    sendPower
  };
}
