"use client";
import HistorySearchCondition from "@/components/HistorySearchCondition";
import dynamic from "next/dynamic";
const HistoryChart = dynamic(() => import("@/components/HistoryChart"), {
    ssr: false,
});

export default function Home() {
    return (
        <div className="relative">
            WIP
            {/* <HistorySearchCondition />
            <HistoryChart /> */}
        </div>
    );
}
