// Validate source dates and the rendered catalogue, including Quartz's own lists.
import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
const root=resolve(process.argv[2]||"");
if(!process.argv[2])throw Error("Pass Quartz public directory");
const catalogue=JSON.parse(readFileSync(new URL("../data/fac-blog-posts.json",import.meta.url),"utf8"));
const failures=[];
const base="https://coryharasym.github.io/fac-garden/";
const format=new Intl.DateTimeFormat("en-US",{timeZone:"America/Edmonton",year:"numeric",month:"short",day:"2-digit"});
const calendar=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Edmonton",year:"numeric",month:"2-digit",day:"2-digit"});
const text=html=>html.replace(/<[^>]+>/g," ").replace(/\s+/g," ");
const index=JSON.parse(readFileSync(join(root,"static/contentIndex.json"),"utf8"));
const directory=readFileSync(join(root,"blog/index.html"),"utf8");
const tag=readFileSync(join(root,"tags/fac-blog.html"),"utf8");
const rows=new Map([...tag.matchAll(/<time datetime="([^"]+)">([^<]+)<\/time>[\s\S]*?<h3><a href="([^"]+)"/g)]
  .map(m=>[new URL(m[3],base+"tags/fac-blog").pathname.slice("/fac-garden/".length),{date:m[1],label:m[2]}]));
const catalogueLinks=new Set([...directory.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>new URL(m[1],base+"blog/").pathname));
if(catalogue.posts.length<79)failures.push("Expected at least 79 verified article entries");
for(const post of catalogue.posts){
  const file=join(root,post.path+".html");
  if(!existsSync(file)){failures.push(post.path+": article missing");continue;}
  const html=readFileSync(file,"utf8"), date=new Date(post.published);
  if(calendar.format(date)!==post.publicationDate)failures.push(post.path+": source calendar date mismatch");
  if(!text(html).includes("FAC publication date: "+post.publicationDate))failures.push(post.path+": displayed publication date mismatch");
  if(!html.includes('href="'+post.url+'"'))failures.push(post.path+": original FAC link missing");
  if(!catalogueLinks.has("/fac-garden/"+post.path))failures.push(post.path+": missing from blog directory");
  const row=rows.get(post.path);
  if(!row||new Date(row.date).getTime()!==date.getTime()||row.label!==format.format(date))
    failures.push(post.path+": Quartz list must use original FAC publication date in Calgary time");
  for(const theme of post.themes){
    if(!index[post.path]?.links.includes("topics/"+theme))failures.push(post.path+": related theme link missing: "+theme);
    const themeHtml=readFileSync(join(root,"topics",theme+".html"),"utf8");
    const links=[...themeHtml.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>new URL(m[1],base+"topics/"+theme).pathname);
    if(!links.includes("/fac-garden/"+post.path))failures.push(post.path+": theme must link back to article: "+theme);
  }
}
if(failures.length)throw Error(failures.join("\n"));
console.log(`Verified ${catalogue.posts.length} original FAC publication dates, source links, catalogue entries, and bidirectional theme connections.`);
