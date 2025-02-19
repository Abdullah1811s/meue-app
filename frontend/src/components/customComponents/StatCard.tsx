'use client'
import { useEffect, useState } from "react";

export const StatCard = ({ end, label }: { end: number, label: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1000;
        const stepTime = Math.abs(Math.floor(duration / end));

        const timer = setInterval(() => {
            start += 50;
            setCount(start);
            if (start >= end) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, [end]);

    return (
        <div className="border border-black rounded-lg p-6 w-52 text-center shadow-md">
            <h2 className="text-3xl font-bold">{count.toLocaleString()}+</h2>
            <p className="text-lg text-gray-700">{label}</p>
        </div>
    );
};