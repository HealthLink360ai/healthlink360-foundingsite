/* HealthLink360 — single-page site
   Black / white / magenta / purple brand
   Sections: Nav, Hero, Vision, How (BYOD), Value, Providers Stepper, Insights, Waitlist, Footer
*/

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "magenta",
  "heroVariant": "twin"
} /*EDITMODE-END*/;

const PALETTES = {
  magenta: { a: "#ff2bd6", b: "#a855f7", c: "#7c3aed", glow: "255,43,214" }, // brand magenta + purple
  teal: { a: "#22d3a8", b: "#5eead4", c: "#10b981", glow: "34,211,168" },
  blue: { a: "#3b82f6", b: "#22d3ee", c: "#a78bfa", glow: "59,130,246" },
  amber: { a: "#f59e0b", b: "#fb923c", c: "#fbbf24", glow: "245,158,11" }
};

const HERO_VARIANTS = [
{ id: "twin", label: "Digital Twin" },
{ id: "heart", label: "Heart" },
{ id: "constellation", label: "Constellation" },
{ id: "photo", label: "Photo" }];


/* ============== Hero visualisations ============== */

function TwinAvatar({ palette }) {
  // Particle-mesh profile face (looking right), inspired by reference image
  const t = React.useRef(0);
  const [, force] = React.useState(0);
  React.useEffect(() => {
    let raf;const tick = () => {t.current += 0.014;force((n) => n + 1);raf = requestAnimationFrame(tick);};
    raf = requestAnimationFrame(tick);return () => cancelAnimationFrame(raf);
  }, []);
  const phase = t.current;

  // Profile silhouette (right-facing). Hand-tuned bezier path for a feminine profile.
  // viewBox 0 0 400 600 — face occupies roughly y 80..520
  const profilePath = "M 130 540 \
    L 130 380 \
    C 130 350, 138 330, 158 318 \
    C 170 311, 180 304, 184 292 \
    C 188 280, 188 268, 184 258 \
    C 176 244, 168 232, 164 218 \
    C 158 198, 158 178, 168 158 \
    C 178 138, 198 124, 222 118 \
    C 250 112, 276 122, 290 138 \
    C 304 154, 308 174, 304 194 \
    C 302 206, 298 216, 296 224 \
    C 298 224, 304 226, 308 232 \
    C 314 240, 318 252, 316 262 \
    C 314 270, 308 274, 300 274 \
    C 298 278, 296 286, 294 296 \
    C 290 312, 282 320, 270 322 \
    C 266 334, 258 342, 246 346 \
    L 246 360 \
    C 246 372, 252 380, 264 386 \
    L 290 396 \
    C 308 404, 318 416, 318 432 \
    L 318 540 \
    Z";



























































































































































  // Build particles: dense along the silhouette outline, scattered inside,
  // sparse halo outside. Memoized so they don't re-randomize each frame.
  const particles = React.useMemo(() => {
    const out = [];
    // Outline points (dense, bright)
    const outlinePts = [
    // forehead curve
    [222, 118], [210, 121], [198, 127], [188, 135], [178, 148], [172, 162], [170, 178],
    // brow / temple
    [172, 192], [176, 206], [180, 218],
    // bridge of nose
    [185, 228], [182, 240], [180, 252],
    // nose tip area
    [183, 260], [190, 266], [202, 268], [214, 266], [222, 262],
    // nostril / philtrum
    [218, 272], [210, 280], [198, 286], [188, 290],
    // upper lip
    [184, 298], [190, 302], [202, 304], [214, 303], [224, 300],
    // lower lip
    [220, 312], [208, 316], [196, 316], [186, 312],
    // chin
    [180, 322], [176, 332], [174, 344], [178, 354],
    // jawline
    [186, 360], [196, 365], [208, 368], [220, 366], [234, 358], [246, 346],
    // neck front
    [248, 360], [250, 374], [252, 388], [254, 402],
    // back of head
    [292, 138], [306, 156], [314, 178], [316, 200], [314, 222], [310, 242],
    // back skull / hair line
    [302, 260], [294, 278], [286, 294], [278, 308], [270, 322],
    // back of neck
    [266, 338], [270, 358], [278, 378], [286, 396], [296, 412]];

    outlinePts.forEach(([x, y], i) => {
      out.push({ x, y, r: 1.4 + i % 4 * 0.3, ph: i * 0.7, brightness: 1.0 });
    });

    // Interior fill (mesh look) — sample inside silhouette bounds
    // Use seeded pseudo-random so memo is stable across rerenders
    let seed = 1;
    const rand = () => {seed = (seed * 9301 + 49297) % 233280;return seed / 233280;};
    for (let i = 0; i < 280; i++) {
      // Constrain to face area roughly
      const x = 175 + rand() * 145;
      const y = 130 + rand() * 280;
      // Skip if clearly outside (above forehead curve or below jaw)
      if (y < 130 + Math.abs(x - 240) * 0.6) continue;
      out.push({ x, y, r: 0.6 + rand() * 1.4, ph: rand() * 6.28, brightness: 0.55 + rand() * 0.4 });
    }

    // Halo / dust (outside silhouette, sparse)
    for (let i = 0; i < 80; i++) {
      const a = rand() * Math.PI * 2;
      const r = 150 + rand() * 110;
      const x = 230 + Math.cos(a) * r * 0.9;
      const y = 280 + Math.sin(a) * r;
      out.push({ x, y, r: 0.5 + rand() * 0.9, ph: rand() * 6.28, brightness: 0.25 + rand() * 0.3, halo: true });
    }
    return out;
  }, []);

  // Connecting lines between nearby outline points (mesh feel)
  const meshLines = React.useMemo(() => {
    const lines = [];
    const pts = particles.filter((p) => !p.halo && p.brightness > 0.7);
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 38) lines.push([pts[i], pts[j], d]);
      }
    }
    return lines.slice(0, 220); // cap
  }, [particles]);

  const breathe = 1 + Math.sin(phase * 0.8) * 0.008;

  return (
    <svg viewBox="0 0 400 600" className="hl-twin-svg" style={{ transform: `scale(${breathe})` }}>
      <defs>
        <radialGradient id="twinGlow" cx="60%" cy="48%" r="55%">
          <stop offset="0%" stopColor={palette.a} stopOpacity="0.50" />
          <stop offset="50%" stopColor={palette.b} stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="twinFill" cx="55%" cy="40%" r="60%">
          <stop offset="0%" stopColor={palette.b} stopOpacity="0.35" />
          <stop offset="60%" stopColor={palette.a} stopOpacity="0.18" />
          <stop offset="100%" stopColor={palette.c} stopOpacity="0.05" />
        </radialGradient>
        <filter id="twinSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="twinBloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* aura / halo glow */}
      <ellipse cx="240" cy="290" rx="220" ry="260" fill="url(#twinGlow)" />

      {/* faint silhouette fill behind particles */}
      <path d={profilePath} fill="url(#twinFill)" opacity="0.55" />
      <path d={profilePath} fill="none" stroke={palette.a} strokeOpacity="0.18" strokeWidth="0.8" />

      {/* mesh connecting lines (soft) */}
      <g filter="url(#twinBloom)">
        {meshLines.map(([a, b, d], i) =>
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={palette.b}
        strokeOpacity={0.18 * (1 - d / 38) * (0.6 + 0.4 * Math.sin(phase + i * 0.3))}
        strokeWidth="0.5" />
        )}
      </g>

      {/* particle cloud */}
      <g>
        {particles.map((p, i) => {
          const pulse = 0.5 + 0.5 * Math.sin(phase * 1.6 + p.ph);
          const op = p.brightness * (0.5 + pulse * 0.5);
          const radius = p.r * (0.85 + pulse * 0.3);
          return (
            <g key={i}>
              {p.brightness > 0.7 &&
              <circle cx={p.x} cy={p.y} r={radius * 3} fill={palette.a} opacity={op * 0.18} />
              }
              <circle cx={p.x} cy={p.y} r={radius} fill={p.brightness > 0.8 ? "#fff" : palette.b} opacity={op} />
            </g>);

        })}
      </g>

      {/* drifting glow at temple (the "spark" point in the reference) */}
      <g>
        <circle cx={200 + Math.sin(phase * 0.7) * 4} cy={170} r="14" fill={palette.a} opacity="0.25" />
        <circle cx={200} cy={170} r="3" fill="#fff" />
      </g>

      {/* subtle scan-sweep */}
      <rect x="0" y={120 + phase * 22 % 320} width="400" height="2"
      fill={palette.a} opacity="0.18" />

      {/* podium reflection */}
      <ellipse cx="240" cy="555" rx="110" ry="12" fill={palette.a} opacity="0.18" filter="url(#twinSoft)" />

      {/* floating data labels */}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" fill="#fff">
        <text x="40" y="160" opacity="0.85"><tspan fill={palette.b}>HRV</tspan>  68 ms</text>
        <text x="40" y="178" opacity="0.55">↑ trending</text>
        <text x="40" y="320" opacity="0.85"><tspan fill={palette.b}>VO₂</tspan>  42.1</text>
        <text x="40" y="430" opacity="0.85"><tspan fill={palette.b}>SLEEP</tspan> 7h 12m</text>
        <text x="40" y="448" opacity="0.55">deep 1h 48m</text>
        <text x="335" y="220" textAnchor="end" opacity="0.85"><tspan fill={palette.b}>GLUC</tspan> 92 mg/dL</text>
        <text x="350" y="500" textAnchor="end" opacity="0.55">cohort: stable</text>
      </g>
    </svg>);

}

