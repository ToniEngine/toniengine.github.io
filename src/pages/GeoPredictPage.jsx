import { Link } from "react-router-dom";
import { geopredict as gp } from "../data/geopredict";
import { useDarkHero } from "../hooks/useDarkHero";
import Reveal from "../components/shared/Reveal";
import SectionNav from "../components/grip/SectionNav";
import "../styles/case-study.css";
import "../styles/geopredict.css";

function SectionHead({ index, title, lede }) {
  return (
    <header className="case-head">
      <span className="case-num">{index}</span>
      <h2>{title}</h2>
      {lede ? <p className="case-lede">{lede}</p> : null}
    </header>
  );
}

/**
 * Hero backdrop: stratigraphic bands with well-log traces running through them,
 * plus a sparse node lattice. Built from paths rather than an image so it stays
 * crisp and themes with the page.
 */
function SubsurfaceBackdrop() {
  return (
    <svg
      className="geo-backdrop"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="geo-strata">
        <path d="M0 250 C 180 220, 340 286, 520 262 S 880 214, 1200 244 L1200 300 L0 300 Z" />
        <path d="M0 320 C 200 296, 360 352, 540 330 S 900 288, 1200 314 L1200 372 L0 372 Z" />
        <path d="M0 400 C 220 376, 380 430, 560 408 S 920 368, 1200 394 L1200 600 L0 600 Z" />
      </g>

      <g className="geo-logs">
        <path d="M300 0 q 26 40 -4 80 q -30 40 4 80 q 30 40 -6 80 q -26 40 4 80 q 30 40 -4 80 q -26 40 6 80 q 24 40 -4 80" />
        <path d="M620 0 q -22 44 6 84 q 26 40 -8 78 q -30 42 6 82 q 26 38 -6 80 q -24 42 8 80 q 24 40 -6 80 q -22 36 6 76" />
        <path d="M940 0 q 30 38 -6 78 q -32 42 6 84 q 28 38 -4 78 q -28 42 6 82 q 26 38 -6 78 q -26 42 8 80 q 22 38 -4 76" />
      </g>

      <g className="geo-nodes">
        <circle cx="300" cy="160" r="4" />
        <circle cx="620" cy="248" r="4" />
        <circle cx="940" cy="330" r="4" />
        <circle cx="470" cy="404" r="3" />
        <circle cx="790" cy="122" r="3" />
      </g>
    </svg>
  );
}

