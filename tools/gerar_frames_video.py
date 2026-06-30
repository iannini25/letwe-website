#!/usr/bin/env python3
"""
Gera os frames da hero a partir do VÍDEO DE IA (Higgsfield/Veo 3.1), pelo método
"CINEMAGRAPH POR MÁSCARA" — à prova de falhas p/ a fidelidade exigida pelo projeto.

POR QUÊ (resumo da análise do vídeo):
  O vídeo gerado tem um DOLLY (push-in) com parallax: o maquinário do fundo
  (guindastes/pórticos/mastros) NÃO fica parado — ele escala/desloca e as lanças
  finas chegam a deformar. Modelos imagem→vídeo não garantem estrutura rígida.
  Comprovado por anáglifo (frame 0 vs 143): as gruas saem do lugar.

COMO (a solução):
  • BASE = a FOTO original parada (pixels perfeitos, zero deformação).
  • Do VÍDEO aproveita-se SÓ o que pode se mover, recortado por máscara feathered:
      - o CÉU (nuvens/luz do crepúsculo derivando), ACIMA da linha do maquinário;
      - a ESTRADA (faróis/lanternas dos veículos em movimento).
  • As ESTRUTURAS que furam o céu (gruas, mastros, chaminé) são RECORTADAS da
    máscara (detecção de silhueta na foto + 2 traços manuais p/ as lanças de
    baixíssimo contraste) → sempre vêm da foto, nunca fantasmeiam.
  • O brilho/cor médio do céu e da estrada é FIXADO ao da foto por frame → costura
    invisível, sem flicker; só as nuvens e os veículos se mexem.
  • O "avanço de câmera" é um ZOOM 2D UNIFORME (1.00→1.045) que escala tudo por
    igual — não deforma nada (mesma técnica do gerar_frames.py).

Saídas: assets/frames-video/  (desktop 1280x714) e assets/frames-mobile/ (9:16),
        em JPG (otimizado/progressivo) e WebP, + poster atualizado.

Uso:  python tools/gerar_frames_video.py
Requer: av (PyAV), numpy, Pillow.
"""
import os, av, numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO  = os.path.join(ROOT, "assets/video/letwe-hero.mp4")
PHOTO  = os.path.join(ROOT, "assets/img/porto-rodovia-original.png")
DESK   = os.path.join(ROOT, "assets/frames-video")
MOB    = os.path.join(ROOT, "assets/frames-mobile")
POSTER = os.path.join(ROOT, "assets/img/poster.jpg")

# ---- parâmetros ----
DESK_N, DESK_W, DESK_H = 100, 1280, 714      # set desktop
MOB_N,  MOB_W,  MOB_H  = 72,  480, 854       # set mobile (9:16)
MOB_CX, MOB_HALF       = 0.34, 9/16/2        # crop retrato: centro e meia-largura (em fração da altura)
ZMAX                   = 1.045               # avanço de câmera (zoom 2D uniforme)
JPG_Q, WEBP_Q          = 78, 76
MW, MH                 = 1280, 714           # resolução em que a máscara foi validada

def luma(a): return a @ np.array([0.299, 0.587, 0.114], np.float32)
def smoothstep(t): return t * t * (3.0 - 2.0 * t)
def hblur(a, k):
    pad = k // 2; ap = np.pad(a, ((0, 0), (pad + 1, pad)), mode="edge")
    cs = np.cumsum(ap, axis=1); return (cs[:, k:] - cs[:, :-k]) / k

# ------------------------------------------------------------------ máscara
def build_masks():
    """Constrói céu+estrada em MWxMH (resolução validada) e devolve floats 0..1."""
    base = np.asarray(Image.open(PHOTO).convert("RGB").resize((MW, MH), Image.LANCZOS)).astype(np.float32)
    L = luma(base); yy = np.arange(MH)[:, None]

    # limite inferior do céu (logo acima da cumeeira/horizonte)
    sky_pts = [(0.00,0.555),(0.20,0.555),(0.32,0.55),(0.46,0.553),(0.60,0.555),(0.78,0.558),(1.00,0.56)]
    xs = np.array([p[0] for p in sky_pts]); ys = np.array([p[1] for p in sky_pts])
    boundary = np.interp(np.arange(MW)/(MW-1), xs, ys) * MH
    sky_region = (yy < boundary[None, :]).astype(np.float32)

    # recorte de estruturas contra o céu (silhuetas largas + finas verticais)
    dev  = np.abs(L - hblur(L, 81))
    devs = np.abs(L - hblur(L, 15))
    upper = (yy < 0.50*MH)
    struct = (((dev > 10) | ((devs > 5) & upper)) & (yy < 0.62*MH)).astype(np.uint8) * 255
    si = Image.fromarray(struct)
    for _ in range(3): si = si.filter(ImageFilter.MaxFilter(9))   # dilata ~15px
    structf = np.asarray(si.filter(ImageFilter.GaussianBlur(5))).astype(np.float32) / 255.0
    sky = sky_region * (1.0 - structf)

    # 2 lanças finas de contraste ~nulo: exclusão manual (sempre da foto)
    excl = Image.new("L", (MW, MH), 0); de = ImageDraw.Draw(excl)
    strokes = [([(0.745,0.325),(0.749,0.40),(0.752,0.45),(0.753,0.50)], 30),
               ([(0.974,0.372),(0.977,0.41),(0.978,0.455)], 24)]
    for pts, w in strokes:
        de.line([(x*MW, y*MH) for x, y in pts], fill=255, width=w, joint="curve")
    exclf = np.asarray(excl.filter(ImageFilter.GaussianBlur(4))).astype(np.float32) / 255.0
    sky = sky * (1.0 - exclf)
    sky = np.asarray(Image.fromarray((sky*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5))).astype(np.float32)/255.0

    # estrada (asfalto, canto inferior-esquerdo)
    road_pts = [(0.00,0.605),(0.14,0.625),(0.28,0.665),(0.40,0.705),(0.50,0.745),(0.52,1.0),(0.00,1.0)]
    rimg = Image.new("L", (MW, MH), 0)
    ImageDraw.Draw(rimg).polygon([(x*MW, y*MH) for x, y in road_pts], fill=255)
    road = np.asarray(rimg.filter(ImageFilter.GaussianBlur(8))).astype(np.float32) / 255.0
    return sky, road

