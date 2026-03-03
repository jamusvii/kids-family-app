"""이미지 처리: 프로필 복사 + 아이콘 크롭/리사이즈"""
from PIL import Image
import shutil

SRC = "docs/image"
ICONS = "app/public/icons"
IMAGES = "app/public/images"

# 1. 프로필 이미지 복사 (원본 그대로)
shutil.copy(f"{SRC}/alrimi_ayeon.png", f"{IMAGES}/profile_ahyeon.png")
print("✅ 이아연 프로필 복사 완료")

shutil.copy(f"{SRC}/alrimi_jun.png", f"{IMAGES}/profile_yeonjun.png")
print("✅ 이연준 프로필 복사 완료")

# 2. 아이콘 크롭 (아이들 중심 + 무지개 포함)
icon_src = Image.open(f"{SRC}/alrimi_icon.png")
w, h = icon_src.size
print(f"  원본 아이콘 크기: {w}x{h}")

# 중심 크롭 — 상단(무지개)~하단(아이들 몸) 포함, 좌우 약간 트리밍
# 무지개 상단부터 아이들 상체까지 포함하는 정사각형
margin_x = int(w * 0.08)
margin_top = int(h * 0.03)
margin_bottom = int(h * 0.12)
crop_box = (margin_x, margin_top, w - margin_x, h - margin_bottom)
cropped = icon_src.crop(crop_box)

# 정사각형으로 만들기
cw, ch = cropped.size
size = max(cw, ch)
square = Image.new('RGBA', (size, size), (255, 255, 255, 0))
offset_x = (size - cw) // 2
offset_y = (size - ch) // 2
square.paste(cropped, (offset_x, offset_y))

# 192x192, 512x512 리사이즈
icon_192 = square.resize((192, 192), Image.LANCZOS)
icon_512 = square.resize((512, 512), Image.LANCZOS)
apple_touch = square.resize((180, 180), Image.LANCZOS)

icon_192.save(f"{ICONS}/icon-192.png")
icon_512.save(f"{ICONS}/icon-512.png")
apple_touch.save(f"{ICONS}/apple-touch-icon.png")

print("✅ 아이콘 크롭 + 리사이즈 완료 (192/512/apple-touch)")
print("\n🎉 모든 이미지 처리 완료!")
