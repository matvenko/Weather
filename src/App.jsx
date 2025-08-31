import { Spin } from "antd";
import { Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import RequireAuth from "./features/auth/RequireAuth.jsx";
import { lazy, Suspense, useEffect, useState } from "react";
import i18next from "i18next";

import HeaderContainer from "./components/header/HeaderContainer.jsx";
import DashboardContainer from "./admin/components/Dashboard/DashboardContainer.jsx";
import DaytonaFooter from "./components/footer/DaytonaFooter.jsx";

const BrandsPage = lazy(
  () => import("./admin/components/Brands/BrandsContainer.jsx"),
);

const AboutPage = lazy(
  () => import("./admin/components/About/AboutContainer.jsx"),
);

const ContactPage = lazy(
  () => import("./admin/components/Contact/contactContainer.jsx"),
);

const Login = lazy(() => import("./components/LoginForm/Login"));

const NonDashboardRoutes = [
  "/login",
  "/admin",
  "/brands",
];

const HideBannersRoutes = ["/about", "/contact"];

const Page = () => {
  let location = useLocation();
  const [i18nLoaded, setI18nLoaded] = useState(false);
  const isNotDashboard = NonDashboardRoutes.includes(location.pathname);
  const isBannerVisible = !HideBannersRoutes.includes(location.pathname);

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

            {/*<Suspense fallback={<Spin size="large" spinning={true} />}>*/}
            {/*  <Routes>*/}
            {/*    <Route path="/" element={<AppLayout />}>*/}
            {/*      /!* public routs *!/*/}
            {/*      <Route*/}
            {/*        exact*/}
            {/*        index*/}
            {/*        element={*/}
            {/*          <Watches*/}
            {/*            setShowBanner={setShowBanner}*/}
            {/*            searchText={searchText}*/}
            {/*            brandName={brandName}*/}
            {/*            setBrandName={setBrandName}*/}
            {/*            category={category}*/}
            {/*            setCategory={setCategory}*/}
            {/*            currentPage={currentPage}*/}
            {/*            setCurrentPage={setCurrentPage}*/}
            {/*            setSearchText={setSearchText}*/}
            {/*            setDisableSearch={setDisableSearch}*/}
            {/*            disableSearch={disableSearch}*/}
            {/*            setOnSale={setOnSale}*/}
            {/*            onSale={onSale}*/}
            {/*          />*/}
            {/*        }*/}
            {/*      />*/}
            {/*      <Route exact path="/about" element={<AboutPage />} />*/}
            {/*      <Route exact index path="/login" element={<Login />} />*/}
            {/*      <Route*/}
            {/*        exact*/}
            {/*        path="/brands/:brandName"*/}
            {/*        element={*/}
            {/*          <Watches*/}
            {/*            setShowBanner={setShowBanner}*/}
            {/*            searchText={searchText}*/}
            {/*            brandName={brandName}*/}
            {/*            setBrandName={setBrandName}*/}
            {/*            category={category}*/}
            {/*            setCategory={setCategory}*/}
            {/*            currentPage={currentPage}*/}
            {/*            setCurrentPage={setCurrentPage}*/}
            {/*            setSearchText={setSearchText}*/}
            {/*            setDisableSearch={setDisableSearch}*/}
            {/*            disableSearch={disableSearch}*/}
            {/*            setOnSale={setOnSale}*/}
            {/*            onSale={onSale}*/}
            {/*          />*/}
            {/*        }*/}
            {/*      />*/}
            {/*      <Route*/}
            {/*        exact*/}
            {/*        path="/product/:watchId"*/}
            {/*        element={*/}
            {/*          <ProductDetails*/}
            {/*            setShowBanner={setShowBanner}*/}
            {/*            searchText={searchText}*/}
            {/*            brandName={brandName}*/}
            {/*            setBrandName={setBrandName}*/}
            {/*            category={category}*/}
            {/*            setCategory={setCategory}*/}
            {/*            currentPage={currentPage}*/}
            {/*            setCurrentPage={setCurrentPage}*/}
            {/*            setSearchText={setSearchText}*/}
            {/*            setDisableSearch={setDisableSearch}*/}
            {/*            disableSearch={disableSearch}*/}
            {/*            setOnSale={setOnSale}*/}
            {/*            onSale={onSale}*/}
            {/*          />*/}
            {/*        }*/}
            {/*      />*/}
            {/*      /!* protected routes *!/*/}
            {/*      <Route element={<RequireAuth />}>*/}
            {/*        <Route*/}
            {/*          exact*/}
            {/*          path="/admin"*/}
            {/*          element={<DashboardContainer />}*/}
            {/*        />*/}
            {/*        <Route exact path="/brands" element={<BrandsPage />} />*/}
            {/*      </Route>*/}
            {/*    </Route>*/}
            {/*  </Routes>*/}
            {/*</Suspense>*/}
          </>
          {/*<DaytonaFooter setBrandName={setBrandName} />*/}
        </div>
      </div>
    </>
  );
};

export default Page;
