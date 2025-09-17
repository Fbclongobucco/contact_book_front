import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contact Book",
  description: "your app of contact book",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body>
          {children}
      </body>
    </html>
  );
}
