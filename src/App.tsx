import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  FileText,
  Instagram,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Phone,
  Copy,
  Check,
} from "lucide-react";
import { site, skills, projects, experience, achievements } from "./config/site";
import { Background } from "./components/Background";
import { Preloader } from "./components/Preloader";
import { getSkillIcon } from "./components/SkillIcons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
  splitText,
  animateSectionHeading,
  animateLabel,
  animateReveal,
  animateSkillCards,
  animateProjectCards,
  animateExperienceItems,
  animateContactBlock,
  createMagneticEffect,
  killAllScrollTriggers,
  EASES,
} from "./lib/animations";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollToPlugin);

// ─────────────────────────────────────────────────────────────────────────────
//  Theme Context
// ─────────────────────────────────────────────────────────────────────────────

const ThemeCtx = createContext<{ dark: boolean; toggle: () => void }>({
  dark: true,
  toggle: () => {},
});

function useTheme() {
  return useContext(ThemeCtx);
}

// ─────────────────────────────────────────────────────────────────────────────
//  Nav links
// ─────────────────────────────────────────────────────────────────────────────

const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Smooth scroll hook
// ─────────────────────────────────────────────────────────────────────────────

function useSmoothScroll() {
  return useCallback((e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    gsap.to(window, {
      scrollTo: { y: target, offsetY: 80 },
      duration: 1.1,
      ease: EASES.expo,
    });
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
//  Section
// ─────────────────────────────────────────────────────────────────────────────

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<ReturnType<typeof splitText> | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const labelEl = labelRef.current;
    const headingEl = headingRef.current;
    if (!section || !labelEl || !headingEl) return;

    animateLabel(labelEl, section);
    splitRef.current = splitText(headingEl, "words");
    animateSectionHeading(splitRef.current.words, section);

    return () => splitRef.current?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="scroll-mt-24 border-t border-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div>
          <p ref={labelRef} className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {label}
          </p>
          <h2
            ref={headingRef}
            className="mt-4 heading-glow font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          >
            {title}
          </h2>
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

// ─────────────────────────────────────────────────────────────────────────────
//  Header
// ─────────────────────────────────────────────────────────────────────────────

function Header() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navLinksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const handleScroll = useSmoothScroll();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const logo = logoRef.current;
    const navLinks = navLinksRef.current?.querySelectorAll("li");
    const cta = ctaRef.current;
    if (!logo) return;

    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(logo, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7, ease: EASES.spring });
    if (navLinks?.length) {
      tl.fromTo(navLinks, { opacity: 0, y: -10 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: EASES.expo }, "-=0.4");
    }
    if (cta) {
      tl.fromTo(cta, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.5, ease: EASES.spring }, "-=0.25");
    }
  }, []);

  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    return createMagneticEffect(cta, 0.25);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 animate-fade-down transition-colors ${
        scrolled || open ? "border-b border-border bg-background/80 backdrop-blur-md" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Main">
        {/* Left: Monogram */}
        <a
          ref={logoRef}
          href="#top"
          className="font-display text-lg font-semibold tracking-tight"
          aria-label={`${site.name}, back to top`}
          onClick={(e) => handleScroll(e, "top")}
        >
          {site.monogram}<span className="text-primary">.</span>
        </a>

        {/* Center: Navigation Links + Light/Dark mode toggle */}
        <div className="hidden items-center gap-6 md:flex">
          <ul ref={navLinksRef} className="flex items-center gap-6">
            {nav.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="nav-pill text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={(e) => handleScroll(e, l.id)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Theme toggle right at the center navigation */}
          <button
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className={`mode-switch flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-mono text-muted-foreground backdrop-blur transition hover:border-primary/60 hover:text-foreground ${
              !dark ? "active" : ""
            }`}
          >
            {dark ? <Moon className="h-3.5 w-3.5 text-primary" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
            <span className="uppercase tracking-wider text-[10px]">{dark ? "dark" : "light"}</span>
          </button>
        </div>

        {/* Right: CTA button */}
        <a
          ref={ctaRef}
          href="#contact"
          className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90 md:inline-flex"
          onClick={(e) => handleScroll(e, "contact")}
        >
          Let's Talk
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul id="mobile-menu" className="flex flex-col gap-1 px-6 pb-6 md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          {[...nav, { id: "contact", label: "Let's Talk" }].map((l, i) => (
            <li key={l.label + i}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  setOpen(false);
                  handleScroll(e, l.id);
                }}
                className="block py-3 font-display text-2xl"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm font-mono text-muted-foreground">Theme</span>
            <button onClick={toggle} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              {dark ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-amber-500" />}
              {dark ? "Dark mode" : "Light mode"}
            </button>
          </li>
        </ul>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hero
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<ReturnType<typeof splitText> | null>(null);
  const handleScroll = useSmoothScroll();

  useEffect(() => {
    const h1 = h1Ref.current;
    const subtitle = subtitleRef.current;
    const desc = descRef.current;
    const ctaRow = ctaRowRef.current;
    if (!h1 || !subtitle || !desc || !ctaRow) return;

    splitRef.current = splitText(h1, "chars");
    const tl = gsap.timeline({ delay: 0.2 });

    const wordEls = Array.from(h1.querySelectorAll<HTMLElement>(".split-word"));
    let charDelay = 0;
    wordEls.forEach((wordEl) => {
      const chars = Array.from(wordEl.querySelectorAll<HTMLElement>(".split-char"));
      tl.fromTo(
        chars,
        { y: "110%", opacity: 0, rotateZ: 4 },
        { y: "0%", opacity: 1, rotateZ: 0, stagger: 0.035, duration: 0.85, ease: EASES.textIn },
        charDelay,
      );
      charDelay += chars.length * 0.035 + 0.05;
    });

    tl.fromTo(subtitle, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: EASES.expo }, "-=0.3");
    tl.fromTo(desc, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: EASES.expo }, "-=0.6");

    const ctaEls = Array.from(ctaRow.children) as HTMLElement[];
    tl.fromTo(ctaEls, { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: EASES.spring }, "-=0.5");

    return () => splitRef.current?.revert();
  }, []);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-background/30 to-background" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <p className="enter font-mono text-xs uppercase tracking-[0.3em] text-primary" style={{ animationDelay: "100ms" }}>
          Hello, I'm
        </p>
        <h1
          ref={h1Ref}
          aria-label={site.name}
          className="name-glow mt-5 font-display text-[clamp(2.5rem,7.5vw,6rem)] font-bold leading-[1] tracking-tight overflow-hidden"
        >
          {site.name}
        </h1>
        <p ref={subtitleRef} className="enter mt-6 font-mono text-sm text-foreground/85 md:text-base">
          {site.role}
        </p>
        <p ref={descRef} className="enter mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Building thoughtful digital experiences through clean, maintainable code — one launch at a time.
        </p>
        <div ref={ctaRowRef} className="enter mt-10 flex flex-wrap items-center gap-4">
          <a
            href={site.resumeUrl || "/resume.pdf"}
            {...ext}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            <FileText className="h-4 w-4" /> View Résumé{" "}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScroll(e, "contact")}
            className="inline-flex items-center rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-medium backdrop-blur transition hover:border-foreground/40"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  About
