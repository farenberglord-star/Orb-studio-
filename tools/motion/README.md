# Моушн-ролик «Радар дня» (прототип)

1. Орб в Blender: `python3.11 tools/blender/orb_loop.py tools/motion/orb 600 120 20` (нужен `pip install bpy==4.4.0 "numpy<2"`; 120 PNG с прозрачностью, бесшовная петля 4 с).
2. Данные: `data.js` — снимок `/api/v1/radars` и `/api/v1/radar/{geo,energy,crypto}`.
3. Звук: `python3 sound.py` → `sound.wav`.
4. Кадры и видео: `node render.js` (Playwright) → `scene*.mp4`, затем
   `ffmpeg -f concat -safe 0 -i list.txt -c copy video.mp4` и
   `ffmpeg -i video.mp4 -i sound.wav -map 0:v -map 1:a -c:v copy -c:a aac -shortest out.mp4`.
