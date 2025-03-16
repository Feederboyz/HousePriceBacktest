import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/dom";
import HistorySearchCondition from "@/components/HistorySearchCondition";
import userEvent from "@testing-library/user-event";
import { useQueryResultsDispatch } from "../components/context/QueryResultContext";

jest.mock("../components/context/QueryResultContext", () => ({
    useQueryResultsDispatch: jest.fn(),
}));

describe("HistorySearchCondition", () => {
    beforeEach(() => {
        mockDispatch = jest.fn();
        useQueryResultsDispatch.mockReturnValue(mockDispatch);

        global.fetch = jest.fn((qp) => {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ data: [{ id: 1, price: "1000", count: "3" }] }),
            });
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("Test submit", async () => {
        render(<HistorySearchCondition />);
        const submitButton = screen.getByRole("button", { name: /Submit/ });
        await userEvent.click(submitButton);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "newHistoryPrices",
            data: [{ id: 1, price: 1000, count: 3 }],
        });
    });

    it("clicking the already selected city does not reset a manually chosen district", () => {
        render(<HistorySearchCondition />);
        const districtRadio = screen.getByLabelText("中正區");
        fireEvent.click(districtRadio);
        expect(districtRadio.checked).toBe(true);
        const cityRadio = screen.getByLabelText("臺北市");
        fireEvent.click(cityRadio);
        expect(districtRadio.checked).toBe(true);
    });

    it("Check if all the input in the form are expected.", async () => {
        render(<HistorySearchCondition />);
        const formData = [
            { label: "新北市", action: "click", expectedKey: "city", expectedValue: "新北市" },
            { label: "三峽區", action: "click", expectedKey: "district", expectedValue: "三峽區" },
            { label: "一房", action: "click", expectedKey: "oneRoom", expectedValue: "on" },
            { label: "兩房", action: "click", expectedKey: "twoRoom", expectedValue: "on" },
            { label: "三房", action: "click", expectedKey: "threeRoom", expectedValue: "on" },
            { label: "一衛", action: "click", expectedKey: "oneBath", expectedValue: "on" },
            { label: "兩衛", action: "click", expectedKey: "twoBath", expectedValue: "on" },
            { label: "車位數", action: "type", value: "2", expectedKey: "parkingSpotCount", expectedValue: "2" },
            { label: "最小屋齡", action: "type", value: "5", expectedKey: "minHouseAge", expectedValue: "5" },
            { label: "最大屋齡", action: "type", value: "20", expectedKey: "maxHouseAge", expectedValue: "20" },
            { label: "最小室內坪數", action: "type", value: "10", expectedKey: "minHouseArea", expectedValue: "10" },
            { label: "最大室內坪數", action: "type", value: "20", expectedKey: "maxHouseArea", expectedValue: "20" },
            { label: "最小總坪數", action: "type", value: "10", expectedKey: "minTotalArea", expectedValue: "10" },
            { label: "最大總坪數", action: "type", value: "20", expectedKey: "maxTotalArea", expectedValue: "20" },
        ];

        for (const field of formData) {
            const element = screen.getByLabelText(field.label);
            if (field.action === "click") {
                await userEvent.click(element);
            } else if (field.action === "type") {
                await userEvent.clear(element);
                await userEvent.type(element, field.value);
            }
        }

        // Submit
        await userEvent.click(screen.getByRole("button", { name: /Submit/ }));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        // Test
        const fetchCallUrl = global.fetch.mock.calls[0][0];
        const searchParams = new URLSearchParams(fetchCallUrl.split("?").at(-1));
        for (const field of formData) {
            expect(searchParams.get(field.expectedKey)).toEqual(field.expectedValue);
        }
    });
});
