// Page.jsx
import { Result, Spin } from "antd";
import { Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import RequireAuth from "./features/auth/RequireAuth.jsx";
import { lazy, Suspense, useEffect, useState } from "react";
import i18next from "i18next";

import HeaderContainer from "./components/header/HeaderContainer.jsx";

const DashboardContainer = lazy(() => import("./admin/components/Dashboard/DashboardContainer.jsx"));
const Login = lazy(() => import("./components/LoginForm/Login"));
const Registration    = lazy(() => import("./components/Registration/Registration.jsx"));

const Homepage = lazy(() => import("./pages/HomePage/HomePage.jsx"));
const AboutUsPage   = lazy(() => import("./pages/AboutUs/AboutUs.jsx"));
const AccountPage   = lazy(() => import("./pages/Account/AccountOverview.jsx"));
const MapsPage    = lazy(() => import("./pages/WeatherMaps/WeatherMaps.jsx"));
const ContactPage = lazy(() => import("./pages/Contacts/Contacts.jsx"));


const Page = () => {
  const HIDE_HEADER = [/^\/login$/, /^\/register$/, /^\/admin(?:\/.*)?$/];
  const location = useLocation();
  const hideHeader = HIDE_HEADER.some(rx => rx.test(location.pathname));

  const [i18nLoaded, setI18nLoaded] = useState(false);
  useEffect(() => {
    const ready = () => setI18nLoaded(true);
    if (i18next.isInitialized) setI18nLoaded(true);
    else i18next.on("initialized", ready);
    return () => i18next.off("initialized", ready);
  }, []);

  return (
      <div className="st-container">
        <div className="app" style={!hideHeader ? {} : { padding: 0 }}>
          {i18nLoaded && !hideHeader && <HeaderContainer />}
          <Suspense
              fallback={
                <div style={{ minHeight: "40vh", display: "grid", placeItems: "center" }}>
                  <Spin size="large" />
                </div>
              }
          >
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Homepage />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="maps" element={<MapsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="register" element={<Registration />} />
                <Route path="login" element={<Login />} />
                <Route element={<RequireAuth />}>
                  <Route path="admin" element={<DashboardContainer />} />
                </Route>
                <Route path="*" element={<Result status="404" title="Not Found" />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </div>
  );
};

export default Page;