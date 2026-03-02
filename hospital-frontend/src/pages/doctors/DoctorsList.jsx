// import React, { useEffect, useState } from "react";
// import { doctorApi } from "../../api/doctorApi";
// import { departmentApi } from "../../api/departmentApi";
// import { useToast } from "../../components/common/Toast";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import Modal from "../../components/common/Modal";

// import { useNavigate } from "react-router-dom";


// const API_BASE = "http://localhost:5151";

// const getImageUrl = (path) =>
// {
//     if (!path) return "";
//     if (path.startsWith("http")) return path;
//     if (path.startsWith("/")) return `${API_BASE}${path}`;
//     return `${API_BASE}/${path}`;
// };

// const DoctorsList = () =>
// {
//     const [doctors, setDoctors] = useState([]);
//     const [departments, setDepartments] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [showModal, setShowModal] = useState(false);
//     const [editingDoctor, setEditingDoctor] = useState(null);

//     const { showToast, ToastComponent } = useToast();

//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         specialty: "",
//         phone: "",
//         biography: "",
//         departmentId: "",
//         image: null,
//         removeImage: false,
//     });

//     const navigate = useNavigate();

//     const handleView = (doctorId) =>
//     {
//         navigate(`/doctor-details/${doctorId}`);
//     };

//     useEffect(() =>
//     {
//         loadDoctors();
//         loadDepartments();
//     }, []);

//     const loadDoctors = async () =>
//     {
//         try
//         {
//             const res = await doctorApi.getAllDoctors();
//             setDoctors(res.data);
//         } catch (e)
//         {
//             showToast("Error loading doctors", "error");
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     const loadDepartments = async () =>
//     {
//         try
//         {
//             const res = await departmentApi.getAllDepartments();
//             setDepartments(res.data);
//         } catch (e)
//         {
//             console.error(e);
//         }
//     };

//     const resetForm = () =>
//     {
//         setFormData({
//             firstName: "",
//             lastName: "",
//             email: "",
//             password: "",
//             specialty: "",
//             phone: "",
//             biography: "",
//             departmentId: "",
//             image: null,
//             removeImage: false,
//         });
//         setEditingDoctor(null);
//     };


//     const handleChange = (e) =>
//     {
//         setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//     };

//     const handleFileChange = (e) =>
//     {
//         const file = e.target.files?.[0] || null;
//         setFormData((p) => ({ ...p, image: file }));
//     };


//     // ✅ Swagger field adları ilə FormData
//     const buildDoctorFormData = () =>
//     {
//         const fd = new FormData();

//         // Update-də Id lazımdır
//         if (editingDoctor)
//         {
//             fd.append("Id", String(editingDoctor.id));
//         }

//         fd.append("FirstName", formData.firstName);
//         fd.append("LastName", formData.lastName);
//         fd.append("Phone", formData.phone);
//         fd.append("Specialty", formData.specialty);
//         fd.append("DepartmentId", String(formData.departmentId || 0));
//         fd.append("Biography", formData.biography || "");

//         // şəkli silmək üçün checkbox
//         fd.append("RemoveImage", String(!!formData.removeImage));

//         // yeni şəkil seçilibsə göndər
//         if (formData.image)
//         {
//             fd.append("Image", formData.image);
//         }

//         // Create-də səndə Email+Password var (Swagger create)
//         if (!editingDoctor)
//         {
//             fd.append("Email", formData.email);
//             fd.append("Password", formData.password);
//         }

//         return fd;
//     };

//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();

//         try
//         {
//             const fd = buildDoctorFormData();

//             if (editingDoctor)
//             {
//                 await doctorApi.updateDoctor(editingDoctor.id, fd);
//                 showToast("Doctor updated successfully", "success");
//             } else
//             {
//                 await doctorApi.createDoctor(fd);
//                 showToast("Doctor created successfully", "success");
//             }

//             setShowModal(false);
//             resetForm();
//             loadDoctors();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || "Operation failed", "error");
//         }
//     };

