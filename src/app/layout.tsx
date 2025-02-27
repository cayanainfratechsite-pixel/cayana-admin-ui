import type { Metadata } from "next";
import { Maven_Pro } from "next/font/google";
import "./globals.css";

const mavenPro = Maven_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add font weights
});

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin Dashboard using Next.js & Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mavenPro.className} `}>
        {children}
      </body>
    </html>
  );
}
