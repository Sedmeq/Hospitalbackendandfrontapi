// import React, { useEffect, useState, useCallback } from "react";
// import { labResultApi } from "../../api/labResultApi";
// import { patientApi } from "../../api/patientApi";
// import { appointmentApi } from "../../api/appointmentApi";
// import { useToast } from "../../components/common/Toast";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import Modal from "../../components/common/Modal";
// import { useAuth } from "../../context/AuthContext";

// // ─── Sabitlər ────────────────────────────────────────────────────────────────
// const STATUS_OPTIONS = ["Normal", "High", "Low", "Critical"];

// const STATUS_BADGE = {
//     Normal:   "badge-success",
//     High:     "badge-warning",
//     Low:      "badge-info",
//     Critical: "badge-danger",
// };

// const emptyItem = () => ({
//     testName: "",
//     value: "",
//     unit: "",
//     referenceRange: "",
//     status: "Normal",
// });

// const INITIAL_FORM = {
//     title:         "",
//     notes:         "",
//     resultDate:    new Date().toISOString().slice(0, 10),
//     appointmentId: "",
//     patientId:     "",
//     items:         [emptyItem()],
// };

// // ─── Komponent ────────────────────────────────────────────────────────────────
// const LabResultList = () => {
//     const { hasRole } = useAuth();
//     const { showToast, ToastComponent } = useToast();

//     const isAdmin   = hasRole("Admin");
//     const isDoctor  = hasRole("Doctor");
//     const isPatient = hasRole("Patient");
//     const canCreate = isDoctor;
//     const canDelete = isDoctor || isAdmin;

//     // ── State ──────────────────────────────────────────────────────────────
//     const [labResults,   setLabResults]   = useState([]);
//     const [patients,     setPatients]     = useState([]);   // Doctor için dropdown
//     const [appointments, setAppointments] = useState([]);   // Seçilen patiente göre
//     const [loading,      setLoading]      = useState(true);
//     const [submitting,   setSubmitting]   = useState(false);
//     const [showModal,    setShowModal]    = useState(false);
//     const [formState,    setFormState]    = useState(INITIAL_FORM);

//     // ── Data yükleme ───────────────────────────────────────────────────────
//     const loadLabResults = useCallback(async () => {
//         setLoading(true);
//         try {
//             let res;
//             if (isAdmin)        res = await labResultApi.getAll();
//             else if (isDoctor)  res = await labResultApi.getMyDoctor();
//             else if (isPatient) res = await labResultApi.getMy();
//             else                res = { data: [] };
//             setLabResults(res.data ?? []);
//         } catch (e) {
//             showToast(extractError(e, "Error loading lab results"), "error");
//         } finally {
//             setLoading(false);
//         }
//     }, [isAdmin, isDoctor, isPatient]); // eslint-disable-line react-hooks/exhaustive-deps

//     // Doctor modal açıldığında bütün patientləri bir dəfə yüklə
//     const loadPatients = useCallback(async () => {
//         if (!isDoctor || patients.length > 0) return;
//         try {
//             const res = await patientApi.getAll();
//             setPatients(res.data ?? []);
//         } catch (e) {
//             showToast(extractError(e, "Could not load patients"), "error");
//         }
//     }, [isDoctor, patients.length]); // eslint-disable-line react-hooks/exhaustive-deps

//     // Patient seçildikdə həmin patientlə bağlı Confirmed appointment-ləri yüklə
//     const loadAppointmentsByPatient = useCallback(async (patientId) => {
//         setAppointments([]);
//         setFormState(prev => ({ ...prev, appointmentId: "" }));
//         if (!patientId) return;
//         try {
//             // GET /api/Appointment?patientId={id}&status=Confirmed
//             const res = await appointmentApi.getConfirmedByPatient(patientId);
//             setAppointments(res.data ?? []);
//         } catch {
//             // appointment yüklenməsə form hələ işləyir — critical deyil
//         }
//     }, []);

