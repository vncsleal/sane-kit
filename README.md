# Sane-Kit: Next.js & Sanity Starter Template

[![Next.js](https://img.shields.io/badge/Next.js-20232A?style=for-the-badge&logo=Next.js)](https://nextjs.org/) [![Sanity](https://img.shields.io/badge/Sanity-20232A?style=for-the-badge&logo=sanity&logoColor=F97316)](https://www.sanity.io/) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![Typescript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-20232A?style=for-the-badge&logo=tailwindcss&logoColor=319795)](https://tailwindcss.com/) [![Shadcn](https://img.shields.io/badge/shadcn/ui-20232A?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBjbGFzcz0iaC02IHctNiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9Im5vbmUiPjwvcmVjdD48bGluZSB4MT0iMjA4IiB5MT0iMTI4IiB4Mj0iMTI4IiB5Mj0iMjA4IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiPjwvbGluZT48bGluZSB4MT0iMTkyIiB5MT0iNDAiIHgyPSI0MCIgeTI9IjE5MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMyIj48L2xpbmU+PC9zdmc+&logoColor=ffffff)](https://ui.shadcn.com/)

<!-- Optional: Add a link to your deployed demo -->
<!-- [Demo](YOUR_DEMO_URL) -->

<!-- Optional: Add a screenshot -->
<!-- ![Screenshot of Sane-Kit](YOUR_SCREENSHOT_URL) -->

A feature-rich starter template combining Next.js 15 (with Turbopack) for the frontend and Sanity v3 for the backend CMS. Designed for rapid development with pre-built components and internationalization support.

This template utilizes components inspired by [TWBlocks](https://tw-blocks.com/) (built with Shadcn/ui and Tailwind CSS) for a modern and customizable UI.

## Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/) 15 (App Router & Turbopack)
  - [React](https://reactjs.org/) 18
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Shadcn/ui](https://ui.shadcn.com/) Components
  - [TWBlocks](https://tw-blocks.com/) Component Designs
  - [next-sanity](https://www.sanity.io/docs/connect-your-content-to-next-js) for Sanity integration
  - Internationalization Ready (Client & Server Components)
- **Studio (CMS):**
  - [Sanity](https://www.sanity.io/) v3
  - [TypeScript](https://www.typescriptlang.org/)
  - [sanity-plugin-internationalized-array](https://github.com/sanity-io/sanity-plugin-internationalized-array) for multi-language content
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
```

Replace `"YOUR_PROJECT_ID"` with your actual Sanity project ID. You can find this in your Sanity project settings or by running `sanity manage` in the `studio` directory.

### 4. Run the Development Servers

Start both the Next.js frontend and the Sanity Studio development servers concurrently from the root directory:

```bash
npm run dev
```

- Your Next.js app will be running at [http://localhost:3000](http://localhost:3000)
- Your Sanity Studio will be running at [http://localhost:3333](http://localhost:3333) (or the port specified in the root `package.json`)

Log in to the Studio using your Sanity account.

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

## Contributing

Contributions are welcome! Please refer to the contributing guidelines (if available) or open an issue/pull request.

## License

This project is licensed under the [LICENSE](./LICENSE) file.
