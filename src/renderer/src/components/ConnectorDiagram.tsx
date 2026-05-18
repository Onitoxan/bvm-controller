// Colors for each signal type
const C = {
  txPlus:       "#f0a000",
  txMinus:      "#b07800",
  rxPlus:       "#4090d0",
  rxMinus:      "#2868a0",
  gnd:          "#3a8040",
  unused:       "#454558",
  shell:        "#252930",
  shellStroke:  "#3a4050",
  shellLight:   "#2c303a",
  shellDark:    "#1a1d24",
  pinVoid:      "#10121a",
  text:         "#cdd0dc",
  textDim:      "#7a8090",
};

interface PinDef {
  bvmLabel:     string;
  adapterLabel: string;
  color:        string;
}

const PINS: Record<number, PinDef> = {
  1: { bvmLabel: "GND",   adapterLabel: "GND", color: C.gnd     },
  2: { bvmLabel: "−TXD",  adapterLabel: "TX−", color: C.txMinus },
  3: { bvmLabel: "+RXD",  adapterLabel: "RX+", color: C.rxPlus  },
  4: { bvmLabel: "GND",   adapterLabel: "GND", color: C.gnd     },
  5: { bvmLabel: "+5V",   adapterLabel: "n/c", color: C.unused  },
  6: { bvmLabel: "GND",   adapterLabel: "GND", color: C.gnd     },
  7: { bvmLabel: "+TXD",  adapterLabel: "TX+", color: C.txPlus  },
  8: { bvmLabel: "−RXD",  adapterLabel: "RX−", color: C.rxMinus },
  9: { bvmLabel: "GND",   adapterLabel: "GND", color: C.gnd     },
};

// Layout constants shared by both front views
const W = 300, H = 162;
const SX = 20, SY = 28, SW = 260, SH = 96;  // shell rect
const CX = SX + SW / 2;                       // 150
const R1Y = SY + 32;                           // top row y   = 60
const R2Y = SY + 68;                           // bottom row y = 96
const SP = 44;                                  // pin spacing
const PR = 9;                                   // pin radius

// x positions for 5-pin top row and 4-pin bottom row (same for both views)
const TX = [CX - 2*SP, CX - SP, CX, CX + SP, CX + 2*SP]; // [62,106,150,194,238]
const BX = [CX - 1.5*SP, CX - .5*SP, CX + .5*SP, CX + 1.5*SP]; // [84,128,172,216]

// Female top row: 5,4,3,2,1 (left→right); bottom row: 9,8,7,6
const F_TOP = [5, 4, 3, 2, 1];
const F_BOT = [9, 8, 7, 6];

// Male top row: 1,2,3,4,5 (left→right, mirrored); bottom row: 6,7,8,9
const M_TOP = [1, 2, 3, 4, 5];
const M_BOT = [6, 7, 8, 9];

// Key pins to show labels for (not GND/unused)
const KEY_PINS = new Set([2, 3, 7, 8]);

interface FaceProps {
  pinOrder: { top: number[]; bot: number[] };
  labelKey: keyof PinDef;
  socket: boolean;
}

