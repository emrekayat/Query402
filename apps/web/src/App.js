import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.js";
import ControlDeckPage from "./pages/ControlDeckPage.js";
import LineWaves from "./components/LineWaves.js";
export default function App() {
    return (_jsxs(BrowserRouter, { children: [_jsx("div", { className: "app-bg-layer", "aria-hidden": true, children: _jsx(LineWaves, { speed: 0.12, innerLineCount: 32, outerLineCount: 36, warpIntensity: 1, rotation: -45, edgeFadeWidth: 0, colorCycleSpeed: 1, brightness: 0.35, color1: "#ffffff", color2: "#ffffff", color3: "#ffffff", enableMouseInteraction: true, mouseInfluence: 2 }) }), _jsx("div", { className: "app-main-layer", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/control", element: _jsx(ControlDeckPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }));
}
//# sourceMappingURL=App.js.map