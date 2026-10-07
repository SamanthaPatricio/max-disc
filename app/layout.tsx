import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Max Imóveis | Seu perfil DISC",
  description: "Conheça seu perfil comportamental: 40 perguntas, quatro dimensões e novas possibilidades para desenvolver seu potencial na Max Imóveis.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