//     useEffect(() => { loadLabResults(); }, [loadLabResults]);

//     // ── Form helpers ───────────────────────────────────────────────────────
//     const resetForm = () => setFormState(INITIAL_FORM);

//     const setField = (field, value) =>
//         setFormState(prev => ({ ...prev, [field]: value }));

//     const setItemField = (index, field, value) =>
//         setFormState(prev => {
//             const items = [...prev.items];
//             items[index] = { ...items[index], [field]: value };
//             return { ...prev, items };
//         });

//     const addItemRow    = () => setFormState(prev => ({ ...prev, items: [...prev.items, emptyItem()] }));
//     const removeItemRow = (i) => setFormState(prev => ({
//         ...prev,
//         items: prev.items.length > 1 ? prev.items.filter((_, idx) => idx !== i) : [emptyItem()],
//     }));

//     const handlePatientChange = (patientId) => {
//         setField("patientId", patientId);
//         loadAppointmentsByPatient(patientId);
//     };

//     // ── Modal açma ─────────────────────────────────────────────────────────
//     const openCreateModal = () => {
//         resetForm();
//         setAppointments([]);
//         loadPatients();
//         setShowModal(true);
//     };

//     // ── PDF aç ─────────────────────────────────────────────────────────────
//     const openPdf = async (id) => {
//         try {
//             const res = await labResultApi.downloadPdf(id);
//             const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
//             window.open(url, "_blank", "noopener,noreferrer");
//             setTimeout(() => URL.revokeObjectURL(url), 60_000);
//         } catch (e) {
//             showToast(extractError(e, "PDF could not be opened"), "error");
//         }
//     };

//     // ── Sil ────────────────────────────────────────────────────────────────
//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this lab result?")) return;
//         try {
//             await labResultApi.delete(id);
//             showToast("Deleted successfully", "success");
//             loadLabResults();
//         } catch (e) {
//             showToast(extractError(e, "Error deleting"), "error");
//         }
//     };

//     // ── Submit ─────────────────────────────────────────────────────────────
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formState.patientId) { showToast("Please select a patient", "error"); return; }

//         const validItems = formState.items.filter(x => x.testName.trim() && x.value.trim());
//         if (validItems.length === 0) { showToast("At least one test item is required", "error"); return; }

//         const payload = {
//             title:         formState.title,
//             notes:         formState.notes,
//             resultDate:    new Date(formState.resultDate).toISOString(),
//             appointmentId: formState.appointmentId ? Number(formState.appointmentId) : null,
//             patientId:     Number(formState.patientId),
//             items:         validItems.map(x => ({
//                 testName:       x.testName,
//                 value:          x.value,
//                 unit:           x.unit,
//                 referenceRange: x.referenceRange,
//                 status:         x.status || "Normal",
//             })),
//         };

//         setSubmitting(true);
//         try {
//             await labResultApi.create(payload);
//             showToast("Lab result created successfully", "success");
//             setShowModal(false);
//             resetForm();
//             loadLabResults();
//         } catch (e) {
//             showToast(extractError(e, "Create failed"), "error");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // ── Render ─────────────────────────────────────────────────────────────
//     if (loading) return <LoadingSpinner fullScreen />;

//     return (
//         <div>
//             {ToastComponent}

//             {/* ── Başlıq + Yarat düyməsi ── */}
//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Lab Results</h2>
//                 {canCreate && (
//                     <button className="btn btn-primary" onClick={openCreateModal}>
//                         + Add Lab Result
//                     </button>
//                 )}
//             </div>

