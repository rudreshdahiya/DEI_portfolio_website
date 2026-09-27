import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import "./app.css";
import { ErrorBoundary } from "./components/error-boundary";
import { Layout } from "./layout";
import { GlobalSettingsProvider } from "./hooks/use-global-settings";
import { HomeSettingsProvider } from "./hooks/use-home-settings";
import { BipSettingsProvider } from "./hooks/use-bip-settings";
import { AboutSettingsProvider } from "./hooks/use-about-settings";
import { ServicesSettingsProvider } from "./hooks/use-services-settings";
import { WorkSettingsProvider } from "./hooks/use-work-settings";
import { ContactSettingsProvider } from "./hooks/use-contact-settings";

import Home from "./pages/home";
import About from "./pages/about";
import Services from "./pages/services";
import Work from "./pages/work";
import BloomingInPain from "./pages/blooming-in-pain";
import BloomingInPainSubmit from "./pages/blooming-in-pain-submit";
import Contact from "./pages/contact";
import Accessibility from "./pages/accessibility";

import { AdminLogin, AdminLayout, AdminGuard } from "./admin/admin-layout";
import AdminDashboard from "./admin/dashboard";
import AdminGlobalSettings from "./admin/global-settings";
import AdminHomeSettings from "./admin/home-settings";
import AdminBipSettings from "./admin/bip-settings";
import AdminAboutSettings from "./admin/about-settings";
import AdminServicesSettings from "./admin/services-settings";
import AdminWorkSettings from "./admin/work-settings";
import AdminContactSettings from "./admin/contact-settings";
import AnalyticsDashboard from "./admin/analytics-dashboard";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <GlobalSettingsProvider>
          <HomeSettingsProvider>
            <BipSettingsProvider>
              <AboutSettingsProvider>
                <ServicesSettingsProvider>
                  <WorkSettingsProvider>
                    <ContactSettingsProvider>
                      <BrowserRouter>
                        <Analytics />
                        <Routes>
                          {/* ── Main website ─────────────────────────────────── */}
                          <Route element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/work" element={<Work />} />
                            <Route path="/blooming-in-pain" element={<BloomingInPain />} />
                            <Route path="/blooming-in-pain/submit" element={<BloomingInPainSubmit />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/accessibility" element={<Accessibility />} />
                          </Route>

                          {/* ── Admin panel ──────────────────────────────────── */}
                          <Route path="/admin" element={<AdminLogin />} />
                          <Route element={<AdminGuard />}>
                            <Route element={<AdminLayout />}>
                              <Route path="/admin/dashboard" element={<AdminDashboard />} />
                              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                              <Route path="/admin/global" element={<AdminGlobalSettings />} />
                              <Route path="/admin/home" element={<AdminHomeSettings />} />
                              <Route path="/admin/blooming-in-pain" element={<AdminBipSettings />} />
                              <Route path="/admin/about" element={<AdminAboutSettings />} />
                              <Route path="/admin/services" element={<AdminServicesSettings />} />
                              <Route path="/admin/work" element={<AdminWorkSettings />} />
                              <Route path="/admin/contact" element={<AdminContactSettings />} />
                              <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
                            </Route>
                          </Route>


                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </BrowserRouter>
                    </ContactSettingsProvider>
                  </WorkSettingsProvider>
                </ServicesSettingsProvider>
              </AboutSettingsProvider>
            </BipSettingsProvider>
          </HomeSettingsProvider>
        </GlobalSettingsProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
