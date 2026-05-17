import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  "cover", "snapshot", "ecosystem", "social", "ecommerce",
  "competitors", "gaps", "solution", "ai", "roadmap", "investment", "close", "jvmodel"
];

const SECTION_LABELS: Record<string, string> = {
  cover: "Cover", snapshot: "Snapshot", ecosystem: "Ecosystem",
  social: "Social Audit", ecommerce: "Revenue Intel", competitors: "Competitors",
  gaps: "7 Gaps", solution: "Hairnerds OS", ai: "AI & Gamification",
  roadmap: "Roadmap", investment: "Investment", close: "Next Steps",
  jvmodel: "JV Model"
};

function Counter({ end, prefix = "", suffix = "", duration = 1800 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * end));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

function ProgressBar({ value, max, color = "#c8a97e", label, delay = 0 }: { value: number; max: number; color?: string; label: string; delay?: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setW((value / max) * 100), delay);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, max, delay]);
  return (
    <div ref={ref} style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>
        <span style={{ color: "#b0b0b0" }}>{label}</span>
        <span style={{ color: "#888" }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function Metric({ number, label, sub, accent }: { number: React.ReactNode; label: string; sub?: string; accent?: boolean }) {
  return (
    <div
      style={{
        background: "#0a0a0a", border: `1px solid ${accent ? "#c8a97e44" : "#1f1f1f"}`,
        borderRadius: 12, padding: "14px 16px", transition: "all .2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#c8a97e66'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = accent ? '#c8a97e44' : '#1f1f1f'; }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: accent ? "#c8a97e" : "#e0e0e0", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1 }}>{number}</div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 6, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "#555", marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{sub}</div>}
    </div>
  );
}

function GapCard({ number, title, problem, risk, isOpen, onToggle }: { number: number; title: string; problem: string; risk: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
      <div onClick={onToggle} style={{
        padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#c8a97e", minWidth: 28 }}>{number}</span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: "#e0e0e0", flex: 1 }}>{title}</span>
        <span style={{ color: "#c8a97e", fontSize: 18, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
      </div>
      {isOpen && (
        <div style={{ padding: "0 20px 20px 64px" }}>
          <p style={{ fontSize: 13, color: "#b0b0b0", lineHeight: 1.7, margin: "0 0 12px", fontFamily: "'DM Sans',sans-serif" }}>{problem}</p>
          <div style={{ background: "#c0392b11", border: "1px solid #c0392b33", borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ fontSize: 12, color: "#e74c3c", margin: 0, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
              <strong>Risk:</strong> {risk}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseCard({ phase, weeks, items, outcome, color }: { phase: string; weeks: string; items: string[]; outcome: string; color: string }) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, color }}>{phase}</span>
        <span style={{ fontSize: 11, color: "#666", fontFamily: "'DM Sans',sans-serif" }}>{weeks}</span>
      </div>
      <ul style={{ margin: "0 0 12px", padding: "0 0 0 16px", fontSize: 12, color: "#999", lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
      <div style={{ fontSize: 11, color: "#c8a97e", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{outcome}</div>
    </div>
  );
}

function SectionHead({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: "#c8a97e55", fontWeight: 700, letterSpacing: 3, fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>{label}</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,5vw,32px)", fontWeight: 700, color: "#f5f0eb", margin: "0 0 4px", lineHeight: 1.1 }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: "#c8a97e", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{sub}</p>}
      <div style={{ width: 40, height: 2, background: "#c8a97e", marginTop: 12 }} />
    </div>
  );
}

const ps: React.CSSProperties = { fontSize: 13, color: "#b0b0b0", lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif", margin: "0 0 14px" };
const h3s: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", margin: "20px 0 10px", letterSpacing: ".3px" };

export default function HairnerdsProposal() {
  const [active, setActive] = useState("cover");
  const [openGap, setOpenGap] = useState<number | null>(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: string) => { setActive(id); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const navDot = (id: string) => (
    <button key={id} onClick={() => go(id)} title={SECTION_LABELS[id]}
      style={{
        width: active === id ? 24 : 8, height: 8, borderRadius: 4, border: "none",
        background: active === id ? "#c8a97e" : "#333", cursor: "pointer",
        transition: "all .3s", padding: 0,
      }} />
  );

  const sIdx = SECTIONS.indexOf(active);
  const prev = sIdx > 0 ? SECTIONS[sIdx - 1] : null;
  const next = sIdx < SECTIONS.length - 1 ? SECTIONS[sIdx + 1] : null;

  const renderSection = () => {
    switch (active) {

      case "cover": return (
        <div style={{ minHeight: "85vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, fontSize: 10, color: "#c0392b", fontWeight: 700, letterSpacing: 2, fontFamily: "'DM Sans',sans-serif" }}>CONFIDENTIAL</div>
          <div style={{ width: 60, height: 3, background: "#c8a97e", marginBottom: 32 }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,7vw,56px)", fontWeight: 700, color: "#f5f0eb", lineHeight: 1.05, margin: "0 0 12px", letterSpacing: "-1px" }}>
            HAIRNERDS<br/>STUDIO
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(16px,3vw,22px)", color: "#c8a97e", margin: "0 0 32px", fontWeight: 400, letterSpacing: "1px" }}>
            Digital Transformation & AI Strategy
          </p>
          <div style={{ width: 40, height: 2, background: "#c8a97e55", marginBottom: 32 }} />
          <p style={{ fontSize: 14, color: "#999", lineHeight: 1.8, maxWidth: 560, fontFamily: "'DM Sans',sans-serif" }}>
            A strategic proposal to transform Indonesia's most influential premium barbershop brand
            into a fully integrated, AI-powered lifestyle platform with proprietary digital IP.
          </p>
          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#666", fontFamily: "'DM Sans',sans-serif" }}>Prepared for</span>
            <span style={{ fontSize: 14, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Iman Taufiq Djayadiningrat & Giovanni Widjaja</span>
            <span style={{ fontSize: 12, color: "#666", fontFamily: "'DM Sans',sans-serif", marginTop: 12 }}>Prepared by</span>
            <span style={{ fontSize: 14, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Tomy · System Architect</span>
            <span style={{ fontSize: 13, color: "#888", fontFamily: "'DM Sans',sans-serif" }}>TOMS VENTURES · toms.ventures</span>
            <span style={{ fontSize: 12, color: "#555", fontFamily: "'DM Sans',sans-serif", marginTop: 8 }}>April 2026 · Version 2.0</span>
          </div>
        </div>
      );

      case "snapshot": return (<div>
        <SectionHead label="01" title="Executive Snapshot" sub="Why This Matters Right Now" />
        <p style={ps}>Hairnerds Studio is not just a barbershop. It is a <em>content powerhouse</em> with 3 million TikTok followers and 114.9 million likes. It has a product line that moved 166,000+ units. It runs an academy training 100+ barbers. It serves the Indonesian national football team across 6 premium outlets.</p>
        <p style={ps}>But underneath this surface, the business operates on fragmented manual infrastructure. No unified POS. No CRM. No data. The 3M-follower content engine has zero attribution connecting views to bookings to revenue.</p>
        <div style={{ background: "#c0392b11", border: "1px solid #c0392b33", borderRadius: 12, padding: "16px 20px", margin: "24px 0" }}>
          <p style={{ color: "#e74c3c", fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
            Captain Barbershop (130 outlets, backed by Sukses Corp) already has a membership app and tech team.
            They are scaling infrastructure while Hairnerds scales content. Content without infrastructure is a house built on sand.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginTop: 28 }}>
          <Metric number={<Counter end={3} suffix="M" />} label="TikTok Followers" accent />
          <Metric number={<Counter end={166} suffix="K+" />} label="Products Sold" sub="Tokopedia alone" />
          <Metric number="6" label="Outlets" sub="Jakarta · Bandung · Bekasi" />
          <Metric number={<Counter end={5} prefix="Rp " suffix="B+" />} label="Est. Annual Revenue" />
          <Metric number={<span style={{ color: "#e74c3c" }}>0</span>} label="Unified Systems" sub="Critical gap" />
        </div>
      </div>);

      case "ecosystem": return (<div>
        <SectionHead label="02" title="The Hairnerds Ecosystem" sub="Three Revenue Engines, One Brand" />
        {[
          { name: "HAIRNERDS STUDIO", emoji: "✂️", desc: "6 premium outlets across Jakarta, Bandung, Bekasi. Premium pricing at Rp 150K+ (vs industry Rp 20-70K). Celebrity clients include Adipati Dolken and the Indonesian national football team.", metric: "~Rp 400M+/month", metricLabel: "Reported Revenue" },
          { name: "HAIRNERDS PROFESSIONAL", emoji: "🧴", desc: "Own-brand product line since 2018. Hero SKU: FreestyleDust Powder. BPOM registered. Sold via Tokopedia (166K+ units, 4.9★, 44.3K reviews), Shopee, Blibli, and 7+ authorized resellers. Bodypack collaboration.", metric: "166K+", metricLabel: "Units Sold (Tokopedia)" },
          { name: "HAIRNERDS ACADEMY", emoji: "🎓", desc: "Barber education since Aug 2022. Founded by Iman TDJ (1st Indonesian Wahl Educator SEA, Schorem & Menspire Academy graduate). Courses cover layering, graduation, fading, styling.", metric: "100+", metricLabel: "Graduates in 2 Years" },
        ].map((e, i) => (
          <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#c8a97e" }}>{e.emoji} {e.name}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#c8a97e", fontFamily: "'Cormorant Garamond',serif" }}>{e.metric}</div>
                <div style={{ fontSize: 10, color: "#666" }}>{e.metricLabel}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#b0b0b0", lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{e.desc}</p>
          </div>
        ))}
        <h3 style={h3s}>Key People</h3>
        {[
          { name: "Iman Taufiq Djayadiningrat", role: "Founder / Creative Lead", bg: "Ex-bank BUMN. Self-taught. 1st Indonesian Wahl Educator SEA. Schorem & Menspire graduate. Studied in Europe." },
          { name: "Giovanni Widjaja", role: "Co-Owner / Operations", bg: "Business expansion, operations management. Led Bekasi grand opening (Sep 2024)." },
          { name: "Ilham Alhamid", role: "Brand Manager", bg: "Brand positioning, marketing, partnerships." },
          { name: "Okky Yuli Pratama", role: "Senior Barber", bg: "Personal barber to Indonesian national football team. Key brand ambassador." },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #111" }}>
            <div style={{ minWidth: 36, height: 36, borderRadius: "50%", background: "#c8a97e22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#c8a97e", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>{p.name[0]}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif" }}>{p.name} <span style={{ color: "#c8a97e", fontWeight: 400, fontSize: 11 }}>· {p.role}</span></div>
              <div style={{ fontSize: 12, color: "#777", fontFamily: "'DM Sans',sans-serif" }}>{p.bg}</div>
            </div>
          </div>
        ))}
      </div>);

      case "social": return (<div>
        <SectionHead label="03" title="Social Media Audit" sub="The Real Asset Nobody's Measuring" />
        <p style={ps}>Iman himself stated: <em>"90% of our customers come from social media, not foot traffic."</em> Yet there is no system connecting this massive audience to business outcomes.</p>
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <h3 style={h3s}>Platform Breakdown</h3>
          <ProgressBar value={3000000} max={3200000} label="TikTok @hairnerdsstudio" delay={100} />
          <ProgressBar value={423800} max={3200000} color="#69C9D0" label="TikTok @hairnerdsstudiobandung" delay={200} />
          <ProgressBar value={300000} max={3200000} color="#E1306C" label="Instagram @hairnerdsstudio (est.)" delay={300} />
          <ProgressBar value={65000} max={3200000} color="#E1306C" label="Instagram @hairnerdsprofessional" delay={400} />
          <ProgressBar value={40000} max={3200000} color="#E1306C" label="Instagram @hairnerdsacademy" delay={500} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Metric number="114.9M" label="Total TikTok Likes" accent />
          <Metric number="200K+" label="Likes Per Viral Video" />
          <Metric number="4M+" label="Combined Followers" sub="Across all platforms" />
          <Metric number={<span style={{color:"#e74c3c"}}>0%</span>} label="Attribution Tracked" sub="Content → Booking → Revenue" />
        </div>
        <div style={{ background: "#0f0a05", border: "1px solid #c8a97e33", borderRadius: 12, padding: "16px 20px", marginTop: 24 }}>
          <p style={{ fontSize: 13, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", fontStyle: "italic", margin: 0, lineHeight: 1.7 }}>
            <strong>Insight:</strong> This is not a barbershop with a social media account. This is a media company that also cuts hair.
            The question: how much of this 4M+ audience converts to measurable business value? Right now, nobody knows.
          </p>
        </div>
        <div style={{ marginTop: 20, background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#e74c3c", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, margin: "0 0 6px" }}>⚠ Talent Leak Risk</p>
          <p style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans',sans-serif", margin: 0, lineHeight: 1.7 }}>
            Individual barber @ramaboyss98 has 66K followers — more than some branch accounts. Combined staff personal accounts: est. 200K+ followers.
            These are Hairnerds' customers on employees' personal accounts. Without a platform tying barber success to the Hairnerds brand, top talent will eventually take their audience and leave.
          </p>
        </div>
      </div>);

      case "ecommerce": return (<div>
        <SectionHead label="04" title="Revenue Intelligence" sub="What The Data Actually Shows" />
        <p style={ps}>We conducted an independent audit of Hairnerds' publicly observable revenue streams. These are not guesses — they're reconstructed from verifiable marketplace data, media interviews, and operational indicators.</p>
        <h3 style={h3s}>Product Revenue Deep Dive (Tokopedia)</h3>
        <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <Metric number="166K+" label="Total Units Sold" accent />
            <Metric number="44.3K" label="Customer Reviews" sub="4.9★ average" />
            <Metric number="7+" label="Reseller Stores" sub="Also selling Hairnerds" />
          </div>
          <p style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans',sans-serif", margin: 0, lineHeight: 1.7 }}>
            Top SKUs: FreestyleDust Powder (10K+ units on official store), Hair Paste (4.9K+), Powder + Comb bundle (9K+).
            Price range Rp 70K-190K. Two official Tokopedia stores (@hairnerdspro, @hairnerds-store) plus distribution via Shopee, Blibli, and authorized resellers.
          </p>
        </div>

        <h3 style={h3s}>Revenue Estimation Model</h3>
        <p style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans',sans-serif", marginBottom: 16, lineHeight: 1.6 }}>
          Methodology: Cross-referenced CNBC Indonesia interview data (Rp 400M/month at 2-3 outlets), scaled for 6 current outlets with inflation adjustment, combined with Tokopedia transaction data and academy pricing research.
        </p>
        {[
          { stream: "Services (6 outlets)", method: "Founder stated Rp 400M/mo on CNBC (2020, 2-3 outlets). Scaled for 6 outlets + 3 years growth. Conservative: assumes only 50% scaling efficiency.", est: "Rp 4.8 – 6.5B", pct: 78 },
          { stream: "Products (all channels)", method: "Tokopedia: 166K units × Rp 100K avg = Rp 16.6B lifetime. ÷ 4 years = Rp 4.1B/yr gross. Net after marketplace commissions + wholesale: ~35-45% margin to Hairnerds.", est: "Rp 700M – 1.2B", pct: 12 },
          { stream: "Academy tuition", method: "Courses Rp 3-8M per student. 50-80 students/year estimated from graduation data (100+ in 2 years).", est: "Rp 250 – 500M", pct: 5 },
          { stream: "Brand partnerships", method: "JRL Professional, Mizutani, Bodypack collab. Affiliate and sponsorship revenue.", est: "Rp 100 – 300M", pct: 3 },
        ].map((r, i) => (
          <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "14px 16px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif" }}>{r.stream}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#c8a97e", fontFamily: "'Cormorant Garamond',serif" }}>{r.est}</span>
            </div>
            <p style={{ fontSize: 11, color: "#777", margin: "6px 0 0", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>{r.method}</p>
          </div>
        ))}
        <div style={{ background: "linear-gradient(135deg, #c8a97e15, #c8a97e08)", border: "1px solid #c8a97e44", borderRadius: 12, padding: "16px 20px", marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif" }}>TOTAL ESTIMATED ANNUAL REVENUE</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#c8a97e", fontFamily: "'Cormorant Garamond',serif" }}>Rp 5.9 – 8.5B</span>
          </div>
          <p style={{ fontSize: 11, color: "#888", margin: "8px 0 0", fontFamily: "'DM Sans',sans-serif" }}>
            To be validated with actual financial data during Phase 0 Discovery. These figures are directional — built from public data to demonstrate our diligence, not to assume precision.
          </p>
        </div>
      </div>);

      case "competitors": return (<div>
        <SectionHead label="05" title="Competitive Landscape" sub="Why The Window Is Closing" />
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
            <thead><tr style={{ borderBottom: "2px solid #c8a97e33" }}>
              {["", "Hairnerds", "Captain Barbershop", "Digital Entrant\n(When, Not If)"].map((h, i) => (
                <th key={i} style={{ padding: "10px 12px", textAlign: "left", color: i === 1 ? "#c8a97e" : "#888", fontSize: 11, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", whiteSpace: "pre-line" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                ["Outlets", "6", "130+", "0 (app-first)"],
                ["Backing", "Independent", "Sukses Corp (NPure, Mom Uung)", "VC-funded"],
                ["Pricing", "Rp 150K+ (premium)", "Rp 60-100K (mass)", "Rp 120-200K"],
                ["Tech Team", "None", "Yes (tech@suksescorp)", "Core competency"],
                ["Membership App", "None", "Yes (points + tiers)", "Built-in from day 1"],
                ["Own Products", "Yes (166K+ sold)", "No", "Partnerships"],
                ["Academy", "Yes (100+ grads)", "Yes", "No"],
                ["Social Reach", "4M+ followers", "~500K (est.)", "Paid acquisition"],
                ["Content Authority", "DOMINANT", "Standard", "None yet"],
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #111" }}>
                  {r.map((c, j) => (
                    <td key={j} style={{ padding: "8px 12px", color: j === 0 ? "#888" : j === 1 ? "#e0e0e0" : "#777", fontWeight: j === 0 ? 600 : 400, fontSize: j === 0 ? 11 : 12 }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={h3s}>The Hairnerds USP Trinity</h3>
        <p style={ps}>No competitor has all three. This is the moat — but only if it's captured digitally.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {[
            { icon: "👥", title: "4M+ Organic Audience", desc: "Not buyable. Captain's 130 outlets cannot replicate 3M TikTok followers built through authentic content." },
            { icon: "🧴", title: "Own Product Line at Scale", desc: "166K+ units proven. Captain has no proprietary product. Connecting product sales to service data = flywheel." },
            { icon: "🎓", title: "Academy Talent Pipeline", desc: "100+ trained barbers + product line + 3M followers. This vertically integrated trinity is the competitive moat." },
          ].map((u, i) => (
            <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{u.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#c8a97e", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{u.title}</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>{u.desc}</div>
            </div>
          ))}
        </div>
      </div>);

      case "gaps": return (<div>
        <SectionHead label="06" title="7 Critical Gaps" sub="Problems Before Solutions" />
        <p style={ps}>These are not technology problems. They are business survival problems that technology solves.</p>
        {[
          { n: 1, t: "Blind Multi-Outlet Operations", p: "6 outlets across 3 cities, no unified dashboard. Revenue, chair utilization, product usage, staff productivity — invisible at portfolio level. Management via WhatsApp.", r: "Captain Barbershop's Sukses Corp parent has centralized infrastructure across 130 outlets. Hairnerds is 20x smaller but operating 20x more blind." },
          { n: 2, t: "Zero Customer Intelligence", p: "A Kebayoran customer is a stranger at PIK. No visit history, style preferences, product purchases, or lifetime value. The relationship data lives only in barbers' heads.", r: "When a barber leaves, they take customer relationships. @ramaboyss98 has 66K followers — that's YOUR customer base on HIS personal account." },
          { n: 3, t: "3M Followers, Zero Attribution", p: "90% of customers from social, but which TikTok drives bookings? Which barber's content converts? With 3M followers, even 0.1% conversion optimization = thousands of additional bookings/year.", r: "You're sitting on one of Indonesia's most powerful organic distribution channels with no measurement system." },
          { n: 4, t: "Products on Rented Land", p: "166K+ units sold on Tokopedia (3-5% commission, zero customer data ownership). Shopee similarly. No post-purchase engagement. No subscription model. No cross-sell from chair to cart.", r: "Est. Rp 50-100M/year in marketplace commissions for the privilege of NOT owning customer data." },
          { n: 5, t: "No Retention Engine", p: "Customer going monthly to bi-monthly = 50% LTV loss. No frequency tracking, no churn prediction, no re-engagement triggers. Captain already has a loyalty app with points and cashback.", r: "Acquiring a new premium customer costs 5-7x more than retaining one. Churn is happening silently." },
          { n: 6, t: "Barber Performance Unmeasured", p: "Academy trains 100+ barbers but in-chair performance (revenue, retention, upsell, satisfaction) is completely untracked. Compensation based on tenure, not data.", r: "Your best barbers don't know they're best. You can't reward what you can't measure." },
          { n: 7, t: "Academy is an Island", p: "No digital career path from student → junior → senior → master. No performance benchmarking. No alumni engagement driving referrals back to Studio.", r: "The Academy should be Hairnerds' competitive moat. Right now it's a standalone revenue event, not a system." },
        ].map(g => (
          <GapCard key={g.n} number={g.n} title={g.t} problem={g.p} risk={g.r}
            isOpen={openGap === g.n} onToggle={() => setOpenGap(openGap === g.n ? null : g.n)} />
        ))}
      </div>);

      case "solution": return (<div>
        <SectionHead label="07" title="Hairnerds OS" sub="Proprietary Digital IP — Not SaaS Rental" />
        <p style={ps}>Not a Setmore subscription. Not a Moka POS rental. A custom platform owned by Hairnerds that becomes the company's most valuable long-term digital asset. Designed for the unique three-engine model.</p>
        {[
          { icon: "🛒", name: "Smart POS + Payments", desc: "Unified across 6 outlets. QRIS/e-wallet/transfer. Coretax-ready. Per-barber revenue attribution. Every transaction = a data point.", data: "Chair utilization · Avg ticket · Peak hours · Product attach rate · Per-outlet P&L" },
          { icon: "👤", name: "Customer Intelligence", desc: "Cross-outlet profiles: visit history, preferred barber, style prefs, product purchases, satisfaction, predicted next visit. One customer, one profile, everywhere.", data: "Customer LTV · Visit frequency · Churn risk score · Segment clusters" },
          { icon: "📊", name: "Staff Performance Engine", desc: "Real-time barber dashboard: revenue, customers served, service time, return rate, upsell rate, satisfaction. Feeds compensation and career progression.", data: "Leaderboard · Skills gap · Commission optimization · Staffing forecasts" },
          { icon: "📅", name: "Booking Intelligence", desc: "Replace Setmore. Integrated into website, Instagram, WhatsApp, PWA. Smart scheduling, deposits, dynamic pricing. TikTok/IG attribution tracking.", data: "No-show rate · Channel attribution · Demand forecasting · Dynamic pricing" },
          { icon: "🛍️", name: "D2C Product Commerce", desc: "Owned e-commerce channel. In-chair product recommendations auto-trigger purchase links. Subscription model. Recapture marketplace margins.", data: "Product revenue per customer · Recommendation conversion · Subscriptions" },
          { icon: "🖥️", name: "Command Center", desc: "Single founder dashboard: all outlets real-time. Revenue, occupancy, staff, inventory, anomaly alerts. Mobile-first. Automated reporting.", data: "Cross-outlet benchmarking · Trend detection · Consolidated P&L · Forecasting" }
        ].map((m, i) => (
          <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: "16px 18px", marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>{m.icon} {m.name}</div>
            <p style={{ fontSize: 12, color: "#999", lineHeight: 1.7, margin: "0 0 8px", fontFamily: "'DM Sans',sans-serif" }}>{m.desc}</p>
            <div style={{ fontSize: 11, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", opacity: 0.8 }}>📎 {m.data}</div>
          </div>
        ))}
      </div>);

      case "ai": return (<div>
        <SectionHead label="08" title="AI & Gamification" sub="The Moat Nobody Else Can Build" />
        <h3 style={h3s}>AI for Customers</h3>
        {[
          ["🔮 Predictive Churn Engine", "ML model flags at-risk customers before they leave. Auto-triggers re-engagement with personalized offers."],
          ["🧴 AI Product Matching", "Based on hair type + style + history, recommends Hairnerds Professional products. Auto-reorder & subscriptions."],
          ["💬 WhatsApp AI Agent", "24/7 conversational booking in Bahasa Indonesia. Scheduling, rescheduling, product inquiries, style consultation."],
          ["📈 Content Attribution", "Connects TikTok/IG to bookings. Tells you: 'This barber's TikTok generated Rp 45M in bookings this month.'"],
        ].map(([t, d], i) => <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #111" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif" }}>{t}</div>
          <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{d}</div>
        </div>)}
        <h3 style={{ ...h3s, marginTop: 28 }}>Hairnerds Club — Loyalty Gamification</h3>
        {[
          { tier: "1", name: "FRESH CUT", req: "Sign up + first visit", perks: "Member pricing, birthday discount", color: "#888" },
          { tier: "2", name: "SHARP", req: "5 visits + 1 product", perks: "Priority booking, free sample/quarter", color: "#b0b0b0" },
          { tier: "3", name: "LEGEND", req: "12 visits + 3 products + referral", perks: "Exclusive barber, early product drops", color: "#c8a97e" },
          { tier: "4", name: "ICON", req: "24+ visits + ambassador", perks: "VIP events, co-creation, featured content", color: "#e8d5b0" },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #111" }}>
            <div style={{ minWidth: 40, height: 40, borderRadius: "50%", border: `2px solid ${t.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: t.color, fontFamily: "'Cormorant Garamond',serif" }}>{t.tier}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.color, fontFamily: "'DM Sans',sans-serif" }}>{t.name}</div>
              <div style={{ fontSize: 11, color: "#777", fontFamily: "'DM Sans',sans-serif" }}>{t.req} → {t.perks}</div>
            </div>
          </div>
        ))}
        <h3 style={{ ...h3s, marginTop: 28 }}>Barber XP Progression System</h3>
        <p style={ps}>Barbers earn XP for revenue, satisfaction, upsells, returns, peer recognition. Visible leaderboard per outlet and company-wide. Progression tiers unlock compensation bumps, schedule flexibility, and content features.</p>
        <div style={{ display: "flex", gap: 4, justifyContent: "space-between", margin: "12px 0" }}>
          {["Apprentice", "Stylist", "Senior", "Master", "Hair Artist"].map((t, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 4px", background: "#0a0a0a", borderRadius: 8, border: "1px solid #1a1a1a" }}>
              <div style={{ fontSize: 10, color: "#c8a97e", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0f0a05", border: "1px solid #c8a97e33", borderRadius: 12, padding: "16px 20px", marginTop: 16 }}>
          <p style={{ fontSize: 12, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
            This is how you keep talent. When a barber can see their XP, ranking, and a clear path to "Master" status with real financial rewards — leaving means starting from zero elsewhere.
          </p>
        </div>
      </div>);

      case "roadmap": return (<div>
        <SectionHead label="09" title="Implementation Roadmap" sub="90-Day Sprint to First Value" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <PhaseCard phase="PHASE 0 · Discovery" weeks="Wk 1-4" color="#888"
            items={["Stakeholder interviews", "Outlet audits & workflow mapping", "Tech stack assessment", "Data architecture blueprint"]}
            outcome="✓ Complete blueprint signed off" />
          <PhaseCard phase="PHASE 1 · Core OS" weeks="Wk 5-16" color="#c8a97e"
            items={["POS + CRM at Kebayoran (pilot)", "Payment integration (QRIS)", "Customer profiles", "Basic analytics dashboard"]}
            outcome="✓ Flagship outlet fully digital" />
          <PhaseCard phase="PHASE 2 · Scale" weeks="Wk 17-28" color="#c8a97e"
            items={["All 6 outlets on Hairnerds OS", "Booking system replacement", "Product commerce integration", "Staff performance tracking"]}
            outcome="✓ Unified platform across all outlets" />
          <PhaseCard phase="PHASE 3 · AI Layer" weeks="Wk 29-40" color="#e8d5b0"
            items={["Hairnerds Club launch", "Barber leaderboard", "AI churn prediction", "WhatsApp AI agent"]}
            outcome="✓ Retention & motivation engine live" />
          <PhaseCard phase="PHASE 4 · Compound" weeks="Wk 41-52" color="#f5edd8"
            items={["Dynamic pricing engine", "Academy integration", "Forecasting & planning", "Content attribution system"]}
            outcome="✓ Full Hairnerds OS operational" />
        </div>
        <div style={{ background: "#0f0a05", border: "1px solid #c8a97e33", borderRadius: 12, padding: "16px 20px", marginTop: 16 }}>
          <p style={{ fontSize: 12, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
            Each phase has a go/no-go gate. Phase 1 pilots at Kebayoran flagship before scaling. No big-bang rollout — incremental value delivery from week 5.
          </p>
        </div>
      </div>);

      case "investment": return (<div>
        <SectionHead label="10" title="Investment & Returns" sub="Transparent Numbers, Honest Projections" />
        <h3 style={h3s}>Projected Annual Revenue Uplift (Post Full Deployment)</h3>
        <p style={{ fontSize: 11, color: "#666", fontFamily: "'DM Sans',sans-serif", margin: "0 0 16px", lineHeight: 1.6 }}>
          Each lever below is benchmarked against published industry data from comparable businesses.
        </p>
        {[
          { lever: "Churn Reduction", how: "AI re-engagement reduces annual churn by 15-25%. Industry benchmark: 20% churn reduction = significant LTV increase", low: 400, high: 650 },
          { lever: "Ticket Uplift", how: "In-chair product recommendation → attach rate increase from ~5% to 15-20%. Cross-sell data from CRM drives personalized suggestions", low: 350, high: 650 },
          { lever: "No-Show Reduction", how: "Deposit + reminders cut no-shows from ~15% to ~5%. Industry standard improvement with deposit systems (Phorest Salon Data)", low: 200, high: 350 },
          { lever: "Dynamic Pricing", how: "Peak-hour 10-20% premium pricing on weekends/holidays. Common in premium hospitality — applied to appointment-based services", low: 250, high: 400 },
          { lever: "D2C Margin Recapture", how: "Own channel vs. Tokopedia (3-5%) / Shopee (5-8%) commissions. + higher margin on direct subscriptions vs. one-time marketplace sales", low: 200, high: 400 },
          { lever: "Content Attribution", how: "Identifying which content drives bookings → reallocating effort to highest-ROI content. Even 5% improvement on 3M-follower reach = significant", low: 150, high: 300 },
          { lever: "Operational Savings", how: "Automation of scheduling, reporting, inventory, staff rostering. Benchmark: 8-15% operational cost reduction (Deloitte Digital Ops)", low: 150, high: 250 },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #111", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "#e0e0e0" }}>{r.lever}</div>
              <div style={{ fontSize: 10.5, color: "#666", lineHeight: 1.5, marginTop: 2 }}>{r.how}</div>
            </div>
            <div style={{ textAlign: "right", minWidth: 120 }}>
              <span style={{ color: "#c8a97e" }}>+Rp {r.low}M</span>
              <span style={{ color: "#555" }}> – </span>
              <span style={{ color: "#c8a97e" }}>{r.high}M</span>
            </div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg, #c8a97e15, #c8a97e08)", border: "1px solid #c8a97e44", borderRadius: 12, padding: "16px 20px", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif" }}>PROJECTED ANNUAL UPLIFT</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#c8a97e", fontFamily: "'Cormorant Garamond',serif" }}>+Rp 1.75 – 3.0B</span>
        </div>

        <p style={{ fontSize: 11, color: "#777", fontFamily: "'DM Sans',sans-serif", margin: "8px 0 0", lineHeight: 1.6, fontStyle: "italic" }}>
          These projections will be stress-tested against Hairnerds' actual financial data during Phase 0 Discovery. We calibrate before we commit.
        </p>

        <h3 style={{ ...h3s, marginTop: 32 }}>Four Ways to Work Together</h3>
        <p style={ps}>We believe the best partnerships happen when both sides choose the structure that fits their comfort level. Here are four models — from straightforward contractor work to deep strategic alignment. Hairnerds picks what works.</p>

        {[
          { tag: "", name: "Option A: Pure Contractor", desc: "Hairnerds hires TOMS VENTURES on a project basis with fixed deliverables, fixed timeline, fixed price. We build, we deliver, we hand over.", price: "Phase 0: Rp 200M · Build (Phase 1-4): Rp 1.2 – 1.8B · Monthly maintenance: Rp 40-60M", pros: "Full ownership from day one. Clean scope. No revenue sharing. Predictable budget.", cons: "Highest upfront cost. All risk on Hairnerds side. No ongoing alignment of incentives.", best: "You want a vendor, not a partner. Budget is available. Internal team will own operations post-handover.", highlight: false },
          { tag: "", name: "Option B: Consulting Retainer", desc: "TOMS VENTURES provides ongoing strategic advisory + system architecture on a monthly retainer. Hairnerds can use internal or third-party developers for execution, with our oversight.", price: "Monthly retainer: Rp 50-80M · Duration: 12 months minimum · Development resources billed separately", pros: "Lowest commitment. Access to senior strategy without full build cost. Flexible.", cons: "Slower execution if development is outsourced. Strategy without execution can stall.", best: "You want the blueprint and guidance first, execute at your own pace. Or you're evaluating multiple partners.", highlight: false },
          { tag: "RECOMMENDED", name: "Option C: Hybrid Partnership", desc: "Guaranteed base fee that covers our build costs and team resources, plus a performance share on measurable revenue uplift. Both sides have skin in the game.", price: "Phase 0: Rp 175M · Build: Rp 850M (fair base) · + 10-15% of independently verified revenue uplift above current baseline, for 24 months post full deployment", pros: "Hairnerds gets below-market build cost vs Option A. TOMS VENTURES is incentivized to maximize results, not just deliver code. Win-win by design.", cons: "Requires agreement on measurement methodology and independent verification of uplift.", best: "You want a partner who wins when you win. Our recommended model — fair for both sides.", highlight: true },
          { tag: "", name: "Option D: Strategic Equity", desc: "Significantly reduced fees in exchange for a minority equity stake in a newly created tech entity (Hairnerds Digital or similar). TOMS VENTURES becomes a co-owner of the digital IP.", price: "Phase 0: Rp 100M · Build: Rp 500M (deeply reduced) · Equity: 5-12% of tech entity · Maintenance: at cost", pros: "Lowest cash outlay. Deepest long-term alignment. Positions for future licensing of Hairnerds OS to other chains.", cons: "Equity dilution. Requires legal structuring. Longer-term commitment.", best: "The vision extends beyond 6 outlets — eventually franchising or licensing the digital platform across Southeast Asia.", highlight: false },
        ].map((m, i) => (
          <div key={i} style={{
            background: m.highlight ? "#0f0a05" : "#0a0a0a",
            border: `1px solid ${m.highlight ? "#c8a97e44" : "#1a1a1a"}`,
            borderRadius: 12, padding: "16px 18px", marginBottom: 12,
          }}>
            {m.tag && <span style={{ fontSize: 9, color: "#c8a97e", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{m.tag}</span>}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif", marginTop: m.tag ? 4 : 0 }}>{m.name}</div>
            <p style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans',sans-serif", marginTop: 6, lineHeight: 1.6, margin: "6px 0" }}>{m.desc}</p>
            <div style={{ background: "#06060688", borderRadius: 8, padding: "10px 12px", margin: "8px 0" }}>
              <div style={{ fontSize: 11, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{m.price}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "8px 0" }}>
              <div style={{ fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ color: "#4ade80", fontWeight: 600, marginBottom: 2 }}>PROS</div>
                <div style={{ color: "#888", lineHeight: 1.5 }}>{m.pros}</div>
              </div>
              <div style={{ fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ color: "#f87171", fontWeight: 600, marginBottom: 2 }}>CONSIDERATIONS</div>
                <div style={{ color: "#888", lineHeight: 1.5 }}>{m.cons}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
              <strong>Best if:</strong> {m.best}
            </div>
          </div>
        ))}

        <div style={{ background: "#0f0a05", border: "1px solid #c8a97e33", borderRadius: 12, padding: "16px 20px", marginTop: 16 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", margin: "0 0 8px" }}>Why We Recommend Option C (Hybrid)</h4>
          <p style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans',sans-serif", margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: "#e0e0e0" }}>Base fee (Rp 850M)</strong> covers our actual build costs and resources — we don't subsidize our operations on hope.
            The <strong style={{ color: "#e0e0e0" }}>10-15% performance share</strong> only kicks in on verified incremental revenue above your current baseline, measured by an agreed methodology you control.
          </p>
          <p style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans',sans-serif", margin: "8px 0 0", lineHeight: 1.7 }}>
            At conservative estimates: Hairnerds pays Rp 1.025B total in year one (base + phase 0) and gains Rp 1.75B in new revenue. The performance share of 10-15% on that uplift = Rp 175-262M to us. Net gain to Hairnerds: Rp 1.3-1.5B. Both sides win. Neither side bleeds.
          </p>
          <p style={{ fontSize: 11, color: "#777", fontFamily: "'DM Sans',sans-serif", margin: "8px 0 0", lineHeight: 1.6, fontStyle: "italic" }}>
            Transparency note: These are starting points for negotiation, not take-it-or-leave-it numbers. The right structure is one where Hairnerds feels protected and TOMS VENTURES can sustainably deliver excellent work.
          </p>
        </div>
      </div>);

      case "close": return (<div>
        <SectionHead label="11" title="Why TOMS VENTURES" sub="What We Bring To This Table" />
        <p style={ps}>We will be honest about who we are and why that matters for Hairnerds specifically.</p>
        {[
          ["🏗️ Retail & Lifestyle Systems Architect", "TOMS VENTURES designs and builds operational technology for retail, sports, and lifestyle businesses. Our systems are running in production — handling real transactions, real customers, real operational decisions. We have built custom POS, CRM, real-time analytics dashboards, investor portals, and AI-powered automation for companies across Jakarta and internationally. We are not theorists pitching slides — we ship code that runs businesses."],
          ["⚡ Full-Stack Technical Capability", "Our architecture runs on modern production infrastructure: Supabase (database + auth + real-time), Vercel (deployment + edge), GitHub CI/CD, and the latest AI models for automation. We build custom booking systems, WhatsApp AI agents, financial dashboards, and Coretax-compliant payment flows. No outsourcing to offshore teams — everything is built and maintained by our core team."],
          ["🔄 Multi-System Portfolio", "We have architected and deployed systems across multiple business contexts: operational dashboards for sports facilities, investor-facing data portals, e-commerce integrations, automated financial reporting, and AI-driven analytics tools. Each project is different, but the core discipline is the same: turning fragmented manual operations into unified digital infrastructure that gives founders real-time visibility and control."],
          ["🧠 Deep Sector Knowledge", "We don't just build technology — we understand the business model underneath. Two decades of working across retail, consumer, gaming, and lifestyle ecosystems in Southeast Asia means we think about unit economics, customer LTV, staff incentive design, and brand positioning alongside the technical architecture. The system we build for Hairnerds won't just work — it will be designed around how barbershops actually make money."],
          ["🌆 Premium Jakarta Ecosystem", "TOMS VENTURES operates within the same premium Jakarta lifestyle ecosystem that Hairnerds serves. Through our ventures in sports and wellness, we share overlapping customer demographics and brand partnerships. This creates natural cross-marketing opportunities and a genuine understanding of the customer segment that an outside tech vendor simply cannot replicate."],
          ["🤝 Flexible, Honest Engagement", "We offered four engagement models because we respect that founders need options. We won't push one structure over another. Whether you want a clean contractor relationship or a deep partnership, we deliver the same quality of work. The difference is only in how costs and incentives are shared. We are transparent about our pricing because we want a sustainable working relationship, not a one-time invoice."],
        ].map(([t, d], i) => (
          <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid #111" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif" }}>{t}</div>
            <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans',sans-serif", marginTop: 6, lineHeight: 1.75 }}>{d}</div>
          </div>
        ))}

        <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: "16px 18px", marginTop: 24 }}>
          <p style={{ fontSize: 12, color: "#999", fontFamily: "'DM Sans',sans-serif", margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: "#e0e0e0" }}>A note on honesty:</strong> We are not a large agency with 200 employees. We are a lean, senior-led team that builds systems with the same rigor we apply to our own ventures. What we lack in headcount, we make up for in speed, direct founder access, and the fact that the person designing your architecture is the same person you'll talk to every week — not a junior PM translating your needs through three layers of hierarchy.
          </p>
        </div>

        <div style={{ margin: "32px 0", padding: 24, background: "#0a0a0a", border: "1px solid #c8a97e33", borderRadius: 16, textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "#e0e0e0", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>
            Hairnerds has 3 million followers, 7 years of brand equity, and a product line proven at scale.
            The window to build digital infrastructure that turns content dominance into business dominance is 12-18 months.
            This is about whether Hairnerds' next 7 years are defined by the founders' vision — or by competitors who built the systems first.
          </p>
          <div style={{ width: 40, height: 2, background: "#c8a97e", margin: "0 auto 20px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c8a97e", fontFamily: "'DM Sans',sans-serif", margin: "0 0 16px" }}>NEXT STEPS</h3>
          {[
            "60-minute strategic session — no pitch, just a real conversation about priorities and fit",
            "If there's mutual interest, we scope Phase 0 together and agree on the engagement model",
            "Phase 0 Discovery launches within 2 weeks of agreement — first working software in 16 weeks",
          ].map((st, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, justifyContent: "center", marginBottom: 10, textAlign: "left", maxWidth: 480, margin: "0 auto 10px" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#c8a97e", fontFamily: "'Cormorant Garamond',serif", minWidth: 18 }}>{i + 1}</span>
              <span style={{ fontSize: 13, color: "#b0b0b0", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{st}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <div style={{ width: 40, height: 2, background: "#c8a97e55", margin: "0 auto 16px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#c8a97e", fontFamily: "'Cormorant Garamond',serif" }}>Tomy</div>
          <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans',sans-serif" }}>System Architect · TOMS VENTURES</div>
          <div style={{ fontSize: 12, color: "#666", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>toms.ventures · Jakarta, Indonesia</div>
          <div style={{ fontSize: 10, color: "#444", fontFamily: "'DM Sans',sans-serif", marginTop: 16, letterSpacing: 1, textTransform: "uppercase" }}>Confidential · For Hairnerds Studio Founders Only</div>
        </div>
      </div>);

      case "jvmodel": return (
        <div style={{ margin: "-32px -20px -80px", position: "relative" }}>
          <iframe
            src="/jv-simulator.html"
            style={{
              width: "100vw",
              height: "calc(100vh - 90px)",
              border: "none",
              background: "#0a0a0a",
              display: "block",
              marginLeft: "calc(-50vw + 50%)",
            }}
            title="JV Revenue Simulator"
          />
        </div>
      );

      default: return null;
    }
  };

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "#e0e0e0", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

      {/* Top nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#050505ee", backdropFilter: "blur(12px)", borderBottom: "1px solid #111", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, fontWeight: 700, color: "#c8a97e", letterSpacing: 1 }}>HAIRNERDS × TOMS VENTURES</span>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer", padding: 4 }}>☰</button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#050505f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "#888", fontSize: 24, cursor: "pointer" }}>✕</button>
          {SECTIONS.map(id => (
            <button key={id} onClick={() => go(id)} style={{
              background: "none", border: "none", fontSize: 16, cursor: "pointer", padding: "8px 16px",
              color: active === id ? "#c8a97e" : "#666",
              fontFamily: "'DM Sans',sans-serif", fontWeight: active === id ? 700 : 400,
            }}>{SECTION_LABELS[id]}</button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 80px" }}>
        {renderSection()}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "#050505ee", backdropFilter: "blur(12px)", borderTop: "1px solid #111", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => prev && go(prev)} disabled={!prev} style={{ background: "none", border: "none", color: prev ? "#c8a97e" : "#333", fontSize: 12, cursor: prev ? "pointer" : "default", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>← {prev ? SECTION_LABELS[prev] : ""}</button>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {SECTIONS.map(navDot)}
        </div>
        <button onClick={() => next && go(next)} disabled={!next} style={{ background: "none", border: "none", color: next ? "#c8a97e" : "#333", fontSize: 12, cursor: next ? "pointer" : "default", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{next ? SECTION_LABELS[next] : ""} →</button>
      </div>
    </div>
  );
}
