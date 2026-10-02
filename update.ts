#!/usr/bin/env bun
/**
 * Syncs the local mirror with the Kalshi documentation.
 *
 * Upstream is a Mintlify site: `sitemap.xml` enumerates every page, each page has a clean `.md`
 * twin, and the WebSocket API is published as `asyncapi.yaml`. Pages are stored under `docs/` at a
 * path mirroring their URL, behind a one-line `url:` frontmatter, and are only written when their
 * content actually changed, so a `git diff` shows exactly what Kalshi changed and nothing else.
 *
 * The sitemap's `<lastmod>` is deliberately ignored: Mintlify bumps it on every deploy for every
 * page, so storing it would touch every file on every run.
 *
 * Run order matters. Every file is fetched and validated before anything touches the working
 * tree, and pruning runs last: the failure mode this protects against is upstream serving a
 * truncated sitemap, which a prune-first script would turn into a mass deletion.
 *
 * Usage:
 *   bun run update.ts
 *   # or with Node.js >= 22.18 (native type stripping):
 *   node update.ts
 *   # after confirming a large upstream removal is genuine:
 *   bun run update.ts --allow-shrink
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, posix, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://docs.kalshi.com/';
const SITEMAP_URL = `${BASE}sitemap.xml`;
const ASYNCAPI_URL = `${BASE}asyncapi.yaml`;
const ASYNCAPI_FILE = 'asyncapi.yaml';
const OUTPUT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'docs');
const USER_AGENT = 'kalshi-docs/1.0 (+https://github.com/justrhoto/kalshi-docs; docs mirror)';

/** Fail the run rather than prune if the file count falls by more than this fraction. */
const SHRINK_TOLERANCE = 0.1;
const CONCURRENCY = 8;
const MAX_ATTEMPTS = 3;

/** Directories never scanned for mirrored files. */
const SKIP_DIRS = new Set(['.git', '.github', 'node_modules']);

/** A file we mirror: posix path relative to OUTPUT_DIR and the exact bytes to store. */
type Page = { url: string; path: string; content: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url: string): Promise<string> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      // Other 4xx will not fix themselves; fail fast instead of burning retries.
      if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { fatal: true });
      return await res.text();
    } catch (error) {
      lastError = error;
      if ((error as { fatal?: boolean }).fatal || attempt === MAX_ATTEMPTS) break;
      await sleep(500 * 2 ** (attempt - 1));
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError}`);
}

/** Every `<loc>` in the sitemap that is a docs page (the homepage has no `.md` twin). */
function parseSitemap(xml: string): string[] {
  const urls = new Set<string>();
  for (const [, loc] of xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)) {
    const url = loc.replace(/\/$/, '');
    if (url.startsWith(BASE) && url.length > BASE.length) urls.add(url);
  }
  return [...urls];
}

/** `https://docs.kalshi.com/api-reference/x/get-y` -> `api-reference/x/get-y.md` (under OUTPUT_DIR) */
function urlToPath(url: string): string {
  const path = url.slice(BASE.length);
  return path.endsWith('.md') ? path : `${path}.md`;
}

/** The frontmatter is just the source URL: it never changes unless the page moves. */
const withFrontmatter = (url: string, body: string) => `---\nurl: ${url}\n---\n${body}`;

/** Mirrored pages are recognised by their frontmatter, so hand-written files are never pruned. */
const isMirrored = (content: string) => /^---\r?\nurl: https:\/\/docs\.kalshi\.com\//.test(content);

/**
 * A 200 is not proof of content: a misbehaving CDN or a site-wide error page can serve HTML
 * for every URL. Reject anything that is not the format we asked for, before any write.
 */
function validate(url: string, body: string): void {
  if (!body.trim()) throw new Error(`Empty body from ${url}`);
  if (/^\s*<(!doctype|html)/i.test(body)) throw new Error(`Got HTML instead of text from ${url}`);
  if (url === ASYNCAPI_URL && !/^asyncapi:/m.test(body)) {
    throw new Error(`${url} does not look like an AsyncAPI document`);
  }
}

