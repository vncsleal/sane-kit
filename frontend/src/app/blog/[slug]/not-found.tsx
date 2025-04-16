import NotFound from "@/components/global/NotFound"; // Import the reusable component

// Define translations
const i18n_title = {
	en: "Post Not Found",
	pt_BR: "Post Não Encontrado",
	// Add other languages as needed
};

const i18n_message = {
	en: "Sorry, the blog post you're looking for doesn't exist or may have been removed.",
	pt_BR:
		"Desculpe, o post que você está procurando não existe ou pode ter sido removido.",
	// Add other languages as needed
};

const i18n_linkText = {
	en: "Return to Blog",
	pt_BR: "Voltar para o Blog",
	// Add other languages as needed
};

export default function BlogNotFound() {
	return (
		<NotFound
			title="Post Not Found"
			i18n_title={i18n_title}
			message="Sorry, the blog post you're looking for doesn't exist or may have been removed."
			i18n_message={i18n_message}
			linkHref="/blog"
			linkText="Return to Blog"
			i18n_linkText={i18n_linkText}
		/>
	);
}
