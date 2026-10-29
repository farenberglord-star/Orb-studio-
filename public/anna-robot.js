// Анна — робот-ведущая главного эфира Orb Studio (Three.js r128).
// AnnaRobot.init(canvas, getState) → true, если 3D запустилось; getState() → {talking, lvl, sev}
(function () {
  function init(cv, getState) {
    if (!window.THREE) return false;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); }
    catch (e) { return false; }
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(1.75, devicePixelRatio || 1));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 30);
    const V2 = (a) => a.map(([r, y]) => new THREE.Vector2(r, y));

    // свет: студийный ключ + голубой и фиолетовый контур
    scene.add(new THREE.HemisphereLight(0xb8c8ff, 0x0b0e1a, .6));
    const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-1.8, 2.8, 3); scene.add(key);
    const rimC = new THREE.PointLight(0x6fe6ff, 2.4, 5); rimC.position.set(1.3, 2.1, -.9); scene.add(rimC);
    const rimP = new THREE.PointLight(0x9b8cff, 1.8, 5); rimP.position.set(-1.4, 1.6, -.8); scene.add(rimP);
    const faceL = new THREE.PointLight(0x6fe6ff, .7, 1); scene.add(faceL);

    const pearl = new THREE.MeshStandardMaterial({ color: 0xf1f3fa, metalness: .25, roughness: .2 });
    const navy = new THREE.MeshStandardMaterial({ color: 0x1c2a55, metalness: .4, roughness: .32 });
    const hairM = new THREE.MeshStandardMaterial({ color: 0x8476dc, metalness: .8, roughness: .22 });
    const graphite = new THREE.MeshStandardMaterial({ color: 0x262d3d, metalness: .7, roughness: .35 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x04060c, metalness: .2, roughness: .05 });
    const glow = new THREE.MeshBasicMaterial({ color: 0x6fe6ff });

    const add = (geo, mat, parent, pos, rot, sc) => { const m = new THREE.Mesh(geo, mat); if (pos) m.position.set(...pos); if (rot) m.rotation.set(...rot); if (sc) m.scale.set(...sc); parent.add(m); return m; };
    const pivot = (parent, pos) => { const g = new THREE.Group(); g.position.set(...pos); parent.add(g); return g; };

    const robot = new THREE.Group(); scene.add(robot);
    // ---- торс: силуэт с талией, жакет с V-вырезом ----
    const torso = pivot(robot, [0, .9, 0]);
    const torsoP = [[0, 0], [.15, 0], [.14, .08], [.125, .18], [.135, .27], [.165, .35], [.195, .43], [.2, .47], [.165, .52], [.07, .55], [0, .55]];
    add(new THREE.LatheGeometry(V2(torsoP), 48), pearl, torso, null, null, [1, 1, .72]);
    const jacketP = [[.155, .02], [.145, .1], [.13, .18], [.14, .27], [.17, .35], [.2, .43], [.206, .47], [.172, .52]];
    add(new THREE.LatheGeometry(V2(jacketP), 48, .42, Math.PI * 2 - .84), navy, torso, null, null, [1.04, 1, .76]);
    add(new THREE.TorusGeometry(.072, .007, 10, 40), glow, torso, [0, .545, 0], [Math.PI / 2, 0, 0]);
    // светящаяся брошь-ядро
    const core = add(new THREE.TorusGeometry(.022, .006, 10, 30), glow, torso, [.09, .4, .145], [0, .5, 0]);
    // ---- шея и голова ----
    const neck = pivot(torso, [0, .55, 0]);
    add(new THREE.CylinderGeometry(.038, .046, .13, 24), pearl, neck, [0, .06, 0]);
    add(new THREE.TorusGeometry(.04, .005, 8, 30), graphite, neck, [0, .1, 0], [Math.PI / 2, 0, 0]);
    const head = pivot(neck, [0, .33, 0]);
    const headP = [[0, -.205], [.06, -.198], [.11, -.165], [.145, -.09], [.16, -.01], [.158, .07], [.142, .14], [.105, .195], [.05, .222], [0, .228]];
    add(new THREE.LatheGeometry(V2(headP), 48), pearl, head, null, null, [1, 1, .95]);
    // визор и лицо-экран
    add(new THREE.SphereGeometry(.163, 48, 32, Math.PI / 2 - .85, 1.7, Math.PI * .33, Math.PI * .34), glass, head, [0, -.005, .006], null, [1, 1.12, .98]);
    const faceC = document.createElement('canvas'); faceC.width = 512; faceC.height = 256; const fx = faceC.getContext('2d');
    const faceTex = new THREE.CanvasTexture(faceC); faceTex.encoding = THREE.sRGBEncoding;
    add(new THREE.CylinderGeometry(.166, .166, .15, 40, 1, true, -.8, 1.6), new THREE.MeshBasicMaterial({ map: faceTex, transparent: true, toneMapped: false, side: THREE.DoubleSide }), head, [0, -.01, 0], null, [1, 1, .99]);
    // «причёска»-каре: шлем с открытым лицом и чёлкой
    const hairP = [[0, .262], [.07, .257], [.14, .23], [.185, .16], [.2, .07], [.198, -.02], [.19, -.1], [.2, -.14], [.17, -.15]];
    add(new THREE.LatheGeometry(V2(hairP), 48, .95, Math.PI * 2 - 1.9), hairM, head, null, null, [1, 1, .98]);
    const fringeP = [[0, .262], [.07, .257], [.14, .23], [.175, .17], [.168, .135]];
    add(new THREE.LatheGeometry(V2(fringeP), 48, -.95, 1.9), hairM, head, null, null, [1, 1, .98]);
    // ушные модули и серьги
    for (const s of [-1, 1]) {
      add(new THREE.CylinderGeometry(.034, .034, .03, 24), graphite, head, [s * .158, -.01, 0], [0, 0, Math.PI / 2]);
      add(new THREE.TorusGeometry(.026, .005, 8, 24), glow, head, [s * .174, -.01, 0], [0, Math.PI / 2, 0]);
      add(new THREE.SphereGeometry(.011, 12, 10), glow, head, [s * .17, -.07, .01]);
    }
    // ---- руки: правая жестикулирует, в левой микрофон ----
    function arm(side) {
      const sh = pivot(torso, [side * .2, .47, 0]);
      add(new THREE.SphereGeometry(.055, 24, 16), navy, sh);
      const up = pivot(sh, [0, 0, 0]);
      add(new THREE.CylinderGeometry(.036, .031, .24, 20), navy, up, [0, -.13, 0]);
      const el = pivot(up, [0, -.26, 0]); add(new THREE.SphereGeometry(.032, 16, 12), pearl, el);
      const fa = pivot(el, [0, 0, 0]); add(new THREE.CylinderGeometry(.03, .024, .22, 20), pearl, fa, [0, -.11, 0]);
      const hand = pivot(fa, [0, -.23, 0]); add(new THREE.BoxGeometry(.05, .06, .025), pearl, hand, [0, -.015, 0]);
      for (let f = 0; f < 4; f++) add(new THREE.BoxGeometry(.01, .034, .011), pearl, hand, [-.019 + f * .0126, -.058, 0]);
      return { sh, up, el, fa, hand };
    }
    const R = arm(1), L = arm(-1);
    L.up.rotation.set(-.3, 0, -.18); L.fa.rotation.set(-2.05, 0, .5);
    const mic = pivot(L.hand, [0, -.03, .01]);
    add(new THREE.CylinderGeometry(.016, .012, .15, 16), graphite, mic, [0, -.08, 0]);
    add(new THREE.SphereGeometry(.03, 16, 12), new THREE.MeshStandardMaterial({ color: 0x14161d, metalness: .3, roughness: .7 }), mic, [0, -.17, 0]);
    add(new THREE.TorusGeometry(.018, .004, 8, 20), glow, mic, [0, -.145, 0], [Math.PI / 2, 0, 0]);

    // ---- лицо: миндалевидные глаза с ресницами и губы ----
    const MOOD = { calm: '#8ff0ff', tense: '#ffd07a', alarm: '#ff9db0' };
    let blink = 0, nextBlink = 2, look = 0, mouth = 0, t = 0;
    function drawFace(col, talking) {
      const W = faceC.width, H = faceC.height; fx.clearRect(0, 0, W, H);
      fx.shadowColor = col; fx.shadowBlur = 16; fx.fillStyle = col; fx.strokeStyle = col; fx.lineCap = 'round';
      const open = Math.max(.08, 1 - blink), gx = look * 12;
      for (const s of [-1, 1]) {
        const cx = W / 2 + s * 92 + gx, cy = 92, w = 46, h = 20 * open;
        fx.beginPath(); fx.moveTo(cx - w, cy); fx.quadraticCurveTo(cx, cy - h * 1.6, cx + w, cy); fx.quadraticCurveTo(cx, cy + h * 1.2, cx - w, cy); fx.fill();
        if (open > .4) { fx.fillStyle = '#04060c'; fx.beginPath(); fx.arc(cx, cy, 9 * open, 0, 6.28); fx.fill(); fx.fillStyle = col; }
        fx.lineWidth = 4; // ресницы
        for (let k = 0; k < 3; k++) { const lx = cx + s * (w - 6 - k * 9); fx.beginPath(); fx.moveTo(lx, cy - h * .9); fx.lineTo(lx + s * 9, cy - h * .9 - 12); fx.stroke(); }
        fx.lineWidth = 5; fx.beginPath(); fx.moveTo(cx - w * .8, cy - 46); fx.quadraticCurveTo(cx + s * 8, cy - 58, cx + w * .8, cy - 48); fx.stroke(); // брови
      }
      // губы
      const m = talking ? mouth : 0, ly = 192, lw = 50;
      fx.fillStyle = '#ffb3cc'; fx.shadowColor = '#ff8fb8';
      fx.beginPath(); fx.moveTo(W / 2 - lw, ly); fx.quadraticCurveTo(W / 2 - lw / 2, ly - 16, W / 2, ly - 8); fx.quadraticCurveTo(W / 2 + lw / 2, ly - 16, W / 2 + lw, ly);
      fx.quadraticCurveTo(W / 2, ly + 4 + m * 22, W / 2 - lw, ly); fx.fill();
      fx.beginPath(); fx.moveTo(W / 2 - lw * .9, ly + 2 + m * 14); fx.quadraticCurveTo(W / 2, ly + 22 + m * 26, W / 2 + lw * .9, ly + 2 + m * 14); fx.quadraticCurveTo(W / 2, ly + 8 + m * 18, W / 2 - lw * .9, ly + 2 + m * 14); fx.fill();
      fx.shadowBlur = 0; faceTex.needsUpdate = true;
    }

    let vw = 0, vh = 0, onScreen = true;
    try { new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; }).observe(cv); } catch (e) {}
    function resize() {
      vw = cv.clientWidth; vh = cv.clientHeight; if (!vw || !vh) return;
      renderer.setSize(vw, vh, false); camera.aspect = vw / vh;
      const portrait = vw / vh < 1;
      camera.fov = portrait ? 34 : 26; camera.position.set(0, 1.58, portrait ? 2.25 : 2.6); camera.lookAt(0, portrait ? 1.42 : 1.48, 0);
      camera.updateProjectionMatrix();
    }
    function loop() {
      if (!onScreen || document.hidden) { setTimeout(() => requestAnimationFrame(loop), 250); return; }
      if (cv.clientWidth !== vw || cv.clientHeight !== vh) resize();
      if (!vw) { setTimeout(() => requestAnimationFrame(loop), 250); return; }
      t += 1 / 60;
      const s = getState() || {}; const talking = !!s.talking, sev = s.sev || 40;
      const col = sev >= 70 ? MOOD.alarm : sev >= 45 ? MOOD.tense : MOOD.calm;
      nextBlink -= 1 / 60; if (nextBlink < 0) { blink = 1; nextBlink = 2.5 + Math.random() * 3; } blink = Math.max(0, blink - .12);
      look = Math.sin(t * .6) * .5 + (talking ? Math.sin(t * 1.6) * .3 : 0);
      const target = talking ? .3 + .7 * Math.abs(Math.sin(t * 10.3) * Math.sin(t * 6.4 + 1)) : 0; mouth += (target - mouth) * .35;
      head.rotation.y = Math.sin(t * .5) * .16 + (talking ? Math.sin(t * 1.2) * .09 : 0);
      head.rotation.x = Math.sin(t * .8) * .03 + (talking ? Math.sin(t * 2.4) * .045 : 0);
      head.rotation.z = Math.sin(t * .42) * .05 + .03;
      torso.rotation.y = Math.sin(t * .33) * .06; torso.position.y = .9 + Math.sin(t * 1.4) * .004;
      const g = talking ? Math.sin(t * 1.6) : Math.sin(t * .5) * .2;
      R.up.rotation.set(-.3 - g * .18, 0, .12 + Math.max(0, g) * .16); R.fa.rotation.set(-1.15 - g * .3, 0, -.15); R.hand.rotation.set(0, g * .5, -.2);
      core.scale.setScalar(1 + (talking ? mouth : .5 + .5 * Math.sin(t * 2)) * .3);
      const hp = new THREE.Vector3(); head.getWorldPosition(hp); faceL.position.set(hp.x, hp.y, hp.z + .3); faceL.color.set(col); faceL.intensity = .5 + mouth * .7;
      drawFace(col, talking);
      renderer.render(scene, camera);
      if (!RM) requestAnimationFrame(loop);
    }
    resize(); loop();
    return true;
  }
  window.AnnaRobot = { init };
})();
