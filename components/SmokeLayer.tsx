'use client';

interface WispConfig {
  left: string;
  size: string;
  dur: string;
  delay: string;
  dx: string;
  drift: string;
  color: string;
  peak: string;
}

const WISPS: WispConfig[] = [
  // Violet wisps
  {
    left: '5%',
    size: '140px',
    dur: '7.2s',
    delay: '0s',
    dx: '-10px',
    drift: '22px',
    color: 'rgba(124,58,237,0.28)',
    peak: '0.58',
  },
  {
    left: '18%',
    size: '100px',
    dur: '9.1s',
    delay: '1.3s',
    dx: '8px',
    drift: '-16px',
    color: 'rgba(139,92,246,0.22)',
    peak: '0.48',
  },
  // Cyan wisps
  {
    left: '32%',
    size: '170px',
    dur: '8.4s',
    delay: '0.6s',
    dx: '-6px',
    drift: '28px',
    color: 'rgba(6,182,212,0.26)',
    peak: '0.62',
  },
  {
    left: '47%',
    size: '115px',
    dur: '6.3s',
    delay: '2.1s',
    dx: '14px',
    drift: '-12px',
    color: 'rgba(34,211,238,0.20)',
    peak: '0.46',
  },
  // Orange wisps
  {
    left: '60%',
    size: '155px',
    dur: '9.8s',
    delay: '0.8s',
    dx: '-20px',
    drift: '32px',
    color: 'rgba(249,115,22,0.24)',
    peak: '0.54',
  },
  {
    left: '74%',
    size: '95px',
    dur: '7.6s',
    delay: '1.8s',
    dx: '10px',
    drift: '-18px',
    color: 'rgba(251,146,60,0.20)',
    peak: '0.44',
  },
  // Pink/magenta wisps
  {
    left: '85%',
    size: '130px',
    dur: '8.0s',
    delay: '0.4s',
    dx: '-8px',
    drift: '14px',
    color: 'rgba(236,72,153,0.22)',
    peak: '0.52',
  },
  {
    left: '93%',
    size: '80px',
    dur: '6.6s',
    delay: '2.6s',
    dx: '6px',
    drift: '-10px',
    color: 'rgba(167,139,250,0.18)',
    peak: '0.40',
  },
  // Extra mid wisps for density
  {
    left: '38%',
    size: '90px',
    dur: '10.2s',
    delay: '3.0s',
    dx: '-4px',
    drift: '20px',
    color: 'rgba(6,182,212,0.16)',
    peak: '0.38',
  },
  {
    left: '55%',
    size: '120px',
    dur: '7.9s',
    delay: '1.0s',
    dx: '12px',
    drift: '-8px',
    color: 'rgba(124,58,237,0.20)',
    peak: '0.45',
  },
];

export function SmokeLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
      style={{ height: '280px', zIndex: 5 }}
      aria-hidden="true"
    >
      {WISPS.map((wisp, i) => (
        <div
          key={i}
          className="smoke-wisp"
          style={
            {
              left: wisp.left,
              '--smoke-size': wisp.size,
              '--smoke-dur': wisp.dur,
              '--smoke-delay': wisp.delay,
              '--smoke-dx': wisp.dx,
              '--smoke-drift': wisp.drift,
              '--smoke-color': wisp.color,
              '--smoke-peak': wisp.peak,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
