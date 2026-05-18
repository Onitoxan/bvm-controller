import { ConnectorDiagram } from "./ConnectorDiagram";

interface InfoModalProps {
  onClose: () => void;
}

export function InfoModal({ onClose }: InfoModalProps): JSX.Element {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <span className="modal__title">Setup &amp; FAQ</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">

          <section className="modal__section">
            <h2>Hardware Setup</h2>
            <ol>
              <li><strong>Warning:</strong> Do not connect pin 5 (+5V). Always plug/unplug with the BVM powered off. Otherwise you risk damaging the G board.</li>
              <li>Connect a USB → RS-422 adapter to your computer.</li>
              <li>Wire the adapter to the BVM's RS-422 DB9 port using 5 wires: <strong>TX+, TX−, RX+, RX−, GND</strong>.</li>
              <li>Select the correct port in the dropdown and click <strong>Connect</strong>.</li>
            </ol>
          </section>

          <section className="modal__section">
            <h2>DB9 Pinout</h2>
            <ConnectorDiagram />
            <a
              className="modal__ref-link"
              href="https://ia801707.us.archive.org/9/items/SonyBVM14EBVM14FBVM20EBVM20F20F1U14F5UOperationAndMaintenanceManual/Sony%20BVM-14E%20BVM-14F%20BVM-20E%20BVM-20F%2020F1U%2014F5U%20Operation%20and%20Maintenance%20Manual.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Official Sony BVM service manual (Internet Archive)
            </a>
          </section>

          <section className="modal__section">
            <h2>FAQ</h2>
            <dl>
              <dt>Buttons are not responding</dt>
              <dd>Check the DB9 connector pins for oxidation and reseat the connector. Make sure the adapter is in RS-422 full-duplex (4-wire) mode, not RS-485 half-duplex.</dd>

              <dt>Port not showing in the list</dt>
              <dd>Click the refresh button next to the port selector. Make sure the adapter driver is installed and the device appears in your system's device list.</dd>

              <dt>Connected but no LED feedback</dt>
              <dd>The BVM streams LED state only for groups 2–4. The power LED (group 1) is not included in the stream.</dd>

              <dt>Is it safe to use?</dt>
              <dd>
                The app sends the same RS-422 commands as the physical BKM-10R controller. Normal button presses and encoder adjustments carry no risk to the monitor. Of course you could mess up the configuration and corrupt image but nothing you couldn't do with a BKM-10R.<br /><br />
                <strong>What's fine:</strong>
                <ul>
                  <li>Sending any button or encoder command while connected</li>
                  <li>Connecting and disconnecting the USB adapter on your computer at any time</li>
                  <li>Running the app without a monitor connected</li>
                </ul>
                <br />
                <strong>What can cause damage:</strong>
                <ul>
                  <li><strong>Hot-plugging the DB9 connector.</strong> Always power off the monitor before plugging or unplugging the DB9. This is the most common cause of hardware damage</li>
                  <li><strong>Connecting pin 5 (+5V).</strong> Leave it unconnected. Wiring it to the adapter can damage both the adapter and the monitor</li>
                  <li><strong>Shorted or reversed wires on the DB9.</strong> Double-check your wiring against the pinout diagram before first use</li>
                </ul>
              </dd>
            </dl>
          </section>

        </div>
      </div>
    </div>
  );
}
