import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.js";
import ControlDeckPage from "./pages/ControlDeckPage.js";
import LineWaves from "./components/LineWaves.js";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-bg-layer" aria-hidden>
        <LineWaves
          speed={0.12}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={1}
          brightness={0.35}
          color1="#ffffff"
          color2="#ffffff"
          color3="#ffffff"
          enableMouseInteraction
          mouseInfluence={2}
        />
      </div>

      <div className="app-main-layer">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/control" element={<ControlDeckPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
