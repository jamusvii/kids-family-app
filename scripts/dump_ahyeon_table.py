import pdfplumber

pdf_path = r"c:\claude_code\kids\docs\hiclass\이아연\20260313\3학년4반 1학기3주 주간학습안내(2026-03-13-0348).pdf"
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[0]
    tables = page.extract_tables()
    
    with open(r"c:\claude_code\kids\scripts\ahyeon_3_16_table.txt", "w", encoding="utf-8") as f:
        for i, table in enumerate(tables):
            f.write(f"=== Table {i} ===\n")
            for row in table:
                if row:
                    f.write(" | ".join([str(cell).replace('\n', ' ') for cell in row]) + "\n")
