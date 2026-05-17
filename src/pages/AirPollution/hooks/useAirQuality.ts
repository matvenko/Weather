import { useQuery } from '@tanstack/react-query';
import privateAxios from "@src/api/privateAxios.jsx";

const getAirQualityApi = async () => {
    const { data } = await privateAxios.get("/api/v1/weather/get-weatherlink-current");
    return data;
};

export function useAirQuality() {
    const { isLoading, isError, error, data } = useQuery({
        queryKey: ['air-quality'],
        queryFn: getAirQualityApi,
        staleTime: 5 * 60 * 1000,
    });

    const aqiData  = data?.sensors?.find((s: any) => s.data_structure_type === 16)?.data?.[0] ?? null;
    const barData  = data?.sensors?.find((s: any) => s.data_structure_type === 19)?.data?.[0] ?? null;

    return { isLoading, isError, error, aqiData, barData };
}
