#!/usr/bin/env python3
# Наше правило: на каждой странице Orb Studio — баннеры Kraken и Starlink.
# Вставляет готовый набор (стили, два баннера, живые курсы, копирование кода) в русскую страницу.
# Запуск: python3 tools/add_banners.py <страница без .html> <from-метка> [маркер] ; потом python3 tools/i18n_pages.py <страница>
import sys, os
ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
CSS = """<style>
.krb,.slb{--mono:"JetBrains Mono",ui-monospace,monospace;--display:"Chakra Petch",system-ui,sans-serif;--up:#4fd8a4;--hot:#ff5d7a;display:block;margin-block:18px}
.krb{position:relative;overflow:hidden;border-radius:16px;padding:18px;border:1px solid rgba(155,140,255,.45);
  background:radial-gradient(120% 90% at 100% 0%,rgba(155,140,255,.28) 0%,transparent 55%),radial-gradient(90% 80% at 0% 100%,rgba(95,227,255,.14) 0%,transparent 60%),linear-gradient(160deg,#120f2e 0%,#0b1226 60%,#070b16 100%);color:#e6e9fb}
.krb-eye{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:#b9aeff;text-transform:uppercase}
.krb h3{font-family:var(--display);font-size:clamp(19px,3.4vw,24px);line-height:1.2;margin:6px 0 4px;max-width:30ch;color:#f4f2ff}
.krb h3 b{color:#b9aeff}
.krb-sub{color:#a3a9c9;font-size:13.5px;margin:0;max-width:60ch}
.krb-px{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 12px}
.krb-px span{font-family:var(--mono);font-size:12px;background:rgba(7,11,22,.65);border:1px solid rgba(155,140,255,.3);border-radius:999px;padding:5px 10px;font-variant-numeric:tabular-nums;white-space:nowrap}
.krb-px i{font-style:normal;margin-left:6px}.krb-px .up{color:var(--up)}.krb-px .dn{color:var(--hot)}
.krb-cta{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.krb-go{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-family:var(--display);font-weight:700;letter-spacing:.04em;font-size:15px;color:#0b0820;background:linear-gradient(90deg,#b9aeff,#8f7dff);border-radius:10px;padding:11px 16px}
.krb-go:hover,.krb-go:focus-visible{filter:brightness(1.08);outline:2px solid #e6e1ff;outline-offset:2px}
.krb-code{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:13px;color:#e6e1ff;background:rgba(7,11,22,.7);border:1px dashed rgba(185,174,255,.6);border-radius:10px;padding:9px 12px;cursor:pointer}
.krb-note{color:#8a8fae;font-size:11px;line-height:1.5;margin:12px 0 0;max-width:80ch}
.slb{position:relative;overflow:hidden;border-radius:16px;margin-block:18px;padding:18px;border:1px solid rgba(220,228,240,.4);
  background:radial-gradient(120% 90% at 100% 0%,rgba(220,228,240,.18) 0%,transparent 55%),radial-gradient(90% 80% at 0% 100%,rgba(111,230,255,.10) 0%,transparent 60%),linear-gradient(160deg,#0d1117 0%,#0a0f1a 60%,#05070c 100%);color:#e8edf5}
.slb::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 4px)}
.slb svg.slb-orbit{position:absolute;right:-50px;top:-40px;width:240px;height:240px;opacity:.6;pointer-events:none}
.slb svg.slb-orbit .sat{transform-origin:120px 120px;animation:slbspin 14s linear infinite}
@keyframes slbspin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.slb svg.slb-orbit .sat{animation:none}}
.slb>*{position:relative}
.slb-eye{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:10.5px;letter-spacing:.16em;color:#c9d4e6;text-transform:uppercase}
.slb h3{font-family:"Chakra Petch",system-ui,sans-serif;font-size:clamp(19px,3.4vw,24px);line-height:1.2;margin:6px 0 4px;max-width:28ch;text-wrap:balance;color:#fff}
.slb h3 b{color:#dfe8f5;letter-spacing:.06em}
.slb-sub{color:#a7b1c4;font-size:13.5px;margin:0;max-width:60ch}
.slb-facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:14px 0;padding:0;list-style:none}
@media (max-width:640px){.slb-facts{grid-template-columns:repeat(2,minmax(0,1fr))}}
.slb-facts li{background:rgba(5,8,14,.6);border:1px solid rgba(220,228,240,.16);border-radius:10px;padding:9px 10px;min-width:0}
.slb-facts b{display:block;font-family:"Chakra Petch",system-ui,sans-serif;font-size:16px;color:#fff}
.slb-facts span{font-size:11.5px;color:#a7b1c4}
.slb-go{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-family:"Chakra Petch",system-ui,sans-serif;font-weight:700;letter-spacing:.04em;font-size:15px;color:#05070c;background:linear-gradient(90deg,#ffffff,#c9d4e6);border-radius:10px;padding:11px 16px;box-shadow:0 8px 24px -10px rgba(220,228,240,.6)}
.slb-go:hover,.slb-go:focus-visible{filter:brightness(1.05);outline:2px solid #fff;outline-offset:2px}
.slb-note{color:#8790a3;font-size:11px;line-height:1.5;margin:12px 0 0;max-width:80ch}
</style>
"""
ASIDE = """<aside class="krb" aria-label="Kraken — реферальная ссылка Orb Studio">
    <div class="krb-eye">Партнёр Orb Studio · реферальная ссылка</div>
    <h3>Радар не спит — и крипто-рынок тоже. Торговать — на <b>Kraken</b></h3>
    <p class="krb-sub">Криптобиржа Kraken: покупка биткоина за евро, Kraken Pro для активной торговли, стейкинг. Котировки крипто-радара Orb Studio — с Kraken API.</p>
    <div class="krb-px" data-krpx><span>BTC/EUR <i>—</i></span><span>ETH/EUR <i>—</i></span><span>XRP/EUR <i>—</i></span></div>
    <div class="krb-cta">
      <a class="krb-go" href="/go/kraken?from=court" target="_blank" rel="sponsored noopener">Открыть счёт на Kraken ↗</a>
      <button class="krb-code" type="button" data-code="ghqspfzq" aria-label="Скопировать реферальный код ghqspfzq">код <b>ghqspfzq</b> ⧉</button>
    </div>
    <p class="krb-note">Реферальная ссылка: Orb Studio может получить вознаграждение. Новому клиенту Kraken может начислить бонус при выполнении условий биржи; бонус не гарантирован, условия — на kraken.com. Не инвестиционный совет. Криптоактивы волатильны, возможна потеря средств.</p>
  </aside>
  <aside class="slb" aria-label="Starlink — реферальная ссылка Orb Studio">
    <svg class="slb-orbit" viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="34" fill="#c9d4e6" fill-opacity=".10" stroke="#c9d4e6" stroke-opacity=".5"/><ellipse cx="120" cy="120" rx="100" ry="38" fill="none" stroke="#c9d4e6" stroke-opacity=".3" transform="rotate(-20 120 120)"/><ellipse cx="120" cy="120" rx="80" ry="80" fill="none" stroke="#c9d4e6" stroke-opacity=".15" stroke-dasharray="3 6"/><g class="sat"><circle cx="200" cy="120" r="4" fill="#fff"/><rect x="192" y="117" width="5" height="6" fill="#c9d4e6"/><rect x="203" y="117" width="5" height="6" fill="#c9d4e6"/></g></svg>
    <div class="slb-eye">Партнёр Orb Studio · реферальная ссылка</div>
    <h3>Слушай «Радар не спит» хоть в лесу — с интернетом <b>STARLINK</b></h3>
    <p class="slb-sub">Спутниковый интернет SpaceX для дома, дачи, кемпинга и поездок. Работает там, где нет кабеля и стабильной мобильной связи.</p>
    <ul class="slb-facts">
      <li><b>LEO</b><span>спутники на низкой орбите</span></li>
      <li><b>без кабеля</b><span>антенна и розетка</span></li>
      <li><b>дом и поездки</b><span>тарифы на выбор</span></li>
      <li><b>DE · EU</b><span>доступен в Германии</span></li>
    </ul>
    <a class="slb-go" href="/go/starlink?from=court" target="_blank" rel="sponsored noopener">Подключить Starlink ↗</a>
    <p class="slb-note">Реферальная ссылка: Orb Studio может получить вознаграждение. Бонусы для новых клиентов зависят от действующей программы Starlink и не гарантированы; цены и условия — на starlink.com.</p>
  </aside>"""
