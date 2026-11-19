# Давид — 3D-модель ведущего «Студии на двоих» для Blender 4.x.
# Запуск без интерфейса:  python3.11 tools/blender/david.py public/media/david.glb
#   (нужен модуль bpy: pip install bpy==4.4.0 "numpy<2")  или  blender -b -P tools/blender/david.py -- out.glb
# Всё строится из кода: голова с лицом, волосы, шея, пиджак с лацканами, руки на столе.
# Морф-цели головы: "talk" (рот открыт), "smile" (улыбка). Моргание — масштабом глаз в three.js.
# Узлы для анимации в three.js: Bust (дыхание), Head (кивки и повороты), Eyes.
import sys, math
import bpy, bmesh
import numpy as np
from mathutils import Vector

out = "david.glb"
if "--" in sys.argv: out = sys.argv[sys.argv.index("--") + 1]
elif len(sys.argv) > 1 and sys.argv[-1].endswith(".glb"): out = sys.argv[-1]

bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene

def g(x, c, s):  # гауссиана
    return np.exp(-((x - c) / s) ** 2)

def mesh_obj(name, verts, faces, parent=None):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = bpy.data.objects.new(name, me); scn.collection.objects.link(ob)
    if parent: ob.parent = parent
    for p in me.polygons: p.use_smooth = True
    return ob

def grid_faces(nu, nv, wrap_u=True):
    f = []
    for j in range(nv - 1):
        for i in range(nu if wrap_u else nu - 1):
            a = j * nu + i; b = j * nu + (i + 1) % nu
            f.append((a, b, b + nu, a + nu))
    return f

def material(name, rgb, emit=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*rgb, 1)
    b.inputs["Emission Color"].default_value = (*rgb, 1); b.inputs["Emission Strength"].default_value = emit
    return m

M_SKIN = material("holo_skin", (0.35, 0.72, 1.0), 0.6)
M_HAIR = material("holo_hair", (0.30, 0.62, 1.0), 0.8)
M_SUIT = material("holo_suit", (0.22, 0.52, 1.0), 0.5)
M_EYE = material("holo_eye", (0.75, 0.95, 1.0), 2.0)

# ---------- корень: бюст (дыхание) и голова (кивки) ----------
root = bpy.data.objects.new("David", None); scn.collection.objects.link(root)
bust = bpy.data.objects.new("Bust", None); scn.collection.objects.link(bust); bust.parent = root
HEAD_C = np.array([0.0, 0.0, 1.62])          # центр черепа
head_pivot = bpy.data.objects.new("Head", None); scn.collection.objects.link(head_pivot)
head_pivot.parent = bust; head_pivot.location = (0, 0.01, 1.50)  # ось у основания черепа
HEAD_SCALE = 1.08

# ---------- голова ----------
NU, NV = 96, 72
th = np.linspace(0, np.pi, NV)                      # 0 = макушка
ph = np.linspace(0, 2 * np.pi, NU, endpoint=False)  # 0 = лицо (−Y)
TH, PH = np.meshgrid(th, ph, indexing="ij")
ux = np.sin(TH) * np.sin(PH); uy = -np.sin(TH) * np.cos(PH); uz = np.cos(TH)
front = np.clip(-uy, 0, 1)                # 1 на лице
side = np.abs(ux)
# базовый череп: ширина, глубина, высота
x = ux * 0.078; y = uy * 0.098; z = uz * 0.118
# затылок и лоб
y = y + np.where(uy > 0, 0.012 * g(uz, 0.25, 0.45) * (uy), 0)
# сужение к челюсти и подбородку
low = np.clip(-uz, 0, 1)
x = x * (1 - 0.30 * low ** 1.4)
y = y * (1 - 0.18 * low ** 1.6 * (uy > 0)) - 0.010 * low ** 2 * front
z = z - 0.012 * low ** 3 * front          # подбородок вниз
# поверхность лица: смещения вдоль −Y (вперёд)
fx = ux; fz = uz                          # координаты на «маске» лица
d = np.zeros_like(x)
d += 0.022 * g(fx, 0, 0.10) * g(fz, -0.08, 0.20) * front ** 3                    # нос (спинка)
d += 0.010 * g(fx, 0, 0.13) * g(fz, -0.24, 0.07) * front ** 3                    # кончик носа
d -= 0.004 * g(np.abs(fx), 0.11, 0.05) * g(fz, -0.27, 0.05) * front ** 2          # крылья носа
d += 0.008 * g(fx, 0, 0.55) * g(fz, 0.22, 0.09) * front ** 2                     # надбровье
d -= 0.016 * g(np.abs(fx), 0.36, 0.13) * g(fz, 0.08, 0.11) * front ** 2           # глазницы
d += 0.006 * g(np.abs(fx), 0.52, 0.14) * g(fz, -0.12, 0.13) * front               # скулы
d += 0.007 * g(fx, 0, 0.30) * g(fz, -0.47, 0.07) * front ** 3                    # губы
d -= 0.006 * g(fx, 0, 0.26) * g(fz, -0.525, 0.018) * front ** 3                  # линия рта
d += 0.008 * g(fx, 0, 0.30) * g(fz, -0.80, 0.12) * front ** 2                    # подбородок
d -= 0.004 * g(fx, 0, 0.20) * g(fz, -0.66, 0.05) * front ** 2                    # ямка под губой
y = y - d
P = np.stack([x, y, z], -1).reshape(-1, 3) + HEAD_C
head_faces = grid_faces(NU, NV)
head = mesh_obj("HeadMesh", P - np.array(head_pivot.location), head_faces, head_pivot)
head.data.materials.append(M_SKIN)

