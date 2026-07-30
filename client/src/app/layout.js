import { Plus_Jakarta_Sans } from "next/font/google";
import { AppProvider } from "@/context/AppProvider.jsx";
import { ToastContainer } from "@/components/ui/ToastContainer.jsx";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

/**
 * Configure viewport to prevent accidental full-page zoom/distortion on mobile browsers.
 * Keeps website layout stable, crisp, and app-like on mobile devices.
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: {
    default: "Mahakaal Fashion Trends",
    template: "%s | Mahakaal Fashion Trends",
  },
  description: "Exclusive traditional designer Kurtas, Suits, and ethnic trends.",
  openGraph: {
    title: "Mahakaal Fashion Trends",
    description: "Exclusive traditional designer Kurtas, Suits, and ethnic trends.",
    url: "https://mahakaalfashiontrends.com",
    siteName: "Mahakaal Fashion Trends",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`} suppressHydrationWarning>
      <body className="antialiased bg-neutral-50 text-neutral-900 min-h-screen" suppressHydrationWarning>
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
