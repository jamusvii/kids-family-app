import { NavLink, useParams } from 'react-router-dom';

export default function BottomNav() {
    const { childId } = useParams();

    return (
        <nav className="bottom-nav">
            <NavLink to={`/dashboard/${childId}`} end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">🏠</span><span>대시보드</span>
            </NavLink>
            <NavLink to={`/dashboard/${childId}/todos`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">📋</span><span>할일관리</span>
            </NavLink>
            <NavLink to={`/dashboard/${childId}/school`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">🏫</span><span>학교정보</span>
            </NavLink>
        </nav>
    );
}
