/**
 * @jest-environment node
 */
import { GET } from "../../app/api/search/route";
import pool from "../../db";

jest.mock("../../db", () => ({
    query: jest.fn(),
}));

describe("GET API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call pool.query with expected parameters", async () => {
        const fakeRequest = {
            nextUrl: {
                searchParams: new URLSearchParams({
                    city: "TestCity",
                    district: "TestDistrict",
                    oneRoom: "on",
                }),
            },
        };
        const queryResult = [{ id: 1, house: "Test House" }];
        pool.query.mockResolvedValue({ rows: queryResult });
        const response = await GET(fakeRequest);
        expect(pool.query).toHaveBeenCalledTimes(1);

        const [query, values] = pool.query.mock.calls[0];
        expect(query).toContain("FROM second_hand");
        expect(query).toContain("LIMIT 100");
        expect(query).toContain("city = $1");
        expect(query).toContain("district = $2");
        expect(query).toContain("room_count = $3");
        expect(values).toEqual(["TestCity", "TestDistrict", "1"]);

        const json = await response.json();
        expect(json).toHaveProperty("data");
        expect(Array.isArray(json.data)).toBe(true);
        expect(json.data).toEqual(queryResult);
    });
});
