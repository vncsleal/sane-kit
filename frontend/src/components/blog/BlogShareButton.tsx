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
import type { Dictionary } from "@/i18n/getDictionary";

interface BlogShareButtonProps {
	title: string;
	className?: string;
	dictionary?: Partial<Dictionary['general'] & Dictionary['share']>;
}

export function BlogShareButton({ title, className, dictionary = {} }: BlogShareButtonProps) {
	const handleShare = async (platform: string) => {
		const postUrl = window.location.href;
		const postTitle = title;

		switch (platform) {
			case "copy":
				await navigator.clipboard.writeText(postUrl);
				toast.success(dictionary.linkCopied || "Link copied to clipboard");
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
					{dictionary.share || "Share"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => handleShare("copy")}>
					<LinkIcon className="h-4 w-4 mr-2" />
					{dictionary.copyLink || "Copy link"}
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
					{dictionary.email || "Email"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
