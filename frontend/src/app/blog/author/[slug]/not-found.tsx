import NotFound from "@/components/global/NotFound"; // Import the reusable component

// Define translations
const i18n_title = {
	en: "Author Not Found",
	pt_BR: "Autor(a) Não Encontrado(a)",
	// Add other languages as needed
};

const i18n_message = {
	en: "Sorry, the author you're looking for doesn't exist or may have been removed.",
	pt_BR:
		"Desculpe, o(a) autor(a) que você está procurando não existe ou pode ter sido removido(a).",
	// Add other languages as needed
};

const i18n_linkText = {
	en: "Return to Blog",
	pt_BR: "Voltar para o Blog",
	// Add other languages as needed
};

export default function AuthorNotFound() {
	return (
		<NotFound
			title="Author Not Found"
			i18n_title={i18n_title}
			message="Sorry, the author you're looking for doesn't exist or may have been removed."
			i18n_message={i18n_message}
			linkHref="/blog"
			linkText="Return to Blog"
			i18n_linkText={i18n_linkText}
		/>
	);
}
