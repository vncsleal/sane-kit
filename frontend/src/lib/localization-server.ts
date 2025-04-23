import type { InternationalizedStringArray } from "@/sanity/types/schema"; // Import the type

/**
 * Synchronous server-side helper to get localized value.
 * Requires the language key to be determined and passed by the caller.
 *
 * @param i18nField The record or array containing language keys and translated strings.
 * @param baseValue The default value if no translation is found or i18nField is missing.
 * @param langKey The language key (e.g., 'en', 'pt_BR') determined by the caller.
 * @returns The localized string or the base value.
 */
export function getLocalizedValueServer<T extends string | undefined>(
	// Update type to accept Record or InternationalizedStringArray
	i18nField:
		| Record<string, string>
		| InternationalizedStringArray
		| undefined
		| null,
	baseValue: T,
	langKey: string,
): T {
	if (!i18nField) {
		return baseValue;
	}

	// Handle InternationalizedStringArray
	if (Array.isArray(i18nField)) {
		// Check if it matches the InternationalizedStringArray structure
		if (
			i18nField.length > 0 &&
			typeof i18nField[0] === "object" &&
			"language" in i18nField[0] &&
			"value" in i18nField[0]
		) {
			const typedField = i18nField as InternationalizedStringArray;
			const translation = typedField.find((item) => item.language === langKey);
			if (translation?.value) return translation.value as T;
			// Fallback to English if specified langKey not found
			const enTranslation = typedField.find((item) => item.language === "en");
			if (enTranslation?.value) return enTranslation.value as T;
			// Fallback to the first item if no 'en' found
			return (typedField[0]?.value as T) || baseValue;
		}
	}

	// Handle Record<string, string>
	if (typeof i18nField === "object" && !Array.isArray(i18nField)) {
		const recordField = i18nField as Record<string, string>;
		const localizedValue = recordField[langKey];
		// Fallback to English if specified langKey not found
		return (localizedValue as T) ?? (recordField.en as T) ?? baseValue;
	}

	// Fallback if type is unexpected
	return baseValue;
}

// You might add other server-specific localization helpers here
