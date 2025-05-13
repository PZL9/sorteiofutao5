import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorteio Pelo Churrasco F.C.",
  description: "Acabou a panela Jordan, agora é só no app.",
  openGraph: {
    title: "Sorteio Pelo Churrasco F.C.",
    description: "Acabou a panela Jordan, agora é só no app.",
    url: "https://futaodeterca.vercel.app", // substitua se usar outro domínio
    siteName: "Pelo Churrasco F.C.",
    images: [
      {
        url: "/logo.png", // o logo já está na pasta public
        width: 1200,
        height: 630,
        alt: "Logo Pelo Churrasco F.C.",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pelo Churrasco F.C.",
    description: "Acabou a panela Jordan, agora é só no app!",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
