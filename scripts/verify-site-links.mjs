// End-to-end build validation of generated internal site links (not just frontmatter).
// Resolves each href as a browser would at GitHub Pages' actual project URL.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, join, relative, sep } from "node:path";
const root=resolve(process.argv[2]||"");
if(!process.argv[2]||!existsSync(root))throw Error("Pass Quartz public directory");
const origin="https://coryharasym.github.io";
const prefix="/fac-garden/";
const navPaths=["","first-steps/","topics/","blog/","archive/"];
const hubPaths=["first-steps/", "topics/", "blog/", "archive/", "about/", "notes/", "blog/categories/"];
const pathwayLabels=new Set([
  "first steps", "all first steps", "explore first steps",
  "explore fac's first steps", "explore fac's first steps pathway",
]);
function plainText(html){
  return html.replace(/<[^>]*>/g," ").replace(/&amp;/g,"&")
    .replace(/&#(?:39|x27);|&apos;|[’‘]/gi,"'").replace(/&nbsp;/g," ")
    .replace(/[↗→]/g,"").replace(/\s+/g," ").trim();
}
const files=[];
const failures=[];
let internal=0,external=0, navCount=0;
function collect(dir){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const file=join(dir,entry.name);
    if(entry.isDirectory())collect(file);
    else if(entry.isFile()&&file.endsWith(".html"))files.push(file);
  }
}
collect(root);
if(files.length<10)throw Error("Too few generated pages: "+files.length);
function outputExists(pathname){
  let rel;
  try {rel=decodeURIComponent(pathname.slice(prefix.length));}
  catch{return false;}
  if(rel.includes("\\")||rel.split("/").includes(".."))return false;
  const options=rel.endsWith("/")?[join(root,rel,"index.html")]:
    [join(root,rel),join(root,rel+".html"),join(root,rel,"index.html")];
  return options.some(f=>existsSync(f)&&statSync(f).isFile());
}
for(const path of hubPaths){
  const file=join(root,path,"index.html");
  if(!existsSync(file)){
    failures.push(path+": missing hub page");continue;
  }
  const html=readFileSync(file,"utf8");
  const article=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  if(!article||plainText(article[1]).length<80||!/<h1\b/i.test(article[1]))
    failures.push(path+": hub must contain its heading and substantive article content");
}
const indexFile=join(root,"static/contentIndex.json");
if(!existsSync(indexFile))failures.push("Search content index missing");
else {
  const index=JSON.parse(readFileSync(indexFile,"utf8"));
  for(const [slug,page] of Object.entries(index)){
    if(!page.title?.trim()||/^untitled(?:$|\s*\|)/i.test(page.title))
      failures.push(slug+": search/backlink title missing");
    if(!outputExists(prefix+slug))failures.push(slug+": search result target missing");
  }
}
for(const file of files){
  const name=relative(root,file).split(sep).join("/");
  const html=readFileSync(file,"utf8");
  const title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  if(!title?.trim()||/^untitled(?:$|\s*\|)/i.test(title))
    failures.push(name+": meaningful browser title missing");
  if(!/static\/contentIndex\.json\?v=[a-f0-9]{16}["']/.test(html))
    failures.push(name+": search index must have a content version to avoid stale cached titles");
  const navs=[...html.matchAll(/<nav\b[^>]*class="[^"]*\bfac-site-nav\b[^"]*"[^>]*>([\s\S]*?)<\/nav>/gi)];
  if(name!=="404.html"){
    if(navs.length!==1)failures.push(name+": expected one main navigation, found "+navs.length);
    else {
      navCount++;
      for(const path of navPaths){
        if(!navs[0][1].includes('href="'+prefix+path+'"'))
          failures.push(name+": missing top navigation path "+prefix+path);
      }
    }
  }
  if(name==="index.html"){
    const section=html.match(/<div class="fac-card-grid">([\s\S]*?)<\/div>/);
    if(!section)failures.push("Homepage card grid missing");
    else {
      const cards=[...section[1].matchAll(/<a\b[^>]*class="[^"]*\bfac-card\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g)];
      if(cards.length!==4)failures.push("Expected 4 complete cards, found "+cards.length);
      for(const card of cards)
        for(const part of ["fac-card-icon","fac-card-title","fac-card-description","fac-card-action"])
          if(!card[1].includes(part))failures.push("Homepage card missing "+part);
    }
  }
  const pagePath=name==="index.html"?"":name.endsWith("/index.html")?name.slice(0,-"index.html".length):name;
  const current=new URL(prefix+pagePath,origin);
  const links=[...html.matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi)];
  for(const found of links){
    const raw=(found[1]??found[2]).replace(/&amp;/g,"&");
    if(!raw||raw.startsWith("#")||/^(mailto:|tel:|javascript:|data:)/i.test(raw))continue;
    let url;
    try {url=new URL(raw,current);}
    catch{failures.push(name+": invalid href "+raw);continue;}
    if(url.origin!==origin){external++;continue;}
    const label=plainText(found[3]||"").toLowerCase();
    const homePathwayCard=name==="index.html" && /\bfac-card\b/.test(found[0]) &&
      label.startsWith("first steps ");
    if((pathwayLabels.has(label)||homePathwayCard)&&
       ![prefix+"first-steps/",prefix+"first-steps/index",prefix+"first-steps/index.html"].includes(url.pathname))
      failures.push(name+": First Steps pathway link points to wrong destination "+raw);
    internal++;
    // Quartz 404 page may link to /fac-garden without a trailing slash.
    if(url.pathname===prefix.slice(0,-1)){ continue; }
    if(!url.pathname.startsWith(prefix)){
      failures.push(name+": link leaves site base "+raw+" → "+url.pathname);continue;
    }
    if(url.pathname.includes("/fac-garden/fac-garden/")){
      failures.push(name+": duplicated /fac-garden/ in "+raw);continue;
    }
    if(!outputExists(url.pathname)){
      failures.push(name+": broken internal link "+raw+" → "+url.pathname);
    }
  }
  // Assets must remain inside the published base and resolve just like links.
  const assets=[...html.matchAll(/<(?:script|img)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>|<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)];
  for(const match of assets){
    const raw=(match[1]??match[2]).replace(/&amp;/g,"&");
    let url;
    try{url=new URL(raw,current);}catch{failures.push(name+": invalid asset URL "+raw);continue;}
    if(url.origin===origin&&(!url.pathname.startsWith(prefix)||!outputExists(url.pathname)))
      failures.push(name+": missing local asset "+raw);
  }
}
console.log("Checked "+files.length+" HTML pages, "+navCount+" menus, "+
  internal+" internal links, "+external+" external links.");
if(failures.length){
  console.error(failures.slice(0,100).join("\n"));
  throw Error(failures.length+" link/navigation checks failed");
}
console.log("All internal links resolve to files generated by Quartz.");
