import type { ReactNode } from "react";

const STAR = "M0 -14 Q0 0 14 0 Q0 0 0 14 Q0 0 -14 0 Q0 0 0 -14Z";

function Sparkle({ x, y, s = 1, d = 0 }: { x: number; y: number; s?: number; d?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={STAR} className="a-twinkle fill-accent" style={{ animationDelay: `${d}s` }} />
    </g>
  );
}

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={label} className="h-full w-full overflow-visible">
      {children}
    </svg>
  );
}

function Dental() {
  return (
    <Frame label="Smiling cartoon tooth with sparkles and a toothbrush">
      <circle cx="200" cy="205" r="168" className="fill-primary/10" />
      <circle cx="200" cy="205" r="190" className="fill-none stroke-primary/25" strokeWidth="2" strokeDasharray="4 10" />
      {[
        [90, 330, 0], [135, 350, 1.6], [300, 345, 3], [330, 320, 4.4], [250, 360, 2.2],
      ].map(([x, y, d], i) => (
        <circle key={i} cx={x} cy={y} r={6 + (i % 3) * 3} className="a-bubble fill-white stroke-primary/40" strokeWidth="2" style={{ animationDelay: `${d}s` }} />
      ))}
      <g className="a-float">
        <ellipse cx="200" cy="352" rx="70" ry="9" className="fill-secondary/10" />
        <path
          d="M200 98 C165 76 118 92 118 144 C118 190 140 204 148 254 C154 294 160 330 178 330 C196 330 192 278 200 278 C208 278 204 330 222 330 C240 330 246 294 252 254 C260 204 282 190 282 144 C282 92 235 76 200 98 Z"
          className="fill-white stroke-secondary" strokeWidth="7" strokeLinejoin="round"
        />
        <path d="M146 120 C150 106 164 100 176 104" className="fill-none stroke-primary/40" strokeWidth="7" strokeLinecap="round" />
        <g className="a-blink">
          <ellipse cx="172" cy="158" rx="9" ry="12" className="fill-secondary" />
          <ellipse cx="228" cy="158" rx="9" ry="12" className="fill-secondary" />
          <circle cx="175" cy="153" r="3.2" className="fill-white" />
          <circle cx="231" cy="153" r="3.2" className="fill-white" />
        </g>
        <path d="M176 192 Q200 220 224 192" className="fill-none stroke-secondary" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="148" cy="188" rx="13" ry="8" className="fill-accent/50" />
        <ellipse cx="252" cy="188" rx="13" ry="8" className="fill-accent/50" />
      </g>
      <g className="a-float-r" style={{ "--r": "28deg" } as React.CSSProperties}>
        <g transform="translate(318 250) rotate(28)">
          <rect x="-9" y="-70" width="18" height="140" rx="9" className="fill-accent" />
          <rect x="-14" y="-92" width="28" height="30" rx="7" className="fill-secondary" />
          {[-8, -2, 4].map((o) => (
            <rect key={o} x={o - 1} y="-112" width="4" height="22" rx="2" className="fill-primary" />
          ))}
        </g>
      </g>
      <Sparkle x={92} y={110} s={1.3} />
      <Sparkle x={318} y={96} s={1} d={0.9} />
      <Sparkle x={70} y={250} s={0.8} d={1.7} />
      <Sparkle x={285} y={190} s={0.7} d={0.4} />
    </Frame>
  );
}

function Coaching() {
  return (
    <Frame label="Open book with graduation cap, light bulb and pencil">
      <circle cx="200" cy="205" r="168" className="fill-primary/10" />
      <circle cx="200" cy="205" r="190" className="fill-none stroke-primary/25" strokeWidth="2" strokeDasharray="4 10" />
      {/* bulb */}
      <g className="a-float-slow">
        <g transform="translate(318 96)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="0" y1="-44" x2="0" y2="-56" transform={`rotate(${a})`} className="a-ray stroke-accent" strokeWidth="5" strokeLinecap="round" style={{ animationDelay: `${a / 360}s` }} />
          ))}
          <circle r="32" className="fill-accent" />
          <rect x="-13" y="28" width="26" height="14" rx="4" className="fill-secondary" />
          <path d="M-8 -6 Q0 12 8 -6" className="fill-none stroke-white" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
      {/* book */}
      <g className="a-float">
        <ellipse cx="200" cy="352" rx="110" ry="10" className="fill-secondary/10" />
        <path d="M200 262 L84 244 L84 336 L200 354 Z" className="fill-white stroke-secondary" strokeWidth="6" strokeLinejoin="round" />
        <path d="M200 262 L316 244 L316 336 L200 354 Z" className="fill-white stroke-secondary" strokeWidth="6" strokeLinejoin="round" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line x1="104" y1={268 + i * 16} x2="178" y2={278 + i * 16} className="stroke-primary/40" strokeWidth="5" strokeLinecap="round" />
            <line x1="296" y1={268 + i * 16} x2="222" y2={278 + i * 16} className="stroke-primary/40" strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}
        {/* graduation cap */}
        <g className="a-float-slow">
          <path d="M150 184 V222 Q200 252 250 222 V184 L200 206 Z" className="fill-secondary" />
          <path d="M200 112 L306 156 L200 200 L94 156 Z" className="fill-primary stroke-secondary" strokeWidth="6" strokeLinejoin="round" />
          <path d="M296 160 V212" className="stroke-accent" strokeWidth="5" strokeLinecap="round" />
          <circle cx="296" cy="218" r="9" className="fill-accent" />
        </g>
      </g>
      {/* pencil */}
      <g className="a-float-r" style={{ "--r": "-35deg" } as React.CSSProperties}>
        <g transform="translate(78 150) rotate(-35)">
          <rect x="-9" y="-62" width="18" height="100" className="fill-accent" />
          <rect x="-9" y="-72" width="18" height="12" rx="3" className="fill-secondary" />
          <path d="M-9 38 L9 38 L0 62 Z" className="fill-white stroke-secondary" strokeWidth="4" strokeLinejoin="round" />
          <path d="M-3 54 L3 54 L0 62 Z" className="fill-secondary" />
        </g>
      </g>
      <text x="60" y="330" className="a-float fill-primary font-heading" fontSize="34" fontWeight="700">π</text>
      <text x="322" y="300" className="a-float-slow fill-secondary font-heading" fontSize="30" fontWeight="700">A+</text>
      <text x="318" y="196" className="a-float fill-primary/70 font-heading" fontSize="28" fontWeight="700">∑</text>
      <Sparkle x={128} y={92} s={1.1} />
      <Sparkle x={42} y={220} s={0.8} d={1.2} />
      <Sparkle x={356} y={246} s={0.9} d={0.6} />
    </Frame>
  );
}

