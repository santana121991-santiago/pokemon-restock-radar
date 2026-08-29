import fs from "node:fs/promises";
import crypto from "node:crypto";

const monitors = JSON.parse(await fs.readFile("monitors.json", "utf8"));
let state = {};
try { state = JSON.parse(await fs.readFile("state.json", "utf8")); } catch {}

const topic = process.env.NTFY_TOPIC;
const now = Date.now();
const cooldownMs = 6 * 60 * 60 * 1000;
const positive = ["add to cart", "ship it", "shipping available", "available for pickup", "pick it up", "in stock"];
const negative = ["out of stock", "sold out", "currently unavailable", "not available"];

function clean(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}
function hash(text) { return crypto.createHash("sha256").update(text).digest("hex"); }
async function notify(item, title, message) {
  if (!topic) { console.log("NTFY_TOPIC is not configured; alert skipped."); return; }
  const response = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {method:"POST",headers:{"Title":title,"Priority":"high","Tags":"rotating_light,shopping_cart","Click":item.url},body:message});
  if (!response.ok) throw new Error(`ntfy returned ${response.status}`);
}

for (const item of monitors) {
  const key = hash(item.url).slice(0, 16);
  const previous = state[key] || {};
  try {
    const response = await fetch(item.url, {redirect:"follow",headers:{"user-agent":"Mozilla/5.0 (compatible; SamsPokeRadar/1.0; personal availability monitor)","accept-language":"en-US,en;q=0.9"},signal:AbortSignal.timeout(20000)});
    if (!response.ok) { console.log(`${item.store}: HTTP ${response.status}; leaving prior state unchanged`); continue; }
    const text = clean(await response.text());
    const hasKeyword = item.keywords.some(k => text.includes(k.toLowerCase()));
    const hasPositive = positive.some(k => text.includes(k));
    const hasNegative = negative.some(k => text.includes(k));
    const available = hasKeyword && hasPositive && !hasNegative;
    const currentHash = hash(text);
    const changed = previous.contentHash && previous.contentHash !== currentHash;
    const cooledDown = !previous.lastAlertAt || now - previous.lastAlertAt > cooldownMs;
    const firstRun = !previous.checkedAt;
    let shouldAlert = false;
    if (!firstRun && item.mode === "availability" && available && previous.available === false) shouldAlert = true;
    if (!firstRun && item.mode === "discovery" && available && changed && cooledDown) shouldAlert = true;
    if (shouldAlert) {
      await notify(item, `Pokémon alert: ${item.store}`, `${item.name} may be available. Tap to check out now.`);
      previous.lastAlertAt = now;
      console.log(`ALERT: ${item.name}`);
    } else console.log(`${item.name}: ${available ? "possible stock" : "not confirmed"}${firstRun ? " (baseline saved)" : ""}`);
    state[key] = {...previous,name:item.name,store:item.store,url:item.url,available,contentHash:currentHash,checkedAt:now};
  } catch (error) { console.log(`${item.name}: check failed (${error.message}); leaving prior state unchanged`); }
}

await fs.writeFile("state.json", JSON.stringify(state, null, 2) + "\n");
