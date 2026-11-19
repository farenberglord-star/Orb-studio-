# Орб Orb Studio — бесшовная петля для моушн-роликов (Blender 4.x, Cycles, прозрачный фон).
# python3.11 tools/blender/orb_loop.py OUT_DIR [SIZE] [FRAMES] [SAMPLES] [ONLY_FRAME]
import sys, math, bpy
a = [x for x in sys.argv[1:] if not x.endswith(".py")]
out = a[0]; size = int(a[1]) if len(a) > 1 else 720; N = int(a[2]) if len(a) > 2 else 120
spp = int(a[3]) if len(a) > 3 else 24; only = int(a[4]) if len(a) > 4 else None
bpy.ops.wm.read_factory_settings(use_empty=True)
s = bpy.context.scene; s.render.engine = "CYCLES"; s.cycles.device = "CPU"; s.cycles.samples = spp
s.cycles.use_denoising = True; s.render.film_transparent = True; s.cycles.film_transparent_glass = True
s.render.resolution_x = s.render.resolution_y = size; s.render.fps = 30
s.frame_start, s.frame_end = 1, N
s.render.image_settings.file_format = "PNG"; s.render.image_settings.color_mode = "RGBA"
s.view_settings.view_transform = "Standard"
s.cycles.max_bounces = 6; s.cycles.transmission_bounces = 6

def mat(name, build):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    o = nt.nodes.new("ShaderNodeOutputMaterial"); build(nt, o); return m

def link(nt, a, b): nt.links.new(a, b)

# стеклянная оболочка
def glass(nt, o):
    # прозрачная оболочка + зеркальный блик софтбоксов (без шума стекла на прозрачном фоне)
    tr = nt.nodes.new("ShaderNodeBsdfTransparent"); gl = nt.nodes.new("ShaderNodeBsdfGlossy"); gl.inputs["Roughness"].default_value = 0.05
    fr = nt.nodes.new("ShaderNodeFresnel"); fr.inputs[0].default_value = 1.5
    p = nt.nodes.new("ShaderNodeMixShader"); link(nt, fr.outputs[0], p.inputs[0]); link(nt, tr.outputs[0], p.inputs[1]); link(nt, gl.outputs[0], p.inputs[2])
    # светящийся край (френель): голографическая кромка
    lw = nt.nodes.new("ShaderNodeLayerWeight"); lw.inputs[0].default_value = 0.5
    em = nt.nodes.new("ShaderNodeEmission"); em.inputs[0].default_value = (0.25, 0.8, 1.0, 1)
    pw = nt.nodes.new("ShaderNodeMath"); pw.operation = "POWER"; pw.inputs[1].default_value = 5
    mt = nt.nodes.new("ShaderNodeMath"); mt.operation = "MULTIPLY"; mt.inputs[1].default_value = 0.8
    link(nt, lw.outputs["Facing"], pw.inputs[0]); link(nt, pw.outputs[0], mt.inputs[0]); link(nt, mt.outputs[0], em.inputs[1])
    ad = nt.nodes.new("ShaderNodeAddShader"); link(nt, p.outputs[0], ad.inputs[0]); link(nt, em.outputs[0], ad.inputs[1])
    link(nt, ad.outputs[0], o.inputs[0])
# ядро: светящаяся «плазма» из шума, цвета Orb Studio (циан → фиолет)
def core(nt, o):
    tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 2.4; nz.inputs["Detail"].default_value = 8; nz.inputs["Distortion"].default_value = 0.9
    cr = nt.nodes.new("ShaderNodeValToRGB"); e = cr.color_ramp
    e.elements[0].position = 0.45; e.elements[0].color = (0.01, 0.02, 0.08, 1)
    e.elements[1].position = 0.72; e.elements[1].color = (0.35, 0.95, 1.0, 1)
    m = e.elements.new(0.55); m.color = (0.42, 0.25, 1.0, 1)
    em = nt.nodes.new("ShaderNodeEmission"); em.inputs["Strength"].default_value = 1.4
    link(nt, tc.outputs["Object"], mp.inputs[0]); link(nt, mp.outputs[0], nz.inputs[0])
    link(nt, nz.outputs["Fac"], cr.inputs[0]); link(nt, cr.outputs[0], em.inputs[0]); link(nt, em.outputs[0], o.inputs[0])
