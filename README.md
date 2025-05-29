# Sane-Kit: Next.js & Sanity Starter Template

[![Next.js](https://img.shields.io/badge/Next.js-20232A?style=for-the-badge&logo=Next.js)](https://nextjs.org/) [![Sanity](https://img.shields.io/badge/Sanity-20232A?style=for-the-badge&logo=sanity&logoColor=F97316)](https://www.sanity.io/) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![Typescript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-20232A?style=for-the-badge&logo=tailwindcss&logoColor=319795)](https://tailwindcss.com/) [![Shadcn](https://img.shields.io/badge/shadcn/ui-20232A?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBjbGFzcz0iaC02IHctNiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9Im5vbmUiPjwvcmVjdD48bGluZSB4MT0iMjA4IiB5MT0iMTI4IiB4Mj0iMTI4IiB5Mj0iMjA4IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiPjwvbGluZT48bGluZSB4MT0iMTkyIiB5MT0iNDAiIHgyPSI0MCIgeTI9IjE5MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMyIj48L2xpbmU+PC9zdmc+&logoColor=ffffff)](https://ui.shadcn.com/)

<!-- Optional: Add a link to your deployed demo -->
<!-- [Demo](YOUR_DEMO_URL) -->

<!-- Optional: Add a screenshot -->
<!-- ![Screenshot of Sane-Kit](YOUR_SCREENSHOT_URL) -->

A feature-rich starter template combining Next.js 15 (with Turbopack) for the frontend and Sanity v3 for the backend CMS. Designed for rapid development with pre-built components and internationalization support.

This template utilizes components inspired by [TWBlocks](https://twblocks.com/) (built with Shadcn/ui and Tailwind CSS) for a modern and customizable UI.

## Features

- **Comprehensive Page Builder**: Create complex pages with 12+ pre-built section types
- **Powerful Component Library**: Feature-rich, responsive components for all common UI patterns
- **Fully Typed Schema**: Complete TypeScript definitions for all Sanity schema types
- **Internationalization Ready**: Built-in support for multiple languages with sanity-plugin-document-internationalization
- **Modern UI Framework**: Built with Shadcn/ui components and Tailwind CSS
- **Analytics Built-in**: Integrated Google Analytics and PostHog for comprehensive user tracking
- **Optimized Performance**: Next.js App Router and Turbopack for fast development and production builds
- **SEO Optimized**: Structured metadata, OpenGraph support, and more

## Pre-built Section Components

The kit includes the following section types for building pages:

- **Hero Sections**: Multiple variants including Button Banner, Badge Banner, and Grid Gallery
- **Feature Sections**: 9 layout variants (Default, With Image, Left/Right Image, Image Cards, etc.)
- **Blog Sections**: Display your blog posts with multiple layout options
- **Stats Sections**: Display key metrics and statistics with trend indicators
- **Testimonials**: Showcase customer testimonials with various display options
- **Pricing Sections**: Create pricing plans with feature comparisons
- **CTA (Call-to-Action)**: Engage users with prominent action buttons
- **FAQ Sections**: Organized question and answer sections
- **Cases/Logos**: Display client logos or case studies
- **Compare Features**: Create detailed feature comparison tables
- **Contact Sections**: Forms with customizable fields and validation
- **Newsletter Sections**: Email signup forms with multiple variants

## Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/) 15 (App Router & Turbopack)
  - [React](https://reactjs.org/) 18
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Shadcn/ui](https://ui.shadcn.com/) Components
  - [TWBlocks](https://twblocks.com/) Component Designs
  - [next-sanity](https://www.sanity.io/docs/connect-your-content-to-next-js) for Sanity integration
  - [PostHog](https://posthog.com/) for product analytics
  - [Google Analytics](https://analytics.google.com/) for website traffic insights
  - Internationalization Ready (Client & Server Components)
- **Studio (CMS):**
  - [Sanity](https://www.sanity.io/) v3
  - [TypeScript](https://www.typescriptlang.org/)
  - [sanity-plugin-document-internationalization](https://github.com/sanity-io/document-internationalization) for multi-language content
  - [Styled Components](https://styled-components.com/)

## Folder Structure

```plaintext
├── frontend/          # Next.js 15 frontend application
├── studio/            # Sanity Studio v3
└── package.json       # Root workspace configuration
```

## Getting Started

### 1. Clone the Repository

Clone the template repository to your local machine:

```bash
git clone https://github.com/vncsleal/sane-kit.git
cd sane-kit
```

### 2. Install Dependencies

Install dependencies for the entire monorepo from the root directory:

```bash
npm install
```

### 3. Configure Environment Variables

Create an `.env.local` file in the `frontend` directory (`frontend/.env.local`) with the following variables:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_SANITY_DATASET="production" # or your dataset name
# Optional: Add a read token for drafts if needed for preview
# SANITY_API_READ_TOKEN="YOUR_READ_TOKEN"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX" # Your Google Analytics measurement ID
NEXT_PUBLIC_POSTHOG_KEY="phc_XXXXXXXXXXXX" # Your PostHog project API key
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com" # Or your self-hosted PostHog instance URL
```

Replace the placeholder values with your actual project IDs and API keys. You can find your Sanity project ID in your Sanity project settings or by running `sanity manage` in the `studio` directory.

### 4. Run the Development Servers

Start both the Next.js frontend and the Sanity Studio development servers concurrently from the root directory:

```bash
npm run dev
```

- Your Next.js app will be running at [http://localhost:3000](http://localhost:3000)
- Your Sanity Studio will be running at [http://localhost:3333](http://localhost:3333) (or the port specified in the root `package.json`)

Log in to the Studio using your Sanity account.

## Content Management

### Page Building

1. Create new pages in the Sanity Studio by adding new Page documents
2. Use the Page Builder field to construct your page with various section components
3. Each section type offers multiple variants and customization options
4. Create reusable components like Headers and Footers that can be shared across pages

### Internationalization

The kit comes with built-in support for multiple languages:

- Default language is English with Brazilian Portuguese as a secondary language
- Add more languages by modifying the language configuration in `sanity.config.ts`
- Each document type can have language-specific versions with automatic relationship management
- Translation workflows are built into the Studio interface for easy content management

## Deployment

### Deploy Studio

To deploy your Sanity Studio:

1.  Make sure you're logged in to your Sanity account:
    ```bash
    cd studio
    npx sanity login
    ```
2.  Deploy the studio from the root directory:
    ```bash
    npm run deploy:studio
    ```

### Deploy Frontend (Example: Vercel)

1.  Push your code to a Git provider (e.g., GitHub).
2.  Create a [new Vercel project](https://vercel.com/new) and connect it to your Git repository.
3.  **Important:** Set the **Root Directory** in Vercel project settings to `frontend`.
4.  Add the environment variables from `frontend/.env.local` to your Vercel project settings (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN` if used).
5.  Deploy!

### Configure CORS

Remember to add your deployed frontend URL (e.g., `https://your-app.vercel.app`) to your Sanity project's CORS origins settings in the Sanity management console ([sanity.io/manage](https://sanity.io/manage)).

## Environment Variables Summary

Located in `frontend/.env.example`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET`: Your Sanity dataset name (e.g., `production`).
- `SANITY_API_READ_TOKEN` (Optional): Your Sanity API read token, required for fetching draft content if you implement preview functionality.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Your Google Analytics measurement ID.
- `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project API key.
- `NEXT_PUBLIC_POSTHOG_HOST`: The URL of your PostHog instance (default is https://app.posthog.com).

## Analytics Capabilities

Sane-Kit comes with both Google Analytics and PostHog implementations:

### Google Analytics
- Page view tracking across your site
- Event tracking capabilities
- Configured for privacy compliance
- Compatible with Google Analytics 4 (GA4)

### PostHog
- Open source analytics platform
- Feature flags and A/B testing capabilities
- Session recordings and heatmaps
- User identification and custom properties tracking
- Self-hostable for complete data ownership

To disable either analytics platform, simply remove the corresponding environment variables or set them to empty strings.

## Version History

- **Main branch**: Current version with document-based internationalization (v2.0+)
- **Legacy branch**: Previous version with array-based internationalization (v1.x)

To use the legacy version:
```bash
git checkout legacy
```

## Migration Guide

This project has migrated from array-based to document-based internationalization. If you're upgrading from v1.x:

### Breaking Changes

1. **Content Migration Required**: Existing multilingual content needs to be restructured
2. **Schema Changes**: Document types now use document-level language handling
3. **Query Updates**: GROQ queries have been updated for better performance
4. **Plugin Change**: Now uses `sanity-plugin-document-internationalization` instead of `sanity-plugin-internationalized-array`

### Migration Steps

1. **Backup your data** before starting the migration
2. **Update schema types** to use the new document-based structure
3. **Migrate existing content** using Sanity's migration tools
4. **Update GROQ queries** to work with the new structure
5. **Test thoroughly** in a development environment

### Resources

For detailed migration instructions, please refer to the [Sanity Document Internationalization documentation](https://github.com/sanity-io/document-internationalization).

### Need Help?

If you encounter issues during migration, please:
- Check the [legacy branch](https://github.com/vncsleal/sane-kit/tree/legacy) for reference
- Review the migration documentation
- Open an issue on GitHub for additional support

## Contributing

Contributions are welcome! Please refer to the contributing guidelines (if available) or open an issue/pull request.

## License

This project is licensed under the [LICENSE](./LICENSE) file.