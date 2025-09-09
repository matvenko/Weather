import { Spin } from "antd";
import { Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import RequireAuth from "./features/auth/RequireAuth.jsx";
import { lazy, Suspense, useEffect, useState } from "react";
import i18next from "i18next";

import HeaderContainer from "./components/header/HeaderContainer.jsx";
import DashboardContainer from "./admin/components/Dashboard/DashboardContainer.jsx";


const Homepage = lazy(
  () => import("./components/HomePage/HomePage.jsx"),
);

const ContactPage = lazy(
  () => import("./admin/components/Contact/contactContainer.jsx"),
);

const Login = lazy(() => import("./components/LoginForm/Login"));

const NonDashboardRoutes = [
  "/login",
  "/admin",
  "/brands",
  "/contact",
];

const HideBannersRoutes = ["/about", "/contact"];

const Page = () => {
  let location = useLocation();
  const [i18nLoaded, setI18nLoaded] = useState(false);
  const isNotDashboard = NonDashboardRoutes.includes(location.pathname);

  useEffect(() => {
    i18next.on("loaded", function () {
      setI18nLoaded(true);
    });
  }, []);


  return (
    <>
      <div className="st-container">
        <div className={"app"} style={!isNotDashboard ? {} : { padding: 0 }}>
          <>
            {i18nLoaded && !isNotDashboard && (
              <>
                <HeaderContainer />
              </>
            )}
            <Suspense fallback={<Spin size="large" spinning={true} />}>
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  {/* public routs */}
                  <Route
                    exact
                    index
                    element={
                      <Homepage />
                    }
                  />
                  <Route exact index path="/login" element={<Login />} />
                  {/* protected routes */}
                  <Route element={<RequireAuth />}>
                    <Route
                      exact
                      path="/admin"
                      element={<DashboardContainer />}
                    />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </>
          {/*<DaytonaFooter setBrandName={setBrandName} />*/}
        </div>
      </div>
    </>
  );
};

export default Page;
