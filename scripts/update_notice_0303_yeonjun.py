"""이연준 3/3 일일 알림장 업데이트"""
from supabase import create_client

sb = create_client('https://dekhesrcfsrhpyufiynl.supabase.co', 'sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp')

# 1. 알림장 저장
notice = {
    'child_id': 'yeonjun',
    'title': '3/3 알림장',
    'date': '2026-03-03',
    'source': '6학년 9반 · 권세린 선생님',
    'content': '1. 가정통신문 4장 중 3장 내일(3/4)까지 제출\n2. 준비물: 색칠도구, 읽을 책 (없는 사람)\n3. 하이클래스 앱 설치 → 학생/학부모 우리반 가입 (초대코드: 40722170)\n4. 내일(3/4)부터 방과후수업 시작',
    'is_new': True,
    'notice_type': 'notice'
}
sb.table('notices').insert(notice).execute()
print('✅ 알림장 저장')

# 2. 이전 알림 is_new=false
sb.table('notices').update({'is_new': False}).eq('child_id', 'yeonjun').neq('date', '2026-03-03').execute()

# 3. 오늘할일 (내일 바로 필요)
sb.table('todos').insert([
    {'child_id': 'yeonjun', 'title': '가정통신문 3장 제출 (내일까지)', 'category': '학교', 'sub_category': 'school', 'due_date': '2026-03-04', 'priority': 'high', 'source': 'hiclass', 'recurrence': 'once'},
    {'child_id': 'yeonjun', 'title': '색칠도구 + 읽을 책 챙기기', 'category': '준비물', 'sub_category': 'school', 'due_date': '2026-03-04', 'priority': 'medium', 'source': 'hiclass', 'recurrence': 'once'},
]).execute()
print('✅ 오늘할일 2건')

# 4. 주간할일
sb.table('todos').insert([
    {'child_id': 'yeonjun', 'title': '하이클래스 앱 설치 + 우리반 가입 (초대코드: 40722170)', 'category': '학교', 'sub_category': 'school', 'due_date': '2026-03-07', 'priority': 'high', 'source': 'hiclass', 'recurrence': 'once'},
]).execute()
print('✅ 주간할일 1건')

print('\n🎉 이연준 3/3 알림장 업데이트 완료!')
