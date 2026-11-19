# Звук ролика: пэд, пульс, свуши на переходах, тики счётчиков, удар на логотипе. 24 с, 48 кГц, стерео.
import numpy as np, wave
SR = 48000; T = 24.0; n = int(SR * T); t = np.arange(n) / SR
rng = np.random.default_rng(3)
def env(a, d, s, r, tot):
    k = np.zeros(int(SR * tot)); A, D, R = int(SR * a), int(SR * d), int(SR * r)
    k[:A] = np.linspace(0, 1, A); k[A:A + D] = np.linspace(1, s, D); k[A + D:len(k) - R] = s; k[len(k) - R:] = np.linspace(s, 0, R); return k
L = np.zeros(n); Rr = np.zeros(n)
def add(sig, at, pan=0.0, g=1.0):
    i = int(at * SR); m = min(len(sig), n - i); l = np.sqrt((1 - pan) / 2) * 1.41; r = np.sqrt((1 + pan) / 2) * 1.41
    L[i:i + m] += sig[:m] * g * l; Rr[i:i + m] += sig[:m] * g * r
def lp(x, a):  # однополюсный ФНЧ
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
# пэд: Am – F – C – G, по 6 с, детюн
chords = [[220, 261.6, 329.6], [174.6, 220, 261.6], [130.8, 196, 261.6], [196, 246.9, 293.7]]
for ci, ch in enumerate(chords):
    tt = np.arange(int(SR * 6.6)) / SR; s = np.zeros_like(tt)
    for f in ch:
        for dt in (-0.6, 0.6): s += np.sin(2 * np.pi * (f + dt) * tt) + 0.3 * np.sin(2 * np.pi * 2 * (f + dt) * tt)
    s *= env(1.2, 1, .8, 1.6, 6.6) * 0.035 * (1 + 0.3 * np.sin(2 * np.pi * 0.25 * tt)); add(s, ci * 6, pan=(-0.3 if ci % 2 else 0.3))
# пульс-бас с 4 с: восьмые, 120 bpm
for k in range(int((T - 5) / 0.5)):
    at = 4.0 + k * 0.5
    if at > 22.6: break
    tt = np.arange(int(SR * .45)) / SR; f = [55, 43.65, 32.7, 49][int(at // 6) % 4] * 2
    s = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 7) * 0.22; add(s, at)
    if k % 2 == 1:  # хай-хэт
        h = rng.standard_normal(int(SR * .06)); h = np.diff(np.concatenate([[0], h])) * np.exp(-np.arange(len(h)) / SR * 70) * 0.05; add(h, at, pan=0.4)
# свуши
def whoosh(dur=1.1, up=True):
    m = int(SR * dur); nz = rng.standard_normal(m); x = np.linspace(0, 1, m)
    a = (0.02 + 0.25 * (x if up else 1 - x)); y = lp(nz, 0.0) if False else nz
    out = np.empty(m); acc = 0.0
    for i in range(m): acc += a[i] * (y[i] - acc); out[i] = acc
    return out * np.sin(np.pi * x) ** 2 * 0.5
for at in (3.2, 9.4, 16.7, 20.5): add(whoosh(1.0), at, pan=0.0, g=0.9)
# удар-«бум» на логотипе
tt = np.arange(int(SR * 2.5)) / SR; boom = (np.sin(2 * np.pi * (40 + 60 * np.exp(-tt * 8)) * tt) * np.exp(-tt * 2.2) * 0.5 + rng.standard_normal(len(tt)) * np.exp(-tt * 18) * 0.12)
add(boom, 0.85); add(boom * 0.7, 21.0)
# сверкание на буквах
for i in range(10):
    tt = np.arange(int(SR * .25)) / SR; f = 1200 + i * 140; add(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 18) * 0.05, 1.15 + i * .06, pan=-0.6 + i * .13)
# тики счётчиков радаров и крипто-табло
for i in range(8):
    for k in range(10):
        at = 4.4 + i * .12 + k * .15 * (1 + k * .08); tt = np.arange(int(SR * .03)) / SR
        add(np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 200) * 0.05, at, pan=(-0.5 if i % 2 == 0 else 0.5))
for i in range(3):
    for k in range(14):
        at = 17.3 + i * .35 + k * .09; tt = np.arange(int(SR * .025)) / SR
        add(np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 220) * 0.045, at, pan=0.3)
# «пинг» на появлении карточек и метке максимума
for at in (7.25, 10.15, 11.75, 13.35):
    tt = np.arange(int(SR * 1.2)) / SR; add((np.sin(2 * np.pi * 880 * tt) + .5 * np.sin(2 * np.pi * 1320 * tt)) * np.exp(-tt * 4) * 0.08, at, pan=0.2)
fade = np.ones(n); fo = int(SR * 1.2); fade[-fo:] = np.linspace(1, 0, fo); fade[:int(SR * .05)] = np.linspace(0, 1, int(SR * .05))
st = np.stack([L * fade, Rr * fade], 1); st /= max(1e-9, np.abs(st).max()) / 0.89
with wave.open("sound.wav", "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok")
