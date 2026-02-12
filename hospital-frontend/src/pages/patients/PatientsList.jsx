import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [patientHistory, setPatientHistory] = useState(null);
    const { showToast, ToastComponent } = useToast();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        city: '',
        address: '',
    });

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const response = await patientApi.getAllPatients();
            setPatients(response.data);
        } catch (error) {
            showToast('Error loading patients', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPatient) {
                await patientApi.updatePatient(editingPatient.id, formData);
                showToast('Patient updated successfully', 'success');
            } else {
                await patientApi.createPatient(formData);
                showToast('Patient created successfully', 'success');
            }
            setShowModal(false);
            resetForm();
            loadPatients();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setFormData({
            fullName: patient.fullName,
            phone: patient.phone,
            email: patient.email,
            gender: patient.gender,
            dateOfBirth: patient.dateOfBirth?.split('T')[0] || '',
            city: patient.city,
            address: patient.address || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;

        try {
            await patientApi.deletePatient(id);
            showToast('Patient deleted successfully', 'success');
            loadPatients();
        } catch (error) {
            showToast('Error deleting patient', 'error');
        }
    };

    const viewHistory = async (id) => {
        try {
            const response = await patientApi.getPatientHistory(id);
            setPatientHistory(response.data);
            setShowHistory(true);
        } catch (error) {
            showToast('Error loading patient history', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            email: '',
            gender: '',
            dateOfBirth: '',
            city: '',
            address: '',
        });
        setEditingPatient(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <div className="flex justify-between items-center mb-xl">
                <h2>Patients Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    + Add Patient
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>City</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.id}>
                                    <td>{patient.fullName}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.phone}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.city}</td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEdit(patient)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => viewHistory(patient.id)}
                                            >
                                                History
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(patient.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-input"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                            onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingPatient ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                title="Patient History"
            >
                {patientHistory && (
                    <div>
                        <h4>Appointments</h4>
                        {patientHistory.appointments?.length > 0 ? (
                            <ul>
                                {patientHistory.appointments.map((apt, idx) => (
                                    <li key={idx}>
                                        {new Date(apt.date).toLocaleDateString()} - {apt.doctorName} - {apt.status}
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