# морфы: рот, улыбка
mouth_line = -0.525
below = np.clip((mouth_line - fz) / 0.35, 0, 1) * (fz < mouth_line)
jaw_w = (np.where(fz < mouth_line, np.minimum(1, (mouth_line - fz) / 0.06), 0) * g(fx, 0, 0.75) * np.clip(front * 1.4, 0, 1))
talk = np.zeros_like(P); talk[:, 2] = (-0.012 * jaw_w).reshape(-1); talk[:, 1] = (0.003 * jaw_w).reshape(-1)
smile_w = g(np.abs(fx), 0.22, 0.09) * g(fz, -0.50, 0.08) * front ** 2
smile = np.zeros_like(P); smile[:, 2] = (0.005 * smile_w).reshape(-1); smile[:, 0] = (0.004 * np.sign(fx) * smile_w).reshape(-1)
smile[:, 1] = (0.002 * smile_w).reshape(-1)
head.shape_key_add(name="Basis")
for nm, off in (("talk", talk), ("smile", smile)):
    sk = head.shape_key_add(name=nm, from_mix=False)
    for i, v in enumerate(sk.data): v.co = v.co + Vector(off[i])

# уши
def ear(sgn):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=1)
    for v in bm.verts:
        v.co.x *= 0.009; v.co.y *= 0.017; v.co.z *= 0.028
        v.co.x -= 0.004 * (1 - abs(v.co.z) / 0.032) * sgn  # чашечка
    me = bpy.data.meshes.new("Ear"); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new("Ear" + ("R" if sgn > 0 else "L"), me); scn.collection.objects.link(ob)
    ob.parent = head_pivot; ob.location = Vector((sgn * 0.072, 0.016, 1.600)) - head_pivot.location
    ob.rotation_euler = (0, 0, sgn * 0.25); ob.data.materials.append(M_SKIN)
    for p in me.polygons: p.use_smooth = True
ear(1); ear(-1)

# глаза
eyes = bpy.data.objects.new("Eyes", None); scn.collection.objects.link(eyes); eyes.parent = head_pivot
for sgn in (1, -1):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=12, radius=0.0085)
    me = bpy.data.meshes.new("Eye"); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new("Eye" + ("R" if sgn > 0 else "L"), me); scn.collection.objects.link(ob)
    ob.parent = eyes; ob.location = Vector((sgn * 0.029, -0.077, 1.629)) - head_pivot.location
    ob.data.materials.append(M_EYE)
    for p in me.polygons: p.use_smooth = True

