import { useState } from "react";
import { Link } from "react-router-dom";
import { grip } from "../data/grip";
import { assetPath } from "../utils/assetPath";
import { useDarkHero } from "../hooks/useDarkHero";
import Reveal from "../components/shared/Reveal";
import SectionNav from "../components/grip/SectionNav";
import Gallery from "../components/grip/Gallery";
import "../styles/case-study.css";

function SectionHead({ index, title, lede }) {
  return (
    <header className="case-head">
      <span className="case-num">{index}</span>
      <h2>{title}</h2>
      {lede ? <p className="case-lede">{lede}</p> : null}
    </header>
  );
}

function ContributionCard({ area, isOpen, onToggle }) {
  return (
    <div className={`contrib-card ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="contrib-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`contrib-${area.id}`}
      >
        <span className="contrib-icon">
          <i className={area.icon} aria-hidden="true" />
        </span>
        <span className="contrib-title">{area.title}</span>
        <i className="fa-solid fa-chevron-down contrib-chevron" aria-hidden="true" />
      </button>

      <div className="contrib-body" id={`contrib-${area.id}`} hidden={!isOpen}>
        {area.intro ? <p className="contrib-intro">{area.intro}</p> : null}
        <ul>
          {area.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function GripPage() {
  useDarkHero();
  const [openContribution, setOpenContribution] = useState(grip.contribution.areas[0].id);
  const [activePhase, setActivePhase] = useState(0);

  const phase = grip.roadmap.phases[activePhase];

  return (
    <article className="case">
      {/* ── hero ───────────────────────────────────────────── */}
      <header
        className={`case-hero ${grip.heroImage ? "has-photo" : ""}`}
        style={
          grip.heroImage
            ? { backgroundImage: `url(${assetPath(grip.heroImage)})` }
            : undefined
        }
        id="overview"
      >
        <div className="case-hero-grid" aria-hidden="true" />
        <svg className="case-hero-net" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="net-lines">
            <path d="M-50 480 H420 L520 380 H860 L960 280 H1250" />
            <path d="M-50 200 H300 L400 300 H760 L880 420 H1250" />
            <path d="M-50 330 H1250" />
          </g>
          <g className="net-nodes">
            <circle cx="420" cy="480" r="4" />
            <circle cx="860" cy="380" r="4" />
            <circle cx="300" cy="200" r="4" />
            <circle cx="760" cy="300" r="4" />
          </g>
        </svg>

        <div className="case-hero-inner">
          <Link to="/projects" className="case-back-top">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Projects
          </Link>

          <p className="case-categories">{grip.categories.join(" · ")}</p>

          <h1 className="case-title">{grip.name}</h1>
          <p className="case-subtitle">{grip.fullName}</p>
          <p className="case-tagline">{grip.tagline}</p>

          <p className="case-badge">
            <i className="fa-solid fa-trophy" aria-hidden="true" /> {grip.badge}
          </p>

          <dl className="case-meta">
            {grip.meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>

          {grip.heroImage ? null : (
            <p className="case-photo-hint">
              <i className="fa-regular fa-image" aria-hidden="true" /> Team victory photograph
              slot &mdash; set <code>heroImage</code> in <code>src/data/grip.js</code>
            </p>
          )}
        </div>
      </header>

      <SectionNav sections={grip.sections} />

      <div className="case-body">
        <Reveal>
          <p className="case-overview">{grip.overview}</p>
        </Reveal>

        {/* ── 01 challenge ─────────────────────────────────── */}
        <section className="case-section" id="challenge">
          <Reveal>
            <SectionHead index="01" title="The Challenge" lede={grip.challenge.lede} />
          </Reveal>

          <Reveal>
            <div className="chain">
              {grip.challenge.chain.map((stage) => (
                <div className="chain-stage" key={stage.stage}>
                  <div className="chain-label">
                    <span className="chain-dot" aria-hidden="true" />
                    {stage.stage}
                  </div>
                  <div className="chain-items">
                    {stage.constraints.map((constraint) => (
                      <div className="chain-item" key={constraint.title}>
                        <h3>{constraint.title}</h3>
                        <p>{constraint.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── 02 solution ──────────────────────────────────── */}
        <section className="case-section" id="solution">
          <Reveal>
            <SectionHead index="02" title={grip.solution.heading} lede={grip.solution.lede} />
          </Reveal>

          <div className="component-grid">
            {grip.solution.components.map((component) => (
              <Reveal key={component.code} className="component">
                <div className="component-inner">
                  <div className="component-top">
                    <span className="component-icon">
                      <i className={component.icon} aria-hidden="true" />
                    </span>
                    <span className="component-code">{component.code}</span>
                  </div>
                  <h3>
                    {component.abbr}
                    <span>{component.title}</span>
                  </h3>
                  <p>{component.body}</p>

                  {component.offtakers ? (
                    <ul className="offtaker-list">
                      {component.offtakers.map((offtaker) => (
                        <li key={offtaker}>{offtaker}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 03 contribution ──────────────────────────────── */}
        <section className="case-section" id="contribution">
          <Reveal>
            <SectionHead index="03" title="My Contribution" lede={grip.contribution.lede} />
            <p className="role-line">
              <span>Role</span> {grip.contribution.role}
            </p>
          </Reveal>

          <Reveal>
            <div className="contrib-list">
              {grip.contribution.areas.map((area) => (
                <ContributionCard
                  key={area.id}
                  area={area}
                  isOpen={openContribution === area.id}
                  onToggle={() =>
                    setOpenContribution((current) => (current === area.id ? null : area.id))
                  }
                />
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── 04 architecture ──────────────────────────────── */}
        <section className="case-section" id="architecture">
          <Reveal>
            <SectionHead index="04" title="Project Architecture" lede={grip.architecture.lede} />
          </Reveal>

          <Reveal>
            <div className="arch">
              {grip.architecture.flow.map((node, index) => (
                <div
                  className={`arch-node ${node.highlight ? "is-key" : ""}`}
                  key={node.title}
                  style={{ "--i": index }}
                >
                  <div className="arch-node-inner">
                    <h3>{node.title}</h3>
                    <p>{node.note}</p>
                  </div>
                </div>
              ))}

              <div className="arch-branches">
                {grip.architecture.branches.map((branch) => (
                  <div className="arch-branch" key={branch.title}>
                    <i className={branch.icon} aria-hidden="true" />
                    <span>{branch.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── 05 commercial ────────────────────────────────── */}
        <section className="case-section" id="commercial">
          <Reveal>
            <SectionHead index="05" title={grip.commercial.heading} lede={grip.commercial.lede} />
          </Reveal>

          <div className="pillar-grid">
            {grip.commercial.pillars.map((pillar) => (
              <Reveal key={pillar.title} className={`pillar ${pillar.caveat ? "is-caveat" : ""}`}>
                <div className="pillar-inner">
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="equation">
              <div className="equation-inputs">
                {grip.commercial.equation.inputs.map((input, index) => (
                  <div className="equation-term" key={input}>
                    {index > 0 ? <span className="equation-op" aria-hidden="true">+</span> : null}
                    <span className="equation-chip">{input}</span>
                  </div>
                ))}
              </div>
              <div className="equation-rule" aria-hidden="true" />
              <p className="equation-output">{grip.commercial.equation.output}</p>
            </div>
          </Reveal>

          <Reveal>
            <p className="case-note">
              <i className="fa-solid fa-circle-info" aria-hidden="true" />
              {grip.commercial.disclaimer}
            </p>
          </Reveal>
        </section>

        {/* ── 06 roadmap ───────────────────────────────────── */}
        <section className="case-section" id="roadmap">
          <Reveal>
            <SectionHead index="06" title="Implementation Roadmap" lede={grip.roadmap.lede} />
          </Reveal>

          <Reveal>
            <div className="roadmap">
              <div className="roadmap-track" role="tablist" aria-label="Implementation phases">
                {grip.roadmap.phases.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    role="tab"
                    id={`phase-tab-${index}`}
                    aria-selected={activePhase === index}
                    aria-controls={`phase-panel-${index}`}
                    className={`roadmap-step ${activePhase === index ? "active" : ""} ${
                      index < activePhase ? "passed" : ""
                    }`}
                    onClick={() => setActivePhase(index)}
                  >
                    <span className="roadmap-marker" aria-hidden="true" />
                    <span className="roadmap-window">{item.window}</span>
                    <span className="roadmap-name">{item.name}</span>
                  </button>
                ))}
              </div>

              <div
                className="roadmap-panel"
                role="tabpanel"
                id={`phase-panel-${activePhase}`}
                aria-labelledby={`phase-tab-${activePhase}`}
              >
                <div className="roadmap-panel-head">
                  <h3>{phase.name}</h3>
                  <span className="roadmap-badge">{phase.window}</span>
                </div>
                <ul>
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── 07 risk ──────────────────────────────────────── */}
        <section className="case-section" id="risk">
          <Reveal>
            <SectionHead index="07" title="Risk & Resilience" lede={grip.risk.lede} />
          </Reveal>

          <Reveal>
            <div className="risk-grid">
              {grip.risk.risks.map((item) => (
                <div className="risk-item" key={item.name}>
                  <span className="risk-category">{item.category}</span>
                  <h3>{item.name}</h3>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="principle">
              {grip.risk.principle.map((step, index) => (
                <div className="principle-step" key={step}>
                  <span className="principle-index">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── 08 competition ───────────────────────────────── */}
        <section className="case-section" id="achievement">
          <Reveal>
            <SectionHead index="08" title={grip.competition.heading} />
          </Reveal>

          <Reveal>
            <ol className="journey">
              {grip.competition.journey.map((item) => (
                <li key={item.step} className={item.win ? "is-win" : ""}>
                  <span className="journey-icon">
                    <i className={item.icon} aria-hidden="true" />
                  </span>
                  <span className="journey-label">{item.step}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <div className="award-card">
              <div className="award-emblem" aria-hidden="true">
                <i className="fa-solid fa-trophy" />
              </div>
              <div className="award-body">
                <p className="award-place">{grip.competition.award.place}</p>
                <p className="award-event">{grip.competition.award.event}</p>
                <p className="award-org">
                  {grip.competition.award.org} &middot; {grip.competition.award.year}
                </p>
                <p className="award-desc">&ldquo;{grip.competition.award.description}&rdquo;</p>
                <p className="award-follow">{grip.competition.followUp}</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── 09 gallery ───────────────────────────────────── */}
        <section className="case-section" id="gallery">
          <Reveal>
            <SectionHead
              index="09"
              title="Victory Gallery"
              lede="Photographs from the NEITC Challenge."
            />
          </Reveal>

          <Reveal>
            <Gallery items={grip.gallery} />
          </Reveal>
        </section>

        {/* ── 10 lessons ───────────────────────────────────── */}
        <section className="case-section" id="lessons">
          <Reveal>
            <SectionHead index="10" title="What the Project Taught Me" />
          </Reveal>

          <div className="lesson-grid">
            {grip.lessons.map((lesson) => (
              <Reveal key={lesson.title} className="lesson">
                <div className="lesson-inner">
                  <i className={lesson.icon} aria-hidden="true" />
                  <p>{lesson.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── outcome + cta ────────────────────────────────── */}
        <Reveal>
          <section className="outcome">
            <p className="outcome-statement">{grip.outcome.statement}</p>

            <p className="outcome-award">
              <i className="fa-solid fa-trophy" aria-hidden="true" /> 1st Place &mdash; NEITC
              Challenge 2026
            </p>

            <p className="outcome-role">
              <span>My role</span> {grip.outcome.role}
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="case-cta">
            <h2>{grip.cta.question}</h2>
            <div className="case-cta-buttons">
              <Link to="/projects" className="btn btn-primary">
                View More Projects
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact Me
              </Link>
            </div>
            <Link to="/projects" className="case-back">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back to Projects
            </Link>
          </section>
        </Reveal>
      </div>
    </article>
  );
}
