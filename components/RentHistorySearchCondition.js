"use client";
import { cityAndDistrict } from "@/db/constants.js";
import { useQueryResultsDispatch } from "@/components/context/QueryResultContext";
import ToggleButton from "@/components/ToggleButton";
import LabeledInput from "@/components/LabeledInput";
import { useState } from "react";
import HoverDropdown from "@/components/HoverDropdown";
import BaseConditionForm from "@/components/BaseConditionForm";

export default function RentHistorySearchCondition() {
    const [city, setCity] = useState("臺北市");
    const [district, setDistrict] = useState("請選擇區域");
    const queryResultsDispatch = useQueryResultsDispatch();
    const districts = cityAndDistrict[city] || [];

    const successHandler = (queryResult) => {
        let data = queryResult.map((item) => ({
            ...item,
            price: parseFloat(item.price, 10),
            count: parseInt(item.count, 10),
        }));
        queryResultsDispatch({ type: "newHistoryPrices", data: data });
    };

    return (
        <BaseConditionForm endpoint="/api/rent-history/" onSuccess={successHandler}>
            <HoverDropdown title={city}>
                {Object.keys(cityAndDistrict).map((cityName) => (
                    <LabeledInput
                        key={cityName}
                        label={cityName}
                        type="radio"
                        name="city"
                        value={cityName}
                        checked={city === cityName}
                        onChange={() => {
                            if (city !== cityName) {
                                setCity(cityName);
                                setDistrict("請選擇區域");
                            }
                        }}
                    />
                ))}
            </HoverDropdown>
            <HoverDropdown title={district}>
                {districts.map((districtName) => (
                    <LabeledInput
                        key={districtName}
                        label={districtName}
                        type="radio"
                        name="district"
                        onClick={() => setDistrict(districtName)}
                        value={districtName}
                    />
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
                <LabeledInput label="車位數" type="number" name="parkingSpotCount" />
            </HoverDropdown>
            <HoverDropdown>
                <LabeledInput label="最小屋齡" type="number" name="minHouseAge" />
                <LabeledInput label="最大屋齡" type="number" name="maxHouseAge" />
            </HoverDropdown>
            <HoverDropdown>
                <LabeledInput label="最小總坪數" type="number" name="minTotalArea" />
                <LabeledInput label="最大總坪數" type="number" name="maxTotalArea" />
            </HoverDropdown>
        </BaseConditionForm>
    );
}
