"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import type { InternationalizedStringArray } from "@/sanity/types/schema"; // Import the correct type

// Define the supported languages
export type Language = "en" | "pt_BR";

// Context interface
interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	getLocalizedValue: <T>(
		field?: Record<string, T> | InternationalizedStringArray | null | undefined,
		fallback?: T,
	) => T | undefined;
	isLoading: boolean;
}

// Create a context with default values
const LanguageContext = createContext<LanguageContextType>({
	language: "en",
	setLanguage: () => {},
	getLocalizedValue: () => undefined,
	isLoading: true,
});

interface LanguageProviderProps {
	children: ReactNode;
	defaultLanguage?: Language;
}

export function LanguageProvider({
	children,
	defaultLanguage = "en",
}: LanguageProviderProps) {
	const [language, setLanguageState] = useState<Language>(defaultLanguage);
	const [isClient, setIsClient] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Mark when client-side code is running
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Load language preference from localStorage
	useEffect(() => {
		if (!isClient) return;

		try {
			// Check for a stored language preference
			const storedLanguage = localStorage.getItem(
				"preferredLanguage",
			) as Language | null;

			// Use stored language if valid
			if (
				storedLanguage &&
				(storedLanguage === "en" || storedLanguage === "pt_BR")
			) {
				setLanguageState(storedLanguage);
			}
			// Detect from browser settings as fallback
			else {
				const browserLang = navigator.language.toLowerCase();
				console.log("Browser language:", browserLang);
				if (browserLang.startsWith("pt")) {
					setLanguageState("pt_BR");
					console.log(
						"Detected Portuguese from browser; setting language to pt_BR",
					);
				}
			}
		} catch (error) {
			console.error("Error loading language preference:", error);
		} finally {
			// Mark loading as complete regardless of outcome
			setIsLoading(false);
		}
	}, [isClient]);

	// Function to update language state and storage
	const setLanguage = (newLanguage: Language) => {
		console.log(
			"setLanguage called. Old language:",
			language,
			"New language:",
			newLanguage,
		);

		setLanguageState(newLanguage);

		if (isClient) {
			try {
				localStorage.setItem("preferredLanguage", newLanguage);
				// Update HTML lang attribute for accessibility and SEO
				document.documentElement.lang =
					newLanguage === "pt_BR" ? "pt-BR" : "en";

				console.log(
					"Language preference saved to localStorage and HTML <html> lang updated.",
				);
			} catch (error) {
				console.error("Error saving language preference:", error);
			}
		}
	};

	// Helper function to get a localized value from a field
	const getLocalizedValue = <T,>(
		field?: Record<string, T> | InternationalizedStringArray | null | undefined,
		fallback?: T,
	): T | undefined => {
		if (!field) return fallback;

		// Handle InternationalizedStringArray
		if (Array.isArray(field)) {
			// Check if it matches the InternationalizedStringArray structure
			if (
				field.length > 0 &&
				typeof field[0] === "object" &&
				"language" in field[0] &&
				"value" in field[0]
			) {
				const typedField = field as InternationalizedStringArray;
				// Try to find a translation for the current language
				const translation = typedField.find(
					(item) => item.language === language,
				);
				if (translation?.value) return translation.value as T;
				// Fallback to English translation
				const enTranslation = typedField.find((item) => item.language === "en");
				if (enTranslation?.value) return enTranslation.value as T;
				// Fallback to the first item if no 'en' found
				return (typedField[0]?.value as T) || fallback;
			}
		}

		// Handle Record<string, T> (legacy or simple i18n fields)
		if (typeof field === "object" && !Array.isArray(field)) {
			const recordField = field as Record<string, T>;
			if (language in recordField)
				return recordField[language] || recordField.en || fallback;
			return recordField.en || fallback;
		}

		// If field is neither Array nor Record (shouldn't happen with correct types, but acts as a safeguard)
		return fallback;
	};

	return (
		<LanguageContext.Provider
			value={{ language, setLanguage, getLocalizedValue, isLoading }}
		>
			{children}
		</LanguageContext.Provider>
	);
}

// Custom hook to use the language context
export function useLanguage() {
	const context = useContext(LanguageContext);

	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}

	return context;
}
