import type { Metadata } from "next";
import { Inter } from "next/font/google";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Readit sanity admin Panel",
  description:
    "Readit sanity admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en" className={`${inter.className} antialiased`}>
        <body>
            {children}
        </body>
      </html>
    
  );
}
