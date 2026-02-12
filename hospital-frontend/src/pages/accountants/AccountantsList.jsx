import React, { useState, useEffect } from 'react';
import { accountantApi } from '../../api/accountantApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const AccountantsList = () => {
    const [accountants, setAccountants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAccountant, setEditingAccountant] = useState(null);
    const { showToast, ToastComponent } = useToast();
    const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', department: '' });

    useEffect(() => { loadAccountants(); }, []);

    const loadAccountants = async () => {
        try {
            const response = await accountantApi.getAllAccountants();
            setAccountants(response.data);
        } catch (error) {
            showToast('Error loading accountants', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAccountant) {
                await accountantApi.updateAccountant(editingAccountant.id, formData);
                showToast('Accountant updated successfully', 'success');
            } else {
                await accountantApi.createAccountant(formData);
                showToast('Accountant created successfully', 'success');
            }
            setShowModal(false);
            setFormData({ fullName: '', phone: '', email: '', department: '' });
            setEditingAccountant(null);
            loadAccountants();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleEdit = (accountant) => {
        setEditingAccountant(accountant);
        setFormData({ fullName: accountant.fullName, phone: accountant.phone, email: accountant.email, department: accountant.department });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await accountantApi.deleteAccountant(id);
            showToast('Accountant deleted successfully', 'success');
            loadAccountants();
        } catch (error) {
            showToast('Error deleting accountant', 'error');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <div className="flex justify-between items-center mb-xl">
                <h2>Accountants Management</h2>
                <button className="btn btn-primary" onClick={() => { setFormData({ fullName: '', phone: '', email: '', department: '' }); setEditingAccountant(null); setShowModal(true); }}>+ Add Accountant</button>
            </div>
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Department</th><th>Actions</th></tr></thead>
                        <tbody>
                            {accountants.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.fullName}</td><td>{a.phone}</td><td>{a.email}</td><td>{a.department}</td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(a)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingAccountant ? 'Edit Accountant' : 'Add Accountant'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></div>
                    <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
                    <div className="form-group"><label className="form-label">Department</label><input type="text" className="form-input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required /></div>
                    <div className="flex gap-md justify-between mt-lg">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingAccountant ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AccountantsList;