//             {/* ── Cədvəl ── */}
//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Title</th>
//                                 <th>Patient</th>
//                                 <th>Doctor</th>
//                                 <th>Date</th>
//                                 <th>Appt.</th>
//                                 <th>PDF</th>
//                                 {canDelete && <th>Actions</th>}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {labResults.map(x => (
//                                 <tr key={x.id}>
//                                     <td className="text-muted">{x.id}</td>
//                                     <td><strong>{x.title}</strong></td>
//                                     <td>{x.patientName ?? x.patientId}</td>
//                                     <td>{x.doctorName  ?? x.doctorId}</td>
//                                     <td>{x.resultDate ? new Date(x.resultDate).toLocaleDateString() : "-"}</td>
//                                     <td>{x.appointmentId ?? "-"}</td>
//                                     <td>
//                                         <button className="btn btn-secondary btn-sm" onClick={() => openPdf(x.id)}>
//                                             📄 Open
//                                         </button>
//                                     </td>
//                                     {canDelete && (
//                                         <td>
//                                             <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)}>
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     )}
//                                 </tr>
//                             ))}
//                             {labResults.length === 0 && (
//                                 <tr>
//                                     <td colSpan={canDelete ? 8 : 7} className="text-muted text-center">
//                                         No lab results found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* ── Create Modal ── */}
//             <Modal
//                 isOpen={showModal}
//                 onClose={() => { setShowModal(false); resetForm(); }}
//                 title="Add Lab Result"
//             >
//                 <form onSubmit={handleSubmit}>

//                     {/* Title */}
//                     <div className="form-group">
//                         <label className="form-label">Title <span className="text-danger">*</span></label>
//                         <input
//                             type="text"
//                             className="form-input"
//                             value={formState.title}
//                             onChange={e => setField("title", e.target.value)}
//                             placeholder="e.g. Complete Blood Count"
//                             required
//                         />
//                     </div>

//                     {/* Notes */}
//                     <div className="form-group">
//                         <label className="form-label">Notes</label>
//                         <textarea
//                             className="form-input"
//                             rows={2}
//                             value={formState.notes}
//                             onChange={e => setField("notes", e.target.value)}
//                             placeholder="Optional clinical notes..."
//                         />
//                     </div>

//                     {/* Result Date */}
//                     <div className="form-group">
//                         <label className="form-label">Result Date <span className="text-danger">*</span></label>
//                         <input
//                             type="date"
//                             className="form-input"
//                             value={formState.resultDate}
//                             onChange={e => setField("resultDate", e.target.value)}
//                             required
//                         />
//                     </div>

//                     {/* Patient seçimi — ID yazmaq yox, dropdown */}
//                     <div className="form-group">
//                         <label className="form-label">Patient <span className="text-danger">*</span></label>
//                         <select
//                             className="form-input"
//                             value={formState.patientId}
//                             onChange={e => handlePatientChange(e.target.value)}
//                             required
//                         >
//                             <option value="">— Select patient —</option>
//                             {patients.map(p => (
//                                 <option key={p.id} value={p.id}>
//                                     {p.fullName ?? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()} (ID: {p.id})
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Appointment seçimi — yalnız patient seçildikdən sonra görünür */}
//                     {formState.patientId && (
//                         <div className="form-group">
//                             <label className="form-label">
//                                 Appointment
//                                 <span className="text-muted" style={{ fontWeight: 400, marginLeft: 6 }}>
//                                     (optional — only Confirmed)
//                                 </span>
//                             </label>
//                             {appointments.length > 0 ? (
//                                 <select
//                                     className="form-input"
//                                     value={formState.appointmentId}
//                                     onChange={e => setField("appointmentId", e.target.value)}
//                                 >
//                                     <option value="">— None —</option>
//                                     {appointments.map(a => (
//                                         <option key={a.id} value={a.id}>
//                                             #{a.id} — {a.date ? new Date(a.date).toLocaleDateString() : ""}
//                                             {a.time ? ` ${a.time}` : ""}
//                                         </option>
//                                     ))}
//                                 </select>
//                             ) : (
//                                 <p className="text-muted" style={{ fontSize: "0.85rem", margin: "4px 0 0" }}>
//                                     No confirmed appointments found for this patient.
//                                 </p>
//                             )}
//                         </div>
//                     )}

