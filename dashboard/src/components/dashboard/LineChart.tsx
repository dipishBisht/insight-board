"use client";
import React, { useEffect, useRef } from 'react';

interface DataPoint {
    x: string;
    y: number;
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
        const draw = () => {
            if (!svgRef.current || !pathRef.current || (areaChart && !areaPathRef.current)) return;

            const svg = svgRef.current;
            const path = pathRef.current;
            const areaPath = areaPathRef.current;

            const width = svg.clientWidth;
            const chartHeight = height - 30;
            const maxValue = Math.max(...data.map(d => d.y));
            const xScale = width / (data.length - 1);
            const yScale = maxValue > 0 ? chartHeight / maxValue : 0;

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

            if (areaChart) {
                areaPathD += `L ${(data.length - 1) * xScale},${chartHeight} Z`;
            }

            path.setAttribute('d', pathD);
            path.style.strokeDasharray = String(path.getTotalLength());
            path.style.strokeDashoffset = String(path.getTotalLength());

            setTimeout(() => {
                path.style.transition = 'stroke-dashoffset 1s ease-in-out';
                path.style.strokeDashoffset = '0';
            }, 100);

            if (areaChart && areaPath) {
                areaPath.setAttribute('d', areaPathD);
                areaPath.style.opacity = '0';
                setTimeout(() => {
                    areaPath.style.transition = 'opacity 1s ease-in-out';
                    areaPath.style.opacity = '0.1';
                }, 500);
            }
        };

        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [data, height, areaChart]);

    const maxValue = Math.max(...data.map(d => d.y));
    const chartHeight = height - 30;
    const yScale = maxValue > 0 ? chartHeight / maxValue : 0;

    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div className="text-sm text-gray-500">No data available</div>;
    }

    return (
        <div className="w-full h-full" style={{ height }}>
            <svg
                ref={svgRef}
                width="100%"
                height={height}
                viewBox={`0 0 800 ${height}`}
                preserveAspectRatio="none"
                className="overflow-visible"
            >
                {areaChart && (
                    <path
                        ref={areaPathRef}
                        fill={color}
                        opacity="0"
                    />
                )}

                <path
                    ref={pathRef}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {showDots && data.map((point, i) => {
                    const xScale = 800 / (data.length - 1);
                    const x = i * xScale;
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
                            style={{ opacity: 1 }}
                        />
                    );
                })}
            </svg>

            <div className="flex justify-between mt-2">
                {data.length > 7 ? (
                    <>
                        <div className="text-xs text-gray-500">{data[0].x}</div>
                        <div className="text-xs text-gray-500">{data[Math.floor(data.length / 2)].x}</div>
                        <div className="text-xs text-gray-500">{data[data.length - 1].x}</div>
                    </>
                ) : (
                    data.map((point, i) => (
                        <div key={i} className="text-xs text-gray-500">{point.x}</div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LineChart;
