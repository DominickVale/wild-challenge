import type { Metadata } from "next";
import { GlobalStyles } from "@/components/GlobalStyles";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { CursorProvider } from "@/components/Cursor";
import { tungstenBold, tungstenSemiBold } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "XYZ PHOTOGRAPHY | Domenico Vale",
  description: "A wild.as challenge for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width" />
      <body className={`${tungstenBold.className} ${tungstenSemiBold.className}`}>
        <ThemeWrapper>
          <CursorProvider>{children}</CursorProvider>
          <GlobalStyles />
        </ThemeWrapper>
      </body>
    </html>
  );
}
