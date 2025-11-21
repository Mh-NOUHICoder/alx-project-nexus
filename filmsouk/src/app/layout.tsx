import type { Metadata } from "next";
import "./styles/globals.css";  
import Header from "@/app/components/Layouts/Header";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "600", "700"] });



export const metadata: Metadata = {
  title: "filmsouk",
  description: "filmsouk description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
