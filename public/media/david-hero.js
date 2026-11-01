// Orb Studio · Давид в главном эфире: видео-петля вместо робота + голос браузера (de-DE)
(function(){
  var st=document.getElementById('studio'), cv=document.getElementById('robotCv');
  if(!st||!cv) return;
  var v=document.createElement('video');
  v.className='davidvid'; v.src='/media/david-loop.mp4'; v.poster='/media/david-poster.jpg';
  v.muted=true; v.loop=true; v.autoplay=true; v.playsInline=true; v.preload='auto';
  v.setAttribute('muted',''); v.setAttribute('playsinline',''); v.setAttribute('aria-hidden','true');
  v.addEventListener('error',function(){ v.remove(); cv.style.visibility=''; });
  v.addEventListener('loadeddata',function(){ cv.style.visibility='hidden'; });
  cv.parentNode.insertBefore(v,cv.nextSibling);
  var p=v.play(); if(p&&p.catch) p.catch(function(){});

  var S=window.speechSynthesis;
  if(!S||typeof SpeechSynthesisUtterance==='undefined') return;
  var b=document.createElement('button');
  b.type='button'; b.className='btn davidtalk'; b.textContent='🔊 David, erzähl';
  st.appendChild(b);
  var NAMES={geo:'Geopolitik',politics:'Politik',economy:'Wirtschaft',budget:'Haushaltsbudget',crypto:'Krypto',energy:'Energie',web:'Internet'};
  var PREF=/Google Deutsch|Anna|Markus|Helena|Katja|Conrad|Petra|Yannick/i, playing=false;
  function voice(){ var vs=S.getVoices().filter(function(x){return /^de/i.test(x.lang);});
    return vs.filter(function(x){return PREF.test(x.name);})[0]||vs[0]||null; }
  function stop(){ playing=false; try{S.cancel();}catch(e){} b.textContent='🔊 David, erzähl'; }
  function say(list,i){ if(!playing) return; if(i>=list.length){ stop(); return; }
    var u=new SpeechSynthesisUtterance(list[i]); u.lang='de-DE'; u.rate=0.92; u.pitch=0.95;
    var vo=voice(); if(vo) u.voice=vo;
    u.onend=function(){ setTimeout(function(){ say(list,i+1); },350); };
    u.onerror=function(){ stop(); };
    S.speak(u); }
  function trend(d){ return d>=3?'steigend':d<=-3?'fallend':'stabil'; }
  b.addEventListener('click',function(){
    if(playing){ stop(); return; }
    playing=true; b.textContent='⏹ Stopp'; try{S.cancel();}catch(e){}
    var h=new Date().getHours();
    var lines=[(h<11?'Guten Morgen':h<18?'Guten Tag':'Guten Abend')+'. Hier ist David mit den Radaren von Orb Studio.'];
    fetch('/api/v1/radars').then(function(r){return r.json();}).then(function(d){
      var rs=(d&&d.radars||[]).filter(function(r){return NAMES[r.id]&&typeof r.risk_index==='number';});
      rs.sort(function(a,b){return b.risk_index-a.risk_index;});
      rs.slice(0,4).forEach(function(r){ lines.push(NAMES[r.id]+': '+r.risk_index+', '+trend(r.delta_24h||0)+'.'); });
    }).catch(function(){}).then(function(){
      var sy=document.getElementById('say'), t=sy&&sy.textContent.trim();
      if(t&&!/[а-яё]/i.test(t)) lines.push('Das Hauptthema: '+t.slice(0,220));
      lines.push('Das war der Überblick. Bis gleich.');
      say(lines,0);
    });
  });
})();
