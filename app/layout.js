import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { QueryResultProvider } from "@/components/context/QueryResultContext";

export const metadata = {
    title: "房價查詢 - 比實價登錄更好用的查詢工具",
    description: "以圖表呈現歷史房價，以及提供回測功能供使用者測試房屋投報率",
};

export default function RootLayout({ children }) {
    return (
        <html>
            <QueryResultProvider>
                <body className="flex flex-col min-h-screen bg-zinc-50">
                    <Header />
                    <div className="flex-grow max-w-[1200px] w-full mx-auto my-5 gap-5 overflow-x-auto">
                        {children}
                    </div>
                    <Footer />
                </body>
            </QueryResultProvider>
        </html>
    );
}
