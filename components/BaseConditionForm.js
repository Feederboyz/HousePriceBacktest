"use client";
import React from "react";

export default function BaseConditionForm({ endpoint, onSuccess, children, className = "" }) {
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filteredEntries = [...formData.entries()].filter(([, value]) => value.trim() !== "");
        const queryParamsStr = new URLSearchParams(filteredEntries).toString();
        try {
            let URL = `${process.env.NEXT_PUBLIC_HOST}${endpoint}`;
            URL += queryParamsStr && `?${queryParamsStr}`;
            const response = await fetch(URL);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const res = await response.json();
            onSuccess && onSuccess(res.data);
        } catch (error) {
            console.error("Submit error:", error);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`z-50 flex items-center gap-3 w-[95%] my-5 m-auto px-5 bg-zinc-200 h-[50px] rounded-md shadow-sm shadow-zinc-400 ${className}`}
        >
            {children}
            <div className="flex-grow" />
            <button className="bg-zinc-50 rounded-md shadow-sm shadow-zinc-300 px-2">Submit</button>
        </form>
    );
}
