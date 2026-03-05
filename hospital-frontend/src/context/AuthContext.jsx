// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authApi } from '../api/authApi';

// const AuthContext = createContext(null);

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Check for existing token on mount
//         const storedToken = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');

//         if (storedToken && storedUser) {
//             setToken(storedToken);
//             setUser(JSON.parse(storedUser));
//         }
//         setLoading(false);
//     }, []);

//     const login = async (credentials) => {
//         try {
//             const response = await authApi.login(credentials);
//             const { token, fullName, email, roles } = response.data;

//             const userData = { fullName, email, roles };

//             localStorage.setItem('token', token);
//             localStorage.setItem('user', JSON.stringify(userData));

//             setToken(token);
//             setUser(userData);

//             return { success: true };
//         } catch (error) {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || 'Login failed'
//             };
//         }
//     };

//     const register = async (userData) => {
//         try {
//             const response = await authApi.register(userData);
//             return { success: true, data: response.data };
//         } catch (error) {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || 'Registration failed'
//             };
//         }
//     };

//     const logout = async () => {
//         try {
//             await authApi.logout();
//         } catch (error) {
//             console.error('Logout error:', error);
//         } finally {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             setToken(null);
//             setUser(null);
//         }
//     };

//     const hasRole = (role) => {
//         return user?.roles?.includes(role) || false;
//     };

//     const value = {
//         user,
//         token,
//         loading,
//         login,
//         register,
//         logout,
//         hasRole,
//         isAuthenticated: !!token,
//     };

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

























// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authApi } from '../api/authApi';

// const AuthContext = createContext(null);

// export const useAuth = () =>
// {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error('useAuth must be used within an AuthProvider');
//     return context;
// };

// export const AuthProvider = ({ children }) =>
// {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const syncTokenFromHash = () =>
//     {
//         const hash = window.location.hash;
//         if (!hash || hash.length < 2) return;

//         const params = new URLSearchParams(hash.substring(1));
//         const token = params.get("token");
//         const name = params.get("name");
//         const roles = params.get("roles");

//         if (token)
//         {
//             localStorage.setItem("authToken", token);
//             if (name) localStorage.setItem("userName", decodeURIComponent(name));
//             if (roles) localStorage.setItem("userRoles", decodeURIComponent(roles));
//         }

//         // hash-i təmizlə
//         window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
//     };

//     useEffect(() =>
//     {
//         // ✅ Əvvəlcə hash-dən token varsa localStorage-a yaz
//         syncTokenFromHash();

//         const storedToken = localStorage.getItem('authToken');
//         const storedUserName = localStorage.getItem('userName');
//         const storedRoles = localStorage.getItem('userRoles');

//         if (storedToken)
//         {
//             setToken(storedToken);
//             setUser({
//                 fullName: storedUserName || '',
//                 roles: storedRoles ? JSON.parse(storedRoles) : [],
//             });
//         }

//         setLoading(false);
//     }, []); // ✅ token dəyişdikdə yenidən yoxla (google login sonrası üçün)

//     // useEffect(() =>
//     // {
//     //     // ✅ template ilə eyni açarlar
//     //     const storedToken = localStorage.getItem('authToken');
//     //     const storedUserName = localStorage.getItem('userName');
//     //     const storedRoles = localStorage.getItem('userRoles');

//     //     if (storedToken)
//     //     {
//     //         setToken(storedToken);
//     //         setUser({
//     //             fullName: storedUserName || '',
//     //             roles: storedRoles ? JSON.parse(storedRoles) : [],
//     //         });
//     //     }

//     //     setLoading(false);
//     // }, []);

//     const login = async (credentials) =>
//     {
//         try
//         {
//             const response = await authApi.login(credentials);
//             const { token, fullName, email, roles } = response.data;

//             // ✅ localStorage (template bunu oxuyacaq)
//             localStorage.setItem('authToken', token);
//             localStorage.setItem('userName', fullName || email || '');
//             localStorage.setItem('userRoles', JSON.stringify(roles || []));

//             // ✅ react state
//             setToken(token);
//             setUser({ fullName, email, roles });

//             // ✅ Login.jsx result.token istifadə edə bilsin
//             return { success: true, token, fullName, email, roles };
//         } catch (error)
//         {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || error.response?.data || 'Login failed'
//             };
//         }
//     };

//     const register = async (userData) =>
//     {
//         try
//         {
//             const response = await authApi.register(userData);
//             return { success: true, data: response.data };
//         } catch (error)
//         {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || error.response?.data || 'Registration failed'
//             };
//         }
//     };

//     const logout = async () =>
//     {
//         try
//         {
//             // ⚠️ logout authorize tələb edir, authApi.logout header göndərməlidir (aşağıda)
//             await authApi.logout();
//         } catch (error)
//         {
//             console.error('Logout error:', error);
//         } finally
//         {
//             // ✅ yalnız auth key-ləri sil
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('userName');
//             localStorage.removeItem('userRoles');

//             setToken(null);
//             setUser(null);
//         }
//     };

//     const hasRole = (role) => user?.roles?.includes(role) || false;

//     const value = {
//         user,
//         token,
//         loading,
//         login,
//         register,
//         logout,
//         hasRole,
//         isAuthenticated: !!token,
//     };

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };









// import React, { createContext, useState, useContext, useEffect } from "react";
// import { authApi } from "../api/authApi";

// const AuthContext = createContext(null);

// export const useAuth = () =>
// {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error("useAuth must be used within an AuthProvider");
//     return context;
// };

// function safeParseRoles(raw)
// {
//     if (!raw) return [];
//     try
//     {
//         const val = JSON.parse(raw);
//         return Array.isArray(val) ? val : [];
//     } catch
//     {
//         return [];
//     }
// }

// export const AuthProvider = ({ children }) =>
// {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const syncTokenFromHash = () =>
//     {
//         const hash = window.location.hash;
//         if (!hash || !hash.includes("token=")) return false;

//         const params = new URLSearchParams(hash.substring(1));
//         const t = params.get("token");
//         const name = params.get("name");
//         const roles = params.get("roles");

//         if (t)
//         {
//             localStorage.setItem("authToken", t);
//             if (name) localStorage.setItem("userName", decodeURIComponent(name));
//             if (roles) localStorage.setItem("userRoles", decodeURIComponent(roles));
//         }

//         // hash-i təmizlə
//         window.history.replaceState(
//             {},
//             document.title,
//             window.location.pathname + window.location.search
//         );

//         return !!t;
//     };

//     const loadFromStorage = () =>
//     {
//         const storedToken = localStorage.getItem("authToken");
//         const storedUserName = localStorage.getItem("userName");
//         const storedRoles = localStorage.getItem("userRoles");

//         if (storedToken)
//         {
//             setToken(storedToken);
//             setUser({
//                 fullName: storedUserName || "",
//                 roles: safeParseRoles(storedRoles),
//             });
//             return;
//         }

//         setToken(null);
//         setUser(null);
//     };

//     useEffect(() =>
//     {
//         // ilk load
//         syncTokenFromHash();
//         loadFromStorage();
//         setLoading(false);

//         // ✅ hash dəyişəndə (template -> /dashboard#token=...) yenidən tut
//         const onHashChange = () =>
//         {
//             const changed = syncTokenFromHash();
//             if (changed) loadFromStorage();
//         };

//         window.addEventListener("hashchange", onHashChange);
//         return () => window.removeEventListener("hashchange", onHashChange);
//     }, []);

//     const login = async (credentials) =>
//     {
//         try
//         {
//             const response = await authApi.login(credentials);
//             const { token, fullName, email, roles } = response.data;

//             localStorage.setItem("authToken", token);
//             localStorage.setItem("userName", fullName || email || "");
//             localStorage.setItem("userRoles", JSON.stringify(roles || []));

//             setToken(token);
//             setUser({ fullName: fullName || "", email: email || "", roles: roles || [] });

//             return { success: true, token, fullName, email, roles };
//         } catch (error)
//         {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || error.response?.data || "Login failed",
//             };
//         }
//     };

//     const register = async (userData) =>
//     {
//         try
//         {
//             const response = await authApi.register(userData);
//             return { success: true, data: response.data };
//         } catch (error)
//         {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || error.response?.data || "Registration failed",
//             };
//         }
//     };

//     const logout = async () =>
//     {
//         try
//         {
//             await authApi.logout();
//         } catch (error)
//         {
//             console.error("Logout error:", error);
//         } finally
//         {
//             localStorage.removeItem("authToken");
//             localStorage.removeItem("userName");
//             localStorage.removeItem("userRoles");
//             setToken(null);
//             setUser(null);
//         }
//     };

//     const hasRole = (role) => user?.roles?.includes(role) || false;

