import { useCallback, useEffect, useState } from "react";
import { assetPath } from "../../utils/assetPath";

/**
 * Victory gallery. Slots without a `src` render as labelled placeholders -
 * no stock photography stands in for the real competition photographs.
 * Only filled slots are clickable and enter the lightbox.
 */
export default function Gallery({ items }) {
  const filled = items.filter((item) => item.src);
  const [openIndex, setOpenIndex] = useState(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (delta) => {
      setOpenIndex((current) => {
        if (current === null || !filled.length) {
          return current;
        }

        return (current + delta + filled.length) % filled.length;
      });
    },
    [filled.length]
  );

  useEffect(() => {
    if (openIndex === null) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      }
    };

    // Stop the page behind the lightbox from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : filled[openIndex];

  return (
    <>
      <div className="gallery-grid">
        {items.map((item) => {
          if (!item.src) {
            return (
              <figure key={item.id} className="gallery-item is-placeholder">
                <div className="gallery-frame">
                  <i className="fa-regular fa-image" aria-hidden="true" />
                  <span>{item.placeholder}</span>
                  <small>Photo to be added</small>
                </div>
                <figcaption>{item.caption}</figcaption>
              </figure>
            );
          }

          const position = filled.indexOf(item);

          return (
            <figure key={item.id} className="gallery-item">
              <button
                type="button"
                className="gallery-frame"
                onClick={() => setOpenIndex(position)}
                aria-label={`Open photo: ${item.caption}`}
              >
                <img src={assetPath(item.src)} alt={item.caption} loading="lazy" />
                <span className="gallery-zoom" aria-hidden="true">
                  <i className="fa-solid fa-expand" />
                </span>
              </button>
              <figcaption>{item.caption}</figcaption>
            </figure>
          );
        })}
      </div>

      {active ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
        >
          <button type="button" className="lightbox-close" onClick={close} aria-label="Close">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>

          {filled.length > 1 ? (
            <button
              type="button"
              className="lightbox-nav prev"
              aria-label="Previous photo"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
            >
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
          ) : null}

          <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
            <img src={assetPath(active.src)} alt={active.caption} />
            <figcaption>{active.caption}</figcaption>
          </figure>

          {filled.length > 1 ? (
            <button
              type="button"
              className="lightbox-nav next"
              aria-label="Next photo"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
            >
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
