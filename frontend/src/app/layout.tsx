import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/global/ThemeProvider";
import { ThemeToggle } from "@/components/global/ThemeToggle";
// Import the PostHogProvider
import { PostHogProvider } from "@/components/PostHogProvider";
// Import the GoogleAnalytics component
import { GoogleAnalytics } from "@/components/global/GoogleAnalytics";
import { getDictionary } from "@/i18n/getDictionary";
import { i18n } from "@/i18n/i18n-config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
	const dictionary = await getDictionary(i18n.defaultLocale);
	return {
		title: dictionary.app.title,
		description: dictionary.app.description,
	};
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning lang="en">
			<head>
				{/* Google Analytics */}
				<GoogleAnalytics />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
				<PostHogProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
              <ThemeToggle />
            </div>
            <Toaster position="top-center" />
          </ThemeProvider>
				</PostHogProvider>
			</body>
		</html>
	);
}