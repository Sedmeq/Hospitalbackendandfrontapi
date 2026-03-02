// import React, { useState, useEffect } from "react";
// import { appointmentApi } from "../../api/appointmentApi";
// import { doctorApi } from "../../api/doctorApi";
// import { patientApi } from "../../api/patientApi";
// import { useToast } from "../../components/common/Toast";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import Modal from "../../components/common/Modal";
// import { useAuth } from "../../context/AuthContext";

// const AppointmentsList = () =>
// {
//     const { hasRole } = useAuth();

//     const [appointments, setAppointments] = useState([]);
//     const [doctors, setDoctors] = useState([]);
//     const [patients, setPatients] = useState([]);

//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);

//     // View modal
//     const [showViewModal, setShowViewModal] = useState(false);
//     const [viewLoading, setViewLoading] = useState(false);
//     const [selectedAppointment, setSelectedAppointment] = useState(null);

//     const { showToast, ToastComponent } = useToast();

//     const [formData, setFormData] = useState({
//         doctorId: "",
//         patientId: "",
//         date: "", // datetime-local
//     });

//     useEffect(() =>
//     {
//         loadAppointments();
//         loadDoctors();
//         loadPatients();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const formatDateTime = (dateStr, timeStr) =>
//     {
//         if (!dateStr) return "-";
//         const d = new Date(dateStr);
//         const datePart = d.toLocaleDateString();
//         return timeStr ? `${datePart} ${timeStr}` : datePart;
//     };

//     const truncate = (text, max = 40) =>
//     {
//         if (!text) return "-";
//         return text.length > max ? text.slice(0, max) + "..." : text;
//     };

//     const loadAppointments = async () =>
//     {
//         try
//         {
//             setLoading(true);

//             let response;

//             if (hasRole("Admin"))
//             {
//                 response = await appointmentApi.getAllAppointments();
//             } else if (hasRole("Doctor"))
//             {
//                 response = await appointmentApi.getMyDoctorAppointments();
//             } else
//             {
//                 response = await appointmentApi.getMyAppointments();
//             }

//             setAppointments(response.data || []);
//         } catch (err)
//         {
//             console.error("loadAppointments error:", err?.response?.data);
//             showToast("Error loading appointments", "error");
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     const loadDoctors = async () =>
//     {
//         try
//         {
//             const response = await doctorApi.getAllDoctors();
//             setDoctors(response.data || []);
//         } catch (error)
//         {
//             console.error("Error loading doctors:", error);
//         }
//     };

//     const loadPatients = async () =>
//     {
//         try
//         {
//             const response = await patientApi.getAllPatients();
//             setPatients(response.data || []);
//         } catch (error)
//         {
//             console.error("Error loading patients:", error);
//         }
//     };

//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();
//         try
//         {
//             await appointmentApi.bookAppointment(formData);
//             showToast("Appointment booked successfully", "success");
//             setShowModal(false);
//             resetForm();
//             loadAppointments();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || "Booking failed", "error");
//         }
//     };

//     const handleCancel = async (id) =>
//     {
//         if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

//         try
//         {
//             await appointmentApi.cancelAppointment(id);
//             showToast("Appointment cancelled successfully", "success");
//             loadAppointments();
//         } catch (error)
//         {
//             showToast("Error cancelling appointment", "error");
//         }
//     };

//     const handleView = async (id) =>
//     {
//         setShowViewModal(true);
//         setViewLoading(true);
//         setSelectedAppointment(null);

//         try
//         {
//             // appointmentApi-də bu method olmalıdır:
//             // getAppointmentById: (id) => axiosInstance.get(`/Appointment/GetAppointmentById/${id}`)
//             const res = await appointmentApi.getAppointmentById(id);
//             setSelectedAppointment(res.data);
//         } catch (err)
//         {
//             console.error("getAppointmentById error:", err?.response?.data);
//             showToast("Error loading appointment details", "error");
//             setShowViewModal(false);
//         } finally
//         {
//             setViewLoading(false);
//         }
//     };

//     const resetForm = () =>
//     {
//         setFormData({
//             doctorId: "",
//             patientId: "",
//             date: "",
//         });
//     };

//     const handleChange = (e) =>
//     {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const getStatusBadge = (status) =>
//     {
//         const statusMap = {
//             Scheduled: "badge-primary",
//             Completed: "badge-success",
//             Cancelled: "badge-danger",
//             Pending: "badge-warning",
//         };
//         return statusMap[status] || "badge-secondary";
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     return (
//         <div>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Appointments Management</h2>
//                 <button
//                     className="btn btn-primary"
//                     onClick={() =>
//                     {
//                         resetForm();
//                         setShowModal(true);
//                     }}
//                 >
//                     + Book Appointment
//                 </button>
//             </div>

//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Time</th>
//                                 <th>Status</th>
//                                 <th>Patient</th>
//                                 <th>Phone</th>
//                                 <th>Message</th>
//                                 <th>View</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {appointments.map((appointment) => (
//                                 <tr key={appointment.id}>
//                                     <td style={{ whiteSpace: "nowrap" }}>
//                                         {formatDateTime(appointment.date, appointment.time)}
//                                     </td>

//                                     <td>
//                                         <span className={`badge ${getStatusBadge(appointment.status)}`}>
//                                             {appointment.status}
//                                         </span>
//                                     </td>

//                                     <td>{appointment.patientName || "-"}</td>
//                                     <td>{appointment.patientPhone || "-"}</td>

//                                     <td title={appointment.message || ""}>
//                                         {truncate(appointment.message, 40)}
//                                     </td>

//                                     <td>
//                                         <button
//                                             className="btn btn-secondary btn-sm"
//                                             onClick={() => handleView(appointment.id)}
//                                         >
//                                             View
//                                         </button>
//                                     </td>

//                                     <td>
//                                         {appointment.status !== "Cancelled" && (
//                                             <button
//                                                 className="btn btn-danger btn-sm"
//                                                 onClick={() => handleCancel(appointment.id)}
//                                             >
//                                                 Cancel
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}

//                             {appointments.length === 0 && (
//                                 <tr>
//                                     <td colSpan={7} style={{ textAlign: "center", opacity: 0.7 }}>
//                                         No appointments found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Book Appointment Modal */}
//             <Modal
//                 isOpen={showModal}
//                 onClose={() =>
//                 {
//                     setShowModal(false);
//                     resetForm();
//                 }}
//                 title="Book New Appointment"
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">Doctor</label>
//                         <select
//                             name="doctorId"
//                             className="form-select"
//                             value={formData.doctorId}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Doctor</option>
//                             {doctors.map((doctor) => (
//                                 <option key={doctor.id} value={doctor.id}>
//                                     {(doctor.fullName || `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim())}{" "}
//                                     - {doctor.specialty || ""}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Patient</label>
//                         <select
//                             name="patientId"
//                             className="form-select"
//                             value={formData.patientId}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Patient</option>
//                             {patients.map((patient) => (
//                                 <option key={patient.id} value={patient.id}>
//                                     {patient.fullName || `${patient.firstName || ""} ${patient.lastName || ""}`.trim()}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Date & Time</label>
//                         <input
//                             type="datetime-local"
//                             name="date"
//                             className="form-input"
//                             value={formData.date}
//                             onChange={handleChange}
//                             required
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
//                             Book Appointment
//                         </button>
//                     </div>
//                 </form>
//             </Modal>

