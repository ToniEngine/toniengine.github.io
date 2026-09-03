import { Link, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/shared/ScrollToTop";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import GripPage from "./pages/GripPage";
import GeoPredictPage from "./pages/GeoPredictPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import "./styles.css";

function NotFoundPage() {
  return (
    <section className="container page-top-gap not-found">
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Go back home
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/grip" element={<GripPage />} />
          <Route path="/projects/geopredict" element={<GeoPredictPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
