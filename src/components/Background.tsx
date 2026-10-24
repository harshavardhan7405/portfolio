import { useEffect, useRef } from "react";

export type BackgroundKind = "aurora" | "constellation" | "grid" | "spotlight" | "waves";

type Option = { id: BackgroundKind; label: string; blurb: string };

export const backgroundOptions: Option[] = [
  { id: "aurora", label: "Aurora", blurb: "Soft light drifting behind the text" },
  { id: "constellation", label: "Constellation", blurb: "Dots linked by lines, reacts to your cursor" },
  { id: "grid", label: "Grid Flow", blurb: "Perspective grid rolling toward you" },
  { id: "spotlight", label: "Spotlight", blurb: "A glow that follows your cursor" },
  { id: "waves", label: "Waves", blurb: "Layered sine lines drifting sideways" },
];

/* ---------- 1. Aurora ---------- */
function Aurora() {
  return (
    <>
      <span className="aurora-blob aurora-1" aria-hidden />
      <span className="aurora-blob aurora-2" aria-hidden />
      <span className="aurora-blob aurora-3" aria-hidden />
    </>
  );
}

/* ---------- 2. Constellation (canvas) ---------- */
function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK = 132;
    const pts: { x: number; y: number; vx: number; vy: number }[] = [];
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.max(28, Math.min(110, Math.round((w * h) / 15000)));
      pts.length = 0;
      for (let i = 0; i < target; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
        });
      }
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      const isDark = document.documentElement.classList.contains("dark");
      
      // Crisp contrasting colors for both dark and light modes
      const strokeColor = isDark ? "#38bdf8" : "#0284c7";
      const dotColor = isDark ? "#ffffff" : "#0369a1";
      const lineAlphaFactor = isDark ? 0.35 : 0.65;
      const mouseAlphaFactor = isDark ? 0.55 : 0.8;

      ctx.lineWidth = isDark ? 1 : 1.25;
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = dotColor;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!p) continue;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 150 && dm > 0.01) {
          const push = ((150 - dm) / 150) * 0.06;
          p.x += (dxm / dm) * push * 12;
          p.y += (dym / dm) * push * 12;
        }

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          if (!q) continue;
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * lineAlphaFactor;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        if (dm < 190) {
          ctx.globalAlpha = (1 - dm / 190) * mouseAlphaFactor;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.globalAlpha = isDark ? 0.85 : 0.95;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isDark ? 1.5 : 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave);
      raf = requestAnimationFrame(frame);
    } else {
      frame();
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}

/* ---------- 3. Grid Flow ---------- */
function GridFlow() {
  return (
    <>
      <span className="bgfx-grid-plane" aria-hidden />
      <span className="bgfx-grid-horizon" aria-hidden />
    </>
  );
}

/* ---------- 4. Spotlight ---------- */
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let tx = 50;
    let ty = 35;
    let cx = 50;
    let cy = 35;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
    };
    const loop = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.setProperty("--sx", `${cx.toFixed(2)}%`);
      el.style.setProperty("--sy", `${cy.toFixed(2)}%`);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className="bgfx-spot" aria-hidden>
      <span className="bgfx-spot-sheen" />
    </div>
  );
}

/* ---------- 5. Waves ---------- */
const W = 2400;
const H = 600;
const WL = 400;

function sinePath(y: number, amp: number, phase: number, step = 10) {
  let d = `M0 ${(y + amp * Math.sin(phase)).toFixed(1)}`;
  for (let x = step; x <= W; x += step) {
    d += ` L${x} ${(y + amp * Math.sin((x / WL) * Math.PI * 2 + phase)).toFixed(1)}`;
  }
  return d;
}

const WAVES = [
  { y: 150, amp: 34, phase: 0, o: 0.22, cls: "wave-a" },
  { y: 250, amp: 58, phase: 1.1, o: 0.4, cls: "wave-b" },
  { y: 330, amp: 44, phase: 2.2, o: 0.3, cls: "wave-c" },
  { y: 430, amp: 70, phase: 3.4, o: 0.18, cls: "wave-d" },
];

function Waves() {
  return (
    <svg className="bgfx-waves" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
      {WAVES.map((v, i) => (
        <path
          key={i}
          d={sinePath(v.y, v.amp, v.phase)}
          className={v.cls}
          fill="none"
          strokeWidth={1.6}
          strokeOpacity={v.o}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/* ---------- Switch ---------- */
export function Background({ kind }: { kind: BackgroundKind }) {
  return (
    <div className="bgfx" aria-hidden>
      {kind === "aurora" && <Aurora />}
      {kind === "constellation" && <Constellation />}
      {kind === "grid" && <GridFlow />}
      {kind === "spotlight" && <Spotlight />}
      {kind === "waves" && <Waves />}
      <span className="bgfx-grain" />
    </div>
  );
}
