# Dimitrios Ioannidis — Portfolio

A modern personal portfolio presenting my experience, education, technical skills, and work in data science and software development.

🌐 **Live website:** [ioannidis.dev](https://ioannidis.dev)
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
* Persistent article likes and impression counts using Cloudflare D1
* Browser-local article favorites
* Moderated visitor comments

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
npm run dev                # Generate article bundle and start the development server
npm run articles:generate  # Rebuild the bundled Markdown article manifest
npm run build              # Generate articles and create a production build
npm run lint               # Check the code for linting problems
npm run preview            # Generate articles and preview the Cloudflare version
npm run deploy             # Generate articles and deploy to Cloudflare
npm run db:migrate:local    # Apply D1 migrations to the local database
npm run db:migrate:remote   # Apply D1 migrations to the production D1 database
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
├── content/
│   ├── articles/         # Markdown article sources and starter template
│   └── articles.generated.json # Bundled article sources for Worker-safe runtime access
├── lib/articles.ts       # Article parsing and metadata utilities
├── public/               # Résumé and other static files
├── scripts/              # Project utility scripts, including article generation
├── worker/               # Cloudflare worker files
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and commands
├── tsconfig.json         # TypeScript configuration
└── wrangler.jsonc        # Cloudflare configuration
```

## Deployment

The project is configured for deployment to Cloudflare Workers using OpenNext.

The blog does not read Markdown files from the Worker filesystem at runtime. Before development and production builds, `scripts/generate-articles.mjs` packages the Markdown sources into `content/articles.generated.json`, which Next.js can bundle into the Worker.

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
4. Set `published: true`.
5. Run `npm run articles:generate` so the Worker-safe article bundle is updated.
6. Commit the Markdown file and the updated `content/articles.generated.json`, then push.
7. Cloudflare rebuilds the site and publishes the article at `/blog/my-new-article`.

The development, build, preview, deploy, and upload workflows regenerate the bundle automatically as an additional safeguard.

Set `NEXT_PUBLIC_SITE_URL` to the production domain in Cloudflare so sitemap, RSS, and social URLs use the final address.

## Contact

**Dimitrios Ioannidis**

* [LinkedIn](https://www.linkedin.com/in/dimitrios-ioannidis-dev/)
* [GitHub](https://github.com/d-ioannidis)

## License

This portfolio and its source code are intended for personal use. Please do not copy its personal content, résumé, or branding without permission.


## Article Engagement

Article pages include shared likes, impression counts, local favorites, and comments.

* **Likes** are stored in Cloudflare D1 and limited to one active like per browser-generated visitor ID and article.
* **Impressions** are stored in D1. The browser increments an article once per tab/session to avoid counting reloads repeatedly.
* **Favorites** are private browser-local bookmarks stored in `localStorage`; they are not uploaded.
* **Comments** are stored in D1 with `approved = 0` and therefore do not appear publicly until moderated.

Before deploying these features for the first time, apply the migration:

```bash
npm run db:migrate:remote
```

To approve a comment, use the Cloudflare D1 console or Wrangler. For example:

```sql
UPDATE article_comments SET approved = 1 WHERE id = 123;
```

Visitor email addresses are stored only for comment moderation and are never returned by the public comments API.
