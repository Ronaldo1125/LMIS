import { Inter } from 'next/font/google';
import "./globals.css";

const interDisplay = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "DEPDev RO5 Library",
  description: "Library Management Information System Web-client - DEPDev Regional Office 5",
  icons: {
    icon: "/assets/other/LOGO.svg",
    shortcut: "/assets/other/LOGO.svg",
    apple: "/assets/other/LOGO.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={interDisplay.className + " antialiased"}>
        {children}
      </body>
    </html>
  );
}