# волосы: оболочка поверх черепа, с пробором и коком
HV, HU = 40, 96
hth = np.linspace(0, 1.30, HV); hph = np.linspace(0, 2 * np.pi, HU, endpoint=False)
HT, HP = np.meshgrid(hth, hph, indexing="ij")
hx = np.sin(HT) * np.sin(HP); hy = -np.sin(HT) * np.cos(HP); hz = np.cos(HT)
hfront = np.clip(-hy, 0, 1)
# край: спереди линия роста волос выше (лоб), по бокам виски, сзади ниже
edge = 0.62 + 0.55 * (1 - hfront) ** 1.5 + 0.05 * g(np.abs(hx), 0.6, 0.2) * hfront  # макс. полярный угол
mask_t = np.clip((edge - HT) / 0.10, 0, 1)
thick = 0.004 + 0.016 * mask_t * (1 + 0.6 * g(hx, -0.15, 0.35) * hfront * g(HT, 0.45, 0.25))  # кок слегка влево
wave = 0.0025 * np.sin(HP * 14 + HT * 9) * mask_t
hr = 1 + (thick + wave) / 0.1
X = hx * 0.078 * hr; Y = hy * 0.098 * hr - 0.004 * hfront * g(HT, 0.5, 0.2); Z = hz * 0.118 * hr
Y = Y + np.where(hy > 0, 0.012 * g(hz, 0.25, 0.45) * hy, 0)
Z = Z + 0.006 * g(hx, -0.15, 0.35) * hfront * g(HT, 0.5, 0.2)  # подъём кока
# опустить край к коже
shrink = 1 - 0.035 * (1 - mask_t)
HPts = np.stack([X * shrink, Y * shrink, Z * shrink], -1)
# обрезаем ряды за пределами края: вершины с маской 0 прижимаем к краю
keep_rows = HV
HPts = HPts.reshape(-1, 3) + HEAD_C
hair = mesh_obj("Hair", HPts - np.array(head_pivot.location), grid_faces(HU, keep_rows), head_pivot)
# удалить грани целиком вне волос
bm = bmesh.new(); bm.from_mesh(hair.data)
mt = mask_t.reshape(-1); bm.verts.ensure_lookup_table()
dead = [f for f in bm.faces if all(mt[v.index] < 0.02 for v in f.verts)]
bmesh.ops.delete(bm, geom=dead, context="FACES"); bm.to_mesh(hair.data); bm.free()
hair.data.materials.append(M_HAIR)

# ---------- шея ----------
def lathe(name, prof, nseg, sx=1.0, sy=1.0, parent=None, mat=None, cap=False, yoff=None):
    pts = []
    for (r, zz) in prof:
        for i in range(nseg):
            a = 2 * np.pi * i / nseg
            yy = -np.cos(a) * r * sy + (yoff(zz, a) if yoff else 0)
            pts.append((np.sin(a) * r * sx, yy, zz))
    ob = mesh_obj(name, np.array(pts), grid_faces(nseg, len(prof)), parent)
    if mat: ob.data.materials.append(mat)
    return ob
neck = lathe("Neck", [(0.060, 1.38), (0.056, 1.43), (0.053, 1.48), (0.052, 1.53)], 32, 1.0, 0.92, head_pivot, M_SKIN)
neck.location = (0, 0.01, 0); neck.location = -Vector(head_pivot.location) + Vector((0, 0.01, 0))

# ---------- торс в пиджаке ----------
# параметрический корпус: эллипс сечения растёт к плечам и скругляется к шее
TS, TV = 64, 34
tz = np.linspace(0.92, 1.44, TV)
def rx_of(z):
    if z < 1.33: return 0.155 + 0.035 * (z - 0.92) / 0.41 + 0.035 * ((z - 0.92) / 0.41) ** 3
    t = (z - 1.33) / 0.11
    return 0.225 * math.sqrt(max(0.0, 1 - t ** 1.6)) * (1 - t) + 0.058 * t
def ry_of(z):
    if z < 1.33: return 0.105 + 0.01 * (z - 0.92) / 0.41
    t = (z - 1.33) / 0.11
    return 0.115 * math.sqrt(max(0.0, 1 - t ** 1.6)) * (1 - t) + 0.052 * t
pts = []
for zz in tz:
    for i in range(TS):
        a = 2 * np.pi * i / TS
        sx, sy = np.sin(a), -np.cos(a)
        rx, ry = rx_of(zz), ry_of(zz)
        # плечи: квадратнее по бокам (суперэллипс)
        e = 2.6
        nx = np.sign(sx) * abs(sx) ** (2 / e); ny = np.sign(sy) * abs(sy) ** (2 / e)
        yy = ny * ry
        # грудь чуть вперёд, лопатки
        yy -= 0.012 * max(0, -sy) * math.exp(-((zz - 1.22) / 0.12) ** 2)
        pts.append((nx * rx, yy + 0.01, zz))
torso = mesh_obj("Jacket", np.array(pts), grid_faces(TS, TV), bust)
torso.data.materials.append(M_SUIT)

