"""이아연 & 이연준 3/9~3/13 (2주차) 주간학습 업데이트 (중복 체크 포함)"""
from supabase import create_client

sb = create_client(
    'https://dekhesrcfsrhpyufiynl.supabase.co',
    'sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp'
)

WEEK_START = '2026-03-09'

# ============================================================
# 이아연 - 3학년 4반 주간학습
# ============================================================
ahyeon_curriculum = [
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '국어',
     'content': '시를 읽고 낭송하기 (1/2, 2/2), 상황에 알맞은 목소리나 말투 사용, 도서관 온책읽기'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '수학',
     'content': '세 자리 수의 덧셈(3), 세 자리 수의 뺄셈(1)(2)'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '영어',
     'content': 'Listen, Read and Do / Read and Write / Chant and Do / ABC Play'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '과학',
     'content': '꼬마 과학자의 봄나들이(1)(2), 과학과 놀아요'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '도덕',
     'content': '나를 알아봐요, 나를 소개해요'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '체육',
     'content': '운동과 체력의 관계를 알아요(1/2), 대단원 도입'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '음악',
     'content': '새 친구들과 함께(2/2)'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '미술',
     'content': '조형 요소로 평면 표현하기(1/2, 2/2)'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '자율',
     'content': '학급임원선거, 아동학대예방주간, 인성교육'},
    {'child_id': 'ahyeon', 'week_start': WEEK_START, 'subject_name': '동아리',
     'content': '창의인성놀이 1'},
]

# ============================================================
# 이연준 - 6학년 9반 주간학습
# ============================================================
yeonjun_curriculum = [
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '국어',
     'content': '전기문을 읽고 인물이 추구하는 가치 알기(1/2, 2/2), 주제 중심 독서 토의(2/2), 배울 내용 살펴보기'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '수학',
     'content': '(자연수)÷(자연수)의 몫을 분수로 나타내요(1)(2)'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '사회',
     'content': '선거에 참여해 볼까요?, 선거의 기본 원칙, 공정한 선거를 보장하려는 노력'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '과학',
     'content': '전담선생님 수업 (이번 주부터 과학 수업 시작)'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '도덕',
     'content': '배울 내용 살펴보기'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '영어',
     'content': '전담선생님 수업'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '미술',
     'content': '색의 속성을 활용하여 표현하기'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '음악',
     'content': '주요 3화음(1/2), 여러 지역의 토리(1) 문화예술교육'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '체육',
     'content': '육상 선수 선발(운동장), 크로스핏(CrossFit)과 친해지기(1/17)'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '실과',
     'content': '가정생활의 중요성을 알아볼까요, 건강한 가정생활을 위해 배려와 돌봄을 실천해 볼까요'},
    {'child_id': 'yeonjun', 'week_start': WEEK_START, 'subject_name': '자율',
     'content': '학급임원선거, 태블릿 활용 수업, 학급세우기-갈등 해결 방법 익히기'},
]

all_items = ahyeon_curriculum + yeonjun_curriculum
inserted = 0
skipped = 0

for item in all_items:
    # 중복 체크: child_id + week_start + subject_name
    existing = (
        sb.table('weekly_curriculum')
        .select('id')
        .eq('child_id', item['child_id'])
        .eq('week_start', item['week_start'])
        .eq('subject_name', item['subject_name'])
        .execute()
    )
    if existing.data:
        child_name = '이아연' if item['child_id'] == 'ahyeon' else '이연준'
        print(f'⏭️  중복: {child_name} - {item["subject_name"]}')
        skipped += 1
        continue

    sb.table('weekly_curriculum').insert(item).execute()
    child_name = '이아연' if item['child_id'] == 'ahyeon' else '이연준'
    print(f'✅ 저장: {child_name} - {item["subject_name"]}')
    inserted += 1

print(f'\n🎉 완료! 저장: {inserted}건 / 중복 건너뜀: {skipped}건')
