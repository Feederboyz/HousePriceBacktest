"use client";
import { cityAndDistrict } from "@/db/constants.js";
import { useQueryResultsDispatch } from "@/components/context/QueryResultContext";
import ToggleButton from "@/components/ToggleButton";
import { useState, useCallback } from "react";
import HoverDropdown from "@/components/HoverDropdown";

export default function SearchCondition() {
    const [city, setCity] = useState("臺北市");
    const [district, setDistrict] = useState("請選擇區域");
    const queryResultsDispatch = useQueryResultsDispatch();

    async function handleSumbit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filteredEntries = [...formData.entries()].filter(
            ([key, value]) => value.trim() !== ""
        );

        const queryParamsStr = new URLSearchParams(filteredEntries).toString();

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_HOST}/api?${queryParamsStr}`
            );

            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const res = await response.json();
            queryResultsDispatch({ type: "newQueryResults", data: res.data });
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    const handleCityOnClick = useCallback((currCity, nextCity) => {
        return () => {
            if (currCity === nextCity) return;
            setCity(nextCity);
            setDistrict("請選擇區域");
        };
    }, []);

    return (
        <form
            className="flex items-center gap-3 w-[95%] my-5 m-auto px-5 bg-zinc-200 h-[50px] rounded-md shadow-sm shadow-zinc-400"
            onSubmit={handleSumbit}
        >
            <HoverDropdown title={city}>
                {Object.keys(cityAndDistrict).map((cityName, index) => (
                    <div key={cityName}>
                        <label>
                            <input
                                type="radio"
                                onClick={handleCityOnClick(city, cityName)}
                                name="city"
                                value={cityName}
                                defaultChecked={cityName === "臺北市"}
                            />
                            {cityName}
                        </label>
                    </div>
                ))}
            </HoverDropdown>
            <HoverDropdown title={district}>
                {cityAndDistrict[city].map((districtName) => (
                    <div key={districtName}>
                        <label>
                            <input
                                type="radio"
                                onClick={() => setDistrict(districtName)}
                                name="district"
                                value={districtName}
                            />
                            {districtName}
                        </label>
                    </div>
                ))}
            </HoverDropdown>
            <HoverDropdown>
                <div className="rounded-md m-2 p-2 flex flex-row gap-2">
                    <ToggleButton name="oneRoom" value="一房" />
                    <ToggleButton name="twoRoom" value="兩房" />
                    <ToggleButton name="threeRoom" value="三房" />
                </div>

                <div className="rounded-sm m-2 p-2 flex flex-row gap-2">
                    <ToggleButton name="oneBath" value="一衛" />
                    <ToggleButton name="twoBath" value="兩衛" />
                </div>
            </HoverDropdown>

            <HoverDropdown>
                <label>
                    最低價格
                    <input
                        type="number"
                        name="lowestPrice"
                        className="w-full"
                    />
                </label>
                <label>
                    最高價格
                    <input
                        type="number"
                        name="highestPrice"
                        className="w-full"
                    />
                </label>
            </HoverDropdown>

            <HoverDropdown>
                <label>
                    車位數
                    <input
                        type="number"
                        name="parkingSpotCount"
                        className="w-full"
                    />
                </label>
            </HoverDropdown>
            <HoverDropdown>
                <label>
                    最小屋齡
                    <input
                        type="number"
                        name="minHouseAge"
                        className="w-full"
                    />
                </label>
                <label>
                    最大屋齡
                    <input
                        type="number"
                        name="maxHouseAge"
                        className="w-full"
                    />
                </label>
            </HoverDropdown>

            <HoverDropdown>
                <label>
                    開始日期
                    <input
                        type="date"
                        name="transactionStartDate"
                        className="w-full"
                    />
                </label>
                <label>
                    結束日期
                    <input
                        type="date"
                        name="transactionEndDate"
                        className="w-full"
                    />
                </label>
            </HoverDropdown>

            <HoverDropdown>
                <label>
                    最小室內坪數
                    <input
                        type="number"
                        name="minHouseArea"
                        className="w-full"
                    />
                </label>
                <label>
                    最大室內坪數
                    <input
                        type="number"
                        name="maxHouseArea"
                        className="w-full"
                    />
                </label>
                <label>
                    最小總坪數
                    <input
                        type="number"
                        name="minTotalArea"
                        className="w-full"
                    />
                </label>
                <label>
                    最大總坪數
                    <input
                        type="number"
                        name="maxTotalArea"
                        className="w-full"
                    />
                </label>
            </HoverDropdown>
            <div className="flex-grow" />
            <button className="bg-zinc-50 rounded-md shadow-sm shadow-zinc-300 px-2">
                Submit
            </button>
        </form>
    );
}
