import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Event Finance Control",
  description: "Sistema profesional de control financiero para eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
