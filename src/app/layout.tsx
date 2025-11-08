import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0EA5E9",
};

export const metadata: Metadata = {
  title: "Learn & Connect - Student Dashboard",
  description: "Connect with coursemates worldwide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-linear-to-br from-sky-600 via-blue-800/40 to-indigo-900/70 text-white`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {}
          <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-1 w-full">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
