"use client";
import { useQueryResults } from "@/components/context/QueryResultContext";
import { useState } from "react";
import moment from "moment";
export default function Table() {
    const DATA_PER_PAGE = 20;
    const [page, setPage] = useState(0);
    const queryResults = useQueryResults().queryResults;
    const pageCount = Math.ceil(queryResults.length / DATA_PER_PAGE);
    return (
        <>
            <table className="table-fixed w-full">
                <thead>
                    <tr className="bg-zinc-300 text-left border-b-[1px] border-zinc-500">
                        <th className="py-2 w-[350px]">地址</th>
                        <th className="py-2 w-[30px]">房</th>
                        <th className="py-2 w-[30px]">廳</th>
                        <th className="py-2 w-[30px]">衛</th>
                        <th className="py-2 w-[30px]">車</th>
                        <th className="py-2 w-[40px]">總價</th>
                        <th className="py-2 w-[40px]">坪數</th>
                        <th className="py-2 w-[90px]">主建物坪數</th>
                        <th className="py-2 w-[90px]">交易時屋齡</th>
                        <th className="py-2 w-[70px]">成交日期</th>
                    </tr>
                </thead>
                <tbody>
                    {queryResults
                        .slice(page, page + DATA_PER_PAGE)
                        .map((obj) => (
                            <tr
                                key={obj.id}
                                className="even:bg-zinc-200 hover:bg-zinc-300 border-b-zinc-300 border-b-[1px]"
                            >
                                <td className="py-1 line-clamp-1">
                                    {obj.address}
                                </td>
                                <td className="py-1">{obj.room_count}</td>
                                <td className="py-1">{obj.hall_count}</td>
                                <td className="py-1">{obj.bathroom_count}</td>
                                <td className="py-1">{obj.parking_count}</td>
                                <td className="py-1">
                                    {(obj.total_price / 10000).toFixed(0)}
                                </td>
                                <td className="py-1">
                                    {obj.total_area.toFixed(1)}
                                </td>
                                <td className="py-1">
                                    {obj.house_area.toFixed(1)}
                                </td>
                                {/* Age */}
                                <td className="py-1">
                                    {moment(obj.transaction_date).diff(
                                        moment(obj.construction_date),
                                        "years"
                                    )}
                                </td>
                                <td className="py-1">
                                    {moment(
                                        new Date(obj.transaction_date)
                                    ).format("YYYY/MM")}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {/* <div>
                {queryResults &&
                    Array.from(Array(pageCount), (_, i) => (
                        <button
                            key={`toPage${i + 1}`}
                            onClick={() => setPage(i)}
                        >
                            {` ${i + 1} `}
                        </button>
                    ))}
            </div> */}
        </>
    );
}
