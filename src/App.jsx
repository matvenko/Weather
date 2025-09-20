// App.jsx (former Page.jsx)
import {Result, Spin} from "antd";
import {Route, Routes} from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import RequireAuth from "./features/auth/RequireAuth.jsx";
import {lazy, Suspense} from "react";

// Layout that wraps meteoblue-style pages
import WeatherLayout from "./components/layout/WeatherLayout.jsx";
import SocialLoginCallback from "./components/Auth/SocialLoginCallback.jsx";

// Lazy pages
const DashboardContainer = lazy(() => import("./admin/components/Dashboard/DashboardContainer.jsx"));
const Login = lazy(() => import("./components/LoginForm/Login"));
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
                        <div style={{minHeight: "40vh", display: "grid", placeItems: "center"}}>
                            <Spin size="large"/>
                        </div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<AppLayout/>}>
                            {/* meteoblue-style layout */}
                            <Route element={<WeatherLayout/>}>
                                <Route index element={<Homepage/>}/>
                                <Route path="about" element={<AboutUsPage/>}/>
                                <Route path="account" element={<AccountPage/>}/>
                                <Route path="contact" element={<ContactPage/>}/>
                                <Route path="login" element={<Login/>}/>
                                <Route path="register" element={<Registration/>}/>
                            </Route>

                            {/* Maps — own layout/fullscreen */}
                            <Route path="maps" element={<MapsPage/>}/>

                            <Route element={<RequireAuth/>}>
                                <Route path="admin" element={<DashboardContainer/>}/>
                            </Route>

                            {/* 404 */}
                            <Route path="*" element={<Result status="404" title="Not Found"/>}/>

                            {/* ...სხვა როუტები */}
                            <Route path="/social-login" element={<SocialLoginCallback/>}/>
                        </Route>
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
}
