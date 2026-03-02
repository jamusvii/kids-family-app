import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import BottomNav from '../components/BottomNav';
import './TodoList.css';

const CATEGORIES = ['준비물', '과제', '학교', '학원', '생활'];

export default function TodoList() {
    const { childId } = useParams();
    const navigate = useNavigate();
    const { childrenData, todos, toggleTodo, addTodo, deleteTodo } = useData();
    const child = childrenData[childId];

    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('학교');
    const [newDueDate, setNewDueDate] = useState('');
    const [newPriority, setNewPriority] = useState('medium');

    const allTodos = todos[childId] || [];

    const filtered = filter === 'all'
        ? allTodos.filter(t => !t.isCompleted)
        : filter === 'done'
            ? allTodos.filter(t => t.isCompleted)
            : allTodos.filter(t => t.category === filter && !t.isCompleted);

    // 정렬: 우선순위(high→medium→low) → 마감일 순
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sorted = [...filtered].sort((a, b) => {
        if (filter === 'done') return 0;
        const pDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
        if (pDiff !== 0) return pDiff;
        return new Date(a.dueDate || '2099-12-31') - new Date(b.dueDate || '2099-12-31');
    });

    const completedCount = allTodos.filter(t => t.isCompleted).length;
    const totalCount = allTodos.length;

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        addTodo(childId, {
            title: newTitle,
            category: newCategory,
            dueDate: newDueDate || null,
            isCompleted: false,
            priority: newPriority,
            source: 'user',
        });
        setNewTitle('');
        setNewDueDate('');
        setNewPriority('medium');
        setShowForm(false);
    };

    const getDueDateLabel = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const today = new Date();
        const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) return '지남';
        if (diff === 0) return '오늘';
        if (diff === 1) return '내일';
        return dateStr.slice(5);
    };

    return (
        <div className="page todolist-page">
            <nav className="top-nav">
                <button className="back-btn" onClick={() => navigate(`/dashboard/${childId}`)}>←</button>
                <span className="header-title">할일 관리</span>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>+</button>
            </nav>

            {/* 진행률 */}
            <div className="progress-bar-container">
                <div className="progress-info">
                    <span>{completedCount}/{totalCount} 완료</span>
                    <span>{totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0}%</span>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${totalCount > 0 ? completedCount / totalCount * 100 : 0}%` }} />
                </div>
            </div>

            {/* 필터 탭 */}
            <div className="filter-tabs">
                {['all', ...CATEGORIES, 'done'].map(f => (
                    <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f === 'all' ? '전체' : f === 'done' ? `완료(${completedCount})` : f}
                    </button>
                ))}
            </div>

            {/* 추가 폼 */}
            {showForm && (
                <form className="card add-form animate-in" onSubmit={handleAdd}>
                    <input
                        className="input-field"
                        placeholder="할 일을 입력하세요"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        autoFocus
                    />
                    <div className="form-row">
                        <select className="input-field" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <select className="input-field" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                            <option value="high">🔴 긴급</option>
                            <option value="medium">🟡 보통</option>
                            <option value="low">🟢 여유</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <input className="input-field" type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} />
                    </div>
                    <button type="submit" className="btn-primary">추가하기</button>
                </form>
            )}

            {/* 할 일 리스트 */}
            <div className="todo-full-list">
                {sorted.length === 0 && <p className="task-empty">
                    {filter === 'done' ? '완료된 항목이 없습니다.' : '해당 항목이 없습니다. ✨'}
                </p>}
                {sorted.map(todo => (
                    <div key={todo.id} className={`card todo-card ${todo.isCompleted ? 'done' : ''}`}>
                        <div className="todo-card-row">
                            <button className={`check-btn ${todo.isCompleted ? 'done-btn' : ''}`} onClick={() => toggleTodo(childId, todo.id)}>✔</button>
                            <div className="todo-card-content">
                                <span className={`todo-card-text ${todo.isCompleted ? 'line-through' : ''}`}>{todo.title}</span>
                                <div className="task-meta">
                                    <span className="badge badge-cat">{todo.category}</span>
                                    {todo.priority === 'high' && <span className="badge badge-urgent">긴급</span>}
                                    {todo.priority === 'low' && <span className="badge badge-low">여유</span>}
                                    {todo.dueDate && <span className={`badge ${getDueDateLabel(todo.dueDate) === '지남' ? 'badge-urgent' : 'badge-warning'}`}>{getDueDateLabel(todo.dueDate)}</span>}
                                    {todo.source === 'hiclass' && <span className="badge badge-hiclass">하이클래스</span>}
                                </div>
                            </div>
                            <button className="delete-btn" onClick={() => deleteTodo(childId, todo.id)}>✕</button>
                        </div>
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
}
