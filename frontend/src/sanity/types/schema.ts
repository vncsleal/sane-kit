// Define the internationalized string array type to match Sanity schema
export interface InternationalizedString {
  _key: string;
  value: string;
  language: string; // e.g., 'pt_BR'
}

export type InternationalizedStringArray = InternationalizedString[];

// Common types
export interface SanityAsset {
	_ref: string;
	_type: "reference";
}

export interface SanityImage {
	_type: "image";
	asset: SanityAsset;
	alt?: string;
	i18n_alt?: InternationalizedStringArray;
	caption?: string;
	i18n_caption?: InternationalizedStringArray;
}

export interface SanityButton {
	_key: string;
	_type: "button";
	label: string;
	i18n_label?: Record<string, string>;
	url: string;
	variant?: "default" | "outline" | "secondary" | "link";
}

export interface SanityLocalizedPortableText {
	_key: string;
	_type: "localizedContent" | "localizedBio"; // Adjust based on usage context if needed
	language: string; // e.g., 'pt_BR'
	content: PortableTextContent;
}

export interface SanityLocalizedCode {
	_key: string;
	_type: "localizedCode";
	language: string; // e.g., 'pt_BR'
	content: {
		_type: "code";
		code: string;
		language?: string;
		filename?: string;
	};
}

// Code type interface (for the new code input format)
export interface SanityCodeInput {
	_type: "code";
	code: string;
	language?: string;
	filename?: string;
}

// Code Block type (used within Portable Text)
export interface SanityCodeBlock {
	_type: "codeBlock";
	_key: string;
	title?: string;
	i18n_title?: InternationalizedStringArray;
	code: SanityCodeInput;
	i18n_code?: SanityLocalizedCode[];
	highlightLines?: string;
	showLineNumbers?: boolean;
	caption?: string;
	i18n_caption?: InternationalizedStringArray;
}

// Hero section types
interface HeroMedia {
	type: "image" | "video" | "placeholder";
	image?: SanityImage;
	video?: {
		url: string;
		autoplay?: boolean;
		loop?: boolean;
		muted?: boolean;
	};
	additionalImages?: SanityImage[];
}

export interface HeroButtonType {
	_key?: string;
	label: string;
	i18n_label?: Record<string, string>;
	url: string;
	variant?: "default" | "secondary" | "outline" | "ghost" | "link";
	icon?:
		| "phone"
		| "arrowRight"
		| "plus"
		| "check"
		| "heart"
		| "star"
		| "search"
		| "settings"
		| "mail"
		| "calendar";
}

export interface SanityHeroSection {
	_key: string;
	_type: "heroSection";
	variant: "buttonBanner" | "badgeBanner" | "gridGallery";
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	bannerButton?: Omit<HeroButtonType, "variant" | "icon">;
	badgeText?: string;
	i18n_badgeText?: Record<string, string>;
	buttons?: HeroButtonType[];
	media?: HeroMedia;
}