//                     {/* Test Items */}
//                     <div className="form-group">
//                         <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
//                             <label className="form-label" style={{ margin: 0 }}>
//                                 Tests / Items <span className="text-danger">*</span>
//                             </label>
//                             <button type="button" className="btn btn-secondary btn-sm" onClick={addItemRow}>
//                                 + Add Test
//                             </button>
//                         </div>

//                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                             {formState.items.map((it, idx) => (
//                                 <div key={idx} style={{
//                                     padding: "12px",
//                                     border: "1px solid #e5e7eb",
//                                     borderRadius: 8,
//                                     background: "#fafafa",
//                                 }}>
//                                     {/* Row 1: Test name + Value + Unit */}
//                                     <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
//                                         <input
//                                             className="form-input"
//                                             placeholder="Test name *"
//                                             value={it.testName}
//                                             onChange={e => setItemField(idx, "testName", e.target.value)}
//                                         />
//                                         <input
//                                             className="form-input"
//                                             placeholder="Value *"
//                                             value={it.value}
//                                             onChange={e => setItemField(idx, "value", e.target.value)}
//                                         />
//                                         <input
//                                             className="form-input"
//                                             placeholder="Unit (mg/dL)"
//                                             value={it.unit}
//                                             onChange={e => setItemField(idx, "unit", e.target.value)}
//                                         />
//                                     </div>

//                                     {/* Row 2: Reference range + Status + Remove */}
//                                     <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center" }}>
//                                         <input
//                                             className="form-input"
//                                             placeholder="Reference range (e.g. 70–100)"
//                                             value={it.referenceRange}
//                                             onChange={e => setItemField(idx, "referenceRange", e.target.value)}
//                                         />
//                                         <select
//                                             className="form-input"
//                                             value={it.status}
//                                             onChange={e => setItemField(idx, "status", e.target.value)}
//                                             style={{ minWidth: 110 }}
//                                         >
//                                             {STATUS_OPTIONS.map(s => (
//                                                 <option key={s} value={s}>{s}</option>
//                                             ))}
//                                         </select>
//                                         <button
//                                             type="button"
//                                             className="btn btn-danger btn-sm"
//                                             onClick={() => removeItemRow(idx)}
//                                             title="Remove test"
//                                         >
//                                             ✕
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="flex justify-between mt-lg">
//                         <button
//                             type="button"
//                             className="btn btn-secondary"
//                             onClick={() => { setShowModal(false); resetForm(); }}
//                         >
//                             Cancel
//                         </button>
//                         <button type="submit" className="btn btn-primary" disabled={submitting}>
//                             {submitting ? "Creating..." : "Create Lab Result"}
//                         </button>
//                     </div>
//                 </form>
//             </Modal>
//         </div>
//     );
// };

// export default LabResultList;

// // ─── Utility ─────────────────────────────────────────────────────────────────
// function extractError(e, fallback) {
//     return (
//         e?.response?.data?.message ||
//         e?.response?.data?.title   ||
//         (typeof e?.response?.data === "string" ? e.response.data : null) ||
//         e?.message ||
//         fallback
//     );
// }











// src/pages/labResult/LabResultList.jsx
import React, { useEffect, useState } from "react";
import { labResultApi } from "../../api/labResultApi";
import { appointmentApi } from "../../api/appointmentApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";

const emptyItem = () => ({
    testName: "",
    value: "",
    unit: "",
    referenceRange: "",
    status: "Normal",
});

