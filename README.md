# Sanity Template Kit

A minimal scaffolding template for creating your own [Sanity template](https://www.sanity.io/docs/create-your-own-sanity-template). Intended for template creators — customize as needed!

## Folder Structure

```plaintext
├── frontend/          # Your frontend application
├── studio/            # Sanity Studio
└── package.json       # Root workspace configuration
```

## Getting Started

> A more in-depth guide is available in the [Sanity documentation](https://www.sanity.io/docs/create-your-own-sanity-template).
> Need inspiration or help creating a template? Join the [#template-creators channel in Sanity’s Slack community](https://slack.sanity.io) to connect with others and get feedback.

### Clone the Repository

Clone the template repository to your local machine.

### Install Dependencies

```bash
npm install
```

### Add a Frontend Framework

Install your preferred frontend framework. The command below installs a new Next.js project in the `frontend` directory.

```bash
npx create-next-app@latest frontend
```

### Customize Frontend Package

The frontend package is already defined as a workspace in the root `package.json`, but you may need to customize as needed.

### Configure Environment Variables

Create an `.env.example` file in your frontend directory with the following variables:

```dotenv
SANITY_PROJECT_ID=
SANITY_DATASET=
```

For Next.js projects, prefix the variables with `NEXT_PUBLIC_`:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
```

### Run the app

```bash
npm run dev
```

## Deployment

### Deploy Studio

To deploy your Sanity Studio to production:

1. Make sure you're logged in to your Sanity account:

```bash
npx sanity login
```

2. Deploy the studio:

```bash
npm run deploy:studio
```

### Deploy Frontend

You have the freedom to deploy your app to your hosting provider of choice. With Vercel and GitHub being a popular choice, we'll cover the basics of that approach:

1. Create a GitHub repository from this project. Learn more.
2. Create a new Vercel project and connect it to your Github repository.
3. Set the Root Directory to your `frontend` directory.
4. Configure your Environment Variables.

### Validate Template

```bash
npm run validate
```

This command ensures the Sanity CLI can properly read your template configuration.

## More Info

For details on the template validator, visit [sanity-io/template-validator](https://github.com/sanity-io/template-validator).