// Header types
export interface SanityHeaderButton {
	_key: string;
	label: string;
	i18n_label?: Record<string, string>;
	url: string;
	variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

export interface SanityHeaderSubItem {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	href: string;
}

export interface SanityNavigationItem {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	href?: string;
	description?: string;
	i18n_description?: Record<string, string>;
	items?: SanityHeaderSubItem[];
}

export interface SanityHeader {
	_id: string;
	_type: "header";
	variant?: "default" | "centered" | "minimal" | "transparent";
	title: string;
	i18n_title?: Record<string, string>;
	navigationItems: SanityNavigationItem[];
	ctaButtons?: SanityHeaderButton[];
	dropdownCTALabel?: string;
	i18n_dropdownCTALabel?: Record<string, string>;
	dropdownCTAUrl?: string;
}

// Footer types
export interface SanityLegalLink {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	url: string;
}

export interface SanityFooter {
	_id: string;
	_type: "footer";
	title: string;
	i18n_title?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
	address?: string[];
	legalLinks?: SanityLegalLink[];
	navigationItems: SanityNavigationItem[];
	variant?: "simple" | "minimal" | "tiny";
}

// Section interfaces
export interface SanityCTAButton {
	_key: string;
	label: string;
	i18n_label?: Record<string, string>;
	url: string;
	variant?: "default" | "secondary" | "outline" | "ghost" | "link";
	icon?: "none" | "arrowRight" | "phone" | "plus";
}

export interface SanityCTASection {
	_key: string;
	_type: "ctaSection";
	variant?: "default" | "highlight" | "minimal" | "full";
	badgeText?: string;
	i18n_badgeText?: Record<string, string>;
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	buttons: SanityCTAButton[];
}

export interface SanityFeature {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
	image?: SanityImage;
	icon?:
		| "user"
		| "settings"
		| "lock"
		| "star"
		| "heart"
		| "barChart"
		| "dollar"
		| "calendar"
		| "clock"
		| "mail";
	highlighted?: boolean;
}

export interface SanityFeatureSection {
	_key: string;
	_type: "featureSection";
	variant?:
		| "default"
		| "withImage"
		| "leftImage"
		| "rightImage"
		| "imageCards"
		| "masonryGrid"
		| "bigMasonryGrid"
		| "carouselFeature"
		| "slidingComparison";
	badgeText?: string;
	i18n_badgeText?: Record<string, string>;
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	features: SanityFeature[];
	image?: SanityImage;
	comparisonImage?: SanityImage;
}

// Cases section types
export interface SanityCase {
	_key: string;
	name?: string;
	i18n_name?: Record<string, string>;
	logo?: SanityImage;
	url?: string;
}

export interface SanityCasesSection {
	_key: string;
	_type: "casesSection";
	variant: "logoCarousel" | "compactSlider";
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	cases?: SanityCase[];
}

// Testimonials section types
export interface SanityTestimonial {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	content: string;
	i18n_content?: Record<string, string>;
	author: string;
	i18n_author?: Record<string, string>;
	role?: string;
	i18n_role?: Record<string, string>;
	avatar?: SanityImage;
}

export interface SanityTestimonialsSection {
	_key: string;
	_type: "testimonialsSection";
	variant: "carousel" | "grid" | "masonry-grid";
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	testimonials?: SanityTestimonial[];
}

// Pricing section types
export interface SanityPricingFeature {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
}

export interface SanityPricingPlan {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
	highlighted?: boolean;
	price: string;
	i18n_price?: Record<string, string>;
	billingPeriod?: string;
	i18n_billingPeriod?: Record<string, string>;
	features: SanityPricingFeature[];
	buttonText: string;
	i18n_buttonText?: Record<string, string>;
	buttonUrl: string;
	buttonIcon?: "arrowRight" | "phone" | "plus";
	buttonVariant?: "default" | "outline" | "secondary";
}

export interface SanityPricingSection {
	_key: string;
	_type: "pricingSection";
	badgeText?: string;
	i18n_badgeText?: Record<string, string>;
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	plans: SanityPricingPlan[];
}

// Compare Features section types
export interface SanityCompareFeatureOption {
	_key: string;
	name: string;
	i18n_name?: Record<string, string>;
	status: "included" | "not-included" | "partial" | "custom";
	customValue?: string;
	i18n_customValue?: Record<string, string>;
}

export interface SanityCompareFeature {
	_id: string; // Assuming it's fetched as a document or referenced with _id
	_type: "compareFeature";
	title: string;
	i18n_title?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
	options: SanityCompareFeatureOption[];
}

export interface SanityFeatureValue {
	_key?: string;
	featureRef: SanityAsset & {
		// Assuming featureRef is a reference, add _ref
		_id?: string; // Include _id if the reference is expanded in the query
	};
	value: "true" | "false" | "custom";
	customText?: string;
	// No i18n_customText in schema
}

export interface SanityComparePlan {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
	price: string;
	i18n_price?: Record<string, string>;
	billingPeriod?: string;
	i18n_billingPeriod?: Record<string, string>; // Added based on pricing plan
	highlighted?: boolean;
	featureValues?: SanityFeatureValue[];
	buttonText: string;
	i18n_buttonText?: Record<string, string>;
	buttonUrl: string;
	buttonIcon?: "arrowRight" | "phone" | "plus";
}

export interface SanityCompareFeaturesSection {
	_key: string;
	_type: "compareFeaturesSection";
	badgeText?: string;
	i18n_badgeText?: Record<string, string>; // Added based on pricing section
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	features: SanityCompareFeature[]; // Changed from (SanityAsset & { _id?: string })[]
	plans: SanityComparePlan[];
	footnote?: string;
	i18n_footnote?: Record<string, string>;
	theme?: "light" | "dark";
}

// Stats section types
export interface SanityStat {
	_key: string;
	value: string;
	label: string;
	i18n_label?: Record<string, string>;
	trendDirection?: "up" | "down" | "none";
	trendValue?: string;
	color?: "primary" | "success" | "warning" | "destructive" | "muted";
}

export interface SanityStatsSection {
	_key: string;
	_type: "statsSection";
	variant?: "grid" | "withContent";
	heading?: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	badgeText?: string;
	i18n_badgeText?: Record<string, string>;
	contentHeading?: string;
	i18n_contentHeading?: Record<string, string>;
	contentText?: string;
	i18n_contentText?: Record<string, string>;
	stats: SanityStat[];
}

// FAQ section types
export interface SanityFAQItem {
	_key: string;
	question: string;
	i18n_question?: Record<string, string>;
	answer: string; // Assuming answer is simple text based on schema
	i18n_answer?: Record<string, string>;
}

export interface SanityFAQSection {
	_key: string;
	_type: "faqSection";
	variant?: "sideBySide" | "centered";
	badgeText?: string;
	i18n_badgeText?: Record<string, string>;
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	buttonText?: string;
	i18n_buttonText?: Record<string, string>;
	buttonUrl?: string;
	buttonIcon?: "none" | "phone" | "arrowRight" | "plus" | "check";
	faqItems: SanityFAQItem[];
}

// Blog types
export interface SanityAuthorSocialLink {
	_key: string;
	platform:
		| "twitter"
		| "linkedin"
		| "github"
		| "instagram"
		| "website"
		| "youtube";
	url: string;
	username?: string;
}

export interface SanityAuthor {
	_id: string;
	_type: "author";
	name: string;
	i18n_name?: Record<string, string>;
	slug: {
		current: string;
	};
	avatar?: SanityImage;
	role?: string;
	i18n_role?: Record<string, string>;
	bio?: string;
	i18n_bio?: Record<string, string>;
	fullBio?: PortableTextContent; // Simple block content
	i18n_fullBio?: SanityLocalizedPortableText[];
	socialLinks?: SanityAuthorSocialLink[];
	email?: string;
	featuredImage?: SanityImage;
}

export interface SanityCategory {
	_id: string;
	_type: "category";
	title: string;
	i18n_title?: Record<string, string>;
	slug: {
		current: string;
	};
	description?: string;
	i18n_description?: Record<string, string>;
}

export interface PortableTextBlock {
	_type: "block";
	_key: string;
	children: {
		_key: string;
		_type: string;
		text?: string;
		marks?: string[];
	}[];
	markDefs?: {
		_key: string;
		_type: string;
		href?: string;
		blank?: boolean; // Added for links
	}[];
	style?: string;
	listItem?: string;
	level?: number;
}

export interface PortableTextImage {
	_type: "image";
	_key: string;
	asset: SanityAsset;
	alt?: string;
	i18n_alt?: InternationalizedStringArray;
	caption?: string;
	i18n_caption?: InternationalizedStringArray;
}

// Update PortableTextContent to include SanityCodeBlock
export type PortableTextContent = (
	| PortableTextBlock
	| PortableTextImage
	| SanityCodeBlock
)[];

export interface SanityBlogPost {
	_id: string;
	_type: "blogPost";
	title: string;
	i18n_title?: Record<string, string>;
	slug: {
		current: string;
	};
	publishedAt: string;
	excerpt?: string;
	i18n_excerpt?: Record<string, string>;
	author: SanityAsset & { _id?: string }; // Reference
	mainImage?: SanityImage;
	categories?: (SanityAsset & { _id?: string })[]; // Array of references
	body?: PortableTextContent;
	i18n_body?: SanityLocalizedPortableText[];
	featured?: boolean;
}

export interface SanityBlogSection {
	_key: string;
	_type: "blogSection";
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	postsToShow?: number;
	showFeaturedPostLarge?: boolean;
	featuredPostsOnly?: boolean;
	variant?: "default" | "grid";
	viewAllButton?: boolean;
	viewAllUrl?: string;
	viewAllButtonText?: string;
	i18n_viewAllButtonText?: Record<string, string>;
}

// Contact section types
export interface SanityContactFeature {
	_key: string;
	title: string;
	i18n_title?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
}

export interface SanityContactSection {
	_key: string;
	_type: "contactSection";
	badgeText: string;
	i18n_badgeText?: Record<string, string>;
	heading: string;
	i18n_heading?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
	features: SanityContactFeature[];
	formTitle?: string;
	i18n_formTitle?: Record<string, string>;
	formFields?: {
		showDate?: boolean;
		showFirstName?: boolean;
		showLastName?: boolean;
		showFileUpload?: boolean;
		fileUploadLabel?: string;
		i18n_fileUploadLabel?: Record<string, string>;
	};
	buttonText: string;
	i18n_buttonText?: Record<string, string>;
	buttonIcon?: "arrowRight" | "phone" | "none";
}

// Newsletter section types
export interface SanityNewsletterSection {
	_key: string;
	_type: "newsletterSection";
	variant?: "default" | "highlight" | "minimal" | "full";
	badgeText?: string;
	i18n_badgeText?: Record<string, string>;
	heading: string;
	i18n_heading?: Record<string, string>;
	subheading?: string;
	i18n_subheading?: Record<string, string>;
	inputPlaceholder?: string;
	i18n_inputPlaceholder?: Record<string, string>;
	buttonText: string;
	i18n_buttonText?: Record<string, string>;
	buttonIcon?: "none" | "arrowRight" | "plus" | "mail";
	successMessage?: string;
	i18n_successMessage?: Record<string, string>;
	privacyText?: string;
	i18n_privacyText?: Record<string, string>;
}

// Union type for all section types
export type SanitySection =
	| SanityHeroSection
	| SanityCTASection
	| SanityFeatureSection
	| SanityCasesSection
	| SanityTestimonialsSection
	| SanityPricingSection
	| SanityCompareFeaturesSection
	| SanityStatsSection
	| SanityFAQSection
	| SanityBlogSection
	| SanityContactSection
	| SanityNewsletterSection;

// Page schema
export interface SanityPage {
	_id: string;
	_type: "page";
	title: string;
	i18n_title?: Record<string, string>;
	slug: {
		current: string;
	};
	description?: string; // SEO Meta Description
	i18n_description?: Record<string, string>; // Translated SEO Meta Description
	ogImage?: SanityImage; // SEO Social Image
	pageBuilder: SanitySection[];
}

// Blog Page Configuration Document
export interface SanityBlogPage {
	_id: string;
	_type: "blogPage";
	title: string;
	i18n_title?: Record<string, string>;
	description?: string;
	i18n_description?: Record<string, string>;
	layout?: "grid" | "featured" | "compact";
	postsPerPage?: number;
	featuredPostsCount?: number;
	showOnlyFeaturedPosts?: boolean;
	seo?: {
		metaTitle?: string;
		i18n_metaTitle?: Record<string, string>;
		metaDescription?: string;
		i18n_metaDescription?: Record<string, string>;
	};
}
