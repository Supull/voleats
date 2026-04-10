# VolEats

A real-time dining menu app for University of Tennessee Knoxville students. Browse today's menu at Rocky Top and Stokely dining halls, filter by dietary preferences, and check calories and protein for every item.

---

## Features

- **Live menus** — fetches today's menu directly from UTK Dining, updated daily
- **Anonymous auth** — no sign-up required, Firebase handles sessions automatically
- **Mobile responsive** — works on phone and laptop

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Plain CSS |
| Auth | Firebase Anonymous Auth |
| Proxy | Vercel Serverless Functions |
| Deployment | Vercel |
| Data Source | UTK Dining API |

---

## Project Structure

```
VolEats/my-react-app/
├── api/
│   ├── menu.ts           # Vercel proxy -> UTK menu API
│   └── nutrition.ts      # Vercel proxy -> UTK nutrition API
├── src/
│   ├── config/
│   │   └── firebase.ts   # Firebase init
│   ├── hooks/
│   │   └── useAuth.ts    # Anonymous auth hook
│   ├── pages/
│   │   ├── RockyTop.tsx  # Rocky Top Dining Hall page
│   │   ├── RockyTop.css
│   │   ├── Stokely.tsx   # Stokely Dining Hall page
│   │   └── Stokely.css
│   ├── App.tsx           # Routing
│   ├── LandingPage.tsx   # Home page
│   ├── LandingPage.css
│   └── DiningPage.css    # Shared dining page styles
├── .env                  # Local environment variables (not committed)
└── vite.config.ts        # Vite + local dev proxy config
```

---

## How It Works

UTK's dining site blocks direct browser requests (CORS). To get around this, the app uses Vercel Serverless Functions as a proxy:

```
React App -> /api/menu (Vercel function) -> UTK Dining API
React App -> /api/nutrition (Vercel function) -> UTK Nutrition API
```

This means requests happen server-side, never exposed to the browser.

---

## Disclaimer

This app is an independent personal student project and is not affiliated with or endorsed by the University of Tennessee. Menu data is sourced from UTK's public dining website. Nutrition information is provided for informational purposes only.
