"""DB 중복 확인 및 정리"""
from supabase import create_client

sb = create_client('https://dekhesrcfsrhpyufiynl.supabase.co', 'sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp')

# 이연준 할일 전체 조회
res = sb.table('todos').select('id,title,sub_category,recurrence,source,due_date,is_completed').eq('child_id', 'yeonjun').order('id').execute()

print("=== 이연준 todos ===")
seen = {}
dups = []
for r in res.data:
    key = r['title']
    print(f"  {r['id']:3d} | {r['title'][:45]:45s} | {str(r['sub_category']):10s} | {str(r['recurrence']):6s} | {str(r['source']):8s} | {str(r['due_date']):12s} | {'done' if r['is_completed'] else ''}")
    if key in seen:
        dups.append(r['id'])
    else:
        seen[key] = r['id']

print(f"\n중복 ID: {dups}")

# 이아연도 확인
res2 = sb.table('todos').select('id,title,sub_category,recurrence,source,due_date,is_completed').eq('child_id', 'ahyeon').order('id').execute()
print("\n=== 이아연 todos ===")
seen2 = {}
dups2 = []
for r in res2.data:
    key = r['title']
    print(f"  {r['id']:3d} | {r['title'][:45]:45s} | {str(r['sub_category']):10s} | {str(r['recurrence']):6s} | {str(r['source']):8s} | {str(r['due_date']):12s} | {'done' if r['is_completed'] else ''}")
    if key in seen2:
        dups2.append(r['id'])
    else:
        seen2[key] = r['id']

print(f"\n중복 ID: {dups2}")
