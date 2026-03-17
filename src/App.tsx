import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import RockyTop from "./pages/RockyTop";
import Stokely from "./pages/Stokely";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/rocky-top" element={<RockyTop />} />
        <Route path="/stokely"   element={<Stokely />} />
      </Routes>
    </BrowserRouter>
  );
}