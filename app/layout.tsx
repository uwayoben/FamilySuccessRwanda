import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Family Success Rwanda | Transforming Lives Together",
  description:
    "Family Success Rwanda (FSR) is a Christian humanitarian NGO serving and empowering the most vulnerable communities in Rwanda through education, healthcare, women empowerment, and family strengthening.",
  keywords:
    "Family Success Rwanda, FSR, NGO Rwanda, humanitarian, education Rwanda, Nyaruguru, Faina Jerusalem Village",
  openGraph: {
    title: "Family Success Rwanda",
    description: "Transforming Lives Together — empowering vulnerable communities in Rwanda.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-white">
        {children}
      </body>
    </html>
  );
}