//     const handleEdit = (doctor) =>
//     {
//         setEditingDoctor(doctor);

//         // doctor dto-nun sahələri səndə necə gəlir bilmirəm.
//         // çox vaxt FullName olur → parçalama:
//         const nameParts = (doctor.fullName || "").trim().split(" ");
//         const firstName = nameParts[0] || "";
//         const lastName = nameParts.slice(1).join(" ") || "";

//         setFormData({
//             firstName,
//             lastName,
//             email: doctor.email || "",
//             password: "", // edit zamanı boş saxla
//             specialty: doctor.specialty || "",
//             phone: doctor.phone || "",
//             biography: doctor.biography || "",
//             departmentId: doctor.departmentId || "",
//             image: null,
//         });

//         setShowModal(true);
//     };

//     const handleDelete = async (id) =>
//     {
//         if (!window.confirm("Are you sure you want to delete this doctor?")) return;

//         try
//         {
//             await doctorApi.deleteDoctor(id);
//             showToast("Doctor deleted successfully", "success");
//             loadDoctors();
//         } catch (e)
//         {
//             showToast("Error deleting doctor", "error");
//         }
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     return (
//         <div>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Doctors Management</h2>

//                 <button
//                     className="btn btn-primary"
//                     onClick={() =>
//                     {
//                         resetForm();
//                         setShowModal(true);
//                     }}
//                 >
//                     + Add Doctor
//                 </button>
//             </div>

//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Image</th>
//                                 <th>Name</th>
//                                 <th>Specialty</th>
//                                 <th>Phone</th>
//                                 <th>Email</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {doctors.map((d) => (
//                                 <tr key={d.id}>
//                                     <td>
//                                         {d.imagePath ? (
//                                             <img
//                                                 src={getImageUrl(d.imagePath)}
//                                                 alt={d.firstName || d.fullName || "doctor"}
//                                                 style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
//                                             />
//                                         ) : (
//                                             <span>-</span>
//                                         )}
//                                     </td>


//                                     <td>{d.fullName || `${d.firstName || ""} ${d.lastName || ""}`}</td>
//                                     <td>{d.specialty}</td>
//                                     <td>{d.phone}</td>
//                                     <td>{d.email}</td>
//                                     <td>


//                                         <div className="flex gap-sm">
//                                             <button
//                                                 className="btn btn-info btn-sm"
//                                                 onClick={() => handleView(d.id)}
//                                             > View
//                                             </button>
//                                             <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(d)}>
//                                                 Edit
//                                             </button>
//                                             <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {doctors.length === 0 && (
//                                 <tr>
//                                     <td colSpan="5" style={{ textAlign: "center" }}>
//                                         No doctors found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             <Modal
//                 isOpen={showModal}
//                 onClose={() =>
//                 {
//                     setShowModal(false);
//                     resetForm();
//                 }}
//                 title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">First Name</label>
//                         <input
//                             name="firstName"
//                             className="form-input"
//                             value={formData.firstName}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Last Name</label>
//                         <input
//                             name="lastName"
//                             className="form-input"
//                             value={formData.lastName}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             className="form-input"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     {/* Create-də tələb olunur */}
//                     {!editingDoctor && (
//                         <div className="form-group">
//                             <label className="form-label">Password</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 className="form-input"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     )}

//                     {/* Edit-də istəsən dəyişmək üçün optional */}
//                     {editingDoctor && (
//                         <div className="form-group">
//                             <label className="form-label">
//                                 <input
//                                     type="checkbox"
//                                     checked={formData.removeImage}
//                                     onChange={(e) =>
//                                         setFormData((p) => ({ ...p, removeImage: e.target.checked }))
//                                     }
//                                 />{" "}
//                                 Remove current image
//                             </label>
//                         </div>
//                     )}

//                     <div className="form-group">
//                         <label className="form-label">Specialty</label>
//                         <input
//                             name="specialty"
//                             className="form-input"
//                             value={formData.specialty}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Phone</label>
//                         <input
//                             name="phone"
//                             className="form-input"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Biography</label>
//                         <textarea
//                             name="biography"
//                             className="form-input"
//                             rows={3}
//                             value={formData.biography}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Department</label>
//                         <select
//                             name="departmentId"
//                             className="form-select"
//                             value={formData.departmentId}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Department</option>
//                             {departments.map((dept) => (
//                                 <option key={dept.id} value={dept.id}>
//                                     {dept.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Image</label>
//                         <input type="file" accept="image/*" className="form-input" onChange={handleFileChange} />
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button
//                             type="button"
//                             className="btn btn-secondary"
//                             onClick={() =>
//                             {
//                                 setShowModal(false);
//                                 resetForm();
//                             }}
//                         >
//                             Cancel
//                         </button>

//                         <button type="submit" className="btn btn-primary">
//                             {editingDoctor ? "Update" : "Create"}
//                         </button>
//                     </div>
//                 </form>
//             </Modal>
//         </div>
//     );
// };

// export default DoctorsList;


import React, { useEffect, useState, useMemo } from "react";
import { doctorApi } from "../../api/doctorApi";
import { departmentApi } from "../../api/departmentApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";

import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5151";
const PAGE_SIZE = 25;

const getImageUrl = (path) =>
{
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `${API_BASE}${path}`;
    return `${API_BASE}/${path}`;
};

const DoctorsList = () =>
{
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);

    const { showToast, ToastComponent } = useToast();

    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        specialty: "",
        phone: "",
        biography: "",
        departmentId: "",
        image: null,
        removeImage: false,
    });

    const navigate = useNavigate();

    const handleView = (doctorId) =>
    {
        navigate(`/doctor-details/${doctorId}`);
    };

    useEffect(() =>
    {
        loadDoctors();
        loadDepartments();
    }, []);

    // ===== Filtered + Paginated =====
    const filteredDoctors = useMemo(() =>
    {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return doctors;
        return doctors.filter((d) =>
        {
            const fullName = (d.fullName || `${d.firstName || ""} ${d.lastName || ""}`).toLowerCase();
            const specialty = (d.specialty || "").toLowerCase();
            const email = (d.email || "").toLowerCase();
            const phone = (d.phone || "").toLowerCase();
            return (
                fullName.includes(q) ||
                specialty.includes(q) ||
                email.includes(q) ||
                phone.includes(q)
            );
        });
    }, [doctors, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PAGE_SIZE));

    const paginatedDoctors = useMemo(() =>
    {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredDoctors.slice(start, start + PAGE_SIZE);
    }, [filteredDoctors, currentPage]);

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

    const loadDoctors = async () =>
    {
        try
        {
            const res = await doctorApi.getAllDoctors();
            setDoctors(res.data);
        } catch (e)
        {
            showToast("Error loading doctors", "error");
        } finally
        {
            setLoading(false);
        }
    };

    const loadDepartments = async () =>
    {
        try
        {
            const res = await departmentApi.getAllDepartments();
            setDepartments(res.data);
        } catch (e)
        {
            console.error(e);
        }
    };

    const resetForm = () =>
    {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            specialty: "",
            phone: "",
            biography: "",
            departmentId: "",
            image: null,
            removeImage: false,
        });
        setEditingDoctor(null);
    };

    const handleChange = (e) =>
    {
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) =>
    {
        const file = e.target.files?.[0] || null;
        setFormData((p) => ({ ...p, image: file }));
    };

    const buildDoctorFormData = () =>
    {
        const fd = new FormData();

        if (editingDoctor)
        {
            fd.append("Id", String(editingDoctor.id));
        }

        fd.append("FirstName", formData.firstName);
        fd.append("LastName", formData.lastName);
        fd.append("Phone", formData.phone);
        fd.append("Specialty", formData.specialty);
        fd.append("DepartmentId", String(formData.departmentId || 0));
        fd.append("Biography", formData.biography || "");
        fd.append("RemoveImage", String(!!formData.removeImage));

        if (formData.image)
        {
            fd.append("Image", formData.image);
        }

        if (!editingDoctor)
        {
            fd.append("Email", formData.email);
            fd.append("Password", formData.password);
        }

        return fd;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        try
        {
            const fd = buildDoctorFormData();

            if (editingDoctor)
            {
                await doctorApi.updateDoctor(editingDoctor.id, fd);
                showToast("Doctor updated successfully", "success");
            } else
            {
                await doctorApi.createDoctor(fd);
                showToast("Doctor created successfully", "success");
            }

            setShowModal(false);
            resetForm();
            loadDoctors();
        } catch (error)
        {
            showToast(error.response?.data?.message || "Operation failed", "error");
        }
    };

    const handleEdit = (doctor) =>
    {
        setEditingDoctor(doctor);

        const nameParts = (doctor.fullName || "").trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData({
            firstName,
            lastName,
            email: doctor.email || "",
            password: "",
            specialty: doctor.specialty || "",
            phone: doctor.phone || "",
            biography: doctor.biography || "",
            departmentId: doctor.departmentId || "",
            image: null,
        });

        setShowModal(true);
    };

    const handleDelete = async (id) =>
    {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;

        try
        {
            await doctorApi.deleteDoctor(id);
            showToast("Doctor deleted successfully", "success");
            loadDoctors();
        } catch (e)
        {
            showToast("Error deleting doctor", "error");
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    const startItem = filteredDoctors.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(currentPage * PAGE_SIZE, filteredDoctors.length);

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>Doctors Management</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => { resetForm(); setShowModal(true); }}
                >
                    + Add Doctor
                </button>
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
                            placeholder="Search by name, specialty, email or phone..."
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
                                <th>Image</th>
                                <th>Name</th>
                                <th>Specialty</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedDoctors.map((d) => (
                                <tr key={d.id}>
                                    <td>
                                        {d.imagePath ? (
                                            <img
                                                src={getImageUrl(d.imagePath)}
                                                alt={d.firstName || d.fullName || "doctor"}
                                                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                                            />
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>

                                    <td>{d.fullName || `${d.firstName || ""} ${d.lastName || ""}`}</td>
                                    <td>{d.specialty}</td>
                                    <td>{d.phone}</td>
                                    <td>{d.email}</td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() => handleView(d.id)}
                                            >
                                                View
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(d)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedDoctors.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", opacity: 0.7 }}>
                                        {searchQuery
                                            ? `No doctors found for "${searchQuery}".`
                                            : "No doctors found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredDoctors.length > 0 && (
                    <div className="flex justify-between items-center mt-md" style={{ padding: "8px 4px" }}>
                        <span style={{ fontSize: 13, opacity: 0.65 }}>
                            Showing {startItem}–{endItem} of {filteredDoctors.length} doctors
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

            {/* Add / Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); resetForm(); }}
                title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                            name="firstName"
                            className="form-input"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                            name="lastName"
                            className="form-input"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!editingDoctor && (
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {editingDoctor && (
                        <div className="form-group">
                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    checked={formData.removeImage}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, removeImage: e.target.checked }))
                                    }
                                />{" "}
                                Remove current image
                            </label>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Specialty</label>
                        <input
                            name="specialty"
                            className="form-input"
                            value={formData.specialty}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                            name="phone"
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Biography</label>
                        <textarea
                            name="biography"
                            className="form-input"
                            rows={3}
                            value={formData.biography}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Department</label>
                        <select
                            name="departmentId"
                            className="form-select"
                            value={formData.departmentId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image</label>
                        <input type="file" accept="image/*" className="form-input" onChange={handleFileChange} />
                    </div>

                    <div className="flex gap-md justify-between mt-lg">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => { setShowModal(false); resetForm(); }}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn btn-primary">
                            {editingDoctor ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DoctorsList;