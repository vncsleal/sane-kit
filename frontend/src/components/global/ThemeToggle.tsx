"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { dictionary } from "@/i18n/dictionaries.pt-BR";

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className="fixed bottom-4 left-4 z-50 rounded"
			aria-label={dictionary.theme.toggle}
		>
			<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">{dictionary.theme.toggle}</span>
		</Button>
	);
}