function Property() {
  const win = (x: number, y: number, d: number) => <rect key={`${x}-${y}`} x={x} y={y} width="10" height="14" rx="2" className="a-twinkle fill-accent" style={{ animationDelay: `${d}s` }} />;
  return (
    <Frame label="South Mumbai skyline with a heritage building and a house key">
      <circle cx="200" cy="205" r="168" className="fill-primary/10" />
      <circle cx="200" cy="205" r="190" className="fill-none stroke-primary/25" strokeWidth="2" strokeDasharray="4 10" />
      <g className="a-drift">
        <g className="fill-white stroke-secondary/30" strokeWidth="3">
          <ellipse cx="96" cy="108" rx="40" ry="14" />
          <ellipse cx="124" cy="96" rx="26" ry="14" />
        </g>
      </g>
      <circle cx="310" cy="106" r="26" className="a-float-slow fill-accent/80" />
      {/* skyline */}
      <g>
        <rect x="48" y="226" width="62" height="124" rx="4" className="fill-secondary/80" />
        <rect x="290" y="206" width="66" height="144" rx="4" className="fill-secondary/80" />
        <rect x="112" y="258" width="40" height="92" className="fill-secondary/55" />
        <rect x="252" y="250" width="40" height="100" className="fill-secondary/55" />
        {[240, 262, 284, 306].map((y, i) => win(60, y, i * 0.5))}
        {[240, 262, 284, 306].map((y, i) => win(86, y, i * 0.7 + 0.3))}
        {[222, 246, 270, 294, 318].map((y, i) => win(302, y, i * 0.4))}
        {[222, 246, 270, 294, 318].map((y, i) => win(330, y, i * 0.6 + 0.2))}
      </g>
      {/* heritage building */}
      <g className="a-float-slow" style={{ animationDuration: "9s" }}>
        <rect x="150" y="214" width="100" height="136" rx="4" className="fill-white stroke-secondary" strokeWidth="6" />
        <path d="M144 214 H256 L200 170 Z" className="fill-primary stroke-secondary" strokeWidth="6" strokeLinejoin="round" />
        <rect x="190" y="130" width="20" height="42" className="fill-white stroke-secondary" strokeWidth="5" />
        <path d="M186 132 Q200 96 214 132 Z" className="fill-primary stroke-secondary" strokeWidth="5" strokeLinejoin="round" />
        <line x1="200" y1="96" x2="200" y2="82" className="stroke-secondary" strokeWidth="4" strokeLinecap="round" />
        <circle cx="200" cy="198" r="11" className="fill-white stroke-secondary" strokeWidth="4" />
        <path d="M200 198 V191 M200 198 L206 201" className="fill-none stroke-secondary" strokeWidth="3" strokeLinecap="round" />
        {[166, 200, 234].map((x) => (
          <path key={x} d={`M${x - 11} 262 V240 Q${x} 224 ${x + 11} 240 V262 Z`} className="fill-primary/25 stroke-secondary" strokeWidth="4" />
        ))}
        <path d="M184 350 V300 Q200 280 216 300 V350 Z" className="fill-secondary" />
        {[166, 234].map((x) => (
          <path key={x} d={`M${x - 11} 322 V300 Q${x} 284 ${x + 11} 300 V322 Z`} className="fill-primary/25 stroke-secondary" strokeWidth="4" />
        ))}
      </g>
      <rect x="20" y="348" width="360" height="12" rx="6" className="fill-secondary" />
      {/* key */}
      <g transform="translate(70 18)">
        <g className="a-sway">
          <line x1="0" y1="0" x2="0" y2="34" className="stroke-secondary" strokeWidth="3" />
          <g transform="translate(0 34)">
            <circle cx="0" cy="16" r="16" className="fill-accent stroke-secondary" strokeWidth="5" />
            <circle cx="0" cy="16" r="5" className="fill-white" />
            <rect x="-4" y="30" width="8" height="52" rx="3" className="fill-accent stroke-secondary" strokeWidth="5" />
            <rect x="4" y="60" width="14" height="7" className="fill-accent stroke-secondary" strokeWidth="4" />
            <rect x="4" y="72" width="10" height="7" className="fill-accent stroke-secondary" strokeWidth="4" />
          </g>
        </g>
      </g>
      <Sparkle x={338} y={64} s={0.9} />
      <Sparkle x={36} y={190} s={0.8} d={1} />
    </Frame>
  );
}

export function Illustration({ kind }: { kind: "dental" | "coaching" | "property" }) {
  return kind === "coaching" ? <Coaching /> : kind === "property" ? <Property /> : <Dental />;
}
