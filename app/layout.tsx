import type { Metadata } from 'next';
import Providers from './providers';
import AuthProvider from './components/auth/AuthProvider';
import Header from './components/Header';
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
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
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
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
