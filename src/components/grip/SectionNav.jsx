import { useEffect, useRef, useState } from "react";

/**
 * Sticky in-page navigation for the case study, plus a scroll-progress bar.
 * The active section is tracked with one IntersectionObserver over all
 * sections rather than a scroll listener doing layout reads on every frame.
 */
export default function SectionNav({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (!elements.length) {
      return undefined;
    }

    // Track how much of each section is on screen; the leader wins.
    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let best = "";
        let bestRatio = 0;

        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });

        if (best) {
          setActiveId(best);
        }
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: "-88px 0px -45% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  // Keep the active chip in view on narrow screens, where the nav scrolls.
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector('[data-active="true"]');

    if (list && active && list.scrollWidth > list.clientWidth) {
      const offset = active.offsetLeft - list.clientWidth / 2 + active.clientWidth / 2;
      list.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div className="case-nav">
      <div className="case-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <nav className="case-nav-inner" aria-label="Case study sections">
        <ul ref={listRef}>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-active={activeId === section.id}
                aria-current={activeId === section.id ? "true" : undefined}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