export default function GeoPredictPage() {
  useDarkHero();

  return (
    <article className="case case-geo">
      {/* ── hero ───────────────────────────────────────────── */}
      <header className="case-hero geo-hero" id="overview">
        <div className="case-hero-grid" aria-hidden="true" />
        <SubsurfaceBackdrop />

        <div className="case-hero-inner">
          <Link to="/projects" className="case-back-top">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Projects
          </Link>

          <p className="case-categories">{gp.categories.join(" · ")}</p>

          <h1 className="case-title geo-title">{gp.name}</h1>
          <p className="case-subtitle">{gp.tagline}</p>
          <p className="geo-lede">{gp.lede}</p>

          <p className="geo-description">{gp.description}</p>

          <p className="case-badge">
            <i className="fa-solid fa-trophy" aria-hidden="true" /> {gp.badge}
          </p>

          <div className="cta-buttons geo-hero-cta">
            {gp.platformUrl ? (
              <a
                href={gp.platformUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                View Platform
              </a>
            ) : null}
            <a href="#problem" className="btn btn-secondary">
              View Case Study
            </a>
          </div>

          <dl className="case-meta">
            {gp.meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <SectionNav sections={gp.sections} />

      <div className="case-body">
        {/* ── 01 problem ───────────────────────────────────── */}
        <section className="case-section" id="problem">
          <Reveal>
            <SectionHead index="01" title={gp.problem.heading} lede={gp.problem.lede} />
          </Reveal>

          <div className="problem-grid">
            {gp.problem.cards.map((card) => (
              <Reveal key={card.key} className="problem-card">
                <div className="problem-inner">
                  <i className={card.icon} aria-hidden="true" />
                  <h3>{card.key}</h3>
                  <p>{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <blockquote className="pull-quote">{gp.problem.pullQuote}</blockquote>
          </Reveal>
        </section>

        {/* ── 02 solution ──────────────────────────────────── */}
        <section className="case-section" id="solution">
          <Reveal>
            <SectionHead index="02" title={gp.solution.heading} />
          </Reveal>

          <Reveal>
            <ol className="workflow-strip">
              {gp.solution.workflow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <div className="pipeline">
              {gp.solution.pipeline.map((node, index) => (
                <div
                  className={`pipeline-node ${node.key ? "is-key" : ""} ${
                    node.human ? "is-human" : ""
                  }`}
                  key={node.step}
                >
                  <span className="pipeline-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="pipeline-icon">
                    <i className={node.icon} aria-hidden="true" />
                  </span>
                  <h3>{node.step}</h3>
                  <p>{node.note}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="geo-callout">
              <i className="fa-solid fa-user-check" aria-hidden="true" />
              <span>{gp.solution.callout}</span>
            </p>
          </Reveal>
        </section>

        {/* ── 03 what we built ─────────────────────────────── */}
        <section className="case-section" id="built">
          <Reveal>
            <SectionHead index="03" title={gp.built.heading} />
          </Reveal>

          <div className="feature-grid">
            {gp.built.features.map((feature) => (
              <Reveal key={feature.title} className="feature">
                <div className="feature-inner">
                  <span className="feature-icon">
                    <i className={feature.icon} aria-hidden="true" />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 04 how the AI works ──────────────────────────── */}
        <section className="case-section" id="how">
          <Reveal>
            <SectionHead index="04" title={gp.how.heading} lede={gp.how.lede} />
          </Reveal>

          <Reveal>
            <div className="arch">
              {gp.how.flow.map((node) => (
                <div className={`arch-node ${node.highlight ? "is-key" : ""}`} key={node.title}>
                  <div className="arch-node-inner">
                    <h3>{node.title}</h3>
                    <p>{node.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="geo-explainer">{gp.how.explainer}</p>
          </Reveal>
        </section>

        {/* ── 05 technology ────────────────────────────────── */}
        <section className="case-section" id="tech">
          <Reveal>
            <SectionHead index="05" title={gp.tech.heading} lede={gp.tech.lede} />
          </Reveal>

          <div className="stack-grid">
            {gp.tech.stack.map((group) => (
              <Reveal key={group.category} className="stack-card">
                <div className="stack-inner">
                  <div className="stack-head">
                    <i className={group.icon} aria-hidden="true" />
                    <h3>{group.category}</h3>
                  </div>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 06 my role ───────────────────────────────────── */}
        <section className="case-section" id="role">
          <Reveal>
            <SectionHead index="06" title={gp.role.heading} />
          </Reveal>

          <Reveal>
            <p className="role-body">{gp.role.body}</p>
          </Reveal>

          <Reveal>
            <div className="disciplines">
              <span className="disciplines-label">Cross-disciplinary collaboration</span>
              <div className="disciplines-row">
                {gp.role.disciplines.map((discipline, index) => (
                  <span key={discipline} className="discipline">
                    {index > 0 ? <em aria-hidden="true">&times;</em> : null}
                    {discipline}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <ol className="arc">
              {gp.role.arc.map((item) => (
                <li key={item.step} className={item.win ? "is-win" : ""}>
                  <span className="arc-marker" aria-hidden="true" />
                  <div>
                    <h3>{item.step}</h3>
                    <p>{item.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* ── 07 validation ────────────────────────────────── */}
        <section className="case-section" id="validation">
          <Reveal>
            <SectionHead index="07" title={gp.validation.heading} />
          </Reveal>

          <Reveal>
            <div className="award-card">
              <div className="award-emblem" aria-hidden="true">
                <i className="fa-solid fa-trophy" />
              </div>
              <div className="award-body">
                <p className="award-place">{gp.validation.award.place}</p>
                <p className="award-event">{gp.validation.award.event}</p>
                <p className="award-org">{gp.validation.award.year}</p>
                <p className="award-desc">{gp.validation.award.description}</p>
              </div>
            </div>
          </Reveal>

          <div className="validation-grid">
            {gp.validation.points.map((point) => (
              <Reveal key={point.title} className="validation-item">
                <div className="validation-inner">
                  <i className={point.icon} aria-hidden="true" />
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 08 impact ────────────────────────────────────── */}
        <section className="case-section" id="impact">
          <Reveal>
            <SectionHead index="08" title={gp.impact.heading} />
          </Reveal>

          <div className="impact-grid">
            {gp.impact.areas.map((area) => (
              <Reveal key={area.title} className="impact-item">
                <div className="impact-inner">
                  <span className="impact-icon">
                    <i className={area.icon} aria-hidden="true" />
                  </span>
                  <h3>{area.title}</h3>
                  <p>{area.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 09 road ahead ────────────────────────────────── */}
        <section className="case-section" id="next">
          <Reveal>
            <SectionHead index="09" title={gp.next.heading} lede={gp.next.lede} />
          </Reveal>

          <Reveal>
            <ol className="horizon">
              {gp.next.stages.map((stage) => (
                <li key={stage.when}>
                  <span className="horizon-when">{stage.when}</span>
                  <p>{stage.title}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* ── 10 lessons ───────────────────────────────────── */}
        <section className="case-section" id="lessons">
          <Reveal>
            <SectionHead index="10" title={gp.lessons.heading} />
          </Reveal>

          <Reveal>
            <blockquote className="pull-quote">{gp.lessons.quote}</blockquote>
          </Reveal>

          <div className="lesson-grid geo-lessons">
            {gp.lessons.items.map((item) => (
              <Reveal key={item.title} className="lesson">
                <div className="lesson-inner is-detailed">
                  <i className={item.icon} aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── cta ──────────────────────────────────────────── */}
        <Reveal>
          <section className="case-cta">
            <h2>{gp.cta.heading}</h2>
            <p className="case-cta-body">{gp.cta.body}</p>
            <div className="case-cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                Contact Me
              </Link>
              <Link to="/projects" className="btn btn-outline">
                View My Other Projects
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
