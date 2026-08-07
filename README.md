# Dimitrios Ioannidis — Portfolio

A modern personal portfolio presenting my experience, education, technical skills, and work in data science and software development.

🌐 **Live website:** [dimitrios-ioannidis.dmitrisgr.chatgpt.site](https://dimitrios-ioannidis.dmitrisgr.chatgpt.site)
💼 **LinkedIn:** [Dimitrios Ioannidis](https://www.linkedin.com/in/dimitrios-ioannidis-dev/)

## About

I am a Data Science MSc graduate with experience delivering technical solutions and managing client implementations. This portfolio highlights my professional background, education, technical capabilities, and interest in data-driven software.

## Features

* Responsive design for desktop, tablet, and mobile
* Professional experience and education sections
* Technical skills overview
* Downloadable résumé
* Direct LinkedIn and email contact links
* Accessible, modern interface
* Cloudflare-compatible deployment
* Markdown-powered blog with featured and recent article layouts
* Topic archives, reading time, syntax highlighting, and article navigation
* SEO metadata, sitemap, RSS feed, and LinkedIn/email sharing

## Technology Stack

* [Next.js](https://nextjs.org/) — React framework
* [React](https://react.dev/) — User-interface components
* [TypeScript](https://www.typescriptlang.org/) — Type-safe development
* CSS — Custom styling, layout, and responsive design
* Markdown — Version-controlled article authoring
* [Cloudflare Workers](https://workers.cloudflare.com/) — Hosting and deployment
* [OpenNext for Cloudflare](https://opennext.js.org/cloudflare) — Next.js Cloudflare integration

## Running the Project Locally

Make sure [Node.js](https://nodejs.org/) is installed, then clone the repository:

```bash
git clone https://github.com/d-ioannidis/ioannidis-portfolio.git
cd ioannidis-portfolio
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run lint      # Check the code for linting problems
npm run preview   # Build and preview the Cloudflare version
npm run deploy    # Deploy the project to Cloudflare
```

## Project Structure

```text
ioannidis-portfolio/
├── app/
│   ├── globals.css       # Global and responsive styling
│   ├── layout.tsx        # Page layout and metadata
│   ├── page.tsx          # Main portfolio page
│   ├── blog/             # Blog index, article, and topic routes
│   ├── rss.xml/          # RSS feed
│   └── sitemap.ts        # Search-engine sitemap
├── components/           # Shared site and article components
├── content/articles/     # Markdown articles and starter template
├── lib/articles.ts       # Article loading and metadata utilities
├── public/               # Résumé and other static files
├── scripts/              # Project utility scripts
├── worker/               # Cloudflare worker files
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and commands
├── tsconfig.json         # TypeScript configuration
└── wrangler.jsonc        # Cloudflare configuration
```

## Deployment

The project is configured for deployment to Cloudflare Workers using OpenNext.

Before deploying, authenticate with Cloudflare:

```bash
npx wrangler login
```

Then run:

```bash
npm run deploy
```

Cloudflare-specific settings can be changed in `wrangler.jsonc`.

## Publishing an Article

1. Copy `content/articles/_article-template.md`.
2. Rename the copy using the URL you want, for example `my-new-article.md`.
3. Complete the metadata and write the article in Markdown.
4. Set `published: true`, then commit and push the file.
5. Cloudflare rebuilds the site and publishes the article at `/blog/my-new-article`.

Set `NEXT_PUBLIC_SITE_URL` to the production domain in Cloudflare so sitemap, RSS, and social URLs use the final address.

## Contact

**Dimitrios Ioannidis**

* [LinkedIn](https://www.linkedin.com/in/dimitrios-ioannidis-dev/)
* [GitHub](https://github.com/d-ioannidis)

## License

This portfolio and its source code are intended for personal use. Please do not copy its personal content, résumé, or branding without permission.
