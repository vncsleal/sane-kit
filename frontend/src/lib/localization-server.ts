/**
 * Synchronous server-side helper to get localized value.
 * Requires the language key to be determined and passed by the caller.
 *
 * @param i18nRecord The record containing language keys and translated strings.
 * @param baseValue The default value if no translation is found or i18nRecord is missing.
 * @param langKey The language key (e.g., 'en', 'pt_BR') determined by the caller.
 * @returns The localized string or the base value.
 */
// Make the function synchronous again
export function getLocalizedValueServer<T extends string | undefined>(
	i18nRecord: Record<string, string> | undefined | null,
	baseValue: T,
	langKey: string, // Add langKey parameter
): T {
	if (!i18nRecord) {
		return baseValue;
	}

	// --- Value Retrieval ---
	const localizedValue = i18nRecord[langKey];

	return (localizedValue as T) ?? baseValue;
}

// You might add other server-specific localization helpers here
