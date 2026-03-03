-- ============================================================
-- Migration: 할일 고도화 + 방과후학습 + 학원정보
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. todos 테이블에 컬럼 추가
ALTER TABLE todos ADD COLUMN IF NOT EXISTS recurrence TEXT DEFAULT 'once';
-- 'once': 1회 완료 | 'daily': 매일 자동 리셋
ALTER TABLE todos ADD COLUMN IF NOT EXISTS sub_category TEXT DEFAULT 'school';
-- 'school': 학교 할일 | 'homework': 숙제/과제

-- 2. 방과후학습 테이블
CREATE TABLE IF NOT EXISTS after_school_programs (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    day TEXT NOT NULL,              -- 월/화/수/목/금
    program_name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    location TEXT,
    pickup_method TEXT DEFAULT 'bus'  -- 'bus' | 'parent_pickup'
);

-- 3. 학원정보 테이블
CREATE TABLE IF NOT EXISTS academies (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    type TEXT NOT NULL,           -- 피아노/영어/수학 등
    academy_name TEXT,            -- 학원명 (추후 입력)
    day TEXT NOT NULL,            -- 월/화/수/목/금/토
    start_time TEXT,
    end_time TEXT
);

-- 4. 매일숙제 완료 기록 테이블 (분석용)
CREATE TABLE IF NOT EXISTS daily_homework_logs (
    id BIGSERIAL PRIMARY KEY,
    child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
    homework_title TEXT NOT NULL,
    completed_date DATE NOT NULL,
    UNIQUE(child_id, homework_title, completed_date)
);

-- RLS 정책 추가
ALTER TABLE after_school_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_homework_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON after_school_programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON academies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON daily_homework_logs FOR ALL USING (true) WITH CHECK (true);
