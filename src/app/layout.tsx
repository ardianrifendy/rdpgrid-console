import type { Metadata } from "next";
import { ChatProvider } from "@/context/ChatContext";
import SettingsModal from "@/components/SettingsModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "RDPGrid Console",
  description: "LiteLLM Console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ChatProvider>
          {children}
          <SettingsModal />
        </ChatProvider>
      </body>
    </html>
  );
}
