"use client";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useQueryResults } from "@/components/context/QueryResultContext";

export default function HistoryChart() {
    const historyResults = useQueryResults().historyResults;
    console.log(historyResults);
    return (
        <div>
            <LineChart width={800} height={800} data={historyResults}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
        </div>
    );
}
