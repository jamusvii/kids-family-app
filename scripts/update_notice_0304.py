"""이연준 & 이아연 3/4 일일 알림장 업데이트"""
from supabase import create_client

sb = create_client('https://dekhesrcfsrhpyufiynl.supabase.co', 'sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp')

TODAY = '2026-03-04'

# ============================================================
# 이연준 (6학년 9반 · 권세린 선생님)
# ============================================================

# 1. 알림장 저장
notice_yj = {
    'child_id': 'yeonjun',
    'title': '3/4 알림장',
    'date': TODAY,
    'source': '6학년 9반 · 권세린 선생님',
    'content': '1. 다음주 월 1~2교시 학급임원선거\n2. 내일 5교시 체육선생님 수업(교실)\n3. 교실에서 예의, 약속 잘 지키는 사람되기 (놀·욕·때·빼·험·따 X)\n4. 가정통신문 3장 내일까지 반드시 제출',
    'is_new': True,
    'notice_type': 'notice'
}
sb.table('notices').insert(notice_yj).execute()
print('✅ 이연준 알림장 저장')

# 2. 이전 알림 is_new=false
sb.table('notices').update({'is_new': False}).eq('child_id', 'yeonjun').neq('date', TODAY).execute()

# 3. 할일
sb.table('todos').insert([
    {'child_id': 'yeonjun', 'title': '가정통신문 3장 제출 (내일까지)', 'category': '학교', 'sub_category': 'school', 'due_date': '2026-03-05', 'priority': 'high', 'source': 'hiclass', 'recurrence': 'once'},
    {'child_id': 'yeonjun', 'title': '내일 5교시 체육수업 (교실)', 'category': '학교', 'sub_category': 'school', 'due_date': '2026-03-05', 'priority': 'medium', 'source': 'hiclass', 'recurrence': 'once'},
]).execute()
print('✅ 이연준 할일 2건')

# 주간 할일
sb.table('todos').insert([
    {'child_id': 'yeonjun', 'title': '학급임원선거 (월 1~2교시)', 'category': '학교', 'sub_category': 'school', 'due_date': '2026-03-09', 'priority': 'medium', 'source': 'hiclass', 'recurrence': 'once'},
]).execute()
print('✅ 이연준 주간할일 1건')

# ============================================================
# 이아연 (3학년 4반 · 지민지 선생님)
# ============================================================

# 1. 알림장 저장
notice_ay = {
    'child_id': 'ahyeon',
    'title': '3/4 알림장',
    'date': TODAY,
    'source': '3학년 4반 · 지민지 선생님',
    'content': '1. 제출안내 - 파일에 넣어간 안내장 중 아래 3가지를 내일까지 작성해주세요.\n- 행정정보공동이용 사전 동의서 + 개인정보 동의서(양면)\n- 응급환자 관리 안내 및 건강상태 조사서\n- 학생기초자료 조사서',
    'is_new': True,
    'notice_type': 'notice'
}
sb.table('notices').insert(notice_ay).execute()
print('✅ 이아연 알림장 저장')

# 2. 이전 알림 is_new=false
sb.table('notices').update({'is_new': False}).eq('child_id', 'ahyeon').neq('date', TODAY).execute()

# 3. 할일
sb.table('todos').insert([
    {'child_id': 'ahyeon', 'title': '행정정보공동이용 사전 동의서 + 개인정보 동의서 작성 제출', 'category': '학교', 'sub_category': 'school', 'due_date': '2026-03-05', 'priority': 'high', 'source': 'hiclass', 'recurrence': 'once'},
    {'child_id': 'ahyeon', 'title': '응급환자 관리 안내 및 건강상태 조사서 작성 제출', 'category': '학교', 'sub_category': 'school', 'due_date': '2026-03-05', 'priority': 'high', 'source': 'hiclass', 'recurrence': 'once'},
    {'child_id': 'ahyeon', 'title': '학생기초자료 조사서 작성 제출', 'category': '학교', 'sub_category': 'school', 'due_date': '2026-03-05', 'priority': 'high', 'source': 'hiclass', 'recurrence': 'once'},
]).execute()
print('✅ 이아연 할일 3건')

print('\n🎉 3/4 알림장 업데이트 완료! (이연준 + 이아연)')
