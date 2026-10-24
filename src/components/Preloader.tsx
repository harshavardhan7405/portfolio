import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { EASES } from "../lib/animations";
import { site } from "../config/site";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip animation if already played in this browser session
    if (typeof window !== "undefined" && sessionStorage.getItem("portfolio-preloaded") === "true") {
      onComplete();
      return;
    }

    const duration = 3.0; // Snappy 3.0s (within the 3-5 seconds requirement)
    const obj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem("portfolio-preloaded", "true");
        } catch {
          // ignore storage errors
        }
        // Smooth slide & fade out
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.98,
            duration: 0.75,
            ease: EASES.expo,
            onComplete: () => onComplete(),
          });
        } else {
          onComplete();
        }
      },
    });

    // Tween the counter from 0 to 100 with realistic easing
    tl.to(obj, {
      val: 100,
      duration,
      ease: "power2.inOut",
      onUpdate: () => {
        setPercent(Math.floor(obj.val));
        if (barRef.current) {
          barRef.current.style.width = `${obj.val}%`;
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0f] text-foreground px-6 select-none"
    >
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Monogram / Title */}
        <p className="font-display text-lg font-bold tracking-tight text-white mb-1">
          {site.monogram}<span className="text-primary">.</span>
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          INITIALIZING PORTFOLIO
        </p>

        {/* Horizontal Loading Line in the middle of screen */}
        <div className="relative w-full h-[3px] rounded-full bg-border/40 overflow-hidden">
          <div
            ref={barRef}
            className="absolute left-0 top-0 h-full rounded-full bg-primary shadow-[0_0_14px_3px_color-mix(in_oklab,var(--primary)_80%,transparent)] transition-all duration-75"
            style={{ width: "0%" }}
          />
        </div>

        {/* Live Percentage Display */}
        <div className="w-full flex items-center justify-between mt-4 font-mono text-xs text-muted-foreground">
          <span className="tracking-widest uppercase text-[10px]">SYSTEM READY</span>
          <span className="text-primary font-semibold text-sm tabular-nums">
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
}