/** Every existing mirrored page, as posix-style paths relative to OUTPUT_DIR. */
async function existingPages(): Promise<string[]> {
  const out: string[] = [];
  const walk = async (dir: string) => {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, item.name);
      if (item.isDirectory()) {
        if (!SKIP_DIRS.has(item.name)) await walk(full);
      } else if (item.name.endsWith('.md') && isMirrored(await readFile(full, 'utf8'))) {
        out.push(relative(OUTPUT_DIR, full).split(sep).join(posix.sep));
      }
    }
  };
  await walk(OUTPUT_DIR);
  return out;
}

/** Fetches every URL with a bounded worker pool. Any failure aborts the whole run. */
async function fetchPages(urls: string[]): Promise<Page[]> {
  const pages: Page[] = new Array(urls.length);
  let cursor = 0;
  let done = 0;
  const worker = async () => {
    while (cursor < urls.length) {
      const index = cursor++;
      const url = urls[index];
      const isAsyncApi = url === ASYNCAPI_URL;
      const body = await fetchText(isAsyncApi ? url : `${url}.md`);
      validate(url, body);
      pages[index] = isAsyncApi
        ? { url, path: ASYNCAPI_FILE, content: body }
        : { url, path: urlToPath(url), content: withFrontmatter(url, body) };
      if (++done % 25 === 0) console.log(`  fetched ${done}/${urls.length}`);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return pages;
}

async function main() {
  console.log(`Enumerating ${SITEMAP_URL}`);
  const pageUrls = parseSitemap(await fetchText(SITEMAP_URL));
  console.log(`  ${pageUrls.length} pages`);

  // Guardrail. Runs before any write, and before any prune.
  const before = await existingPages();
  const floor = Math.floor(before.length * (1 - SHRINK_TOLERANCE));
  const allowShrink = process.argv.includes('--allow-shrink');
  if (pageUrls.length === 0 || (pageUrls.length < floor && !allowShrink)) {
    throw new Error(
      `Page count fell from ${before.length} to ${pageUrls.length} (floor ${floor}). ` +
        'Upstream may be broken; refusing to sync. Re-run once upstream recovers, or run ' +
        'locally with --allow-shrink if the drop is genuine.',
    );
  }

  console.log(`Fetching ${pageUrls.length + 1} files`);
  const pages = await fetchPages([...pageUrls, ASYNCAPI_URL]);

  let added = 0;
  let modified = 0;
  for (const page of pages) {
    const filepath = join(OUTPUT_DIR, page.path);
    const existing = await readFile(filepath, 'utf8').catch(() => null);
    if (existing === page.content) continue;
    await mkdir(dirname(filepath), { recursive: true });
    await writeFile(filepath, page.content);
    if (existing === null) added++;
    else modified++;
    console.log(`  ${existing === null ? 'added' : 'modified'} ${page.path}`);
  }

  const wanted = new Set(pages.map((p) => p.path));
  const orphans = before.filter((f) => !wanted.has(f));
  for (const orphan of orphans) {
    await rm(join(OUTPUT_DIR, orphan));
    console.log(`  removed ${orphan}`);
  }

  const summary = `${modified} modified, ${added} added, ${orphans.length} removed`;
  const changed = modified + added + orphans.length > 0;
  console.log(`Done: ${summary}`);
  if (process.env.GITHUB_OUTPUT) {
    await writeFile(process.env.GITHUB_OUTPUT, `changed=${changed}\nsummary=${summary}\n`, {
      flag: 'a',
    });
  }
}

main().catch((error) => {
  console.error(`\n${error instanceof Error ? error.message : error}`);
  // exitCode rather than exit(): exiting with fetch sockets still open crashes libuv on Windows.
  process.exitCode = 1;
});