function HeartViz({ palette }) {
  const t = React.useRef(0);
  const [, force] = React.useState(0);
  React.useEffect(() => {
    let raf;const tick = () => {t.current += 0.02;force((n) => n + 1);raf = requestAnimationFrame(tick);};
    raf = requestAnimationFrame(tick);return () => cancelAnimationFrame(raf);
  }, []);
  const beat = 0.5 + 0.5 * Math.abs(Math.sin(t.current * 2));
  return (
    <svg viewBox="0 0 400 600" className="hl-twin-svg">
      <defs>
        <radialGradient id="hg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={palette.a} stopOpacity="0.7" />
          <stop offset="60%" stopColor={palette.b} stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="300" rx="220" ry="260" fill="url(#hg)" />
      <g style={{ transform: `translate(200px,300px) scale(${1 + beat * 0.06}) translate(-200px,-300px)` }}>
        <path d="M200 200 C 160 150, 90 160, 90 230 C 90 300, 200 380, 200 380 C 200 380, 310 300, 310 230 C 310 160, 240 150, 200 200 Z"
        fill="none" stroke={palette.a} strokeWidth="2" />
        <path d="M200 200 C 160 150, 90 160, 90 230 C 90 300, 200 380, 200 380 C 200 380, 310 300, 310 230 C 310 160, 240 150, 200 200 Z"
        fill={palette.a} opacity="0.12" />
        {Array.from({ length: 30 }).map((_, i) => {
          const a = i / 30 * Math.PI * 2;
          const x = 200 + Math.cos(a) * (60 + Math.sin(t.current + i) * 8);
          const y = 270 + Math.sin(a) * (50 + Math.cos(t.current + i) * 8);
          return <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity={0.3 + Math.abs(Math.sin(t.current + i)) * 0.6} />;
        })}
        <circle cx="200" cy="285" r={18 + beat * 8} fill={palette.a} opacity="0.18" />
        <circle cx="200" cy="285" r={6 + beat * 3} fill="#fff" />
      </g>
      <ellipse cx="200" cy="560" rx="120" ry="12" fill={palette.a} opacity="0.25" />
    </svg>);

}

