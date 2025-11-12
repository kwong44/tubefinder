import type { Metadata } from 'next';
import Link from 'next/link';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tube Finder - Discover Hidden Surf Spots',
  description:
    'Find hidden surf spots and track swells in remote archipelagos. Real-time wave forecasts, wind conditions, and buoy data for Indonesia, Philippines, and beyond.',
  keywords: [
    'surf forecast',
    'wave tracking',
    'surf spots',
    'Indonesia surf',
    'Philippines surf',
    'swell forecast',
    'buoy data',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="bg-ocean-700 text-white shadow-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold">🌊</div>
                    <h1 className="text-2xl font-bold">Tube Finder</h1>
                  </div>
                  <nav className="hidden md:flex space-x-6">
                    <Link href="/" className="hover:text-ocean-200 transition">
                      Map
                    </Link>
                    <Link
                      href="/spots"
                      className="hover:text-ocean-200 transition"
                    >
                      Spots
                    </Link>
                    <Link
                      href="/forecast"
                      className="hover:text-ocean-200 transition"
                    >
                      Forecast
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-100 border-t">
              <div className="container mx-auto px-4 py-6">
                <div className="text-center text-sm text-gray-600">
                  <p>
                    Data provided by{' '}
                    <a
                      href="https://open-meteo.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ocean-600 hover:underline"
                    >
                      Open-Meteo
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://www.ndbc.noaa.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ocean-600 hover:underline"
                    >
                      NOAA NDBC
                    </a>
                  </p>
                  <p className="mt-2 text-xs">
                    ⚠️ For recreational use only. Always check local conditions
                    and official forecasts before surfing.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
