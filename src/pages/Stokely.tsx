import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../DiningPage.css";
import "./Stokely.css";

const MEAL_PERIODS = ["Breakfast", "Lunch", "Dinner"] as const;
type MealPeriod = typeof MEAL_PERIODS[number];

interface MenuItem {
  menu_item_id:            string;
  menu_item_title:         string;
  menu_item_period:        string;
  menu_item__sub_location: string;
  serving_size_display:    string;
}

function getCurrentMeal(): MealPeriod {
  const h = new Date().getHours();
  if (h < 10) return "Breakfast";
  if (h < 14) return "Lunch";
  return "Dinner";
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function groupByStation(items: MenuItem[]): Record<string, MenuItem[]> {
  return items.reduce((acc, item) => {
    const station = item.menu_item__sub_location.trim();
    if (!acc[station]) acc[station] = [];
    acc[station].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
}

export default function Stokely() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<MealPeriod>(getCurrentMeal());
  const [menuItems, setMenuItems]       = useState<MenuItem[]>([]);
  const [fetchStatus, setFetchStatus]   = useState<"loading" | "success" | "error">("loading");
  const [corsBlocked, setCorsBlocked]   = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  useEffect(() => {
    const date = getTodayDate();
    const url  = `/api/menu?service_area_id=116094&date=${date}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.success && Array.isArray(data?.data?.menu_items)) {
          setMenuItems(data.data.menu_items);
          setFetchStatus("success");
        } else {
          setFetchStatus("error");
        }
      })
      .catch((err) => {
        if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          setCorsBlocked(true);
        }
        setFetchStatus("error");
      });
  }, []);

  const periodItems = menuItems.filter((item) => item.menu_item_period === activePeriod);
  const grouped     = groupByStation(periodItems);
  const stations    = Object.keys(grouped).sort();

  return (
    <div className="dining-page">
      <div className="noise-overlay" />

      {/* ── Nav ── */}
      <nav className="dp-nav">
        <div className="dp-nav-left">
          <button className="dp-back-btn" onClick={() => navigate("/")}>← Back</button>
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

          {fetchStatus === "loading" && (
            <div className="dp-placeholder">
              <div className="sk-spinner" />
              <p className="dp-placeholder-sub">FETCHING TODAY'S MENU...</p>
            </div>
          )}

          {fetchStatus === "error" && (
            <div className="dp-placeholder">
              <div className="dp-placeholder-icon">⚠️</div>
              <p className="dp-placeholder-title">
                {corsBlocked ? "CORS blocked the request" : "Couldn't load menu"}
              </p>
              <p className="dp-placeholder-sub">
                {corsBlocked
                  ? "UTK's API blocked the direct fetch — we'll need a proxy"
                  : "Check your connection and try again"}
              </p>
            </div>
          )}

          {fetchStatus === "success" && stations.length === 0 && (
            <div className="dp-placeholder">
              <div className="dp-placeholder-icon">🍽</div>
              <p className="dp-placeholder-title">No items for {activePeriod}</p>
              <p className="dp-placeholder-sub">Try another meal period</p>
            </div>
          )}

          {fetchStatus === "success" && stations.length > 0 && (
            <div className="sk-menu">
              {stations.map((station) => (
                <div key={station} className="sk-station">
                  <div className="sk-station-header">
                    <span className="sk-station-name">{station}</span>
                    <span className="sk-station-count">{grouped[station].length} items</span>
                  </div>
                  <div className="sk-items">
                    {grouped[station].map((item) => (
                      <div key={`${item.menu_item_id}-${item.serving_size_display}`} className="sk-item">
                        <span className="sk-item-name">{item.menu_item_title}</span>
                        <span className="sk-item-serving">{item.serving_size_display}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

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