//             {/* View Appointment Modal */}
//             <Modal
//                 isOpen={showViewModal}
//                 onClose={() =>
//                 {
//                     setShowViewModal(false);
//                     setSelectedAppointment(null);
//                 }}
//                 title="Appointment Details"
//             >
//                 {viewLoading ? (
//                     <LoadingSpinner />
//                 ) : selectedAppointment ? (
//                     <div style={{ display: "grid", gap: 8 }}>
//                         <div>
//                             <b>Date:</b> {formatDateTime(selectedAppointment.date, selectedAppointment.time)}
//                         </div>
//                         <div>
//                             <b>Status:</b> {selectedAppointment.status || "-"}
//                         </div>
//                         <div>
//                             <b>Doctor:</b> {selectedAppointment.doctorName || "-"}
//                         </div>
//                         <div>
//                             <b>Patient:</b> {selectedAppointment.patientName || "-"}
//                         </div>
//                         <div>
//                             <b>Phone:</b> {selectedAppointment.patientPhone || "-"}
//                         </div>

//                         <div>
//                             <b>Message:</b>
//                             <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
//                                 {selectedAppointment.message || "-"}
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <p className="text-muted">No details found.</p>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default AppointmentsList;

















// import React, { useState, useEffect } from "react";
// import { appointmentApi } from "../../api/appointmentApi";
// import { doctorApi } from "../../api/doctorApi";
// import { patientApi } from "../../api/patientApi";
// import { useToast } from "../../components/common/Toast";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import Modal from "../../components/common/Modal";
// import { useAuth } from "../../context/AuthContext";

// const AppointmentsList = () =>
// {
//     const { hasRole } = useAuth();
//     const { showToast, ToastComponent } = useToast();

//     const [appointments, setAppointments] = useState([]);
//     const [doctors, setDoctors] = useState([]);
//     const [patients, setPatients] = useState([]);

//     const [loading, setLoading] = useState(true);

//     // Book Modal
//     const [showModal, setShowModal] = useState(false);
//     const [formData, setFormData] = useState({
//         doctorId: "",
//         patientId: "",
//         date: "", // datetime-local
//     });

//     // View Modal
//     const [showViewModal, setShowViewModal] = useState(false);
//     const [viewLoading, setViewLoading] = useState(false);
//     const [selectedAppointment, setSelectedAppointment] = useState(null);

//     useEffect(() =>
//     {
//         loadAppointments();
//         loadDoctors();
//         loadPatients();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const formatDateTime = (dateStr, timeStr) =>
//     {
//         if (!dateStr) return "-";
//         const d = new Date(dateStr);
//         const datePart = d.toLocaleDateString();
//         return timeStr ? `${datePart} ${timeStr}` : datePart;
//     };

//     const truncate = (text, max = 40) =>
//     {
//         if (!text) return "-";
//         return text.length > max ? text.slice(0, max) + "..." : text;
//     };

//     const getStatusBadge = (status) =>
//     {
//         const statusMap = {
//             Scheduled: "badge-primary",
//             Pending: "badge-warning",
//             Confirmed: "badge-success",
//             Completed: "badge-success",
//             Cancelled: "badge-danger",
//         };
//         return statusMap[status] || "badge-secondary";
//     };

//     const loadAppointments = async () =>
//     {
//         try
//         {
//             setLoading(true);

//             let response;

//             if (hasRole("Admin"))
//             {
//                 response = await appointmentApi.getAllAppointments();
//             } else if (hasRole("Doctor"))
//             {
//                 response = await appointmentApi.getMyDoctorAppointments();
//             } else
//             {
//                 response = await appointmentApi.getMyAppointments();
//             }

//             setAppointments(response.data || []);
//         } catch (err)
//         {
//             console.error("loadAppointments error:", err?.response?.status, err?.config?.url, err?.response?.data);
//             showToast("Error loading appointments", "error");
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     const loadDoctors = async () =>
//     {
//         try
//         {
//             const response = await doctorApi.getAllDoctors();
//             setDoctors(response.data || []);
//         } catch (error)
//         {
//             console.error("Error loading doctors:", error?.response?.data || error);
//         }
//     };

//     const loadPatients = async () =>
//     {
//         try
//         {
//             const response = await patientApi.getAllPatients();
//             setPatients(response.data || []);
//         } catch (error)
//         {
//             console.error("Error loading patients:", error?.response?.data || error);
//         }
//     };

//     const resetForm = () =>
//     {
//         setFormData({
//             doctorId: "",
//             patientId: "",
//             date: "",
//         });
//     };

//     const handleChange = (e) =>
//     {
//         setFormData((p) => ({
//             ...p,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     // ===== Book =====
//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();
//         try
//         {
//             await appointmentApi.bookAppointment(formData);
//             showToast("Appointment booked successfully", "success");
//             setShowModal(false);
//             resetForm();
//             loadAppointments();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || "Booking failed", "error");
//         }
//     };

//     // ===== Cancel =====
//     const handleCancel = async (id) =>
//     {
//         if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

//         try
//         {
//             await appointmentApi.cancelAppointment(id);
//             showToast("Appointment cancelled successfully", "success");
//             loadAppointments();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || "Error cancelling appointment", "error");
//         }
//     };

//     // ===== Confirm (Admin/Doctor) =====
//     const handleConfirm = async (id) =>
//     {
//         if (!window.confirm("Confirm this appointment?")) return;

//         try
//         {
//             await appointmentApi.confirmAppointment(id);
//             showToast("Appointment confirmed", "success");
//             loadAppointments();
//         } catch (err)
//         {
//             console.error("confirm error:", err?.response?.status, err?.response?.data);
//             showToast(err?.response?.data?.message || "Error confirming appointment", "error");
//         }
//     };

//     // ===== View =====
//     const handleView = async (id) =>
//     {
//         setShowViewModal(true);
//         setViewLoading(true);
//         setSelectedAppointment(null);

