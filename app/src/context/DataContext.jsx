import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext(null);

export function DataProvider({ children: reactChildren }) {
    const [childrenData, setChildrenData] = useState({});
    const [todos, setTodos] = useState({});
    const [events, setEvents] = useState({});
    const [busSchedules, setBusSchedules] = useState({});
    const [timetables, setTimetables] = useState({});
    const [schoolInfo, setSchoolInfo] = useState({});
    const [weeklyCurriculum, setWeeklyCurriculum] = useState({});
    const [afterSchool, setAfterSchool] = useState({});
    const [academies, setAcademies] = useState({});
    const [homeworkLogs, setHomeworkLogs] = useState({});
    const [loading, setLoading] = useState(true);

    const loadChildren = useCallback(async () => {
        const { data } = await supabase.from('children').select('*');
        if (!data) return;
        const map = {};
        data.forEach(c => {
            map[c.id] = { id: c.id, name: c.name, school: c.school, grade: c.grade, classNumber: c.class_number, theme: c.theme, profileImage: c.profile_image };
        });
        setChildrenData(map);
    }, []);

    const loadTodos = useCallback(async () => {
        const { data } = await supabase.from('todos').select('*').order('created_at', { ascending: true });
        if (!data) return;
        const map = {};
        data.forEach(t => {
            const childId = t.child_id;
            if (!map[childId]) map[childId] = [];
            map[childId].push({ id: t.id, title: t.title, category: t.category, subCategory: t.sub_category || 'school', dueDate: t.due_date, priority: t.priority, isCompleted: t.is_completed, source: t.source, recurrence: t.recurrence || 'once' });
        });
        setTodos(map);
    }, []);

    const loadEvents = useCallback(async () => {
        const { data } = await supabase.from('events').select('*');
        if (!data) return;
        const map = {};
        data.forEach(e => {
            if (!map[e.child_id]) map[e.child_id] = [];
            map[e.child_id].push({ id: e.id, title: e.title, eventDate: e.event_date, isDday: e.is_dday });
        });
        setEvents(map);
    }, []);

    const loadBusSchedules = useCallback(async () => {
        const { data } = await supabase.from('bus_schedules').select('*');
        if (!data) return;
        const map = {};
        data.forEach(b => {
            if (!map[b.child_id]) map[b.child_id] = { commute: null, dismissal: {} };
            if (b.type === 'commute') {
                map[b.child_id].commute = { route: b.route, boarding: { location: b.departure_location, time: b.departure_time }, arrival: { location: b.arrival_location, time: b.arrival_time } };
            } else if (b.type === 'dismissal' && b.day) {
                map[b.child_id].dismissal[b.day] = { route: b.route, departure: b.departure_time, arrival4: b.arrival_time };
            }
        });
        setBusSchedules(map);
    }, []);

    const loadTimetables = useCallback(async () => {
        const { data } = await supabase.from('timetables').select('*').order('period', { ascending: true });
        if (!data) return;
        const map = {};
        data.forEach(t => {
            if (!map[t.child_id]) map[t.child_id] = [['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']];
            const row = t.period - 1; const col = t.day;
            if (row >= 0 && row < 6 && col >= 0 && col < 5) map[t.child_id][row][col] = t.subject;
        });
        setTimetables(map);
    }, []);

    const loadSchoolInfo = useCallback(async () => {
        const { data: notices } = await supabase.from('notices').select('*').order('id', { ascending: false });
        const { data: infoRows } = await supabase.from('school_info').select('*').order('sort_order', { ascending: true });
        const map = {};
        (notices || []).forEach(n => {
            if (!map[n.child_id]) map[n.child_id] = { notices: [], morningActivity: '', safetyRules: [], schoolLifeRules: [], contactInfo: null };
            map[n.child_id].notices.push({ id: n.id, title: n.title, date: n.date, source: n.source, content: n.content, isNew: n.is_new });
        });
        (infoRows || []).forEach(r => {
            if (!map[r.child_id]) map[r.child_id] = { notices: [], morningActivity: '', safetyRules: [], schoolLifeRules: [], contactInfo: null };
            if (r.info_type === 'morning_activity') map[r.child_id].morningActivity = r.content;
            else if (r.info_type === 'safety_rule') map[r.child_id].safetyRules.push(r.content);
            else if (r.info_type === 'school_life_rule') map[r.child_id].schoolLifeRules.push(r.content);
            else if (r.info_type === 'contact_info') {
                if (!map[r.child_id].contactInfo) map[r.child_id].contactInfo = {};
                const [label, value] = r.content.split(': ');
                map[r.child_id].contactInfo[label] = value || r.content;
            }
        });
        setSchoolInfo(map);
    }, []);

    const loadWeeklyCurriculum = useCallback(async () => {
        const { data } = await supabase.from('weekly_curriculum').select('*').order('week_start', { ascending: false });
        if (!data) return;
        const map = {};
        data.forEach(c => {
            if (!map[c.child_id]) map[c.child_id] = { week: '', subjects: [] };
            const ws = new Date(c.week_start);
            if (!map[c.child_id].week) map[c.child_id].week = `${ws.getMonth() + 1}/${ws.getDate()}~`;
            map[c.child_id].subjects.push({ name: c.subject_name, content: c.content });
        });
        setWeeklyCurriculum(map);
    }, []);

    const loadAfterSchool = useCallback(async () => {
        const { data } = await supabase.from('after_school_programs').select('*');
        if (!data) return;
        const map = {};
        data.forEach(a => {
            if (!map[a.child_id]) map[a.child_id] = [];
            map[a.child_id].push({ id: a.id, day: a.day, programName: a.program_name, startTime: a.start_time, endTime: a.end_time, location: a.location, pickupMethod: a.pickup_method });
        });
        setAfterSchool(map);
    }, []);

    const loadAcademies = useCallback(async () => {
        const { data } = await supabase.from('academies').select('*');
        if (!data) return;
        const map = {};
        data.forEach(a => {
            if (!map[a.child_id]) map[a.child_id] = [];
            map[a.child_id].push({ id: a.id, type: a.type, academyName: a.academy_name, day: a.day, startTime: a.start_time, endTime: a.end_time });
        });
        setAcademies(map);
    }, []);

    const loadHomeworkLogs = useCallback(async () => {
        const today = new Date().toISOString().slice(0, 10);
        const { data } = await supabase.from('daily_homework_logs').select('*').eq('completed_date', today);
        if (!data) return;
        const map = {};
        data.forEach(l => {
            if (!map[l.child_id]) map[l.child_id] = [];
            map[l.child_id].push(l.homework_title);
        });
        setHomeworkLogs(map);
    }, []);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([
                loadChildren(), loadTodos(), loadEvents(), loadBusSchedules(),
                loadTimetables(), loadSchoolInfo(), loadWeeklyCurriculum(),
                loadAfterSchool(), loadAcademies(), loadHomeworkLogs(),
            ]);
            setLoading(false);
        };
        loadAll();
    }, [loadChildren, loadTodos, loadEvents, loadBusSchedules, loadTimetables, loadSchoolInfo, loadWeeklyCurriculum, loadAfterSchool, loadAcademies, loadHomeworkLogs]);

    /* ── CRUD ── */
    const addTodo = async (childId, todo) => {
        const row = { child_id: childId, title: todo.title, category: todo.category, sub_category: todo.subCategory || 'school', due_date: todo.dueDate || null, priority: todo.priority || 'medium', is_completed: false, source: todo.source || 'user', recurrence: todo.recurrence || 'once' };
        const { data } = await supabase.from('todos').insert(row).select().single();
        if (data) {
            setTodos(prev => ({ ...prev, [childId]: [...(prev[childId] || []), { id: data.id, title: data.title, category: data.category, subCategory: data.sub_category, dueDate: data.due_date, priority: data.priority, isCompleted: data.is_completed, source: data.source, recurrence: data.recurrence }] }));
        }
    };

    const toggleTodo = async (childId, todoId) => {
        const todo = (todos[childId] || []).find(t => t.id === todoId);
        if (!todo) return;
        const newVal = !todo.isCompleted;
        await supabase.from('todos').update({ is_completed: newVal }).eq('id', todoId);
        setTodos(prev => ({ ...prev, [childId]: prev[childId].map(t => t.id === todoId ? { ...t, isCompleted: newVal } : t) }));
    };

    const deleteTodo = async (childId, todoId) => {
        await supabase.from('todos').delete().eq('id', todoId);
        setTodos(prev => ({ ...prev, [childId]: prev[childId].filter(t => t.id !== todoId) }));
    };

    const toggleHomework = async (childId, title) => {
        const todayStr = new Date().toISOString().slice(0, 10);
        const currentLogs = homeworkLogs[childId] || [];
        const isDone = currentLogs.includes(title);
        if (isDone) {
            await supabase.from('daily_homework_logs').delete().eq('child_id', childId).eq('homework_title', title).eq('completed_date', todayStr);
            setHomeworkLogs(prev => ({ ...prev, [childId]: (prev[childId] || []).filter(t => t !== title) }));
        } else {
            await supabase.from('daily_homework_logs').upsert({ child_id: childId, homework_title: title, completed_date: todayStr }, { onConflict: 'child_id,homework_title,completed_date' }).execute();
            setHomeworkLogs(prev => ({ ...prev, [childId]: [...(prev[childId] || []), title] }));
        }
    };

    const addEvent = async (childId, event) => {
        const { data } = await supabase.from('events').insert({ child_id: childId, title: event.title, event_date: event.eventDate, is_dday: event.isDday || false }).select().single();
        if (data) setEvents(prev => ({ ...prev, [childId]: [...(prev[childId] || []), { id: data.id, title: data.title, eventDate: data.event_date, isDday: data.is_dday }] }));
    };

    const deleteEvent = async (childId, eventId) => {
        await supabase.from('events').delete().eq('id', eventId);
        setEvents(prev => ({ ...prev, [childId]: prev[childId].filter(e => e.id !== eventId) }));
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#8B7355' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
                <div>데이터를 불러오는 중...</div>
            </div>
        </div>
    );

    return (
        <DataContext.Provider value={{ childrenData, todos, events, busSchedules, timetables, schoolInfo, weeklyCurriculum, afterSchool, academies, homeworkLogs, addTodo, toggleTodo, deleteTodo, toggleHomework, addEvent, deleteEvent, refreshData: () => Promise.all([loadTodos(), loadEvents(), loadHomeworkLogs()]) }}>
            {reactChildren}
        </DataContext.Provider>
    );
}

export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used inside DataProvider');
    return ctx;
}
