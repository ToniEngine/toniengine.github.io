import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { quickLinks } from "../../data/site";
import { assetPath } from "../../utils/assetPath";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const showToast = useToast();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleResumeDownload = () => {
    const fileName = "Anthony_Obot_Resume.pdf";
    const link = document.createElement("a");
    link.href = assetPath(fileName);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Resume downloaded successfully.");
  };

  return (
    <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
      <div className="nav-container">
        <NavLink to="/" className="logo">
          Anthony Obot
        </NavLink>

        <ul id="primary-navigation" className={`nav-links ${menuOpen ? "active" : ""}`}>
          {quickLinks.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`.trim()}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <button type="button" className="resume-btn" onClick={handleResumeDownload}>
              Get my Resume
            </button>
          </li>
        </ul>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <i className={theme === "dark" ? "fa-regular fa-sun" : "fa-regular fa-moon"} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="mobile-menu"
            aria-label="Toggle navigation"
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