def emit(rgb, k):
    def b(nt, o):
        em = nt.nodes.new("ShaderNodeEmission"); em.inputs[0].default_value = (*rgb, 1); em.inputs[1].default_value = k
        link(nt, em.outputs[0], o.inputs[0])
    return b

bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=1.0); shell = bpy.context.object
shell.data.materials.append(mat("glass", glass)); bpy.ops.object.shade_smooth()
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5, radius=0.62); c = bpy.context.object
c.data.materials.append(mat("core", core)); bpy.ops.object.shade_smooth()
# точечный «свет» внутри
bpy.ops.object.light_add(type="POINT", location=(0, 0, 0)); L = bpy.context.object; L.data.energy = 60; L.data.color = (0.5, 0.85, 1); L.data.shadow_soft_size = 0.5

rings = []
for i, (r, th, rgb, k, tilt) in enumerate([(1.38, 0.012, (0.25, 0.85, 1.0), 2.5, (1.25, 0.25, 0)), (1.6, 0.007, (0.55, 0.35, 1.0), 3, (1.05, -0.5, 0.4)), (1.82, 0.004, (1.0, 0.65, 0.3), 2.5, (1.5, 0.1, -0.3))]):
    bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=th, major_segments=192, minor_segments=12)
    t = bpy.context.object; t.data.materials.append(mat("ring%d" % i, emit(rgb, k)))
    piv = bpy.data.objects.new("piv%d" % i, None); s.collection.objects.link(piv); piv.rotation_euler = tilt; t.parent = piv
    rings.append((t, i))
# спутники-точки на кольцах
for i in range(3):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=(1.38 if i == 0 else 1.6 if i == 1 else 1.82, 0, 0))
    d = bpy.context.object; d.data.materials.append(mat("dot%d" % i, emit((0.85, 0.97, 1), 6))); d.parent = rings[i][0]

# анимация, бесшовная за N кадров
def lin(ob, path, idx, v0, v1):
    ob.rotation_euler[idx] = v0; ob.keyframe_insert(path, index=idx, frame=1)
    ob.rotation_euler[idx] = v1; ob.keyframe_insert(path, index=idx, frame=N + 1)
    for fc in ob.animation_data.action.fcurves:
        for kp in fc.keyframe_points: kp.interpolation = "LINEAR"
lin(c, "rotation_euler", 2, 0, 2 * math.pi); lin(c, "rotation_euler", 0, 0, 2 * math.pi)
for t, i in rings: lin(t, "rotation_euler", 2, 0, (2 * math.pi) * (1 if i != 1 else -2))

# окружение: тёмная студия с двумя цветными софтбоксами (дают блики на стекле)
w = bpy.data.worlds.new("w"); s.world = w; w.use_nodes = True; w.node_tree.nodes["Background"].inputs[1].default_value = 0.02
for loc, rgb, en in [((-3, -2, 3), (0.4, 0.8, 1), 400), ((3, -1.5, -1), (0.6, 0.4, 1), 300)]:
    bpy.ops.object.light_add(type="AREA", location=loc); a_ = bpy.context.object; a_.data.energy = en; a_.data.color = rgb; a_.data.size = 2
    a_.rotation_euler = (math.atan2(math.hypot(loc[0], loc[1]), loc[2]), 0, math.atan2(loc[0], -loc[1]) + math.pi)
bpy.ops.object.camera_add(location=(0, -6.2, 0), rotation=(math.pi / 2, 0, 0)); s.camera = bpy.context.object; s.camera.data.lens = 50

s.render.filepath = out.rstrip("/") + "/orb_"
if only is not None:
    s.frame_set(only); s.render.filepath = out.rstrip("/") + "/test_%03d.png" % only; bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
print("DONE")
