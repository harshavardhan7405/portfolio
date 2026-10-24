/**
 * animations.ts
 * Central GSAP animation utilities for the portfolio.
 *
 * Uses:
 *   - GSAP core (tweens, timelines)
 *   - ScrollTrigger (scroll-driven reveals, scrub effects)
 *   - CustomEase (signature easing curves)
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, CustomEase);

// ─────────────────────────────────────────────
//  Signature ease curves (inspired by soliciabrown.com)
// ─────────────────────────────────────────────
export const EASES = {
  /** Slow start, fast mid, luxurious soft landing */
  expo: CustomEase.create("expo", "M0,0 C0.16,1 0.3,1 1,1"),
  /** Crisp entrance with a slight overshoot */
  spring: CustomEase.create("spring", "M0,0 C0.22,1.2 0.36,1 1,1"),
  /** Text reveal – tight overshoot, very fast */
  textIn: CustomEase.create("textIn", "M0,0 C0.1,1.1 0.25,1 1,1"),
  /** Graceful slide-out */
  slideOut: CustomEase.create("slideOut", "M0,0 C0.65,0 0.85,0.5 1,1"),
  /** Parallax drift */
  drift: CustomEase.create("drift", "M0,0 C0.4,0 0.6,1 1,1"),
} as const;

// ─────────────────────────────────────────────
//  SplitText helper (pure vanilla – no GSAP SplitText plugin)
//  Wraps every word and character in spans for animation.
// ─────────────────────────────────────────────

export interface SplitResult {
  chars: HTMLElement[];
  words: HTMLElement[];
  /** Call revert() to restore original HTML */
  revert: () => void;
}

export function splitText(
  el: HTMLElement,
  mode: "chars" | "words" | "both" = "both",
): SplitResult {
  const original = el.innerHTML;

  // Split into words first
  const rawWords = el.textContent?.split(" ") ?? [];
  const wordEls: HTMLElement[] = [];
  const charEls: HTMLElement[] = [];

  const html = rawWords
    .map((word) => {
      const charsHtml =
        mode !== "words"
          ? word
              .split("")
              .map(
                (ch) =>
                  `<span class="split-char" style="display:inline-block;will-change:transform,opacity;">${ch === " " ? "&nbsp;" : ch}</span>`,
              )
              .join("")
          : word;

      return `<span class="split-word" style="display:inline-block;overflow:hidden;vertical-align:bottom;">${charsHtml}</span>`;
    })
    .join(
      '<span class="split-space" style="display:inline-block;width:0.3em;">&nbsp;</span>',
    );

  el.innerHTML = html;
  wordEls.push(...Array.from(el.querySelectorAll<HTMLElement>(".split-word")));
  charEls.push(...Array.from(el.querySelectorAll<HTMLElement>(".split-char")));

  return {
    chars: charEls,
    words: wordEls,
    revert: () => {
      el.innerHTML = original;
    },
  };
}

// ─────────────────────────────────────────────
//  Hero text reveal  (character by character stagger)
// ─────────────────────────────────────────────

export function animateHeroTitle(
  chars: HTMLElement[],
  delay = 0.3,
): gsap.core.Timeline {
  return gsap.timeline({ delay }).fromTo(
    chars,
    { y: "110%", opacity: 0, rotateZ: 3 },
    {
      y: "0%",
      opacity: 1,
      rotateZ: 0,
      stagger: 0.04,
      duration: 0.9,
      ease: EASES.textIn,
    },
  );
}

export function animateHeroSubtitle(el: HTMLElement, delay = 1.4): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 1, ease: EASES.expo, delay },
  );
}

export function animateHeroCta(els: HTMLElement[], delay = 1.6): gsap.core.Tween {
  return gsap.fromTo(
    els,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: EASES.spring,
      delay,
    },
  );
}

// ─────────────────────────────────────────────
//  Section heading: words slide up from clip mask
// ─────────────────────────────────────────────

export function animateSectionHeading(
  words: HTMLElement[],
  trigger: Element,
): gsap.core.Timeline {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top 82%",
      toggleActions: "play none none none",
    },
  }).fromTo(
    words,
    { y: "105%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      stagger: 0.1,
      duration: 0.85,
      ease: EASES.textIn,
    },
  );
}

// ─────────────────────────────────────────────
//  Label (monospace caps) fade + slide
// ─────────────────────────────────────────────

