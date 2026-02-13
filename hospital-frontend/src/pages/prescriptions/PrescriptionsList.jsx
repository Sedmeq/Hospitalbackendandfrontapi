import React, { useState, useEffect } from 'react';
import { prescriptionApi } from '../../api/prescriptionApi';
import { appointmentApi } from '../../api/appointmentApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const PrescriptionsList = () =>
{
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { showToast, ToastComponent } = useToast();
    const [formData, setFormData] = useState({
        appointmentId: '',
        diagnosis: '',
        notes: '',
        medicines: [{ medicineName: '', dosage: '', duration: '' }],
    });

    useEffect(() => { loadAppointments(); }, []);

    const loadAppointments = async () =>
    {
        try
        {
            const response = await appointmentApi.getAllAppointments();
            setAppointments(response.data);
        } catch (error)
        {
            showToast('Error loading appointments', 'error');
        } finally
        {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        try
        {
            await prescriptionApi.createPrescription(formData);
            showToast('Prescription created successfully', 'success');
            setShowModal(false);
            setFormData({ appointmentId: '', diagnosis: '', notes: '', medicines: [{ medicineName: '', dosage: '', duration: '' }] });
        } catch (error)
        {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const addMedicine = () =>
    {
        setFormData({
            ...formData,
            medicines: [...formData.medicines, { medicineName: '', dosage: '', duration: '' }],
        });
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <div className="flex justify-between items-center mb-xl">
                <h2>Prescriptions Management</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Prescription</button>
            </div>
            <div className="card">
                <p className="text-muted">Select an appointment to create a prescription</p>
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Prescription">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Appointment</label>
                        <select className="form-select" value={formData.appointmentId} onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })} required>
                            <option value="">Select Appointment</option>
                            {appointments.map((apt) => (
                                <option key={apt.id} value={apt.id}>{apt.patientName} - {apt.doctorName} - {new Date(apt.date).toLocaleDateString()}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Diagnosis</label>
                        <textarea className="form-textarea" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea className="form-textarea" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Medicines</label>
                        {formData.medicines.map((med, idx) => (
                            <div key={idx} className="grid grid-3 mb-sm">
                                <input type="text" className="form-input" placeholder="Medicine Name" value={med.medicineName} onChange={(e) =>
                                {
                                    const newMeds = [...formData.medicines];
                                    newMeds[idx].medicineName = e.target.value;
                                    setFormData({ ...formData, medicines: newMeds });
                                }} required />
                                <input type="text" className="form-input" placeholder="Dosage" value={med.dosage} onChange={(e) =>
                                {
                                    const newMeds = [...formData.medicines];
                                    newMeds[idx].dosage = e.target.value;
                                    setFormData({ ...formData, medicines: newMeds });
                                }} required />
                                <input type="text" className="form-input" placeholder="Duration" value={med.duration} onChange={(e) =>
                                {
                                    const newMeds = [...formData.medicines];
                                    newMeds[idx].duration = e.target.value;
                                    setFormData({ ...formData, medicines: newMeds });
                                }} required />
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary btn-sm" onClick={addMedicine}>+ Add Medicine</button>
                    </div>
                    <div className="flex gap-md justify-between mt-lg">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Prescription</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PrescriptionsList;