function Constellation({ palette }) {
  const t = React.useRef(0);
  const [, force] = React.useState(0);
  React.useEffect(() => {
    let raf;const tick = () => {t.current += 0.01;force((n) => n + 1);raf = requestAnimationFrame(tick);};raf = requestAnimationFrame(tick);return () => cancelAnimationFrame(raf);
  }, []);
  const N = 60;
  const nodes = React.useMemo(() => Array.from({ length: N }, (_, i) => ({
    x: 60 + Math.random() * 280, y: 80 + Math.random() * 440, r: 1 + Math.random() * 2.4, ph: Math.random() * Math.PI * 2
  })), []);
  return (
    <svg viewBox="0 0 400 600" className="hl-twin-svg">
      <defs><radialGradient id="cg" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor={palette.a} stopOpacity="0.45" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </radialGradient></defs>
      <ellipse cx="200" cy="300" rx="220" ry="260" fill="url(#cg)" />
      {nodes.map((n, i) =>
      nodes.slice(i + 1).map((m, j) => {
        const d = Math.hypot(n.x - m.x, n.y - m.y);
        if (d > 90) return null;
        return <line key={i + "-" + j} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke={palette.b} strokeOpacity={0.18 * (1 - d / 90)} strokeWidth="0.6" />;
      })
      )}
      {nodes.map((n, i) => {
        const p = 0.4 + 0.6 * Math.abs(Math.sin(t.current + n.ph));
        return <g key={i}><circle cx={n.x} cy={n.y} r={n.r * 2} fill={palette.a} opacity={0.15 * p} />
        <circle cx={n.x} cy={n.y} r={n.r} fill="#fff" opacity={p} /></g>;
      })}
    </svg>);

}

