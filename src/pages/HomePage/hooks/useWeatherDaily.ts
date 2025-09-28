import {
    useQuery
} from '@tanstack/react-query';
import privateAxios from "@src/api/privateAxios.jsx";


export const getForecastApi = async (params) => {
    const { data } = await privateAxios.get(
        "/api/v1/weather/day",
        { params: { ...params } }
    );
    return data;
};

export function useWeatherDaily(queryObj: any) {
    const {
        isLoading: isLoadingDailyForecast,
        isFetching: isFetchingDailyForecast,
        isError: isErrorDailyForecast,
        error: errorDailyForecast,
        data: responseDailyForecast,
        refetch: refetchDailyWeather
    } = useQuery({
        queryKey: ['weather-day', queryObj],
        queryFn: () => getForecastApi(queryObj),
        enabled: true
    });
    return {
        isLoadingDailyForecast,
        isFetchingDailyForecast,
        isErrorDailyForecast,
        errorDailyForecast,
        responseDailyForecast,
        refetchDailyWeather
    };
}
