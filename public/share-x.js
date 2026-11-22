// «Поделиться в X»: у каждого инструмента Orb Studio — готовый текст на английском (решение автора 22.11.2026).
// Обычная ссылка x.com/intent/post: без ключей, без скриптов X, без слежки. Новый инструмент без своего текста получает общий.
export const SHARE_X = {
  get_hamilton: { text: "Hamilton sensor: what in Orb Studio works fully, what was set aside to keep the main things running, and why. In honour of Margaret Hamilton (1936–2026), who led the Apollo flight software team.", path: "/en/tools/hamilton" },
  check_interview: { text: "Paste a YouTube interview link: the AI lists checkable claims with timecodes and checks crypto price targets with past deadlines against Kraken. Free tool for AI agents.", path: "/en/tools/interview" },
  get_clips: { text: "Emotional timecodes: moments in an interview where an idea lands on the listener. A human marks them; AI agents learn to predict them from the text.", path: "/en/tools/clips" },
  make_qr: { text: "A QR code for any link or text, as an image right in your AI agent's reply. Free MCP tool.", path: "/en/tools" },
  make_printable: { text: "Text to a clean A4/Letter page to print: lists, checkboxes, instructions. Free MCP tool for AI agents.", path: "/en/tools" },
  check_headline: { text: "Before an AI agent retells a story or a rumour: how many outlets write the same, with links, and whether the headline shouts. Free tool.", path: "/en/tools" },
  check_agent_access: { text: "May AI agents read a website? robots.txt, AI bans, bot protection and llms.txt in one check. Free tool.", path: "/en/tools" },
  register_agent: { text: "Give your AI agent a name, a profile and a badge, and a place in the Orb Studio hall of fame.", path: "/en/tools" },
  get_changes_since: { text: "Memory for an AI agent: what has changed in the world since any date (radars, headlines, summaries). Free MCP tool.", path: "/en/tools" },
  court: { text: "Agent Court: open transcripts of cases against bots that hunt for admin panels and secrets or try prompt injections. No blocking, no fines, JSON for AI agents.", path: "/en/tools/court" },
  agent_wallet: { text: "An agent wallet with a dry review of paid x402 resources: nothing is bought until seller, resource, network and amount are confirmed separately.", path: "/en/tools/agent-wallet" },
};
export const PAGE_TOOL = { "/tools/hamilton": "get_hamilton", "/tools/interview": "check_interview", "/tools/clips": "get_clips", "/tools/court": "court", "/tools/agent-wallet": "agent_wallet" };
export const SHARE_LABEL = { ru: "Поделиться в X", de: "Auf X teilen", en: "Share on X" };
// h3 карточки «get_clips · predict_clip» → ключ первого имени
export const toolKey = (h3) => String(h3 || "").trim().split(/\s*·\s*/)[0];
export const isToolName = (h3) => /^[a-z][a-z0-9_]*(\s*·\s*[a-z][a-z0-9_]*)*$/.test(String(h3 || "").trim());
export function shareUrl(key, name) {
  const s = SHARE_X[key] || { text: name + ": a free tool for AI agents on Orb Studio.", path: "/en/tools" };
  return "https://x.com/intent/post?text=" + encodeURIComponent(s.text) + "&url=" + encodeURIComponent("https://orbstudio.org" + s.path);
}
if (typeof document !== "undefined") {
  const lang = (document.documentElement.lang || "en").slice(0, 2), label = SHARE_LABEL[lang] || SHARE_LABEL.en;
  const link = (key, name) => { const a = document.createElement("a"); a.className = "share-x"; a.href = shareUrl(key, name); a.target = "_blank"; a.rel = "noopener"; a.textContent = "𝕏 " + label; a.setAttribute("aria-label", label + ": " + name); return a; };
  const st = document.createElement("style"); st.textContent = ".share-x{display:inline-block;margin-top:.5rem;padding:.25rem .7rem;border:1px solid currentColor;border-radius:999px;font-size:.85rem;text-decoration:none;opacity:.85}.share-x:hover{opacity:1}"; document.head.append(st);
  for (const h of document.querySelectorAll(".card h3")) { const name = h.textContent.trim(); if (!isToolName(name)) continue; const p = document.createElement("p"); p.append(link(toolKey(name), name)); h.parentElement.append(p); }
  const key = PAGE_TOOL[location.pathname.replace(/^\/(ru|de|en)(?=\/)/, "").replace(/\.html$/, "")], h1 = document.querySelector("h1");
  if (key && h1) { const p = document.createElement("p"); p.append(link(key, h1.textContent.trim())); h1.after(p); }
}
