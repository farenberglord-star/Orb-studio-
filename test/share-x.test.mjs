import test from "node:test"; import assert from "node:assert/strict"; import { readFileSync, readdirSync } from "node:fs";
import { SHARE_X, PAGE_TOOL, shareUrl, toolKey, isToolName } from "../public/share-x.js";
test("every tool can be shared on X with an English text", () => {
  for (const p of ["tools.html", "de/tools.html", "en/tools.html"]) { const h = readFileSync(new URL("../public/" + p, import.meta.url), "utf8");
    assert.match(h, /<script type="module" src="\/share-x\.js"><\/script>/, p);
    for (const m of h.matchAll(/<h3>([^<]+)<\/h3>/g)) if (isToolName(m[1])) assert.ok(SHARE_X[toolKey(m[1])], "tool " + m[1] + " on " + p + " has its own English text"); }
  for (const [path, key] of Object.entries(PAGE_TOOL)) { assert.ok(SHARE_X[key], key);
    for (const pre of ["", "/de", "/en"]) assert.match(readFileSync(new URL("../public" + pre + path + ".html", import.meta.url), "utf8"), /src="\/share-x\.js"/, pre + path); }
  for (const [k, s] of Object.entries(SHARE_X)) { assert.ok(s.text.length + 24 <= 280, k + " fits a post"); assert.ok(!/[а-яё]|[äöüß]/i.test(s.text), k + " is in English"); assert.match(s.path, /^\/en\//); }
  const u = new URL(shareUrl("get_hamilton", "get_hamilton")); assert.equal(u.origin + u.pathname, "https://x.com/intent/post"); assert.match(u.searchParams.get("url"), /^https:\/\/orbstudio\.org\/en\/tools\/hamilton$/);
  assert.match(new URL(shareUrl("new_tool", "new_tool")).searchParams.get("text"), /new_tool: a free tool for AI agents/, "a new tool without its own text still gets one");
  assert.equal(toolKey("get_clips · predict_clip"), "get_clips"); assert.ok(isToolName("make_qr")); assert.ok(!isToolName("🖨 Принтер"));
});
