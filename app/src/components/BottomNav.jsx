import { NavLink, useParams } from 'react-router-dom';

const NAV_ITEMS = [
    { to: '', label: '대시보드', icon: '🏠' },
    { to: '/todos', label: '할일관리', icon: '📋' },
    { to: '/school', label: '학교정보', icon: '🏫' },
    { to: '/academy', label: '학원정보', icon: '🎓' },
];

export default function BottomNav() {
    const { childId } = useParams();
    const base = `/dashboard/${childId}`;

    return (
        <nav className="bottom-nav">
            {NAV_ITEMS.map(item => (
                <NavLink
                    key={item.to}
                    to={`${base}${item.to}`}
                    end={item.to === ''}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
