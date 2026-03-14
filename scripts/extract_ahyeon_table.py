import pdfplumber

pdf_path = r"c:\claude_code\kids\docs\hiclass\이아연\20260313\3학년4반 1학기3주 주간학습안내(2026-03-13-0348).pdf"
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[0]
    tables = page.extract_tables()
    
    for i, table in enumerate(tables):
        print(f"=== Table {i} ===")
        for row in table:
            # clear new lines to make it printable
            if row:
                print(" | ".join([str(cell).replace('\n', ' ') for cell in row]))