# лацканы и вырез: V-образные пластины поверх груди
def lapel(sgn):
    # контур в плоскости груди (x, z), затем прижат к корпусу спереди
    outline = [(0.020, 1.06), (0.050, 1.13), (0.105, 1.30), (0.085, 1.355), (0.060, 1.405), (0.045, 1.39), (0.060, 1.30), (0.022, 1.16)]
    vs = []
    for (lx, lz) in outline:
        ry = ry_of(lz); rx = rx_of(lz)
        sx = min(0.999, lx / rx)
        e = 2.6; a = math.asin(sx)
        ny = -abs(math.cos(a)) ** (2 / e)
        yy = ny * ry + 0.01 - 0.012 * math.exp(-((lz - 1.22) / 0.12) ** 2) - 0.014
        vs.append((sgn * lx, yy, lz))
    n = len(vs)
    back = [(vx, vy + 0.004, vz) for (vx, vy, vz) in vs]
    verts = vs + back
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    if sgn < 0: faces = [tuple(reversed(f)) for f in faces]
    ob = mesh_obj("Lapel" + ("R" if sgn > 0 else "L"), np.array(verts), faces, bust)
    for p in ob.data.polygons: p.use_smooth = False
    ob.data.materials.append(M_SUIT)
lapel(1); lapel(-1)
# рубашка в вырезе
shirt = lathe("Shirt", [(0.052, 1.30), (0.055, 1.37), (0.056, 1.40), (0.050, 1.43)], 28, 1.0, 1.0, bust, M_SKIN)
shirt.location = (0, -0.035, 0)

# ---------- руки: плечо → локоть → предплечье на столе ----------
def limb(name, a, b, r0, r1, parent, n=20, rings=10):
    a = np.array(a); b = np.array(b); ax = b - a; L = np.linalg.norm(ax); w = ax / L
    up = np.array([0, 0, 1.0]) if abs(w[2]) < 0.9 else np.array([1.0, 0, 0])
    u = np.cross(w, up); u /= np.linalg.norm(u); v = np.cross(w, u)
    pts = []
    for j in range(rings):
        t = j / (rings - 1); c = a + ax * t; r = r0 + (r1 - r0) * t
        r *= 1 + 0.08 * math.sin(t * math.pi)  # мышца
        for i in range(n):
            q = 2 * math.pi * i / n
            pts.append(c + (u * math.cos(q) + v * math.sin(q)) * r)
    faces = grid_faces(n, rings)
    # торцы
    pts.append(a); pts.append(b); ia, ib = len(pts) - 2, len(pts) - 1
    faces += [(ia, (i + 1) % n, i) for i in range(n)]
    off = (rings - 1) * n
    faces += [(ib, off + i, off + (i + 1) % n) for i in range(n)]
    ob = mesh_obj(name, np.array(pts), faces, parent); ob.data.materials.append(M_SUIT)
    return ob
for sgn in (1, -1):
    S = (sgn * 0.215, 0.015, 1.33); E = (sgn * 0.245, -0.06, 1.06); W = (sgn * 0.12, -0.30, 1.00)
    limb("UpperArm" + ("R" if sgn > 0 else "L"), S, E, 0.060, 0.050, bust)
    limb("Forearm" + ("R" if sgn > 0 else "L"), E, W, 0.048, 0.040, bust)
    # кисть: приплюснутая сфера
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=10, radius=1)
    for v in bm.verts: v.co.x *= 0.045; v.co.y *= 0.055; v.co.z *= 0.020
    me = bpy.data.meshes.new("Hand"); bm.to_mesh(me); bm.free()
    hob = bpy.data.objects.new("Hand" + ("R" if sgn > 0 else "L"), me); scn.collection.objects.link(hob)
    hob.parent = bust; hob.location = (sgn * 0.095, -0.355, 0.995); hob.rotation_euler = (0, 0, -sgn * 0.5)
    hob.data.materials.append(M_SKIN)
    for p in me.polygons: p.use_smooth = True

head_pivot.scale = (HEAD_SCALE,) * 3

# ---------- сглаживание (кроме головы с морфами) ----------
for ob in list(scn.objects):
    if ob.type != "MESH" or ob.name in ("HeadMesh",) or ob.name.startswith("Lapel"): continue
    md = ob.modifiers.new("sub", "SUBSURF"); md.levels = 1; md.render_levels = 1

# ---------- экспорт ----------
bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True, export_morph=True,
                          export_morph_normal=True, export_yup=True, export_materials="EXPORT")
print("OK", out)
