import {
    useQuery
} from '@tanstack/react-query';
import privateAxios from "@src/api/privateAxios.jsx";


export const getForecastApi = async (params) => {
    const { data } = await privateAxios.get(
        "/api/v1/weather/hour",
        { params: { ...params } }
    );
    return data;
};

export function useWeatherHourly(queryObj: any) {
    const {
        isLoading: isLoadingHourlyForecast,
        isFetching: isFetchingHourlyForecast,
        isError: isErrorHourlyForecast,
        error: errorHourlyForecast,
        data: responseHourlyForecast
    } = useQuery({
        queryKey: ['weather-hourly', queryObj],
        queryFn: () => getForecastApi(queryObj),
        enabled: true
    });
    return {
        isLoadingHourlyForecast,
        isFetchingHourlyForecast,
        isErrorHourlyForecast,
        errorHourlyForecast,
        responseHourlyForecast
    };
}
