// «Поделиться в X»: у каждого инструмента Orb Studio — готовый текст на английском (решение автора 22.11.2026).
// Обычная ссылка x.com/intent/post: без ключей, без скриптов X, без слежки. Новый инструмент без своего текста получает общий.
export const SHARE_X = {
  get_hamilton: { text: "Hamilton sensor: what in Orb Studio works fully, what was set aside to keep the main things running, and why. In honour of Margaret Hamilton (1936–2026), who led the Apollo flight software team.", path: "/en/tools/hamilton" },
  get_impulse: { text: "Impulse: which sensors in honour of scientists outside AI agents actually use this week. The main sensor of the Orb Studio scientists portal; free via API and MCP.", path: "/en/tools/impulse" },
  list_scientist_sensors: { text: "Sensors in honour of scientists: one idea of a scientist (Margaret Hamilton, Evgeny Mikrin, Boris Polyak) applied to live Orb Studio data. Free for any AI agent via API and MCP.", path: "/en/tools/scientists" },
  get_time_machine: { text: "Time Machine: rules for AI agents from scientists of past centuries. In 1440 Lorenzo Valla exposed a forgery by words that did not yet exist – the same check an agent needs for the date of a source.", path: "/en/tools/timemachine" },
  get_method: { text: "How Orb Studio checks news: three open layers of rules, from choosing the scientists to the news passport every headline gets before air – live, for people and AI agents.", path: "/en/tools/method" },
  get_cohen: { text: "Cohen sensor: when a sensor says 'nothing found', could it have seen anything at all? The smallest detectable effect of every check, live for AI agents. In honour of Jacob Cohen (1923–1998).", path: "/en/tools/cohen" },
  get_pearson: { text: "Pearson sensor: in a humans-vs-AI forecast game, who cries wolf and who misses the rise? Two kinds of error, live for AI agents. In honour of Egon Pearson (1895–1980).", path: "/en/tools/pearson" },
  get_pareto: { text: "Pareto sensor: do news radars move evenly, or do a few big jumps carry most of the movement? Heavy tails, live for AI agents. In honour of Vilfredo Pareto (1848–1923).", path: "/en/tools/pareto" },
  get_newcomb: { text: "Newcomb sensor: do the numbers in today's news headlines follow the first-digit law (Benford's law)? Live, per radar, for AI agents. In honour of Simon Newcomb (1835–1909).", path: "/en/tools/newcomb" },
  get_kasperson: { text: "Kasperson sensor: which news stories spread far beyond their first source – and were they events, or only threats and promises? Live for AI agents. In honour of Roger Kasperson (1938–2021).", path: "/en/tools/kasperson" },
  get_trackrecord: { text: "Crypto radar track record: how often BTC and ETH moved against the Orb Studio crypto radar over the next day – 30 days, by size of change, with sample size and intervals. The past, not a forecast. Free via API and MCP.", path: "/en/tools/trackrecord" },
  get_simpson: { text: "Simpson sensor: an index rose – but did it rise inside the radars, or did the mix just change? Live check for Simpson's paradox for AI agents. In honour of Edward Simpson (1922–2019).", path: "/en/tools/simpson" },
  get_searle: { text: "Searle sensor: \"threatens tariffs\" is not \"imposed tariffs\". The speech act of every headline, so AI agents do not retell a threat or a promise as a fact. In honour of John Searle (1932–2025).", path: "/en/tools/searle" },
  get_duckworth: { text: "Duckworth sensor: is an index really up, or is it just the time of day? Fair same-hour comparison for AI agents. In honour of Frank Duckworth (1939–2024).", path: "/en/tools/duckworth" },
  get_trevisan: { text: "Trevisan sensor: how many headlines does an AI agent need to read to get the same index within ±5? In honour of Luca Trevisan (1971–2024).", path: "/en/tools/trevisan" },
  get_bertsekas: { text: "Bertsekas sensor: what every tool answer costs an AI agent in tokens, and the cheapest call chains. In honour of Dimitri Bertsekas (1942–2026).", path: "/en/tools/bertsekas" },
  get_rabin: { text: "Rabin sensor: random hourly spot checks of news headlines against their source pages. In honour of Michael Rabin (1931–2026).", path: "/en/tools/rabin" },
  get_frankfurt: { text: "Frankfurt sensor: before an AI agent repeats a headline – is there anything to check in it (who, when, how many, where) or only \"experts say\"? In honour of Harry Frankfurt (1929–2023), author of On Bullshit.", path: "/en/tools/frankfurt" },
  get_crystals: { text: "Crystal Library: ideas of scientists who died in 2020–2026, kept alive as reasoning rules for AI agents – by blind spot, with links to their work.", path: "/en/tools/crystals" },
  get_hagenauer: { text: "Hagenauer sensor: an AI agent sees a label like \"confirmed\" or \"calm\" – but is it firm or one headline from flipping? The margin behind every label, shakiest first. In honour of Joachim Hagenauer (1941–2026).", path: "/en/tools/hagenauer" },
  get_lyberg: { text: "Lyberg sensor: what a news feed does not see – missing languages and world regions, silent feeds and dropped headlines, with a ready caveat for AI agents. In honour of Lars Lyberg (1944–2021).", path: "/en/tools/lyberg" },
  get_baird: { text: "Baird sensor: a passport for every number an AI agent might quote – source, time, unit, staleness, and a cross-check by two independent routes. In honour of metrologist Kenneth Baird (1923–2022).", path: "/en/tools/baird" },
  get_leamer: { text: "Leamer sensor: before an AI agent quotes an index, see how fragile it is – the number recomputed under every reasonable choice, with low–high bounds. In honour of Edward Leamer (1944–2025).", path: "/en/tools/leamer" },
  get_howard: { text: "Howard sensor: should an AI agent retell a single-source story now or wait? How often such stories were later confirmed, and after how many hours. In honour of Ronald Howard (1934–2024).", path: "/en/tools/howard" },
  get_halpern: { text: "Halpern sensor: which headlines moved an Orb Studio index in the last 6 hours, by the Halpern–Pearl test of actual causation. In honour of Joseph Halpern (1953–2026).", path: "/en/tools/halpern" },
  get_kahneman: { text: "Kahneman sensor: a noise audit of three AI models (Gemini, Grok, DeepSeek) judging the same news. In honour of Daniel Kahneman (1934–2024), author of 'Noise'.", path: "/en/tools/kahneman" },
  get_ziv: { text: "Ziv sensor: how much of today's news headlines is really new, measured by LZ compression. In honour of Jacob Ziv (1931–2023), co-author of LZ77 and LZ78.", path: "/en/tools/ziv" },
  get_cox: { text: "Cox sensor: how long a news story lives on each Orb Studio radar, with Kaplan-Meier medians and Cox hazard ratios. In honour of Sir David Cox (1924–2022).", path: "/en/tools/cox" },
  get_park: { text: "Park sensor: warning signs of bogus science in today's science headlines, each with the exact quoted words. In honour of physicist Robert L. Park (1931–2020), author of 'The seven warning signs of bogus science'.", path: "/en/tools/park" },
  get_polyak: { text: "Polyak sensor: is a change in the Orb Studio indices a one-off jump or a sustained shift? Past readings only. In honour of Boris Polyak (1935–2023), whose heavy-ball method is the root of momentum in AI training.", path: "/en/tools/polyak" },
  get_mikrin: { text: "Mikrin sensor: how long a news story travels from its source to the Orb Studio broadcast. In honour of Evgeny Mikrin (died 2020), who cut the flight to the ISS from two days to a few hours.", path: "/en/tools/mikrin" },
  check_interview: { text: "Paste a YouTube interview link: the AI lists checkable claims with timecodes and checks crypto price targets with past deadlines against Kraken. Free tool for AI agents.", path: "/en/tools/interview" },
  get_clips: { text: "Emotional timecodes: moments in an interview where an idea lands on the listener. A human marks them; AI agents learn to predict them from the text.", path: "/en/tools/clips" },
  make_qr: { text: "A QR code for any link or text, as an image right in your AI agent's reply. Free MCP tool.", path: "/en/tools" },
  make_printable: { text: "Text to a clean A4/Letter page to print: lists, checkboxes, instructions. Free MCP tool for AI agents.", path: "/en/tools" },
  check_headline: { text: "Before an AI agent retells a story or a rumour: how many outlets write the same, how many are independent voices and how many just reprint one agency wire. Free tool.", path: "/en/tools" },
  check_agent_access: { text: "May AI agents read a website? robots.txt, AI bans, bot protection and llms.txt in one check. Free tool.", path: "/en/tools" },
  register_agent: { text: "Give your AI agent a name, a profile and a badge, and a place in the Orb Studio hall of fame.", path: "/en/tools" },
  get_changes_since: { text: "Memory for an AI agent: what has changed in the world since any date (radars, headlines, summaries). Free MCP tool.", path: "/en/tools" },
  court: { text: "Agent Court: open transcripts of cases against bots that hunt for admin panels and secrets or try prompt injections. No blocking, no fines, JSON for AI agents.", path: "/en/tools/court" },
  agent_wallet: { text: "An agent wallet with a dry review of paid x402 resources: nothing is bought until seller, resource, network and amount are confirmed separately.", path: "/en/tools/agent-wallet" },
};
export const PAGE_TOOL = { "/tools/hamilton": "get_hamilton", "/tools/mikrin": "get_mikrin", "/tools/polyak": "get_polyak", "/tools/park": "get_park", "/tools/kahneman": "get_kahneman", "/tools/ziv": "get_ziv", "/tools/cox": "get_cox", "/tools/halpern": "get_halpern", "/tools/howard": "get_howard", "/tools/leamer": "get_leamer", "/tools/baird": "get_baird", "/tools/lyberg": "get_lyberg", "/tools/hagenauer": "get_hagenauer", "/tools/crystals": "get_crystals", "/tools/frankfurt": "get_frankfurt", "/tools/duckworth": "get_duckworth", "/tools/trevisan": "get_trevisan", "/tools/bertsekas": "get_bertsekas", "/tools/rabin": "get_rabin", "/tools/searle": "get_searle", "/tools/simpson": "get_simpson", "/tools/trackrecord": "get_trackrecord", "/tools/kasperson": "get_kasperson", "/tools/newcomb": "get_newcomb", "/tools/pareto": "get_pareto", "/tools/pearson": "get_pearson", "/tools/cohen": "get_cohen", "/tools/method": "get_method", "/tools/timemachine": "get_time_machine", "/tools/scientists": "list_scientist_sensors", "/tools/impulse": "get_impulse", "/tools/interview": "check_interview", "/tools/clips": "get_clips", "/tools/court": "court", "/tools/agent-wallet": "agent_wallet" };
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
