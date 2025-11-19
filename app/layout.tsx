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
        <header className="app-header">
          <div className="app-header-inner">
            <div className="app-logo">
              <div className="app-logo-icon">π</div>
              <div className="app-logo-text">
                <div className="app-logo-title">CUSSAP</div>
                <div className="app-logo-subtitle">
                  CBSE Smart Assessment Platform
                </div>
              </div>
            </div>
            <nav className="app-nav">
              <a href="/">Student Quiz</a>
              <a href="/parent-portal">Parent Portal</a>
              <a href="/parent-dashboard">Teacher / Admin</a>
            </nav>
          </div>
        </header>

        <div className="app-main">
          {/* All page content (quiz, dashboards, portals) renders here */}
          {children}
        </div>

        <footer className="app-footer">
          <span>CUSSAP · AI-assisted learning for Classes 7–12</span>
        </footer>
      </body>
    </html>
  );
}
