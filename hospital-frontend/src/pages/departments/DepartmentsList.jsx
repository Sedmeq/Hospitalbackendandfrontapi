import React, { useState, useEffect } from 'react';
import { departmentApi } from '../../api/departmentApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const DepartmentsList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const { showToast, ToastComponent } = useToast();
    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await departmentApi.getAllDepartments();
            setDepartments(response.data);
        } catch (error) {
            showToast('Error loading departments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDepartment) {
                await departmentApi.updateDepartment(editingDepartment.id, formData);
                showToast('Department updated successfully', 'success');
            } else {
                await departmentApi.createDepartment(formData);
                showToast('Department created successfully', 'success');
            }
            setShowModal(false);
            resetForm();
            loadDepartments();
        } catch (error) {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleEdit = (department) => {
        setEditingDepartment(department);
        setFormData({ name: department.name });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this department?')) return;

        try {
            await departmentApi.deleteDepartment(id);
            showToast('Department deleted successfully', 'success');
            loadDepartments();
        } catch (error) {
            showToast('Error deleting department', 'error');
        }
    };

    const resetForm = () => {
        setFormData({ name: '' });
        setEditingDepartment(null);
    };

    const handleChange = (e) => {
        setFormData({ name: e.target.value });
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <div className="flex justify-between items-center mb-xl">
                <h2>Departments Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    + Add Department
                </button>
            </div>

            <div className="grid grid-3">
                {departments.map((department) => (
                    <div key={department.id} className="card">
                        <h3>{department.name}</h3>
                        <div className="flex gap-sm mt-md">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleEdit(department)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(department.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                title={editingDepartment ? 'Edit Department' : 'Add New Department'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Department Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Cardiology, Neurology"
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
                            {editingDepartment ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DepartmentsList;
