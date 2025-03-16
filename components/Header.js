"use client";
import NavBtn from "@/components/NavBtn";

export default function Header() {
    return (
        <nav className="w-full border-b-[1px] border-zinc-200 flex-shrink-0 ">
            <div className="max-w-[1200px] mx-auto flex items-center gap-2">
                <div className="p-2 w-[150px] flex-shrink-0">Feederboy</div>
                <div className="flex-grow"></div>

                <NavBtn href="/">Search</NavBtn>
                <NavBtn href="/history">History</NavBtn>
                <NavBtn href="/rent-history">Rent</NavBtn>
            </div>
        </nav>
    );
}
