import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const result = login(name);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg-overlay" />
            <div className="login-card animate-in">
                <h1 className="login-title">✨ 우리 가족 알리미</h1>
                <p className="login-subtitle">이름을 입력하고 입장하세요</p>
                <form onSubmit={handleSubmit}>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>
                        입장하기
                    </button>
                </form>
                <div className="login-family-hint">
                    👨 이병화 · 👩 김영란 · 🧒 이연준 · 👧 이아연
                </div>
            </div>
        </div>
    );
}
