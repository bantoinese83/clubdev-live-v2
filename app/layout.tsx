// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from "react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ClubDev Live Coding Platform',
    description: 'Live stream your coding sessions and share with the community.',
    // You can add more metadata here like keywords, open graph tags, etc.
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <header>
            {/* You can add a common header here if needed, e.g., a logo or navigation */}
            <nav>
                <h1>ClubDev</h1>
                {/* Add navigation links if you have more pages */}
            </nav>
        </header>
        <main>
            {children} {/* This is where your page content will be rendered */}
        </main>
        <footer>
            {/* Optional footer for copyright info, etc. */}
            <p>© {new Date().getFullYear()} ClubDev. All rights reserved.</p>
        </footer>
        </body>
        </html>
    );
}