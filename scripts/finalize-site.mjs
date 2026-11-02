// Quartz 5 folder pages are generated as a distinct page type. Their Markdown
// does not always contain the shared nav injected before build. Add it to the
// rendered article only where it is missing. Static links here intentionally
// include the GitHub Pages base path because Quartz has already processed HTML.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
const root = process.argv[2];
if (!root) throw Error("Usage: node scripts/finalize-site.mjs <public-directory>");
const base = "/fac-garden/";
const navItems = [["Home",""],["First Steps","first-steps/"],["Explore Topics","topics/"],["Blog & Stories","blog/"],["Library","archive/"]];
let count = 0;
function walk(directory) {
  for (const entry of readdirSync(directory,{withFileTypes:true})) {
    const file=join(directory,entry.name);
    if (entry.isDirectory()) {walk(file);continue;}
    if (!entry.isFile()||!file.endsWith(".html")) continue;
    const name=relative(root,file).split(sep).join("/");
    if (name==="404.html") continue;
    const html=readFileSync(file,"utf8");
    if (html.includes('fac-site-nav')) continue;
    const active=name==="index.html"?"":name.startsWith("first-steps/")?"first-steps/":name.startsWith("topics/")?"topics/":name.startsWith("blog/")?"blog/":name.startsWith("archive/")||name.startsWith("notes/")?"archive/":"";
    const links=navItems.map(([label,slug])=>'<a href="'+base+slug+'"'+(slug===active?' aria-current="page"':'')+'>'+label+"</a>").join("");
    const nav='<nav class="fac-site-nav" aria-label="Main navigation"><a class="fac-brand" href="'+base+'">FAC Garden</a><div class="fac-nav-links">'+links+'</div></nav>';
    // Folder pages use a different Quartz frame and may not include <article>.
    // Insert at the start of the central content area for every page type.
    const target=/<div\b[^>]*class="[^"]*\bcenter\b[^"]*"[^>]*>/i;
    if (!target.test(html)) throw Error("Cannot find Quartz center in "+name);
    const output=html.replace(target,m=>m+nav);
    writeFileSync(file,output);
    count++;
  }
}
walk(root);
console.log("Added navigation to "+count+" Quartz folder / virtual pages.");
