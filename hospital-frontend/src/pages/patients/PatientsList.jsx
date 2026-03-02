// import React, { useState, useEffect } from 'react';
// import { patientApi } from '../../api/patientApi';
// import { useToast } from '../../components/common/Toast';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import Modal from '../../components/common/Modal';

// const PatientsList = () =>
// {
//     const [patients, setPatients] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [editingPatient, setEditingPatient] = useState(null);
//     const [showHistory, setShowHistory] = useState(false);
//     const [patientHistory, setPatientHistory] = useState(null);
//     const { showToast, ToastComponent } = useToast();

//     // ✅ Backend CreatePatientCommand-a uyğun
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         email: '',
//         password: '',        // ✅ create üçün lazımdır
//         gender: '',
//         dateOfBirth: '',
//         city: '',
//         address: '',
//     });

//     useEffect(() =>
//     {
//         loadPatients();
//     }, []);

//     const loadPatients = async () =>
//     {
//         try
//         {
//             const response = await patientApi.getAllPatients();
//             setPatients(response.data);
//         } catch (error)
//         {
//             showToast('Error loading patients', 'error');
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();
//         try
//         {
//             if (editingPatient)
//             {
//                 // ✅ edit zamanı password göndərməmək daha düzgündür (backend bunu tələb etmirsə)
//                 const { password, ...updatePayload } = formData;
//                 await patientApi.updatePatient(editingPatient.id, updatePayload);
//                 showToast('Patient updated successfully', 'success');
//             } else
//             {
//                 await patientApi.createPatient(formData);
//                 showToast('Patient created successfully', 'success');
//             }

//             setShowModal(false);
//             resetForm();
//             loadPatients();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || 'Operation failed', 'error');
//         }
//     };

//     const handleEdit = (patient) =>
//     {
//         setEditingPatient(patient);

//         // ✅ backend-də adlar necə gəlirsə ona uyğun doldur.
//         // Əgər API list-də firstName/lastName yox, fullName göndərirsə, split edirik.
//         const fullName = patient.fullName || '';
//         const parts = fullName.trim().split(' ');
//         const firstName = patient.firstName || parts[0] || '';
//         const lastName = patient.lastName || parts.slice(1).join(' ') || '';

//         setFormData({
//             firstName,
//             lastName,
//             phone: patient.phone || '',
//             email: patient.email || '',
//             password: '', // ✅ edit-də boş saxla
//             gender: patient.gender || '',
//             dateOfBirth: patient.dateOfBirth?.split('T')[0] || '',
//             city: patient.city || '',
//             address: patient.address || '',
//         });

//         setShowModal(true);
//     };

//     const handleDelete = async (id) =>
//     {
//         if (!window.confirm('Are you sure you want to delete this patient?')) return;

//         try
//         {
//             await patientApi.deletePatient(id);
//             showToast('Patient deleted successfully', 'success');
//             loadPatients();
//         } catch (error)
//         {
//             showToast('Error deleting patient', 'error');
//         }
//     };

//     const viewHistory = async (id) =>
//     {
//         try
//         {
//             const response = await patientApi.getPatientHistory(id);
//             setPatientHistory(response.data);
//             setShowHistory(true);
//         } catch (error)
//         {
//             showToast('Error loading patient history', 'error');
//         }
//     };

//     const resetForm = () =>
//     {
//         setFormData({
//             firstName: '',
//             lastName: '',
//             phone: '',
//             email: '',
//             password: '',
//             gender: '',
//             dateOfBirth: '',
//             city: '',
//             address: '',
//         });
//         setEditingPatient(null);
//     };

//     const handleChange = (e) =>
//     {
//         setFormData((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     return (
//         <div>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Patients Management</h2>
//                 <button
//                     className="btn btn-primary"
//                     onClick={() =>
//                     {
//                         resetForm();
//                         setShowModal(true);
//                     }}
//                 >
//                     + Add Patient
//                 </button>
//             </div>

//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Gender</th>
//                                 <th>Phone</th>
//                                 <th>Email</th>
//                                 <th>City</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {patients.map((patient) => (
//                                 <tr key={patient.id}>
//                                     {/* ✅ fullName yoxdursa first+last göstər */}
//                                     <td>{patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim()}</td>
//                                     <td>{patient.gender}</td>
//                                     <td>{patient.phone}</td>
//                                     <td>{patient.email}</td>
//                                     <td>{patient.city}</td>
//                                     <td>
//                                         <div className="flex gap-sm">
//                                             <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(patient)}>
//                                                 Edit
//                                             </button>
//                                             <button className="btn btn-primary btn-sm" onClick={() => viewHistory(patient.id)}>
//                                                 History
//                                             </button>
//                                             <button className="btn btn-danger btn-sm" onClick={() => handleDelete(patient.id)}>
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

//             <Modal
//                 isOpen={showModal}
//                 onClose={() =>
//                 {
//                     setShowModal(false);
//                     resetForm();
//                 }}
//                 title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
//             >
//                 <form onSubmit={handleSubmit}>
//                     {/* ✅ First/Last name */}
//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">First Name</label>
//                             <input
//                                 type="text"
//                                 name="firstName"
//                                 className="form-input"
//                                 value={formData.firstName}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Last Name</label>
//                             <input
//                                 type="text"
//                                 name="lastName"
//                                 className="form-input"
//                                 value={formData.lastName}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
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

//                     {/* ✅ Create zamanı Password */}
//                     {!editingPatient && (
//                         <div className="form-group">
//                             <label className="form-label">Password</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 className="form-input"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                                 minLength={6}
//                             />
//                         </div>
//                     )}

