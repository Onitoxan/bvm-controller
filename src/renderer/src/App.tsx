import { useSerial } from "./hooks/useSerial";
import { Knob } from "./components/Knob";
import { ControlButton } from "./components/ControlButton";
import {
  ENCODERS,
  FUNCTION_BUTTONS,
  NAV_BUTTONS,
  NUMERIC_BUTTONS,
  POWER_BUTTON,
  DEGAUSS_BUTTON,
  SHIFT_GROUP,
  SHIFT_MASK,
  isLedOn,
  BUTTON_ICONS,
} from "./protocol/bkm10r";



function RefreshIcon(): JSX.Element {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M10.5 6A4.5 4.5 0 1 1 6 1.5V0L8.5 2.5 6 5V3.5a3 3 0 1 0 3 2.5h1.5z" />
    </svg>
  );
}

export default function App(): JSX.Element {
  const {
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
    sendPower,
  } = useSerial();

  const isShifted = isLedOn(ledState, SHIFT_GROUP, SHIFT_MASK);

  return (
    <div className="bvm">
      {/* ── Header ── */}
      <header className="bvm__header">
        <span className="bvm__title">BVM Controller</span>
        <div className="bvm__conn">
          <select
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            disabled={connected}
          >
            {ports.length === 0 && <option value="">No ports found</option>}
            {ports.map((p) => (
              <option key={p.path} value={p.path}>
                {p.path}
                {p.manufacturer ? ` — ${p.manufacturer}` : ""}
              </option>
            ))}
          </select>
          <button
            className="icon-btn"
            onClick={refreshPorts}
            disabled={connected}
            title="Refresh ports"
          >
            <RefreshIcon />
          </button>
          <button
            className={`conn-btn conn-btn--${connected ? "disconnect" : "connect"}`}
            onClick={connected ? disconnect : connect}
            disabled={!selectedPort}
          >
            {connected ? "Disconnect" : "Connect"}
          </button>
          <span className={`status-dot status-dot--${connected ? "on" : "off"}`} />
        </div>
        {error && <div className="error-bar">{error}</div>}
      </header>

      {/* ── Panel ── */}
      <main className="bvm__panel">

        {/* Power / Degauss row */}
        <section className="section section--top">
          <ControlButton
            {...POWER_BUTTON}
            ledState={ledState}
            disabled={!connected || powering}
            variant="power"
            onPress={() => sendPower()}
          />
          <ControlButton
            {...DEGAUSS_BUTTON}
            ledState={ledState}
            disabled={!connected}
            variant="normal"
            onPress={sendKey}
          />
          {powering && <span className="powering-msg">Powering…</span>}
        </section>

        {/* Encoders */}
        <section className="section section--encoders">
          {ENCODERS.map((enc) => (
            <div key={enc.id} className="encoder-col">
              <Knob
                label={enc.label}
                encoderId={enc.id}
                disabled={!connected}
                onTick={sendEncoder}
              />
              <ControlButton
                label="MANUAL"
                group={enc.manualGroup}
                mask={enc.manualMask}
                ledState={ledState}
                disabled={!connected}
                onPress={sendKey}
              />
            </div>
          ))}
        </section>

        {/* Function buttons — two rows of 5 */}
        <section className="section section--function">
          {FUNCTION_BUTTONS.map((btn) => (
            <ControlButton
              key={`${btn.group}-${btn.mask}`}
              {...btn}
              icon={BUTTON_ICONS[`${btn.group}-${btn.mask}`]}
              ledState={ledState}
              isShifted={isShifted}
              disabled={!connected}
              onPress={sendKey}
            />
          ))}
        </section>

        {/* Navigation + Numeric */}
        <section className="section section--bottom">
          {/* D-pad */}
          <div className="nav-pad">
            <div className="nav-row nav-row--top">
              <ControlButton {...NAV_BUTTONS[0]} ledState={ledState} disabled={!connected} variant="nav" onPress={sendKey} />
            </div>
            <div className="nav-row nav-row--mid">
              <ControlButton {...NAV_BUTTONS[1]} ledState={ledState} disabled={!connected} variant="nav" onPress={sendKey} />
              <ControlButton {...NAV_BUTTONS[2]} ledState={ledState} disabled={!connected} variant="nav" onPress={sendKey} />
            </div>
            <div className="nav-row nav-row--bot">
              <ControlButton {...NAV_BUTTONS[3]} ledState={ledState} disabled={!connected} variant="nav" onPress={sendKey} />
            </div>
          </div>

          {/* Numpad */}
          <div className="numpad">
            {NUMERIC_BUTTONS.map((btn) => (
              <ControlButton
                key={`${btn.group}-${btn.mask}`}
                {...btn}
                ledState={ledState}
                disabled={!connected}
                variant="numeric"
                onPress={sendKey}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
