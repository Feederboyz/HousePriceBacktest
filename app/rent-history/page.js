"use client";
import RentHistorySearchCondition from "@/components/RentHistorySearchCondition";
import dynamic from "next/dynamic";
const HistoryChart = dynamic(() => import("@/components/HistoryChart"), {
    ssr: false,
});

export default function Home() {
    return (
        <div className="relative">
            <RentHistorySearchCondition />
            <HistoryChart />
        </div>
    );
}
