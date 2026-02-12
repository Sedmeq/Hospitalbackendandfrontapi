import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { doctorApi } from '../../api/doctorApi';
import { patientApi } from '../../api/patientApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { showToast, ToastComponent } = useToast();
    const [formData, setFormData] = useState({
        doctorId: '',
        patientId: '',
        date: '',
    });

    useEffect(() => {
        loadAppointments();
        loadDoctors();
        loadPatients();
    }, []);

    const loadAppointments = async () => {
        try {
            const response = await appointmentApi.getAllAppointments();
            setAppointments(response.data);
        } catch (error) {
            showToast('Error loading appointments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadDoctors = async () => {
        try {
            const response = await doctorApi.getAllDoctors();
            setDoctors(response.data);
        } catch (error) {
            console.error('Error loading doctors:', error);
        }
    };

    const loadPatients = async () => {
        try {
            const response = await patientApi.getAllPatients();
            setPatients(response.data);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await appointmentApi.bookAppointment(formData);
            showToast('Appointment booked successfully', 'success');
            setShowModal(false);
            resetForm();
            loadAppointments();
        } catch (error) {
            showToast(error.response?.data?.message || 'Booking failed', 'error');
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            await appointmentApi.cancelAppointment(id);
            showToast('Appointment cancelled successfully', 'success');
            loadAppointments();
        } catch (error) {
            showToast('Error cancelling appointment', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            doctorId: '',
            patientId: '',
            date: '',
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Scheduled': 'badge-primary',
            'Completed': 'badge-success',
            'Cancelled': 'badge-danger',
            'Pending': 'badge-warning',
        };
        return statusMap[status] || 'badge-secondary';
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <div className="flex justify-between items-center mb-xl">
                <h2>Appointments Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    + Book Appointment
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Patient</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>{new Date(appointment.date).toLocaleString()}</td>
                                    <td>{appointment.doctorName}</td>
                                    <td>{appointment.patientName}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td>
                                        {appointment.status !== 'Cancelled' && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancel(appointment.id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
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
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.fullName} - {doctor.specialty}
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
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.fullName}
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
                            Book Appointment
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AppointmentsList;
