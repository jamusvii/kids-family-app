"""이아연 & 이연준 3/5, 3/6 알림장 업데이트 (중복 체크 포함)"""
from supabase import create_client

sb = create_client(
    'https://dekhesrcfsrhpyufiynl.supabase.co',
    'sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp'
)

# ============================================================
# 알림장 데이터 정의
# ============================================================

notices_data = [
    # 이아연 3/5
    {
        'child_id': 'ahyeon',
        'title': '3/5 알림장',
        'date': '2026-03-05',
        'source': '3학년 4반 · 지민지 선생님',
        'content': (
            '1. 학사일정\n'
            '   3월 9일(월): 1학기 학급임원 선거 (남회장 1명, 여회장 1명)\n'
            '   입후보할 학생은 간단하게 소견 발표할 내용을 준비해 주세요. (3분이내)\n\n'
            '2. 제출 안내\n'
            '   아래 3가지를 아직 제출하지 않은 학생은 내일(3/6 금요일)까지 작성해주세요.\n'
            '   - 행정정보공동이용 사전 동의서 + 개인정보 동의서(양면)\n'
            '   - 응급환자 관리 안내 및 건강상태 조사서\n'
            '   - 학생기초자료 조사서\n\n'
            '3. 준비물\n'
            '   - 영어준비물 모두 챙겨오기(전담시간) 다음주 수요일까지\n'
            '   - 정현초등학교 평가파일 (분실시 학생이 담임선생님한테 요청)'
        ),
        'is_new': True,
        'notice_type': 'notice'
    },
    # 이아연 3/6
    {
        'child_id': 'ahyeon',
        'title': '3/6 알림장',
        'date': '2026-03-06',
        'source': '3학년 4반 · 지민지 선생님',
        'content': (
            '1. 학사일정\n'
            '   3월 9일(월): 1학기 학급임원 선거 (남회장 1명, 여회장 1명)\n'
            '   입후보할 학생은 간단하게 소견 발표할 내용을 준비해 주세요. (3분이내)\n\n'
            '2. 육상대회 안내\n'
            '   - 3월 31일 화요일 육상대회\n'
            '   - 참가선수 테스트: 3월 10일(화) 오전 8시 15분\n'
            '   - 종목: 80m 달리기 (3학년)\n'
            '   참가를 희망하는 학생은 월요일 담임 선생님한테 말해주세요.\n\n'
            '* 협조해주신 덕분에 이번주 안에 23명의 안내장 모두 수합할 수 있었습니다. 감사합니다.'
        ),
        'is_new': True,
        'notice_type': 'notice'
    },
    # 이연준 3/5
    {
        'child_id': 'yeonjun',
        'title': '3/5 알림장',
        'date': '2026-03-05',
        'source': '6학년 9반 · 권세린 선생님',
        'content': (
            '1. 교실에 오면 휴대폰 반드시 끄기\n'
            '2. 학급임원선거 후보자 등록 - 내일 하교전까지\n'
            '3. 줄노트 2권 준비 (과학탐구노트/배움노트)\n'
            '4. (받은 사람만) 안심알리미 배부, 가방에 부착\n\n'
            '*하이클래스 학생 계정 미가입자는 부모님 휴대폰으로 알림장, 과제, 학급사진 등을 확인 바랍니다.'
        ),
        'is_new': True,
        'notice_type': 'notice'
    },
    # 이연준 3/6
    {
        'child_id': 'yeonjun',
        'title': '3/6 알림장',
        'date': '2026-03-06',
        'source': '6학년 9반 · 권세린 선생님',
        'content': (
            '1. 다음 주부터 부서별 활동을 시작합니다.\n'
            '   *부서별 청소 요일(하교 후 5분) - 연준이는 살림부, 담당 요일: 화요일\n\n'
            '2. 줄노트(배움노트, 과학탐구노트) 안가져온사람 가져옵니다.\n'
            '   *배움노트는 매주 수요일 검사\n\n'
            '3. 월요일 회장선거 참여 학생은 연설 내용을 미리 준비합니다.\n\n'
            '4. (안전) 학교 모든 공간에서 해당: 친구가 허락하지 않은 신체 접촉, 몸싸움(밀기, 당기기, 치기 포함) 등은 절대 하지 않습니다.\n\n'
            '💌한 주의 편지\n'
            '우리 반 개학 후 첫 일주일은 어땠나요? 새로운 선생님, 친구들과 적응하느라 고생 많았습니다. '
            '우리의 마지막 초등학교 생활을 즐겁고 의미있게 보낼 수 있도록 다함께 노력합시다. '
            '다음 주에는 더 즐거운 활동들이 기다리고 있어요. 행복한 주말 보내고 월요일에 봅시다 :)'
        ),
        'is_new': True,
        'notice_type': 'notice'
    },
]

# ============================================================
# 중복 체크 후 삽입
# ============================================================

inserted = 0
skipped = 0

for notice in notices_data:
    # 중복 체크: child_id + date 기준
    existing = (
        sb.table('notices')
        .select('id')
        .eq('child_id', notice['child_id'])
        .eq('date', notice['date'])
        .execute()
    )
    if existing.data:
        child_name = '이아연' if notice['child_id'] == 'ahyeon' else '이연준'
        print(f'⏭️  중복 건너뜀: {child_name} {notice["date"]}')
        skipped += 1
        continue

    sb.table('notices').insert(notice).execute()
    child_name = '이아연' if notice['child_id'] == 'ahyeon' else '이연준'
    print(f'✅ 저장: {child_name} {notice["date"]} 알림장')
    inserted += 1

# 이전 알림 is_new=false 처리
LATEST_DATE = '2026-03-06'
sb.table('notices').update({'is_new': False}).eq('child_id', 'ahyeon').lt('date', '2026-03-05').execute()
sb.table('notices').update({'is_new': False}).eq('child_id', 'yeonjun').lt('date', '2026-03-05').execute()
print('✅ 이전 알림장 is_new=False 처리 완료')

print(f'\n🎉 완료! 저장: {inserted}건 / 중복 건너뜀: {skipped}건')
