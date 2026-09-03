import { Link } from "react-router-dom";
import { assetPath } from "../../utils/assetPath";
import Reveal from "./Reveal";

export default function ProjectCard({ project }) {
  // Three kinds of destination: an in-app route, a static page shipped from
  // public/ (needs the deploy base prefix), or an external URL.
  const isRoute = Boolean(project.route);
  const href = project.internal ? assetPath(project.link) : project.link;
  const linkProps = project.internal || isRoute ? {} : { target: "_blank", rel: "noreferrer" };

  const Anchor = ({ className, children }) =>
    isRoute ? (
      <Link to={project.route} className={className}>
        {children}
      </Link>
    ) : (
      <a href={href} className={className} {...linkProps}>
        {children}
      </a>
    );

  return (
    <Reveal className="project-card">
      <article>
        <div className="project-image">
          <img src={assetPath(project.image)} alt={project.title} loading="lazy" />
        </div>
        <div className="project-content">
          <Anchor>
            <h3>{project.title}</h3>
          </Anchor>
          <p>{project.description}</p>
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={`${project.id}-${tag}`} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
          {project.cta ? (
            <Anchor className="btn btn-primary compact-btn project-cta">{project.cta}</Anchor>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}
