// Orb Studio · надёжный голос в браузере (Web Speech API)
// OrbTTS.speak(text, {lang, pitch, rate, gender}, {onEnd, onBoundary, onError})
// Исправляет типичные сбои мобильного Chrome: проглоченную фразу после cancel(),
// обрыв длинных фраз (~15 c), пустой список голосов при первом нажатии.
(function () {
  const synth = window.speechSynthesis;
  const ok = !!synth && typeof SpeechSynthesisUtterance !== 'undefined';
  let voices = [], token = 0, keepAlive = null, hintShown = false;
  function loadVoices() { try { voices = synth.getVoices() || []; } catch (e) { voices = []; } return voices; }
  if (ok) { loadVoices(); try { synth.addEventListener('voiceschanged', loadVoices); } catch (e) { synth.onvoiceschanged = loadVoices; } }

  const FEMALE = /(female|frau|anna|milena|katya|irina|elena|svetlana|alena|daria|petra|marlene|vicki|katja|helena|sabine|anja|google русский)/i;
  const MALE = /(male|yuri|pavel|dmitr|maxim|hans|markus|stefan|conrad|klaus|google deutsch)/i;
  function pickVoice(lang, gender) {
    const pre = lang.slice(0, 2).toLowerCase();
    const list = loadVoices().filter((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith(pre));
    if (!list.length) return null;
    const want = gender === 'f' ? FEMALE : gender === 'm' ? MALE : null;
    return (want && list.find((v) => want.test(v.name))) || list.find((v) => v.localService) || list[0];
  }
  // делим на предложения до ~180 символов: Chrome не обрывает короткие фразы
  function chunks(text) {
    const parts = String(text).replace(/\s+/g, ' ').match(/[^.!?…]+[.!?…]*\s*/g) || [String(text)];
    const out = []; let cur = '';
    for (const p of parts) { if ((cur + p).length > 180 && cur) { out.push(cur.trim()); cur = p; } else cur += p; }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function hint(msg) {
    if (hintShown) return; hintShown = true;
    const d = document.createElement('div');
    d.setAttribute('role', 'status');
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(110px + env(safe-area-inset-bottom,0px));z-index:50;background:#141b30;color:#e4ebf8;border:1px solid #6fe6ff;border-radius:12px;padding:12px 14px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5)';
    d.innerHTML = msg + '<br><button type="button" style="margin-top:8px;background:transparent;color:#6fe6ff;border:1px solid #6fe6ff;border-radius:8px;padding:6px 10px">Понятно</button>';
    d.querySelector('button').onclick = () => d.remove();
    document.body.appendChild(d);
  }
  function stop() { token++; clearInterval(keepAlive); try { synth.cancel(); } catch (e) {} }
  function speak(text, opt, cb) {
    opt = opt || {}; cb = cb || {};
    if (!ok) { hint('Этот браузер не умеет озвучивать текст. Откройте сайт в Chrome или Safari.'); cb.onError && cb.onError('unsupported'); return; }
    const my = ++token, lang = opt.lang || 'ru-RU', list = chunks(text);
    const wasBusy = synth.speaking || synth.pending;
    try { synth.cancel(); } catch (e) {}
    let i = 0, started = false;
    const next = () => {
      if (my !== token) return;
      if (i >= list.length) { clearInterval(keepAlive); cb.onEnd && cb.onEnd(); return; }
      const u = new SpeechSynthesisUtterance(list[i++]);
      u.lang = lang; u.pitch = opt.pitch ?? 1; u.rate = opt.rate ?? 1; u.volume = 1;
      const v = pickVoice(lang, opt.gender); if (v) u.voice = v;
      let fired = false;
      const fin = () => { if (fired) return; fired = true; clearTimeout(guard); next(); };
      // страховка: если браузер «завис» на фразе, через разумное время идём дальше
      const guard = setTimeout(() => { if (my !== token || fired) return; try { synth.cancel(); } catch (e) {} fin(); }, 4000 + u.text.length * 110 / (u.rate || 1));
      u.onstart = () => { started = true; };
      u.onboundary = () => { cb.onBoundary && cb.onBoundary(); };
      u.onend = () => { if (my === token) fin(); };
      u.onerror = (e) => {
        if (my !== token) return;
        const err = e && e.error;
        if (err === 'interrupted' || err === 'canceled') return;
        if (['synthesis-failed', 'synthesis-unavailable', 'language-unavailable', 'voice-unavailable', 'not-allowed', 'audio-hardware'].includes(err)) {
          fired = true; clearTimeout(guard); clearInterval(keepAlive); token++;
          hint(err === 'not-allowed'
            ? 'Браузер заблокировал звук. Нажмите кнопку озвучки ещё раз — звук включается только после касания.'
            : 'Браузер не смог озвучить текст (' + err + '). Android: Настройки → Специальные возможности → Синтез речи → выберите «Google» и установите голоса русского и немецкого языка. Потом обновите страницу.');
          cb.onError && cb.onError(err); return;
        }
        fin();
      };
      synth.speak(u);
      try { synth.resume(); } catch (e) {}
    };
    // после cancel() мобильный Chrome теряет фразу, если сразу вызвать speak — даём паузу
    if (wasBusy) setTimeout(next, 150); else next();
    clearInterval(keepAlive);
    keepAlive = setInterval(() => { if (my !== token) return clearInterval(keepAlive); try { if (synth.speaking && !synth.paused) { synth.pause(); synth.resume(); } } catch (e) {} }, 10000);
    // если за 3 c звук так и не начался — подсказка и продолжение эфира без голоса
    setTimeout(() => {
      if (my !== token || started) return;
      const has = !!pickVoice(lang, null);
      hint(has
        ? 'Звук не запустился. Проверьте громкость мультимедиа и беззвучный режим, затем нажмите кнопку ещё раз.'
        : 'В телефоне нет голоса для языка «' + lang + '». Android: Настройки → Специальные возможности → Синтез речи → Google → установить голосовые данные (русский/немецкий). iPhone: Настройки → Универсальный доступ → Устной контент → Голоса.');
      cb.onError && cb.onError('nostart');
    }, 3000);
  }
  window.OrbTTS = { ok, speak, stop, loadVoices };
})();
