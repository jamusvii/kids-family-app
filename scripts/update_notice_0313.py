"""이아연 & 이연준 3월 13일 알림장 업데이트"""
from supabase import create_client

sb = create_client(
    'https://dekhesrcfsrhpyufiynl.supabase.co',
    'sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp'
)

# 1. Notices
notices = [
    {
        'child_id': 'ahyeon',
        'title': '알림장 (3월 13일)',
        'date': '2026-03-13',
        'source': '지민지 선생님',
        'content': '1. 준비물\n- 화요일, 수요일 체육시간 : 편한 복장 및 운동화  \n\n2. 다음주 주간학습안내\n3학년4반 1학기3주 주간학습안내(2026-03-13-0348).pdf 파일 첨부됨.',
        'is_new': True,
        'notice_type': 'notice'
    },
    {
        'child_id': 'yeonjun',
        'title': '알림장 (3월 13일)',
        'date': '2026-03-13',
        'source': '권세린 선생님',
        'content': '''1. 월요일 음악시간 준비물 : 리코더
2. 월 진단평가(국어, 수학) 실시 - 부족한 부분 있으면 복습하기
3. ★학교 오면 바로 휴대폰 전원 끄기 - 벨소리, 알림음 울리는 경우가 많습니다. (수업에 방해됩니다.)

4. [학부모님께] 3/18(수) 학부모총회 14시, 시청각실 
5. [학부모님께] 아래 안내문을 확인해 주시기 바랍니다.
-졸업앨범 제작계획 수립을 위한 학부모의견조사 (이알리미)
-2027학년도 중학교 입학 배정 시 학구 위반 적용 안내 (하이클래스)
(끝)

한 주의 편지💌
 이번 주는 본격적으로 많은 것들이 새롭게 시작된 한 주였지요?
교과서 공부, 부서 활동, 태블릿 수업, 배움 공책까지...
바쁘게 한 주를 살아낸 우리 모두 고생이 많았습니다.
여러분 모두 우리 반 친구들과는 많이 친해졌나요?
아직 어색한 친구가 있다면, 용기내어 먼저 다가가 따뜻한 말 한 마디를 건네 봅시다.
 그리고 수업 시간 글쓰기, 그리기 등 다양한 학습활동을 할 때 끝까지 최선을 다하는 여러분이 되기를 바랍니다. 빠르게 대충 하는 것보다, 느리더라도 꼼꼼하게 완성할 줄 아는 여러분들의 모습을 기대한답니다. 
행복한 주말 보내세요!''',
        'is_new': True,
        'notice_type': 'notice'
    }
]

# 2. Todos
todos = [
    {
        'child_id': 'ahyeon',
        'title': '체육시간 편한 복장 및 운동화 (화, 수)',
        'category': '학교',
        'due_date': '2026-03-17',
        'source': 'hiclass',
        'priority': 'medium'
    },
    {
        'child_id': 'yeonjun',
        'title': '음악시간 준비물: 리코더',
        'category': '학교',
        'due_date': '2026-03-16',
        'source': 'hiclass',
        'priority': 'medium'
    },
    {
        'child_id': 'yeonjun',
        'title': '진단평가(국어, 수학) 복습하기',
        'category': '학교',
        'due_date': '2026-03-16',
        'source': 'hiclass',
        'priority': 'high'
    },
    {
        'child_id': 'yeonjun',
        'title': '졸업앨범 제작계획 학부모 의견조사 (이알리미)',
        'category': '학교',
        'due_date': '2026-03-18', # Assuming it's before the assembly
        'source': 'hiclass',
        'priority': 'high'
    }
]

# 3. Events
events = [
    {
        'child_id': 'yeonjun',
        'title': '학부모총회 (14시, 시청각실)',
        'event_date': '2026-03-18',
        'is_dday': True
    }
]

def run_update():
    print("Inserting notices...")
    for n in notices:
        # Check if already exists based on title and date
        existing = sb.table('notices').select('id').eq('child_id', n['child_id']).eq('date', n['date']).execute()
        if existing.data:
            sb.table('notices').update(n).eq('id', existing.data[0]['id']).execute()
            print(f"Updated notice for {n['child_id']}")
        else:
            sb.table('notices').insert(n).execute()
            print(f"Inserted notice for {n['child_id']}")

    print("Inserting todos...")
    for t in todos:
        # Check if already exists based on title and due_date
        existing = sb.table('todos').select('id').eq('child_id', t['child_id']).eq('title', t['title']).execute()
        if existing.data:
            print(f"Todo already exists: {t['title']}")
        else:
            sb.table('todos').insert(t).execute()
            print(f"Inserted todo: {t['title']}")

    print("Inserting events...")
    for e in events:
        existing = sb.table('events').select('id').eq('child_id', e['child_id']).eq('title', e['title']).execute()
        if existing.data:
            print(f"Event already exists: {e['title']}")
        else:
            sb.table('events').insert(e).execute()
            print(f"Inserted event: {e['title']}")

    print("Done!")

if __name__ == "__main__":
    run_update()
