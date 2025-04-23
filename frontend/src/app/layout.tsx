import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { client } from "@/sanity/client";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/global/ThemeProvider";
import { ThemeToggle } from "@/components/global/ThemeToggle";
import { LanguageProvider, type Language } from "@/lib/language-context";
import type { SanityFooter, SanityHeader } from "@/sanity/types/schema";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Sane Kit",
	description: "A Sanity + Next.js starter kit",
};

async function getGlobals(): Promise<{
	header: SanityHeader | null;
	footer: SanityFooter | null;
}> {
	const [header, footer] = await Promise.all([
		client.fetch<SanityHeader | null>(`*[_type == "header"][0]`),
		client.fetch<SanityFooter | null>(`*[_type == "footer"][0]`),
	]);
	return { header, footer };
}

function getDefaultLanguage(): Language {
	return "en";
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { header, footer } = await getGlobals();
	const initialLang = getDefaultLanguage();
	const htmlLang = initialLang === "pt_BR" ? "pt-BR" : "en";

	return (
		<html lang={htmlLang} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<LanguageProvider defaultLanguage={initialLang}>
						{header && <Header {...header} />}
						<div className="mt-20 px-4 md:px-2">{children}</div>
						{footer && <Footer {...footer} />}
						<div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
							<ThemeToggle />
						</div>
						<Toaster position="top-center" />
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
