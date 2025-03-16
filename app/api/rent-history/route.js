import { NextResponse } from "next/server";
import moment from "moment";
import pool from "@/db";
import getQueryConditions from "@/db/getQueryConditions";

export async function GET(request) {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { conditions, values } = getQueryConditions(searchParams);
    let historyPrices = [];
    for (let year = 2015; year <= 2023; year++) {
        for (let season = 0; season <= 3; season++) {
            const maxMonth = (season + 1) * 3;
            const minMonth = season * 3;
            const maxTransactionDate = moment().year(year).month(maxMonth).date(1).startOf("day");
            const minTransactionDate = moment().year(year).month(minMonth).date(1).startOf("day");

            let query = `SELECT AVG(total_price) AS avg, COUNT(*) AS count FROM rent`;
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }
            query += ` AND transaction_date >= $${values.length + 1} AND transaction_date <= $${values.length + 2}`;

            try {
                const res = await pool.query(query, [...values, minTransactionDate.format("YYYY-MM-DD"), maxTransactionDate.format("YYYY-MM-DD")]);
                if (res.rows.length !== 1) {
                    throw new Error("The length of query results /history is not 1");
                }
                const date = `${year}s${season}`;
                const price = (res.rows[0].avg / 10000).toFixed(2);
                const count = res.rows[0].count;
                historyPrices.push({ date, price, count });
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
