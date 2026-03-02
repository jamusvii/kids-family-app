"""
우리가족 알리미 — Supabase DB 초기화 & 시딩 스크립트
- 테이블 생성 (SQL 실행)
- 초기 데이터 삽입 (children, bus_schedules, 현재 알림장 데이터)
"""
import os
import sys
from supabase import create_client

SUPABASE_URL = "https://dekhesrcfsrhpyufiynl.supabase.co"
SUPABASE_KEY = "sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def seed_children():
    """자녀 기본 정보"""
    data = [
        {"id": "yeonjun", "name": "이연준", "school": "정현초등학교", "grade": 6, "class_number": 9, "theme": "mint", "profile_image": "/images/profile_yeonjun.png"},
        {"id": "ahyeon", "name": "이아연", "school": "정현초등학교", "grade": 3, "class_number": 4, "theme": "pink", "profile_image": "/images/profile_ahyeon.png"},
    ]
    supabase.table("children").upsert(data, on_conflict="id").execute()
    print("✅ children 시딩 완료")

def seed_bus_schedules():
    """통학버스 시간표"""
    # 먼저 기존 데이터 삭제
    supabase.table("bus_schedules").delete().neq("id", 0).execute()
    
    data = [
        # 이아연 등교 (매일)
        {"child_id": "ahyeon", "type": "commute", "day": None, "route": "12회차", "departure_location": "4단지", "departure_time": "08:43", "arrival_location": "학교", "arrival_time": "08:48"},
        # 이아연 하교 (요일별)
        {"child_id": "ahyeon", "type": "dismissal", "day": "월", "route": "6회차", "departure_location": "학교", "departure_time": "14:00", "arrival_location": "4단지", "arrival_time": "14:09"},
        {"child_id": "ahyeon", "type": "dismissal", "day": "화", "route": "2회차", "departure_location": "학교", "departure_time": "13:55", "arrival_location": "4단지", "arrival_time": "14:04"},
        {"child_id": "ahyeon", "type": "dismissal", "day": "수", "route": "12회차", "departure_location": "학교", "departure_time": "14:45", "arrival_location": "4단지", "arrival_time": "14:54"},
        {"child_id": "ahyeon", "type": "dismissal", "day": "목", "route": "2회차", "departure_location": "학교", "departure_time": "13:55", "arrival_location": "4단지", "arrival_time": "14:04"},
        {"child_id": "ahyeon", "type": "dismissal", "day": "금", "route": "6회차", "departure_location": "학교", "departure_time": "14:00", "arrival_location": "4단지", "arrival_time": "14:09"},
    ]
    supabase.table("bus_schedules").insert(data).execute()
    print("✅ bus_schedules 시딩 완료")

def seed_timetables():
    """시간표 (1주차 3/3~3/6)"""
    supabase.table("timetables").delete().neq("id", 0).execute()
    
    week_start = "2026-03-03"
    
    # 이연준 시간표 (day: 0=월 ~ 4=금)
    yj = [
        # 화(1)
        (1,1,"자율"),(1,2,"자율"),(1,3,"자율"),(1,4,"국어"),(1,5,"미술"),
        # 수(2)
        (2,1,"국어"),(2,2,"자율"),(2,3,"자율"),(2,4,"미술"),(2,5,"체육"),(2,6,"자율"),
        # 목(3)
        (3,1,"국어"),(3,2,"수학"),(3,3,"사회"),(3,4,"음악"),(3,5,"자율"),
        # 금(4)
        (4,1,"국어"),(4,2,"수학"),(4,3,"실과"),(4,4,"음악"),(4,5,"자율"),
    ]
    
    # 이아연 시간표
    ay = [
        # 화(1)
        (1,1,"자율"),(1,2,"자율"),(1,3,"자율"),(1,4,"자율"),(1,5,"자율"),
        # 수(2)
        (2,1,"영어"),(2,2,"국어"),(2,3,"국어"),(2,4,"수학"),(2,5,"미술"),(2,6,"미술"),
        # 목(3)
        (3,1,"국어"),(3,2,"국어"),(3,3,"사회"),(3,4,"영어"),(3,5,"자율"),
        # 금(4)
        (4,1,"과학"),(4,2,"수학"),(4,3,"음악"),(4,4,"수학"),(4,5,"자율"),
    ]
    
    rows = []
    for day, period, subject in yj:
        rows.append({"child_id": "yeonjun", "week_start": week_start, "day": day, "period": period, "subject": subject})
    for day, period, subject in ay:
        rows.append({"child_id": "ahyeon", "week_start": week_start, "day": day, "period": period, "subject": subject})
    
    supabase.table("timetables").insert(rows).execute()
    print("✅ timetables 시딩 완료")

