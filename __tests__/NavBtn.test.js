import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavBtn from "@/components/NavBtn";
import { usePathname } from "next/navigation";

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

describe("NavBtn", () => {
    it("Renders its children", () => {
        usePathname.mockReturnValue("/home");
        render(<NavBtn href="">Home</NavBtn>);
        expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("Check className", () => {
        usePathname.mockReturnValue("/active");
        render(
            <NavBtn href="" className="custom-class">
                Custom Class
            </NavBtn>
        );
        expect(screen.getByText("Custom Class")).toHaveClass("custom-class");
    });

    it("Check if the font-bold class exist when pathname equals to href.", () => {
        usePathname.mockReturnValue("/active");
        render(<NavBtn href="/active">Active Link</NavBtn>);
        expect(screen.getByText("Active Link")).toHaveClass("font-bold");
    });

    it("Check if the font-bold class not exist when pathname not equals to href", () => {
        usePathname.mockReturnValue("/not-active");
        render(<NavBtn href="/different">Inactive Link</NavBtn>);
        expect(screen.getByText("Inactive Link")).not.toHaveClass("font-bold");
    });
});
