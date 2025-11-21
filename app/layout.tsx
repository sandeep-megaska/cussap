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
        {/*
        <header className="site-header">
          <div className="site-header-left">
            <Image
              src="/cussap.png"   // 👈 from /public
              alt="Smart CBSE Practice logo"
              width={40}
              height={40}
              className="site-logo"
            />
            <div className="site-brand-text">
              <div className="site-brand-name">Smart CBSE Practice</div>
              <div className="site-brand-tagline">
                Concept-first AI quiz for CBSE
              </div>
            </div>
          </div>

          {/* Right side: your existing nav buttons, if any */}
          {/* Example:
          <nav className="site-nav">
            ...Try Quiz Now / Parent Portal / Kids Area buttons...
          </nav>
          */}
        </header> 
       */}
     

      
          {/* All page content (quiz, dashboards, portals) renders here */}
          {children}
       

       
      </body>
    </html>
  );
}
