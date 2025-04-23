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
		// Updated type signature to include InternationalizedStringArray
		field?:
			| Record<string, T>
			| InternationalizedStringArray // Added InternationalizedStringArray
			| null
			| undefined,
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
				if (browserLang.startsWith("pt")) {
					setLanguageState("pt_BR");
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
		setLanguageState(newLanguage);

		if (isClient) {
			try {
				localStorage.setItem("preferredLanguage", newLanguage);
				// Update HTML lang attribute for accessibility and SEO
				document.documentElement.lang =
					newLanguage === "pt_BR" ? "pt-BR" : "en";
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

		// Handle InternationalizedStringArray (which is Array<{ _key, value, language }>)
		if (
			Array.isArray(field) &&
			field.length > 0 &&
			typeof field[0] === "object" &&
			"language" in field[0] && // Check for the structure of InternationalizedString
			"value" in field[0]
		) {
			const typedField = field as InternationalizedStringArray; // Cast to the correct type
			// Try to find a translation for the current language
			const translation = typedField.find((item) => item.language === language);
			if (translation?.value) return translation.value as T;
			// Fallback to English translation
			const enTranslation = typedField.find((item) => item.language === "en");
			if (enTranslation?.value) return enTranslation.value as T;
			// Fallback to the first item if no 'en' found
			return (typedField[0]?.value as T) || fallback;
		}

		// Check for the Sanity plugin's internationalized object structure (I18nText)
		if (
			typeof field === "object" &&
			!Array.isArray(field) && // Ensure it's not the array type handled above
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
			// Fallback to the first item in the 'value' array if no specific language match
			return (field.value[0]?.value as T) || fallback;
		}

		// Fallback for legacy record object
		if (
			typeof field === "object" &&
			!Array.isArray(field) &&
			!("_type" in field)
		) {
			const recordField = field as Record<string, T>;
			if (language in recordField)
				return recordField[language] || recordField.en || fallback;
			return recordField.en || fallback;
		}

		// If it's an array but doesn't match InternationalizedStringArray structure (less likely)
		if (Array.isArray(field)) {
			// Attempt the previous array logic as a last resort for arrays
			const genericArray = field as Array<{
				_key?: string;
				value: T;
				language?: string;
			}>;
			let translation = genericArray.find((item) => item.language === language);
			if (!translation) {
				translation = genericArray.find((item) => item._key === language);
			}
			if (translation?.value) return translation.value as T;

			let enTranslation = genericArray.find((item) => item.language === "en");
			if (!enTranslation) {
				enTranslation = genericArray.find((item) => item._key === "en");
			}
			if (enTranslation?.value) return enTranslation.value as T;

			return (genericArray[0]?.value as T) || fallback;
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
