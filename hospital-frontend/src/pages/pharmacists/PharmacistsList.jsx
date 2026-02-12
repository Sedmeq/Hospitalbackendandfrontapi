import React, { useState, useEffect } from 'react';
import { pharmacistApi } from '../../api/pharmacistApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const PharmacistsList = () => {
    const [pharmacists, setPharmacists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPharmacist, setEditingPharmacist] = useState(null);
    const { showToast, ToastComponent } = useToast();
    const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', licenseNumber: '' });

    useEffect(() => { loadPharmacists(); }, []);

    const loadPharmacists = async () => {
        try {
            const response = await pharmacistApi.getAllPharmacists();
            setPharmacists(response.data);
        } catch (error) {
            showToast('Error loading pharmacists', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPharmacist) {
                await pharmacistApi.updatePharmacist(editingPharmacist.id, formData);
                showToast('Pharmacist updated successfully', 'success');
            } else {
                await pharmacistApi.createPharmacist(formData);
                showToast('Pharmacist created successfully', 'success');
            }
            setShowModal(false);
            setFormData({ fullName: '', phone: '', email: '', licenseNumber: '' });
            setEditingPharmacist(null);
            loadPharmacists();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleEdit = (pharmacist) => {
        setEditingPharmacist(pharmacist);
        setFormData({ fullName: pharmacist.fullName, phone: pharmacist.phone, email: pharmacist.email, licenseNumber: pharmacist.licenseNumber });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await pharmacistApi.deletePharmacist(id);
            showToast('Pharmacist deleted successfully', 'success');
            loadPharmacists();
        } catch (error) {
            showToast('Error deleting pharmacist', 'error');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <div className="flex justify-between items-center mb-xl">
                <h2>Pharmacists Management</h2>
                <button className="btn btn-primary" onClick={() => { setFormData({ fullName: '', phone: '', email: '', licenseNumber: '' }); setEditingPharmacist(null); setShowModal(true); }}>+ Add Pharmacist</button>
            </div>
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>License</th><th>Actions</th></tr></thead>
                        <tbody>
                            {pharmacists.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.fullName}</td><td>{p.phone}</td><td>{p.email}</td><td>{p.licenseNumber}</td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingPharmacist ? 'Edit Pharmacist' : 'Add Pharmacist'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></div>
                    <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
                    <div className="form-group"><label className="form-label">License Number</label><input type="text" className="form-input" value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} required /></div>
                    <div className="flex gap-md justify-between mt-lg">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingPharmacist ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PharmacistsList;
