/* HealthLink360: single-page site
   Black / white / magenta / purple brand
   Sections: Nav, Hero, Problem, Seasons, Companion, Care-teams bridge, Trust & Proof (with CTA), Footer
*/

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "magenta"
} /*EDITMODE-END*/;

const PALETTES = {
  magenta: { a: "#ff2bd6", b: "#a855f7", c: "#7c3aed", glow: "255,43,214" }, // brand magenta + purple
  teal: { a: "#22d3a8", b: "#5eead4", c: "#10b981", glow: "34,211,168" },
  blue: { a: "#3b82f6", b: "#22d3ee", c: "#a78bfa", glow: "59,130,246" },
  amber: { a: "#f59e0b", b: "#fb923c", c: "#fbbf24", glow: "245,158,11" }
};

/* ============== Icons (shared, minimal line-icon style) ============== */

function MiniIcon({ k }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
  if (k === "stethoscope") return <svg viewBox="0 0 24 24"><path {...common} d="M6 3v6a3 3 0 006 0V3M16 3v6a3 3 0 006 0V3M9 13v2a6 6 0 0012 0v-2" /><circle cx="20" cy="19" r="2" {...common} /></svg>;
  if (k === "utensils") return <svg viewBox="0 0 24 24"><path {...common} d="M7 2v8a2 2 0 004 0V2M9 10v12M17 2c-2 0-3 2-3 5s1 5 3 5M17 2v20" /></svg>;
  if (k === "footprints") return <svg viewBox="0 0 24 24"><ellipse cx="8" cy="16" rx="3" ry="4.4" fill="currentColor" transform="rotate(-14 8 16)" /><ellipse cx="16" cy="9" rx="3" ry="4.4" fill="currentColor" transform="rotate(14 16 9)" /></svg>;
  if (k === "moon") return <svg viewBox="0 0 24 24"><path {...common} d="M20 14.5A8 8 0 119.5 4a6.5 6.5 0 1010.5 10.5z" /></svg>;
  if (k === "heartpulse") return <svg viewBox="0 0 24 24"><path {...common} d="M3 12h4l2-5 4 9 2-4h6" /></svg>;
  if (k === "shield") return <svg viewBox="0 0 24 24"><path {...common} d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z" /><path {...common} d="M9 12l2 2 4-4" /></svg>;
  if (k === "search") return <svg viewBox="0 0 24 24"><path {...common} d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h9M14 3l5 5M14 3v5h5" /><circle cx="11" cy="14" r="2.4" {...common} /><path {...common} d="M13 16l2 2" /></svg>;
  if (k === "home") return <svg viewBox="0 0 24 24"><path {...common} d="M4 11l8-7 8 7M6 10v10h12V10" /></svg>;
  if (k === "lock") return <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" {...common} /><path {...common} d="M8 11V7a4 4 0 018 0v4" /></svg>;
  if (k === "award") return <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5" {...common} /><path {...common} d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5" /></svg>;
  if (k === "pill") return <svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="6" rx="3" {...common} /><line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" strokeWidth="2" /></svg>;
  return null;
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

function PhotoPlaceholder({ label, ratio = "4 / 5", className = "" }) {
  return (
    <div className={`hl-photo-slot ${className}`} style={{ aspectRatio: ratio }}>
      <span>{label}</span>
    </div>);

}

function Photo({ src, alt, ratio = "4 / 5", className = "" }) {
  return (
    <div className={`hl-photo-slot hl-photo-real ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading="lazy" />
    </div>);

}

function PhoneFrame({ src, className = "" }) {
  return (
    <div className={`hl-phone ${className}`}>
      <div className="hl-phone-screen">
        <video src={src} autoPlay loop muted playsInline preload="auto" aria-hidden="true"></video>
        <div className="hl-phone-island"></div>
      </div>
    </div>);

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
        <li><a href="#top">Individuals</a></li>
        <li><a href="#care-teams">Care Teams</a></li>
        <li><a href="#trust">Trust</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      <button className="hl-cta" onClick={onWaitlist}>Request Early Access <span>→</span></button>
    </nav>);

}

function HeroTicker() {
  const label = "ONC's EHIgnite Phase 1 Winner. To learn more, click here.";
  const chip = (key) =>
  <span className="hl-ticker-item" key={key}>
      <MiniIcon k="award" />
      <span>ONC&rsquo;s EHIgnite Phase 1 Winner.</span>
      <span className="hl-ticker-link">To learn more, click here.</span>
    </span>;

  const items = Array.from({ length: 12 }, (_, i) => chip(i));
  return (
    <a href="ehignite/" className="hl-hero-ticker" aria-label={label}>
      <div className="hl-hero-ticker-track" aria-hidden="true">{items}</div>
    </a>);

}

function Hero({ onWaitlist }) {
  return (
    <header id="top" className="hl-hero">
      <div className="hl-hero-bg">
        <video className="hl-hero-video"
        src="assets/hero.mp4"
        autoPlay loop muted playsInline preload="auto"
        aria-hidden="true"></video>
        <div className="hl-hero-scrim"></div>
      </div>

      <div className="hl-hero-inner over">
        <div className="hl-hero-copy">
          <Reveal as="h1" className="hl-headline">
            Your health keeps moving.<br />
            <span className="grad">Your care should too.</span>
          </Reveal>
          <Reveal as="p" delay={80} className="hl-sub">
            HealthLink360 connects what happens in your care with what happens in everyday
            life, helping you understand what matters and take the next step, through
            appointments, setbacks, everyday choices, and the work of staying well.
          </Reveal>
          <Reveal as="div" delay={160} className="hl-hero-actions">
            <button className="hl-cta lg" onClick={onWaitlist}>Request Early Access <span>→</span></button>
            <a href="#companion" className="hl-ghost">See the experience <span aria-hidden="true">→</span></a>
          </Reveal>
          <Reveal as="div" delay={240} className="hl-stats">
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

      <HeroTicker />
    </header>);

}

function Problem() {
  const moments = [
  { time: "9:10 AM", icon: "stethoscope", label: "The appointment", img: "assets/story-appointment.jpg" },
  { time: "12:40 PM", icon: "utensils", label: "Food & routines", img: "assets/story-food.jpg" },
  { time: "6:15 PM", icon: "footprints", label: "Movement & stress", img: "assets/story-movement.jpg" },
  { time: "10:05 PM", icon: "moon", label: "Rest & reflection", img: "assets/story-rest.jpg" }];

  return (
    <section className="hl-problem">
      <div className="hl-section-inner hl-problem-split">
        <Reveal as="div" className="hl-problem-copy">
          <h2 className="hl-h2">Most of your health happens outside the doctor's office.</h2>
          <p className="hl-lede">
            Your care team sees the appointment. You live everything that happens
            afterward: through food, movement, sleep, stress, medications,
            responsibilities, access, and daily routines.
          </p>
          <p className="hl-lede">
            When those stories stay disconnected, meaningful changes are easier to
            miss and advice becomes harder to follow.
          </p>
          <p className="hl-problem-callout">HealthLink360 helps bring the full picture together.</p>
        </Reveal>
        <Reveal delay={120} className="hl-problem-photos">
          {moments.map((m, i) =>
          <div key={i} className="hl-problem-tile">
              <div className="hl-problem-tile-photo">
                <Photo src={m.img} alt={m.label} ratio="4 / 5" />
                <span className="hl-problem-time">{m.time}</span>
              </div>
              <div className="hl-problem-tile-label"><MiniIcon k={m.icon} /><span>{m.label}</span></div>
            </div>
          )}
          <div className="hl-problem-connector">
            <span className="line"></span>
            <span className="txt">One day, one person: the same health story, connected</span>
            <span className="line"></span>
          </div>
        </Reveal>
      </div>
    </section>);

}

function Companion() {
  return (
    <section id="companion" className="hl-companion">
      <div className="hl-section-inner hl-companion-grid">
        <Reveal className="hl-companion-copy">
          <div className="hl-kicker">WHAT HEALTHLINK360 IS</div>
          <h2 className="hl-h2">A health companion that understands more of the story.</h2>
          <p className="hl-lede">
            HealthLink360 brings together medical information, everyday health
            patterns, and the context of your life. It helps make scattered
            information clearer, distinguishes what is understood from what may
            need review, shows what deserves attention, and turns the fuller
            picture into practical next steps.
          </p>
          <p className="hl-lede">
            From getting well, to building healthier habits, to staying ahead,
            HealthLink360 continues with you as your needs change.
          </p>
          <p className="hl-lede">
            It does not stop at a recommendation. It helps identify what it may
            take to follow through: a clearer plan, a different approach, or
            support from someone you trust.
          </p>
          <div className="hl-tagline">One body · One connected health story</div>
        </Reveal>
        <Reveal delay={120} className="hl-companion-photo">
          <PhoneFrame src="assets/companion.mp4" />
          <div className="hl-companion-card">
            <div className="ttl">Coach360 · this evening</div>
            <div className="msg">Your blood pressure is trending up. Not an emergency. Not nothing. A 10-minute walk after dinner is a good first move.</div>
            <div className="hl-chip-row">
              <span className="hl-chip ok"><MiniIcon k="pill" /> Meds taken today</span>
              <span className="hl-chip watch"><MiniIcon k="moon" /> Sleep 6h 40m · ↓ 40 min</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>);

}

function Seasons() {
  const seasons = [
  { icon: "heartpulse", accent: "c", title: "Get well", sub: "When something changes, find your way forward.", body: "Understand the plan, resolve what is unclear, keep track of what is changing, and stay connected to the people helping you recover." },
  { icon: "footprints", accent: "b", title: "Be well", sub: "When you are ready to make a change, know where to begin.", body: "Turn broad advice into practical actions shaped around your food, movement, sleep, stress, routines, goals, and daily reality." },
  { icon: "shield", accent: "a", title: "Stay well", sub: "When things are going well, protect what is working.", body: "See meaningful changes sooner, protect the habits that are working, and act while the next step is still small." }];

  return (
    <section className="hl-seasons">
      <div className="hl-seasons-bg">
        <img src="assets/seasons-bg.jpg" alt="" aria-hidden="true" />
        <div className="hl-seasons-scrim"></div>
      </div>
      <div className="hl-section-inner">
        <Reveal as="div" className="hl-seasons-intro">
          <h2 className="hl-h2 light">Wherever you are in your health, you should not have to start over.</h2>
          <p className="hl-lede light">
            Health is not a straight line. You may be recovering in one area, building
            new habits in another, and protecting progress somewhere else. HealthLink360
            keeps the story connected as those needs change.
          </p>
        </Reveal>
        <Reveal delay={100} className="hl-seasons-rule"></Reveal>
        <div className="hl-seasons-grid">
          {seasons.map((s, i) =>
          <Reveal key={i} delay={140 + i * 100} className="hl-season-col">
              <div className="hl-season-head">
                <span className={`hl-season-icon c-${s.accent}`}><MiniIcon k={s.icon} /></span>
                <h3>{s.title}</h3>
              </div>
              <div className={`hl-season-sub c-${s.accent}`}>{s.sub}</div>
              <p>{s.body}</p>
            </Reveal>
          )}
        </div>
        <Reveal delay={460} className="hl-seasons-note">
          <div className="ttl">Less confusion. Clearer next steps. Support that stays with you.</div>
          <p>And when something gets in the way, HealthLink360 helps make the barrier visible so the right support can respond.</p>
        </Reveal>
      </div>
    </section>);

}

function CareTeamsBridge() {
  return (
    <section id="care-teams" className="hl-care-bridge">
      <div className="hl-section-inner hl-care-bridge-inner">
        <div className="hl-care-bridge-copy">
          <div className="hl-kicker light">FOR CARE TEAMS</div>
          <h2>Supporting people between visits?</h2>
          <p>
            HealthLink360 helps care teams understand what is happening between
            visits, identify barriers, prioritize attention, and support
            meaningful preventive action, without creating another disconnected
            workflow.
          </p>
        </div>
        <a href="mailto:partners@healthlink360.ai" className="hl-cta">Explore for care teams <span>→</span></a>
      </div>
    </section>);

}

function LogoTicker() {
  const logos = [
  { name: "Johns Hopkins University", img: "assets/logos/johns-hopkins.png" },
  { name: "University of Baltimore", img: "assets/logos/university-of-baltimore.png" },
  { name: "NVIDIA" },
  { name: "AWS" },
  { name: "Halcyon", img: "assets/logos/halcyon.png" },
  { name: "Conscious Venture Labs", img: "assets/logos/conscious-venture-labs.png" },
  { name: "Build In Tulsa", img: "assets/logos/build-in-tulsa.png" },
  { name: "Visible Hands" }];

  const renderSet = (key) =>
  <div className="hl-logo-set" key={key}>
      {logos.map((l, i) =>
      <span className="hl-logo-item" key={i}>
          {l.img ? <img src={l.img} alt={l.name} loading="lazy" /> : l.name}
        </span>
      )}
    </div>;

  return (
    <div className="hl-logo-ticker">
      <div className="hl-logo-ticker-track">
        {renderSet("a")}
        {renderSet("b")}
      </div>
    </div>);

}

function TrustProof({ onWaitlist }) {
  const stats = [
  { value: "93%", label: "engagement", context: "in a prior Food-as-Medicine program" },
  { value: "90%", label: "medication adherence", context: "in an adherence-focused pilot" },
  { value: "70%", label: "reduction in ER utilization", context: "in a supported-care pilot" }];

  return (
    <section id="trust" className="hl-trust">
      <div className="hl-trust-bg">
        <img src="assets/trust-homevisit.jpg" alt="A community health worker sharing a warm conversation with a patient during a home visit" />
        <div className="hl-trust-scrim"></div>
      </div>
      <div className="hl-section-inner">
        <Reveal as="div" className="hl-trust-intro">
          <h2 className="hl-h2 light">Built to earn your trust, not ask for it.</h2>
          <p className="hl-lede light">
            Your health is personal. The guidance you receive should be
            understandable, grounded in evidence, and built around the realities
            of your life.
          </p>
        </Reveal>
        <div className="hl-trust-body">
          <Reveal delay={100} className="hl-trust-stats">
            <div className="hl-trust-stats-kicker">Experience behind the platform</div>
            {stats.map((s, i) =>
            <div key={i} className="hl-trust-stat-row">
                <div className="v">{s.value}</div>
                <div className="l"><strong>{s.label}</strong> {s.context}</div>
              </div>
            )}
            <div className="hl-trust-stats-note">Early program and pilot outcomes. Results may vary by population, program design, and level of support.</div>
          </Reveal>
        </div>
        <Reveal delay={240} as="div" className="hl-logo-ticker-wrap"><LogoTicker /></Reveal>
        <Reveal delay={280} as="div" className="hl-trust-footnote">Technology should help you feel more informed, not more overwhelmed.</Reveal>
        <Reveal delay={320} className="hl-trust-cta">
          <div className="hl-trust-cta-text">
            <div className="hl-trust-cta-title">Ready to see it for yourself?</div>
            <p>Reserve your spot in the founding cohort for $80 (was $100). Founding members get priority access and a lifetime price lock.</p>
          </div>
          <button className="hl-cta lg" onClick={onWaitlist}>Reserve my spot <span>→</span></button>
        </Reveal>
      </div>
    </section>);

}

function Footer() {
  const cols = [
  { title: "For individuals", links: [["How it works", "#companion"], ["The experience", "#companion"], ["Privacy & security", "#trust"], ["FAQ", "waitlist.html"]] },
  { title: "For care teams", links: [["Overview", "#care-teams"], ["Solutions", "#care-teams"], ["Resources", "#trust"], ["Request a demo", "mailto:partners@healthlink360.ai"]] },
  { title: "For organizations", links: [["Population health", "#trust"], ["Community impact", "#trust"], ["Partnerships", "mailto:partners@healthlink360.ai"]] },
  { title: "About", links: [["Our mission", "#top"], ["Our story", "#top"], ["Contact us", "mailto:info@healthlink360.ai"]] }];

  return (
    <footer id="about" className="hl-footer">
      <div className="hl-section-inner">
        <div className="hl-foot-grid">
          <div>
            <Logo variant="footer" />
            <p className="hl-foot-mission">HealthLink360 connects your care with everyday life, so no change means starting over. It supports and educates; it does not diagnose or replace medical care.</p>
          </div>
          {cols.map((col, i) =>
          <div key={i}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(([label, href], j) => <li key={j}><a href={href}>{label}</a></li>)}
              </ul>
            </div>
          )}
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
      <Hero onWaitlist={goWaitlist} />
      <Problem />
      <Seasons />
      <Companion />
      <CareTeamsBridge />
      <TrustProof onWaitlist={goWaitlist} />
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
      </TweaksPanel>
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