JS = """<script>
(function(){
function krFill(market){if(!market)return;const map={BTC:/XBT/,ETH:/ETH/,XRP:/XRP/};
 document.querySelectorAll('[data-krpx]').forEach(box=>{box.innerHTML=Object.entries(map).map(([n,re])=>{const k=Object.keys(market).find(x=>re.test(x));if(!k)return'';
  const m=market[k],ch=m.change_pct;return `<span>${n}/EUR ${Number(m.last).toLocaleString('de-DE',{maximumFractionDigits:m.last<10?4:0})} € <i class="${ch>=0?'up':'dn'}">${ch>=0?'▲':'▼'} ${Math.abs(ch).toFixed(2).replace(".",",")}%</i></span>`;}).join('')||box.innerHTML;});}
fetch('/api/v1/radar/crypto').then(r=>r.ok?r.json():null).then(d=>{if(d)krFill(d.market)}).catch(()=>{});
const L=(document.documentElement.lang||'ru').slice(0,2),OK={ru:'скопировано ✓',de:'kopiert ✓',en:'copied ✓'}[L]||'copied ✓';
document.addEventListener('click',e=>{const b=e.target.closest('.krb-code');if(!b)return;const t=b.innerHTML;
 try{navigator.clipboard.writeText(b.dataset.code).then(()=>{b.innerHTML=OK;setTimeout(()=>b.innerHTML=t,1600)})}catch(err){}});
})();
</script>
<script src="/banners.js" defer></script>
"""
def main(page, tag, marker=None):
    p = os.path.join(ROOT, page + ".html"); s = open(p, encoding="utf-8").read()
    if 'class="krb"' in s: print(page, "— баннеры уже есть"); return
    s = s.replace("</head>", CSS + "</head>", 1)
    block = "\n" + ASIDE.replace("from=court", "from=" + tag) + "\n"
    if marker and marker in s: s = s.replace(marker, block + marker, 1)
    else: s = s.replace("</body>", block + "</body>", 1)
    if "/banners.js" not in s: s = s.replace("</body>", JS + "</body>", 1)
    open(p, "w", encoding="utf-8").write(s); print(page, "— баннеры добавлены")
if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
