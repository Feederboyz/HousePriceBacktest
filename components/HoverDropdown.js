"use client";
import { useState } from "react";
export default function HoverDropdown({ title, children }) {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className="relative w-[100px]"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className="flex flex-row w-full bg-zinc-50 ">
                <div className="flex-grow flex items-center text-left text-nowrap">
                    {title}
                </div>
                <div className="flex-shrink-0 flex justify-center items-center w-2 ">
                    {isHover ? "^" : "v"}
                </div>
            </div>
            <div
                className={`${
                    !isHover ? "hidden" : ""
                } absolute z-10 top-full bg-zinc-200 w-[250px] p-2 rounded-sm shadow-sm shadow-zinc-400`}
            >
                {children}
            </div>
        </div>
    );
}
