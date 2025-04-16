"use client";

import { CalendarIcon, Check, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/language-context";
import type { SanityContactSection } from "@/sanity/types/schema";

export default function ContactSection({
	badgeText = "Contact",
	i18n_badgeText,
	heading = "Something new",
	i18n_heading,
	description,
	i18n_description,
	features = [],
	formTitle = "Book a meeting",
	i18n_formTitle,
	formFields = {
		showDate: true,
		showFirstName: true,
		showLastName: true,
		showFileUpload: true,
		fileUploadLabel: "Upload resume",
	},
	buttonText = "Book the meeting",
	i18n_buttonText,
	buttonIcon = "arrowRight",
}: SanityContactSection) {
	const { getLocalizedValue } = useLanguage();
	const [date, setDate] = useState<Date | undefined>(new Date());

	const localizedBadgeText = getLocalizedValue(i18n_badgeText, badgeText);
	const localizedHeading = getLocalizedValue(i18n_heading, heading);
	const localizedDescription = getLocalizedValue(i18n_description, description);
	const localizedFormTitle = getLocalizedValue(i18n_formTitle, formTitle);
	const localizedFileUploadLabel = getLocalizedValue(
		formFields?.i18n_fileUploadLabel,
		formFields?.fileUploadLabel,
	);
	const localizedButtonText = getLocalizedValue(i18n_buttonText, buttonText);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		alert("Form submitted");
	};

	const ButtonIcon =
		buttonIcon === "arrowRight"
			? MoveRight
			: buttonIcon === "phone"
				? PhoneCall
				: null;

	return (
		<div className="w-full py-20 lg:py-40">
			<div className="container max-w-6xl mx-auto">
				<div className="grid lg:grid-cols-2 gap-10">
					<div className="flex flex-col w-full items-center">
						<div className="flex flex-col w-full gap-6 ">
							<div className="flex flex-col items-start gap-4">
								<div>
									<Badge>{localizedBadgeText}</Badge>
								</div>
								<div className="flex flex-col gap-2">
									<h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular">
										{localizedHeading}
									</h4>
									{localizedDescription && (
										<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-sm text-left">
											{localizedDescription}
										</p>
									)}
								</div>
							</div>

							{features.map((feature) => {
								const localizedFeatureTitle = getLocalizedValue(
									feature.i18n_title,
									feature.title,
								);
								const localizedFeatureDescription = getLocalizedValue(
									feature.i18n_description,
									feature.description,
								);
								return (
									<div
										key={feature._key}
										className="flex flex-row gap-6 items-start text-left"
									>
										<Check className="w-4 h-4 mt-2 text-primary" />
										<div className="flex flex-col gap-1">
											<p>{localizedFeatureTitle}</p>
											{localizedFeatureDescription && (
												<p className="text-muted-foreground text-sm">
													{localizedFeatureDescription}
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="justify-center flex items-center">
						<form
							onSubmit={handleSubmit}
							className="rounded-md max-w-sm w-full flex flex-col border p-8 gap-4"
						>
							<p>{localizedFormTitle}</p>

							{formFields.showDate && (
								<div className="grid w-full max-w-sm items-center gap-1">
									<Label htmlFor="date">Date</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"w-full max-w-sm justify-start text-left font-normal",
													!date && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date ? format(date, "PPP") : <span>Pick a date</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={date}
												onSelect={setDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
							)}

							{formFields.showFirstName && (
								<div className="grid w-full max-w-sm items-center gap-1">
									<Label htmlFor="firstname">First name</Label>
									<Input id="firstname" type="text" required />
								</div>
							)}

							{formFields.showLastName && (
								<div className="grid w-full max-w-sm items-center gap-1">
									<Label htmlFor="lastname">Last name</Label>
									<Input id="lastname" type="text" required />
								</div>
							)}

							{formFields.showFileUpload && (
								<div className="grid w-full max-w-sm items-center gap-1">
									<Label htmlFor="picture">{localizedFileUploadLabel}</Label>
									<Input id="picture" type="file" />
								</div>
							)}

							<Button type="submit" className="gap-4 w-full">
								{localizedButtonText}
								{ButtonIcon && <ButtonIcon className="w-4 h-4" />}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
