"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBtn({ className, href, children }) {
    const pathname = usePathname();
    const isActive = href === pathname;

    return (
        <Link
            href={href}
            className={`my-2 px-2 py-1 block rounded-md hover:bg-zinc-200 ${className} ${
                isActive && "font-bold"
            }`}
        >
            {children}
        </Link>
    );
}
