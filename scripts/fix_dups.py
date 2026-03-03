"""DB 중복 제거 + 숙제 카테고리 수정"""
from supabase import create_client

sb = create_client('https://dekhesrcfsrhpyufiynl.supabase.co', 'sb_publishable_QCzi3kNzdRfXmx3vxHyp6w_keq6Z2Qp')

# 중복 제거: 같은 child_id + title은 1개만 유지 (id가 작은것 보존)
for child_id in ['yeonjun', 'ahyeon']:
    res = sb.table('todos').select('id,title').eq('child_id', child_id).order('id').execute()
    seen = {}
    dup_ids = []
    for r in res.data:
        if r['title'] in seen:
            dup_ids.append(r['id'])
        else:
            seen[r['title']] = r['id']
    
    if dup_ids:
        for did in dup_ids:
            sb.table('todos').delete().eq('id', did).execute()
        print(f"✅ {child_id}: 중복 {len(dup_ids)}건 삭제 (IDs: {dup_ids})")
    else:
        print(f"✅ {child_id}: 중복 없음")

# 숙제 카테고리를 '학교숙제'로 변경 (recurrence='once', sub_category='homework')
res = sb.table('todos').update({'category': '학교숙제'}).eq('category', '숙제').eq('recurrence', 'once').execute()
print(f"✅ '숙제' → '학교숙제' 카테고리 변경: {len(res.data)}건")

print("\n🎉 완료!")
