import { Result, Spin } from "antd";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "./components/AppLayout.jsx";
import WeatherLayout from "./components/layout/WeatherLayout.jsx";
import RequireAuth from "./features/auth/RequireAuth.jsx";
import SocialLoginCallback from "@src/components/Auth/SocialLoginCallback.jsx";
import AdminLayout from "./admin/components/AdminLayout.jsx";

const DashboardContainer = lazy(() => import("./admin/components/Dashboard/DashboardContainer.jsx"));
const UsersContainer = lazy(() => import("./admin/components/Users/UsersContainer.jsx"));
const TransactionsContainer = lazy(() => import("./admin/components/Transactions/TransactionsContainer.jsx"));
const SubscriptionsContainer = lazy(() => import("./admin/components/Subscriptions/SubscriptionsContainer.jsx"));
const Login = lazy(() => import("./components/LoginForm/RegistrationAuthorizationModule.jsx"));
const Registration = lazy(() => import("./components/Registration/Registration.jsx"));
const Homepage = lazy(() => import("./pages/HomePage/HomePage.jsx"));
const AboutUsPage = lazy(() => import("./pages/AboutUs/AboutUs.jsx"));
const AccountPage = lazy(() => import("./pages/Account/AccountOverview.jsx"));
const MapsPage = lazy(() => import("./pages/WeatherMaps/WeatherMaps.jsx"));
const SfericMapPage = lazy(() => import("./pages/SfericMap/SfericMap.jsx"));
const FlowViewPage = lazy(() => import("./pages/FlowView/FlowViewPage.jsx"));
const ProductsPage = lazy(() => import("./pages/Products/ProductsPage.jsx"));
const Where2GoPage = lazy(() => import("./pages/OutdoorSports/Where2GoPage.jsx"));
const SnowPage = lazy(() => import("./pages/OutdoorSports/SnowPage.jsx"));
const SeaSurfPage = lazy(() => import("./pages/OutdoorSports/SeaSurfPage.jsx"));
const AstronomyPage = lazy(() => import("./pages/OutdoorSports/AstronomyPage.jsx"));

export default function App() {
    return (
        <div className="st-container">
            <div className="app">
                <Suspense
                    fallback={
                        <div style={{ minHeight: "40vh", display: "grid", placeItems: "center" }}>
                            <Spin size="large" />
                        </div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<AppLayout />}>
                            <Route element={<WeatherLayout />}>
                                <Route index element={<Homepage />} />
                                <Route path="about" element={<AboutUsPage />} />
                                <Route path="products" element={<ProductsPage />} />
                            <Route path="outdoor/where2go" element={<Where2GoPage />} />
                            <Route path="outdoor/snow" element={<SnowPage />} />
                            <Route path="outdoor/sea-surf" element={<SeaSurfPage />} />
                            <Route path="outdoor/astronomy" element={<AstronomyPage />} />
                                <Route path="account" element={<AccountPage />} />
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Registration />} />
                            </Route>

                            <Route path="maps" element={<MapsPage />} />
                            <Route path="sferic-map" element={<SfericMapPage />} />
                            <Route path="view" element={<FlowViewPage />} />


                            {/* Protected */}
                            <Route element={<RequireAuth />}>
                                <Route element={<AdminLayout />}>
                                    <Route path="admin" element={<DashboardContainer />} />
                                    <Route path="users" element={<UsersContainer />} />
                                    <Route path="transactions" element={<TransactionsContainer />} />
                                    <Route path="subscriptions" element={<SubscriptionsContainer />} />
                                </Route>
                            </Route>

                            <Route path="*" element={<Result status="404" title="Not Found" />} />
                            <Route path="/social-login" element={<SocialLoginCallback/>}/>
                        </Route>
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
}