//         try
//         {
//             const res = await appointmentApi.getAppointmentById(id);
//             setSelectedAppointment(res.data);
//         } catch (err)
//         {
//             console.error("getAppointmentById error:", err?.response?.status, err?.config?.url, err?.response?.data);
//             showToast("Error loading appointment details", "error");
//             setShowViewModal(false);
//         } finally
//         {
//             setViewLoading(false);
//         }
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     return (
//         <div>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Appointments Management</h2>

//                 <button
//                     className="btn btn-primary"
//                     onClick={() =>
//                     {
//                         resetForm();
//                         setShowModal(true);
//                     }}
//                 >
//                     + Book Appointment
//                 </button>
//             </div>

//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Time</th>
//                                 <th>Status</th>
//                                 <th>Patient</th>
//                                 <th>Phone</th>
//                                 <th>Message</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {appointments.map((a) => (
//                                 <tr key={a.id}>
//                                     <td style={{ whiteSpace: "nowrap" }}>{formatDateTime(a.date, a.time)}</td>

//                                     <td>
//                                         <span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span>
//                                     </td>

//                                     <td>{a.patientName || "-"}</td>
//                                     <td>{a.patientPhone || "-"}</td>

//                                     <td title={a.message || ""}>{truncate(a.message, 40)}</td>

//                                     <td>
//                                         <div className="flex gap-sm">
//                                             <button className="btn btn-secondary btn-sm" onClick={() => handleView(a.id)}>
//                                                 View
//                                             </button>

//                                             {(hasRole("Admin") || hasRole("Doctor")) &&
//                                                 a.status !== "Cancelled" &&
//                                                 a.status !== "Confirmed" && (
//                                                     <button className="btn btn-success btn-sm" onClick={() => handleConfirm(a.id)}>
//                                                         Confirm
//                                                     </button>
//                                                 )}

//                                             {a.status !== "Cancelled" && (
//                                                 <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a.id)}>
//                                                     Cancel
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {appointments.length === 0 && (
//                                 <tr>
//                                     <td colSpan={6} style={{ textAlign: "center", opacity: 0.7 }}>
//                                         No appointments found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Book Appointment Modal */}
//             <Modal
//                 isOpen={showModal}
//                 onClose={() =>
//                 {
//                     setShowModal(false);
//                     resetForm();
//                 }}
//                 title="Book New Appointment"
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">Doctor</label>
//                         <select
//                             name="doctorId"
//                             className="form-select"
//                             value={formData.doctorId}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Doctor</option>
//                             {doctors.map((d) => (
//                                 <option key={d.id} value={d.id}>
//                                     {(d.fullName || `${d.firstName || ""} ${d.lastName || ""}`.trim())} - {d.specialty || ""}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Patient</label>
//                         <select
//                             name="patientId"
//                             className="form-select"
//                             value={formData.patientId}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Patient</option>
//                             {patients.map((p) => (
//                                 <option key={p.id} value={p.id}>
//                                     {p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim()}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Date & Time</label>
//                         <input
//                             type="datetime-local"
//                             name="date"
//                             className="form-input"
//                             value={formData.date}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             Book Appointment
//                         </button>
//                     </div>
//                 </form>
//             </Modal>

//             {/* View Appointment Modal */}
//             <Modal
//                 isOpen={showViewModal}
//                 onClose={() =>
//                 {
//                     setShowViewModal(false);
//                     setSelectedAppointment(null);
//                 }}
//                 title="Appointment Details"
//             >
//                 {viewLoading ? (
//                     <LoadingSpinner />
//                 ) : selectedAppointment ? (
//                     <div style={{ display: "grid", gap: 8 }}>
//                         <div>
//                             <b>Date:</b> {formatDateTime(selectedAppointment.date, selectedAppointment.time)}
//                         </div>
//                         <div>
//                             <b>Status:</b> {selectedAppointment.status || "-"}
//                         </div>
//                         <div>
//                             <b>Doctor:</b> {selectedAppointment.doctorName || "-"}
//                         </div>
//                         <div>
//                             <b>Patient:</b> {selectedAppointment.patientName || "-"}
//                         </div>
//                         <div>
//                             <b>Phone:</b> {selectedAppointment.patientPhone || "-"}
//                         </div>

//                         <div>
//                             <b>Message:</b>
//                             <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
//                                 {selectedAppointment.message || "-"}
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <p className="text-muted">No details found.</p>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default AppointmentsList;



















// import React, { useState, useEffect } from "react";
// import { appointmentApi } from "../../api/appointmentApi";
// import { doctorApi } from "../../api/doctorApi";
// import { patientApi } from "../../api/patientApi";
// import { prescriptionApi } from "../../api/prescriptionApi";
// import { useToast } from "../../components/common/Toast";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import Modal from "../../components/common/Modal";
// import { useAuth } from "../../context/AuthContext";

// const AppointmentsList = () =>
// {
//     const { hasRole } = useAuth();
//     const { showToast, ToastComponent } = useToast();

//     const [appointments, setAppointments] = useState([]);
//     const [doctors, setDoctors] = useState([]);
//     const [patients, setPatients] = useState([]);

//     const [loading, setLoading] = useState(true);

//     // Book Modal
//     const [showModal, setShowModal] = useState(false);
//     const [formData, setFormData] = useState({
//         doctorId: "",
//         patientId: "",
//         date: "", // datetime-local
//     });

//     // View Modal
//     const [showViewModal, setShowViewModal] = useState(false);
//     const [viewLoading, setViewLoading] = useState(false);
//     const [selectedAppointment, setSelectedAppointment] = useState(null);

//     // Prescription info for selected appointment
//     const [loadingPrescription, setLoadingPrescription] = useState(false);
//     const [prescriptionInfo, setPrescriptionInfo] = useState(null); // { prescriptionId, prescriptionDate, downloadUrl } OR null



//     // Write Prescription Modal (Doctor)
//     const [showRxModal, setShowRxModal] = useState(false);
//     const [rxSaving, setRxSaving] = useState(false);
//     const [rxMedicines, setRxMedicines] = useState([
//         { medicineName: "", instructions: "", quantity: 1 },
//     ]);

//     useEffect(() =>
//     {
//         loadAppointments();
//         loadDoctors();
//         loadPatients();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const formatDateTime = (dateStr, timeStr) =>
//     {
//         if (!dateStr) return "-";
//         const d = new Date(dateStr);
//         const datePart = d.toLocaleDateString();
//         return timeStr ? `${datePart} ${timeStr}` : datePart;
//     };

//     const truncate = (text, max = 40) =>
//     {
//         if (!text) return "-";
//         return text.length > max ? text.slice(0, max) + "..." : text;
//     };

//     const getStatusBadge = (status) =>
//     {
//         const statusMap = {
//             Scheduled: "badge-primary",
//             Pending: "badge-warning",
//             Confirmed: "badge-success",
//             Completed: "badge-success",
//             Cancelled: "badge-danger",
//         };
//         return statusMap[status] || "badge-secondary";
//     };

//     const loadAppointments = async () =>
//     {
//         try
//         {
//             setLoading(true);

//             let response;
//             if (hasRole("Admin"))
//             {
//                 response = await appointmentApi.getAllAppointments();
//             } else if (hasRole("Doctor"))
//             {
//                 response = await appointmentApi.getMyDoctorAppointments();
//             } else
//             {
//                 response = await appointmentApi.getMyAppointments();
//             }

//             setAppointments(response.data || []);
//         } catch (err)
//         {
//             console.error(
//                 "loadAppointments error:",
//                 err?.response?.status,
//                 err?.config?.url,
//                 err?.response?.data
//             );
//             showToast("Error loading appointments", "error");
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     const loadDoctors = async () =>
//     {
//         try
//         {
//             const response = await doctorApi.getAllDoctors();
//             setDoctors(response.data || []);
//         } catch (error)
//         {
//             console.error("Error loading doctors:", error?.response?.data || error);
//         }
//     };

//     const loadPatients = async () =>
//     {
//         try
//         {
//             const response = await patientApi.getAllPatients();
//             setPatients(response.data || []);
//         } catch (error)
//         {
//             console.error("Error loading patients:", error?.response?.data || error);
//         }
//     };

//     const resetForm = () =>
//     {
//         setFormData({
//             doctorId: "",
//             patientId: "",
//             date: "",
//         });
//     };

//     const handleChange = (e) =>
//     {
//         setFormData((p) => ({
//             ...p,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     // ===== Book =====
//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();
//         try
//         {
//             await appointmentApi.bookAppointment(formData);
//             showToast("Appointment booked successfully", "success");
//             setShowModal(false);
//             resetForm();
//             loadAppointments();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || "Booking failed", "error");
//         }
//     };

//     // ===== Cancel =====
//     const handleCancel = async (id) =>
//     {
//         if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

//         try
//         {
//             await appointmentApi.cancelAppointment(id);
//             showToast("Appointment cancelled successfully", "success");
//             loadAppointments();
//         } catch (error)
//         {
//             showToast(error.response?.data?.message || "Error cancelling appointment", "error");
//         }
//     };

//     // ===== Confirm (Admin/Doctor) =====
//     const handleConfirm = async (id) =>
//     {
//         if (!window.confirm("Confirm this appointment?")) return;

//         try
//         {
//             await appointmentApi.confirmAppointment(id);
//             showToast("Appointment confirmed", "success");
//             loadAppointments();
//         } catch (err)
//         {
//             console.error("confirm error:", err?.response?.status, err?.response?.data);
//             showToast(err?.response?.data?.message || "Error confirming appointment", "error");
//         }
//     };

//     // ===== View =====
//     const handleView = async (id) =>
//     {
//         setShowViewModal(true);
//         setViewLoading(true);
//         setSelectedAppointment(null);
//         setPrescriptionInfo(null);

//         try
//         {
//             const res = await appointmentApi.getAppointmentById(id);
//             const appt = res.data;
//             setSelectedAppointment(appt);

//             // load prescription info for this appointment (if backend endpoint exists)
//             setLoadingPrescription(true);
//             try
//             {
//                 const pr = await prescriptionApi.getByAppointment(appt.id);
//                 setPrescriptionInfo(pr.data); // null or object
//             } catch (e)
//             {
//                 // if endpoint not implemented, keep null
//                 console.warn("ByAppointment endpoint not available or error:", e?.response?.data || e);
//                 setPrescriptionInfo(null);
//             } finally
//             {
//                 setLoadingPrescription(false);
//             }
//         } catch (err)
//         {
//             console.error(
//                 "getAppointmentById error:",
//                 err?.response?.status,
//                 err?.config?.url,
//                 err?.response?.data
//             );
//             showToast("Error loading appointment details", "error");
//             setShowViewModal(false);
//         } finally
//         {
//             setViewLoading(false);
//         }
//     };

//     // ===== Prescription modal helpers =====
//     const addRxRow = () =>
//         setRxMedicines((p) => [...p, { medicineName: "", instructions: "", quantity: 1 }]);

//     const removeRxRow = (idx) =>
//         setRxMedicines((p) => p.filter((_, i) => i !== idx));

//     const updateRxRow = (idx, key, value) =>
//         setRxMedicines((p) =>
//             p.map((row, i) => (i === idx ? { ...row, [key]: value } : row))
//         );

//     const openWritePrescription = () =>
//     {
//         setRxMedicines([{ medicineName: "", instructions: "", quantity: 1 }]);
//         setShowRxModal(true);
//     };

//     const handleCreatePrescription = async () =>
//     {
//         if (!selectedAppointment) return;

//         const clean = rxMedicines
//             .map((m) => ({
//                 medicineName: (m.medicineName || "").trim(),
//                 instructions: (m.instructions || "").trim(),
//                 quantity: Number(m.quantity || 0),
//             }))
//             .filter((m) => m.medicineName && m.quantity > 0);

//         if (clean.length === 0)
//         {
//             showToast("Please add at least one medicine.", "error");
//             return;
//         }

//         try
//         {
//             setRxSaving(true);

//             const payload = {
//                 appointmentId: selectedAppointment.id,
//                 medicines: clean,
//             };

//             const res = await prescriptionApi.create(payload);

//             showToast("Prescription created and PDF generated.", "success");
//             setShowRxModal(false);

//             // refresh prescription info to show download button
//             try
//             {
//                 setLoadingPrescription(true);
//                 const pr = await prescriptionApi.getByAppointment(selectedAppointment.id);
//                 setPrescriptionInfo(pr.data);
//             } catch
//             {
//                 // fallback: if endpoint absent, use returned prescriptionId
//                 setPrescriptionInfo({
//                     prescriptionId: res?.data?.prescriptionId,
//                     downloadUrl: res?.data?.downloadUrl,
//                 });
//             } finally
//             {
//                 setLoadingPrescription(false);
//             }
//         } catch (e)
//         {
//             showToast(e?.response?.data?.message || "Failed to create prescription", "error");
//         } finally
//         {
//             setRxSaving(false);
//         }
//     };

//     const handleDownloadPrescription = async () =>
//     {
//         if (!prescriptionInfo?.prescriptionId) return;
//         try
//         {
//             await prescriptionApi.downloadPdf(prescriptionInfo.prescriptionId);
//         } catch (e)
//         {
//             console.error("download error:", e?.response?.status, e?.response?.data);
//             showToast(e?.response?.data?.message || "Failed to download PDF", "error");
//         }
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     return (
//         <div>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Appointments Management</h2>

//                 <button
//                     className="btn btn-primary"
//                     onClick={() =>
//                     {
//                         resetForm();
//                         setShowModal(true);
//                     }}
//                 >
//                     + Book Appointment
//                 </button>
//             </div>

//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Time</th>
//                                 <th>Status</th>
//                                 <th>Patient</th>
//                                 <th>Phone</th>
//                                 <th>Message</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {appointments.map((a) => (
//                                 <tr key={a.id}>
//                                     <td style={{ whiteSpace: "nowrap" }}>
//                                         {formatDateTime(a.date, a.time)}
//                                     </td>

//                                     <td>
//                                         <span className={`badge ${getStatusBadge(a.status)}`}>
//                                             {a.status}
//                                         </span>
//                                     </td>

//                                     <td>{a.patientName || "-"}</td>
//                                     <td>{a.patientPhone || "-"}</td>

//                                     <td title={a.message || ""}>{truncate(a.message, 40)}</td>

//                                     <td>
//                                         <div className="flex gap-sm">
//                                             <button
//                                                 className="btn btn-secondary btn-sm"
//                                                 onClick={() => handleView(a.id)}
//                                             >
//                                                 View
//                                             </button>

//                                             {(hasRole("Admin") || hasRole("Doctor")) &&
//                                                 a.status !== "Cancelled" &&
//                                                 a.status !== "Confirmed" && (
//                                                     <button
//                                                         className="btn btn-success btn-sm"
//                                                         onClick={() => handleConfirm(a.id)}
//                                                     >
//                                                         Confirm
//                                                     </button>
//                                                 )}

//                                             {a.status !== "Cancelled" && (
//                                                 <button
//                                                     className="btn btn-danger btn-sm"
//                                                     onClick={() => handleCancel(a.id)}
//                                                 >
//                                                     Cancel
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {appointments.length === 0 && (
//                                 <tr>
//                                     <td colSpan={6} style={{ textAlign: "center", opacity: 0.7 }}>
//                                         No appointments found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Book Appointment Modal */}
//             <Modal
//                 isOpen={showModal}
//                 onClose={() =>
//                 {
//                     setShowModal(false);
//                     resetForm();
//                 }}
//                 title="Book New Appointment"
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">Doctor</label>
//                         <select
//                             name="doctorId"
//                             className="form-select"
//                             value={formData.doctorId}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Doctor</option>
//                             {doctors.map((d) => (
//                                 <option key={d.id} value={d.id}>
//                                     {(d.fullName || `${d.firstName || ""} ${d.lastName || ""}`.trim())}{" "}
//                                     - {d.specialty || ""}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Patient</label>
//                         <select
//                             name="patientId"
//                             className="form-select"
//                             value={formData.patientId}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Patient</option>
//                             {patients.map((p) => (
//                                 <option key={p.id} value={p.id}>
//                                     {p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim()}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Date & Time</label>
//                         <input
//                             type="datetime-local"
//                             name="date"
//                             className="form-input"
//                             value={formData.date}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button
//                             type="button"
//                             className="btn btn-secondary"
//                             onClick={() => setShowModal(false)}
//                         >
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary">
//                             Book Appointment
//                         </button>
//                     </div>
//                 </form>
//             </Modal>

//             {/* View Appointment Modal */}
//             <Modal
//                 isOpen={showViewModal}
//                 onClose={() =>
//                 {
//                     setShowViewModal(false);
//                     setSelectedAppointment(null);
//                     setPrescriptionInfo(null);
//                 }}
//                 title="Appointment Details"
//             >
//                 {viewLoading ? (
//                     <LoadingSpinner />
//                 ) : selectedAppointment ? (
//                     <div style={{ display: "grid", gap: 8 }}>
//                         <div>
//                             <b>Date:</b> {formatDateTime(selectedAppointment.date, selectedAppointment.time)}
//                         </div>
//                         <div>
//                             <b>Status:</b> {selectedAppointment.status || "-"}
//                         </div>
//                         <div>
//                             <b>Doctor:</b> {selectedAppointment.doctorName || "-"}
//                         </div>
//                         <div>
//                             <b>Patient:</b> {selectedAppointment.patientName || "-"}
//                         </div>
//                         <div>
//                             <b>Phone:</b> {selectedAppointment.patientPhone || "-"}
//                         </div>

//                         <div>
//                             <b>Message:</b>
//                             <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
//                                 {selectedAppointment.message || "-"}
//                             </div>
//                         </div>

//                         {/* Doctor: write or download prescription */}
//                         {/* Prescription actions: Doctor & Patient */}
//                         {selectedAppointment.status === "Confirmed" &&
//                             (hasRole("Admin") || hasRole("Doctor") || hasRole("Patient")) && (
//                                 <div className="flex gap-sm mt-lg">
//                                     {loadingPrescription ? (
//                                         <span style={{ opacity: 0.7 }}>Loading prescription...</span>
//                                     ) : prescriptionInfo?.prescriptionId ? (
//                                         <button className="btn btn-success btn-sm" onClick={handleDownloadPrescription}>
//                                             Download Prescription (PDF)
//                                         </button>
//                                     ) : hasRole("Doctor") ? (
//                                         <button className="btn btn-primary btn-sm" onClick={openWritePrescription}>
//                                             Write Prescription
//                                         </button>
//                                     ) : (
//                                         <span style={{ opacity: 0.7 }}>Prescription not available yet.</span>
//                                     )}
//                                 </div>
//                             )}
//                     </div>
//                 ) : (
//                     <p className="text-muted">No details found.</p>
//                 )}
//             </Modal>

//             {/* Write Prescription Modal */}
//             <Modal
//                 isOpen={showRxModal}
//                 onClose={() => setShowRxModal(false)}
//                 title="Write Prescription"
//             >
//                 <div style={{ display: "grid", gap: 10 }}>
//                     {rxMedicines.map((m, idx) => (
//                         <div key={idx} className="card" style={{ padding: 12 }}>
//                             <div className="form-group">
//                                 <label className="form-label">Medicine Name</label>
//                                 <input
//                                     className="form-input"
//                                     value={m.medicineName}
//                                     onChange={(e) => updateRxRow(idx, "medicineName", e.target.value)}
//                                     placeholder="e.g. Paracetamol"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label className="form-label">Instructions</label>
//                                 <input
//                                     className="form-input"
//                                     value={m.instructions}
//                                     onChange={(e) => updateRxRow(idx, "instructions", e.target.value)}
//                                     placeholder="e.g. 1 tablet after meal, 2x daily"
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label className="form-label">Quantity</label>
//                                 <input
//                                     type="number"
//                                     min="1"
//                                     className="form-input"
//                                     value={m.quantity}
//                                     onChange={(e) => updateRxRow(idx, "quantity", e.target.value)}
//                                 />
//                             </div>

//                             <div className="flex gap-sm">
//                                 {rxMedicines.length > 1 && (
//                                     <button className="btn btn-danger btn-sm" onClick={() => removeRxRow(idx)}>
//                                         Remove
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     ))}

//                     <div className="flex gap-sm justify-between">
//                         <button className="btn btn-secondary" onClick={addRxRow}>
//                             + Add medicine
//                         </button>

//                         <button
//                             className="btn btn-primary"
//                             disabled={rxSaving}
//                             onClick={handleCreatePrescription}
//                         >
//                             {rxSaving ? "Saving..." : "Save & Generate PDF"}
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// export default AppointmentsList;




import React, { useState, useEffect, useMemo } from "react";
import { appointmentApi } from "../../api/appointmentApi";
import { doctorApi } from "../../api/doctorApi";
import { patientApi } from "../../api/patientApi";
import { prescriptionApi } from "../../api/prescriptionApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";

// new
import VideoCallRoom from "../../components/VideoCall/VideoCallRoom";

const PAGE_SIZE = 25;

// ✅ function hoist olunur (const problemi yoxdur)
function toDateTime(dateStr, timeStr)
{
    if (!dateStr) return null;

    // dateStr "2026-02-28" kimidirsə və timeStr "14:30" varsa birləşdir
    if (timeStr && typeof dateStr === "string" && !dateStr.includes("T"))
    {
        return new Date(`${dateStr}T${timeStr}`);
    }

    // dateStr ISO-dursa ("2026-02-28T14:30:00") bu yetərlidir
    return new Date(dateStr);
}

const AppointmentsList = () =>
{
    const { hasRole, user } = useAuth();
    const { showToast, ToastComponent } = useToast();

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);

    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [upcomingPage, setUpcomingPage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);

    // Book Modal
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        doctorId: "",
        patientId: "",
        date: "",
    });

    // View Modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // new
    const [activeCallApptId, setActiveCallApptId] = useState(null);

    // Prescription info for selected appointment
    const [loadingPrescription, setLoadingPrescription] = useState(false);
    const [prescriptionInfo, setPrescriptionInfo] = useState(null);

    // Write Prescription Modal (Doctor)
    const [showRxModal, setShowRxModal] = useState(false);
    const [rxSaving, setRxSaving] = useState(false);
    const [rxMedicines, setRxMedicines] = useState([
        { medicineName: "", instructions: "", quantity: 1 },
    ]);

    useEffect(() =>
    {
        if (!user) return;

        loadAppointments();
        loadDoctors();
        loadPatients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // hasRole dependency-ni çıxartmaq daha stabil olur

    // ===== Filtered =====
    const filteredAppointments = useMemo(() =>
    {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return appointments;
        return appointments.filter((a) =>
        {
            const patientName = (a.patientName || "").toLowerCase();
            const patientPhone = (a.patientPhone || "").toLowerCase();
            return patientName.includes(q) || patientPhone.includes(q);
        });
    }, [appointments, searchQuery]);

    // ✅ "bu gün" sərhədi (00:00) – günə görə history
    const todayStart = useMemo(() =>
    {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const upcomingAppointments = useMemo(() =>
    {
        return filteredAppointments
            .filter((a) =>
            {
                const dt = toDateTime(a.date, a.time);
                return dt ? dt >= todayStart : true;
            })
            .sort(
                (a, b) =>
                    (toDateTime(a.date, a.time) || 0) - (toDateTime(b.date, b.time) || 0)
            );
    }, [filteredAppointments, todayStart]);

    const historyAppointments = useMemo(() =>
    {
        return filteredAppointments
            .filter((a) =>
            {
                const dt = toDateTime(a.date, a.time);
                return dt ? dt < todayStart : false;
            })
            .sort(
                (a, b) =>
                    (toDateTime(b.date, b.time) || 0) - (toDateTime(a.date, a.time) || 0)
            ); // ən yenisi yuxarı
    }, [filteredAppointments, todayStart]);

    // ✅ reset pages on search
    useEffect(() =>
    {
        setUpcomingPage(1);
        setHistoryPage(1);
    }, [searchQuery]);

    // ===== Pagination helpers =====
    const getPageNumbers = (page, total) =>
    {
        const pages = [];
        const delta = 2;
        const left = Math.max(2, page - delta);
        const right = Math.min(total - 1, page + delta);

        pages.push(1);
        if (left > 2) pages.push("...");
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < total - 1) pages.push("...");
        if (total > 1) pages.push(total);

        return pages;
    };

    // ✅ Upcoming pagination
    const totalUpcomingPages = Math.max(
        1,
        Math.ceil(upcomingAppointments.length / PAGE_SIZE)
    );
    const paginatedUpcoming = useMemo(() =>
    {
        const start = (upcomingPage - 1) * PAGE_SIZE;
        return upcomingAppointments.slice(start, start + PAGE_SIZE);
    }, [upcomingAppointments, upcomingPage]);

    // ✅ History pagination
    const totalHistoryPages = Math.max(
        1,
        Math.ceil(historyAppointments.length / PAGE_SIZE)
    );
    const paginatedHistory = useMemo(() =>
    {
        const start = (historyPage - 1) * PAGE_SIZE;
        return historyAppointments.slice(start, start + PAGE_SIZE);
    }, [historyAppointments, historyPage]);

    // ✅ safety: if pages go out of range
    useEffect(() =>
    {
        if (upcomingPage > totalUpcomingPages) setUpcomingPage(totalUpcomingPages);
    }, [totalUpcomingPages, upcomingPage]);

    useEffect(() =>
    {
        if (historyPage > totalHistoryPages) setHistoryPage(totalHistoryPages);
    }, [totalHistoryPages, historyPage]);

    const startUpcomingItem =
        upcomingAppointments.length === 0 ? 0 : (upcomingPage - 1) * PAGE_SIZE + 1;
    const endUpcomingItem = Math.min(
        upcomingPage * PAGE_SIZE,
        upcomingAppointments.length
    );

    const startHistoryItem =
        historyAppointments.length === 0 ? 0 : (historyPage - 1) * PAGE_SIZE + 1;
    const endHistoryItem = Math.min(
        historyPage * PAGE_SIZE,
        historyAppointments.length
    );

    const formatDateTime = (dateStr, timeStr) =>
    {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        const datePart = d.toLocaleDateString();
        return timeStr ? `${datePart} ${timeStr}` : datePart;
    };

    const truncate = (text, max = 40) =>
    {
        if (!text) return "-";
        return text.length > max ? text.slice(0, max) + "..." : text;
    };

    const getStatusBadge = (status) =>
    {
        const statusMap = {
            Scheduled: "badge-primary",
            Pending: "badge-warning",
            Confirmed: "badge-success",
            Completed: "badge-success",
            Cancelled: "badge-danger",
        };
        return statusMap[status] || "badge-secondary";
    };

    const loadAppointments = async () =>
    {
        try
        {
            setLoading(true);

            let response;
            if (hasRole("Admin"))
            {
                response = await appointmentApi.getAllAppointments();
            } else if (hasRole("Doctor"))
            {
                response = await appointmentApi.getMyDoctorAppointments();
            } else
            {
                response = await appointmentApi.getMyAppointments();
            }

            setAppointments(response.data || []);
        } catch (err)
        {
            console.error(
                "loadAppointments error:",
                err?.response?.status,
                err?.config?.url,
                err?.response?.data
            );
            showToast("Error loading appointments", "error");
        } finally
        {
            setLoading(false);
        }
    };

    const loadDoctors = async () =>
    {
        try
        {
            const response = await doctorApi.getAllDoctors();
            setDoctors(response.data || []);
        } catch (error)
        {
            console.error("Error loading doctors:", error?.response?.data || error);
        }
    };

    const loadPatients = async () =>
    {
        try
        {
            const response = await patientApi.getAllPatients();
            setPatients(response.data || []);
        } catch (error)
        {
            console.error("Error loading patients:", error?.response?.data || error);
        }
    };

    const resetForm = () =>
    {
        setFormData({ doctorId: "", patientId: "", date: "" });
    };

    const handleChange = (e) =>
    {
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    // ===== Book =====
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        try
        {
            await appointmentApi.bookAppointment(formData);
            showToast("Appointment booked successfully", "success");
            setShowModal(false);
            resetForm();
            loadAppointments();
        } catch (error)
        {
            showToast(error.response?.data?.message || "Booking failed", "error");
        }
    };

    // ===== Cancel =====
    const handleCancel = async (id) =>
    {
        if (!window.confirm("Are you sure you want to cancel this appointment?"))
            return;
        try
        {
            await appointmentApi.cancelAppointment(id);
            showToast("Appointment cancelled successfully", "success");
            loadAppointments();
        } catch (error)
        {
            showToast(
                error.response?.data?.message || "Error cancelling appointment",
                "error"
            );
        }
    };

    // ===== Confirm =====
    const handleConfirm = async (id) =>
    {
        if (!window.confirm("Confirm this appointment?")) return;
        try
        {
            await appointmentApi.confirmAppointment(id);
            showToast("Appointment confirmed", "success");
            loadAppointments();
        } catch (err)
        {
            showToast(
                err?.response?.data?.message || "Error confirming appointment",
                "error"
            );
        }
    };

    // ===== View =====
    const handleView = async (id) =>
    {
        setShowViewModal(true);
        setViewLoading(true);
        setSelectedAppointment(null);
        setPrescriptionInfo(null);

        try
        {
            const res = await appointmentApi.getAppointmentById(id);
            const appt = res.data;
            setSelectedAppointment(appt);

            setLoadingPrescription(true);
            try
            {
                const pr = await prescriptionApi.getByAppointment(appt.id);
                setPrescriptionInfo(pr.data);
            } catch (e)
            {
                console.warn(
                    "ByAppointment endpoint not available:",
                    e?.response?.data || e
                );
                setPrescriptionInfo(null);
            } finally
            {
                setLoadingPrescription(false);
            }
        } catch (err)
        {
            showToast("Error loading appointment details", "error");
            setShowViewModal(false);
        } finally
        {
            setViewLoading(false);
        }
    };

    // ===== Prescription modal helpers =====
    const addRxRow = () =>
        setRxMedicines((p) => [
            ...p,
            { medicineName: "", instructions: "", quantity: 1 },
        ]);

    const removeRxRow = (idx) => setRxMedicines((p) => p.filter((_, i) => i !== idx));

    const updateRxRow = (idx, key, value) =>
        setRxMedicines((p) =>
            p.map((row, i) => (i === idx ? { ...row, [key]: value } : row))
        );

    const openWritePrescription = () =>
    {
        setRxMedicines([{ medicineName: "", instructions: "", quantity: 1 }]);
        setShowRxModal(true);
    };

    const handleCreatePrescription = async () =>
    {
        if (!selectedAppointment) return;

        const clean = rxMedicines
            .map((m) => ({
                medicineName: (m.medicineName || "").trim(),
                instructions: (m.instructions || "").trim(),
                quantity: Number(m.quantity || 0),
            }))
            .filter((m) => m.medicineName && m.quantity > 0);

        if (clean.length === 0)
        {
            showToast("Please add at least one medicine.", "error");
            return;
        }

        try
        {
            setRxSaving(true);
            const payload = { appointmentId: selectedAppointment.id, medicines: clean };
            const res = await prescriptionApi.create(payload);
            showToast("Prescription created and PDF generated.", "success");
            setShowRxModal(false);

            try
            {
                setLoadingPrescription(true);
                const pr = await prescriptionApi.getByAppointment(selectedAppointment.id);
                setPrescriptionInfo(pr.data);
            } catch
            {
                setPrescriptionInfo({
                    prescriptionId: res?.data?.prescriptionId,
                    downloadUrl: res?.data?.downloadUrl,
                });
            } finally
            {
                setLoadingPrescription(false);
            }
        } catch (e)
        {
            showToast(
                e?.response?.data?.message || "Failed to create prescription",
                "error"
            );
        } finally
        {
            setRxSaving(false);
        }
    };

    const handleDownloadPrescription = async () =>
    {
        if (!prescriptionInfo?.prescriptionId) return;
        try
        {
            await prescriptionApi.downloadPdf(prescriptionInfo.prescriptionId);
        } catch (e)
        {
            showToast(e?.response?.data?.message || "Failed to download PDF", "error");
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>Appointments Management</h2>
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
                            placeholder="Search by patient name or phone..."
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

            {/* ✅ Upcoming */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Patient</th>
                                <th>Phone</th>
                                <th>Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedUpcoming.map((a) => (
                                <tr key={a.id}>
                                    <td style={{ whiteSpace: "nowrap" }}>{formatDateTime(a.date, a.time)}</td>

                                    <td>
                                        <span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span>
                                    </td>

                                    <td>{a.patientName || "-"}</td>
                                    <td>{a.patientPhone || "-"}</td>
                                    <td title={a.message || ""}>{truncate(a.message, 30)}</td>

                                    <td>
                                        <div className="flex gap-sm">
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleView(a.id)}>
                                                View
                                            </button>

                                            {(hasRole("Admin") || hasRole("Doctor")) &&
                                                a.status !== "Cancelled" &&
                                                a.status !== "Confirmed" && (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleConfirm(a.id)}
                                                    >
                                                        Confirm
                                                    </button>
                                                )}

                                            {a.status !== "Cancelled" && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a.id)}>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedUpcoming.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", opacity: 0.7 }}>
                                        {searchQuery
                                            ? `No appointments found for "${searchQuery}".`
                                            : "No appointments found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ✅ Upcoming Pagination */}
                {upcomingAppointments.length > 0 && (
                    <div className="flex justify-between items-center mt-md" style={{ padding: "8px 4px" }}>
                        <span style={{ fontSize: 13, opacity: 0.65 }}>
                            Showing {startUpcomingItem}–{endUpcomingItem} of {upcomingAppointments.length} appointments
                        </span>

                        {totalUpcomingPages > 1 && (
                            <div className="flex gap-sm items-center">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    disabled={upcomingPage === 1}
                                    onClick={() => setUpcomingPage((p) => p - 1)}
                                >
                                    ← Prev
                                </button>

                                {getPageNumbers(upcomingPage, totalUpcomingPages).map((page, idx) =>
                                    page === "..." ? (
                                        <span key={`u-ellipsis-${idx}`} style={{ padding: "0 4px", opacity: 0.5 }}>
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={`u-${page}`}
                                            className={`btn btn-sm ${upcomingPage === page ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setUpcomingPage(page)}
                                            style={{ minWidth: 34 }}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    className="btn btn-secondary btn-sm"
                                    disabled={upcomingPage === totalUpcomingPages}
                                    onClick={() => setUpcomingPage((p) => p + 1)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Book Appointment Modal */}
            <Modal
                isOpen={showModal}
                onClose={() =>
                {
                    setShowModal(false);
                    resetForm();
                }}
                title="Book New Appointment"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Doctor</label>
                        <select
                            name="doctorId"
                            className="form-select"
                            value={formData.doctorId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {(d.fullName || `${d.firstName || ""} ${d.lastName || ""}`.trim())} -{" "}
                                    {d.specialty || ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Patient</label>
                        <select
                            name="patientId"
                            className="form-select"
                            value={formData.patientId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Patient</option>
                            {patients.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date & Time</label>
                        <input
                            type="datetime-local"
                            name="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex gap-md justify-between mt-lg">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Book Appointment
                        </button>
                    </div>
                </form>
            </Modal>

            {/* View Appointment Modal */}
            <Modal
                isOpen={showViewModal}
                onClose={() =>
                {
                    setShowViewModal(false);
                    setSelectedAppointment(null);
                    setPrescriptionInfo(null);
                }}
                title="Appointment Details"
            >
                {viewLoading ? (
                    <LoadingSpinner />
                ) : selectedAppointment ? (
                    <div style={{ display: "grid", gap: 8 }}>
                        <div>
                            <b>Date:</b> {formatDateTime(selectedAppointment.date, selectedAppointment.time)}
                        </div>
                        <div>
                            <b>Status:</b> {selectedAppointment.status || "-"}
                        </div>
                        <div>
                            <b>Doctor:</b> {selectedAppointment.doctorName || "-"}
                        </div>
                        <div>
                            <b>Patient:</b> {selectedAppointment.patientName || "-"}
                        </div>
                        <div>
                            <b>Phone:</b> {selectedAppointment.patientPhone || "-"}
                        </div>
                        <div>
                            <b>Message:</b>
                            <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
                                {selectedAppointment.message || "-"}
                            </div>
                        </div>

                        {/* ✅ Video Call */}
                        {selectedAppointment.isVideoCall && selectedAppointment.status === "Confirmed" && (
                            <div className="flex gap-sm mt-lg">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                    {
                                        setShowViewModal(false);
                                        setActiveCallApptId(selectedAppointment.id);
                                    }}
                                >
                                    📹 Join Video Call
                                </button>
                            </div>
                        )}

                        {selectedAppointment.status === "Confirmed" &&
                            (hasRole("Admin") || hasRole("Doctor") || hasRole("Patient")) && (
                                <div className="flex gap-sm mt-lg">
                                    {loadingPrescription ? (
                                        <span style={{ opacity: 0.7 }}>Loading prescription...</span>
                                    ) : prescriptionInfo?.prescriptionId ? (
                                        <button className="btn btn-success btn-sm" onClick={handleDownloadPrescription}>
                                            Download Prescription (PDF)
                                        </button>
                                    ) : hasRole("Doctor") ? (
                                        <button className="btn btn-primary btn-sm" onClick={openWritePrescription}>
                                            Write Prescription
                                        </button>
                                    ) : (
                                        <span style={{ opacity: 0.7 }}>Prescription not available yet.</span>
                                    )}
                                </div>
                            )}
                    </div>
                ) : (
                    <p className="text-muted">No details found.</p>
                )}
            </Modal>

            {/* Write Prescription Modal */}
            <Modal isOpen={showRxModal} onClose={() => setShowRxModal(false)} title="Write Prescription">
                <div style={{ display: "grid", gap: 10 }}>
                    {rxMedicines.map((m, idx) => (
                        <div key={idx} className="card" style={{ padding: 12 }}>
                            <div className="form-group">
                                <label className="form-label">Medicine Name</label>
                                <input
                                    className="form-input"
                                    value={m.medicineName}
                                    onChange={(e) => updateRxRow(idx, "medicineName", e.target.value)}
                                    placeholder="e.g. Paracetamol"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Instructions</label>
                                <input
                                    className="form-input"
                                    value={m.instructions}
                                    onChange={(e) => updateRxRow(idx, "instructions", e.target.value)}
                                    placeholder="e.g. 1 tablet after meal, 2x daily"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-input"
                                    value={m.quantity}
                                    onChange={(e) => updateRxRow(idx, "quantity", e.target.value)}
                                />
                            </div>
                            <div className="flex gap-sm">
                                {rxMedicines.length > 1 && (
                                    <button className="btn btn-danger btn-sm" onClick={() => removeRxRow(idx)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-sm justify-between">
                        <button className="btn btn-secondary" onClick={addRxRow}>
                            + Add medicine
                        </button>
                        <button className="btn btn-primary" disabled={rxSaving} onClick={handleCreatePrescription}>
                            {rxSaving ? "Saving..." : "Save & Generate PDF"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ✅ Full-screen Video Call overlay */}
            {activeCallApptId && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 99999,
                        padding: 16,
                        background: "rgba(0,0,0,0.65)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ width: "min(1100px, 96vw)" }}>
                        <VideoCallRoom
                            appointmentId={activeCallApptId}
                            currentUserName={user?.fullName || "User"}
                            onClose={() => setActiveCallApptId(null)}
                        />
                    </div>
                </div>
            )}

            {/* ✅ History section */}
            {historyAppointments.length > 0 && (
                <div className="card mt-lg">
                    <div
                        style={{
                            padding: "12px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h3 style={{ margin: 0 }}>History</h3>
                        <span style={{ opacity: 0.65, fontSize: 13 }}>
                            {historyAppointments.length} past appointments
                        </span>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Patient</th>
                                    <th>Phone</th>
                                    <th>Message</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedHistory.map((a) => (
                                    <tr key={a.id}>
                                        <td style={{ whiteSpace: "nowrap" }}>{formatDateTime(a.date, a.time)}</td>

                                        <td>
                                            <span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span>
                                        </td>

                                        <td>{a.patientName || "-"}</td>
                                        <td>{a.patientPhone || "-"}</td>
                                        <td title={a.message || ""}>{truncate(a.message, 30)}</td>

                                        <td>
                                            <div className="flex gap-sm">
                                                <button className="btn btn-secondary btn-sm" onClick={() => handleView(a.id)}>
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {paginatedHistory.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", opacity: 0.7 }}>
                                            No history appointments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ History Pagination */}
                    {historyAppointments.length > 0 && (
                        <div className="flex justify-between items-center mt-md" style={{ padding: "8px 4px" }}>
                            <span style={{ fontSize: 13, opacity: 0.65 }}>
                                Showing {startHistoryItem}–{endHistoryItem} of {historyAppointments.length} appointments
                            </span>

                            {totalHistoryPages > 1 && (
                                <div className="flex gap-sm items-center">
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        disabled={historyPage === 1}
                                        onClick={() => setHistoryPage((p) => p - 1)}
                                    >
                                        ← Prev
                                    </button>

                                    {getPageNumbers(historyPage, totalHistoryPages).map((page, idx) =>
                                        page === "..." ? (
                                            <span key={`h-ellipsis-${idx}`} style={{ padding: "0 4px", opacity: 0.5 }}>
                                                …
                                            </span>
                                        ) : (
                                            <button
                                                key={`h-${page}`}
                                                className={`btn btn-sm ${historyPage === page ? "btn-primary" : "btn-secondary"}`}
                                                onClick={() => setHistoryPage(page)}
                                                style={{ minWidth: 34 }}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    <button
                                        className="btn btn-secondary btn-sm"
                                        disabled={historyPage === totalHistoryPages}
                                        onClick={() => setHistoryPage((p) => p + 1)}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppointmentsList;