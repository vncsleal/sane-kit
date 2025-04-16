import NotFound from "@/components/global/NotFound";

// Define translations directly or fetch from a global settings document if preferred
const i18n_title = {
	en: "Page Not Found",
	pt_BR: "Página Não Encontrada",
	// Add other languages as needed
};

const i18n_message = {
	en: "Sorry, the page you're looking for doesn't exist or may have been moved.",
	pt_BR:
		"Desculpe, a página que você está procurando não existe ou pode ter sido movida.",
	// Add other languages as needed
};

const i18n_linkText = {
	en: "Return Home",
	pt_BR: "Voltar para página inicial",
	// Add other languages as needed
};

export default function PageNotFound() {
	// Pass default English strings and the i18n objects
	return (
		<NotFound
			title="Page Not Found"
			i18n_title={i18n_title}
			message="Sorry, the page you're looking for doesn't exist or may have been moved."
			i18n_message={i18n_message}
			linkHref="/"
			linkText="Return Home"
			i18n_linkText={i18n_linkText}
		/>
	);
}
