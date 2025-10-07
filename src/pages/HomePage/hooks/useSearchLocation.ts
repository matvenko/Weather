import {
    useQuery
} from '@tanstack/react-query';
import privateAxios from "@src/api/privateAxios.jsx";


export const getSearchLocationsApi = async (locationName) => {
    const {data} = await privateAxios.get(
        `/api/v1/weather/search-location`,
        {params: {name: locationName}}
    );
    return data;
};

export function useSearchLocations(locationName: string) {
    const {
        isLoading: isLoadingSearchLocations,
        isFetching: isFetchingSearchLocations,
        isError: isErrorSearchLocations,
        error: errorSearchLocations,
        data: responseSearchLocations,
    } = useQuery({
        queryKey: ['search', locationName],
        queryFn: () => getSearchLocationsApi(locationName),
        enabled: !!locationName && locationName.length >= 3, // 3+ სიმბოლო
        staleTime: 60_000, // 1წთ cache
        gcTime: 5 * 60_000,
    });
    return {
        isLoadingSearchLocations,
        isFetchingSearchLocations,
        isErrorSearchLocations,
        errorSearchLocations,
        responseSearchLocations
    };
}
