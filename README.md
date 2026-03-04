# 우리가족 알리미 (Family Alimi)

> 하이클래스 알림장 기반 자녀 학교생활 관리 PWA

[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://app-kohl-psi-66.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![Supabase](https://img.shields.io/badge/DB-Supabase-3ECF8E)](https://supabase.com)
![Version](https://img.shields.io/badge/version-1.4.0-brightgreen)

---

## 📱 앱 소개

정현초등학교 자녀 2명(이연준 6학년, 이아연 3학년)의 학교 생활을 관리하는 가족용 PWA 앱입니다.  
하이클래스 알림장을 기반으로 시간표, 준비물, 할일, 통학버스, 방과후학습, 학원 정보를 통합 관리합니다.

### 💡 핵심 특징
- 📄 알림장 텍스트 → 할일 자동 추출 및 분류 (오늘할일 / 주간할일)
- 📊 Supabase 실시간 연동 (모든 기기에서 동기화)
- 📱 PWA — 홈 화면에 앱처럼 설치 (iPhone/Android)
- 🚌 통학버스 + 방과후학습 연동 하교 스케줄

---

## 🗂 화면 구성

| 화면 | 기능 |
|------|------|
| 랜딩 | 자녀 카드 선택 (이연준 / 이아연) — 학교할일 우선 미리보기 |
| **대시보드** | 주간 배너, 오늘 시간표, 핵심 할일(학교우선), 알림장 팝업, 버스/방과후 스케줄 |
| **할일관리** | 📌 오늘할일(학교/학교숙제) · 📝 매일숙제 · 📋 주간할일 |
| **학교정보** | 시간표+최신알림장 · 주간학습 · 알림장(클릭→중앙 팝업) · 생활안내 |
| **학원정보** | 방과후학습 + 학원 주간 스케줄, 픽업 정보 |

---

## 🏗 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 19 + Vite 7 + React Router 7 |
| DB | Supabase (PostgreSQL) |
| PWA | vite-plugin-pwa (Service Worker + Manifest) |
| 배포 | Vercel — https://app-kohl-psi-66.vercel.app |
| 알림장 파싱 | Python + supabase-py |

---

## 📂 프로젝트 구조

```
kids/
├── app/                        # React PWA 앱
│   ├── src/
│   │   ├── components/         # BottomNav
│   │   ├── context/            # DataContext (Supabase), AuthContext
│   │   ├── lib/                # supabase.js
│   │   └── pages/              # Dashboard, TodoList, SchoolInfo, AcademyInfo, ...
│   ├── public/icons/           # PWA 앱 아이콘 (두 아이+무지개 캐리커처)
│   ├── public/images/          # 프로필 이미지 (이연준/이아연 캐리커처)
│   ├── vercel.json             # Vercel 배포 설정 (Vite + SPA routing)
│   ├── .env                    # Supabase 접속 정보 (gitignore)
│   └── vite.config.js          # PWA 설정
├── docs/image/                 # 원본 이미지 자료
├── scripts/
│   ├── schema.sql              # DB 초기 스키마
│   ├── migration_v2.sql        # v2 마이그레이션
│   ├── seed_db.py              # 초기 데이터 시딩
│   ├── seed_v2.py              # v2 시딩 (방과후/매일숙제)
│   ├── fix_dups.py             # 중복 할일 제거 유틸
│   ├── process_images.py       # 이미지 처리 유틸
│   └── update_notice_*.py      # 일일 알림장 업데이트 스크립트
└── .agent/workflows/
    └── update-hiclass.md       # 알림장 업데이트 워크플로우
```

---

## 🗄 DB 스키마

| 테이블 | 설명 |
|--------|------|
| `children` | 자녀 정보 (이연준 / 이아연) |
| `timetables` | 주간 시간표 (week_start 기준 이력 보존) |
| `todos` | 할일 (recurrence: once/daily, sub_category: school/homework) |
| `events` | D-Day / 행사 |
| `notices` | 알림장 원문 (일단위 업데이트) |
| `bus_schedules` | 통학버스 |
| `weekly_curriculum` | 주간 학습 내용 |
| `school_info` | 아침활동, 안전지도, 학교생활규칙, 연락처 |
| `after_school_programs` | 방과후학습 (요일별, 픽업 방법) |
| `academies` | 학원 정보 |
| `daily_homework_logs` | 매일숙제 완료 기록 |

---

## 📲 PWA 설치 방법

**iPhone**: Safari → URL 접속 → 하단 공유 버튼 → "홈 화면에 추가"  
**Android**: Chrome → URL 접속 → "앱 설치" 배너 클릭

---

## 🔄 알림장 업데이트 방법

1. 하이클래스에서 알림장 텍스트 복사
2. AI에게 전달: `"오늘 아연이 알림장: [텍스트]"`
3. AI가 자동으로: 알림장 저장 + 할일 추출 + DB 업데이트

---

## 👨‍👩‍👧‍👦 자녀 정보

| 항목 | 이연준 | 이아연 |
|------|--------|--------|
| 학교 | 정현초등학교 | 정현초등학교 |
| 학년/반 | 6학년 9반 | 3학년 4반 |
| 테마 | 🟢 민트 | 🌸 핑크 |
| 등교버스 | ❌ | ✅ 12회차 8:43 (4단지 출발) |
| 하교버스 | ❌ | ✅ 요일별 (화/금: 엄마 픽업) |
| 방과후 | ❌ | 화: 컴퓨터 / 금: 창의게임수학 |
| 학원 | 수학, 영어 | 피아노, 영어 |

---

## 📋 버전 히스토리

### v1.4.0 (2026-03-04)
- 아이 카드·대시보드 할일: **학교할일 우선 정렬**, 매일숙제(daily) 제외
- 대시보드 알림 클릭: 학교정보 이동 → **대시보드 내 팝업 모달**로 변경
- 할일관리 "숙제" → **"학교숙제"** 레이블 변경
- DB 중복 할일 3건 제거 (yeonjun)
- 캐리커처 앱 아이콘 + 프로필 이미지 적용 (이연준/이아연)
- 프로필 이미지 압축 (8MB → 220KB) — PWA 캐시 한도 대응
- **Vercel 프로덕션 배포** 완료: https://app-kohl-psi-66.vercel.app

### v1.3.0 (2026-03-03)
- 학교정보 알림장 팝업: 하단시트 → 화면 **중앙 모달**로 변경
- 알림장 내용 항목별 카드 분리 (가시성 개선)
- 최신 알림장 시간표 아래 위치
- notices 정렬 기준 id 내림차순으로 변경

### v1.2.0 (2026-03-03)
- 할일관리 3탭: 📌 오늘할일(학교/숙제) · 📝 매일숙제 · 📋 주간할일
- 매일숙제: 한자, 연산수학, 기탄국어, 독서 (매일 자동 리셋)
- 🎓 학원정보 신규 메뉴 (GNB 4탭)
- 방과후학습 추가 (이아연: 화-컴퓨터, 금-창의게임수학)
- 일일 알림장 텍스트 → 할일 자동 추출 워크플로우

### v1.1.0 (2026-03-02)
- Supabase 백엔드 통합 (11개 테이블)
- 대시보드 주간 배너 추가
- PWA 설정 (Service Worker, Manifest, 앱 아이콘)
- GitHub + Vercel 배포 파이프라인 구축

### v1.0.0 (2026-03-02)
- 초기 릴리즈
- 자녀별 대시보드 (이연준 mint / 이아연 pink)
- 시간표, 준비물, 버스 정보, GNB 네비게이션