// ─────────────────────────────────────────────────────────────────────────────

function About() {
  const blockRef = useRef<HTMLDivElement>(null);
  const parasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = blockRef.current;
    const paras = parasRef.current;
    if (!block || !paras) return;

    animateReveal(Array.from(paras.children), block, 0.14);
  }, []);

  return (
    <Section id="about" label="About" title="A little about me.">
      <div ref={blockRef} className="max-w-3xl">
        <div ref={parasRef} className="space-y-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
          <p>
            I'm interested in building useful applications and understanding how software systems work from end to end.
          </p>
          <p>
            I enjoy exploring programming, developing projects, learning new technologies, and improving the way I approach technical challenges.
          </p>
          <p>
            My goal is to contribute to meaningful software projects, strengthen my engineering fundamentals, and continue growing as a developer.
          </p>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Skills (3 Balanced Cards Side-by-Side, Zero Icons, Tags Arranged Side-by-Side)
// ─────────────────────────────────────────────────────────────────────────────

const skillCategories = [
  {
    category: "Programming Languages",
    description: "Core languages and frontend frameworks",
    items: [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    category: "Tech Stack",
    description: "Backend architecture, APIs and databases",
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "SQL Fundamentals",
    ],
  },
  {
    category: "Tools & Libraries",
    description: "Version control and development environments",
    items: [
      "Git",
      "GitHub",
      "Visual Studio Code",
      "Postman",
      "GitHub Copilot",
    ],
  },
];

function Skills() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;
    const cards = Array.from(container.children);
    animateSkillCards(cards, container);
  }, []);

  return (
    <Section id="skills" label="Skills" title="Tools I work with.">
      <p className="-mt-6 mb-12 max-w-xl text-muted-foreground">
        Core technologies, full stack frameworks, and developer environments I leverage to design and build maintainable software systems.
      </p>

      {/* 3 Symmetrical Cards Side-by-Side (Zero Empty Space) */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {skillCategories.map((cat) => (
          <div
            key={cat.category}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                  {cat.category}
                </h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-primary">
                  {cat.items.length} items
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {cat.description}
              </p>

              {/* Skill names side by side without icons */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-lg border border-border bg-background/60 px-3.5 py-2 font-mono text-xs text-foreground/90 transition-all duration-200 hover:border-primary/60 hover:bg-card hover:text-primary hover:shadow-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Projects (Sticky Scroll-Driven Stacking Cards Deck)
// ─────────────────────────────────────────────────────────────────────────────

function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>(".stack-card"));
    const triggers: ScrollTrigger[] = [];

    // Scroll-driven stacking scale on desktop (on mobile, cards flow naturally with safe spacing)
    if (window.innerWidth >= 768) {
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Last card stays scale 1

        const cardContent = card.querySelector<HTMLElement>(".stack-card-content");
        const nextCard = cards[i + 1];

        if (cardContent && nextCard) {
          const tween = gsap.to(cardContent, {
            scale: 0.94 - (cards.length - 2 - i) * 0.02,
            transformOrigin: "50% 0%",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top 75%",
              end: "top 20%",
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }
      });
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <Section id="projects" label="Projects" title="Selected work.">
      <p className="-mt-6 mb-12 max-w-xl text-muted-foreground">
        A selection of projects that reflect my interests, technical learning, and approach to problem-solving.
      </p>

      {/* Sticky Stacking Cards Container */}
      <div ref={containerRef} className="cards-stack-container mx-auto max-w-4xl">
        {projects.map((p, i) => {
          const topOffset = `calc(5rem + ${i * 1.5}rem)`;

          return (
            <div
              key={p.title + i}
              className="stack-card"
              style={{
                top: topOffset,
                zIndex: i + 1,
              }}
            >
              <article className="stack-card-content group relative rounded-2xl border border-border bg-card p-8 md:p-10 shadow-xl backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Project 0{i + 1} / 0{projects.length}
                    </span>
                    {p.placeholder && (
                      <span className="rounded-full border border-dashed border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Placeholder
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight md:text-3xl text-foreground transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {p.description}
                </p>

                <dl className="mt-6 grid gap-4 rounded-xl border border-border/60 bg-background/50 p-5 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-primary">
                      Problem
                    </dt>
                    <dd className="mt-1 text-muted-foreground leading-relaxed">{p.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-primary">
                      Solution
                    </dt>
                    <dd className="mt-1 text-muted-foreground leading-relaxed">{p.solution}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-primary">
                      My role
                    </dt>
                    <dd className="mt-1 text-muted-foreground leading-relaxed">
                      {p.contribution}
                    </dd>
                  </div>
                </dl>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-6">
                  <ul className="flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        {...ext}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 hover:border-primary hover:text-primary transition shadow-xs"
                      >
                        <Github className="h-4 w-4" /> View on GitHub{" "}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground">
                        GitHub link to be added
                      </span>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        {...ext}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-glow hover:opacity-90 transition"
                      >
                        Live demo <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Experience
// ─────────────────────────────────────────────────────────────────────────────

function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) animateExperienceItems(Array.from(listRef.current.children), listRef.current);
    if (emptyRef.current) animateReveal([emptyRef.current], emptyRef.current, 0);
  }, []);

  return (
    <Section id="experience" label="Experience" title="Professional journey.">
      {experience.length ? (
        <ol ref={listRef} className="border-l border-border">
          {experience.map((e) => (
            <li key={e.role + e.organization} className="relative pb-10 pl-8">
              <span className="absolute -left-1 top-2 h-2 w-2 rounded-full bg-primary" />
              <p className="font-mono text-xs text-muted-foreground">{e.dates}</p>
              <h3 className="mt-1 font-display text-xl">{e.role} · {e.organization}</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                {e.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      ) : (
        <div ref={emptyRef} className="max-w-3xl border-l-2 border-primary/60 pl-8 text-lg md:text-xl leading-relaxed text-muted-foreground">
          As a fresher, I’ve built my experience through hands-on projects, self-driven learning, and assignments that mirror real engineering problems. I’ve designed REST APIs, integrated third-party services, worked with databases, and trained deep learning models, always focusing on clean structure and practical results. I’m ready to bring that same discipline to a professional team.
        </div>
      )}
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Achievements
// ─────────────────────────────────────────────────────────────────────────────

function Achievements() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    animateReveal(Array.from(listRef.current.children), listRef.current, 0.1);
  }, []);

  if (!achievements.length) return null;

  return (
    <Section id="achievements" label="Achievements" title="Achievements & certifications.">
      <ul ref={listRef} className="divide-y divide-border border-y border-border">
        {achievements.map((a) => (
          <li key={a.name} className="flex flex-wrap items-baseline justify-between gap-2 py-5">
            <span className="font-display text-lg">{a.name}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {a.issuer} · {a.date}
              {a.url && <> · <a href={a.url} {...ext} className="text-primary hover:underline">Verify</a></>}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Contact Form (Card format, No subject box, No setup note)
// ─────────────────────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "success" | "error";

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) return;
    const v = Object.fromEntries(
      ["name", "email", "message"].map((k) => [k, String(fd.get(k) ?? "").trim()]),
    ) as Record<"name" | "email" | "message", string>;

    const errs: Partial<Record<"name" | "email" | "message", string>> = {};
    if (!v.name) errs["name"] = "Please enter your name.";
    if (!v.email) errs["email"] = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errs["email"] = "Please enter a valid email.";
    if (!v.message) errs["message"] = "Please write a message.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (!site.formEndpoint) {
      if (site.email) {
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Portfolio message")}&body=${encodeURIComponent(`${v.message}\n\n— ${v.name} (${v.email})`)}`;
      } else {
        setStatus("error");
      }
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      e.currentTarget?.reset();
    } catch {
      setStatus("error");
    }
  }

  const field = "mt-2 w-full rounded-md border border-input bg-transparent px-4 py-3 outline-none transition focus:border-primary";

  if (status === "success")
    return (
      <div role="status" className="rounded-lg border border-primary/50 p-8">
        <p className="font-display text-2xl">Message sent.</p>
        <p className="mt-2 text-muted-foreground">Thanks for reaching out — I'll reply soon.</p>
      </div>
    );

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              aria-invalid={!!errors["name"]}
              className={field}
            />
            {errors["name"] && <p className="mt-1 text-sm text-destructive">{errors["name"]}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              aria-invalid={!!errors["email"]}
              className={field}
            />
            {errors["email"] && <p className="mt-1 text-sm text-destructive">{errors["email"]}</p>}
          </div>
        </div>

        {/* Message (No subject box) */}
        <div>
          <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            aria-invalid={!!errors["message"]}
            className={field}
          />
          {errors["message"] && <p className="mt-1 text-sm text-destructive">{errors["message"]}</p>}
        </div>

        {status === "error" && (
          <p role="alert" className="text-sm text-destructive">
            Couldn't send the message. Please try again{site.email ? ` or email ${site.email} directly` : ""}.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"} <ArrowUpRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Socials (Round circular buttons)
// ─────────────────────────────────────────────────────────────────────────────

function Socials() {
  const [copied, setCopied] = useState(false);
  const handleCopyEmail = () => {
    if (!site.email) return;
    navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items = [
    { href: site.email && `mailto:${site.email}`, label: "Email", Icon: Mail },
    { href: site.phone && `tel:${site.phone}`, label: "Phone", Icon: Phone },
    { href: site.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: site.github, label: "GitHub", Icon: Github },
    { href: site.instagram, label: "Instagram", Icon: Instagram },
  ];

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    gsap.fromTo(
      Array.from(list.children),
      { opacity: 0, scale: 0.7, y: 12 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: EASES.spring,
        scrollTrigger: { trigger: list, start: "top 88%", toggleActions: "play none none none" },
      },
    );
    const cleanups = Array.from(list.querySelectorAll<HTMLElement>("a, span")).map((el) =>
      createMagneticEffect(el, 0.3),
    );
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="mt-8 rounded-xl border border-border bg-card/60 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Find me on</p>
        {site.email && (
          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition hover:text-primary cursor-pointer"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" />
                <span className="text-primary font-medium">Email copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy email</span>
              </>
            )}
          </button>
        )}
      </div>
      <ul ref={listRef} className="mt-4 flex flex-wrap gap-3">
        {items.map(({ href, label, Icon }) => (
          <li key={label}>
            {href ? (
              <a
                href={href}
                {...(label === "Email" || label === "Phone" ? {} : ext)}
                aria-label={label}
                title={label}
                className="social-icon flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary hover:shadow-glow"
              >
                <Icon className="h-5 w-5" />
              </a>
            ) : (
              <span
                aria-label={`${label} — to be added`}
                title={`${label} — to be added`}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground opacity-60"
              >
                <Icon className="h-5 w-5" />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Contact Section
// ─────────────────────────────────────────────────────────────────────────────

function Contact() {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;
    animateContactBlock(Array.from(block.children), block);
    const btn = block.querySelector<HTMLElement>(".magnetic-btn");
    if (btn) return createMagneticEffect(btn, 0.3);
    return undefined;
  }, []);

  return (
    <Section id="contact" label="Contact" title="Let’s build something great together.">
      <div ref={blockRef} className="grid gap-14 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            I’m actively looking for internship and entry-level opportunities in full stack and AI-driven development. If you’re hiring, I’d love to hear from you. I reply quickly, learn faster, and take pride in delivering work I can stand behind.
          </p>
        </div>
        <div>
          <ContactForm />
          <Socials />
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Footer
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const handleScroll = useSmoothScroll();

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    gsap.fromTo(footer, { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: EASES.expo,
      scrollTrigger: { trigger: footer, start: "top 95%", toggleActions: "play none none none" },
    });
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. Designed with intention. Built with curiosity.</p>
        <div className="flex items-center gap-5">
          {site.github && <a href={site.github} {...ext} aria-label="GitHub" className="hover:text-foreground"><Github className="h-4 w-4" /></a>}
          {site.linkedin && <a href={site.linkedin} {...ext} aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="h-4 w-4" /></a>}
          {site.email && <a href={`mailto:${site.email}`} aria-label="Email" className="hover:text-foreground"><Mail className="h-4 w-4" /></a>}
          {site.phone && <a href={`tel:${site.phone}`} aria-label="Phone" className="hover:text-foreground"><Phone className="h-4 w-4" /></a>}
          <a
            href="#top"
            onClick={(e) => handleScroll(e, "top")}
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Back to top <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Scroll Up Floating Button
// ─────────────────────────────────────────────────────────────────────────────

function ScrollUpButton() {
  const [visible, setVisible] = useState(false);
  const handleScroll = useSmoothScroll();

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > 350);
    };
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={(e) => handleScroll(e, "top")}
      aria-label="Scroll back to top"
      title="Back to top"
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/85 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-glow hover:-translate-y-1 animate-fade-down"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Cuberto-Inspired Cursor (Physics, Lerp, Velocity Stretch, Magnetic Snapping)
// ─────────────────────────────────────────────────────────────────────────────

function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      dot.style.display = "none";
      return;
    }

    const pos = {
      previous: { x: -100, y: -100 },
      current: { x: -100, y: -100 },
      target: { x: -100, y: -100 },
      lerpAmount: 0.15,
    };

    const scale = {
      previous: 1,
      current: 1,
      target: 1,
      lerpAmount: 0.15,
    };

    let isHovered = false;
    let hoverEl: HTMLElement | null = null;
    let rafId = 0;
    let isInside = false;

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Hide dot when close to viewport edges so it never renders as a clipped half circle
      if (x <= 4 || x >= window.innerWidth - 4 || y <= 4 || y >= window.innerHeight - 4) {
        if (isInside) {
          isInside = false;
          dot.style.opacity = "0";
        }
        return;
      }

      if (!isInside) {
        isInside = true;
        dot.style.opacity = "1";
      }

      if (isHovered && hoverEl) {
        const bounds = hoverEl.getBoundingClientRect();
        const cx = bounds.left + bounds.width / 2;
        const cy = bounds.top + bounds.height / 2;
        const dx = x - cx;
        const dy = y - cy;

        pos.target.x = cx + dx * 0.15;
        pos.target.y = cy + dy * 0.15;
        scale.target = 2.2;

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const distance = Math.sqrt(dx * dx + dy * dy) * 0.01;

        gsap.set(dot, { rotate: angle });
        gsap.to(dot, {
          scaleX: scale.target + Math.pow(Math.min(distance, 0.6), 3) * 3,
          scaleY: scale.target - Math.pow(Math.min(distance, 0.3), 3) * 3,
          duration: 0.5,
          ease: "power4.out",
          overwrite: true,
        });
      } else {
        pos.target.x = x;
        pos.target.y = y;
        scale.target = 1;
      }
    };

    const onMouseLeave = () => {
      isInside = false;
      dot.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isInside = true;
      dot.style.opacity = "1";
    };

    const update = () => {
      // Lerp position & scale
      pos.current.x += (pos.target.x - pos.current.x) * pos.lerpAmount;
      pos.current.y += (pos.target.y - pos.current.y) * pos.lerpAmount;

      scale.current += (scale.target - scale.current) * scale.lerpAmount;

      const deltaX = pos.current.x - pos.previous.x;
      const deltaY = pos.current.y - pos.previous.y;

      pos.previous.x = pos.current.x;
      pos.previous.y = pos.current.y;
      scale.previous = scale.current;

      gsap.set(dot, {
        x: pos.current.x,
        y: pos.current.y,
      });

      if (!isHovered) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.04;

        gsap.set(dot, {
          rotate: angle,
          scaleX: scale.current + Math.min(distance, 1.2),
          scaleY: scale.current - Math.min(distance, 0.35),
        });
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("blur", onMouseLeave);

    // Interactive Hover Listeners with Magnetic Elasticity
    const interactiveSelector = "a, button, [data-hover], .magnetic-btn, .nav-pill, .mode-switch";
    const cleanups: (() => void)[] = [];

    const setupListeners = () => {
      const targets = document.querySelectorAll<HTMLElement>(interactiveSelector);
      targets.forEach((target) => {
        const xTo = gsap.quickTo(target, "x", {
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
        });
        const yTo = gsap.quickTo(target, "y", {
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
        });

        const onOver = () => {
          isHovered = true;
          hoverEl = target;
        };

        const onMove = (evt: PointerEvent) => {
          const { clientX: cx, clientY: cy } = evt;
          const { height, width, left, top } = target.getBoundingClientRect();
          const ox = cx - (left + width / 2);
          const oy = cy - (top + height / 2);
          xTo(ox * 0.22);
          yTo(oy * 0.22);
        };

        const onOut = () => {
          xTo(0);
          yTo(0);
          isHovered = false;
          hoverEl = null;
        };

        target.addEventListener("pointerover", onOver);
        target.addEventListener("pointermove", onMove);
        target.addEventListener("pointerout", onOut);

        cleanups.push(() => {
          target.removeEventListener("pointerover", onOver);
          target.removeEventListener("pointermove", onMove);
          target.removeEventListener("pointerout", onOut);
        });
      });
    };

    setupListeners();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("blur", onMouseLeave);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" aria-hidden />;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Root App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("portfolio-preloaded") !== "true";
    }
    return true;
  });
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored !== "light";
      return !document.documentElement.classList.contains("light");
    }
    return true;
  });

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", next ? "dark" : "light");
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [dark]);

  useEffect(() => {
    return () => killAllScrollTriggers();
  }, []);

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div className={`${dark ? "dark" : "light"} relative min-h-screen font-sans text-foreground antialiased`}>
        <CursorDot />
        <Background kind="constellation" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <div className="relative z-10">
          <Header />
          <main id="main">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Achievements />
            <Contact />
          </main>
          <Footer />
          <ScrollUpButton />
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
