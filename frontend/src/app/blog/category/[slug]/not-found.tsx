import NotFound from "@/components/global/NotFound"; // Import the reusable component

// Define translations
const i18n_title = {
	en: "Category Not Found",
	pt_BR: "Categoria Não Encontrada",
	// Add other languages as needed
};

const i18n_message = {
	en: "Sorry, the category you're looking for doesn't exist or may have been removed.",
	pt_BR:
		"Desculpe, a categoria que você está procurando não existe ou pode ter sido removida.",
	// Add other languages as needed
};

const i18n_linkText = {
	en: "Return to Blog",
	pt_BR: "Voltar para o Blog",
	// Add other languages as needed
};

export default function CategoryNotFound() {
	return (
		<NotFound
			title="Category Not Found"
			i18n_title={i18n_title}
			message="Sorry, the category you're looking for doesn't exist or may have been removed."
			i18n_message={i18n_message}
			linkHref="/blog"
			linkText="Return to Blog"
			i18n_linkText={i18n_linkText}
		/>
	);
}
