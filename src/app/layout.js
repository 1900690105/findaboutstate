import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves performance by reducing layout shift
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  // Primary Meta Tags
  title: {
    default: "City Information Finder - Discover Cities Worldwide",
    template: "%s | City Information Finder",
  },
  description:
    "Find detailed information about cities in any state and country. Get city descriptions, history, famous attractions, and travel insights with our free city lookup tool.",

  // Keywords for SEO
  keywords: [
    "city information",
    "city finder",
    "state cities",
    "country cities",
    "travel information",
    "city history",
    "city descriptions",
    "tourist destinations",
    "city guide",
    "geographical information",
    "urban exploration",
    "city database",
  ],

  // Author and Site Info
  authors: [{ name: "City Information Finder Team" }],
  creator: "City Information Finder",
  publisher: "City Information Finder",
  applicationName: "City Information Finder",

  // Open Graph Meta Tags (for social media sharing)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://findaboutstate.vercel.app", // Replace with your actual domain
    siteName: "City Information Finder",
    title: "City Information Finder - Discover Cities Worldwide",
    description:
      "Find detailed information about cities in any state and country. Get city descriptions, history, famous attractions, and travel insights.",
    images: [
      {
        url: "https://findaboutstate.vercel.app/og-image.jpg", // Replace with your OG image
        width: 1200,
        height: 630,
        alt: "City Information Finder - Discover Cities Worldwide",
      },
    ],
  },

  // Twitter Card Meta Tags
  twitter: {
    card: "summary_large_image",
    site: "@yourtwitterhandle", // Replace with your Twitter handle
    creator: "@yourtwitterhandle",
    title: "City Information Finder - Discover Cities Worldwide",
    description:
      "Find detailed information about cities in any state and country. Get city descriptions, history, and famous attractions.",
    images: ["https://findaboutstate.vercel.app/twitter-image.jpg"], // Replace with your Twitter image
  },

  // Additional Meta Tags
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification tags (add your actual verification codes)
  verification: {
    google: "your-google-verification-code", // Replace with your Google verification code
    yandex: "your-yandex-verification-code", // Replace with your Yandex verification code
    yahoo: "your-yahoo-verification-code", // Replace with your Yahoo verification code
  },

  // App-specific metadata
  category: "Travel & Geography",
  classification: "City Information Tool",

  // Structured data
  other: {
    "application-name": "City Information Finder",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "City Finder",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#4f46e5",
    "msapplication-tap-highlight": "no",
    "theme-color": "#4f46e5",
  },
};

// Viewport configuration for better mobile experience
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#4f46e5",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Additional Performance Optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "City Information Finder",
              description:
                "Find detailed information about cities in any state and country worldwide",
              url: "https://findaboutstate.vercel.app", // Replace with your actual domain
              applicationCategory: "TravelApplication",
              operatingSystem: "Any",
              permissions: "none",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "City Information Finder Team",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "150",
              },
            }),
          }}
        />

        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://findaboutstate.vercel.app", // Replace with your actual domain
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Skip navigation for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-50 transition-all duration-200"
        >
          Skip to main content
        </a>

        {/* Main content wrapper */}
        <div id="main-content">{children}</div>

        {/* Analytics Scripts (add your tracking codes) */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}

// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }
