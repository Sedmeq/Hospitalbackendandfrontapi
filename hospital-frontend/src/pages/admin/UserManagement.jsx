// import React, { useState, useEffect } from 'react';
// import { adminApi } from '../../api/adminApi';
// import { useToast } from '../../components/common/Toast';
// import LoadingSpinner from '../../components/common/LoadingSpinner';



// const UserManagement = () =>
// {
//     const [selectedRoleByUser, setSelectedRoleByUser] = useState({});

//     const [users, setUsers] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { showToast, ToastComponent } = useToast();

//     useEffect(() =>
//     {
//         loadUsers();
//         loadRoles();
//     }, []);

//     const loadUsers = async () =>
//     {
//         try
//         {
//             const response = await adminApi.getAllUsers();
//             setUsers(response.data);
//         } catch (error)
//         {
//             showToast('Error loading users', 'error');
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     const loadRoles = async () =>
//     {
//         try
//         {
//             const response = await adminApi.getAllRoles();
//             setRoles(response.data);
//         } catch (error)
//         {
//             console.error('Error loading roles:', error);
//         }
//     };

//     // const handleLockUser = async (userId) => {
//     //     try {
//     //         await adminApi.lockUser(userId);
//     //         showToast('User locked successfully', 'success');
//     //         loadUsers();
//     //     } catch (error) {
//     //         showToast('Error locking user', 'error');
//     //     }
//     // };

//     // const handleUnlockUser = async (userId) => {
//     //     try {
//     //         await adminApi.unlockUser(userId);
//     //         showToast('User unlocked successfully', 'success');
//     //         loadUsers();
//     //     } catch (error) {
//     //         showToast('Error unlocking user', 'error');
//     //     }
//     // };
//     const handleLockUser = async (userId) =>
//     {
//         try
//         {
//             await adminApi.lockUser(userId);

//             setUsers(prev =>
//                 prev.map(u => (u.id === userId ? { ...u, lockedOut: true } : u))
//             );

//             showToast('User locked successfully', 'success');
//         } catch (error)
//         {
//             showToast('Error locking user', 'error');
//         }
//     };

//     const handleUnlockUser = async (userId) =>
//     {
//         try
//         {
//             await adminApi.unlockUser(userId);

//             setUsers(prev =>
//                 prev.map(u => (u.id === userId ? { ...u, lockedOut: false } : u))
//             );

//             showToast('User unlocked successfully', 'success');
//         } catch (error)
//         {
//             showToast('Error unlocking user', 'error');
//         }
//     };

//     const handleAssignRole = async (userId) =>
//     {
//         const roleName = selectedRoleByUser[userId];

//         if (!roleName)
//         {
//             showToast('Select a role first', 'error');
//             return;
//         }

//         try
//         {
//             await adminApi.assignRole(userId, roleName);

//             setUsers(prev =>
//                 prev.map(u =>
//                 {
//                     if (u.id !== userId) return u;
//                     const current = u.roles || [];
//                     if (current.includes(roleName)) return u;
//                     return { ...u, roles: [...current, roleName] };
//                 })
//             );

//             showToast('Role assigned successfully', 'success');
//         } catch (e)
//         {
//             showToast('Error assigning role', 'error');
//         }
//     };

//     const handleRemoveRole = async (userId, roleName) =>
//     {
//         if (!window.confirm(`Remove role "${roleName}"?`)) return;

//         try
//         {
//             await adminApi.removeRole(userId, roleName);

//             setUsers(prev =>
//                 prev.map(u =>
//                     u.id === userId
//                         ? { ...u, roles: (u.roles || []).filter(r => r !== roleName) }
//                         : u
//                 )
//             );

//             showToast('Role removed successfully', 'success');
//         } catch (e)
//         {
//             showToast('Error removing role', 'error');
//         }
//     };


//     const handleDeleteUser = async (userId) =>
//     {
//         if (!window.confirm('Are you sure you want to delete this user?')) return;
//         try
//         {
//             await adminApi.hardDeleteUser(userId);
//             showToast('User deleted successfully', 'success');
//             loadUsers();
//         } catch (error)
//         {
//             showToast('Error deleting user', 'error');
//         }
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     return (
//         <div>
//             {ToastComponent}
//             <h2 className="mb-xl">User Management</h2>
//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Email</th>
//                                 <th>Roles</th>
//                                 <th>Status</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((user) => (
//                                 <tr key={user.id}>
//                                     <td>{user.firstName} {user.lastName}</td>

//                                     <td>{user.email}</td>
//                                     {/* <td>
//                                         {user.roles?.map((role, idx) => (
//                                             <span key={idx} className="badge badge-primary" style={{ marginRight: '0.25rem' }}>
//                                                 {role}
//                                             </span>
//                                         ))}
//                                     </td> */}

//                                     <td>
//                                         {user.roles?.length ? user.roles.map((role, idx) => (
//                                             <span
//                                                 key={idx}
//                                                 className="badge badge-primary"
//                                                 style={{ marginRight: '0.25rem', display: 'inline-flex', gap: 6, alignItems: 'center' }}
//                                             >
//                                                 {role}
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => handleRemoveRole(user.id, role)}
//                                                     style={{ border: 'none', background: 'transparent', color: 'white', cursor: 'pointer' }}
//                                                     title="Remove role"
//                                                 >
//                                                     ×
//                                                 </button>
//                                             </span>
//                                         )) : <span>-</span>}
//                                     </td>

//                                     <td>
//                                         <span className={`badge ${user.lockedOut ? 'badge-danger' : 'badge-success'}`}>
//                                             {user.lockedOut ? 'Deactive' : 'Active'}
//                                         </span>

//                                     </td>
//                                     <td>
//                                         <div className="flex gap-sm">

//                                             <select
//                                                 value={selectedRoleByUser[user.id] || ''}
//                                                 onChange={(e) =>
//                                                     setSelectedRoleByUser(prev => ({ ...prev, [user.id]: e.target.value }))
//                                                 }
//                                                 className="form-control form-control-sm"
//                                                 style={{ maxWidth: 160 }}
//                                             >
//                                                 <option value="">Select role</option>
//                                                 {roles.map((r, i) => (
//                                                     <option key={i} value={r}>{r}</option>
//                                                 ))}
//                                             </select>

//                                             <button
//                                                 className="btn btn-primary btn-sm"
//                                                 onClick={() => handleAssignRole(user.id)}
//                                             >
//                                                 Add Role
//                                             </button>

//                                             {user.lockedOut ? (
//                                                 <button className="btn btn-success btn-sm" onClick={() => handleUnlockUser(user.id)}>
//                                                     Unlock
//                                                 </button>
//                                             ) : (
//                                                 <button className="btn btn-warning btn-sm" onClick={() => handleLockUser(user.id)}>
//                                                     Lock
//                                                 </button>
//                                             )}
//                                             <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserManagement;


import React, { useState, useEffect, useMemo } from 'react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PAGE_SIZE = 25;

const UserManagement = () =>
{
    const [selectedRoleByUser, setSelectedRoleByUser] = useState({});

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast, ToastComponent } = useToast();

    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() =>
    {
        loadUsers();
        loadRoles();
    }, []);

    // ===== Filtered + Paginated =====
    const filteredUsers = useMemo(() =>
    {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) =>
        {
            const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
            const email = (u.email || '').toLowerCase();
            const rolesStr = (u.roles || []).join(' ').toLowerCase();
            return fullName.includes(q) || email.includes(q) || rolesStr.includes(q);
        });
    }, [users, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

    const paginatedUsers = useMemo(() =>
    {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredUsers.slice(start, start + PAGE_SIZE);
    }, [filteredUsers, currentPage]);

    useEffect(() =>
    {
        setCurrentPage(1);
    }, [searchQuery]);

    const getPageNumbers = () =>
    {
        const pages = [];
        const delta = 2;
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        pages.push(1);
        if (left > 2) pages.push("...");
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < totalPages - 1) pages.push("...");
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const loadUsers = async () =>
    {
        try
        {
            const response = await adminApi.getAllUsers();
            setUsers(response.data);
        } catch (error)
        {
            showToast('Error loading users', 'error');
        } finally
        {
            setLoading(false);
        }
    };

    const loadRoles = async () =>
    {
        try
        {
            const response = await adminApi.getAllRoles();
            setRoles(response.data);
        } catch (error)
        {
            console.error('Error loading roles:', error);
        }
    };

    const handleLockUser = async (userId) =>
    {
        try
        {
            await adminApi.lockUser(userId);
            setUsers(prev =>
                prev.map(u => (u.id === userId ? { ...u, lockedOut: true } : u))
            );
            showToast('User locked successfully', 'success');
        } catch (error)
        {
            showToast('Error locking user', 'error');
        }
    };

    const handleUnlockUser = async (userId) =>
    {
        try
        {
            await adminApi.unlockUser(userId);
            setUsers(prev =>
                prev.map(u => (u.id === userId ? { ...u, lockedOut: false } : u))
            );
            showToast('User unlocked successfully', 'success');
        } catch (error)
        {
            showToast('Error unlocking user', 'error');
        }
    };

    const handleAssignRole = async (userId) =>
    {
        const roleName = selectedRoleByUser[userId];
        if (!roleName)
        {
            showToast('Select a role first', 'error');
            return;
        }
        try
        {
            await adminApi.assignRole(userId, roleName);
            setUsers(prev =>
                prev.map(u =>
                {
                    if (u.id !== userId) return u;
                    const current = u.roles || [];
                    if (current.includes(roleName)) return u;
                    return { ...u, roles: [...current, roleName] };
                })
            );
            showToast('Role assigned successfully', 'success');
        } catch (e)
        {
            // Backend-dən gələn real error mesajını göstər (məs: yaş yoxlanışı uğursuzluğu)
            // Middleware: BadRequestException → { error: "..." }
            const apiMessage =
                e?.response?.data?.error ||     // { error: "..." } formatı  ← BadRequestException
                e?.response?.data?.message ||   // { message: "..." } formatı
                e?.response?.data ||            // plain string formatı
                e?.message ||
                'Error assigning role';
            showToast(typeof apiMessage === 'string' ? apiMessage : 'Error assigning role', 'error');
        }
    };

    const handleRemoveRole = async (userId, roleName) =>
    {
        if (!window.confirm(`Remove role "${roleName}"?`)) return;
        try
        {
            await adminApi.removeRole(userId, roleName);
            setUsers(prev =>
                prev.map(u =>
                    u.id === userId
                        ? { ...u, roles: (u.roles || []).filter(r => r !== roleName) }
                        : u
                )
            );
            showToast('Role removed successfully', 'success');
        } catch (e)
        {
            showToast('Error removing role', 'error');
        }
    };

    const handleDeleteUser = async (userId) =>
    {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try
        {
            await adminApi.hardDeleteUser(userId);
            showToast('User deleted successfully', 'success');
            loadUsers();
        } catch (error)
        {
            showToast('Error deleting user', 'error');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    const startItem = filteredUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(currentPage * PAGE_SIZE, filteredUsers.length);

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>User Management</h2>
            </div>

            {/* Search Bar */}
            <div className="card mb-md" style={{ padding: "12px 16px" }}>
                <div className="flex items-center gap-md">
                    <div style={{ flex: 1, position: "relative" }}>
                        <span style={{
                            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                            opacity: 0.45, pointerEvents: "none", fontSize: 15
                        }}>
                            🔍
                        </span>
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: 34 }}
                            placeholder="Search by name, email or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {searchQuery && (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.firstName} {user.lastName}</td>

                                    <td>{user.email}</td>

                                    <td>
                                        {user.roles?.length ? user.roles.map((role, idx) => (
                                            <span
                                                key={idx}
                                                className="badge badge-primary"
                                                style={{ marginRight: '0.25rem', display: 'inline-flex', gap: 6, alignItems: 'center' }}
                                            >
                                                {role}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRole(user.id, role)}
                                                    style={{ border: 'none', background: 'transparent', color: 'white', cursor: 'pointer' }}
                                                    title="Remove role"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )) : <span>-</span>}
                                    </td>

                                    <td>
                                        <span className={`badge ${user.lockedOut ? 'badge-danger' : 'badge-success'}`}>
                                            {user.lockedOut ? 'Deactive' : 'Active'}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="flex gap-sm">
                                            <select
                                                value={selectedRoleByUser[user.id] || ''}
                                                onChange={(e) =>
                                                    setSelectedRoleByUser(prev => ({ ...prev, [user.id]: e.target.value }))
                                                }
                                                className="form-control form-control-sm"
                                                style={{ maxWidth: 160 }}
                                            >
                                                <option value="">Select role</option>
                                                {roles.map((r, i) => (
                                                    <option key={i} value={r}>{r}</option>
                                                ))}
                                            </select>

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAssignRole(user.id)}
                                            >
                                                Add Role
                                            </button>

                                            {user.lockedOut ? (
                                                <button className="btn btn-success btn-sm" onClick={() => handleUnlockUser(user.id)}>
                                                    Unlock
                                                </button>
                                            ) : (
                                                <button className="btn btn-warning btn-sm" onClick={() => handleLockUser(user.id)}>
                                                    Lock
                                                </button>
                                            )}

                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", opacity: 0.7 }}>
                                        {searchQuery
                                            ? `No users found for "${searchQuery}".`
                                            : "No users found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <div className="flex justify-between items-center mt-md" style={{ padding: "8px 4px" }}>
                        <span style={{ fontSize: 13, opacity: 0.65 }}>
                            Showing {startItem}–{endItem} of {filteredUsers.length} users
                        </span>

                        {totalPages > 1 && (
                            <div className="flex gap-sm items-center">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    ← Prev
                                </button>

                                {getPageNumbers().map((page, idx) =>
                                    page === "..." ? (
                                        <span key={`ellipsis-${idx}`} style={{ padding: "0 4px", opacity: 0.5 }}>…</span>
                                    ) : (
                                        <button
                                            key={page}
                                            className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setCurrentPage(page)}
                                            style={{ minWidth: 34 }}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    className="btn btn-secondary btn-sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;