def seed_todos():
    """할일/준비물"""
    supabase.table("todos").delete().neq("id", 0).execute()
    
    data = [
        # 이연준
        {"child_id": "yeonjun", "title": "연필 3자루 이상 (집에서 깎아오기)", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "검은색 네임펜 1개", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "형광펜 1개 + 색볼펜 1개", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "15cm 투명자 1개", "category": "준비물", "due_date": "2026-03-03", "priority": "medium", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "싸인펜 1세트 + 색연필 1세트", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "L자화일 1개 + A4클리어파일(30매) 1개", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "딱풀 1개 + 가위 1개", "category": "준비물", "due_date": "2026-03-03", "priority": "medium", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "휴지(또는 물티슈) + 미니 빗자루 세트", "category": "준비물", "due_date": "2026-03-03", "priority": "medium", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "📖 글밥 많은 책 1~2권 (만화/동화 X)", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "모든 물건에 이름 쓰기!", "category": "학교", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "yeonjun", "title": "개학식 — 5교시 급식 후 하교 (13:10~)", "category": "학교", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        # 이아연
        {"child_id": "ahyeon", "title": "읽을 책 + 필통(연필3자루, 네임펜, 자)", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "L파일 + 알림장 + 줄공책 + 물병", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "실내화", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "색연필 + 싸인펜(12색)", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "A4 클리어파일(40매) — 작품보관용", "category": "준비물", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "빨간색 색연필 + 형광펜 + 지우개", "category": "준비물", "due_date": "2026-03-03", "priority": "medium", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "딱풀 + 가위 + 테이프 (개인용)", "category": "준비물", "due_date": "2026-03-03", "priority": "medium", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "미니 빗자루 세트 + 캡형 물티슈 + 여행용 티슈", "category": "준비물", "due_date": "2026-03-03", "priority": "medium", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "독일식 리코더 (3월 말까지 준비)", "category": "준비물", "due_date": "2026-03-31", "priority": "low", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "모든 물건에 이름 쓰기!", "category": "학교", "due_date": "2026-03-03", "priority": "high", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "기초환경조사서 + 개인정보동의서 → L파일에 넣어 제출", "category": "과제", "due_date": "2026-03-04", "priority": "high", "source": "hiclass"},
        {"child_id": "ahyeon", "title": "연필 3자루 집에서 깎아오기", "category": "준비물", "due_date": "2026-03-03", "priority": "medium", "source": "hiclass"},
    ]
    supabase.table("todos").insert(data).execute()
    print("✅ todos 시딩 완료")

def seed_events():
    """D-Day 이벤트"""
    supabase.table("events").delete().neq("id", 0).execute()
    
    data = [
        {"child_id": "yeonjun", "title": "개학식 (시업식)", "event_date": "2026-03-03", "is_dday": True},
        {"child_id": "ahyeon", "title": "개학식 (시업식)", "event_date": "2026-03-03", "is_dday": True},
        {"child_id": "ahyeon", "title": "리코더 준비 마감", "event_date": "2026-03-31", "is_dday": True},
    ]
    supabase.table("events").insert(data).execute()
    print("✅ events 시딩 완료")

def seed_notices():
    """알림장"""
    supabase.table("notices").delete().neq("id", 0).execute()
    
    data = [
        {"child_id": "yeonjun", "title": "주간학습안내 (1주차: 3/3~3/6)", "date": "2026-03-03", "source": "6학년 9반", "is_new": True, "content": "시업식, 교과서 배부, 학급 세우기 활동. 읽을 책 1~2권 가져오기.", "notice_type": "notice"},
        {"child_id": "ahyeon", "title": "주간학습안내 (1주차: 3/3~3/6)", "date": "2026-03-03", "source": "3학년 4반", "is_new": True, "content": "시업식, 자기소개, 학급규칙 및 급식 질서 배우기. 인성교육.", "notice_type": "notice"},
        {"child_id": "ahyeon", "title": "담임 인사 및 준비물 안내", "date": "2026-03-03", "source": "담임 지민지", "is_new": True, "content": "학용품 목록, 학급 운영 방침, 학교 생활 안내.", "notice_type": "notice"},
        {"child_id": "ahyeon", "title": "3월 개학 안내 알림장", "date": "2026-02-27", "source": "3학년 4반", "is_new": False, "content": "3학년 4반 교실(본관 3층), 8:55까지 등교, 교과서 개학날 배부, 수요일만 6교시.", "notice_type": "notice"},
    ]
    supabase.table("notices").insert(data).execute()
    print("✅ notices 시딩 완료")

def seed_weekly_curriculum():
    """주간 학습 내용"""
    supabase.table("weekly_curriculum").delete().neq("id", 0).execute()
    
    week = "2026-03-03"
    data = [
        # 이연준
        {"child_id": "yeonjun", "week_start": week, "subject_name": "국어", "content": "대단원 살펴보기, 주제 중심 독서하기 (1~2/6)"},
        {"child_id": "yeonjun", "week_start": week, "subject_name": "수학", "content": "(자연수)÷(자연수)의 몫을 분수로 나타내요 (단원도입~1)"},
        {"child_id": "yeonjun", "week_start": week, "subject_name": "사회", "content": "단원 도입"},
        {"child_id": "yeonjun", "week_start": week, "subject_name": "실과", "content": "가정생활의 중요성을 알아볼까요"},
        {"child_id": "yeonjun", "week_start": week, "subject_name": "미술", "content": "이름표 만들기, 우리 반 일력 만들기"},
        {"child_id": "yeonjun", "week_start": week, "subject_name": "음악", "content": "새로운 마음으로 (1/2), 국악수업 (1)"},
        {"child_id": "yeonjun", "week_start": week, "subject_name": "체육", "content": "전담선생님 수업"},
        # 이아연
        {"child_id": "ahyeon", "week_start": week, "subject_name": "국어", "content": "짐작한 내용을 생각하며 책 읽기 (1~2/2), 책 소개하기"},
        {"child_id": "ahyeon", "week_start": week, "subject_name": "수학", "content": "단원 도입, 세 자리 수의 덧셈을 할 수 있어요 (1~2)"},
        {"child_id": "ahyeon", "week_start": week, "subject_name": "영어", "content": "Listen, Read and Do / Chant and Do / ABC Play"},
        {"child_id": "ahyeon", "week_start": week, "subject_name": "과학", "content": "꼬마 과학자의 봄나들이"},
        {"child_id": "ahyeon", "week_start": week, "subject_name": "사회", "content": "학습의 필요성 알고 학습 계획 세우기"},
        {"child_id": "ahyeon", "week_start": week, "subject_name": "음악", "content": "어깨동무"},
        {"child_id": "ahyeon", "week_start": week, "subject_name": "미술", "content": "지구촌 친구들, 생활 속에서 색 찾기"},
    ]
    supabase.table("weekly_curriculum").insert(data).execute()
    print("✅ weekly_curriculum 시딩 완료")

def seed_school_info():
    """학교 정보"""
    supabase.table("school_info").delete().neq("id", 0).execute()
    
    data = [
        # 이연준
        {"child_id": "yeonjun", "info_type": "morning_activity", "content": "아침 독서 — 글밥 많은 책 1~2권 준비 (만화/동화책 X). 아침 시간만큼은 책에 몰입하는 시간!", "sort_order": 0},
        {"child_id": "yeonjun", "info_type": "safety_rule", "content": "교통안전: 초록불에 건너기, 깜박일 때 건너지 않기, 무단횡단 금지", "sort_order": 0},
        {"child_id": "yeonjun", "info_type": "safety_rule", "content": "도로에서 인라인/자전거 타지 않기, 보호 장구 착용", "sort_order": 1},
        {"child_id": "yeonjun", "info_type": "safety_rule", "content": "도로에서 공놀이하지 않기", "sort_order": 2},
        {"child_id": "yeonjun", "info_type": "safety_rule", "content": "교실/복도/계단에서 뛰지 않기", "sort_order": 3},
        {"child_id": "yeonjun", "info_type": "safety_rule", "content": "주변을 살펴보고 안전하게 놀이 활동하기", "sort_order": 4},
        {"child_id": "yeonjun", "info_type": "safety_rule", "content": "학교폭력예방: 친구들을 괴롭히거나 때리지 않기", "sort_order": 5},
        {"child_id": "yeonjun", "info_type": "school_life_rule", "content": "핸드폰은 학교 내에서 전원 끄기 (소지 및 분실은 개인 책임)", "sort_order": 0},
        {"child_id": "yeonjun", "info_type": "school_life_rule", "content": "돈, 게임기 등 분실 우려 높은 물건 가져오지 않기", "sort_order": 1},
        {"child_id": "yeonjun", "info_type": "school_life_rule", "content": "모든 개인 물건에 반드시 이름 쓰기!", "sort_order": 2},
        {"child_id": "yeonjun", "info_type": "school_life_rule", "content": "준비물은 되도록 새로 사지 말고 전 학년 것 재활용", "sort_order": 3},
        # 이아연
        {"child_id": "ahyeon", "info_type": "morning_activity", "content": "아침 독서 — 책 읽고 자기 생각 표현하기. 틈새 시간(아침시간) 활용 독서.", "sort_order": 0},
        {"child_id": "ahyeon", "info_type": "safety_rule", "content": "복도에서 뛰지 않고 우측통행", "sort_order": 0},
        {"child_id": "ahyeon", "info_type": "safety_rule", "content": "무단횡단 하지 않기, 신호등 있어도 없어도 늘 조심", "sort_order": 1},
        {"child_id": "ahyeon", "info_type": "safety_rule", "content": "미세먼지 및 감염병 예방을 위해 손 씻기", "sort_order": 2},
        {"child_id": "ahyeon", "info_type": "safety_rule", "content": "상대방을 배려하는 말과 행동으로 학교폭력 예방", "sort_order": 3},
        {"child_id": "ahyeon", "info_type": "school_life_rule", "content": "교과서는 사물함에 두고 사용 (가져갈 경우 다시 챙겨오기)", "sort_order": 0},
        {"child_id": "ahyeon", "info_type": "school_life_rule", "content": "핸드폰은 교실 도착 시 전원 끄고 가방에 보관, 하교 시 전원 켜기", "sort_order": 1},
        {"child_id": "ahyeon", "info_type": "school_life_rule", "content": "돈, 게임기 등 분실 우려 높은 물건 가져오지 않기", "sort_order": 2},
        {"child_id": "ahyeon", "info_type": "school_life_rule", "content": "모든 개인 물건에 이름 쓰거나 이름스티커 붙이기!", "sort_order": 3},
        {"child_id": "ahyeon", "info_type": "school_life_rule", "content": "기본 물품은 3월 첫주까지 준비 (새로 사지 말고 전학년 것 재활용)", "sort_order": 4},
        {"child_id": "ahyeon", "info_type": "school_life_rule", "content": "연필 3자루 집에서 깎아오기 — 바른 필기 습관 (샤프 사용 자제)", "sort_order": 5},
        {"child_id": "ahyeon", "info_type": "school_life_rule", "content": "필통은 장난감 기능 없는 천 필통 추천", "sort_order": 6},
        {"child_id": "ahyeon", "info_type": "contact_info", "content": "하이클래스: 알림장, 하이톡 이용", "sort_order": 0},
        {"child_id": "ahyeon", "info_type": "contact_info", "content": "닉네임 설정: 학생이름 + 부모 (예: 이아연 부모)", "sort_order": 1},
        {"child_id": "ahyeon", "info_type": "contact_info", "content": "결석 신고: 나이스 학부모서비스 결석신고서 탑재", "sort_order": 2},
        {"child_id": "ahyeon", "info_type": "contact_info", "content": "지각/조퇴: 9시 전 하이톡 연락 (서류 없음)", "sort_order": 3},
        {"child_id": "ahyeon", "info_type": "contact_info", "content": "상담: 수업시간은 하이톡, 상담은 16:30 이전 연락", "sort_order": 4},
    ]
    supabase.table("school_info").insert(data).execute()
    print("✅ school_info 시딩 완료")

if __name__ == "__main__":
    print("🚀 DB 시딩 시작...")
    try:
        seed_children()
        seed_bus_schedules()
        seed_timetables()
        seed_todos()
        seed_events()
        seed_notices()
        seed_weekly_curriculum()
        seed_school_info()
        print("\n🎉 모든 시딩 완료!")
    except Exception as e:
        print(f"\n❌ 에러 발생: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
