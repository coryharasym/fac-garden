// Inject a single accessible nav into copies of Markdown pages during GitHub Actions.
// Source notes remain untouched. Paths follow GitHub Pages' /fac-garden/ base.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.argv[2];
if (!root) throw new Error("Usage: node scripts/prepare-site.mjs <quartz-content-folder>");
const base = "/fac-garden/";
const items = [
  ["Home", ""], ["First Steps", "first-steps/"], ["Explore Topics", "topics/"],
  ["Blog & Stories", "blog/"], ["Library", "archive/"],
];
let count=0;
function visit(dir) {
  for (const entry of readdirSync(dir, { withFileTypes:true })) {
    const file = join(dir,entry.name);
    if(entry.isDirectory()){visit(file);continue;}
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const original=readFileSync(file,"utf8");
    if (original.includes('class="fac-site-nav"')) continue;
    const rel=relative(root,file).split(sep).join("/");
    const current = rel === "index.md" ? "" :
      rel.startsWith("first-steps/") ? "first-steps/" :
      rel.startsWith("topics/") ? "topics/" :
      rel.startsWith("blog/") ? "blog/" :
      rel.startsWith("archive/") || rel.startsWith("notes/") ? "archive/" : "";
    const links=items.map(([label,slug]) => {
      const active=slug===current ? ' aria-current="page"' : "";
      return `<a href="${base+slug}"${active}>${label}</a>`;
    }).join("");
    const nav=`<nav class="fac-site-nav" aria-label="Main navigation"><a class="fac-brand" href="${base}">FAC Garden</a><div class="fac-nav-links">${links}</div></nav>\n`;
    const match=original.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)/);
    const output= match ? match[1]+"\n"+nav+"\n"+original.slice(match[1].length) : nav+"\n"+original;
    writeFileSync(file, output);
    count++;
  }
}
visit(root);
console.log(`Prepared shared FAC navigation for ${count} Markdown pages.`);
