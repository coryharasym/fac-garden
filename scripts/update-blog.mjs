// Rebuild the curated blog catalogue from verified FAC source metadata.
// Run from any directory: node scripts/update-blog.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const catalogue=JSON.parse(readFileSync(join(root,"data/fac-blog-posts.json"),"utf8"));
const posts=catalogue.posts;
const categories={"teaching-reflection":"Teaching & Reflection","stories":"Stories","community":"Community","life-at-fac":"Life at FAC","family-life":"Family Life","first-steps":"First Steps in Faith"};
const themes=Object.fromEntries(catalogue.themes.map(t=>[t.slug,t.title]));
const q=value=>JSON.stringify(value);
const text=value=>value.replace(/[\[\]<>|]/g,"");
const link=p=>`[[${p.path}|${text(p.title)}]]`;
const date=p=>p.publicationDate;
const row=p=>`- **${date(p)}** · ${link(p)} — ${p.summary}`;
const save=(path,body)=>{mkdirSync(dirname(join(root,path)),{recursive:true});writeFileSync(join(root,path),body);};
const paths=new Set(),urls=new Set();
for(const p of posts){
  if(!/^(blog|archive)\/[a-z0-9-]+$/.test(p.path)||paths.has(p.path)||urls.has(p.url))throw Error("Invalid or duplicate article "+p.path);
  if(!p.url.startsWith("https://www.faccalgary.com/post/")||!p.title||!p.summary)throw Error("Missing source information "+p.path);
  for(const field of ["published","modified"])
    if(!/^\d{4}-\d{2}-\d{2}T/.test(p[field])||!Number.isFinite(Date.parse(p[field])))throw Error("Invalid source date "+p.path);
  if(p.categories.some(c=>!categories[c])||p.themes.some(t=>!themes[t]))throw Error("Unknown category or theme "+p.path);
  paths.add(p.path);urls.add(p.url);
}
posts.sort((a,b)=>b.published.localeCompare(a.published)||a.title.localeCompare(b.title));
for(const p of posts){
  const labels=p.categories.map(c=>`[[blog/categories/${c}|${categories[c]}]]`).join(" · ");
  const related=p.themes.map(t=>`[[topics/${t}|${themes[t]}]]`).join(" · ");
  const notes=(p.notes??[]).map(n=>`[[${n}]]`).join(" · ");
  const updated=p.modifiedDate!==date(p)?` · **Updated at FAC:** ${p.modifiedDate}`:"";
  save(`content/${p.path}.md`,`---\ntitle: ${q(p.title)}\ndescription: ${q(p.summary)}\ndate: ${q(date(p))}\ncreated: ${q(p.published)}\npublished: ${q(p.published)}\nmodified: ${q(p.modified)}\nsource_url: ${q(p.url)}\nsource_verified: ${q(catalogue.verifiedOn)}\ntags:\n  - fac-blog\n${p.categories.map(c=>`  - ${c}\n`).join("")}---\n\n# ${text(p.title)}\n\n**FAC publication date:** ${date(p)}${updated}\n\n${labels?`**Browse by category:** ${labels}\n\n`:""}${p.summary}\n\n**[Read the original article on First Alliance Church’s website](${p.url})**\n\n## Related themes\n\n${related}\n\n${notes?`## Garden notes\n\n${notes}\n\n`:""}[[blog/index|All Blog & Stories]] · [[topics/index|Explore Topics]] · [[index|Home]]\n\n*This is a short independently curated catalogue entry. Original writing and attribution remain with FAC.*\n`);
}
const cards=Object.entries(categories).map(([slug,title])=>`  <a class="fac-category-card" href="/blog/categories/${slug}.html"><strong>${title.replace(/&/g,"&amp;")}</strong><span>${posts.filter(p=>p.categories.includes(slug)).length} articles →</span></a>`).join("\n");
save("content/blog/index.md",`---\ntitle: "FAC Blog & Stories"\ndescription: "Browse ${posts.length} FAC blog posts by original publication date, category, and theme."\ncssclasses:\n  - fac-curated-directory\n---\n\n# FAC Blog & Stories\n\n**Stories, teaching, and reflections from First Alliance Church Calgary.**\n\nExplore **${posts.length} articles**, with short original summaries and links to the full writing on [FAC’s official blog](https://www.faccalgary.com/blog). Choose a category, follow a [[topics/index|theme]], or browse the articles below.\n\nDates below are the **original FAC publication dates**, verified from each article’s publication metadata on ${catalogue.verifiedOn}. A later source update is shown separately on the article entry. This is a curated snapshot; new FAC posts are not added automatically.\n\n## Browse by category\n\n<div class="fac-category-grid">\n${cards}\n</div>\n\n## Most recent posts\n\n${posts.slice(0,10).map(row).join("\n")}\n\n## All articles — newest first\n\n${posts.map(row).join("\n")}\n\n[[topics/index|Explore major themes]] · [[first-steps/index|First Steps]] · [[archive/index|Resource Library]] · [[index|Home]]\n`);
for(const [slug,title] of Object.entries(categories)){
 const selected=posts.filter(p=>p.categories.includes(slug));
 save(`content/blog/categories/${slug}.md`,`---\ntitle: ${q(title+" — FAC Blog")}\ndescription: ${q(`Browse ${selected.length} FAC article summaries about ${title.toLowerCase()}.`)}\n---\n\n# ${title}\n\n**${selected.length} articles**, ordered by their original publication dates on FAC’s website. Follow an entry to read a short summary, explore related themes, and visit the original article.\n\n${selected.map(row).join("\n")}\n\n[[blog/index|All Blog & Stories]] · [[topics/index|Explore Topics]]\n`);
}
console.log(`Updated ${posts.length} dated articles, the blog directory, and ${Object.keys(categories).length} category pages.`);
