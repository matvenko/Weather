import { Outlet } from "react-router-dom";
import WeatherShell from "./WeatherShell";
import {useCallback, useEffect, useState} from "react";
import {setDeviceViewPort} from "@src/features/app/appSlice.js";
import {useDispatch} from "react-redux";

export default function WeatherLayout() {
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
    const dispatch = useDispatch()

    const setDeviceViewPortAc = useCallback(() => {
        let deviceViewPort = ''
        if (viewportWidth < 480) {
            deviceViewPort = 'XS'
        } else if (viewportWidth >= 480 && viewportWidth < 576) {
            deviceViewPort = 'SM'
        } else if (viewportWidth >= 576 && viewportWidth < 768) {
            deviceViewPort = 'MD'
        } else if (viewportWidth >= 768 && viewportWidth < 992) {
            deviceViewPort = 'LG'
        } else if (viewportWidth >= 1200 && viewportWidth < 1536) {
            deviceViewPort = 'XL'
        } else if (viewportWidth >= 1536) {
            deviceViewPort = 'XXL'
        }
        dispatch(setDeviceViewPort({ deviceViewPort }))
    }, [dispatch, viewportWidth])

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [setDeviceViewPortAc])

    useEffect(() => {
        setDeviceViewPortAc()
    }, [viewportWidth, setDeviceViewPortAc])
    return (
        <WeatherShell>
            <Outlet />
        </WeatherShell>
    );
}