function PhotoHero({ palette }) {
  return (
    <svg viewBox="0 0 400 600" className="hl-twin-svg">
      <defs>
        <pattern id="ph" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(35)">
          <rect width="14" height="14" fill="#0c0a14" />
          <line x1="0" y1="0" x2="0" y2="14" stroke={palette.a} strokeOpacity="0.18" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect x="40" y="40" width="320" height="520" rx="28" fill="url(#ph)" />
      <rect x="40" y="40" width="320" height="520" rx="28" fill="none" stroke={palette.a} strokeOpacity="0.5" strokeWidth="1.5" />
      <text x="200" y="295" textAnchor="middle" fill="#fff" opacity="0.55" fontFamily="ui-monospace,monospace" fontSize="12">[ portrait — diverse subjects ]</text>
      <text x="200" y="315" textAnchor="middle" fill="#fff" opacity="0.35" fontFamily="ui-monospace,monospace" fontSize="10">drop hero photography here</text>
    </svg>);

}

function HeroViz({ variant, palette }) {
  if (variant === "heart") return <HeartViz palette={palette} />;
  if (variant === "constellation") return <Constellation palette={palette} />;
  if (variant === "photo") return <PhotoHero palette={palette} />;
  return <TwinAvatar palette={palette} />;
}

/* ============== Misc helpers ============== */

function useInView(opts = { threshold: 0.2 }) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;if (!el) return;
    const io = new IntersectionObserver(([e]) => {if (e.isIntersecting) setSeen(true);}, opts);
    io.observe(el);return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function Reveal({ children, delay = 0, as: Tag = "div", className = "", style }) {
  const [ref, seen] = useInView();
  return <Tag ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</Tag>;
}

/* ============== Sections ============== */

function Logo({ variant = "nav" }) {
  return (
    <a href="#top" className={`hl-logo hl-logo-${variant}`} aria-label="HealthLink360 AI">
      <img src="assets/logo.png" alt="HealthLink360 AI" style={{ objectFit: "cover", padding: "25px 0px 0px" }} />
    </a>);

}

function Nav({ onWaitlist }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onS);return () => window.removeEventListener("scroll", onS);
  }, []);
  return (
    <nav className={`hl-nav ${scrolled ? "scrolled" : ""}`}>
      <Logo />
      <ul>
        <li><a href="#foryou"></a></li>
      </ul>
      <button className="hl-cta" onClick={onWaitlist}>Join Waitlist <span>→</span></button>
    </nav>);

}

function FilamentGlow({ palette }) {
  // Soft, light filament — abstract organic shape (the "innovation" hint next to the person)
  const t = React.useRef(0);
  const [, force] = React.useState(0);
  React.useEffect(() => {
    let raf;const tick = () => {t.current += 0.008;force((n) => n + 1);raf = requestAnimationFrame(tick);};
    raf = requestAnimationFrame(tick);return () => cancelAnimationFrame(raf);
  }, []);
  const phase = t.current;
  const lines = 28;
  return (
    <svg viewBox="0 0 400 400" className="hl-filament">
      <defs>
        <radialGradient id="filGlow" cx="55%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="40%" stopColor={palette.b} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="filBlur"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>
      <ellipse cx="220" cy="180" rx="170" ry="160" fill="url(#filGlow)" />
      <g filter="url(#filBlur)" stroke="#fff" fill="none" strokeWidth="0.6">
        {Array.from({ length: lines }).map((_, i) => {
          const o = i / lines;
          const cy = 180 + Math.sin(phase + i * 0.2) * 4;
          const r = 60 + o * 110;
          return (
            <ellipse key={i} cx="220" cy={cy} rx={r} ry={r * 0.85}
            strokeOpacity={0.65 - o * 0.55}
            transform={`rotate(${10 + Math.sin(phase * 0.5 + i * 0.1) * 4} 220 ${cy})`} />);

        })}
      </g>
      <g stroke={palette.a} fill="none" strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = phase * 0.3 + i * (Math.PI * 2 / 12);
          return <line key={i} x1="220" y1="180" x2={220 + Math.cos(a) * 150} y2={180 + Math.sin(a) * 150} strokeOpacity={0.15 + 0.1 * Math.sin(phase * 1.5 + i)} />;
        })}
      </g>
    </svg>);

}

