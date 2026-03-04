"""프로필 이미지 압축 — PWA 캐시 한도 2MB 이하로"""
from PIL import Image
import os

IMAGES = "app/public/images"

for filename in ["profile_ahyeon.png", "profile_yeonjun.png"]:
    path = f"{IMAGES}/{filename}"
    img = Image.open(path)
    w, h = img.size
    print(f"원본: {filename} — {w}x{h}, {os.path.getsize(path)/1024/1024:.2f}MB")

    # 400x400 이하로 리사이즈 (비율 유지)
    max_size = 400
    ratio = min(max_size / w, max_size / h)
    new_w, new_h = int(w * ratio), int(h * ratio)
    img_small = img.resize((new_w, new_h), Image.LANCZOS)

    # JPEG 저장 (PNG보다 훨씬 작음) — .png 확장자 유지하면서 최적화
    out_path = path.replace(".png", ".jpg")
    img_rgb = img_small.convert("RGB")
    img_rgb.save(out_path, "JPEG", quality=85, optimize=True)

    size_kb = os.path.getsize(out_path) / 1024
    print(f"  → {out_path}: {new_w}x{new_h}, {size_kb:.1f}KB ✅")

print("\n⚠️  확장자가 .jpg로 변경됨 → DataContext 참조 업데이트 필요")
