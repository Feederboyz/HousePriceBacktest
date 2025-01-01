"use client";
export default function ToggleButton({ name, value }) {
    return (
        <label className="relative block w-16 h-6 ">
            <input
                type="checkbox"
                name={name}
                className="w-0 h-0 opacity-0 peer"
            />
            <span className="absolute top-0 left-0 bg-zinc-50 hover:bg-zinc-300 peer-checked:bg-zinc-300 w-full h-full rounded-full flex justify-center ">
                {value}
            </span>
        </label>
    );
}