//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">Gender</label>
//                             <select
//                                 name="gender"
//                                 className="form-select"
//                                 value={formData.gender}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="">Select Gender</option>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                                 <option value="Other">Other</option>
//                             </select>
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Date of Birth</label>
//                             <input
//                                 type="date"
//                                 name="dateOfBirth"
//                                 className="form-input"
//                                 value={formData.dateOfBirth}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">Phone</label>
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 className="form-input"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>



//                         <div className="form-group">
//                             <label className="form-label">City</label>
//                             <input
//                                 type="text"
//                                 name="city"
//                                 className="form-input"
//                                 value={formData.city}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                     </div>



//                     <div className="form-group">
//                         <label className="form-label">Address</label>
//                         <textarea
//                             name="address"
//                             className="form-textarea"
//                             value={formData.address}
//                             onChange={handleChange}
//                             rows="3"
//                         />
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
//                             {editingPatient ? 'Update' : 'Create'}
//                         </button>
//                     </div>
//                 </form>
//             </Modal>

//             <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Patient History">
//                 {patientHistory && (
//                     <div>
//                         <h4>Appointments</h4>
//                         {patientHistory.appointments?.length > 0 ? (
//                             <ul>
//                                 {patientHistory.appointments.map((apt, idx) => (
//                                     <li key={idx}>
//                                         {new Date(apt.date).toLocaleDateString()} - {apt.doctorName} - {apt.status}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p className="text-muted">No appointments found</p>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default PatientsList;






// import React, { useState, useEffect, useMemo } from 'react';
// import { patientApi } from '../../api/patientApi';
// import { useToast } from '../../components/common/Toast';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import Modal from '../../components/common/Modal';

// const PAGE_SIZE = 25;

// const PatientsList = () =>
// {
//     const [patients, setPatients] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [editingPatient, setEditingPatient] = useState(null);
//     const [showHistory, setShowHistory] = useState(false);
//     const [patientHistory, setPatientHistory] = useState(null);
//     const { showToast, ToastComponent } = useToast();

//     // Search & Pagination
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);

//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         email: '',
//         password: '',
//         gender: '',
//         dateOfBirth: '',
//         city: '',
//         address: '',
//     });

//     useEffect(() =>
//     {
//         loadPatients();
//     }, []);

//     // ===== Filtered + Paginated =====
//     const filteredPatients = useMemo(() =>
//     {
//         const q = searchQuery.trim().toLowerCase();
//         if (!q) return patients;
//         return patients.filter((p) =>
//         {
//             const fullName = (p.fullName || `${p.firstName || ''} ${p.lastName || ''}`).toLowerCase();
//             const phone = (p.phone || '').toLowerCase();
//             const email = (p.email || '').toLowerCase();
//             const city = (p.city || '').toLowerCase();
//             return (
//                 fullName.includes(q) ||
//                 phone.includes(q) ||
//                 email.includes(q) ||
//                 city.includes(q)
//             );
//         });
//     }, [patients, searchQuery]);

//     const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));

//     const paginatedPatients = useMemo(() =>
//     {
//         const start = (currentPage - 1) * PAGE_SIZE;
//         return filteredPatients.slice(start, start + PAGE_SIZE);
//     }, [filteredPatients, currentPage]);

//     useEffect(() =>
//     {
//         setCurrentPage(1);
//     }, [searchQuery]);

//     const getPageNumbers = () =>
//     {
//         const pages = [];
//         const delta = 2;
//         const left = Math.max(2, currentPage - delta);
//         const right = Math.min(totalPages - 1, currentPage + delta);

//         pages.push(1);
//         if (left > 2) pages.push("...");
//         for (let i = left; i <= right; i++) pages.push(i);
//         if (right < totalPages - 1) pages.push("...");
//         if (totalPages > 1) pages.push(totalPages);

//         return pages;
//     };

//     const loadPatients = async () =>
//     {
//         try
//         {
//             const response = await patientApi.getAllPatients();
//             setPatients(response.data);
//         } catch (error)
//         {
//             showToast('Error loading patients', 'error');
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();
//         try
//         {
//             if (editingPatient)
//             {
//                 const { password, ...updatePayload } = formData;
//                 await patientApi.updatePatient(editingPatient.id, updatePayload);
//                 showToast('Patient updated successfully', 'success');
//             } else
//             {
//                 await patientApi.createPatient(formData);
//                 showToast('Patient created successfully', 'success');
//             }

//             setShowModal(false);
//             resetForm();
//             loadPatients();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || 'Operation failed', 'error');
//         }
//     };

//     const handleEdit = (patient) =>
//     {
//         setEditingPatient(patient);

//         const fullName = patient.fullName || '';
//         const parts = fullName.trim().split(' ');
//         const firstName = patient.firstName || parts[0] || '';
//         const lastName = patient.lastName || parts.slice(1).join(' ') || '';

//         setFormData({
//             firstName,
//             lastName,
//             phone: patient.phone || '',
//             email: patient.email || '',
//             password: '',
//             gender: patient.gender || '',
//             dateOfBirth: patient.dateOfBirth?.split('T')[0] || '',
//             city: patient.city || '',
//             address: patient.address || '',
//         });

//         setShowModal(true);
//     };

//     const handleDelete = async (id) =>
//     {
//         if (!window.confirm('Are you sure you want to delete this patient?')) return;

//         try
//         {
//             await patientApi.deletePatient(id);
//             showToast('Patient deleted successfully', 'success');
//             loadPatients();
//         } catch (error)
//         {
//             showToast('Error deleting patient', 'error');
//         }
//     };

//     const viewHistory = async (id) =>
//     {
//         try
//         {
//             const response = await patientApi.getPatientHistory(id);
//             setPatientHistory(response.data);
//             setShowHistory(true);
//         } catch (error)
//         {
//             showToast('Error loading patient history', 'error');
//         }
//     };

