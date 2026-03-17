import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../DiningPage.css";
import "./RockyTop.css";

const MEAL_PERIODS = ["Breakfast", "Lunch", "Dinner"] as const;
type MealPeriod = typeof MEAL_PERIODS[number];

interface MenuItem {
  menu_item_id:            string;
  menu_item_title:         string;
  menu_item_period:        string;
  menu_item__sub_location: string;
  serving_size_display:    string;
}

interface NutritionItem {
  calories: number | null;
  protein:  number | null;
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

function isHighProtein(nut: NutritionItem | undefined): boolean {
  if (!nut || nut.protein == null) return false;
  const ratio = (nut.calories && nut.calories > 0)
    ? (nut.protein * 4) / nut.calories
    : 0;
  return nut.protein >= 15 && ratio >= 0.25;
}

function isLowCalorie(nut: NutritionItem | undefined): boolean {
  if (!nut || nut.calories == null) return false;
  return nut.calories < 200;
}

export default function RockyTop() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod]       = useState<MealPeriod>(getCurrentMeal());
  const [menuItems, setMenuItems]             = useState<MenuItem[]>([]);
  const [nutrition, setNutrition]             = useState<Record<string, NutritionItem>>({});
  const [fetchStatus, setFetchStatus]         = useState<"loading" | "success" | "error">("loading");
  const [filterProtein, setFilterProtein]     = useState(false);
  const [filterLowCal, setFilterLowCal]       = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  useEffect(() => {
    const date = getTodayDate();
    Promise.all([
      fetch(`/api/menu?service_area_id=125621&date=${date}`).then((r) => r.json()),
      fetch(`/api/nutrition?service_area_id=125621&date=${date}`).then((r) => r.json()),
    ])
      .then(([menuData, nutritionData]) => {
        if (menuData?.success && Array.isArray(menuData?.data?.menu_items)) {
          setMenuItems(menuData.data.menu_items);
        }
        if (nutritionData?.success && nutritionData?.data?.nutrition) {
          const map: Record<string, NutritionItem> = {};
          const raw = nutritionData.data.nutrition;
          for (const id in raw) {
            const entry = raw[id][0];
            if (entry) map[id] = { calories: entry.calories ?? null, protein: entry.protein ?? null };
          }
          setNutrition(map);
        }
        setFetchStatus("success");
      })
      .catch(() => setFetchStatus("error"));
  }, []);

  const periodItems = menuItems.filter((item) => item.menu_item_period === activePeriod);
  const grouped     = groupByStation(periodItems);
  const stations    = Object.keys(grouped).sort();

  const passesFilter = (item: MenuItem): boolean => {
    const nut = nutrition[item.menu_item_id];
    if (filterProtein && !isHighProtein(nut)) return false;
    if (filterLowCal  && !isLowCalorie(nut))  return false;
    return true;
  };

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
        <div className="dp-hero-bg">🏔</div>
        <div className="dp-hero-content">
          <p className="dp-hero-eyebrow">Dining Hall · UC Campus</p>
          <h1 className="dp-hero-title">
            Rocky Top<br />
            <span>Dining Hall</span>
          </h1>
          <div className="dp-hero-meta">
            <span className="dp-hero-meta-item">📅 {today}</span>
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
              <div className="rt-spinner" />
              <p className="dp-placeholder-sub">FETCHING TODAY'S MENU...</p>
            </div>
          )}

          {fetchStatus === "error" && (
            <div className="dp-placeholder">
              <div className="dp-placeholder-icon">⚠️</div>
              <p className="dp-placeholder-title">Couldn't load menu</p>
              <p className="dp-placeholder-sub">Check your connection and try again</p>
            </div>
          )}

          {fetchStatus === "success" && (
            <>
              {/* ── Filters ── */}
              <div className="rt-filters">
                <button
                  className={`rt-filter-btn${filterProtein ? " active-protein" : ""}`}
                  onClick={() => setFilterProtein((p) => !p)}
                >
                  💪 High Protein
                </button>
                <button
                  className={`rt-filter-btn${filterLowCal ? " active-lowcal" : ""}`}
                  onClick={() => setFilterLowCal((p) => !p)}
                >
                  ⚡ Low Calorie
                </button>
              </div>

              {stations.length === 0 ? (
                <div className="dp-placeholder">
                  <div className="dp-placeholder-icon">🍽</div>
                  <p className="dp-placeholder-title">No items for {activePeriod}</p>
                  <p className="dp-placeholder-sub">Try another meal period</p>
                </div>
              ) : (
                <div className="rt-menu">
                  {stations.map((station) => {
                    const filtered = grouped[station].filter(passesFilter);
                    return (
                      <div key={station} className="rt-station">
                        <div className="rt-station-header">
                          <span className="rt-station-name">{station}</span>
                          <span className="rt-station-count">{grouped[station].length} items</span>
                        </div>
                        <div className="rt-items">
                          {filtered.length === 0 ? (
                            <div className="rt-no-match">No items match the active filters</div>
                          ) : (
                            filtered.map((item) => {
                              const nut = nutrition[item.menu_item_id];
                              const cal = nut?.calories != null ? Math.round(nut.calories) : null;
                              return (
                                <div key={`${item.menu_item_id}-${item.serving_size_display}`} className="rt-item">
                                  <div className="rt-item-left">
                                    <span className="rt-item-name">{item.menu_item_title}</span>
                                    <span className="rt-item-serving">{item.serving_size_display}</span>
                                  </div>
                                  {cal !== null && (
                                    <span className="rt-item-calories">{cal} cal</span>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="dp-footer">
        <span className="dp-footer-text">VOLEATS · ROCKY TOP DINING HALL</span>
        <span className="dp-footer-text">GBO 🍊</span>
      </footer>
    </div>
  );
}