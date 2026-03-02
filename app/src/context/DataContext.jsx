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
    const [loading, setLoading] = useState(true);

    /* ── 데이터 로드 ── */
    const loadChildren = useCallback(async () => {
        const { data } = await supabase.from('children').select('*');
        if (!data) return;
        const map = {};
        data.forEach(c => {
            map[c.id] = {
                id: c.id, name: c.name, school: c.school,
                grade: c.grade, classNumber: c.class_number,
                theme: c.theme, profileImage: c.profile_image,
            };
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
            map[childId].push({
                id: t.id, title: t.title, category: t.category,
                dueDate: t.due_date, priority: t.priority,
                isCompleted: t.is_completed, source: t.source,
            });
        });
        setTodos(map);
    }, []);

    const loadEvents = useCallback(async () => {
        const { data } = await supabase.from('events').select('*');
        if (!data) return;
        const map = {};
        data.forEach(e => {
            const childId = e.child_id;
            if (!map[childId]) map[childId] = [];
            map[childId].push({
                id: e.id, title: e.title, eventDate: e.event_date, isDday: e.is_dday,
            });
        });
        setEvents(map);
    }, []);

    const loadBusSchedules = useCallback(async () => {
        const { data } = await supabase.from('bus_schedules').select('*');
        if (!data) return;
        const map = {};
        data.forEach(b => {
            const childId = b.child_id;
            if (!map[childId]) map[childId] = { commute: null, dismissal: {} };
            if (b.type === 'commute') {
                map[childId].commute = {
                    route: b.route,
                    boarding: { location: b.departure_location, time: b.departure_time },
                    arrival: { location: b.arrival_location, time: b.arrival_time },
                };
            } else if (b.type === 'dismissal' && b.day) {
                map[childId].dismissal[b.day] = {
                    route: b.route, departure: b.departure_time, arrival4: b.arrival_time,
                };
            }
        });
        setBusSchedules(map);
    }, []);

    const loadTimetables = useCallback(async () => {
        const { data } = await supabase.from('timetables').select('*').order('period', { ascending: true });
        if (!data) return;
        const map = {};
        data.forEach(t => {
            const childId = t.child_id;
            if (!map[childId]) map[childId] = [
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
                ['', '', '', '', ''],
            ];
            const row = t.period - 1;
            const col = t.day;
            if (row >= 0 && row < 6 && col >= 0 && col < 5) {
                map[childId][row][col] = t.subject;
            }
        });
        setTimetables(map);
    }, []);

    const loadSchoolInfo = useCallback(async () => {
        const { data: notices } = await supabase.from('notices').select('*').order('date', { ascending: false });
        const { data: infoRows } = await supabase.from('school_info').select('*').order('sort_order', { ascending: true });

        const map = {};
        // notices
        (notices || []).forEach(n => {
            const childId = n.child_id;
            if (!map[childId]) map[childId] = { notices: [], morningActivity: '', safetyRules: [], schoolLifeRules: [], contactInfo: null };
            map[childId].notices.push({
                id: n.id, title: n.title, date: n.date, source: n.source,
                content: n.content, isNew: n.is_new,
            });
        });
        // school_info
        (infoRows || []).forEach(r => {
            const childId = r.child_id;
            if (!map[childId]) map[childId] = { notices: [], morningActivity: '', safetyRules: [], schoolLifeRules: [], contactInfo: null };
            if (r.info_type === 'morning_activity') {
                map[childId].morningActivity = r.content;
            } else if (r.info_type === 'safety_rule') {
                map[childId].safetyRules.push(r.content);
            } else if (r.info_type === 'school_life_rule') {
                map[childId].schoolLifeRules.push(r.content);
            } else if (r.info_type === 'contact_info') {
                if (!map[childId].contactInfo) map[childId].contactInfo = {};
                const [label, value] = r.content.split(': ');
                map[childId].contactInfo[label] = value || r.content;
            }
        });
        setSchoolInfo(map);
    }, []);

    const loadWeeklyCurriculum = useCallback(async () => {
        const { data } = await supabase.from('weekly_curriculum').select('*').order('week_start', { ascending: false });
        if (!data) return;
        const map = {};
        data.forEach(c => {
            const childId = c.child_id;
            if (!map[childId]) map[childId] = { week: '', subjects: [] };
            const ws = new Date(c.week_start);
            const weekLabel = `${ws.getMonth() + 1}/${ws.getDate()}~ `;
            if (!map[childId].week) map[childId].week = weekLabel;
            map[childId].subjects.push({ name: c.subject_name, content: c.content });
        });
        setWeeklyCurriculum(map);
    }, []);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([
                loadChildren(), loadTodos(), loadEvents(),
                loadBusSchedules(), loadTimetables(),
                loadSchoolInfo(), loadWeeklyCurriculum(),
            ]);
            setLoading(false);
        };
        loadAll();
    }, [loadChildren, loadTodos, loadEvents, loadBusSchedules, loadTimetables, loadSchoolInfo, loadWeeklyCurriculum]);

    /* ── CRUD (Supabase 연동) ── */
    const addTodo = async (childId, todo) => {
        const row = {
            child_id: childId,
            title: todo.title,
            category: todo.category,
            due_date: todo.dueDate || null,
            priority: todo.priority || 'medium',
            is_completed: false,
            source: todo.source || 'user',
        };
        const { data } = await supabase.from('todos').insert(row).select().single();
        if (data) {
            setTodos(prev => ({
                ...prev,
                [childId]: [...(prev[childId] || []), {
                    id: data.id, title: data.title, category: data.category,
                    dueDate: data.due_date, priority: data.priority,
                    isCompleted: data.is_completed, source: data.source,
                }],
            }));
        }
    };

    const toggleTodo = async (childId, todoId) => {
        const todo = (todos[childId] || []).find(t => t.id === todoId);
        if (!todo) return;
        const newVal = !todo.isCompleted;
        await supabase.from('todos').update({ is_completed: newVal }).eq('id', todoId);
        setTodos(prev => ({
            ...prev,
            [childId]: prev[childId].map(t => t.id === todoId ? { ...t, isCompleted: newVal } : t),
        }));
    };

    const deleteTodo = async (childId, todoId) => {
        await supabase.from('todos').delete().eq('id', todoId);
        setTodos(prev => ({
            ...prev,
            [childId]: prev[childId].filter(t => t.id !== todoId),
        }));
    };

    const addEvent = async (childId, event) => {
        const row = {
            child_id: childId,
            title: event.title,
            event_date: event.eventDate,
            is_dday: event.isDday || false,
        };
        const { data } = await supabase.from('events').insert(row).select().single();
        if (data) {
            setEvents(prev => ({
                ...prev,
                [childId]: [...(prev[childId] || []), {
                    id: data.id, title: data.title, eventDate: data.event_date, isDday: data.is_dday,
                }],
            }));
        }
    };

    const deleteEvent = async (childId, eventId) => {
        await supabase.from('events').delete().eq('id', eventId);
        setEvents(prev => ({
            ...prev,
            [childId]: prev[childId].filter(e => e.id !== eventId),
        }));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#8B7355' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
                    <div>데이터를 불러오는 중...</div>
                </div>
            </div>
        );
    }

    return (
        <DataContext.Provider value={{
            childrenData, todos, events, busSchedules, timetables, schoolInfo,
            weeklyCurriculum,
            addTodo, toggleTodo, deleteTodo, addEvent, deleteEvent,
            refreshData: () => Promise.all([loadTodos(), loadEvents(), loadSchoolInfo()]),
        }}>
            {reactChildren}
        </DataContext.Provider>
    );
}

export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used inside DataProvider');
    return ctx;
}
