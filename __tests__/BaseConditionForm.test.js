import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/dom";
import BaseConditionForm from "@/components/BaseConditionForm";
import userEvent from "@testing-library/user-event";

const fetchReturn = [{ id: 1, price: "1000" }];
describe("HistorySearchCondition", () => {
    beforeEach(() => {
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

    it("Test end point:'search' ", async () => {
        const onSuccess = jest.fn();
        render(<BaseConditionForm endpoint="search" onSuccess={onSuccess} />);
        const submitButton = screen.getByRole("button", { name: /Submit/ });
        await userEvent.click(submitButton);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        expect(global.fetch).toHaveBeenCalledWith("undefinedsearch");
        expect(onSuccess).toHaveBeenCalledWith(fetchReturn);
    });
});
