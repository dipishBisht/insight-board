"use client";
import React, { useEffect, useRef } from 'react';

interface DataPoint {
    x: string; // Label for the x-axis
    y: number; // Value for the y-axis
}

interface LineChartProps {
    data: DataPoint[];
    height?: number;
    color?: string;
    showDots?: boolean;
    areaChart?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
    data,
    height = 240,
    color = '#3b82f6',
    showDots = true,
    areaChart = true,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const areaPathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const draw = () => {
            if (!svgRef.current || !pathRef.current || (areaChart && !areaPathRef.current)) return;

            const svg = svgRef.current;
            const path = pathRef.current;
            const areaPath = areaPathRef.current;

            // Get SVG dimensions
            const width = svg.clientWidth;
            const chartHeight = height - 30; // Leave space for labels

            // Find max value for scaling
            const maxValue = Math.max(...data.map(d => d.y));

            // Calculate scales
            const xScale = width / (data.length - 1);
            const yScale = maxValue > 0 ? chartHeight / maxValue : 0;

            // Generate line path
            let pathD = '';
            let areaPathD = '';

            data.forEach((point, i) => {
                const x = i * xScale;
                const y = chartHeight - (point.y * yScale);

                if (i === 0) {
                    pathD += `M ${x},${y} `;
                    areaPathD += `M ${x},${chartHeight} L ${x},${y} `;
                } else {
                    pathD += `L ${x},${y} `;
                    areaPathD += `L ${x},${y} `;
                }
            });

            // Close area path
            if (areaChart) {
                areaPathD += `L ${(data.length - 1) * xScale},${chartHeight} Z`;
            }

            // Set path attributes
            path.setAttribute('d', pathD);
            path.style.strokeDasharray = String(path.getTotalLength());
            path.style.strokeDashoffset = String(path.getTotalLength());

            // Animate path
            setTimeout(() => {
                path.style.transition = 'stroke-dashoffset 1s ease-in-out';
                path.style.strokeDashoffset = '0';
            }, 100);

            // Set area path if enabled
            if (areaChart && areaPath) {
                areaPath.setAttribute('d', areaPathD);
                areaPath.style.opacity = '0';

                // Animate area path
                setTimeout(() => {
                    areaPath.style.transition = 'opacity 1s ease-in-out';
                    areaPath.style.opacity = '0.1';
                }, 500);
            }
        };

        draw();

        // Redraw on window resize
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [data, height, areaChart]);

    const maxValue = Math.max(...data.map(d => d.y));
    const chartHeight = height - 30;
    const yScale = maxValue > 0 ? chartHeight / maxValue : 0;

    return (
        <div className="w-full h-full" style={{ height }}>
            <svg
                ref={svgRef}
                width="100%"
                height={height}
                viewBox={`0 0 100% ${height}`}
                preserveAspectRatio="none"
                className="overflow-visible"
            >
                {/* Area fill */}
                {areaChart && (
                    <path
                        ref={areaPathRef}
                        fill={color}
                        opacity="0"
                    />
                )}

                {/* Line */}
                <path
                    ref={pathRef}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {showDots && data.map((point, i) => {
                    const xScale = 100 / (data.length - 1);
                    const x = `${i * xScale}%`;
                    const y = chartHeight - (point.y * yScale);

                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
                            opacity="0"
                            className="transition-opacity duration-500"
                            style={{ animationDelay: `${i * 100}ms`, opacity: 1 }}
                        />
                    );
                })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2">
                {data.length > 7 ? (
                    // If many data points, show only a few labels
                    <>
                        <div className="text-xs text-gray-500">{data[0].x}</div>
                        <div className="text-xs text-gray-500">{data[Math.floor(data.length / 2)].x}</div>
                        <div className="text-xs text-gray-500">{data[data.length - 1].x}</div>
                    </>
                ) : (
                    // If few data points, show all labels
                    data.map((point, i) => (
                        <div key={i} className="text-xs text-gray-500">{point.x}</div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LineChart;