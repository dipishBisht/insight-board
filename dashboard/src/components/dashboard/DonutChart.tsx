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

    useEffect(() => {
        if (!chartRef.current) return;

        const paths = chartRef.current.querySelectorAll('.donut-segment');

        paths.forEach((path, i) => {
            // Animate each segment with a delay
            setTimeout(() => {
                (path as SVGElement).style.strokeDashoffset = '0';
            }, i * 150);
        });
    }, [data]);

    const center = size / 2;
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    // Calculate percentages and starting positions
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    const segments = data.map((item) => {
        const percentage = total > 0 ? item.value / total : 0;
        const dashArray = circumference;
        const dashOffset = circumference * (1 - percentage);
        const angle = percentage * 360;
        const largeArc = angle > 180 ? 1 : 0;

        // Calculate SVG arc path
        const endAngle = startAngle + angle;
        const startX = center + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
        const startY = center + radius * Math.sin((startAngle - 90) * (Math.PI / 180));
        const endX = center + radius * Math.cos((endAngle - 90) * (Math.PI / 180));
        const endY = center + radius * Math.sin((endAngle - 90) * (Math.PI / 180));

        const pathData = `
      M ${center} ${center}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}
      Z
    `;

        // Save the end angle as start for the next segment
        startAngle = endAngle;

        return {
            ...item,
            percentage,
            dashArray,
            dashOffset,
            pathData,
        };
    });

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
                    {segments.map((segment, i) => (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth={thickness}
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference}
                            className="donut-segment transition-all duration-1000 ease-in-out"
                        />
                    ))}

                    {/* Center hole */}
                    <circle
                        cx={center}
                        cy={center}
                        r={(size - thickness * 2) / 2}
                        fill="white"
                    />
                </svg>

                {/* Percentage in the middle */}
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