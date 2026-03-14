import fitz  # PyMuPDF

pdf_path = r"c:\claude_code\kids\docs\hiclass\이아연\20260313\3학년4반 1학기3주 주간학습안내(2026-03-13-0348).pdf"
doc = fitz.open(pdf_path)
page = doc.load_page(0)

print("=== Text with layout preservation ===")
print(page.get_text("text", sort=True))

print("=== Blocks ===")
blocks = page.get_text("blocks")
for b in blocks:
    print(b[4])
