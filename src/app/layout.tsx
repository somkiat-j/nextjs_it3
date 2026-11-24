import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Next.js Auth Starter",
  description: "Next.js MongoDB authentication starter",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <Navbar/>
        {children}
        </body>
    </html>
  );
}
