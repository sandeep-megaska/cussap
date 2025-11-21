import type { Metadata } from "next";
import Image from "next/image";

import "./globals.css";

export const metadata: Metadata = {
  title: "CUSSAP | Smart CBSE Practice",
  description:
    "AI-powered quiz and insight platform for CBSE students, parents, and teachers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-body">
       
     

      
          {/* All page content (quiz, dashboards, portals) renders here */}
          {children}
       

       
      </body>
    </html>
  );
}
