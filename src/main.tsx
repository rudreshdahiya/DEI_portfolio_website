import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import "./app.css";
import { ErrorBoundary } from "./components/error-boundary";
import { Layout } from "./layout";
import Home from "./pages/home";
import About from "./pages/about";
import Services from "./pages/services";
import Work from "./pages/work";
import BloomingInPain from "./pages/blooming-in-pain";
import BloomingInPainSubmit from "./pages/blooming-in-pain-submit";
import Contact from "./pages/contact";
import Accessibility from "./pages/accessibility";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <Analytics />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/blooming-in-pain" element={<BloomingInPain />} />
              <Route path="/blooming-in-pain/submit" element={<BloomingInPainSubmit />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
