from supabase import create_client

sb = create_client(
    'https://dekhesrcfsrhpyufiynl.supabase.co',
    'sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp'
)

WEEK_START = '2026-03-16'

# 1. Ah-yeon's Weekly Curriculum (Week of 03-16)
ahyeon_curriculum = [
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '수학',
     'content': '세 자리 수의 뺄셈을 할 수 있어요(3) 22-23(21-21)쪽, 배운 내용 확인 학습 24-27쪽, 선의 종류를 알 수 있어요(1/2, 2/2) 33-37(24-25)쪽, 수학익힘책으로 복습'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '국어',
     'content': '상황에 알맞은 목소리나 말투를 사용하면 좋은 점 알기 46-47(8-9)쪽, 상황에 알맞은 표정과 몸짓으로 대화하기(1/2, 2/2) 48-59(8-9)쪽, 도서관 온책읽기'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '영어',
     'content': 'Read and Write, Chant and Connect, ABC Song, ABC Project / practice'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '과학',
     'content': '수평잡기를 해 볼까요 24-25(8)쪽, 물체를 밀거나 당길 때 나타나는 현상 관찰 22-23(7)쪽, 생활에서 힘과 관련된 현상 알아보기 20-21(6)쪽'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '사 회',
     'content': '단원·주제 도입 6-9쪽'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '미 술',
     'content': '조형 요소로 입체 표현 하기, 작품 감상하기 (1/2, 2/2) 11쪽'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '음 악',
     'content': '길고 짧은 음, 높고 낮은 음(1/2, 2/2) 10-11쪽'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '도 덕',
     'content': '나의 감정은 소중해요 14-17쪽, 나를 격려해요 18-21쪽'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '체 육',
     'content': '운동의 순서와 방법을 알아요 (1/2) 14-15쪽, 운동과 체력의 관계를 알아요 (2/2) 12-13쪽'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '동아리',
     'content': '기초한자 공부하기'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '자 율',
     'content': '인성교육'},
]

# Insert/Update Ah-yeon's Curriculum
print("Updating Ah-yeon's weekly curriculum...")
for item in ahyeon_curriculum:
    existing = sb.table('weekly_curriculum').select('id').eq('child_id', item['child_id']).eq('week_start', item['week_start']).eq('subject_name', item['subject_name']).execute()
    if existing.data:
        sb.table('weekly_curriculum').update(item).eq('id', existing.data[0]['id']).execute()
        print(f"Updated {item['subject_name']}")
    else:
        sb.table('weekly_curriculum').insert(item).execute()
        print(f"Inserted {item['subject_name']}")

# 2. Yeon-jun's Middle School Assigment Notice
yeonjun_notice = {
    'child_id': 'yeonjun',
    'title': '[가정통신문 요약] 중학교 입학 배정 안내 (2027학년도)',
    'date': '2026-03-13',
    'source': '교육청 안내문',
    'content': '''[2027학년도 중학교 입학 배정 시 학구 위반 적용 안내]

1. 학구 위반이란?
실제 거주지가 현재 다니고 있는 초등학교의 통학구역(학구)과 다른 학생 (예: 이사 후 전학을 가지 않았거나 위장 전입한 경우)

2. 중학교 지원 방법
중학교 지원은 1) 실제 거주지 기준 중학군구 2) 재학 중인 초등학교 기준 중학군구 둘 중 하나를 선택 가능합니다. (단, 어딜 지원하든 학구 위반자로 분류됨)

3. 배정 시 주의사항 (불이익)
- 모든 지망에서 '학구 위반이 아닌 정상 지원자'를 100% 우선 배정합니다.
- 정상 지원자 배정 후 남는 자리가 있을 때만 학구 위반자를 배정합니다.
- 지망한 중학교가 정상 지원자만으로 정원을 다 채우면 학구 위반자는 탈락하게 되니 주의가 필요합니다.''',
    'is_new': True,
    'notice_type': 'notice'
}

# Insert Yeon-jun's Notice
print("\nUpdating Yeon-jun's notice summary...")
existing = sb.table('notices').select('id').eq('child_id', yeonjun_notice['child_id']).eq('title', yeonjun_notice['title']).eq('date', yeonjun_notice['date']).execute()
if existing.data:
    sb.table('notices').update(yeonjun_notice).eq('id', existing.data[0]['id']).execute()
    print("Updated Yeoun-jun's notice summary.")
else:
    sb.table('notices').insert(yeonjun_notice).execute()
    print("Inserted Yeoun-jun's notice summary.")

print("\nDone!")
