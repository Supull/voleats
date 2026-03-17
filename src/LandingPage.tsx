import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { useAuth } from "./hooks/useAuth";

const DINING_HALLS = [
  { id: 1, name: "Rocky Top Dining Hall", hours: "7AM – 10PM", tag: "Most Popular", route: "/rocky-top" },
  { id: 2, name: "Stokely Dining Hall",   hours: "7AM – 8PM",  tag: "All Day",      route: "/stokely"   },
];

const TAGS = [
  { label: "High Protein", emoji: "💪", color: "#FF6B35" },
  { label: "Vegetarian",   emoji: "🥦", color: "#4CAF50" },
  { label: "Vegan",        emoji: "🌱", color: "#8BC34A" },
  { label: "Low Calorie",  emoji: "⚡", color: "#00BCD4" },
  { label: "Gluten Free",  emoji: "🌾", color: "#FF9800" },
  { label: "Halal",        emoji: "✦", color: "#9C27B0"  },
];

const TICKER_ITEMS = [
  "NOW SERVING", "ROCKY TOP DINING HALL", "•",
  "STOKELY DINING HALL", "•", "FRESH DAILY", "•",
];

function getCurrentMeal(): string {
  const h = new Date().getHours();
  if (h < 10) return "Breakfast";
  if (h < 14) return "Lunch";
  if (h < 20) return "Dinner";
  return "Late Night";
}

export default function LandingPage() {
  const { user, loading, error } = useAuth();
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loaded, setLoaded]             = useState(false);
  const [time, setTime]                 = useState(new Date());
  const [showModal, setShowModal]       = useState(false);

  useEffect(() => {
    const loadTimer  = setTimeout(() => setLoaded(true), 100);
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearTimeout(loadTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setShowModal(false);
  };

  const toggleTag = (label: string) => {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const meal     = getCurrentMeal();
  const clockStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const cls      = (delay: string) => ({ animationDelay: delay });

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-inner">
          <div className="auth-loading-icon">🍽</div>
          <div className="auth-loading-spinner" />
          <span className="auth-loading-text">Getting your session ready...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-inner">
          <div className="auth-loading-icon">⚠️</div>
          <span className="auth-loading-text">Failed to connect. Please refresh.</span>
          <span className="auth-error-detail">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="voleats">
      <div className="noise-overlay" />

      {/* ── Dining Hall Picker Modal ── */}
      {showModal && (
        <div className="modal-backdrop" onClick={handleBackdrop}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <p className="modal-eyebrow">Choose a dining hall</p>
            <h2 className="modal-title">Where are you eating?</h2>
            <div className="modal-halls">
              {DINING_HALLS.map((hall) => (
                <button
                  key={hall.id}
                  className="modal-hall-btn"
                  onClick={() => navigate(hall.route)}
                >
                  <div className="modal-hall-info">
                    <span className="modal-hall-name">{hall.name}</span>
                    <span className="modal-hall-hours">{hall.hours}</span>
                  </div>
                  <span className="modal-hall-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Ticker ── */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {[0, 1].map((i) => (
            <span key={i} className="ticker-inner">
              {[meal.toUpperCase(), ...TICKER_ITEMS].map((item, j) => (
                <span key={j} className="ticker-item">{item}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className={`nav fade-up ${loaded ? "loaded" : ""}`}>
        <div className="nav-logo">
          <div className="nav-logo-icon">🍽</div>
          <span className="nav-logo-text">VolEats</span>
        </div>
        <div className="nav-right">
          <div className="nav-time">
            <span className="live-dot" />
            <span className="nav-time-text">{clockStr}</span>
          </div>
          {user && (
            <div className="nav-session">
              <span className="nav-session-dot" />
              <span className="nav-session-text">Session · {user.uid.slice(0, 6)}</span>
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className={`fade-up ${loaded ? "loaded" : ""}`} style={cls("0.1s")}>
          <div className="hero-badge">
            <span className="live-dot" />
            <span className="hero-badge-text">LIVE MENU · {meal.toUpperCase()} NOW</span>
          </div>
        </div>

        <h1 className={`hero-title fade-up ${loaded ? "loaded" : ""}`} style={cls("0.15s")}>
          Eat Smart,<br />
          <span className="hero-title-accent">Vol.</span>
        </h1>

        <div className={`tags-row fade-up ${loaded ? "loaded" : ""}`} style={cls("0.25s")}>
          {TAGS.map((tag) => {
            const active = selectedTags.includes(tag.label);
            return (
              <button
                key={tag.label}
                className={`tag-chip${active ? " active" : ""}`}
                onClick={() => toggleTag(tag.label)}
                style={active ? { background: tag.color, borderColor: tag.color } : undefined}
              >
                {tag.emoji} {tag.label}
              </button>
            );
          })}
        </div>

        <div className={`cta-row fade-up ${loaded ? "loaded" : ""}`} style={cls("0.3s")}>
          <button className="cta-btn" onClick={() => setShowModal(true)}>
            View Today's Menu →
          </button>
          <span className="cta-hint">No sign-up required</span>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Dining Halls ── */}
      <section className="halls-section">
        <div className={`halls-header fade-up ${loaded ? "loaded" : ""}`} style={cls("0.35s")}>
          <span className="halls-label">Dining Halls</span>
          <span className="halls-count">2 locations</span>
        </div>

        <div className={`halls-grid fade-up ${loaded ? "loaded" : ""}`} style={cls("0.4s")}>
          {DINING_HALLS.map((hall) => (
            <div key={hall.id} className="hall-card" onClick={() => navigate(hall.route)}>
              <div className="hall-card-top">
                <span className="hall-tag">{hall.tag}</span>
                <span className="hall-arrow">→</span>
              </div>
              <h3 className="hall-name">{hall.name}</h3>
              <p className="hall-hours">{hall.hours}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer-strip">
        <span className="footer-text">VOLEATS · UNIVERSITY OF TENNESSEE KNOXVILLE</span>
        <span className="footer-text">GBO 🍊</span>
      </footer>
    </div>
  );
}