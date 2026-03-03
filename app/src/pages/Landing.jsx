import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
    const { user, logout } = useAuth();
    const { childrenData, todos } = useData();
    const navigate = useNavigate();

    const children = Object.values(childrenData);

    const getUrgentTodos = (childId) => {
        const t = todos[childId] || [];
        // 매일숙제(daily) 제외, 학교할일 우선 정렬
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const catOrder = (t) => t.subCategory === 'school' ? 0 : 1;
        return t
            .filter(item => !item.isCompleted && item.recurrence !== 'daily')
            .sort((a, b) => catOrder(a) - catOrder(b) || priorityOrder[a.priority] - priorityOrder[b.priority] || new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'))
            .slice(0, 3);
    };

    const getRemainingCount = (childId) => {
        const t = todos[childId] || [];
        const incomplete = t.filter(item => !item.isCompleted);
        return Math.max(0, incomplete.length - 3);
    };

    return (
        <div className="page">
            {/* 상단 네비 */}
            <nav className="landing-nav">
                <span className="landing-greeting">
                    {user?.title} {user?.displayName}님 👋
                </span>
                <button className="nav-link-btn" onClick={logout}>로그아웃</button>
            </nav>

            {/* 타이틀 */}
            <header className="landing-header">
                <h1 className="landing-title">✨ 우리 가족 알리미</h1>
            </header>

            {/* 자녀 카드 목록 */}
            <div className="card-list">
                {children.map((child, idx) => (
                    <div
                        key={child.id}
                        className={`child-card card-${child.theme} animate-in animate-delay-${idx + 1}`}
                        onClick={() => navigate(`/dashboard/${child.id}`)}
                    >
                        <div className="deco-star star-1">✧</div>
                        <div className="card-header">
                            <img src={child.profileImage} alt={child.name} className="avatar" />
                            <div className="info-group">
                                <h2>{child.name}</h2>
                                <p>{child.school} {child.grade}학년 {child.classNumber}반</p>
                            </div>
                        </div>

                        <div className="todo-widget">
                            <div className="todo-widget-title">
                                <span>오늘 할 일 맛보기</span>
                                {getRemainingCount(child.id) > 0 && (
                                    <span className="todo-more">+ {getRemainingCount(child.id)}건 더</span>
                                )}
                            </div>
                            <ul className="todo-preview-list">
                                {getUrgentTodos(child.id).length === 0 ? (
                                    <li className="todo-empty">모든 할 일 완료! ✨</li>
                                ) : (
                                    getUrgentTodos(child.id).map(todo => (
                                        <li key={todo.id} className="todo-preview-item">
                                            <span className="check-star">☆</span>
                                            <span>{todo.title}</span>
                                            {todo.priority === 'high' && <span className="badge badge-urgent">긴급</span>}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                        <div className="deco-star star-2">✧</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
