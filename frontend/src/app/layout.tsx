import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Bibliothèque - Gestion de Bibliothèque",
    description: "Système de gestion de bibliothèque moderne",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={`${inter.className} antialiased bg-white text-black`}>
                <div className="flex min-h-screen">
                    <Sidebar />
                    <main className="flex-1 ml-60 p-8 bg-neutral-50">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
