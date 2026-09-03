import { assetPath } from "../../utils/assetPath";
import { formatPublishedDate } from "../../utils/date";
import Reveal from "./Reveal";

export default function BlogCard({ article }) {
  return (
    <Reveal className="blog-card">
      <article>
        <div className="blog-image">
          <img src={assetPath(article.image)} alt={article.title} loading="lazy" />
        </div>
        <div className="blog-content">
          <div className="blog-meta">
            <span>
              <i className="fa-regular fa-calendar" aria-hidden="true" /> {formatPublishedDate(article.publishedAt)}
            </span>
            <span>
              <i className="fa-regular fa-clock" aria-hidden="true" /> {article.readTime}
            </span>
          </div>
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
          <a href={article.link} className="read-more" target="_blank" rel="noreferrer">
            Read More <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </Reveal>
  );
}
