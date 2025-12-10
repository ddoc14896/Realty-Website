import type { Metadata } from "next";
import "./globals.css";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Realty Website - Find Your Dream Property",
  description: "Discover the perfect property with our comprehensive real estate platform. Search, explore, and connect with the best properties in your area.",
  keywords: "real estate, property, homes, apartments, buy, sell, rent",
  authors: [{ name: "Realty Website" }],
  openGraph: {
    title: "Realty Website - Find Your Dream Property",
    description: "Discover the perfect property with our comprehensive real estate platform.",
    type: "website",
    locale: "en_US",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gradient-warm">
        <FavoritesProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </FavoritesProvider>
      </body>
    </html>
  );
}
