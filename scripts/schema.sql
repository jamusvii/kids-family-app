-- ============================================================
-- 우리가족 알리미 — Supabase DB Schema
-- ============================================================

-- 자녀 기본 정보
CREATE TABLE IF NOT EXISTS children (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    school TEXT NOT NULL,
    grade INTEGER NOT NULL,
    class_number INTEGER NOT NULL,
    theme TEXT DEFAULT 'mint',
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 주간 시간표
CREATE TABLE IF NOT EXISTS timetables (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    day INTEGER NOT NULL CHECK (day BETWEEN 0 AND 4),  -- 0=월, 4=금
    period INTEGER NOT NULL CHECK (period BETWEEN 1 AND 6),
    subject TEXT NOT NULL DEFAULT '',
    UNIQUE(child_id, week_start, day, period)
);

-- 할 일 / 준비물
CREATE TABLE IF NOT EXISTS todos (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '학교',
    due_date DATE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    is_completed BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'user' CHECK (source IN ('hiclass', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D-Day / 행사 이벤트
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    is_dday BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 알림장 / 가정통신문
CREATE TABLE IF NOT EXISTS notices (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    source TEXT,
    content TEXT,
    is_new BOOLEAN DEFAULT TRUE,
    notice_type TEXT DEFAULT 'notice',  -- notice, curriculum, safety, school_life
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 통학버스
CREATE TABLE IF NOT EXISTS bus_schedules (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('commute', 'dismissal')),
    day TEXT,      -- null=매일, 월/화/수/목/금
    route TEXT,
    departure_location TEXT,
    departure_time TEXT,
    arrival_location TEXT,
    arrival_time TEXT
);

-- 주간 학습 내용
CREATE TABLE IF NOT EXISTS weekly_curriculum (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    subject_name TEXT NOT NULL,
    content TEXT NOT NULL,
    UNIQUE(child_id, week_start, subject_name)
);

-- 학교 정보 (아침활동, 안전지도, 생활안내 등)
CREATE TABLE IF NOT EXISTS school_info (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    info_type TEXT NOT NULL, -- morning_activity, safety_rule, school_life_rule, contact_info
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    UNIQUE(child_id, info_type, content)
);

-- RLS (Row Level Security) 비활성화 (가족 앱이므로)
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_info ENABLE ROW LEVEL SECURITY;

-- 공개 접근 정책 (anon key로 접근 가능)
CREATE POLICY "Allow all access" ON children FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON timetables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON todos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON notices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON bus_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON weekly_curriculum FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON school_info FOR ALL USING (true) WITH CHECK (true);
