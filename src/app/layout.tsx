import type { Metadata } from "next";
import { Maven_Pro } from "next/font/google";
import "./globals.css";

const mavenPro = Maven_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
});

export const metadata: Metadata = {
  title: "Cayana Admin Panel",
  description: "Cayana Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Directly reference the image from the public folder */}
        <link rel="icon" href="/images/fav.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/CAYANA.png" />
      </head>

      <body className={`${mavenPro.className} `}>
        {children}
      </body>
    </html>
  );
}
