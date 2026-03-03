import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import BottomNav from '../components/BottomNav';
import './AcademyInfo.css';

const DAY_ORDER = ['월', '화', '수', '목', '금', '토'];

export default function AcademyInfo() {
    const { childId } = useParams();
    const navigate = useNavigate();
    const { childrenData, academies, afterSchool } = useData();

    const child = childrenData[childId];
    if (!child) return <p>잘못된 접근입니다.</p>;

    const themeClass = child.theme === 'mint' ? 'theme-mint' : 'theme-pink';
    const myAcademies = academies[childId] || [];
    const myAfterSchool = afterSchool[childId] || [];

    // 요일별 스케줄 (방과후 + 학원)
    const schedule = {};
    DAY_ORDER.forEach(d => { schedule[d] = []; });
    myAfterSchool.forEach(a => {
        if (schedule[a.day]) schedule[a.day].push({ type: 'afterschool', name: a.programName, startTime: a.startTime, endTime: a.endTime, pickup: a.pickupMethod });
    });
    myAcademies.filter(a => a.day !== 'TBD').forEach(a => {
        if (schedule[a.day]) schedule[a.day].push({ type: 'academy', name: `${a.type}${a.academyName ? ' (' + a.academyName + ')' : ''}`, startTime: a.startTime, endTime: a.endTime });
    });

    const today = new Date();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const todayName = dayNames[today.getDay()];

    return (
        <div className={`academy-page ${themeClass}`}>
            <nav className="top-nav">
                <button className="back-btn" onClick={() => navigate('/')}>←</button>
                <span className="header-title">학원정보</span>
                <div style={{ width: 30 }} />
            </nav>

            <div className="academy-content">
                {/* 주간 스케줄 */}
                <section>
                    <h2 className="section-title">📅 주간 스케줄</h2>
                    <div className="week-schedule">
                        {DAY_ORDER.map(day => {
                            const items = schedule[day];
                            const isToday = day === todayName;
                            return (
                                <div key={day} className={`day-row ${isToday ? 'today' : ''} ${items.length === 0 ? 'empty' : ''}`}>
                                    <span className="day-label">{day}</span>
                                    <div className="day-items">
                                        {items.length === 0
                                            ? <span className="day-empty">-</span>
                                            : items.map((item, i) => (
                                                <div key={i} className={`schedule-chip ${item.type}`}>
                                                    <span className="chip-name">{item.name}</span>
                                                    {item.startTime && <span className="chip-time">{item.startTime}~{item.endTime}</span>}
                                                    {item.pickup === 'parent_pickup' && <span className="chip-pickup">🚗 픽업</span>}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 방과후학습 */}
                {myAfterSchool.length > 0 && (
                    <section>
                        <h2 className="section-title">🏫 방과후학습</h2>
                        <div className="card academy-list">
                            {myAfterSchool.map(a => (
                                <div key={a.id} className="academy-item">
                                    <div className="academy-badge afterschool">방과후</div>
                                    <div className="academy-info">
                                        <div className="academy-name">{a.programName}</div>
                                        <div className="academy-meta">{a.day}요일 · {a.startTime}~{a.endTime} {a.location && `· ${a.location}`}</div>
                                        <div className={`academy-pickup ${a.pickupMethod === 'parent_pickup' ? 'pickup-parent' : 'pickup-bus'}`}>
                                            {a.pickupMethod === 'parent_pickup' ? '🚗 엄마 픽업' : '🚌 버스 탑승'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 학원 목록 */}
                <section>
                    <h2 className="section-title">🎓 학원 목록</h2>
                    {myAcademies.length === 0 ? (
                        <div className="card"><p className="empty-msg">등록된 학원이 없습니다</p></div>
                    ) : (
                        <div className="card academy-list">
                            {myAcademies.map(a => (
                                <div key={a.id} className="academy-item">
                                    <div className="academy-badge academy-type">{a.type}</div>
                                    <div className="academy-info">
                                        <div className="academy-name">{a.academyName || `${a.type} (학원명 미정)`}</div>
                                        <div className="academy-meta">
                                            {a.day === 'TBD' ? '요일/시간 미정' : `${a.day}요일 · ${a.startTime || '?'}~${a.endTime || '?'}`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <BottomNav />
        </div>
    );
}
