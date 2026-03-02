import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import BottomNav from '../components/BottomNav';
import './Calendar.css';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar() {
    const { childId } = useParams();
    const navigate = useNavigate();
    const { events, addEvent, deleteEvent } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newIsDday, setNewIsDday] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const childEvents = events[childId] || [];
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

    const eventsOnDate = (day) => {
        const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
        return childEvents.filter(e => e.eventDate === dateStr);
    };

    const selectedDateStr = `${monthStr}-${String(selectedDay).padStart(2, '0')}`;
    const selectedEvents = childEvents.filter(e => e.eventDate === selectedDateStr);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDate) return;
        addEvent(childId, { title: newTitle, eventDate: newDate, isDday: newIsDday });
        setNewTitle(''); setNewDate(''); setNewIsDday(false); setShowForm(false);
    };

    return (
        <div className="page calendar-page">
            <nav className="top-nav">
                <button className="back-btn" onClick={() => navigate(`/dashboard/${childId}`)}>←</button>
                <span className="header-title">일정 관리</span>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>+</button>
            </nav>

            {showForm && (
                <form className="card add-form animate-in" onSubmit={handleAdd}>
                    <input className="input-field" placeholder="일정 제목" value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus />
                    <input className="input-field" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
                    <label className="dday-check"><input type="checkbox" checked={newIsDday} onChange={e => setNewIsDday(e.target.checked)} /> D-Day로 등록</label>
                    <button type="submit" className="btn-primary">추가하기</button>
                </form>
            )}

            <div className="card calendar-card">
                <div className="month-header">
                    <span className="nav-arrow" onClick={prevMonth}>◀</span>
                    <span className="month-title">{year}년 {month + 1}월</span>
                    <span className="nav-arrow" onClick={nextMonth}>▶</span>
                </div>
                <div className="weekdays">
                    {DAYS.map((d, i) => <div key={d} className={i === 0 ? 'sun' : i === 6 ? 'sat' : ''}>{d}</div>)}
                </div>
                <div className="days-grid">
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e${i}`} className="day-cell empty" />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const hasEvents = eventsOnDate(day).length > 0;
                        const isSelected = selectedDay === day;
                        return (
                            <div key={day} className={`day-cell ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedDay(day)}>
                                {day}
                                {hasEvents && <div className="dot-container"><span className="dot" /></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="schedule-section">
                <div className="schedule-header">
                    <h3 className="section-title" style={{ marginBottom: 0 }}>상세 일정</h3>
                    <span className="date-badge">{month + 1}월 {selectedDay}일 ({DAYS[new Date(year, month, selectedDay).getDay()]})</span>
                </div>
                <div className="event-list">
                    {selectedEvents.length === 0 && <p style={{ color: '#999', fontSize: 14 }}>이 날짜에 등록된 일정이 없습니다.</p>}
                    {selectedEvents.map(ev => (
                        <div key={ev.id} className="event-card">
                            <div className="event-title">{ev.title}</div>
                            {ev.isDday && <span className="event-dday-badge">D-DAY ✨</span>}
                            <button className="delete-btn event-del" onClick={() => deleteEvent(childId, ev.id)}>✕</button>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