export function animateLabel(el: HTMLElement, trigger: Element): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { opacity: 0, x: -12, letterSpacing: "0.4em" },
    {
      opacity: 1,
      x: 0,
      letterSpacing: "0.2em",
      duration: 0.9,
      ease: EASES.drift,
      scrollTrigger: {
        trigger,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    },
  );
}

// ─────────────────────────────────────────────
//  Generic content block reveal (fade + translateY)
// ─────────────────────────────────────────────

export function animateReveal(
  els: Element | Element[] | NodeListOf<Element>,
  trigger: Element,
  stagger = 0.12,
): gsap.core.Tween {
  return gsap.fromTo(
    els,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      stagger,
      duration: 0.9,
      ease: EASES.expo,
      scrollTrigger: {
        trigger,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );
}

// ─────────────────────────────────────────────
//  Skill card: stagger grid entrance
// ─────────────────────────────────────────────

export function animateSkillCards(cards: Element[], trigger: Element): gsap.core.Tween {
  return gsap.fromTo(
    cards,
    { opacity: 0, y: 50, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: { amount: 0.55, from: "start" },
      duration: 0.85,
      ease: EASES.spring,
      scrollTrigger: {
        trigger,
        start: "top 78%",
        toggleActions: "play none none none",
      },
    },
  );
}

// ─────────────────────────────────────────────
//  Project card: slide in with border glow
// ─────────────────────────────────────────────

export function animateProjectCards(cards: Element[], trigger: Element): gsap.core.Tween {
  return gsap.fromTo(
    cards,
    { opacity: 0, y: 60, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: { amount: 0.6, from: "start" },
      duration: 1,
      ease: EASES.expo,
      scrollTrigger: {
        trigger,
        start: "top 78%",
        toggleActions: "play none none none",
      },
    },
  );
}

// ─────────────────────────────────────────────
//  Parallax (scroll scrub Y offset on an element)
// ─────────────────────────────────────────────

export function animateParallax(
  el: Element,
  yRange: [number, number] = [-30, 30],
  trigger?: Element,
): ScrollTrigger {
  gsap.set(el, { y: yRange[0] });
  return ScrollTrigger.create({
    trigger: trigger ?? el,
    start: "top bottom",
    end: "bottom top",
    scrub: 1.2,
    onUpdate: (self) => {
      const y = gsap.utils.interpolate(yRange[0], yRange[1], self.progress);
      gsap.set(el, { y });
    },
  });
}

// ─────────────────────────────────────────────
//  Experience timeline: stagger list items
// ─────────────────────────────────────────────

export function animateExperienceItems(
  items: Element[],
  trigger: Element,
): gsap.core.Tween {
  return gsap.fromTo(
    items,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: EASES.expo,
      scrollTrigger: {
        trigger,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );
}

// ─────────────────────────────────────────────
//  Contact section: split stagger reveal
// ─────────────────────────────────────────────

export function animateContactBlock(
  els: Element[],
  trigger: Element,
): gsap.core.Tween {
  return gsap.fromTo(
    els,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: EASES.drift,
      scrollTrigger: {
        trigger,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );
}

// ─────────────────────────────────────────────
//  Magnetic button effect (follows cursor within proximity)
// ─────────────────────────────────────────────

export function createMagneticEffect(
  el: HTMLElement,
  strength = 0.35,
): () => void {
  const bounds = { x: 0, y: 0, w: 0, h: 0 };

  const onEnter = () => {
    const rect = el.getBoundingClientRect();
    bounds.x = rect.left + rect.width / 2;
    bounds.y = rect.top + rect.height / 2;
    bounds.w = rect.width;
    bounds.h = rect.height;
  };

  const onMove = (e: MouseEvent) => {
    const dx = e.clientX - bounds.x;
    const dy = e.clientY - bounds.y;
    gsap.to(el, {
      x: dx * strength,
      y: dy * strength,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: EASES.spring });
  };

  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

// ─────────────────────────────────────────────
//  Smooth scroll (native scroll-behavior polyfill via GSAP)
// ─────────────────────────────────────────────

export function initSmoothAnchorScroll(): () => void {
  const handler = (e: MouseEvent) => {
    const anchor = (e.target as Element)?.closest<HTMLAnchorElement>("a[href^='#']");
    if (!anchor) return;
    const id = anchor.getAttribute("href")?.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 80 },
      duration: 1.1,
      ease: EASES.expo,
    });
  };

  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}

// ─────────────────────────────────────────────
//  Cleanup helper (kill all ScrollTriggers on unmount)
// ─────────────────────────────────────────────

export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
