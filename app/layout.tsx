import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Morning Reset - Beat Morning Paralysis",
  description: "Beat morning paralysis with a simple 30-minute reset. Stop 'just 15 more minutes' from destroying your day.",
  keywords: ["morning paralysis", "beat morning paralysis", "30-minute reset", "stop phone addiction"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${nunito.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
