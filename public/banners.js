// Ротация заголовков реферальных баннеров Kraken и Starlink.
// Заголовок раздела остаётся в наборе, к нему добавляются общие варианты; при открытии — случайный, дальше смена каждые 15 с.
(function () {
  var lang = (document.documentElement.lang || 'ru').slice(0, 2);
  var POOL = {
    krb: {
      ru: [
        'Видишь сигнал на радаре? Курсы — с <b>Kraken</b>',
        'Торгуй на <b>Kraken</b> — бирже, с которой наш радар берёт котировки',
        'Биткоин за евро — на <b>Kraken</b>, бирже с лицензией MiCA в ЕС',
        'Радар следит за новостями. Котировки — с <b>Kraken</b>',
        'Нефть, ставки, геополитика двигают крипту. Следи за рынком на <b>Kraken</b>',
        'Kraken Pro для активной торговли — открой счёт на <b>Kraken</b>',
        'Одна из старейших криптобирж, с 2011 года — <b>Kraken</b>'
      ],
      de: [
        'Signal auf dem Radar? Kurse von <b>Kraken</b>',
        'Handle auf <b>Kraken</b> — der Börse, von der unser Radar die Kurse bezieht',
        'Bitcoin mit Euro kaufen — bei <b>Kraken</b>, mit MiCA-Lizenz in der EU',
        'Öl, Zinsen, Geopolitik bewegen Krypto. Den Markt verfolgen auf <b>Kraken</b>',
        'Kraken Pro für aktives Trading — Konto bei <b>Kraken</b> eröffnen',
        'Eine der ältesten Krypto-Börsen, seit 2011 — <b>Kraken</b>'
      ],
      en: [
        'See a signal on the radar? Prices from <b>Kraken</b>',
        'Trade on <b>Kraken</b> — the exchange our radar takes its prices from',
        'Buy bitcoin with euro on <b>Kraken</b>, MiCA-licensed in the EU',
        'Oil, rates and geopolitics move crypto. Follow the market on <b>Kraken</b>',
        'Kraken Pro for active trading — open a <b>Kraken</b> account',
        'One of the oldest crypto exchanges, since 2011 — <b>Kraken</b>'
      ]
    },
    slb: {
      ru: [
        'Новости — с любой точки планеты. Интернет <b>STARLINK</b> — тоже',
        'Интернет без кабеля: дача, кемпинг, дорога — <b>STARLINK</b>',
        'Смотри выпуски Давида хоть на краю карты — с <b>STARLINK</b>',
        'Спутники на низкой орбите — интернет <b>STARLINK</b> для дома и поездок',
        'Где не ловит мобильная сеть, работает <b>STARLINK</b>',
        'Антенна, розетка — и ты онлайн. Интернет <b>STARLINK</b>'
      ],
      de: [
        'Nachrichten — von überall auf der Welt. Internet von <b>STARLINK</b> — auch',
        'Internet ohne Kabel: Ferienhaus, Camping, unterwegs — <b>STARLINK</b>',
        'Davids Folgen sogar am Rand der Karte — mit <b>STARLINK</b>',
        'Wo das Mobilfunknetz endet, funktioniert <b>STARLINK</b>',
        'Antenne, Steckdose — und du bist online. Internet von <b>STARLINK</b>'
      ],
      en: [
        'News from anywhere on the planet. So is <b>STARLINK</b> internet',
        'Internet without cable: cottage, camping, on the road — <b>STARLINK</b>',
        'Watch David’s episodes even at the edge of the map — with <b>STARLINK</b>',
        'Where mobile signal ends, <b>STARLINK</b> works',
        'A dish, a socket — and you’re online. <b>STARLINK</b> internet'
      ]
    }
  };
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  function setup(cls) {
    var list = (POOL[cls] && (POOL[cls][lang] || POOL[cls].ru)) || [];
    document.querySelectorAll('aside.' + cls + ' h3').forEach(function (h, i) {
      var own = h.innerHTML.trim();
      var pool = [own].concat(list.filter(function (x) { return x.replace(/<[^>]+>/g, '') !== own.replace(/<[^>]+>/g, ''); }));
      if (pool.length < 2) return;
      var k = Math.floor(Math.random() * pool.length);
      h.innerHTML = pool[k];
      h.style.transition = 'opacity .45s ease';
      if (reduce) return;
      setTimeout(function () {
        setInterval(function () {
          if (document.hidden) return;
          h.style.opacity = '0';
          setTimeout(function () { k = (k + 1) % pool.length; h.innerHTML = pool[k]; h.style.opacity = '1'; }, 450);
        }, 15000);
      }, i * 2500); // баннеры на одной странице меняются не одновременно
    });
  }
  function run() { setup('krb'); setup('slb'); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
