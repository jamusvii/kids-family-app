---
description: 하이클래스 알림장 PDF를 파싱하여 Supabase DB에 업데이트하는 워크플로우
---

# 하이클래스 알림장 업데이트 워크플로우

사용자가 "새 알림장 업데이트 해줘" 또는 "알림장 업데이트"라고 요청하면 아래 단계를 자동으로 수행합니다.

## 사전 조건
- 사용자가 새 PDF를 `c:\claude_code\kids\docs\hiclass\` 폴더에 저장한 상태

## 수행 단계

1. `c:\claude_code\kids\docs\hiclass\` 폴더에서 새 PDF 파일을 확인합니다
2. `pymupdf` 라이브러리로 PDF 텍스트를 추출합니다
3. 추출된 텍스트에서 아래 정보를 구조화합니다:
   - 어떤 아이의 알림장인지 (이연준/이아연)
   - 주간 시간표
   - 준비물 목록
   - 주간 학습 내용
   - 학교 행사/일정
   - 안전 지도, 학교 생활 안내
   - 알림장 공지사항
4. Supabase Python SDK를 사용하여 DB에 데이터를 upsert합니다
   - 접속 정보: `SUPABASE_URL=https://dekhesrcfsrhpyufiynl.supabase.co`
   - 접속 정보: `SUPABASE_KEY=sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp`
5. 처리 결과를 사용자에게 보고합니다

## 주요 테이블

| 테이블 | 용도 |
|--------|------|
| `timetables` | 주간 시간표 (child_id, week_start, day, period, subject) |
| `todos` | 할일/준비물 (source='hiclass') |
| `events` | D-Day/행사 |
| `notices` | 알림장 원문 |
| `weekly_curriculum` | 주간 학습 내용 |
| `school_info` | 아침활동, 안전지도, 학교생활 안내, 연락처 |
| `bus_schedules` | 통학버스 (변경 시에만 업데이트) |

## 자녀 정보

| ID | 이름 | 학교 | 학년-반 |
|----|------|------|---------|
| `yeonjun` | 이연준 | 정현초등학교 | 6-9 |
| `ahyeon` | 이아연 | 정현초등학교 | 3-4 |
