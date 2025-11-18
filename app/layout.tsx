import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CBSE Class 8 Quiz",
  description: "AI-powered chapter-wise quiz for Class 8 CBSE Maths",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

