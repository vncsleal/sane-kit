"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { useLanguage, type Language } from "@/lib/language-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LanguageOption {
	id: Language;
	code: string;
	flag: string;
}

interface LanguageSwitcherProps {
	variant?: "default" | "minimal" | "footer";
}

const languageOptions: LanguageOption[] = [
	{ id: "en", code: "EN", flag: "🇺🇸" },
	{ id: "pt_BR", code: "PT", flag: "🇧🇷" },
];

export default function LanguageSwitcher({
	variant = "default",
}: LanguageSwitcherProps) {
	const { language, setLanguage, isLoading } = useLanguage();
	const router = useRouter();
	const [isSwitching, setIsSwitching] = useState(false);

	const currentLanguage =
		languageOptions.find((option) => option.id === language) ||
		languageOptions[0];

	const handleLanguageChange = (newLanguage: Language) => {
		if (language === newLanguage) return;
		setIsSwitching(true);
		setLanguage(newLanguage);
		router.refresh();
		setIsSwitching(false);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-8 w-[70px]">
				<Loader2 className="h-4 w-4 animate-spin" />
			</div>
		);
	}

	// Use dropdown menu for all variants
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="sm"
					variant={variant === "footer" ? "secondary" : "ghost"}
					className={cn(
						"h-8 px-3 text-xs min-w-[70px]",
						variant === "footer" &&
							"bg-primary/10 hover:bg-primary/20 text-background ",
						variant === "minimal" && "px-2 h-8 ",
					)}
					disabled={isSwitching}
				>
					{isSwitching ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
					) : (
						<span className="mr-1">{currentLanguage.flag}</span>
					)}
					<span>{currentLanguage.code}</span>
					<ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className={cn("min-w-[100px]", variant === "minimal" && "w-[70px]")}
			>
				{languageOptions.map((option) => (
					<DropdownMenuItem
						key={option.id}
						onClick={() => handleLanguageChange(option.id)}
						className={cn(
							"cursor-pointer justify-between",
							language === option.id && "font-medium bg-accent",
						)}
						disabled={isSwitching || language === option.id}
					>
						<span className="mr-2">{option.flag}</span>
						<span>{option.code}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
