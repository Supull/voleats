VolEats
A real-time dining menu app for University of Tennessee Knoxville students. Browse today's menu at Rocky Top and Stokely dining halls, filter by dietary preferences, and check calories and protein for every item.

Features
Live menus — fetches today's menu directly from UTK Dining, updated daily
Two dining halls — Rocky Top Dining Hall and Stokely Dining Hall
Meal period tabs — switch between Breakfast, Lunch, and Dinner
Nutrition display — calories and protein shown for every item

Anonymous auth — no sign-up required, Firebase handles sessions automatically
Mobile responsive — works on phone and laptop

Tech Stack
LayerTechFrontendReact + TypeScript + ViteStylingPlain CSSAuthFirebase Anonymous AuthProxyVercel Serverless FunctionsDeploymentVercelData SourceUTK Dining API

How It Works
UTK's dining site blocks direct browser requests (CORS). To get around this, the app uses Vercel Serverless Functions as a proxy:
React App -> /api/menu (Vercel function) -> UTK Dining API
React App -> /api/nutrition (Vercel function) -> UTK Nutrition API
This means requests happen server-side, never exposed to the browser.

Getting Started
Node.js 18+
A Firebase project with Anonymous Auth enabled
A Vercel account

Installation
git clone https://github.com/Supull/voleats.git
cd voleats/my-react-app
npm install

Running Locally
npm run dev
The vite.config.ts proxies /api/menu and /api/nutrition to UTK's servers during local development so you don't need to deploy to test.

Deploying
Push to GitHub — Vercel auto-deploys on every push to main.
Make sure to add all environment variables in Vercel -> Project Settings -> Environment Variables.

Disclaimer
This app is an independent personal student project and is not affiliated with or endorsed by the University of Tennessee. Menu data is sourced from UTK's public dining website. 
