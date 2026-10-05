"""
Convierte las fotos de la carpeta 'fotos_originales' a WebP ligeras en 'imagenes'.
Uso:  pip install pillow
      python optimizar_fotos.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ORIGEN = Path("fotos_originales")
DESTINO = Path("imagenes")
ANCHO_MAX = 1200
CALIDAD = 80

DESTINO.mkdir(exist_ok=True)
for foto in sorted(ORIGEN.glob("*")):
    if foto.suffix.lower() not in {".jpg", ".jpeg", ".png", ".heic", ".webp"}:
        continue
    try:
        img = ImageOps.exif_transpose(Image.open(foto)).convert("RGB")
    except Exception as e:
        print(f"No se pudo abrir {foto.name}: {e}")
        continue
    img.thumbnail((ANCHO_MAX, ANCHO_MAX))
    salida = DESTINO / (foto.stem.lower().replace(" ", "-") + ".webp")
    img.save(salida, "WEBP", quality=CALIDAD, method=6)
    print(f"{foto.name} -> {salida} ({salida.stat().st_size // 1024} KB)")
