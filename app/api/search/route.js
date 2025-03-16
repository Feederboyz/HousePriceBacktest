import { NextResponse } from "next/server";
import pool from "@/db";
import getQueryConditions from "@/db/getQueryConditions";

export async function GET(request) {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { conditions, values } = getQueryConditions(searchParams);
    let query = "SELECT * FROM second_hand";
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    query += " LIMIT 100";
    try {
        const res = await pool.query(query, values);
        return NextResponse.json({ data: res.rows }, { status: 200 });
    } catch (dbError) {
        console.error("DB error", dbError);
        return NextResponse.json({ message: "Database query failed" }, { status: 500 });
    }
}
