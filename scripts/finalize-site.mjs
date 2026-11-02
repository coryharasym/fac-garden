// Build-time, source-independent FAC Garden navigation.
// Inject after Quartz has processed links so site base paths are never rewritten twice.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createHash } from "node:crypto";
const root=process.argv[2];
if(!root)throw Error("Usage: node finalize-site.mjs <quartz-public-directory>");
// Search and backlinks share this un-hashed JSON URL. Give each content version
// a distinct request URL so a refreshed page cannot reuse an older search index.
const indexVersion=createHash("sha256").update(readFileSync(join(root,"static/contentIndex.json"))).digest("hex").slice(0,16);
const base="/fac-garden/";
const items=[
  ["Home",""],["First Steps","first-steps/"],["Explore Topics","topics/"],
  ["Blog & Stories","blog/"],["Library","archive/"]
];
let total=0;
const failures=[];
function walk(dir){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const file=join(dir,entry.name);
    if(entry.isDirectory()){walk(file);continue;}
    if(!entry.isFile()||!file.endsWith(".html"))continue;
    const name=relative(root,file).split(sep).join("/");
    const html=readFileSync(file,"utf8").replace(/static\/contentIndex\.json(?=["'])/g,
      "static/contentIndex.json?v="+indexVersion);
    if(name==="404.html"){writeFileSync(file,html);continue;}
    // We intentionally DO NOT inject into Markdown before rendering. Quartz 5
    // processes raw HTML hrefs, so pre-injected /fac-garden/ paths can be mangled.
    if(html.includes('class="fac-site-nav"')){
      failures.push(name+": unexpected pre-existing navigation");continue;
    }
    const active=name==="index.html"?"":name.startsWith("first-steps/")?"first-steps/":
      name.startsWith("topics/")?"topics/":name.startsWith("blog/")?"blog/":
      name.startsWith("archive/")||name.startsWith("notes/")?"archive/":null;
    const links=items.map(([label,path])=>{
      const current=(active!==null&&path===active)?' aria-current="page"':'';
      return '<a href="'+base+path+'"'+current+'>'+label+'</a>';
    }).join("");
    const nav='<nav class="fac-site-nav" aria-label="Main navigation">'+
       '<a class="fac-brand" href="'+base+'">FAC Garden</a>'+
       '<div class="fac-nav-links">'+links+'</div></nav>';
    // Place navigation *above* all article headings, metadata and content.
    // Quartz folder and content pages have different body components, but
    // both render a .center container.
    const target=/<div\b[^>]*class="[^"]*\bcenter\b[^"]*"[^>]*>/i;
    if(!target.test(html)){failures.push(name+": center container missing");continue;}
    writeFileSync(file,html.replace(target,match=>match+nav));
    total++;
  }
}
walk(root);
if(failures.length)throw Error(failures.slice(0,25).join("\n"));
console.log("Added canonical FAC navigation to "+total+" HTML pages.");