//     const value = {
//         user,
//         token,
//         loading,
//         login,
//         register,
//         logout,
//         hasRole,
//         isAuthenticated: !!token,
//     };

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () =>
{
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

function safeParseRoles(raw)
{
    if (!raw) return [];
    try
    {
        const val = JSON.parse(raw);
        return Array.isArray(val) ? val : [];
    }
    catch
    {
        return [];
    }
}

export const AuthProvider = ({ children }) =>
{
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // ✅ FIX: loading başlanğıcda true, yalnız auth yoxlandıqdan sonra false olur
    const [loading, setLoading] = useState(true);

    /**
     * URL hash-dən token oxu, localStorage-a yaz.
     * Token varsa true, yoxsa false qaytarır.
     */
    const syncTokenFromHash = () =>
    {
        const hash = window.location.hash;
        if (!hash || !hash.includes('token=')) return false;

        const params = new URLSearchParams(hash.substring(1));
        const t = params.get('token');
        const name = params.get('name');
        const roles = params.get('roles');

        if (t)
        {
            localStorage.setItem('authToken', t);
            if (name) localStorage.setItem('userName', decodeURIComponent(name));
            if (roles) localStorage.setItem('userRoles', decodeURIComponent(roles));
        }

        // hash-i URL-dən təmizlə
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname + window.location.search
        );

        return !!t;
    };

    /**
     * localStorage-dan oxu, React state-i yenilə.
     * ✅ FIX: state set-ləri sinxron qeydiyyatdan keçir;
     * setLoading(false) bu funksiya çağırılandan SONRA
     * useEffect-in sonunda çağırılır – beləliklə race condition aradan qalxır.
     */
    const loadFromStorage = () =>
    {
        const storedToken = localStorage.getItem('authToken');
        const storedUserName = localStorage.getItem('userName');
        const storedRoles = localStorage.getItem('userRoles');

        if (storedToken)
        {
            setToken(storedToken);
            setUser({
                fullName: storedUserName || '',
                roles: safeParseRoles(storedRoles),
            });
        }
        else
        {
            setToken(null);
            setUser(null);
        }
    };

    useEffect(() =>
    {
        // 1. Əvvəl hash-dən token al (Google redirect halında)
        syncTokenFromHash();

        // 2. localStorage-dan state-i yüklə
        loadFromStorage();

        // 3. ✅ FIX: Yalnız BU nöqtədə loading-i bitir.
        //    loadFromStorage sinxron setState çağırır – bunlar
        //    eyni React render batch-inə düşəcək, setLoading(false)
        //    ilə birlikdə. Bu sayədə ProtectedRoute loading=false
        //    gördükdə token artıq state-dədir.
        setLoading(false);

        // hashchange: başqa tabda və ya manuel hash dəyişəndə (template → dashboard)
        const onHashChange = () =>
        {
            const changed = syncTokenFromHash();
            if (changed) loadFromStorage();
        };

        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    // ── Normal e-mail/şifrə login ──────────────────────────────────────────
    const login = async (credentials) =>
    {
        try
        {
            const response = await authApi.login(credentials);
            const { token, fullName, email, roles } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('userName', fullName || email || '');
            localStorage.setItem('userRoles', JSON.stringify(roles || []));

            setToken(token);
            setUser({ fullName: fullName || '', email: email || '', roles: roles || [] });

            return { success: true, token, fullName, email, roles };
        }
        catch (error)
        {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data || 'Login failed',
            };
        }
    };

    // ── Google login (Login.jsx-dən birbaşa çağırılır) ─────────────────────
    const loginWithGoogle = (result) =>
    {
        const { token, fullName, email, roles } = result;

        localStorage.setItem('authToken', token);
        localStorage.setItem('userName', fullName || email || '');
        localStorage.setItem('userRoles', JSON.stringify(roles || []));

        setToken(token);
        setUser({ fullName: fullName || '', email: email || '', roles: roles || [] });
    };

    // ── Register ────────────────────────────────────────────────────────────
    const register = async (userData) =>
    {
        try
        {
            const response = await authApi.register(userData);
            return { success: true, data: response.data };
        }
        catch (error)
        {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data || 'Registration failed',
            };
        }
    };

    // ── Logout ──────────────────────────────────────────────────────────────
    const logout = async () =>
    {
        try
        {
            await authApi.logout();
        }
        catch (error)
        {
            console.error('Logout error:', error);
        }
        finally
        {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRoles');
            setToken(null);
            setUser(null);
        }
    };

    const hasRole = (role) => user?.roles?.includes(role) || false;

    const value = {
        user,
        token,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        hasRole,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};