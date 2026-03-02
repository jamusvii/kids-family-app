import { createContext, useContext, useState, useEffect } from 'react';

const FAMILY_MEMBERS = {
  '이병화': { role: 'parent', title: '아빠', displayName: '이병화' },
  '김영란': { role: 'parent', title: '엄마', displayName: '김영란' },
  '이연준': { role: 'child', title: '아들', displayName: '이연준', childId: 'yeonjun' },
  '이아연': { role: 'child', title: '딸', displayName: '이아연', childId: 'ahyeon' },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('family_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (name) => {
    const trimmed = name.trim();
    const member = FAMILY_MEMBERS[trimmed];
    if (!member) return { success: false, error: '등록된 가족 구성원 이름이 아닙니다.' };
    const userData = { ...member, name: trimmed };
    setUser(userData);
    localStorage.setItem('family_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('family_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
