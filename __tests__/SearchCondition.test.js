import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/dom";
import SearchCondition from "@/components/SearchCondition";
import userEvent from "@testing-library/user-event";
import { useQueryResultsDispatch } from "../components/context/QueryResultContext";

const fetchReturn = [{ id: 1, price: "1000" }];
jest.mock("../components/context/QueryResultContext", () => ({
    useQueryResultsDispatch: jest.fn(),
}));

describe("SearchCondition", () => {
    beforeEach(() => {
        mockDispatch = jest.fn();
        useQueryResultsDispatch.mockReturnValue(mockDispatch);
        global.fetch = jest.fn((qp) => {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ data: fetchReturn }),
            });
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("Test submit", async () => {
        render(<SearchCondition />);
        const submitButton = screen.getByRole("button", { name: /Submit/ });
        await userEvent.click(submitButton);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "newQueryResults",
            data: fetchReturn,
        });
    });

    it("clicking the already selected city does not reset a manually chosen district", () => {
        render(<SearchCondition />);
        const districtRadio = screen.getByLabelText("中正區");
        fireEvent.click(districtRadio);
        expect(districtRadio.checked).toBe(true);
        const cityRadio = screen.getByLabelText("臺北市");
        fireEvent.click(cityRadio);
        expect(districtRadio.checked).toBe(true);
    });

    it("Check if all the input in the form are expected.", async () => {
        render(<SearchCondition />);

        const formData = [
            // Radio buttons
            { label: "新北市", action: "click", expectedKey: "city", expectedValue: "新北市" },
            { label: "三峽區", action: "click", expectedKey: "district", expectedValue: "三峽區" },
            { label: "一房", action: "click", expectedKey: "oneRoom", expectedValue: "on" },
            { label: "兩房", action: "click", expectedKey: "twoRoom", expectedValue: "on" },
            { label: "三房", action: "click", expectedKey: "threeRoom", expectedValue: "on" },
            { label: "一衛", action: "click", expectedKey: "oneBath", expectedValue: "on" },
            { label: "兩衛", action: "click", expectedKey: "twoBath", expectedValue: "on" },
            // Text inputs
            { label: "最低價格", action: "type", value: "1000000", expectedKey: "lowestPrice", expectedValue: "1000000" },
            { label: "最高價格", action: "type", value: "10000000", expectedKey: "highestPrice", expectedValue: "10000000" },
            { label: "開始日期", action: "type", value: "2010-01-01", expectedKey: "transactionStartDate", expectedValue: "2010-01-01" },
            { label: "結束日期", action: "type", value: "2020-01-01", expectedKey: "transactionEndDate", expectedValue: "2020-01-01" },
            { label: "車位數", action: "type", value: "2", expectedKey: "parkingSpotCount", expectedValue: "2" },
            { label: "最小屋齡", action: "type", value: "5", expectedKey: "minHouseAge", expectedValue: "5" },
            { label: "最大屋齡", action: "type", value: "20", expectedKey: "maxHouseAge", expectedValue: "20" },
            { label: "最小室內坪數", action: "type", value: "10", expectedKey: "minHouseArea", expectedValue: "10" },
            { label: "最大室內坪數", action: "type", value: "20", expectedKey: "maxHouseArea", expectedValue: "20" },
            { label: "最小總坪數", action: "type", value: "10", expectedKey: "minTotalArea", expectedValue: "10" },
            { label: "最大總坪數", action: "type", value: "20", expectedKey: "maxTotalArea", expectedValue: "20" },
        ];

        // Fill in the form
        for (const field of formData) {
            if (field.action === "click") {
                await userEvent.click(screen.getByLabelText(field.label));
            } else if (field.action === "type") {
                const inputField = screen.getByLabelText(field.label);
                await userEvent.clear(inputField);
                await userEvent.type(inputField, field.value);
            }
        }

        await userEvent.click(screen.getByRole("button", { name: /Submit/ }));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        const fetchCallUrl = global.fetch.mock.calls[0][0];
        const searchParams = new URLSearchParams(fetchCallUrl.split("?").at(-1));

        for (const field of formData) {
            expect(searchParams.get(field.expectedKey)).toEqual(field.expectedValue);
        }
    });
});