function Hero({ palette, onWaitlist }) {
  return (
    <header id="top" className="hl-hero">
      <div className="hl-hero-bg">
        <video className="hl-hero-video"
        src="assets/hero.mp4"
        autoPlay loop muted playsInline preload="auto"
        aria-hidden="true"></video>
        <FilamentGlow palette={palette} />
        <div className="hl-hero-scrim"></div>
      </div>

      <div className="hl-hero-inner over">
        <div className="hl-hero-copy">
          <Reveal as="div" className="hl-eyebrow">
            <span className="dot"></span> Culturally intelligent · Digital Twin technology
          </Reveal>
          <Reveal as="h1" delay={80} className="hl-headline">
            Prevent disease<br />
            <span className="grad">before it starts.</span>
          </Reveal>
          <Reveal as="p" delay={160} className="hl-sub">
            HealthLink360 builds a Digital Twin from your health data, such as biometrics, labs and medical history.
            We then guide you with weekly plans that fit your culture, your routines and your real life. Help us train the new model of preventative care.{" "}
          </Reveal>
          <Reveal as="div" delay={240} className="hl-hero-actions">
            <button className="hl-cta lg" onClick={onWaitlist}>Join the Waitlist <span>→</span></button>
          </Reveal>
          <Reveal as="div" delay={340} className="hl-stats">
            <div><b>400+</b><span>data ingestion points</span></div>
            <div className="sep"></div>
            <div><b>93%</b><span>retention in pilots</span></div>
            <div className="sep"></div>
            <div><b>21d</b><span>to first measurable change</span></div>
          </Reveal>
        </div>

        <div className="hl-hero-floats">
          <div className="hl-floater f1 light">
            <div className="ttl">Coach360</div>
            <div className="msg">Your sleep is up 12% this week, let's protect it.</div>
          </div>
          <div className="hl-floater f2 light">
            <div className="ttl">Twin Score</div>
            <div className="num">86<i>%</i></div>
            <div className="bar"><span style={{ width: "86%" }}></span></div>
          </div>
        </div>
      </div>
    </header>);

}

