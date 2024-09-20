import type { Metadata } from "next";
import "./globals.css";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { CursorProvider } from "@/components/Cursor";
import { tungstenBold, tungstenSemiBold } from "./fonts";
import { GlobalStyles } from "./page.styles";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tungstenBold.className} ${tungstenSemiBold.className}`}>
        <ThemeWrapper>
          <CursorProvider>{children}</CursorProvider>
          <GlobalStyles />
        </ThemeWrapper>
      </body>
    </html>
  );
}
