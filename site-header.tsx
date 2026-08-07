import Image from "next/image"
import { SiteHeader } from "@/components/site-header";

const Arrow = () => <span aria-hidden="true">↗</span>;

const skills = [
  "Python", "SQL", "JavaScript", "FastAPI", "Docker", "Power BI",
  "PostgreSQL", "NLP", "Machine Learning", "REST APIs", "SoftOne ERP", "Git",
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse" /> Based in Serres, Greece · Open to opportunities</p>
          <h1>I turn complex data into <em>useful systems.</em></h1>
          <p className="intro">Data scientist and software engineer working at the intersection of machine learning, APIs, and business operations.</p>
          <div className="actions">
            <a className="button primary" href="#work">Explore my work <Arrow /></a>
            <a className="button secondary" href="mailto:dimitrios@ioannidis.dev">Let&apos;s talk</a>
          </div>
        </div>
        <div className="signal-card" aria-label="Professional snapshot">
          <div className="signal-head"><span>PROFILE / 01</span><span>ACTIVE</span></div>
          <div className="orb">
            <div className="orb-core">
              <Image
                src="/dimitris.png"
                alt="Dimitrios Ioannidis"
                fill
                className="object-cover"
                sizes="160px"
                priority
              />
            </div>
          </div>
          <div className="signal-grid">
            <div><strong>200+</strong><span>business clients</span></div>
            <div><strong>2 yrs</strong><span>industry experience</span></div>
            <div><strong>MSc</strong><span>Data Science graduate</span></div>
            <div><strong>C2</strong><span>English proficiency</span></div>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Areas of expertise">
        <div className="ticker-track">
          <div className="ticker-group">
            DATA SCIENCE <span>✦</span> SOFTWARE ENGINEERING <span>✦</span> MACHINE LEARNING <span>✦</span> ERP &amp; AUTOMATION <span>✦</span>
          </div>
          <div className="ticker-group" aria-hidden="true">
            DATA SCIENCE <span>✦</span> SOFTWARE ENGINEERING <span>✦</span> MACHINE LEARNING <span>✦</span> ERP &amp; AUTOMATION <span>✦</span>
          </div>
        </div>
      </section>

      <section className="section shell" id="work">
        <div className="section-label">01 / Selected impact</div>
        <div className="section-heading">
          <h2>Built for the real world.</h2>
          <p>I pair analytical depth with practical engineering—shipping systems that improve how people work.</p>
        </div>

        <div className="case-grid">
          <article className="case case-featured">
            <div className="case-index">01</div>
            <div className="case-content">
              <p className="kicker">ERP · Compliance · Scale</p>
              <h3>Digital Work Card rollout</h3>
              <p>Led SoftOne ERP implementations for more than 200 businesses across Greece, aligning operations with Ministry of Labor compliance requirements.</p>
              <div className="tags"><span>SoftOne ERP</span><span>Consulting</span><span>Delivery</span></div>
            </div>
            <strong className="big-number">200<span>+</span></strong>
          </article>
          <article className="case">
            <div className="case-index">02</div>
            <p className="kicker">APIs · Integration</p>
            <h3>Connected business systems</h3>
            <p>Developed custom JavaScript web services and integrated SoftOne with a mobile B2B app, improving access for external sales teams.</p>
            <div className="tags"><span>REST APIs</span><span>JavaScript</span><span>B2B</span></div>
          </article>
          <article className="case dark-case">
            <div className="case-index">03</div>
            <p className="kicker">Web app · Automation</p>
            <h3>Smarter support operations</h3>
            <p>Designed an internal interface to automate ticket assignment and track support time, increasing workflow transparency and efficiency.</p>
            <div className="tags"><span>Full-stack</span><span>Workflow</span><span>UX</span></div>
          </article>
        </div>
      </section>

      <section className="section about" id="about">
        <div className="shell about-grid">
          <div>
            <div className="section-label">02 / About</div>
            <h2>Engineer&apos;s mindset.<br/><em>Scientist&apos;s curiosity.</em></h2>
          </div>
          <div className="about-copy">
            <p>I&apos;m an Informatics Engineer and Data Science MSc graduate who enjoys moving between models, code, and real business problems.</p>
            <p>My master&apos;s thesis explored anomaly and fact-checking detection in social media data for crisis management, using NLP, text mining, and machine learning.</p>
            <div className="education">
              <div><span>2024—2026</span><strong>MSc, Data Science</strong><small>Luleå University of Technology, Sweden · Graduated 2026</small></div>
              <div><span>2018—2022</span><strong>BSc, Informatics Engineering</strong><small>International Hellenic University, Greece · 8.03/10</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell skills-section">
        <div className="section-label">03 / Toolkit</div>
        <div className="skills-layout">
          <h2>Tools I use to<br/>make ideas <em>work.</em></h2>
          <div className="skill-cloud">{skills.map((skill, i) => <span key={skill} className={i < 4 ? "hot" : ""}>{skill}</span>)}</div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell contact-inner">
          <p className="eyebrow">Have a problem worth solving?</p>
          <h2>Let&apos;s build something<br/><em>useful.</em></h2>
          <a className="contact-link" href="mailto:dimitrios@ioannidis.dev">dimitrios@ioannidis.dev <Arrow /></a>
          <div className="footer-row">
            <span>© 2026 Dimitrios Ioannidis</span>
            <div><a href="https://www.linkedin.com/in/dimitrios-ioannidis-dev/" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href="/dimitrios-ioannidis-resume.pdf" target="_blank">Résumé <Arrow /></a></div>
          </div>
        </div>
      </section>
    </main>
  );
}
