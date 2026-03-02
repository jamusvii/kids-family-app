import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import BottomNav from '../components/BottomNav';
import './Dashboard.css';

export default function Dashboard() {
    const { childId } = useParams();
    const navigate = useNavigate();
    const { childrenData, todos, events, busSchedules, timetables, schoolInfo, toggleTodo } = useData();

    const child = childrenData[childId];
    if (!child) return <p>잘못된 접근입니다.</p>;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=일..6=토
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    /* 이번 주 월~금 계산 */
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const weekLabel = `${monday.getMonth() + 1}/${monday.getDate()}(월) ~ ${friday.getMonth() + 1}/${friday.getDate()}(금)`;

    /* 이번 주 핵심 할 일 */
    const weekTodos = (todos[childId] || [])
        .filter(t => !t.isCompleted)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    const completedTodos = (todos[childId] || []).filter(t => t.isCompleted).slice(0, 2);

    /* D-Day 이벤트 */
    const ddayEvents = (events[childId] || [])
        .filter(e => e.isDday && new Date(e.eventDate) >= today)
        .map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.eventDate) - today) / (1000 * 60 * 60 * 24)) }))
        .sort((a, b) => a.daysLeft - b.daysLeft);

    /* 오늘 시간표 */
    const timetable = timetables[childId] || [];
    const todayColIdx = dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek - 1 : null;
    const todaySubjects = todayColIdx !== null
        ? timetable.map(row => row[todayColIdx]).filter(s => s && s !== '-')
        : [];

    /* 오늘 버스 정보 */
    const busData = busSchedules[childId];
    const todayDayName = dayNames[dayOfWeek];
    let busInfo = null;
    if (busData) {
        const dismissalToday = busData.dismissal?.[todayDayName];
        busInfo = {
            commute: busData.commute,
            dismissal: dismissalToday,
        };
    }

    /* 최근 알림 */
    const recentNotices = (schoolInfo[childId]?.notices || [])
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    const themeClass = child.theme === 'mint' ? 'theme-mint' : 'theme-pink';

    return (
        <div className={`dashboard-page ${themeClass}`}>
            {/* 헤더 */}
            <nav className="top-nav">
                <button className="back-btn" onClick={() => navigate('/')}>←</button>
                <div className="header-profile">
                    <img src={child.profileImage} alt={child.name} className="avatar-small" />
                    <span className="header-title">{child.name}</span>
                </div>
                <div style={{ width: 30 }} />
            </nav>

            {/* 주간 배너 */}
            <div className="week-banner">
                <span className="week-banner-icon">📆</span>
                <span className="week-banner-text">{weekLabel} 주간</span>
            </div>

            <div className="dash-content">
                {/* 오늘 시간표 */}
                {todaySubjects.length > 0 && (
                    <section>
                        <h2 className="section-title">📅 오늘 시간표 ({dayNames[dayOfWeek]}요일)</h2>
                        <div className="card today-timetable-card">
                            <div className="today-timetable">
                                {todaySubjects.map((subject, idx) => (
                                    <div key={idx} className="timetable-pill">
                                        <span className="pill-period">{idx + 1}</span>
                                        <span className="pill-subject">{subject}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 이번 주 핵심 할 일 */}
                <section>
                    <h2 className="section-title">📌 이번 주 핵심 할 일</h2>
                    <div className="card">
                        <ul className="task-list">
                            {weekTodos.map(todo => (
                                <li key={todo.id} className="task-item">
                                    <button className="check-btn" onClick={() => toggleTodo(childId, todo.id)}>✔</button>
                                    <div className="task-content">
                                        <span className="task-text">{todo.title}</span>
                                        <div className="task-meta">
                                            <span className="badge badge-cat">{todo.category}</span>
                                            {todo.priority === 'high' && <span className="badge badge-urgent">긴급</span>}
                                            {todo.source === 'hiclass' && <span className="badge badge-hiclass">하이클래스</span>}
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {completedTodos.map(todo => (
                                <li key={todo.id} className="task-item done">
                                    <button className="check-btn done-btn" onClick={() => toggleTodo(childId, todo.id)}>✔</button>
                                    <div className="task-content">
                                        <span className="task-text">{todo.title}</span>
                                    </div>
                                </li>
                            ))}
                            {weekTodos.length === 0 && completedTodos.length === 0 && (
                                <li className="task-empty">할 일이 없습니다 ✨</li>
                            )}
                        </ul>
                    </div>
                </section>

                {/* D-Day */}
                {ddayEvents.length > 0 && (
                    <section>
                        <h2 className="section-title">⏰ D-Day 메모</h2>
                        <div className="dday-container">
                            {ddayEvents.map((ev, idx) => (
                                <div key={ev.id} className={`dday-card dday-color-${idx % 3}`}>
                                    <div className="dday-number">D-{ev.daysLeft}</div>
                                    <div className="dday-title">{ev.title}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 버스 / 하교 정보 */}
                <section>
                    <h2 className="section-title">🚌 오늘 스케줄</h2>
                    <div className="card bus-card">
                        <div className="bus-icon">🚌</div>
                        {busInfo ? (
                            <div className="bus-info">
                                <div className="bus-row">
                                    <span className="bus-label">🌅 등교</span>
                                    <span className="bus-time">{busInfo.commute.boarding.location} {busInfo.commute.boarding.time} → 학교 {busInfo.commute.arrival.time}</span>
                                </div>
                                {busInfo.dismissal ? (
                                    <div className="bus-row">
                                        <span className="bus-label">🌇 하교</span>
                                        <span className="bus-time">학교 {busInfo.dismissal.departure} → 4단지 {busInfo.dismissal.arrival4} ({busInfo.dismissal.route})</span>
                                    </div>
                                ) : (
                                    <div className="bus-row">
                                        <span className="bus-label">🌇 하교</span>
                                        <span className="bus-time">주말은 버스 운행 없음 🎉</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bus-info">
                                <h3>통학버스 이용 안함</h3>
                                <p>도보 또는 자가 통학</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 최근 알림 */}
                {recentNotices.length > 0 && (
                    <section>
                        <h2 className="section-title">📢 최근 알림</h2>
                        <div className="notice-preview-list">
                            {recentNotices.map(notice => (
                                <div key={notice.id} className="card notice-preview-card" onClick={() => navigate(`/dashboard/${childId}/school`)}>
                                    <div className="notice-preview-row">
                                        <div className="notice-preview-info">
                                            <span className="notice-preview-title">
                                                {notice.title}
                                                {notice.isNew && <span className="badge badge-new">NEW</span>}
                                            </span>
                                            <span className="notice-preview-date">{notice.date} · {notice.source}</span>
                                        </div>
                                        <span className="notice-arrow">›</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
