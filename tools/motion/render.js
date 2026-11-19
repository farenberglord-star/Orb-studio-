// Снимает кадры draw(t) и кодирует по сцене в отдельный mp4 (одинаковые настройки), затем склейка.
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs');
const FPS = 30, SC = [[0, 4], [4, 10], [10, 17], [17, 21], [21, 24]];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('err', e.message));
  await p.goto('file://' + __dirname + '/radar.html');
  await p.waitForFunction(() => window.ready && window.ready(), null, { timeout: 120000 });
  const list = [];
  for (let s = 0; s < SC.length; s++) {
    const tmp = `${__dirname}/scene${s}.tmp.mp4`, fin = `${__dirname}/scene${s}.mp4`;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), tmp]);
    const done = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
    for (let f = Math.round(SC[s][0] * FPS); f < Math.round(SC[s][1] * FPS); f++) {
      await p.evaluate(t => draw(t), f / FPS);
      const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await done; fs.renameSync(tmp, fin); list.push(`file '${fin}'`); console.log('scene', s, 'ok');
  }
  fs.writeFileSync(__dirname + '/list.txt', list.join('\n') + '\n'); await b.close();
})();