//     const resetForm = () =>
//     {
//         setFormData({
//             firstName: '',
//             lastName: '',
//             phone: '',
//             email: '',
//             password: '',
//             gender: '',
//             dateOfBirth: '',
//             city: '',
//             address: '',
//         });
//         setEditingPatient(null);
//     };

//     const handleChange = (e) =>
//     {
//         setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     const startItem = filteredPatients.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
//     const endItem = Math.min(currentPage * PAGE_SIZE, filteredPatients.length);

//     return (
//         <div>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Patients Management</h2>
//                 <button
//                     className="btn btn-primary"
//                     onClick={() => { resetForm(); setShowModal(true); }}
//                 >
//                     + Add Patient
//                 </button>
//             </div>

//             {/* Search Bar */}
//             <div className="card mb-md" style={{ padding: "12px 16px" }}>
//                 <div className="flex items-center gap-md">
//                     <div style={{ flex: 1, position: "relative" }}>
//                         <span style={{
//                             position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
//                             opacity: 0.45, pointerEvents: "none", fontSize: 15
//                         }}>
//                             🔍
//                         </span>
//                         <input
//                             type="text"
//                             className="form-input"
//                             style={{ paddingLeft: 34 }}
//                             placeholder="Search by name, phone, email or city..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                     </div>
//                     {searchQuery && (
//                         <button
//                             className="btn btn-secondary btn-sm"
//                             onClick={() => setSearchQuery("")}
//                         >
//                             Clear
//                         </button>
//                     )}
//                 </div>
//             </div>

