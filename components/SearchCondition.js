"use client";
import { cityAndDistrict } from "@/db/constants.js";
import { useQueryResultsDispatch } from "@/components/context/QueryResultContext";
import ToggleButton from "@/components/ToggleButton";
import { useState } from "react";
import HoverDropdown from "@/components/HoverDropdown";
import BaseConditionForm from "@/components/BaseConditionForm";
import LabeledInput from "@/components/LabeledInput";

export default function SearchCondition() {
    const [city, setCity] = useState("臺北市");
    const [district, setDistrict] = useState("請選擇區域");
    const queryResultsDispatch = useQueryResultsDispatch();
    const districts = cityAndDistrict[city] || [];

    const successHandler = (queryResult) => {
        queryResultsDispatch({ type: "newQueryResults", data: queryResult });
    };

    return (
        <BaseConditionForm endpoint="/api/search/" onSuccess={successHandler}>
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
                <LabeledInput label="最低價格" type="number" name="lowestPrice" />
                <LabeledInput label="最高價格" type="number" name="highestPrice" />
            </HoverDropdown>

            <HoverDropdown>
                <LabeledInput label="車位數" type="number" name="parkingSpotCount" />
            </HoverDropdown>
            <HoverDropdown>
                <LabeledInput label="最小屋齡" type="number" name="minHouseAge" />
                <LabeledInput label="最大屋齡" type="number" name="maxHouseAge" />
            </HoverDropdown>

            <HoverDropdown>
                <LabeledInput label="開始日期" type="date" name="transactionStartDate" />
                <LabeledInput label="結束日期" type="date" name="transactionEndDate" />
            </HoverDropdown>

            <HoverDropdown>
                <LabeledInput label="最小室內坪數" type="number" name="minHouseArea" />
                <LabeledInput label="最大室內坪數" type="number" name="maxHouseArea" />
                <LabeledInput label="最小總坪數" type="number" name="minTotalArea" />
                <LabeledInput label="最大總坪數" type="number" name="maxTotalArea" />
            </HoverDropdown>
        </BaseConditionForm>
    );
}