const LabResultList = () =>
{
    const { hasRole, user } = useAuth();
    const { showToast, ToastComponent } = useToast();

    const isAdmin = hasRole("Admin");
    const isDoctor = hasRole("Doctor");
    const isPatient = hasRole("Patient");

    const canCreate = isDoctor; // backend Create: Doctor
    const canDelete = isDoctor || isAdmin;

    // ⚠️ doctorId user obyektində necə saxlanırsa ona görə dəyiş.
    // Ən çox hallarda user.id olur.
    const doctorId = user?.id;

    const [labResults, setLabResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // Doctor dropdown-lar
    const [myAppointments, setMyAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);

    const [doctorPatients, setDoctorPatients] = useState([]);
    const [patientsLoading, setPatientsLoading] = useState(false);
    const [patientSearch, setPatientSearch] = useState("");

    // Modal + form
    const [showModal, setShowModal] = useState(false);

    const [formState, setFormState] = useState({
        title: "",
        notes: "",
        resultDate: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
        appointmentId: "",
        patientId: "",
        items: [emptyItem()],
    });

    const getErrorMessage = (e, fallback = "Operation failed") =>
    {
        const data = e?.response?.data;

        if (typeof data === "string") return data;
        if (data?.message) return data.message;
        if (data?.title) return data.title;

        return e?.message || fallback;
    };

    const resetForm = () =>
    {
        setFormState({
            title: "",
            notes: "",
            resultDate: new Date().toISOString().slice(0, 10),
            appointmentId: "",
            patientId: "",
            items: [emptyItem()],
        });
        setPatientSearch("");
    };

    // ─────────────────────────────────────────────
    // Load lab results (role-based)
    // ─────────────────────────────────────────────
    const loadLabResults = async () =>
    {
        setLoading(true);
        try
        {
            let res;
            if (isAdmin) res = await labResultApi.getAll();
            else if (isDoctor) res = await labResultApi.getMyDoctor();
            else if (isPatient) res = await labResultApi.getMy();
            else res = { data: [] };

            setLabResults(res.data ?? []);
        } catch (e)
        {
            showToast(getErrorMessage(e, "Error loading lab results"), "error");
        } finally
        {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────
    // Doctor helpers (appointments + patients)
    // ─────────────────────────────────────────────
    const loadMyDoctorAppointments = async () =>
    {
        if (!isDoctor) return;

        setAppointmentsLoading(true);
        try
        {
            const res = await appointmentApi.getMyDoctorAppointments();
            setMyAppointments(res.data ?? []);
        } catch (e)
        {
            showToast(getErrorMessage(e, "Error loading appointments"), "error");
        } finally
        {
            setAppointmentsLoading(false);
        }
    };

    const loadDoctorPatients = async () =>
    {
        if (!isDoctor && !isAdmin) return;
        if (!doctorId)
        {
            // doctorId yoxdursa, endpoint çağıra bilmirik
            // (AuthContext-də user id başqa field ola bilər)
            return;
        }

        setPatientsLoading(true);
        try
        {
            const res = await appointmentApi.getPatientsByDoctorId(doctorId);
            setDoctorPatients(res.data ?? []);
        } catch (e)
        {
            showToast(getErrorMessage(e, "Error loading doctor patients"), "error");
        } finally
        {
            setPatientsLoading(false);
        }
    };

    useEffect(() =>
    {
        loadLabResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin, isDoctor, isPatient]);

    // ─────────────────────────────────────────────
    // PDF open (blob)
    // ─────────────────────────────────────────────
    const openPdf = async (id) =>
    {
        try
        {
            const res = await labResultApi.downloadPdf(id);
            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank", "noopener,noreferrer");
            setTimeout(() => URL.revokeObjectURL(url), 60_000);
        } catch (e)
        {
            showToast(getErrorMessage(e, "PDF could not be opened"), "error");
        }
    };

    // ─────────────────────────────────────────────
    // Delete
    // ─────────────────────────────────────────────
    const handleDelete = async (id) =>
    {
        if (!window.confirm("Delete this lab result?")) return;

        try
        {
            await labResultApi.delete(id);
            showToast("Deleted successfully", "success");
            loadLabResults();
        } catch (e)
        {
            showToast(getErrorMessage(e, "Error deleting"), "error");
        }
    };

    // ─────────────────────────────────────────────
    // Items helpers
    // ─────────────────────────────────────────────
    const setItemField = (index, field, value) =>
    {
        setFormState((prev) =>
        {
            const items = [...prev.items];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, items };
        });
    };

    const addItemRow = () =>
    {
        setFormState((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
    };

    const removeItemRow = (index) =>
    {
        setFormState((prev) =>
        {
            const items = prev.items.filter((_, i) => i !== index);
            return { ...prev, items: items.length ? items : [emptyItem()] };
        });
    };

    // ─────────────────────────────────────────────
    // Create submit
    // ─────────────────────────────────────────────
    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        if (!canCreate)
        {
            showToast("Only Doctor can create lab results.", "error");
            return;
        }

        if (!formState.title.trim())
        {
            showToast("Title is required", "error");
            return;
        }

        if (!formState.patientId)
        {
            showToast("Please select a patient", "error");
            return;
        }

        // CreateLabResultCommand-a 1:1 payload
        const payload = {
            title: formState.title,
            notes: formState.notes,
            resultDate: new Date(formState.resultDate).toISOString(),
            appointmentId: formState.appointmentId ? Number(formState.appointmentId) : null,
            patientId: Number(formState.patientId),
            items: (formState.items || [])
                .filter((x) => x.testName?.trim() && x.value?.trim())
                .map((x) => ({
                    testName: x.testName,
                    value: x.value,
                    unit: x.unit,
                    referenceRange: x.referenceRange,
                    status: x.status || "Normal",
                })),
        };

        try
        {
            await labResultApi.create(payload);
            showToast("Created successfully", "success");
            setShowModal(false);
            resetForm();
            loadLabResults();
        } catch (e2)
        {
            showToast(getErrorMessage(e2, "Create failed"), "error");
        }
    };

    // Filter doctor patients by search (optional)
    const filteredDoctorPatients = doctorPatients.filter((p) =>
    {
        const q = patientSearch.trim().toLowerCase();
        if (!q) return true;

        const text = `${p.fullName ?? ""} ${p.patientName ?? ""} ${p.email ?? ""} ${p.phone ?? p.patientPhone ?? ""
            }`.toLowerCase();

        return text.includes(q);
    });

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>Lab Results</h2>

                {canCreate && (
                    <button
                        className="btn btn-primary"
                        onClick={async () =>
                        {
                            resetForm();
                            setShowModal(true);

                            // Doctor üçün dropdown-ları hazırla
                            await Promise.all([loadMyDoctorAppointments(), loadDoctorPatients()]);
                        }}
                    >
                        + Add Lab Result
                    </button>
                )}
            </div>

            {/* LIST */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                {/* <th>Appointment</th> */}
                                <th>PDF</th>
                                {canDelete && <th>Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {labResults.map((x) => (
                                <tr key={x.id}>
                                    <td>{x.id}</td>
                                    <td>{x.title}</td>
                                    <td>{x.patientName ?? x.patientId}</td>
                                    <td>{x.doctorName ?? x.doctorId}</td>
                                    <td>{x.resultDate ? new Date(x.resultDate).toLocaleString() : "-"}</td>
                                    {/* <td>{x.appointmentId ?? "-"}</td> */}
                                    <td>
                                        <button className="btn btn-primary btn-sm" onClick={() => openPdf(x.id)}>
                                            Open PDF
                                        </button>
                                    </td>

                                    {canDelete && (
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(x.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}

                            {labResults.length === 0 && (
                                <tr>
                                    <td colSpan={canDelete ? 8 : 7} className="text-muted">
                                        No lab results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE MODAL */}
            <Modal
                isOpen={showModal}
                onClose={() =>
                {
                    setShowModal(false);
                    resetForm();
                }}
                title="Add Lab Result"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formState.title}
                            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea
                            className="form-input"
                            rows={3}
                            value={formState.notes}
                            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Result Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={formState.resultDate}
                            onChange={(e) => setFormState({ ...formState, resultDate: e.target.value })}
                            required
                        />
                    </div>

                    {/* Appointment (optional) -> patientId auto */}
                    {isDoctor && (
                        <div className="form-group">
                            <label className="form-label">Appointment (optional)</label>

                            <select
                                className="form-input"
                                value={formState.appointmentId}
                                onChange={(e) =>
                                {
                                    const newAppointmentId = e.target.value;

                                    const appt = myAppointments.find(
                                        (a) => String(a.id) === String(newAppointmentId)
                                    );

                                    setFormState((prev) => ({
                                        ...prev,
                                        appointmentId: newAppointmentId,
                                        patientId: appt?.patientId ? String(appt.patientId) : prev.patientId,
                                    }));
                                }}
                                disabled={appointmentsLoading}
                            >
                                <option value="">
                                    {appointmentsLoading ? "Loading appointments..." : "No appointment (lab only)"}
                                </option>

                                {myAppointments.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        #{a.id} — {a.patientName} — {a.status} —{" "}
                                        {new Date(a.date).toLocaleString()}
                                    </option>
                                ))}
                            </select>

                            <small className="text-muted">
                                Appointment seçsən, patient avtomatik seçiləcək.
                            </small>
                        </div>
                    )}

                    {/* Patient dropdown */}
                    {/* <div className="form-group">
                        <label className="form-label">Patient</label>

                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search patient (name/phone/email)..."
                            value={patientSearch}
                            onChange={(e) => setPatientSearch(e.target.value)}
                            style={{ marginBottom: 10 }}
                        />

                        <select
                            className="form-input"
                            value={formState.patientId}
                            onChange={(e) => setFormState({ ...formState, patientId: e.target.value })}
                            required
                            disabled={patientsLoading}
                        >
                            <option value="">
                                {patientsLoading ? "Loading patients..." : "Select patient"}
                            </option>

                            {filteredDoctorPatients.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.fullName ?? p.patientName ?? "Patient"}{" "}
                                    {p.phone || p.patientPhone ? `- ${p.phone ?? p.patientPhone}` : ""}
                                </option>
                            ))}
                        </select>

                        {formState.patientId && (
                            <small className="text-muted">
                                Selected PatientId: <b>{formState.patientId}</b>
                            </small>
                        )}
                    </div> */}

                    {/* Items */}
                    <div className="form-group">
                        <div className="flex justify-between items-center">
                            <label className="form-label" style={{ marginBottom: 0 }}>
                                Tests / Items
                            </label>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addItemRow}>
                                + Add Test
                            </button>
                        </div>

                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                            {formState.items.map((it, idx) => (
                                <div key={idx} className="card" style={{ padding: 12, border: "1px solid #eee" }}>
                                    <div className="flex gap-md" style={{ gap: 10, flexWrap: "wrap" }}>
                                        <input
                                            className="form-input"
                                            style={{ minWidth: 180 }}
                                            placeholder="Test name"
                                            value={it.testName}
                                            onChange={(e) => setItemField(idx, "testName", e.target.value)}
                                            required
                                        />
                                        <input
                                            className="form-input"
                                            style={{ minWidth: 140 }}
                                            placeholder="Value"
                                            value={it.value}
                                            onChange={(e) => setItemField(idx, "value", e.target.value)}
                                            required
                                        />
                                        <input
                                            className="form-input"
                                            style={{ minWidth: 120 }}
                                            placeholder="Unit"
                                            value={it.unit}
                                            onChange={(e) => setItemField(idx, "unit", e.target.value)}
                                        />
                                        <input
                                            className="form-input"
                                            style={{ minWidth: 200 }}
                                            placeholder="Reference range"
                                            value={it.referenceRange}
                                            onChange={(e) => setItemField(idx, "referenceRange", e.target.value)}
                                        />

                                        <select
                                            className="form-input"
                                            style={{ minWidth: 140 }}
                                            value={it.status}
                                            onChange={(e) => setItemField(idx, "status", e.target.value)}
                                        >
                                            <option value="Normal">Normal</option>
                                            <option value="High">High</option>
                                            <option value="Low">Low</option>
                                            <option value="Critical">Critical</option>
                                        </select>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeItemRow(idx)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                            Create
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LabResultList;