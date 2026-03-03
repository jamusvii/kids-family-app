import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import BottomNav from '../components/BottomNav';
import './SchoolInfo.css';

export default function SchoolInfo() {
    const { childId } = useParams();
    const navigate = useNavigate();
    const { childrenData, timetables, busSchedules, schoolInfo, weeklyCurriculum } = useData();
    const child = childrenData[childId];

    const timetable = timetables[childId] || [];
    const busData = busSchedules[childId];
    const info = schoolInfo[childId] || {};
    const curriculum = weeklyCurriculum[childId] || {};
    const notices = info.notices || [];

    const today = new Date().getDay();
    const todayColIdx = today >= 1 && today <= 5 ? today - 1 : null;

    const PERIODS = ['1교시', '2교시', '3교시', '4교시', '5교시', '6교시'];
    const dayNames = ['월', '화', '수', '목', '금'];

    const [activeTab, setActiveTab] = useState('timetable');
    const [selectedNotice, setSelectedNotice] = useState(null); // 팝업용

    // 최신 알림장 1건
    const latestNotice = notices[0] || null;

    if (!child) return <p>잘못된 접근입니다.</p>;

    return (
        <div className="page school-page">
            <nav className="top-nav">
                <button className="back-btn" onClick={() => navigate(`/dashboard/${childId}`)}>←</button>
                <span className="header-title">학교 정보</span>
                <div style={{ width: 30 }} />
            </nav>

            {/* 탭 메뉴 */}
            <div className="school-tabs">
                <button className={`school-tab ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}>🏫 시간표</button>
                <button className={`school-tab ${activeTab === 'curriculum' ? 'active' : ''}`} onClick={() => setActiveTab('curriculum')}>📚 학습내용</button>
                <button className={`school-tab ${activeTab === 'notices' ? 'active' : ''}`} onClick={() => setActiveTab('notices')}>📢 알림장</button>
                <button className={`school-tab ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>📋 생활안내</button>
            </div>

            <div className="school-content">
                {/* 시간표 탭 */}
                {activeTab === 'timetable' && (
                    <>
                        <section>
                            <h2 className="section-title">🏫 이번 주 시간표</h2>
                            <div className="card">
                                <table className="timetable">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {dayNames.map((d, i) => (
                                                <th key={d} className={todayColIdx === i ? 'today-col' : ''}>{d}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timetable.map((row, ri) => (
                                            <tr key={ri}>
                                                <td className="period">{PERIODS[ri]}</td>
                                                {row.map((cell, ci) => (
                                                    <td key={ci} className={`${todayColIdx === ci ? 'today-col' : ''} ${!cell ? 'empty-cell' : ''}`}>
                                                        {cell || '-'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* 최신 알림장 카드 — 시간표 아래 */}
                        {latestNotice && (
                            <section>
                                <h2 className="section-title">📢 최신 알림장</h2>
                                <div className="card notice-preview-card" onClick={() => setSelectedNotice(latestNotice)}>
                                    <div className="notice-preview-header">
                                        <span className="notice-preview-title">{latestNotice.title}</span>
                                        {latestNotice.isNew && <span className="badge badge-new">NEW</span>}
                                    </div>
                                    <p className="notice-preview-date">{latestNotice.date} · {latestNotice.source}</p>
                                    <p className="notice-preview-body">{latestNotice.content?.split('\n')[0]}</p>
                                    <span className="notice-preview-more">탭하여 전체 보기 →</span>
                                </div>
                            </section>
                        )}

                        {/* 통학 버스 */}
                        <section>
                            <h2 className="section-title">🚌 통학 버스</h2>
                            {busData ? (
                                <div className="card">
                                    <div className="bus-section">
                                        <h3 className="bus-section-title">🌅 등교 (매일)</h3>
                                        <div className="bus-detail-row">
                                            <span>{busData.commute.boarding.location} {busData.commute.boarding.time} 출발</span>
                                            <span className="bus-arrow">→</span>
                                            <span>학교 {busData.commute.arrival.time} 도착</span>
                                        </div>
                                        <span className="bus-route-badge">{busData.commute.route}</span>
                                    </div>
                                    <div className="bus-section">
                                        <h3 className="bus-section-title">🌇 하교 (요일별)</h3>
                                        {dayNames.map(day => {
                                            const d = busData.dismissal?.[day];
                                            if (!d) return null;
                                            return (
                                                <div key={day} className="bus-detail-row">
                                                    <span className="bus-day-label">{day}</span>
                                                    <span>학교 {d.departure}</span>
                                                    <span className="bus-arrow">→</span>
                                                    <span>4단지 {d.arrival4}</span>
                                                    <span className="bus-route-badge">{d.route}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="card">
                                    <p className="no-bus-text">통학버스 이용 안함 (도보/자가 통학)</p>
                                </div>
                            )}
                        </section>
                    </>
                )}

                {/* 학습내용 탭 */}
                {activeTab === 'curriculum' && curriculum.subjects && (
                    <section>
                        <h2 className="section-title">📚 주간 학습 내용 — {curriculum.week}</h2>
                        <div className="curriculum-list">
                            {curriculum.subjects.map((s, i) => (
                                <div key={i} className="card curriculum-card">
                                    <div className="curriculum-subject">{s.name}</div>
                                    <div className="curriculum-content">{s.content}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 알림장 탭 */}
                {activeTab === 'notices' && (
                    <section>
                        <h2 className="section-title">📢 알림장 / 가정통신문</h2>
                        {notices.length === 0 ? (
                            <div className="card"><p className="empty-msg">알림장이 없습니다</p></div>
                        ) : (
                            <div className="notice-list">
                                {notices.map(notice => (
                                    <div key={notice.id} className="card notice-card clickable" onClick={() => setSelectedNotice(notice)}>
                                        <div className="notice-header">
                                            <span className="notice-title">
                                                {notice.title}
                                                {notice.isNew && <span className="badge badge-new">NEW</span>}
                                            </span>
                                            <span className="notice-date">{notice.date}</span>
                                        </div>
                                        <p className="notice-source">{notice.source}</p>
                                        <p className="notice-preview">{notice.content?.split('\n')[0]}...</p>
                                        <span className="notice-tap-hint">탭하여 전체 보기 →</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* 생활안내 탭 */}
                {activeTab === 'rules' && (
                    <>
                        <section>
                            <h2 className="section-title">📖 아침 활동</h2>
                            <div className="card"><p className="info-text">{info.morningActivity}</p></div>
                        </section>
                        <section>
                            <h2 className="section-title">🛡️ 안전 지도</h2>
                            <div className="card">
                                <ul className="rule-list">
                                    {(info.safetyRules || []).map((rule, i) => <li key={i}>{rule}</li>)}
                                </ul>
                            </div>
                        </section>
                        <section>
                            <h2 className="section-title">🏫 학교생활 안내</h2>
                            <div className="card">
                                <ul className="rule-list">
                                    {(info.schoolLifeRules || []).map((rule, i) => <li key={i}>{rule}</li>)}
                                </ul>
                            </div>
                        </section>
                        {info.contactInfo && Object.keys(info.contactInfo).length > 0 && (
                            <section>
                                <h2 className="section-title">📞 연락처 안내</h2>
                                <div className="card">
                                    <div className="contact-grid">
                                        {Object.entries(info.contactInfo).map(([label, value]) => (
                                            <div key={label} className="contact-item">
                                                <span className="contact-label">{label}</span>
                                                <span className="contact-value">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>

            <BottomNav />

            {/* 알림장 팝업 모달 — 중앙 위치 */}
            {selectedNotice && (
                <div className="notice-modal-overlay" onClick={() => setSelectedNotice(null)}>
                    <div className="notice-modal-center" onClick={e => e.stopPropagation()}>
                        <div className="modal-top-bar">
                            <div className="modal-header">
                                <span className="modal-title">{selectedNotice.title}</span>
                                {selectedNotice.isNew && <span className="badge badge-new">NEW</span>}
                            </div>
                            <button className="modal-close-btn" onClick={() => setSelectedNotice(null)}>✕</button>
                        </div>
                        <p className="modal-meta">{selectedNotice.date} · {selectedNotice.source}</p>
                        <div className="modal-divider" />
                        <div className="modal-body">
                            {selectedNotice.content?.split('\n').filter(l => l.trim()).map((line, i) => (
                                <div key={i} className="modal-item">
                                    <span className="modal-line">{line}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
