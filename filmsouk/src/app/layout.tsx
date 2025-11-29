import type { Metadata } from "next";
import "./styles/globals.css";  
import Header from "@/app/components/Layouts/Header";
import Footer from "@/app/components/Layouts/Footer";
import { Open_Sans } from 'next/font/google';
import ServiceWorkerRegister from "@/app/components/ServiceWorkerRegister"; 

const openSans = Open_Sans({ subsets: ["latin"], weight: ["400", "600", "700"] });



export const metadata: Metadata = {
  title: "golden screen",
  description: "Golden Screen it's a movie web application for you to discover the latest movies and tv shows.",
   manifest: "/manifest.json",   // 👈 this line adds the manifest
  themeColor: "#000000",        // optional, sets browser theme color
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
        <ServiceWorkerRegister /> 
        <Footer />
        
      </body>
    </html>
  );
}