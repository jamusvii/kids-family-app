"""
Migration v2 시딩: 방과후학습 + 매일숙제 + 학원 placeholder
Supabase SQL Editor에서 migration_v2.sql 실행 후 이 스크립트 실행
"""
from supabase import create_client

SUPABASE_URL = "https://dekhesrcfsrhpyufiynl.supabase.co"
SUPABASE_KEY = "sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def seed_after_school():
    supabase.table("after_school_programs").delete().neq("id", 0).execute()
    data = [
        # 이아연 방과후학습
        {"child_id": "ahyeon", "day": "화", "program_name": "컴퓨터수업",
         "start_time": "14:00", "end_time": "15:10", "location": "컴퓨터실",
         "pickup_method": "parent_pickup"},
        {"child_id": "ahyeon", "day": "금", "program_name": "도서관 + 창의게임수학",
         "start_time": "15:00", "end_time": "16:10", "location": "도서관/교실",
         "pickup_method": "parent_pickup"},
    ]
    supabase.table("after_school_programs").insert(data).execute()
    print("✅ after_school_programs 시딩 완료")

def seed_daily_homework():
    """매일숙제를 todos 테이블에 recurrence='daily'로 저장"""
    # 기존 daily todos 삭제
    supabase.table("todos").delete().eq("recurrence", "daily").execute()
    
    homework_items = ["한자", "연산수학", "기탄국어", "독서"]
    data = []
    for child_id in ["yeonjun", "ahyeon"]:
        for item in homework_items:
            data.append({
                "child_id": child_id,
                "title": item,
                "category": "숙제",
                "sub_category": "homework",
                "recurrence": "daily",
                "priority": "medium",
                "is_completed": False,
                "source": "user",
            })
    supabase.table("todos").insert(data).execute()
    print("✅ 매일숙제 시딩 완료 (8건)")

def seed_academies():
    """학원 placeholder — 요일/시간은 추후 업데이트"""
    supabase.table("academies").delete().neq("id", 0).execute()
    data = [
        {"child_id": "ahyeon", "type": "피아노", "academy_name": None, "day": "TBD", "start_time": None, "end_time": None},
        {"child_id": "ahyeon", "type": "영어", "academy_name": None, "day": "TBD", "start_time": None, "end_time": None},
        {"child_id": "yeonjun", "type": "수학", "academy_name": None, "day": "TBD", "start_time": None, "end_time": None},
        {"child_id": "yeonjun", "type": "영어", "academy_name": None, "day": "TBD", "start_time": None, "end_time": None},
    ]
    supabase.table("academies").insert(data).execute()
    print("✅ academies 시딩 완료 (4건 placeholder)")

if __name__ == "__main__":
    print("🚀 Migration v2 시딩 시작...")
    try:
        seed_after_school()
        seed_daily_homework()
        seed_academies()
        print("\n🎉 완료!")
    except Exception as e:
        import traceback; traceback.print_exc()
