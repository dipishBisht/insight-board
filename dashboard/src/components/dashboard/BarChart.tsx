"use client";
import React, { useEffect, useRef, useState } from 'react';

interface BarChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, height = 240 }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [animate, setAnimate] = useState(false);

    const maxValue = Math.max(...data.map(item => item.value));
    const scale = maxValue > 0 ? (height - 40) / maxValue : 0;

    useEffect(() => {
        setAnimate(false);
        const timer = setTimeout(() => setAnimate(true), 100);

        return () => clearTimeout(timer);
    }, [data]);

    return (
        <div className="w-full h-full" style={{ height }}>
            <div className="flex items-end h-full gap-2 pt-5" ref={chartRef}>
                {data.map((item, index) => {
                    const barHeight = item.value * scale;
                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center justify-end"
                        >
                            <div
                                className="bar-item w-full rounded-t-md transition-all duration-700 ease-out opacity-100"
                                style={{
                                    backgroundColor: item.color,
                                    height: animate ? `${barHeight}px` : '0px',
                                    opacity: animate ? 1 : 0,
                                }}
                            />
                            <div className="text-xs font-medium text-gray-500 mt-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center">
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BarChart;
