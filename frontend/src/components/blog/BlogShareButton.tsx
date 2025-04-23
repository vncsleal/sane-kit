"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Share2,
	Twitter,
	Linkedin,
	Facebook,
	Mail,
	Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";

// Define translations for static text
const staticText = {
	share: {
		en: "Share",
		pt_BR: "Compartilhar",
	},
	copyLink: {
		en: "Copy link",
		pt_BR: "Copiar link",
	},
	email: {
		en: "Email",
		pt_BR: "E-mail",
	},
	linkCopied: {
		en: "Link copied to clipboard",
		pt_BR: "Link copiado para a área de transferência",
	},
};

interface BlogShareButtonProps {
	title: string;
	className?: string;
}

export function BlogShareButton({ title, className }: BlogShareButtonProps) {
	const { language } = useLanguage();

	// Get localized text
	const localizedShare = staticText.share[language] || staticText.share.en;
	const localizedCopyLink =
		staticText.copyLink[language] || staticText.copyLink.en;
	const localizedEmail = staticText.email[language] || staticText.email.en;
	const localizedLinkCopied =
		staticText.linkCopied[language] || staticText.linkCopied.en;

	const handleShare = async (platform: string) => {
		const postUrl = window.location.href;
		const postTitle = title;

		switch (platform) {
			case "copy":
				await navigator.clipboard.writeText(postUrl);
				toast.success(localizedLinkCopied);
				break;
			case "twitter":
				window.open(
					`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`,
					"_blank",
				);
				break;
			case "linkedin":
				window.open(
					`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}`,
					"_blank",
				);
				break;
			case "facebook":
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
					"_blank",
				);
				break;
			case "email":
				window.open(
					`mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(postUrl)}`,
					"_blank",
				);
				break;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" variant="outline" className={className}>
					<Share2 className="h-4 w-4 mr-2" />
					{localizedShare}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => handleShare("copy")}>
					<LinkIcon className="h-4 w-4 mr-2" />
					{localizedCopyLink}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleShare("twitter")}>
					<Twitter className="h-4 w-4 mr-2" />
					Twitter
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleShare("linkedin")}>
					<Linkedin className="h-4 w-4 mr-2" />
					LinkedIn
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleShare("facebook")}>
					<Facebook className="h-4 w-4 mr-2" />
					Facebook
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleShare("email")}>
					<Mail className="h-4 w-4 mr-2" />
					{localizedEmail}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