function ConnectorFace({ pinOrder, labelKey, socket }: FaceProps): JSX.Element {
  const labelY = SY + SH + 13;
  return (
    <>
      <rect x={SX} y={SY} width={SW} height={SH} rx={4}
        fill={C.shell} stroke={C.shellStroke} strokeWidth={1.5} />
      <circle cx={SX + 10} cy={SY + SH / 2} r={7} fill={C.shellDark} stroke={C.shellStroke} strokeWidth={1} />
      <circle cx={SX + SW - 10} cy={SY + SH / 2} r={7} fill={C.shellDark} stroke={C.shellStroke} strokeWidth={1} />

      {pinOrder.top.map((pin, i) => {
        const p = PINS[pin];
        const x = TX[i];
        return (
          <g key={pin}>
            {socket ? (
              <>
                <circle cx={x} cy={R1Y} r={PR} fill={p.color} opacity={0.25} />
                <circle cx={x} cy={R1Y} r={PR} fill="none" stroke={p.color} strokeWidth={1.5} />
                <circle cx={x} cy={R1Y} r={PR - 4} fill={C.pinVoid} />
              </>
            ) : (
              <circle cx={x} cy={R1Y} r={PR} fill={p.color} />
            )}
            <text x={x} y={R1Y} textAnchor="middle" dominantBaseline="central"
              fontSize={6.5} fontWeight="700" fill={socket ? C.text : C.pinVoid}>
              {pin}
            </text>
            {KEY_PINS.has(pin) && (
              <text x={x} y={labelY} textAnchor="middle"
                fontSize={6} fontWeight="700" fill={p.color}>
                {p[labelKey] as string}
              </text>
            )}
          </g>
        );
      })}

      {pinOrder.bot.map((pin, i) => {
        const p = PINS[pin];
        const x = BX[i];
        return (
          <g key={pin}>
            {socket ? (
              <>
                <circle cx={x} cy={R2Y} r={PR} fill={p.color} opacity={0.25} />
                <circle cx={x} cy={R2Y} r={PR} fill="none" stroke={p.color} strokeWidth={1.5} />
                <circle cx={x} cy={R2Y} r={PR - 4} fill={C.pinVoid} />
              </>
            ) : (
              <circle cx={x} cy={R2Y} r={PR} fill={p.color} />
            )}
            <text x={x} y={R2Y} textAnchor="middle" dominantBaseline="central"
              fontSize={6.5} fontWeight="700" fill={socket ? C.text : C.pinVoid}>
              {pin}
            </text>
            {KEY_PINS.has(pin) && (
              <text x={x} y={labelY} textAnchor="middle"
                fontSize={6} fontWeight="700" fill={p.color}>
                {p[labelKey] as string}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}

function FemaleView(): JSX.Element {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <text x={CX} y={18} textAnchor="middle" fontSize={9} fontWeight="700"
        letterSpacing={1.5} fill={C.textDim} textTransform="uppercase">
        BVM PORT (FEMALE, looking in)
      </text>
      <ConnectorFace
        pinOrder={{ top: F_TOP, bot: F_BOT }}
        labelKey="bvmLabel"
        socket={true}
      />
    </svg>
  );
}

function MaleView(): JSX.Element {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <text x={CX} y={18} textAnchor="middle" fontSize={9} fontWeight="700"
        letterSpacing={1.5} fill={C.textDim} textTransform="uppercase">
        CABLE CONNECTOR (MALE, looking at pins)
      </text>
      <ConnectorFace
        pinOrder={{ top: M_TOP, bot: M_BOT }}
        labelKey="adapterLabel"
        socket={false}
      />
    </svg>
  );
}

function IsometricView(): JSX.Element {
  // 3D box: front face + top face + right face
  // Front face: (44, 50) → (224, 150)  — 180×100
  // Depth offset: +36px right, −22px up
  const FX = 44, FY = 50, FW = 180, FH = 100;
  const DX = 36, DY = -22; // depth offset vector

  // Face corners
  const fl = { x: FX, y: FY };         // front top-left
  const fr = { x: FX+FW, y: FY };      // front top-right
  const br = { x: FX+FW, y: FY+FH };   // front bottom-right
  const bl = { x: FX, y: FY+FH };      // front bottom-left

  const pts = (arr: {x:number;y:number}[]) => arr.map(p=>`${p.x},${p.y}`).join(" ");

  // Isometric pin positions on front face
  // Scaled: same logical layout, but scaled to front face
  const iCX = FX + FW / 2;  // 134
  const iR1Y = FY + 32;      // 82
  const iR2Y = FY + 68;      // 118
  const iSP = 30;
  const iPR = 7;

  const iTX = [iCX-2*iSP, iCX-iSP, iCX, iCX+iSP, iCX+2*iSP]; // top row x
  const iBX = [iCX-1.5*iSP, iCX-.5*iSP, iCX+.5*iSP, iCX+1.5*iSP]; // bottom row x

  return (
    <svg width={320} height={200} viewBox="0 0 320 200">
      <text x={160} y={18} textAnchor="middle" fontSize={9} fontWeight="700"
        letterSpacing={1.5} fill={C.textDim}>
        ISOMETRIC VIEW — MALE CONNECTOR
      </text>

      {/* Right face (shadow) */}
      <polygon
        points={pts([fr, {x:fr.x+DX,y:fr.y+DY}, {x:br.x+DX,y:br.y+DY}, br])}
        fill={C.shellDark} stroke={C.shellStroke} strokeWidth={1} />

      {/* Top face (highlight) */}
      <polygon
        points={pts([fl, fr, {x:fr.x+DX,y:fr.y+DY}, {x:fl.x+DX,y:fl.y+DY}])}
        fill={C.shellLight} stroke={C.shellStroke} strokeWidth={1} />

      {/* Front face */}
      <rect x={FX} y={FY} width={FW} height={FH}
        fill={C.shell} stroke={C.shellStroke} strokeWidth={1.5} rx={3} />

      {/* Screw posts on front face */}
      <circle cx={FX+9} cy={FY+FH/2} r={6} fill={C.shellDark} stroke={C.shellStroke} strokeWidth={1} />
      <circle cx={FX+FW-9} cy={FY+FH/2} r={6} fill={C.shellDark} stroke={C.shellStroke} strokeWidth={1} />

      {/* Male pins: top row 1,2,3,4,5 */}
      {M_TOP.map((pin, i) => {
        const p = PINS[pin];
        const x = iTX[i];
        return (
          <g key={pin}>
            {/* Pin depth cylinder on right face */}
            <line x1={x} y1={iR1Y} x2={x+DX*0.4} y2={iR1Y+DY*0.4}
              stroke={p.color} strokeWidth={iPR * 2} strokeOpacity={0.3} />
            <circle cx={x} cy={iR1Y} r={iPR} fill={p.color} />
            <text x={x} y={iR1Y + 3} textAnchor="middle"
              fontSize={6} fontWeight="700" fill={C.pinVoid}>{pin}</text>
          </g>
        );
      })}

      {/* Male pins: bottom row 6,7,8,9 */}
      {M_BOT.map((pin, i) => {
        const p = PINS[pin];
        const x = iBX[i];
        return (
          <g key={pin}>
            <line x1={x} y1={iR2Y} x2={x+DX*0.4} y2={iR2Y+DY*0.4}
              stroke={p.color} strokeWidth={iPR * 2} strokeOpacity={0.3} />
            <circle cx={x} cy={iR2Y} r={iPR} fill={p.color} />
            <text x={x} y={iR2Y + 3} textAnchor="middle"
              fontSize={6} fontWeight="700" fill={C.pinVoid}>{pin}</text>
          </g>
        );
      })}

      {/* Labels for key pins only (projected to right of face) */}
      {([3, 2] as const).map((pin) => {
        const p = PINS[pin];
        const i = M_TOP.indexOf(pin);
        const x = iTX[i];
        return (
          <text key={pin} x={x + DX + 6} y={iR1Y + DY + 4}
            fontSize={7} fontWeight="700" fill={p.color}>{p.adapterLabel}</text>
        );
      })}
      {([7, 8] as const).map((pin) => {
        const p = PINS[pin];
        const i = M_BOT.indexOf(pin);
        const x = iBX[i];
        return (
          <text key={pin} x={x + DX + 6} y={iR2Y + DY + 4}
            fontSize={7} fontWeight="700" fill={p.color}>{p.adapterLabel}</text>
        );
      })}
    </svg>
  );
}

function Legend(): JSX.Element {
  const items = [
    { color: C.rxPlus,  label: "RX+  →  pin 3 (+RXD)" },
    { color: C.rxMinus, label: "RX−  →  pin 8 (−RXD)" },
    { color: C.txPlus,  label: "TX+  →  pin 7 (+TXD)" },
    { color: C.txMinus, label: "TX−  →  pin 2 (−TXD)" },
    { color: C.gnd,     label: "GND: pins 1, 4, 6, 9" },
    { color: C.unused,  label: "+5V: pin 5 (do not connect)" },
  ];
  return (
    <div className="connector-legend">
      {items.map(({ color, label }) => (
        <div key={label} className="connector-legend__item">
          <span className="connector-legend__dot" style={{ background: color }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function ConnectorDiagram(): JSX.Element {
  return (
    <div className="connector-diagram">
      <FemaleView />
      <MaleView />
      <Legend />
    </div>
  );
}
