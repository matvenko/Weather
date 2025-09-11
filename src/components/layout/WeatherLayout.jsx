import { Outlet } from "react-router-dom";
import WeatherShell from "./WeatherShell";

export default function WeatherLayout() {
    return (
        <WeatherShell>
            <Outlet />
        </WeatherShell>
    );
}
