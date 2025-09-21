// utils.ts

// მცირე ტიპი, რომ ფუნქციას გადავცეთ location-ის მსგავსი ობიექტი (ტესტირებასაც აადვილებს)
export type LocationLike = { search: string; hash: string };

const getLocationSafe = (): LocationLike => {
    if (typeof window !== "undefined" && window.location) {
        return {
            search: window.location.search ?? "",
            hash: window.location.hash ?? "",
        };
    }
    return { search: "", hash: "" };
};

export const hasAuthParams = (loc?: LocationLike): boolean => {
    const { search, hash } = loc ?? getLocationSafe();

    // ქუერის პარამეტრები
    const qs = new URLSearchParams(search);

    // ზოგიერთ IdP-ში პარამეტრები მოდის ჰეშში (#code=...&state=...)
    const hs = new URLSearchParams(
        hash.startsWith("#") ? hash.slice(1) : hash
    );

    const hasCodeOrError =
        !!qs.get("code") || !!qs.get("error") || !!hs.get("code") || !!hs.get("error");

    const hasState = !!qs.get("state") || !!hs.get("state");

    return hasCodeOrError && hasState;
};

// ზოგადი error normalizer — ამოიღებს ტექსტს როგორც string-დან, ისე object-დან
const normalizeErrorFn =
    (fallbackMessage: string) =>
        (error: unknown): Error => {
            if (error instanceof Error) return error;
            if (typeof error === "string") return new Error(error);
            // ხშირად axios/oidc აბრუნებს { message: "..." }
            if (error && typeof error === "object" && "message" in (error as any)) {
                const msg = (error as any).message;
                if (typeof msg === "string" && msg.trim()) return new Error(msg);
            }
            try {
                return new Error(JSON.stringify(error));
            } catch {
                return new Error(fallbackMessage);
            }
        };

export const signinError = normalizeErrorFn("Sign-in failed");
