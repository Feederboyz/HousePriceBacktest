"use client";
import { ComposedChart, Line, XAxis, YAxis, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQueryResults } from "@/components/context/QueryResultContext";

export default function HistoryChart() {
    const historyResults = useQueryResults().historyResults;
    return (
        <div className="flex justify-center">
            <ComposedChart width={800} height={500} data={historyResults}>
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" type="number" dataKey="price" name="price" unit="萬" />
                <YAxis yAxisId="right" type="number" dataKey="count" orientation="right" unit="筆" />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar yAxisId="right" name="成交數" dataKey="count" barSize={20} fill="#82ca9d" />
                <Line yAxisId="left" name="價格(萬)" type="monotone" dataKey="price" stroke="#8884d8" strokeWidth="2" />
            </ComposedChart>
        </div>
    );
}
