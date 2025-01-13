# Sanity Scaffolding Template

A minimal scaffolding template for creating your own [Sanity](https://www.sanity.io/) template, Intended for template creators—customize as needed!

## Folder Structure

```plaintext
├── app/               # Your frontend application
├── studio/            # Sanity Studio
└── package.json       # Root workspace configuration
```

## Getting Started

> A more in-depth guide is available in the [Sanity documentation](https://www.sanity.io/docs).
> Need inspiration or help creating a template? Join the [#creators channel in Sanity’s Slack community](https://slack.sanity.io) to connect with others and get feedback.

### Clone the Repository
Clone the template repository to your local machine.

### Install Dependencies

```bash
npm install
```

### Add a Frontend Framework
Install your preferred frontend framework. The command below installs a new Next.js project in the `app` directory.

```bash
npx create-next-app@latest app
```

### Customize Frontend Package
The app package is already defined as a workspace in the root `package.json`, but you may need to customize as needed.

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

### Validate Template

```bash
npm run validate
```

This command ensures the Sanity CLI can properly read your template configuration.

## More Info

For details on the template validator, visit [sanity-io/template-validator](https://github.com/sanity-io/template-validator).
