"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

// Define the supported languages
export type Language = "en" | "pt_BR";

// Internationalized array type from the Sanity plugin
export interface I18nText {
	_type:
		| "localizedString"
		| "localizedText"
		| "internationalizedArrayString"
		| "internationalizedArrayText";
	_key?: string;
	value?: Array<{
		_key: string;
		_type: "locale";
		language: string;
		value: string;
	}>;
}

// Context interface
interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	getLocalizedValue: <T>(
		field?: Record<string, T> | I18nText | null | undefined,
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
		field?:
			| Record<string, T>
			| I18nText
			| Array<{ _key: string; value: T; _type: string }>
			| null
			| undefined,
		fallback?: T,
	): T | undefined => {
		if (!field) return fallback;

		// If field is provided as an array (e.g. internationalizedArrayString)
		if (Array.isArray(field)) {
			// Try to find a translation for the current language
			const translation = field.find((item) => item._key === language);
			if (translation?.value) return translation.value as T;
			// Fallback to English translation
			const enTranslation = field.find((item) => item._key === "en");
			if (enTranslation?.value) return enTranslation.value as T;
			// Fallback to the first item
			return field[0]?.value || fallback;
		}

		// Check for the Sanity plugin's internationalized object structure
		if (
			typeof field === "object" &&
			"_type" in field &&
			(field._type === "internationalizedArrayString" ||
				field._type === "internationalizedArrayText" ||
				field._type === "localizedString" ||
				field._type === "localizedText") &&
			"value" in field &&
			Array.isArray(field.value)
		) {
			const currentLang = field.value.find(
				(item) => item.language === language,
			);
			if (currentLang?.value) return currentLang.value as T;
			const enLang = field.value.find((item) => item.language === "en");
			if (enLang?.value) return enLang.value as T;
			return field.value[0]?.value as T;
		}

		// Fallback for legacy record object
		if (typeof field === "object" && !("_type" in field)) {
			const recordField = field as Record<string, T>;
			if (language in recordField)
				return recordField[language] || recordField.en || fallback;
			return recordField.en || fallback;
		}

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
