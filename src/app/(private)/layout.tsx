import { Header } from "@/components/header";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body>
            <Header/>
          {children}
      </body>
    </html>
  );
}
