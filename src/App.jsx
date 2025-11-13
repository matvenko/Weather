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
const Login = lazy(() => import("./components/LoginForm/RegistrationAuthorizationModule.jsx"));
const Registration = lazy(() => import("./components/Registration/Registration.jsx"));
const Homepage = lazy(() => import("./pages/HomePage/HomePage.jsx"));
const AboutUsPage = lazy(() => import("./pages/AboutUs/AboutUs.jsx"));
const AccountPage = lazy(() => import("./pages/Account/AccountOverview.jsx"));
const MapsPage = lazy(() => import("./pages/WeatherMaps/WeatherMaps.jsx"));
const ContactPage = lazy(() => import("./pages/Contacts/Contacts.jsx"));

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
                                <Route path="account" element={<AccountPage />} />
                                <Route path="contact" element={<ContactPage />} />
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Registration />} />
                            </Route>

                            <Route path="maps" element={<MapsPage />} />

                            {/* Protected */}
                            <Route element={<RequireAuth />}>
                                <Route element={<AdminLayout />}>
                                    <Route path="admin" element={<DashboardContainer />} />
                                    <Route path="users" element={<UsersContainer />} />
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
