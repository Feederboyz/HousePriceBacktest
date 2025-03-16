export default function getQueryConditions(searchParams) {
    const conditions = [];
    const roomConditions = [];
    const bathConditions = [];
    const values = [];

    let index = 1;

    const handlers = {
        city: (value) => {
            conditions.push(`city = $${index++}`);
            values.push(value);
        },
        district: (value) => {
            conditions.push(`district = $${index++}`);
            values.push(value);
        },
        oneRoom: () => {
            roomConditions.push(`room_count = $${index++}`);
            values.push("1");
        },
        twoRoom: () => {
            roomConditions.push(`room_count = $${index++}`);
            values.push("2");
        },
        threeRoom: () => {
            roomConditions.push(`room_count = $${index++}`);
            values.push("3");
        },
        oneBath: () => {
            bathConditions.push(`bathroom_count = $${index++}`);
            values.push("1");
        },
        twoBath: () => {
            bathConditions.push(`bathroom_count = $${index++}`);
            values.push("2");
        },
        lowestPrice: (value) => {
            if (value !== "") {
                conditions.push(`total_price >= $${index++}`);
                values.push(value);
            }
        },
        highestPrice: (value) => {
            if (value !== "") {
                conditions.push(`total_price <= $${index++}`);
                values.push(value);
            }
        },
        parkingSpotCount: (value) => {
            if (value !== "") {
                conditions.push(`parking_count >= $${index++}`);
                values.push(value);
            }
        },
        minHouseAge: (value) => {
            if (!value) return;
            conditions.push(`EXTRACT(YEAR FROM AGE(transaction_date, construction_date)) > $${index++}`);
            values.push(value);
        },
        maxHouseAge: (value) => {
            if (!value) return;
            conditions.push(`EXTRACT(YEAR FROM AGE(transaction_date, construction_date)) < $${index++}`);
            values.push(value);
        },
        minHouseArea: (value) => {
            if (!value) return;
            conditions.push(`house_area >= $${index++}`);
            values.push(value);
        },
        maxHouseArea: (value) => {
            if (!value) return;
            conditions.push(`house_area <= $${index++}`);
            values.push(value);
        },
        minTotalArea: (value) => {
            if (!value) return;
            conditions.push(`total_area >= $${index++}`);
            values.push(value);
        },
        maxTotalArea: (value) => {
            if (!value) return;
            conditions.push(`total_area <= $${index++}`);
            values.push(value);
        },
        transactionStartDate: (value) => {
            if (!value) return;
            conditions.push(`transaction_date >= $${index++}`);
            values.push(value);
        },
        transactionEndDate: (value) => {
            if (!value) return;
            conditions.push(`transaction_date <= $${index++}`);
            values.push(value);
        },
    };

    for (const [key, value] of Object.entries(searchParams)) {
        if (handlers[key]) {
            handlers[key](value);
        }
    }

    if (roomConditions.length > 0) {
        conditions.push(`( ${roomConditions.join(" OR ")} )`);
    }
    if (bathConditions.length > 0) {
        conditions.push(`( ${bathConditions.join(" OR ")} )`);
    }

    return { conditions, values };
}
