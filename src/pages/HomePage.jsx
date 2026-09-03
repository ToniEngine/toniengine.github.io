import { Link } from "react-router-dom";
import ProjectCard from "../components/shared/ProjectCard";
import BlogCard from "../components/shared/BlogCard";
import SectionTitle from "../components/shared/SectionTitle";
import { projects } from "../data/projects";
import { articles } from "../data/articles";
import { heroTexts } from "../data/site";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { sortByPublishedDate } from "../utils/date";
import { assetPath } from "../utils/assetPath";
import { useDarkHero } from "../hooks/useDarkHero";

export default function HomePage() {
  useDarkHero();
  const typingText = useTypingEffect(heroTexts, 110, 60, 1800);

  const featuredProjects = projects.filter((project) => project.featured).slice(0, 4);
  const latestArticles = sortByPublishedDate(articles).slice(0, 6);

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `url(${assetPath("Pictures/bg_images/pexels-felixmittermeier-956999.jpg")})`
        }}
      >
        <div className="hero-content">
          <p className="hero-eyebrow">Available for work &middot; Port Harcourt, NG</p>
          <h1>Hi, I&rsquo;m Anthony</h1>
          <div className="text-display">{typingText}</div>
          <div className="cta-buttons">
            <Link to="/projects" className="btn btn-primary">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      <section className="container">
        <SectionTitle
          title="Featured Projects"
          subtitle="Some of my recent AI, data analysis, and automation projects"
        />
        <div className="projects-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/projects" className="read-more">
            Explore all projects <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="container">
        <SectionTitle title="Latest Articles" subtitle="Recent writings from my Medium blog" />
        <div className="blog-grid">
          {latestArticles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/blog" className="read-more">
            Read all articles <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
