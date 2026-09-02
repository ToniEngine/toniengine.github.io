import { assetPath } from "../../utils/assetPath";
import Reveal from "./Reveal";

export default function ProjectCard({ project }) {
  // Internal projects are static pages shipped from public/, so they need the
  // deploy base prefix; external ones already carry a full URL.
  const href = project.internal ? assetPath(project.link) : project.link;
  const linkProps = project.internal ? {} : { target: "_blank", rel: "noreferrer" };

  return (
    <Reveal className="project-card">
      <article>
        <div className="project-image">
          <img src={assetPath(project.image)} alt={project.title} loading="lazy" />
        </div>
        <div className="project-content">
          <a href={href} {...linkProps}>
            <h3>{project.title}</h3>
          </a>
          <p>{project.description}</p>
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={`${project.id}-${tag}`} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
          {project.cta ? (
            <a href={href} {...linkProps} className="btn btn-primary compact-btn project-cta">
              {project.cta}
            </a>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}
