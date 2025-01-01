import { NextResponse } from "next/server";
import moment from "moment";
import pool from "@/db";

function searchParamsToWhereClause(searchParams) {
    let whereClause = [];
    let roomWhere = [];
    let bathWhere = [];
    for (const [key, value] of Object.entries(searchParams)) {
        switch (key) {
            case "city": {
                whereClause.push(`city = '${value}'`);
                break;
            }
            case "district": {
                whereClause.push(`district = '${value}'`);
                break;
            }
            case "oneRoom": {
                roomWhere.push(`room_count = 1 `);
                break;
            }
            case "twoRoom": {
                roomWhere.push(`room_count = 2 `);
                break;
            }
            case "threeRoom": {
                roomWhere.push(`room_count = 3 `);
                break;
            }
            case "oneBath": {
                bathWhere.push(`bathroom_count = 1 `);
                break;
            }
            case "twoBath": {
                bathWhere.push(`bathroom_count = 2 `);
                break;
            }
            case "parkingSpotCount": {
                if (value === "") break;
                whereClause.push(`parking_count >= ${value} `);
                break;
            }
            case "minHouseAge":
            case "maxHouseAge": {
                if (!value) break;
                whereClause.push(
                    `EXTRACT(YEAR FROM AGE(transaction_date, construction_date))${
                        key === "minHouseAge" ? " > " : " < "
                    } ${value}`
                );

                break;
            }
            case "minHouseArea":
            case "maxHouseArea": {
                if (!value) break;
                whereClause.push(
                    `house_area ${
                        key === "minHouseArea" ? " >= " : " <= "
                    } ${value}`
                );

                break;
            }

            case "minTotalArea":
            case "maxTotalArea": {
                if (!value) break;
                whereClause.push(
                    `total_area ${
                        key === "minTotalArea" ? " >= " : " <= "
                    } ${value}`
                );

                break;
            }
            default:
                break;
        }
    }

    if (roomWhere.length !== 0) {
        whereClause.push(`( ${roomWhere.join(" OR ")} )`);
    }
    if (bathWhere.length !== 0) {
        whereClause.push(`( ${bathWhere.join(" OR ")} )`);
    }

    return whereClause;
}

export async function GET(request) {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const whereClause = searchParamsToWhereClause(searchParams);
    let historyPrices = [];
    for (let year = 2010; year <= 2023; year++) {
        for (let season = 0; season <= 3; season++) {
            const maxMonth = (season + 1) * 3;
            const minMonth = season * 3;
            const maxTransactionData = moment()
                .year(year)
                .month(maxMonth)
                .date(1)
                .startOf("day");
            const minTransactionData = moment()
                .year(year)
                .month(minMonth)
                .date(1)
                .startOf("day");
            try {
                const res = await pool.query({
                    text: `SELECT AVG(total_price) FROM house_price WHERE ${whereClause.join(
                        " AND "
                    )} AND transaction_date >= $1 AND transaction_date <= $2`,
                    values: [
                        minTransactionData.format("YYYY-MM-DD"),
                        maxTransactionData.format("YYYY-MM-DD"),
                    ],
                });
                if (res.rows.length !== 1) {
                    throw new Error(
                        "The length of query results /history is not 1"
                    );
                }
                const date = `${year}s${season}`;
                const price = (res.rows[0].avg / 10000).toFixed(0);
                historyPrices.push({ date, price });
            } catch (dbError) {
                console.log(dbError);
                return NextResponse.json({
                    status: 500,
                    message: "Database query failed",
                });
            }
        }
    }
    return NextResponse.json({ status: 200, data: historyPrices });
}
