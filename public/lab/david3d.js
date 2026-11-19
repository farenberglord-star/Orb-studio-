// Давид в 3D — тест модели из Blender (tools/blender/david.py → /media/david.glb).
// Голограмма: свечение по краю (френель), бегущие строки развёртки, точки по вершинам, мерцание.
// Морф "talk" открывает рот по уровню речи, "smile" — лёгкая улыбка; узел Head кивает, Bust дышит.
(function () {
  const cv = document.getElementById("cv"), $ = (id) => document.getElementById(id);
  if (!window.THREE || !THREE.GLTFLoader) { $("msg").textContent = "WebGL недоступен"; return; }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true }); }
  catch (e) { $("msg").textContent = "WebGL недоступен"; return; }
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 20);
  const target = new THREE.Vector3(0, 1.34, 0);
  let yaw = 0.0, pitch = 0.08, dist = 2.25;

  const U = { uTime: { value: 0 }, uLevel: { value: 0 } };
  const VS = `
    #include <common>
    #include <morphtarget_pars_vertex>
    varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main() {
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <begin_vertex>
      #include <morphtarget_vertex>
      vec4 wp = modelMatrix * vec4(transformed, 1.0);
      vW = wp.xyz; vN = normalize(mat3(modelMatrix) * objectNormal); vV = normalize(cameraPosition - wp.xyz);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`;
  const FS = `
    uniform float uTime; uniform float uLevel; uniform vec3 uColor; uniform float uBase;
    varying vec3 vN; varying vec3 vV; varying vec3 vW;
    void main() {
      float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
      float scan = 0.75 + 0.25 * sin(vW.y * 900.0 - uTime * 6.0);
      float band = smoothstep(0.0, 0.02, abs(fract(vW.y * 2.2 - uTime * 0.25) - 0.5) - 0.47);
      float flick = 0.94 + 0.06 * sin(uTime * 37.0) * sin(uTime * 11.0);
      float a = (uBase + f * 1.1) * scan * flick + (1.0 - band) * 0.0 + band * 0.08;
      vec3 c = mix(uColor, vec3(0.85, 0.97, 1.0), f * 0.6 + uLevel * 0.08);
      gl_FragColor = vec4(c * a, a);
    }`;
  const PVS = `
    #include <common>
    #include <morphtarget_pars_vertex>
    uniform float uTime; uniform float uPx; varying float vA;
    void main() {
      #include <begin_vertex>
      #include <morphtarget_vertex>
      vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
      float h = fract(sin(dot(position.xyz * 97.0, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
      vA = step(0.68, h) * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (1.0 + h * 3.0) + h * 40.0)));
      gl_PointSize = uPx * (0.6 + h);
      gl_Position = projectionMatrix * mv;
    }`;
  const PFS = `uniform vec3 uColor; varying float vA;
    void main() { vec2 p = gl_PointCoord - 0.5; float d = 1.0 - smoothstep(0.1, 0.5, length(p)); gl_FragColor = vec4(uColor * d * vA, d * vA); }`;

  const holo = (rgb, base, morph) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, morphTargets: !!morph, morphNormals: !!morph,
    uniforms: { ...U, uColor: { value: new THREE.Color(rgb) }, uBase: { value: base } } });
  const dots = (rgb, morph) => new THREE.ShaderMaterial({ vertexShader: PVS, fragmentShader: PFS, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, morphTargets: !!morph, uniforms: { uTime: U.uTime, uPx: { value: 2.2 * renderer.getPixelRatio() }, uColor: { value: new THREE.Color(rgb) } } });

  // пол-стол: тонкая светящаяся кромка и отражение-пятно
  const desk = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: U, vertexShader: "varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "varying vec2 vU; uniform float uTime; void main(){ float r = length((vU - vec2(0.5, 0.62)) * vec2(1.6, 2.6)); float a = 0.22 * (1.0 - smoothstep(0.0, 0.7, r)); float e = 0.5 * (1.0 - smoothstep(0.0, 0.012, abs(vU.y - 0.06))); gl_FragColor = vec4(vec3(0.3, 0.65, 1.0) * (a + e), a + e); }" }));
  desk.rotation.x = -Math.PI / 2; desk.position.set(0, 0.975, -0.12); scene.add(desk);

  let head = null, headNode = null, bust = null; const eyes = [];
  new THREE.GLTFLoader().load("/media/david.glb", (gltf) => {
    const root = gltf.scene; scene.add(root);
    const meshes = []; root.traverse((o) => { if (o.isMesh) meshes.push(o); });
    meshes.forEach((o) => {
      const nm = o.name, morph = !!o.morphTargetInfluences;
      const eye = nm.startsWith("Eye"), hair = nm === "Hair", suit = /Jacket|Lapel|Arm|Forearm/.test(nm);
      const rgb = eye ? 0xbff4ff : hair ? 0x4f9dff : suit ? 0x3f86ff : 0x5ab8ff;
      o.material = holo(rgb, eye ? 0.6 : hair ? 0.16 : suit ? 0.09 : 0.12, morph);
      o.renderOrder = eye ? 3 : 1;
      // маска глубины: невидимая копия закрывает заднюю сторону, чтобы голограмма не просвечивала насквозь
      const occ = new THREE.Mesh(o.geometry, new THREE.MeshBasicMaterial({ colorWrite: false, morphTargets: morph, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 }));
      if (morph) { occ.morphTargetInfluences = o.morphTargetInfluences; occ.morphTargetDictionary = o.morphTargetDictionary; }
      occ.renderOrder = 0; o.add(occ);
      if (!eye) {
        const p = new THREE.Points(o.geometry, dots(suit ? 0x7fb4ff : 0x9fe0ff, morph));
        if (morph) { p.morphTargetInfluences = o.morphTargetInfluences; p.morphTargetDictionary = o.morphTargetDictionary; }
        p.renderOrder = 2; o.add(p);
      }
      if (nm === "HeadMesh") head = o; if (eye) eyes.push(o);
    });
    headNode = root.getObjectByName("Head"); bust = root.getObjectByName("Bust");
    $("msg").textContent = "";
  }, undefined, () => { $("msg").textContent = "Модель не загрузилась"; });

  // управление: перетаскивание вращает камеру
  let drag = null;
  cv.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, yaw, pitch }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", (e) => { if (!drag) return; yaw = drag.yaw - (e.clientX - drag.x) * 0.006; pitch = Math.max(-0.3, Math.min(0.5, drag.pitch + (e.clientY - drag.y) * 0.004)); });
  cv.addEventListener("pointerup", () => { drag = null; });

  let talking = true; const tb = $("talk");
  if (tb) tb.addEventListener("click", () => { talking = !talking; tb.textContent = talking ? "⏸ Пусть помолчит" : "▶ Пусть говорит"; tb.setAttribute("aria-pressed", String(talking)); });
  const q = new URLSearchParams(location.search);
  if (q.has("yaw")) yaw = +q.get("yaw"); if (q.has("t")) U.uTime.value = +q.get("t");
  const still = q.has("still");

  // уровень «речи»: слоги 4–6 Гц, фразы с паузами
  let lvl = 0, nextBlink = 2, blink = 0;
  function speech(t) {
    const phrase = Math.max(0, Math.sin(t * 0.55) + 0.35) * Math.max(0, Math.sin(t * 0.21 + 1) + 0.6);
    const syl = 0.5 + 0.5 * Math.sin(t * 31) * Math.sin(t * 17.3 + 0.7);
    return Math.min(1, phrase * syl * 1.25);
  }
  function size() { const r = cv.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); }
  addEventListener("resize", size); size();

  let t0 = performance.now();
  function frame(now) {
    if (!still) requestAnimationFrame(frame);
    const t = still ? U.uTime.value : (now - t0) / 1000 + (q.has("t") ? +q.get("t") : 0);
    U.uTime.value = t;
    const want = talking ? speech(t) : 0; lvl += (want - lvl) * 0.35; U.uLevel.value = lvl;
    if (!RM && !drag && !q.has("yaw")) yaw = Math.sin(t * 0.18) * 0.22;
    camera.position.set(target.x + Math.sin(yaw) * dist * Math.cos(pitch), target.y + Math.sin(pitch) * dist, target.z + Math.cos(yaw) * dist * Math.cos(pitch));
    camera.lookAt(target);
    if (head) {
      const d = head.morphTargetDictionary;
      head.morphTargetInfluences[d.talk] = lvl * 0.9;
      head.morphTargetInfluences[d.smile] = 0.35 + 0.25 * Math.sin(t * 0.4) ** 2;
    }
    if (headNode) {
      headNode.rotation.x = 0.04 * Math.sin(t * 0.7) + 0.05 * lvl;               // кивок в такт
      headNode.rotation.z = 0.03 * Math.sin(t * 0.37);
      headNode.rotation.y = 0.10 * Math.sin(t * 0.23) + (talking ? 0.12 : 0);    // смотрит к гостю справа
    }
    if (bust) { const b = Math.sin(t * 1.6); bust.scale.set(1 + b * 0.004, 1 + b * 0.006, 1 + b * 0.008); bust.position.y = b * 0.002; }
    if (eyes.length) { if (t > nextBlink) { blink = 1; nextBlink = t + 2.5 + Math.random() * 3; } blink *= 0.7; const k = 1 - 0.9 * Math.min(1, blink * 1.4); for (const e of eyes) e.scale.y = k; }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
})();
