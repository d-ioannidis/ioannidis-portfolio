import { readdir, readFile, writeFile } from "node:fs/promises";

const articlesDirectory = new URL("../content/articles/", import.meta.url);
const outputFile = new URL("../content/articles.generated.json", import.meta.url);

const filenames = (await readdir(articlesDirectory))
  .filter((filename) => /\.mdx?$/.test(filename))
  .sort();

const articles = await Promise.all(
  filenames.map(async (filename) => ({
    filename,
    source: await readFile(new URL(filename, articlesDirectory), "utf8"),
  })),
);

await writeFile(outputFile, `${JSON.stringify(articles, null, 2)}\n`, "utf8");

console.log(`Generated article bundle with ${articles.length} Markdown files.`);
