// src/pages/HomePage/components/SearchByLocation.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AutoComplete, Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { fadeUp } from "@src/ui/motion/variants.js";
import {useSearchLocations} from "@src/pages/HomePage/hooks/useSearchLocation.js";
import useDebouncedValue from "@src/utils/useDebouncedValue.js";

/* ================= Helpers ================= */

const GEORGIAN_RANGE = /[\u10A0-\u10FF]/; // ქართული იუნიკოდი
const LATIN_RANGE = /[A-Za-z]/;

const isGeorgian = (s = "") => GEORGIAN_RANGE.test(s);
const isLatin = (s = "") => LATIN_RANGE.test(s);

const isCountryGeorgia = (c = "") => {
    const v = String(c).trim().toLowerCase();
    return v === "საქართველო" || v === "georgia";
};

function dedupeByLatLon(arr) {
    const seen = new Set();
    return arr.filter((x) => {
        const key = `${x.lat}|${x.lon}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function sortByRelevance(items, q) {
    const s = String(q).toLowerCase();
    return [...items].sort((a, b) => {
        const an = String(a.name || "").toLowerCase();
        const bn = String(b.name || "").toLowerCase();

        const aStarts = an.startsWith(s);
        const bStarts = bn.startsWith(s);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;

        const aIncl = an.includes(s);
        const bIncl = bn.includes(s);
        if (aIncl !== bIncl) return aIncl ? -1 : 1;

        // მეტი სტაბილურობისთვის country/district შედარება
        const ad = String(a.district || a.country || "").toLowerCase();
        const bd = String(b.district || b.country || "").toLowerCase();
        const adStarts = ad.startsWith(s);
        const bdStarts = bd.startsWith(s);
        if (adStarts !== bdStarts) return adStarts ? -1 : 1;

        return 0;
    });
}

function labelRightOf(loc) {
    const name = String(loc?.name || "");
    const district = String(loc?.district || "").trim();
    const country = String(loc?.country || "").trim();
    if (!district) return country || "";
    return name === district ? country : district;
}


/* ================ Component ================= */
export default function SearchByLocation({ selectedLocation, setSelectedLocation }) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebouncedValue(query, 400);

    const {
        isFetchingSearchLocations,
        isErrorSearchLocations,
        errorSearchLocations,
        responseSearchLocations,
    } = useSearchLocations(debouncedQuery);

    const options = useMemo(() => {
        // normalize to array
        const raw = Array.isArray(responseSearchLocations)
            ? responseSearchLocations
            : responseSearchLocations && typeof responseSearchLocations === "object"
                ? [responseSearchLocations]
                : [];

        // 1) მხოლოდ საქართველო
        let geOnly = raw.filter((x) => isCountryGeorgia(x.country));

        // 2) ენის პრიორიტეტი query-ის მიხედვით
        const preferGeo = isGeorgian(debouncedQuery);
        const preferLat = isLatin(debouncedQuery);
        let langPreferred = geOnly;

        // თუ query ქართულია → უპირატესობა ქართულ სახელებს
        if (preferGeo) {
            const geoNames = geOnly.filter((x) => isGeorgian(x.name));
            langPreferred = geoNames.length ? geoNames : geOnly;
        }
        // თუ query ლათინურია → უპირატესობა ლათინურ სახელებს
        else if (preferLat) {
            const latNames = geOnly.filter((x) => isLatin(x.name));
            langPreferred = latNames.length ? latNames : geOnly;
        }

        // 3) დუბლიკატების მოცილება
        const unique = dedupeByLatLon(langPreferred);

        // 4) relevance sort (startsWith → includes)
        const sorted = sortByRelevance(unique, debouncedQuery);

        // 5) antd options map
        return sorted.slice(0, 20).map((loc) => ({
            value: loc.name, // input-ში ჩავსვამთ ამ ტექსტს
            label: (
                <div className="gw-search-option">
                    <div className="left">{loc.name}</div>
                    <div className="right">{labelRightOf(loc)}</div>
                </div>
            ),
            loc, // შევინახოთ სრული ობიექტი
        }));
    }, [responseSearchLocations, debouncedQuery]);

    const notFound = useMemo(() => {
        if (debouncedQuery && debouncedQuery.length < 3) return "აკრიფეთ მინ. 3 სიმბოლო…";
        if (isErrorSearchLocations) return String(errorSearchLocations?.message || "Search failed");
        return "ვერ მოიძებნა";
    }, [debouncedQuery, isErrorSearchLocations, errorSearchLocations]);

    const handleSelect = (_value, option) => {
        const loc = option?.loc;
        if (!loc) return;

        setSelectedLocation({
            name: `${loc.name}${loc.country ? `, ${loc.country}` : ""}`,
            lat: Number(loc.lat),
            lon: Number(loc.lon),
        });
        setQuery(option.value);
    };

    return (
        <motion.div className="gw-badge gw-search" variants={fadeUp}>
            <AutoComplete
                value={query}
                onChange={setQuery}
                onSelect={handleSelect}
                options={options}
                filterOption={false}
                notFoundContent={isFetchingSearchLocations ? <Spin size="small" /> : notFound}
                // dropdownMatchSelectWidth შეგიძლია გამორთო, თუ გინდა input-ზე ვიწრო იყოს
                // dropdownMatchSelectWidth={false}
                style={{ minWidth: 320 }}
            >
                <Input
                    size="middle"
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder={selectedLocation?.name || "მოძებნე ლოკაცია…"}
                />
            </AutoComplete>
        </motion.div>
    );
}
