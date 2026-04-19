import { useQuery } from "@tanstack/react-query";

export type LocationType = "mountain" | "sea" | "city";

async function fetchLocationType(lat: number, lon: number): Promise<LocationType> {
    // 1. elevation via Open-Meteo (free, no key)
    const elevRes = await fetch(
        `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`
    );
    const elevData = await elevRes.json();
    const elevation: number = elevData.elevation?.[0] ?? 0;

    if (elevation > 700) return "mountain";

    // 2. reverse geocoding via Nominatim for sea/coast detection
    const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { "Accept-Language": "en" } }
    );
    const geo = await geoRes.json();
    const addr = geo.address || {};
    const geoType: string = geo.type || "";
    const geoClass: string = geo.class || "";

    const isSea =
        addr.sea || addr.bay || addr.ocean || addr.gulf || addr.beach ||
        (geoClass === "natural" && ["water", "bay", "strait", "sea"].includes(geoType));

    if (isSea) return "sea";

    return "city";
}

export function useLocationType(lat: number, lon: number): LocationType {
    const { data = "city" } = useQuery<LocationType>({
        queryKey: ["location-type", lat, lon],
        queryFn: () => fetchLocationType(lat, lon),
        staleTime: Infinity,
        retry: 1,
    });

    return data;
}
