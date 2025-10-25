// Weather detail icons - all white colored
import React from "react";

export const WindDirectionIcon = ({ size = 20, className = "", direction = 0 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{
            transform: `rotate(${direction}deg)`,
            transition: 'transform 0.3s ease',
            display: 'inline-block'
        }}
    >
        <path
            d="M12 2L12 22M12 2L8 6M12 2L16 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const WindSpeedIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M3 8h10a2 2 0 110 4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M3 12h12a2 2 0 110 4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M3 16h8a2 2 0 110 4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export const PrecipitationIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M12 2.69l-2.83 2.83C6.69 8 6.69 11.17 9.17 13.66c2.48 2.48 6.51 2.48 9 0 2.48-2.49 2.48-6.52 0-9L12 2.69z"
            fill="white"
        />
        <path
            d="M6 14.5c-.83.83-.83 2.17 0 3 .83.83 2.17.83 3 0 .83-.83.83-2.17 0-3-.83-.83-2.17-.83-3 0z"
            fill="white"
            opacity="0.7"
        />
        <path
            d="M15 16.5c-.83.83-.83 2.17 0 3 .83.83 2.17.83 3 0 .83-.83.83-2.17 0-3-.83-.83-2.17-.83-3 0z"
            fill="white"
            opacity="0.7"
        />
    </svg>
);

export const PrecipitationProbabilityIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="white"
            strokeWidth="2"
            fill="none"
        />
        <path
            d="M8 12.5c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5c0 1.5-1 2.5-2 3.5l-1 1-1-1c-1-1-2-2-2-3.5z"
            fill="white"
        />
    </svg>
);
