import { NextResponse } from "next/server";
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
            case "lowestPrice": {
                if (value !== "") {
                    whereClause.push(`total_price >= ${parseInt(value)} `);
                }
                break;
            }
            case "highestPrice": {
                if (value !== "") {
                    whereClause.push(`total_price <= ${parseInt(value)} `);
                }
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
            case "transactionStartDate":
            case "transactionEndDate": {
                if (!value) break;
                whereClause.push(
                    `transaction_date${
                        key === "transactionStartDate" ? " >= " : " <= "
                    } '${value}'`
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
    try {
        const res = await pool.query(
            `SELECT * FROM house_price WHERE ${whereClause.join(
                " AND "
            )} LIMIT 100`
        );
        return NextResponse.json(
            { data: res.rows },
            {
                status: 200,
            }
        );
    } catch (dbError) {
        console.log("DB error");
        return NextResponse.json(
            {
                message: "Database query failed",
            },
            {
                status: 500,
            }
        );
    }
}