//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Gender</th>
//                                 <th>Phone</th>
//                                 <th>Email</th>
//                                 <th>City</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {paginatedPatients.map((patient) => (
//                                 <tr key={patient.id}>
//                                     <td>{patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim()}</td>
//                                     <td>{patient.gender}</td>
//                                     <td>{patient.phone}</td>
//                                     <td>{patient.email}</td>
//                                     <td>{patient.city}</td>
//                                     <td>
//                                         <div className="flex gap-sm">
//                                             <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(patient)}>
//                                                 Edit
//                                             </button>
//                                             <button className="btn btn-primary btn-sm" onClick={() => viewHistory(patient.id)}>
//                                                 History
//                                             </button>
//                                             <button className="btn btn-danger btn-sm" onClick={() => handleDelete(patient.id)}>
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {paginatedPatients.length === 0 && (
//                                 <tr>
//                                     <td colSpan="6" style={{ textAlign: "center", opacity: 0.7 }}>
//                                         {searchQuery
//                                             ? `No patients found for "${searchQuery}".`
//                                             : "No patients found."}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 {filteredPatients.length > 0 && (
//                     <div className="flex justify-between items-center mt-md" style={{ padding: "8px 4px" }}>
//                         <span style={{ fontSize: 13, opacity: 0.65 }}>
//                             Showing {startItem}–{endItem} of {filteredPatients.length} patients
//                         </span>

//                         {totalPages > 1 && (
//                             <div className="flex gap-sm items-center">
//                                 <button
//                                     className="btn btn-secondary btn-sm"
//                                     disabled={currentPage === 1}
//                                     onClick={() => setCurrentPage((p) => p - 1)}
//                                 >
//                                     ← Prev
//                                 </button>

//                                 {getPageNumbers().map((page, idx) =>
//                                     page === "..." ? (
//                                         <span key={`ellipsis-${idx}`} style={{ padding: "0 4px", opacity: 0.5 }}>…</span>
//                                     ) : (
//                                         <button
//                                             key={page}
//                                             className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-secondary"}`}
//                                             onClick={() => setCurrentPage(page)}
//                                             style={{ minWidth: 34 }}
//                                         >
//                                             {page}
//                                         </button>
//                                     )
//                                 )}

//                                 <button
//                                     className="btn btn-secondary btn-sm"
//                                     disabled={currentPage === totalPages}
//                                     onClick={() => setCurrentPage((p) => p + 1)}
//                                 >
//                                     Next →
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Add / Edit Modal */}
//             <Modal
//                 isOpen={showModal}
//                 onClose={() => { setShowModal(false); resetForm(); }}
//                 title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">First Name</label>
//                             <input
//                                 type="text"
//                                 name="firstName"
//                                 className="form-input"
//                                 value={formData.firstName}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Last Name</label>
//                             <input
//                                 type="text"
//                                 name="lastName"
//                                 className="form-input"
//                                 value={formData.lastName}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
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

//                     {!editingPatient && (
//                         <div className="form-group">
//                             <label className="form-label">Password</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 className="form-input"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                                 minLength={6}
//                             />
//                         </div>
//                     )}

//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">Gender</label>
//                             <select
//                                 name="gender"
//                                 className="form-select"
//                                 value={formData.gender}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="">Select Gender</option>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                                 <option value="Other">Other</option>
//                             </select>
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Date of Birth</label>
//                             <input
//                                 type="date"
//                                 name="dateOfBirth"
//                                 className="form-input"
//                                 value={formData.dateOfBirth}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">Phone</label>
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 className="form-input"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">City</label>
//                             <input
//                                 type="text"
//                                 name="city"
//                                 className="form-input"
//                                 value={formData.city}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Address</label>
//                         <textarea
//                             name="address"
//                             className="form-textarea"
//                             value={formData.address}
//                             onChange={handleChange}
//                             rows="3"
//                         />
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button
//                             type="button"
//                             className="btn btn-secondary"
//                             onClick={() => { setShowModal(false); resetForm(); }}
//                         >
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             {editingPatient ? 'Update' : 'Create'}
//                         </button>
//                     </div>
//                 </form>
//             </Modal>

//             {/* History Modal */}
//             <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Patient History">
//                 {patientHistory && (
//                     <div>
//                         <h4>Appointments</h4>
//                         {patientHistory.appointments?.length > 0 ? (
//                             <ul>
//                                 {patientHistory.appointments.map((apt, idx) => (
//                                     <li key={idx}>
//                                         {new Date(apt.date).toLocaleDateString()} - {apt.doctorName} - {apt.status}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p className="text-muted">No appointments found</p>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default PatientsList;

















// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { patientApi } from '../../api/patientApi';
// import { useToast } from '../../components/common/Toast';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import Modal from '../../components/common/Modal';

// const PAGE_SIZE = 25;
// const API_BASE_URL = 'http://localhost:5151'; // backend base URL

// const PatientsList = () =>
// {
//     const [patients, setPatients] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [editingPatient, setEditingPatient] = useState(null);
//     const [showHistory, setShowHistory] = useState(false);
//     const [patientHistory, setPatientHistory] = useState(null);
//     const { showToast, ToastComponent } = useToast();

//     // Search & Pagination
//     const [searchQuery, setSearchQuery] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);

//     // Image state
//     const [imageFile, setImageFile] = useState(null);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [removeImage, setRemoveImage] = useState(false);
//     const fileInputRef = useRef(null);

//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         email: '',
//         password: '',
//         gender: '',
//         dateOfBirth: '',
//         city: '',
//         address: '',
//     });

//     useEffect(() =>
//     {
//         loadPatients();
//     }, []);

//     // ===== Filtered + Paginated =====
//     const filteredPatients = useMemo(() =>
//     {
//         const q = searchQuery.trim().toLowerCase();
//         if (!q) return patients;
//         return patients.filter((p) =>
//         {
//             const fullName = (p.fullName || `${p.firstName || ''} ${p.lastName || ''}`).toLowerCase();
//             const phone = (p.phone || '').toLowerCase();
//             const email = (p.email || '').toLowerCase();
//             const city = (p.city || '').toLowerCase();
//             return fullName.includes(q) || phone.includes(q) || email.includes(q) || city.includes(q);
//         });
//     }, [patients, searchQuery]);

//     const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));

//     const paginatedPatients = useMemo(() =>
//     {
//         const start = (currentPage - 1) * PAGE_SIZE;
//         return filteredPatients.slice(start, start + PAGE_SIZE);
//     }, [filteredPatients, currentPage]);

//     useEffect(() =>
//     {
//         setCurrentPage(1);
//     }, [searchQuery]);

//     const getPageNumbers = () =>
//     {
//         const pages = [];
//         const delta = 2;
//         const left = Math.max(2, currentPage - delta);
//         const right = Math.min(totalPages - 1, currentPage + delta);
//         pages.push(1);
//         if (left > 2) pages.push('...');
//         for (let i = left; i <= right; i++) pages.push(i);
//         if (right < totalPages - 1) pages.push('...');
//         if (totalPages > 1) pages.push(totalPages);
//         return pages;
//     };

//     const loadPatients = async () =>
//     {
//         try
//         {
//             const response = await patientApi.getAllPatients();
//             setPatients(response.data);
//         } catch (error)
//         {
//             showToast('Error loading patients', 'error');
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     // ===== Image helpers =====
//     const getImageUrl = (imagePath) =>
//     {
//         if (!imagePath) return null;
//         if (imagePath.startsWith('http')) return imagePath;
//         return `${API_BASE_URL}/${imagePath}`;
//     };

//     const handleImageChange = (e) =>
//     {
//         const file = e.target.files[0];
//         if (!file) return;

//         // Validate file type
//         if (!file.type.startsWith('image/'))
//         {
//             showToast('Please select a valid image file', 'error');
//             return;
//         }
//         // Validate file size (max 5MB)
//         if (file.size > 5 * 1024 * 1024)
//         {
//             showToast('Image size must be less than 5MB', 'error');
//             return;
//         }

//         setImageFile(file);
//         setRemoveImage(false);

//         const reader = new FileReader();
//         reader.onloadend = () => setImagePreview(reader.result);
//         reader.readAsDataURL(file);
//     };

//     const handleRemoveImage = () =>
//     {
//         setImageFile(null);
//         setImagePreview(null);
//         setRemoveImage(true);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     };

//     const resetImageState = () =>
//     {
//         setImageFile(null);
//         setImagePreview(null);
//         setRemoveImage(false);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//     };

//     // ===== Submit =====
//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();
//         try
//         {
//             // Use FormData for multipart/form-data (image support)
//             // const data = new FormData();
//             // data.append('firstName', formData.firstName);
//             // data.append('lastName', formData.lastName);
//             // data.append('phone', formData.phone);
//             // data.append('email', formData.email);
//             // data.append('gender', formData.gender);
//             // data.append('dateOfBirth', formData.dateOfBirth);
//             // data.append('city', formData.city);
//             // data.append('address', formData.address || '');

//             // if (imageFile)
//             // {
//             //     data.append('image', imageFile);
//             // }

//             const data = new FormData();
//             data.append("FirstName", formData.firstName);
//             data.append("LastName", formData.lastName);
//             data.append("Phone", formData.phone);
//             data.append("Email", formData.email);      // əgər Update command Email qəbul edirsə
//             data.append("Gender", formData.gender);
//             data.append("DateOfBirth", formData.dateOfBirth); // "YYYY-MM-DD" adətən ok
//             data.append("City", formData.city);
//             data.append("Address", formData.address ?? "");

//             if (imageFile) data.append("Image", imageFile);

//             data.append("RemoveImage", String(removeImage));

//             if (editingPatient)
//             {
//                 //data.append('removeImage', removeImage.toString());
//                 await patientApi.updatePatient(editingPatient.id, data);
//                 showToast('Patient updated successfully', 'success');
//             } else
//             {
//                 data.append('Password', formData.password);
//                 await patientApi.createPatient(data);
//                 showToast('Patient created successfully', 'success');
//             }

//             setShowModal(false);
//             resetForm();
//             loadPatients();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || error.response?.data?.error || 'Operation failed', 'error');
//         }
//     };

//     const handleEdit = (patient) =>
//     {
//         setEditingPatient(patient);
//         const fullName = patient.fullName || '';
//         const parts = fullName.trim().split(' ');
//         const firstName = patient.firstName || parts[0] || '';
//         const lastName = patient.lastName || parts.slice(1).join(' ') || '';

//         setFormData({
//             firstName,
//             lastName,
//             phone: patient.phone || '',
//             email: patient.email || '',
//             password: '',
//             gender: patient.gender || '',
//             dateOfBirth: patient.dateOfBirth?.split('T')[0] || '',
//             city: patient.city || '',
//             address: patient.address || '',
//         });

//         // Set existing image preview
//         resetImageState();
//         if (patient.imagePath)
//         {
//             setImagePreview(getImageUrl(patient.imagePath));
//         }

//         setShowModal(true);
//     };

//     const handleDelete = async (id) =>
//     {
//         if (!window.confirm('Are you sure you want to delete this patient?')) return;
//         try
//         {
//             await patientApi.deletePatient(id);
//             showToast('Patient deleted successfully', 'success');
//             loadPatients();
//         } catch (error)
//         {
//             showToast('Error deleting patient', 'error');
//         }
//     };

//     const viewHistory = async (id) =>
//     {
//         try
//         {
//             const response = await patientApi.getPatientHistory(id);
//             setPatientHistory(response.data);
//             setShowHistory(true);
//         } catch (error)
//         {
//             showToast('Error loading patient history', 'error');
//         }
//     };

//     const resetForm = () =>
//     {
//         setFormData({
//             firstName: '',
//             lastName: '',
//             phone: '',
//             email: '',
//             password: '',
//             gender: '',
//             dateOfBirth: '',
//             city: '',
//             address: '',
//         });
//         setEditingPatient(null);
//         resetImageState();
//     };

//     const handleChange = (e) =>
//     {
//         setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     const startItem = filteredPatients.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
//     const endItem = Math.min(currentPage * PAGE_SIZE, filteredPatients.length);

//     // ===== Avatar Component =====
//     const PatientAvatar = ({ patient, size = 36 }) =>
//     {
//         const imgUrl = getImageUrl(patient.imagePath);
//         const initials = (patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`)
//             .trim()
//             .split(' ')
//             .map((n) => n[0])
//             .slice(0, 2)
//             .join('')
//             .toUpperCase();

//         if (imgUrl)
//         {
//             return (
//                 <img
//                     src={imgUrl}
//                     alt={patient.fullName || ''}
//                     style={{
//                         width: size,
//                         height: size,
//                         borderRadius: '50%',
//                         objectFit: 'cover',
//                         border: '2px solid #e2e8f0',
//                         flexShrink: 0,
//                     }}
//                     onError={(e) =>
//                     {
//                         e.target.style.display = 'none';
//                         e.target.nextSibling.style.display = 'flex';
//                     }}
//                 />
//             );
//         }

//         return (
//             <div
//                 style={{
//                     width: size,
//                     height: size,
//                     borderRadius: '50%',
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     color: '#fff',
//                     fontSize: size * 0.36,
//                     fontWeight: 600,
//                     flexShrink: 0,
//                 }}
//             >
//                 {initials || '?'}
//             </div>
//         );
//     };

//     return (
//         <div>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Patients Management</h2>
//                 <button
//                     className="btn btn-primary"
//                     onClick={() => { resetForm(); setShowModal(true); }}
//                 >
//                     + Add Patient
//                 </button>
//             </div>

//             {/* Search Bar */}
//             <div className="card mb-md" style={{ padding: '12px 16px' }}>
//                 <div className="flex items-center gap-md">
//                     <div style={{ flex: 1, position: 'relative' }}>
//                         <span style={{
//                             position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
//                             opacity: 0.45, pointerEvents: 'none', fontSize: 15,
//                         }}>
//                             🔍
//                         </span>
//                         <input
//                             type="text"
//                             className="form-input"
//                             style={{ paddingLeft: 34 }}
//                             placeholder="Search by name, phone, email or city..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                     </div>
//                     {searchQuery && (
//                         <button className="btn btn-secondary btn-sm" onClick={() => setSearchQuery('')}>
//                             Clear
//                         </button>
//                     )}
//                 </div>
//             </div>

//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Patient</th>
//                                 <th>Gender</th>
//                                 <th>Phone</th>
//                                 <th>Email</th>
//                                 <th>City</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {paginatedPatients.map((patient) => (
//                                 <tr key={patient.id}>
//                                     {/* Patient column with avatar */}
//                                     <td>
//                                         <div className="flex items-center gap-sm" style={{ gap: 10 }}>
//                                             <PatientAvatar patient={patient} size={36} />
//                                             <span style={{ fontWeight: 500 }}>
//                                                 {patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim()}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td>{patient.gender}</td>
//                                     <td>{patient.phone}</td>
//                                     <td>{patient.email}</td>
//                                     <td>{patient.city}</td>
//                                     <td>
//                                         <div className="flex gap-sm">
//                                             <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(patient)}>
//                                                 Edit
//                                             </button>
//                                             <button className="btn btn-primary btn-sm" onClick={() => viewHistory(patient.id)}>
//                                                 History
//                                             </button>
//                                             <button className="btn btn-danger btn-sm" onClick={() => handleDelete(patient.id)}>
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {paginatedPatients.length === 0 && (
//                                 <tr>
//                                     <td colSpan="6" style={{ textAlign: 'center', opacity: 0.7 }}>
//                                         {searchQuery ? `No patients found for "${searchQuery}".` : 'No patients found.'}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 {filteredPatients.length > 0 && (
//                     <div className="flex justify-between items-center mt-md" style={{ padding: '8px 4px' }}>
//                         <span style={{ fontSize: 13, opacity: 0.65 }}>
//                             Showing {startItem}–{endItem} of {filteredPatients.length} patients
//                         </span>

//                         {totalPages > 1 && (
//                             <div className="flex gap-sm items-center">
//                                 <button
//                                     className="btn btn-secondary btn-sm"
//                                     disabled={currentPage === 1}
//                                     onClick={() => setCurrentPage((p) => p - 1)}
//                                 >
//                                     ← Prev
//                                 </button>

//                                 {getPageNumbers().map((page, idx) =>
//                                     page === '...' ? (
//                                         <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', opacity: 0.5 }}>…</span>
//                                     ) : (
//                                         <button
//                                             key={page}
//                                             className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
//                                             onClick={() => setCurrentPage(page)}
//                                             style={{ minWidth: 34 }}
//                                         >
//                                             {page}
//                                         </button>
//                                     )
//                                 )}

//                                 <button
//                                     className="btn btn-secondary btn-sm"
//                                     disabled={currentPage === totalPages}
//                                     onClick={() => setCurrentPage((p) => p + 1)}
//                                 >
//                                     Next →
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Add / Edit Modal */}
//             <Modal
//                 isOpen={showModal}
//                 onClose={() => { setShowModal(false); resetForm(); }}
//                 title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
//             >
//                 <form onSubmit={handleSubmit} encType="multipart/form-data">

//                     {/* ===== Image Upload ===== */}
//                     <div className="form-group" style={{ marginBottom: 20 }}>
//                         <label className="form-label">Profile Photo</label>
//                         <div className="flex items-center gap-md" style={{ gap: 14 }}>

//                             {/* Preview */}
//                             <div style={{
//                                 width: 72, height: 72, borderRadius: '50%',
//                                 border: '2px dashed #cbd5e0', overflow: 'hidden',
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                 background: '#f7fafc', flexShrink: 0,
//                             }}>
//                                 {imagePreview && !removeImage ? (
//                                     <img
//                                         src={imagePreview}
//                                         alt="preview"
//                                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                                     />
//                                 ) : (
//                                     <span style={{ fontSize: 26, opacity: 0.3 }}>👤</span>
//                                 )}
//                             </div>

//                             {/* Buttons */}
//                             <div className="flex flex-col gap-sm" style={{ gap: 6 }}>
//                                 <button
//                                     type="button"
//                                     className="btn btn-secondary btn-sm"
//                                     onClick={() => fileInputRef.current?.click()}
//                                 >
//                                     {imagePreview && !removeImage ? '🔄 Change Photo' : '📷 Upload Photo'}
//                                 </button>

//                                 {imagePreview && !removeImage && (
//                                     <button
//                                         type="button"
//                                         className="btn btn-danger btn-sm"
//                                         onClick={handleRemoveImage}
//                                     >
//                                         🗑 Remove Photo
//                                     </button>
//                                 )}

//                                 <span style={{ fontSize: 11, opacity: 0.55 }}>JPG, PNG – max 5MB</span>
//                             </div>
//                         </div>

//                         {/* Hidden file input */}
//                         <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept="image/*"
//                             style={{ display: 'none' }}
//                             onChange={handleImageChange}
//                         />
//                     </div>

//                     {/* ===== Name fields ===== */}
//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">First Name</label>
//                             <input
//                                 type="text"
//                                 name="firstName"
//                                 className="form-input"
//                                 value={formData.firstName}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label className="form-label">Last Name</label>
//                             <input
//                                 type="text"
//                                 name="lastName"
//                                 className="form-input"
//                                 value={formData.lastName}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
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

//                     {!editingPatient && (
//                         <div className="form-group">
//                             <label className="form-label">Password</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 className="form-input"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                                 minLength={6}
//                             />
//                         </div>
//                     )}

//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">Gender</label>
//                             <select
//                                 name="gender"
//                                 className="form-select"
//                                 value={formData.gender}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="">Select Gender</option>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                                 <option value="Other">Other</option>
//                             </select>
//                         </div>
//                         <div className="form-group">
//                             <label className="form-label">Date of Birth</label>
//                             <input
//                                 type="date"
//                                 name="dateOfBirth"
//                                 className="form-input"
//                                 value={formData.dateOfBirth}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-2">
//                         <div className="form-group">
//                             <label className="form-label">Phone</label>
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 className="form-input"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label className="form-label">City</label>
//                             <input
//                                 type="text"
//                                 name="city"
//                                 className="form-input"
//                                 value={formData.city}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Address</label>
//                         <textarea
//                             name="address"
//                             className="form-textarea"
//                             value={formData.address}
//                             onChange={handleChange}
//                             rows="3"
//                         />
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button
//                             type="button"
//                             className="btn btn-secondary"
//                             onClick={() => { setShowModal(false); resetForm(); }}
//                         >
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             {editingPatient ? 'Update' : 'Create'}
//                         </button>
//                     </div>
//                 </form>
//             </Modal>

//             {/* History Modal */}
//             <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Patient History">
//                 {patientHistory && (
//                     <div>
//                         <h4>Appointments</h4>
//                         {patientHistory.appointments?.length > 0 ? (
//                             <ul>
//                                 {patientHistory.appointments.map((apt, idx) => (
//                                     <li key={idx}>
//                                         {new Date(apt.appointmentDateTime).toLocaleDateString()} - {apt.doctorName} - {apt.status}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p className="text-muted">No appointments found</p>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default PatientsList;


import React, { useState, useEffect, useMemo, useRef } from "react";
import { patientApi } from "../../api/patientApi";
import { doctorApi } from "../../api/doctorApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";

const PAGE_SIZE = 25;
const API_BASE_URL = "http://localhost:5151";

const PatientsList = () =>
{
    const { hasRole } = useAuth();
    const isDoctor = hasRole?.("Doctor");
    const isAdmin = hasRole?.("Admin"); // əgər səndə Admin rolu var

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const [showHistory, setShowHistory] = useState(false);
    const [patientHistory, setPatientHistory] = useState(null);

    const { showToast, ToastComponent } = useToast();

    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Image state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
        dateOfBirth: "",
        city: "",
        address: "",
    });

    useEffect(() =>
    {
        loadPatients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ✅ Role-based load
    const loadPatients = async () =>
    {
        try
        {
            setLoading(true);

            const res = isDoctor
                ? await doctorApi.myPatients()
                : await patientApi.getAllPatients();

            setPatients(res.data || []);
        } catch (error)
        {
            showToast("Error loading patients", "error");
        } finally
        {
            setLoading(false);
        }
    };

    // ===== Filtered + Paginated =====
    const filteredPatients = useMemo(() =>
    {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return patients;

        return patients.filter((p) =>
        {
            const fullName = (p.fullName || `${p.firstName || ""} ${p.lastName || ""}`).toLowerCase();
            const phone = (p.phone || "").toLowerCase();
            const email = (p.email || "").toLowerCase();
            const city = (p.city || "").toLowerCase();
            return fullName.includes(q) || phone.includes(q) || email.includes(q) || city.includes(q);
        });
    }, [patients, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));

    const paginatedPatients = useMemo(() =>
    {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredPatients.slice(start, start + PAGE_SIZE);
    }, [filteredPatients, currentPage]);

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

    // ===== Image helpers =====
    const getImageUrl = (imagePath) =>
    {
        if (!imagePath) return null;
        if (imagePath.startsWith("http")) return imagePath;
        return `${API_BASE_URL}/${imagePath}`;
    };

    const handleImageChange = (e) =>
    {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/"))
        {
            showToast("Please select a valid image file", "error");
            return;
        }
        if (file.size > 5 * 1024 * 1024)
        {
            showToast("Image size must be less than 5MB", "error");
            return;
        }

        setImageFile(file);
        setRemoveImage(false);

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () =>
    {
        setImageFile(null);
        setImagePreview(null);
        setRemoveImage(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const resetImageState = () =>
    {
        setImageFile(null);
        setImagePreview(null);
        setRemoveImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ===== Form =====
    const handleChange = (e) =>
    {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const resetForm = () =>
    {
        setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            password: "",
            gender: "",
            dateOfBirth: "",
            city: "",
            address: "",
        });
        setEditingPatient(null);
        resetImageState();
    };

    const handleEdit = (patient) =>
    {
        // Doctor edit etməsin
        if (isDoctor) return;

        setEditingPatient(patient);

        const fullName = patient.fullName || "";
        const parts = fullName.trim().split(" ");
        const firstName = patient.firstName || parts[0] || "";
        const lastName = patient.lastName || parts.slice(1).join(" ") || "";

        setFormData({
            firstName,
            lastName,
            phone: patient.phone || "",
            email: patient.email || "",
            password: "",
            gender: patient.gender || "",
            dateOfBirth: patient.dateOfBirth?.split("T")?.[0] || "",
            city: patient.city || "",
            address: patient.address || "",
        });

        resetImageState();
        if (patient.imagePath) setImagePreview(getImageUrl(patient.imagePath));

        setShowModal(true);
    };

    const handleDelete = async (id) =>
    {
        // Doctor delete etməsin
        if (isDoctor) return;

        if (!window.confirm("Are you sure you want to delete this patient?")) return;
        try
        {
            await patientApi.deletePatient(id);
            showToast("Patient deleted successfully", "success");
            loadPatients();
        } catch (error)
        {
            showToast("Error deleting patient", "error");
        }
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        // Doctor create/update etməsin
        if (isDoctor)
        {
            showToast("Doctors cannot edit patients.", "error");
            return;
        }

        try
        {
            const data = new FormData();
            data.append("FirstName", formData.firstName);
            data.append("LastName", formData.lastName);
            data.append("Phone", formData.phone);
            data.append("Email", formData.email);
            data.append("Gender", formData.gender);
            data.append("DateOfBirth", formData.dateOfBirth);
            data.append("City", formData.city);
            data.append("Address", formData.address ?? "");

            if (imageFile) data.append("Image", imageFile);
            data.append("RemoveImage", String(removeImage));

            if (editingPatient)
            {
                await patientApi.updatePatient(editingPatient.id, data);
                showToast("Patient updated successfully", "success");
            } else
            {
                data.append("Password", formData.password);
                await patientApi.createPatient(data);
                showToast("Patient created successfully", "success");
            }

            setShowModal(false);
            resetForm();
            loadPatients();
        } catch (error)
        {
            showToast(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Operation failed",
                "error"
            );
        }
    };

    const viewHistory = async (id) =>
    {
        try
        {
            // Variant 1: hamı eyni endpoint (backend allow Admin,Doctor + server-side check)
            const res = await patientApi.getPatientHistory(id);

            // Variant 2: doctor üçün ayrıca endpoint açsan:
            // const res = isDoctor
            //   ? await doctorsApi.myPatientHistory(id)
            //   : await patientApi.getPatientHistory(id);

            setPatientHistory(res.data);
            setShowHistory(true);
        } catch (error)
        {
            const status = error?.response?.status;
            if (status === 403)
            {
                showToast("You don't have permission to view this history (403).", "error");
            } else
            {
                showToast("Error loading patient history", "error");
            }
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    const startItem = filteredPatients.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(currentPage * PAGE_SIZE, filteredPatients.length);

    // ===== Avatar =====
    const PatientAvatar = ({ patient, size = 36 }) =>
    {
        const imgUrl = getImageUrl(patient.imagePath);
        const initials = (patient.fullName || `${patient.firstName || ""} ${patient.lastName || ""}`)
            .trim()
            .split(" ")
            .map((n) => n?.[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase();

        if (imgUrl)
        {
            return (
                <img
                    src={imgUrl}
                    alt={patient.fullName || ""}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e2e8f0",
                        flexShrink: 0,
                    }}
                    onError={(e) =>
                    {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                    }}
                />
            );
        }

        return (
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: size * 0.36,
                    fontWeight: 600,
                    flexShrink: 0,
                }}
            >
                {initials || "?"}
            </div>
        );
    };

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>
                    {isDoctor ? "My Patients" : "Patients Management"}
                </h2>

                {/* ✅ Doctor üçün Add gizlət */}
                {!isDoctor && (
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                        {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        + Add Patient
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="card mb-md" style={{ padding: "12px 16px" }}>
                <div className="flex items-center gap-md">
                    <div style={{ flex: 1, position: "relative" }}>
                        <span
                            style={{
                                position: "absolute",
                                left: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                opacity: 0.45,
                                pointerEvents: "none",
                                fontSize: 15,
                            }}
                        >
                            🔍
                        </span>
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: 34 }}
                            placeholder="Search by name, phone, email or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {searchQuery && (
                        <button className="btn btn-secondary btn-sm" onClick={() => setSearchQuery("")}>
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
                                <th>Patient</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>City</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedPatients.map((patient) => (
                                <tr key={patient.id}>
                                    <td>
                                        <div className="flex items-center gap-sm" style={{ gap: 10 }}>
                                            <PatientAvatar patient={patient} size={36} />
                                            <span style={{ fontWeight: 500 }}>
                                                {patient.fullName ||
                                                    `${patient.firstName || ""} ${patient.lastName || ""}`.trim()}
                                            </span>
                                        </div>
                                    </td>

                                    <td>{patient.gender}</td>
                                    <td>{patient.phone}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.city}</td>

                                    <td>
                                        <div className="flex gap-sm">
                                            {/* ✅ Doctor üçün Edit/Delete gizlət */}
                                            {!isDoctor && (
                                                <>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(patient)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(patient.id)}>
                                                        Delete
                                                    </button>
                                                </>
                                            )}

                                            {/* History hamıda ola bilər (backend icazəsindən asılı) */}
                                            <button className="btn btn-primary btn-sm" onClick={() => viewHistory(patient.id)}>
                                                History
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedPatients.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", opacity: 0.7 }}>
                                        {searchQuery ? `No patients found for "${searchQuery}".` : "No patients found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredPatients.length > 0 && (
                    <div className="flex justify-between items-center mt-md" style={{ padding: "8px 4px" }}>
                        <span style={{ fontSize: 13, opacity: 0.65 }}>
                            Showing {startItem}–{endItem} of {filteredPatients.length} patients
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
                                        <span key={`ellipsis-${idx}`} style={{ padding: "0 4px", opacity: 0.5 }}>
                                            …
                                        </span>
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

            {/* ✅ Add/Edit Modal — doctor görməsin */}
            {!isDoctor && (
                <Modal
                    isOpen={showModal}
                    onClose={() =>
                    {
                        setShowModal(false);
                        resetForm();
                    }}
                    title={editingPatient ? "Edit Patient" : "Add New Patient"}
                >
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Image Upload */}
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="form-label">Profile Photo</label>

                            <div className="flex items-center gap-md" style={{ gap: 14 }}>
                                <div
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: "50%",
                                        border: "2px dashed #cbd5e0",
                                        overflow: "hidden",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#f7fafc",
                                        flexShrink: 0,
                                    }}
                                >
                                    {imagePreview && !removeImage ? (
                                        <img
                                            src={imagePreview}
                                            alt="preview"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: 26, opacity: 0.3 }}>👤</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-sm" style={{ gap: 6 }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview && !removeImage ? "🔄 Change Photo" : "📷 Upload Photo"}
                                    </button>

                                    {imagePreview && !removeImage && (
                                        <button type="button" className="btn btn-danger btn-sm" onClick={handleRemoveImage}>
                                            🗑 Remove Photo
                                        </button>
                                    )}

                                    <span style={{ fontSize: 11, opacity: 0.55 }}>JPG, PNG – max 5MB</span>
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Name fields */}
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
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
                                    type="text"
                                    name="lastName"
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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

                        {!editingPatient && (
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                        )}

                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <select
                                    name="gender"
                                    className="form-select"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    className="form-input"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-input"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <textarea
                                name="address"
                                className="form-textarea"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                        <div className="flex gap-md justify-between mt-lg">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                {
                                    setShowModal(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>

                            <button type="submit" className="btn btn-primary">
                                {editingPatient ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* History Modal */}
            <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Patient History">
                {patientHistory && (
                    <div>
                        <h4>Appointments</h4>
                        {patientHistory.appointments?.length > 0 ? (
                            <ul>
                                {patientHistory.appointments.map((apt, idx) => (
                                    <li key={idx}>
                                        {new Date(apt.appointmentDateTime).toLocaleDateString()} - {apt.doctorName} - {apt.status}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">No appointments found</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PatientsList;