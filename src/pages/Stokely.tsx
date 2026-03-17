import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../DiningPage.css";

const MEAL_PERIODS = ["Breakfast", "Lunch", "Dinner"] as const;
type MealPeriod = typeof MEAL_PERIODS[number];

function getCurrentMeal(): MealPeriod {
  const h = new Date().getHours();
  if (h < 10) return "Breakfast";
  if (h < 14) return "Lunch";
  return "Dinner";
}

export default function Stokely() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<MealPeriod>(getCurrentMeal());

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dining-page">
      <div className="noise-overlay" />

      {/* ── Nav ── */}
      <nav className="dp-nav">
        <div className="dp-nav-left">
          <button className="dp-back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div className="dp-nav-logo" onClick={() => navigate("/")}>
            <div className="dp-nav-logo-icon">🍽</div>
            <span className="dp-nav-logo-text">VolEats</span>
          </div>
        </div>
        <div className="dp-nav-badge">
          <span className="dp-nav-badge-dot" />
          <span className="dp-nav-badge-text">LIVE · {activePeriod.toUpperCase()}</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="dp-hero">
        <div className="dp-hero-bg">🏛</div>
        <div className="dp-hero-content">
          <p className="dp-hero-eyebrow">Dining Hall · Melrose Ave</p>
          <h1 className="dp-hero-title">
            Stokely<br />
            <span>Dining Hall</span>
          </h1>
          <div className="dp-hero-meta">
            <span className="dp-hero-meta-item">🕐 7AM – 8PM</span>
            <span className="dp-hero-meta-dot">·</span>
            <span className="dp-hero-meta-item">📅 {today}</span>
            <span className="dp-hero-meta-dot">·</span>
            <span className="dp-hero-meta-item">📍 Melrose Ave</span>
          </div>
        </div>
      </div>

      {/* ── Meal period tabs ── */}
      <div className="dp-tabs">
        {MEAL_PERIODS.map((period) => (
          <button
            key={period}
            className={`dp-tab${activePeriod === period ? " active" : ""}`}
            onClick={() => setActivePeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="dp-content">
        <div className="dp-content-inner">
          <div className="dp-placeholder">
            <div className="dp-placeholder-icon">🍽</div>
            <p className="dp-placeholder-title">{activePeriod} menu coming soon</p>
            <p className="dp-placeholder-sub">STOKELY · LOADING MENU DATA</p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="dp-footer">
        <span className="dp-footer-text">VOLEATS · STOKELY DINING HALL</span>
        <span className="dp-footer-text">GBO 🍊</span>
      </footer>
    </div>
  );
}