# ------------------------------------------------------------------ vídeo
def decode_video():
    c = av.open(VIDEO); frames = [f.to_ndarray(format="rgb24") for f in c.decode(video=0)]; c.close()
    return frames

def main():
    os.makedirs(DESK, exist_ok=True); os.makedirs(MOB, exist_ok=True)
    print("decodificando vídeo…"); vid = decode_video(); NV = len(vid)
    vH, vW, _ = vid[0].shape
    print(f"  {NV} frames {vW}x{vH}")

    base = np.asarray(Image.open(PHOTO).convert("RGB"), dtype=np.float32)   # 1376x768 nativo
    WH, WW, _ = base.shape
    print(f"base/trabalho: {WW}x{WH}")

    sky_m, road_m = build_masks()
    up = lambda m: np.asarray(Image.fromarray((m*255).astype(np.uint8)).resize((WW, WH), Image.LANCZOS)).astype(np.float32)/255.0
    sky = up(sky_m)[..., None]; road = up(road_m)[..., None]
    skyROI = sky[..., 0] > 0.5; roadROI = road[..., 0] > 0.5
    bm_sky = base[skyROI].mean(0); bm_road = base[roadROI].mean(0)

    def map_video(idx):
        # vídeo (1.778) -> largura WW, crop central p/ WH (alinha com a foto)
        nh = round(WW * vH / vW)
        a = np.asarray(Image.fromarray(vid[idx]).resize((WW, nh), Image.LANCZOS)).astype(np.float32)
        top = (nh - WH)//2
        return a[top:top+WH]

    def compose(idx):
        v = map_video(idx)
        vs = np.clip(v + (bm_sky  - v[skyROI].mean(0)),  0, 255)
        vr = np.clip(v + (bm_road - v[roadROI].mean(0)), 0, 255)
        out = base*(1-sky) + vs*sky
        out = out*(1-road) + vr*road
        return out

    def zoom_crop(img, z, ow, oh, cx=0.5, halfw_frac=None):
        """Recorta uma janela (com zoom uniforme) e redimensiona p/ (ow,oh). Sempre downscale."""
        H, W, _ = img.shape
        if halfw_frac is None:                       # desktop: usa a largura toda
            cw, ch = W/z, H/z; left = (W-cw)/2
        else:                                        # mobile: janela retrato 9:16
            ch = H/z; cw = ch*ow/oh; left = cx*W - cw/2
        top = (H-ch)/2
        left = min(max(0, left), W-cw)
        box = (left, top, left+cw, top+ch)
        return Image.fromarray(img.astype(np.uint8)).resize((ow, oh), Image.LANCZOS, box=box)

    def save(im, path_noext):
        im.save(path_noext+".jpg", "JPEG", quality=JPG_Q, optimize=True, progressive=True)
        im.save(path_noext+".webp", "WEBP", quality=WEBP_Q, method=6)

    # ---- desktop ----
    tot_j = tot_w = 0
    for j in range(DESK_N):
        t = j/(DESK_N-1); z = 1.0 + (ZMAX-1.0)*smoothstep(t)
        src = round(t*(NV-1))
        im = zoom_crop(compose(src), z, DESK_W, DESK_H)
        p = os.path.join(DESK, f"f_{j+1:03d}")
        save(im, p)
        tot_j += os.path.getsize(p+".jpg"); tot_w += os.path.getsize(p+".webp")
        if j == 0:
            im.save(POSTER, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"desktop: {DESK_N} frames {DESK_W}x{DESK_H} | JPG {tot_j/1048576:.2f} MB | WebP {tot_w/1048576:.2f} MB | média JPG {tot_j/DESK_N/1024:.0f} KB")

    # ---- mobile (9:16) ----
    mj = mw = 0
    for j in range(MOB_N):
        t = j/(MOB_N-1); z = 1.0 + (ZMAX-1.0)*smoothstep(t)
        src = round(t*(NV-1))
        im = zoom_crop(compose(src), z, MOB_W, MOB_H, cx=MOB_CX, halfw_frac=MOB_HALF)
        p = os.path.join(MOB, f"f_{j+1:03d}")
        save(im, p)
        mj += os.path.getsize(p+".jpg"); mw += os.path.getsize(p+".webp")
    print(f"mobile : {MOB_N} frames {MOB_W}x{MOB_H} | JPG {mj/1048576:.2f} MB | WebP {mw/1048576:.2f} MB | média JPG {mj/MOB_N/1024:.0f} KB")
    print("poster:", POSTER)

if __name__ == "__main__":
    main()
