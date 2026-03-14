import fitz  # PyMuPDF
import sys

def extract_text(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    ahyeon_pdf = r"c:\claude_code\kids\docs\hiclass\이아연\20260313\3학년4반 1학기3주 주간학습안내(2026-03-13-0348).pdf"
    yeonjun_pdf = r"c:\claude_code\kids\docs\hiclass\이연준\20260313\가정통신문(2027학년도 중학교 입학 배정 시 학구위반 적용 안내).pdf"
    
    print("=== Ah-yeon PDF ===")
    print(extract_text(ahyeon_pdf))
    print("\n\n=== Yeon-jun PDF ===")
    print(extract_text(yeonjun_pdf))