/* Dedicated Twin section (moved from hero) */
function TwinSection({ heroVariant, palette }) {
  return (
    <section id="twin" className="hl-twin-section">
      <div className="hl-section-inner">
        <div className="hl-twin-grid">
          <div className="hl-twin-copy">
            <Reveal as="div" className="hl-kicker light" style={{ fontFamily: "\"Inter Tight\"" }}>YOUR DIGITAL TWIN</Reveal>
            <Reveal as="h2" delay={80} className="hl-h2 light">A living model of you, updated every signal.</Reveal>
            <Reveal as="p" delay={160} className="hl-lede light">
              We translate biometrics, labs and history into a single Twin Score.
              It learns what is yours, your culture, your rhythms, your range of normal,
              and surfaces what changed, why it matters, and the next right move.
            </Reveal>
            <Reveal delay={240} className="hl-twin-tags">
              <span>HRV</span><span>Sleep</span><span>VO₂</span>
              <span>Glucose</span><span>SDOH</span><span>PGx</span>
            </Reveal>
          </div>
          <div className="hl-twin-stage">
            <HeroViz variant={heroVariant} palette={palette} />
            <div className="hl-floater f3 abs">
              <div className="ttl">Next best action</div>
              <div className="msg">10-min walk after dinner · 7:45 PM</div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function Vision() {
  return (
    <section id="foryou" className="hl-vision">
      <div className="hl-section-inner" style={{ fontFamily: "\"Inter Tight\"" }}>
        <Reveal as="div" className="hl-kicker">FOR YOU</Reveal>
        <Reveal as="h2" delay={80} className="hl-h2">We see you.</Reveal>
        <Reveal as="p" delay={160} className="hl-lede">
          HealthLink360 meets you where you are, not where a textbook thinks you should be.
          We build a Digital Twin from your biometrics, labs and health history to create a
          weekly plan that fits your culture, routines and real life, with Coach360 support
          and a path to care when you need backup.
        </Reveal>

        <div className="hl-vision-grid">
          <Reveal className="card">
            <div className="num" style={{ fontFamily: "Inter Tight" }}>01</div>
            <h3>Culture + tech, never generic</h3>
            <p>Sync wearable and device data, sleep, activity, heart-rate trends, recovery, in one tap.</p>
          </Reveal>
          <Reveal className="card" delay={100}>
            <div className="num" style={{ fontFamily: "Inter Tight" }}>02</div>
            <h3>The data already exists</h3>
            <p>Wearables, labs and patient input are everywhere. Care teams just lack a way to turn them into precise, timely decisions. Until now.</p>
          </Reveal>
          <Reveal className="card" delay={200}>
            <div className="num" style={{ fontFamily: "system-ui" }}>03</div>
            <h3>From insight to action</h3>
            <p>No confusing dashboards. Just three to five clear priorities and the next best action for this week.</p>
          </Reveal>
        </div>
      </div>
    </section>);

}

function HowItWorks() {
  const steps = [
  { t: "Connect your signals", d: "Sync wearable and device data, sleep, activity, heart-rate trends, recovery, in one tap.", icon: "sync" },
  { t: "Get a weekly snapshot", d: "A simple weekly view shows what is improving and what needs attention. No graph-reading required.", icon: "chart" },
  { t: "Coach360 guides you", d: "Personalized nudges, check-ins and habit tracking keep you consistent, without the guilt loop.", icon: "spark" },
  { t: "Connect to care", d: "When you need more guidance, we route you to the right next step: coach, clinician, community program or telehealth.", icon: "route" }];

  const Icon = ({ k }) => {
    if (k === "sync") return <svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5M18 4v4h-4M6 20v-4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    if (k === "chart") return <svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M8 15l3-4 3 3 4-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    if (k === "spark") return <svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
    return <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 8c-1 1.5-1.5 3-1 5M19 8c1 1.5 1.5 3 1 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  };
  return (
    <section className="hl-how">
      <div className="hl-section-inner">
        <Reveal as="div" className="hl-kicker">BRING YOUR OWN DEVICE</Reveal>
        <Reveal as="h2" delay={80} className="hl-h2">Four steps to a plan that actually fits.</Reveal>

        <div className="hl-how-track">
          <div className="hl-how-line"><span></span></div>
          {steps.map((s, i) =>
          <Reveal key={i} delay={i * 120} className="hl-how-step">
              <div className="hl-how-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="hl-how-icon"><Icon k={s.icon} /></div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

function Value() {
  const items = [
  { t: "Personalized insights, not data chaos", d: "We turn your biometrics into a short weekly summary: what changed, why it matters, what to do next." },
  { t: "A weekly body briefing you can use", d: "Three to five clear priorities. Sleep, movement, stress, nutrition and the next best action for the week." },
  { t: "No confusing dashboards", d: "HealthLink360 translates your trends into simple steps you can follow in real life." },
  { t: "Insight + coaching, in one place", d: "Coach360 explains your trends, then guides you with small nudges so you are not left guessing." }];

  return (
    <section className="hl-value">
      <div className="hl-section-inner">
        <Reveal as="div" className="hl-kicker">WHAT YOU GET</Reveal>
        <Reveal as="h2" delay={80} className="hl-h2">Less noise. More next-right-move.</Reveal>
        <div className="hl-value-grid">
          {items.map((it, i) =>
          <Reveal key={i} delay={i * 100} className="hl-value-card">
              <div className="hl-value-mark">＋</div>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
              <div className="hl-value-glow"></div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

function Providers() {
  const steps = [
  { t: "Identify", d: "Digital Twin + biometrics flag early metabolic drift across your panel — before the next visit.",
    vis: "identify" },
  { t: "Personalize", d: "If pharmacogenomics exist, we surface clinician-review considerations. If not, proceed with standard pathways.",
    vis: "personalize" },
  { t: "Make it doable", d: "An SDOH screen flags barriers and suggests feasible alternatives the patient can actually follow.",
    vis: "doable" },
  { t: "Activate", d: "Food-as-Medicine plan plus Coach360 adherence support — between visits, in the patient's life.",
    vis: "activate" },
  { t: "Verify", d: "Biometrics confirm whether interventions are working, and who needs outreach this week.",
    vis: "verify" }];

  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 5200);
    return () => clearInterval(id);
  }, []);

  const Vis = ({ k }) => {
    if (k === "identify") return (
      <svg viewBox="0 0 360 220"><defs><linearGradient id="vg1" x1="0" x2="1"><stop offset="0" stopColor="var(--c-a)" /><stop offset="1" stopColor="var(--c-b)" /></linearGradient></defs>
        <path d="M10 170 Q 60 140 90 150 T 160 110 T 230 130 T 310 60 T 350 80" fill="none" stroke="url(#vg1)" strokeWidth="2" />
        <circle cx="230" cy="130" r="6" fill="var(--c-a)" />
        <circle cx="230" cy="130" r="14" fill="none" stroke="var(--c-a)" opacity=".5" />
        <text x="246" y="124" fill="#fff" fontSize="11" fontFamily="ui-monospace,monospace">↑ drift detected</text>
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={20 + i * 44} y1="190" x2={20 + i * 44} y2="200" stroke="#fff3" strokeWidth="1" />)}
      </svg>);

    if (k === "personalize") return (
      <svg viewBox="0 0 360 220">
        <g fontFamily="ui-monospace,monospace" fontSize="10" fill="#fff">
          {[
          ["CYP2C19", "*1/*2", "consider"],
          ["CYP2D6", "*1/*1", "standard"],
          ["SLCO1B1", "*1/*5", "review"],
          ["VKORC1", "AG", "consider"]].
          map((row, i) =>
          <g key={i} transform={`translate(20 ${30 + i * 38})`}>
              <rect width="320" height="28" rx="6" fill="#ffffff08" stroke="#ffffff15" />
              <text x="14" y="18">{row[0]}</text>
              <text x="120" y="18" opacity=".7">{row[1]}</text>
              <rect x="220" y="6" width="86" height="16" rx="8" fill={row[2] === "standard" ? "#22c55e22" : "var(--c-a)"} opacity=".35" />
              <text x="263" y="18" textAnchor="middle" fill="#fff">{row[2]}</text>
            </g>
          )}
        </g>
      </svg>);

    if (k === "doable") return (
      <svg viewBox="0 0 360 220">
        {["Transit", "Childcare", "Food access", "Cost"].map((b, i) => {
          const flagged = i === 2 || i === 0;
          return <g key={i} transform={`translate(${20 + i * 84} 60)`}>
            <rect width="72" height="100" rx="14" fill={flagged ? "var(--c-a)" : "#ffffff10"} opacity={flagged ? ".25" : "1"} stroke={flagged ? "var(--c-a)" : "#ffffff20"} />
            <text x="36" y="56" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="ui-monospace,monospace">{b}</text>
            <text x="36" y="74" textAnchor="middle" fill={flagged ? "var(--c-a)" : "#fff8"} fontSize="9" fontFamily="ui-monospace,monospace">{flagged ? "BARRIER" : "ok"}</text>
          </g>;
        })}
        <text x="180" y="190" textAnchor="middle" fill="#fff" opacity=".7" fontSize="11" fontFamily="ui-monospace,monospace">→ alternative plan suggested</text>
      </svg>);

    if (k === "activate") return (
      <svg viewBox="0 0 360 220">
        {Array.from({ length: 7 }).map((_, i) => {
          const h = 30 + (i * 13 + i % 3 * 8);
          return <g key={i} transform={`translate(${30 + i * 44} ${180 - h})`}>
            <rect width="28" height={h} rx="6" fill="var(--c-a)" opacity={.2 + i * .1} />
            <text x="14" y={h + 18} textAnchor="middle" fill="#fff8" fontSize="10" fontFamily="ui-monospace,monospace">{["M", "T", "W", "T", "F", "S", "S"][i]}</text>
          </g>;
        })}
        <text x="20" y="30" fill="#fff" fontSize="11" fontFamily="ui-monospace,monospace">Coach360 adherence ↑</text>
      </svg>);

    return (// verify
      <svg viewBox="0 0 360 220">
        <circle cx="180" cy="110" r="60" fill="none" stroke="#ffffff15" strokeWidth="14" />
        <circle cx="180" cy="110" r="60" fill="none" stroke="var(--c-a)" strokeWidth="14" strokeDasharray="377" strokeDashoffset="80" strokeLinecap="round" transform="rotate(-90 180 110)" />
        <text x="180" y="106" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="700">79%</text>
        <text x="180" y="126" textAnchor="middle" fill="#fff8" fontSize="11" fontFamily="ui-monospace,monospace">improving</text>
        <text x="180" y="200" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="ui-monospace,monospace">21% need outreach this week</text>
      </svg>);

  };

  return (
    <section id="providers" className="hl-providers">
      <div className="hl-section-inner">
        <div className="hl-providers-head">
          <div>
            <Reveal as="div" className="hl-kicker light">FOR PROVIDERS</Reveal>
            <Reveal as="h2" delay={80} className="hl-h2 light">Preventive visibility between visits, without the staff burden.</Reveal>
            <Reveal as="p" delay={160} className="hl-lede light">
              HealthLink360 turns everyday signals into provider-ready insights so your team
              detects early-risk patterns sooner and guides action — without living in spreadsheets.
            </Reveal>
            <Reveal delay={220}>
              <button className="hl-cta lg light">Schedule a Demo <span>→</span></button>
            </Reveal>
          </div>
        </div>

        <div className="hl-stepper">
          <div className="hl-stepper-rail">
            {steps.map((s, i) =>
            <button key={i} className={`hl-step-tab ${active === i ? "on" : ""}`} onClick={() => setActive(i)}>
                <span className="n">0{i + 1}</span>
                <span className="t">{s.t}</span>
                <span className="bar"></span>
              </button>
            )}
          </div>
          <div className="hl-stepper-stage">
            <div className="hl-stepper-vis">
              <Vis k={steps[active].vis} />
            </div>
            <div className="hl-stepper-copy">
              <div className="hl-stepper-num">Step {active + 1} / {steps.length}</div>
              <h3>{steps[active].t}</h3>
              <p>{steps[active].d}</p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function Insights() {
  const tiles = [
  { tag: "INSIGHT", t: "Why generic plans fail Black women in midlife", d: "Cardiometabolic drift hides behind 'normal' labs. Twin Score finds it 14 months earlier on average." },
  { tag: "PILOT", t: "Inside our FQHC pilot in the Mid-South", d: "How four clinicians used Coach360 to lift adherence from 41% to 73% in eight weeks." },
  { tag: "SCIENCE", t: "Digital Twin, in plain English", d: "What it is, what it isn't, and why the model only matters if it changes what you do tomorrow." }];

  return (
    <section id="insights" className="hl-insights">
      <div className="hl-section-inner">
        <Reveal as="div" className="hl-kicker">INSIGHTS</Reveal>
        <Reveal as="h2" delay={80} className="hl-h2">Field notes from the work.</Reveal>
        <div className="hl-insights-grid">
          {tiles.map((t, i) =>
          <Reveal key={i} delay={i * 100} className="hl-insight-card">
              <div className="hl-insight-img">
                <svg viewBox="0 0 200 120" preserveAspectRatio="none">
                  <defs><pattern id={`ip${i}`} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform={`rotate(${30 + i * 15})`}>
                    <line x1="0" y1="0" x2="0" y2="8" stroke="var(--c-a)" strokeOpacity="0.35" />
                  </pattern></defs>
                  <rect width="200" height="120" fill={`var(--bg-tile-${i % 3})`} />
                  <rect width="200" height="120" fill={`url(#ip${i})`} />
                </svg>
              </div>
              <div className="hl-insight-body">
                <div className="tag">{t.tag}</div>
                <h3>{t.t}</h3>
                <p>{t.d}</p>
                <div className="rd">Read more →</div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

function Waitlist() {
  return (
    <section id="waitlist" className="hl-waitlist">
      <div className="hl-section-inner">
        <div className="hl-waitlist-card">
          <div className="hl-wl-bg"></div>
          <div className="hl-wl-inner">
            <Reveal as="div" className="hl-kicker">JOIN THE WAITLIST</Reveal>
            <Reveal as="h2" delay={80} className="hl-h2">Be first when HealthLink360 opens.</Reveal>
            <Reveal as="p" delay={160} className="hl-lede">
              Reserve your spot in the founding cohort for $80 (was $100). Founding members
              get priority access and a lifetime price lock.
            </Reveal>
            <Reveal delay={220} className="hl-wl-cta-wrap">
              <a href="waitlist.html" className="hl-cta lg">Reserve my spot <span>→</span></a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>);

}

function Footer() {
  return (
    <footer className="hl-footer">
      <div className="hl-section-inner">
        <div className="hl-foot-grid">
          <div>
            <Logo variant="footer" />
            <p className="hl-foot-mission">A culturally intelligent personal wellness assistant. Agentic AI + Digital Twin technology to prevent disease.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul><li><a href="#foryou">For You</a></li></ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul><li><a href="#waitlist">Waitlist</a></li><li><a href="mailto:info@healthlink360.ai">Contact</a></li></ul>
          </div>
          <div>
            <h4>Reach us</h4>
            <p><a href="mailto:info@healthlink360.ai">info@healthlink360.ai</a></p>
          </div>
        </div>
        <div className="hl-foot-base">
          <span style={{ fontFamily: "-apple-system" }}>© 2026 HealthLink360, Inc.</span>
          <span>HIPAA aware · SOC 2 in progress</span>
        </div>
      </div>
    </footer>);

}

/* ============== App ============== */

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[t.palette] || PALETTES.magenta;

  // expose CSS vars
  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--c-a", palette.a);
    r.setProperty("--c-b", palette.b);
    r.setProperty("--c-c", palette.c);
    r.setProperty("--c-glow", palette.glow);
  }, [t.palette]);

  const goWaitlist = () => { window.location.href = "waitlist.html"; };

  return (
    <div className="hl-root">
      <Nav onWaitlist={goWaitlist} />
      <Hero palette={palette} onWaitlist={goWaitlist} />
      <Vision />
      <TwinSection heroVariant={t.heroVariant} palette={palette} />
      <HowItWorks />
      <Value />
      <Waitlist />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakColor label="Brand" value={[palette.a, palette.b, palette.c]}
          options={[
          ["#ff2bd6", "#a855f7", "#7c3aed"],
          ["#22d3a8", "#5eead4", "#10b981"],
          ["#3b82f6", "#22d3ee", "#a78bfa"],
          ["#f59e0b", "#fb923c", "#fbbf24"]]
          }
          onChange={(v) => {
            const map = { "#ff2bd6": "magenta", "#22d3a8": "teal", "#3b82f6": "blue", "#f59e0b": "amber" };
            const key = Array.isArray(v) ? map[v[0]] : map[v];
            setTweak("palette", key || "magenta");
          }} />
          
        </TweakSection>
        <TweakSection label="Hero centerpiece">
          <TweakRadio label="Variant" value={t.heroVariant}
          options={HERO_VARIANTS.map((h) => h.id)}
          onChange={(v) => setTweak("heroVariant", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);