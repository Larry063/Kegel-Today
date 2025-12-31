/* eslint-disable @next/next/no-page-custom-font */
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Kegel Cute | Daily Exercises",
  description: "A cute way to strengthen your pelvic floor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Outfit:wght@300..700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <div className="app-container">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  );
}
