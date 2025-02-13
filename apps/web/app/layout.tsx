import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "../context/Providers";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "File Sharer",
  description: "File sharing made easy ...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}):JSX.Element {

  
  return (
    <html lang="en" className="scroll-smooth">
   
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      
      <Providers>{children}</Providers>

      </body>
     
      
    
    
    </html>
  );
}
