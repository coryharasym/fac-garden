import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, join, relative, sep } from "node:path";
const root=resolve(process.argv[2]||"");
if(!process.argv[2]||!existsSync(root))throw Error("Pass Quartz public directory");
const base="https://coryharasym.github.io";
const prefix="/fac-garden/";
let checked=0;
const errors=[];
const pages=[];
function collect(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const file=join(dir,e.name);if(e.isDirectory())collect(file);else if(e.isFile()&&file.endsWith(".html"))pages.push(file)}}
collect(root);
if(!pages.length)throw Error("No generated HTML");
for(const file of pages){
 const name=relative(root,file).split(sep).join("/");
 const source=readFileSync(file,"utf8");
 if(source.includes("/fac-garden/fac-garden/"))errors.push(name+": duplicated base path");
 if(!source.includes('fac-site-nav') && name!=="404.html")errors.push(name+": navigation missing");
 const slug=name==="index.html"?"":name.endsWith("/index.html")?name.slice(0,-10):name;
 const current=new URL(prefix+slug,base);
 const anchors=source.match(/<a\b[^>]*href="[^"]*"[^>]*>/gi)||[];
 for(const tag of anchors){
   if(name!=="index.html"&&!tag.includes("fac-brand")&&!tag.includes("fac-site-nav")&&!tag.includes("fac-category-card")&&!tag.includes("aria-current"))continue;
   const match=tag.match(/\bhref="([^"]*)"/i);
   if(!match)continue;
   const href=match[1].replace(/&amp;/g,"&");
   if(!href || href.startsWith("#")||/^(mailto:|tel:|javascript:)/i.test(href))continue;
   const dest=new URL(href,current);
   if(dest.hostname!=="coryharasym.github.io")continue;
   checked++;
   if(!dest.pathname.startsWith(prefix)||dest.pathname.includes("/fac-garden/fac-garden/")){errors.push(name+": invalid link "+href+" => "+dest.pathname);continue;}
   const route=decodeURIComponent(dest.pathname.slice(prefix.length));
   const candidates=route.endsWith("/")?[join(root,route,"index.html")]:[join(root,route+".html"),join(root,route,"index.html"),join(root,route)];
   if(!candidates.some(p=>existsSync(p)&&statSync(p).isFile()))errors.push(name+": missing "+dest.pathname+" from "+href);
 }
}
console.log("FAC link check: "+pages.length+" HTML pages, "+checked+" links checked.");
if(errors.length){console.error(errors.slice(0,60).join("\n"));throw Error(errors.length+" link errors");}
console.log("All checked links resolve to generated site pages.");
