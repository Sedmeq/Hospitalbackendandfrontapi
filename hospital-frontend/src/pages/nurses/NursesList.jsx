import React, { useState, useEffect } from 'react';
import { nurseApi } from '../../api/nurseApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const NursesList = () => {
    const [nurses, setNurses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNurse, setEditingNurse] = useState(null);
    const { showToast, ToastComponent } = useToast();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        shift: '',
    });

    useEffect(() => {
        loadNurses();
    }, []);

    const loadNurses = async () => {
        try {
            const response = await nurseApi.getAllNurses();
            setNurses(response.data);
        } catch (error) {
            showToast('Error loading nurses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNurse) {
                await nurseApi.updateNurse(editingNurse.id, formData);
                showToast('Nurse updated successfully', 'success');
            } else {
                await nurseApi.createNurse(formData);
                showToast('Nurse created successfully', 'success');
            }
            setShowModal(false);
            resetForm();
            loadNurses();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleEdit = (nurse) => {
        setEditingNurse(nurse);
        setFormData({
            fullName: nurse.fullName,
            phone: nurse.phone,
            email: nurse.email,
            shift: nurse.shift,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await nurseApi.deleteNurse(id);
            showToast('Nurse deleted successfully', 'success');
            loadNurses();
        } catch (error) {
            showToast('Error deleting nurse', 'error');
        }
    };

    const resetForm = () => {
        setFormData({ fullName: '', phone: '', email: '', shift: '' });
        setEditingNurse(null);
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <div className="flex justify-between items-center mb-xl">
                <h2>Nurses Management</h2>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    + Add Nurse
                </button>
            </div>
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>Name</th><th>Phone</th><th>Email</th><th>Shift</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {nurses.map((nurse) => (
                                <tr key={nurse.id}>
                                    <td>{nurse.fullName}</td>
                                    <td>{nurse.phone}</td>
                                    <td>{nurse.email}</td>
                                    <td>{nurse.shift}</td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(nurse)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(nurse.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingNurse ? 'Edit Nurse' : 'Add Nurse'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="fullName" className="form-input" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Shift</label>
                        <select name="shift" className="form-select" value={formData.shift} onChange={(e) => setFormData({ ...formData, shift: e.target.value })} required>
                            <option value="">Select Shift</option>
                            <option value="Morning">Morning</option>
                            <option value="Evening">Evening</option>
                            <option value="Night">Night</option>
                        </select>
                    </div>
                    <div className="flex gap-md justify-between mt-lg">
                        <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingNurse ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default NursesList;
