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
import type { ContactSection } from "@/sanity/types";

type DefaultContactProps = Pick<ContactSection, 
	'badgeText' | 'heading' | 'description' | 'features' | 
	'formTitle' | 'formFields' | 'buttonText' | 'buttonIcon'
>;

export default function DefaultContact({
	badgeText = "Contato",
	heading = "Algo novo",
	description,
	features = [],
	formTitle = "Agendar uma reunião",
	formFields = {
		showDate: "true",
		showFirstName: "true",
		showLastName: "true",
		showFileUpload: "true",
		fileUploadLabel: "Enviar currículo",
	},
	buttonText = "Agendar a reunião",
	buttonIcon = "arrowRight",
}: DefaultContactProps) {
	const [date, setDate] = useState<Date | undefined>(new Date());

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
									<Badge>{badgeText}</Badge>
								</div>
								<div className="flex flex-col gap-2">
									<h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular">
											{heading}
									</h4>
									{description && (
										<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-sm text-left">
											{description}
										</p>
									)}
								</div>
							</div>

							{features?.map((feature) => (
								<div
									key={feature._key}
									className="flex flex-row gap-6 items-start text-left"
								>
									<Check className="w-4 h-4 mt-2 text-primary" />
									<div className="flex flex-col gap-1">
										<p>{feature.title}</p>
										{feature.description && (
											<p className="text-muted-foreground text-sm">
												{feature.description}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="justify-center flex items-center">
						<form
							onSubmit={handleSubmit}
							className="rounded-md max-w-sm w-full flex flex-col border p-8 gap-4"
						>
							<p>{formTitle}</p>

							{formFields?.showDate === "true" && (
								<div className="grid w-full max-w-sm items-center gap-1">
									<Label htmlFor="date">Data</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"w-full justify-start text-left font-normal",
													!date && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date ? format(date, "PPP") : <span>Escolha uma data</span>}
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

							{formFields?.showFirstName === "true" && (
								<div className="grid w-full max-w-sm items-center gap-1">
									<Label htmlFor="firstName">Nome</Label>
									<Input type="text" id="firstName" placeholder="Seu nome" />
								</div>
							)}

							{formFields?.showLastName === "true" && (
								<div className="grid w-full max-w-sm items-center gap-1">
									<Label htmlFor="lastName">Sobrenome</Label>
									<Input type="text" id="lastName" placeholder="Seu sobrenome" />
								</div>
							)}

							<div className="grid w-full max-w-sm items-center gap-1">
								<Label htmlFor="email">Email</Label>
								<Input type="email" id="email" placeholder="Seu email" />
							</div>

							{formFields?.showFileUpload === "true" && (
								<div className="grid w-full max-w-sm items-center gap-1">
									<Label htmlFor="files">{formFields.fileUploadLabel}</Label>
									<Input type="file" id="files" />
								</div>
							)}

							<div className="pt-4">
								<Button type="submit" className="w-full">
									{buttonText}
									{ButtonIcon && <ButtonIcon size={16} className="ml-2" />}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
