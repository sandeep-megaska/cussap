import type { Metadata } from "next";
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
       
     

       //<div className="app-main">
          {/* All page content (quiz, dashboards, portals) renders here */}
          {children}
       // </div>

       
      </body>
    </html>
  );
}
