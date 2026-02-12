import React, { useState, useEffect } from 'react';
import { medicineApi } from '../../api/medicineApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all, low-stock, expired
    const { showToast, ToastComponent } = useToast();
    const [formData, setFormData] = useState({
        medicineName: '',
        supplier: '',
        quantity: '',
        unitPrice: '',
        expirationDate: '',
        batchNumber: '',
    });

    useEffect(() => {
        loadMedicines();
    }, [filter]);

    const loadMedicines = async () => {
        try {
            let response;
            if (filter === 'low-stock') {
                response = await medicineApi.getLowStockMedicines();
            } else if (filter === 'expired') {
                response = await medicineApi.getExpiredMedicines();
            } else {
                response = await medicineApi.getAllMedicines();
            }
            setMedicines(response.data);
        } catch (error) {
            showToast('Error loading medicines', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await medicineApi.addMedicineToInventory(formData);
            showToast('Medicine added successfully', 'success');
            setShowModal(false);
            resetForm();
            loadMedicines();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async (medicineId, batchNumber) => {
        if (!window.confirm('Are you sure you want to remove this medicine?')) return;

        try {
            await medicineApi.deleteMedicineFromInventory({ medicineId, batchNumber });
            showToast('Medicine removed successfully', 'success');
            loadMedicines();
        } catch (error) {
            showToast('Error removing medicine', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            medicineName: '',
            supplier: '',
            quantity: '',
            unitPrice: '',
            expirationDate: '',
            batchNumber: '',
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
            'In Stock': 'badge-success',
            'Low Stock': 'badge-warning',
            'Expired': 'badge-danger',
        };
        return statusMap[status] || 'badge-secondary';
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <div className="flex justify-between items-center mb-xl">
                <h2>Medicine Inventory</h2>
                <div className="flex gap-md">
                    <select
                        className="form-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="all">All Medicines</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="expired">Expired</option>
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        + Add Medicine
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Medicine Name</th>
                                <th>Supplier</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Batch Number</th>
                                <th>Expiration Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((medicine) => (
                                <tr key={medicine.medicineInventoryId}>
                                    <td>{medicine.medicineName}</td>
                                    <td>{medicine.supplier}</td>
                                    <td>{medicine.quantity}</td>
                                    <td>${medicine.unitPrice}</td>
                                    <td>{medicine.batchNumber}</td>
                                    <td>{new Date(medicine.expirationDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(medicine.status)}`}>
                                            {medicine.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(medicine.medicineInventoryId, medicine.batchNumber)}
                                        >
                                            Remove
                                        </button>
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
                title="Add New Medicine"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Medicine Name</label>
                        <input
                            type="text"
                            name="medicineName"
                            className="form-input"
                            value={formData.medicineName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Supplier</label>
                            <input
                                type="text"
                                name="supplier"
                                className="form-input"
                                value={formData.supplier}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Batch Number</label>
                            <input
                                type="text"
                                name="batchNumber"
                                className="form-input"
                                value={formData.batchNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                className="form-input"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Unit Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="unitPrice"
                                className="form-input"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Expiration Date</label>
                        <input
                            type="date"
                            name="expirationDate"
                            className="form-input"
                            value={formData.expirationDate}
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
                            Add Medicine
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MedicineList;
