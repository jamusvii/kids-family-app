import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import BottomNav from '../components/BottomNav';
import './TodoList.css';

const TABS = [
    { key: 'today', label: '📌 오늘할일' },
    { key: 'homework', label: '📝 매일숙제' },
    { key: 'weekly', label: '📋 주간할일' },
];

const PRIORITY_LABELS = { high: { label: '🔴 긴급', cls: 'badge-urgent' }, medium: { label: '🟡 보통', cls: 'badge-medium' }, low: { label: '🟢 여유', cls: 'badge-low' } };

const DAILY_HOMEWORK = ['한자', '연산수학', '기탄국어', '독서'];

export default function TodoList() {
    const { childId } = useParams();
    const navigate = useNavigate();
    const { childrenData, todos, homeworkLogs, addTodo, toggleTodo, deleteTodo, toggleHomework } = useData();

    const child = childrenData[childId];
    const themeClass = child?.theme === 'mint' ? 'theme-mint' : 'theme-pink';

    const [activeTab, setActiveTab] = useState('today');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', subCategory: 'school', priority: 'medium', dueDate: '', category: '학교' });
    const [subFilter, setSubFilter] = useState('all'); // all | school | homework

    // 오늘할일: recurrence='once' 이면서 complete 안된 것 + 오늘/다음날 마감
    const todayTodos = (todos[childId] || []).filter(t => t.recurrence === 'once');
    const todaySchool = todayTodos.filter(t => t.subCategory === 'school' || t.subCategory == null);
    const todayHomework = todayTodos.filter(t => t.subCategory === 'homework');

    // 주간할일: 이번 주 내 마감 or 마감 없는 once 할일
    const weeklyTodos = todayTodos.filter(t => {
        if (t.isCompleted) return false;
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        const today = new Date();
        const diff = (due - today) / (1000 * 60 * 60 * 24);
        return diff > 1; // 내일 이후
    });

    // 매일숙제 완료 여부
    const todayLogs = homeworkLogs[childId] || [];

    if (!child) return <p>잘못된 접근입니다.</p>;

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        await addTodo(childId, {
            title: form.title.trim(),
            category: form.subCategory === 'school' ? '학교' : '숙제',
            subCategory: form.subCategory,
            priority: form.priority,
            dueDate: form.dueDate || null,
            recurrence: 'once',
        });
        setForm({ title: '', subCategory: 'school', priority: 'medium', dueDate: '', category: '학교' });
        setShowForm(false);
    };

    const getDueDateLabel = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
        const diff = Math.floor((due - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { label: '⚠️ 지남', cls: 'badge-overdue' };
        if (diff === 0) return { label: '오늘', cls: 'badge-today' };
        if (diff === 1) return { label: '내일', cls: 'badge-tomorrow' };
        return { label: `D-${diff}`, cls: 'badge-dday' };
    };

    const renderTodoItem = (todo) => {
        const dl = getDueDateLabel(todo.dueDate);
        return (
            <div key={todo.id} className={`todo-item ${todo.isCompleted ? 'done' : ''}`}>
                <button className={`check-btn ${todo.isCompleted ? 'done-btn' : ''}`} onClick={() => toggleTodo(childId, todo.id)}>
                    {todo.isCompleted ? '✓' : ''}
                </button>
                <div className="todo-content">
                    <span className="todo-text">{todo.title}</span>
                    <div className="todo-meta">
                        {todo.source === 'hiclass' && <span className="badge badge-hiclass">하이클래스</span>}
                        <span className={`badge ${PRIORITY_LABELS[todo.priority]?.cls || 'badge-medium'}`}>{PRIORITY_LABELS[todo.priority]?.label || '🟡 보통'}</span>
                        {dl && <span className={`badge ${dl.cls}`}>{dl.label}</span>}
                    </div>
                </div>
                <button className="delete-btn" onClick={() => deleteTodo(childId, todo.id)}>🗑</button>
            </div>
        );
    };

    return (
        <div className={`todolist-page ${themeClass}`}>
            <nav className="top-nav">
                <button className="back-btn" onClick={() => navigate('/')}>←</button>
                <span className="header-title">할일관리</span>
                <button className="add-btn" onClick={() => setShowForm(f => !f)}>+</button>
            </nav>

            {/* 탭 */}
            <div className="tab-bar">
                {TABS.map(tab => (
                    <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 할일 추가 폼 */}
            {showForm && activeTab !== 'homework' && (
                <form className="todo-form card" onSubmit={handleAddTodo}>
                    <input className="form-input" placeholder="할일 내용을 입력하세요" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
                    <div className="form-row">
                        <select className="form-select" value={form.subCategory} onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))}>
                            <option value="school">🏫 학교</option>
                            <option value="homework">📖 숙제</option>
                        </select>
                        <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                            <option value="high">🔴 긴급</option>
                            <option value="medium">🟡 보통</option>
                            <option value="low">🟢 여유</option>
                        </select>
                        <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">추가</button>
                        <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>취소</button>
                    </div>
                </form>
            )}

            <div className="todo-content-area">
                {/* 오늘할일 탭 */}
                {activeTab === 'today' && (
                    <div>
                        <section className="todo-section">
                            <h3 className="section-label">🏫 학교</h3>
                            {todaySchool.length === 0 ? <p className="empty-msg">항목이 없습니다</p>
                                : todaySchool.map(renderTodoItem)}
                        </section>
                        <section className="todo-section">
                            <h3 className="section-label">📖 숙제</h3>
                            {todayHomework.length === 0 ? <p className="empty-msg">항목이 없습니다</p>
                                : todayHomework.map(renderTodoItem)}
                        </section>
                    </div>
                )}

                {/* 매일숙제 탭 */}
                {activeTab === 'homework' && (
                    <div>
                        <p className="homework-desc">주중 매일 체크하는 학습 루틴입니다. 매일 자동으로 초기화됩니다.</p>
                        <div className="homework-list">
                            {DAILY_HOMEWORK.map(item => {
                                const done = todayLogs.includes(item);
                                return (
                                    <div key={item} className={`homework-item ${done ? 'done' : ''}`} onClick={() => toggleHomework(childId, item)}>
                                        <span className={`hw-check ${done ? 'checked' : ''}`}>{done ? '✓' : ''}</span>
                                        <span className="hw-title">{item}</span>
                                        {done && <span className="hw-done-label">완료!</span>}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="homework-progress">
                            <span>{todayLogs.length} / {DAILY_HOMEWORK.length} 완료</span>
                            <div className="hw-progress-bar">
                                <div className="hw-progress-fill" style={{ width: `${(todayLogs.length / DAILY_HOMEWORK.length) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* 주간할일 탭 */}
                {activeTab === 'weekly' && (
                    <div>
                        <section className="todo-section">
                            {weeklyTodos.length === 0 ? <p className="empty-msg">이번 주 예정된 할일이 없습니다 🎉</p>
                                : weeklyTodos.map(renderTodoItem)}
                        </section>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
