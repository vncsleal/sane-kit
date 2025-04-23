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
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	bannerButton?: Omit<HeroButtonType, "variant" | "icon"> & {
		i18n_label?: InternationalizedStringArray;
	};
	badgeText?: string;
	i18n_badgeText?: InternationalizedStringArray;
	buttons?: (HeroButtonType & {
		i18n_label?: InternationalizedStringArray;
	})[];
	media?: HeroMedia;
}

// Header types
export interface SanityHeaderButton {
	_key: string;
	label: string;
	i18n_label?: InternationalizedStringArray;
	url: string;
	variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

export interface SanityHeaderSubItem {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	href: string;
}

export interface SanityNavigationItem {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	href?: string;
	description?: string;
	i18n_description?: InternationalizedStringArray;
	items?: SanityHeaderSubItem[];
}

export interface SanityHeader {
	_id: string;
	_type: "header";
	variant?: "default" | "centered" | "minimal" | "transparent";
	title: string;
	i18n_title?: InternationalizedStringArray;
	navigationItems: SanityNavigationItem[];
	ctaButtons?: SanityHeaderButton[];
	dropdownCTALabel?: string;
	i18n_dropdownCTALabel?: InternationalizedStringArray;
	dropdownCTAUrl?: string;
}

// Footer types
export interface SanityLegalLink {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	url: string;
}

export interface SanityFooter {
	_id: string;
	_type: "footer";
	title: string;
	i18n_title?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
	address?: string[];
	legalLinks?: SanityLegalLink[];
	navigationItems: SanityNavigationItem[];
	variant?: "simple" | "minimal" | "tiny";
}

// Section interfaces
export interface SanityCTAButton {
	_key: string;
	label: string;
	i18n_label?: InternationalizedStringArray;
	url: string;
	variant?: "default" | "secondary" | "outline" | "ghost" | "link";
	icon?: "none" | "arrowRight" | "phone" | "plus";
}

export interface SanityCTASection {
	_key: string;
	_type: "ctaSection";
	variant?: "default" | "highlight" | "minimal" | "full";
	badgeText?: string;
	i18n_badgeText?: InternationalizedStringArray;
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	buttons: SanityCTAButton[];
}

export interface SanityFeature {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
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
	i18n_badgeText?: InternationalizedStringArray;
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	features: SanityFeature[];
	image?: SanityImage;
	comparisonImage?: SanityImage;
}

// Cases section types
export interface SanityCase {
	_key: string;
	name?: string;
	i18n_name?: InternationalizedStringArray;
	logo?: SanityImage;
	url?: string;
}

export interface SanityCasesSection {
	_key: string;
	_type: "casesSection";
	variant: "logoCarousel" | "compactSlider";
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	cases?: SanityCase[];
}

// Testimonials section types
export interface SanityTestimonial {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	content: string;
	i18n_content?: InternationalizedStringArray;
	author: string;
	i18n_author?: InternationalizedStringArray;
	role?: string;
	i18n_role?: InternationalizedStringArray;
	avatar?: SanityImage;
}

export interface SanityTestimonialsSection {
	_key: string;
	_type: "testimonialsSection";
	variant: "carousel" | "grid" | "masonry-grid";
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	testimonials?: SanityTestimonial[];
}

// Pricing section types
export interface SanityPricingFeature {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
}

export interface SanityPricingPlan {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
	highlighted?: boolean;
	price: string;
	i18n_price?: InternationalizedStringArray;
	billingPeriod?: string;
	i18n_billingPeriod?: InternationalizedStringArray;
	features: SanityPricingFeature[];
	buttonText: string;
	i18n_buttonText?: InternationalizedStringArray;
	buttonUrl: string;
	buttonIcon?: "arrowRight" | "phone" | "plus";
	buttonVariant?: "default" | "outline" | "secondary";
}

export interface SanityPricingSection {
	_key: string;
	_type: "pricingSection";
	badgeText?: string;
	i18n_badgeText?: InternationalizedStringArray;
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	plans: SanityPricingPlan[];
}

// Compare Features section types
export interface SanityCompareFeature {
	_id: string;
	_type: "compareFeature";
	title: string;
	i18n_title?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
}

export interface SanityFeatureValue {
	_key?: string;
	featureRef: SanityCompareFeature;
	value: "true" | "false" | "custom";
	customText?: string;
	i18n_customText?: InternationalizedStringArray;
}

export interface SanityComparePlan {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
	price: string;
	i18n_price?: InternationalizedStringArray;
	billingPeriod?: string;
	i18n_billingPeriod?: InternationalizedStringArray;
	highlighted?: boolean;
	featureValues?: SanityFeatureValue[];
	buttonText: string;
	i18n_buttonText?: InternationalizedStringArray;
	buttonUrl: string;
	buttonIcon?: "arrowRight" | "phone" | "plus";
	buttonVariant?: "default" | "secondary" | "outline" | "ghost" | "link";
}

export interface SanityCompareFeaturesSection {
	_key: string;
	_type: "compareFeaturesSection";
	badgeText?: string;
	i18n_badgeText?: InternationalizedStringArray;
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	features: SanityCompareFeature[];
	plans: SanityComparePlan[];
	footnote?: string;
	i18n_footnote?: InternationalizedStringArray;
}

// Stats section types
export interface SanityStat {
	_key: string;
	value: string;
	label: string;
	i18n_label?: InternationalizedStringArray;
	trendDirection?: "up" | "down" | "none";
	trendValue?: string;
	color?: "primary" | "success" | "warning" | "destructive" | "muted";
}

export interface SanityStatsSection {
	_key: string;
	_type: "statsSection";
	variant?: "grid" | "withContent";
	heading?: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	badgeText?: string;
	i18n_badgeText?: InternationalizedStringArray;
	contentHeading?: string;
	i18n_contentHeading?: InternationalizedStringArray;
	contentText?: string;
	i18n_contentText?: InternationalizedStringArray;
	stats: SanityStat[];
}

// FAQ section types
export interface SanityFAQItem {
	_key: string;
	question: string;
	i18n_question?: InternationalizedStringArray;
	answer: string;
	i18n_answer?: InternationalizedStringArray;
}

export interface SanityFAQSection {
	_key: string;
	_type: "faqSection";
	variant?: "sideBySide" | "centered";
	badgeText?: string;
	i18n_badgeText?: InternationalizedStringArray;
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	buttonText?: string;
	i18n_buttonText?: InternationalizedStringArray;
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
	i18n_name?: InternationalizedStringArray;
	slug: {
		current: string;
	};
	avatar?: SanityImage;
	role?: string;
	i18n_role?: InternationalizedStringArray;
	bio?: string;
	i18n_bio?: InternationalizedStringArray;
	fullBio?: PortableTextContent;
	i18n_fullBio?: SanityLocalizedPortableText[];
	socialLinks?: SanityAuthorSocialLink[];
	email?: string;
	featuredImage?: SanityImage;
}

export interface SanityCategory {
	_id: string;
	_type: "category";
	title: string;
	i18n_title?: InternationalizedStringArray;
	slug: {
		current: string;
	};
	description?: string;
	i18n_description?: InternationalizedStringArray;
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
		blank?: boolean;
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

export type PortableTextContent = (
	| PortableTextBlock
	| PortableTextImage
	| SanityCodeBlock
)[];

export interface SanityBlogPost {
	_id: string;
	_type: "blogPost";
	title: string;
	i18n_title?: InternationalizedStringArray;
	slug: {
		current: string;
	};
	publishedAt: string;
	excerpt?: string;
	i18n_excerpt?: InternationalizedStringArray;
	author: SanityAsset & { _id?: string };
	mainImage?: SanityImage;
	categories?: (SanityAsset & { _id?: string })[];
	body?: PortableTextContent;
	i18n_body?: SanityLocalizedPortableText[];
	featured?: boolean;
}

export interface SanityBlogSection {
	_key: string;
	_type: "blogSection";
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	postsToShow?: number;
	showFeaturedPostLarge?: boolean;
	featuredPostsOnly?: boolean;
	variant?: "default" | "grid";
	viewAllButton?: boolean;
	viewAllUrl?: string;
	viewAllButtonText?: string;
	i18n_viewAllButtonText?: InternationalizedStringArray;
}

// Contact section types
export interface SanityContactFeature {
	_key: string;
	title: string;
	i18n_title?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
}

export interface SanityContactSection {
	_key: string;
	_type: "contactSection";
	badgeText: string;
	i18n_badgeText?: InternationalizedStringArray;
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
	features: SanityContactFeature[];
	formTitle?: string;
	i18n_formTitle?: InternationalizedStringArray;
	formFields?: {
		showDate?: boolean;
		showFirstName?: boolean;
		showLastName?: boolean;
		showFileUpload?: boolean;
		fileUploadLabel?: string;
		i18n_fileUploadLabel?: InternationalizedStringArray;
	};
	buttonText: string;
	i18n_buttonText?: InternationalizedStringArray;
	buttonIcon?: "arrowRight" | "phone" | "none";
}

// Newsletter section types
export interface SanityNewsletterSection {
	_key: string;
	_type: "newsletterSection";
	variant?: "default" | "highlight" | "minimal" | "full";
	badgeText?: string;
	i18n_badgeText?: InternationalizedStringArray;
	heading: string;
	i18n_heading?: InternationalizedStringArray;
	subheading?: string;
	i18n_subheading?: InternationalizedStringArray;
	inputPlaceholder?: string;
	i18n_inputPlaceholder?: InternationalizedStringArray;
	buttonText: string;
	i18n_buttonText?: InternationalizedStringArray;
	buttonIcon?: "none" | "arrowRight" | "plus" | "mail";
	successMessage?: string;
	i18n_successMessage?: InternationalizedStringArray;
	privacyText?: string;
	i18n_privacyText?: InternationalizedStringArray;
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
	i18n_title?: InternationalizedStringArray;
	slug: {
		current: string;
	};
	description?: string;
	i18n_description?: InternationalizedStringArray;
	ogImage?: SanityImage;
	pageBuilder: SanitySection[];
}

// Blog Page Configuration Document
export interface SanityBlogPage {
	_id: string;
	_type: "blogPage";
	title: string;
	i18n_title?: InternationalizedStringArray;
	description?: string;
	i18n_description?: InternationalizedStringArray;
	layout?: "grid" | "featured" | "compact";
	postsPerPage?: number;
	featuredPostsCount?: number;
	showOnlyFeaturedPosts?: boolean;
	seo?: {
		metaTitle?: string;
		i18n_metaTitle?: InternationalizedStringArray;
		metaDescription?: string;
		i18n_metaDescription?: InternationalizedStringArray;
	};
}
