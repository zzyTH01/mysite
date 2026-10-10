import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const basePath = "/mysite";
const requiredRoutes = [
  "index.html",
  "about/index.html",
  "blog/index.html",
  "notes/index.html",
  "life/index.html",
  "resources/index.html",
  "404.html",
  "blog/first-race-weekend/index.html",
  "blog/cycling-city-observation/index.html",
  "notes/anime-and-personal-taste/index.html",
  "notes/study-with-vibe/index.html",
  "notes/slow-down-shoot-more/index.html",
  "life/night-ride/index.html",
  "life/anime-weekend/index.html",
  "life/music-photowalk/index.html",
];
const requiredFiles = [
  "downloads/gaozhangyuanzhu-resume.pdf",
  "downloads/personal-site-starter-checklist.txt",
];

async function exists(relativePath) {
  try {
    await stat(path.join(distDir, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(filePath);
    return entry.isFile() && entry.name.endsWith(".html") ? [filePath] : [];
  }));
  return files.flat();
}

const errors = [];

for (const route of requiredRoutes) {
  if (!(await exists(route))) errors.push(`Missing build route: /${route}`);
}

if (await exists("blog/photography-light-notes/index.html")) {
  errors.push("Draft post leaked into production: /blog/photography-light-notes/");
}

for (const file of requiredFiles) {
  if (!(await exists(file))) errors.push(`Missing public file: /${file}`);
}

const homepagePath = path.join(distDir, "index.html");
const homepage = await readFile(homepagePath, "utf8");
for (const text of ["高瞻远瞩", "学生", "二次元", "赛车", "摄影", "骑行", "音乐", "Vibe"]) {
  if (!homepage.includes(text)) errors.push(`Homepage is missing required text: ${text}`);
}

const files = await htmlFiles(distDir);
const checkedLinks = new Set();

for (const file of files) {
  const html = await readFile(file, "utf8");
  const matches = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  for (const rawHref of matches) {
    const href = rawHref.replaceAll("&amp;", "&");
    if (
      href.startsWith("#") ||
      /^(?:mailto:|tel:|data:|http:|https:|\/\/)/i.test(href) ||
      href.endsWith(".map")
    ) {
      continue;
    }

    const [withoutHash] = href.split("#");
    const [pathname, search = ""] = withoutHash.split("?");
    if (!pathname.startsWith("/")) {
      errors.push(`Non-root local URL in ${path.relative(distDir, file)}: ${href}`);
      continue;
    }

    const key = `${pathname}?${search}`;
    if (checkedLinks.has(key)) continue;
    checkedLinks.add(key);

    let cleanPath = decodeURIComponent(pathname);
    if (cleanPath === basePath || cleanPath.startsWith(`${basePath}/`)) {
      cleanPath = cleanPath.slice(basePath.length) || "/";
    }
    const target = cleanPath.endsWith("/")
      ? path.posix.join(cleanPath, "index.html")
      : /\.[a-zA-Z0-9]+$/.test(cleanPath)
        ? cleanPath
        : path.posix.join(cleanPath, "index.html");

    if (!(await exists(target))) {
      errors.push(`Broken local reference in ${path.relative(distDir, file)}: ${href} -> /${target}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Static verification failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Static verification passed. Checked ${files.length} HTML files and ${checkedLinks.size} unique local references.`);
