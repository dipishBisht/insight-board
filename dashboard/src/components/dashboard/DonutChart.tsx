"use client";
import React, { useEffect, useRef } from 'react';

interface DonutChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    size?: number;
    thickness?: number;
    showLegend?: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({
    data,
    size = 200,
    thickness = 40,
    showLegend = true,
}) => {
    const chartRef = useRef<SVGSVGElement>(null);

    const center = size / 2;
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;

    // Create segments with path and strokeDashoffset values
    const segments = data.map((item) => {
        const percentage = total > 0 ? item.value / total : 0;
        const startPercent = cumulativePercent;
        cumulativePercent += percentage;
        return { ...item, percentage, startPercent };
    });

    useEffect(() => {
        if (!chartRef.current) return;

        const paths = chartRef.current.querySelectorAll('.donut-segment');

        paths.forEach((path, i) => {
            setTimeout(() => {
                (path as SVGCircleElement).style.strokeDashoffset = '0';
            }, i * 150);
        });
    }, [data]);

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    ref={chartRef}
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth={thickness}
                    />

                    {/* Data segments */}
                    {segments.map(({ color, percentage}, i) => {
                        const dashArray = circumference * percentage;

                        return (
                            <circle
                                key={i}
                                className="donut-segment transition-all duration-1000 ease-in-out"
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke={color}
                                strokeWidth={thickness}
                                strokeDasharray={`${dashArray} ${circumference}`}
                                strokeDashoffset={circumference}
                                style={{
                                    strokeDashoffset: circumference,
                                    transition: 'stroke-dashoffset 1s ease-in-out',
                                    transitionDelay: `${i * 150}ms`,
                                }}
                            />
                        );
                    })}

                    {/* Center hole */}
                    <circle
                        cx={center}
                        cy={center}
                        r={(size - thickness * 2) / 2}
                        fill="white"
                    />
                </svg>

                {/* Percentage and label in center */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0"
                    style={{ top: 0, left: 0 }}
                >
                    <span className="text-3xl font-bold text-gray-800">
                        {Math.round(segments[0]?.percentage * 100 || 0)}%
                    </span>
                    <span className="text-sm text-gray-500">{segments[0]?.label}</span>
                </div>
            </div>

            {showLegend && (
                <div className="flex flex-col gap-2">
                    {segments.map((segment, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: segment.color }}
                            />
                            <span className="text-sm text-gray-700">{segment.label}</span>
                            <span className="text-sm font-medium text-gray-900 ml-auto">
                                {Math.round(segment.percentage * 100)}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonutChart;
