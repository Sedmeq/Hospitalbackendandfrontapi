import React, { useState, useEffect } from 'react';
import { departmentApi } from '../../api/departmentApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const API_BASE = "http://localhost:5151";

const getImageUrl = (path) =>
{
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `${API_BASE}${path}`;
    return `${API_BASE}/${path}`;
};


const DepartmentsList = () =>
{
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const { showToast, ToastComponent } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        servicesText: '', // "Cardio checkup, ECG, ..."
        image: null, // File
    });

    useEffect(() =>
    {
        loadDepartments();
    }, []);

    const loadDepartments = async () =>
    {
        try
        {
            const response = await departmentApi.getAllDepartments();
            setDepartments(response.data);
        } catch (error)
        {
            showToast('Error loading departments', 'error');
        } finally
        {
            setLoading(false);
        }
    };

    const resetForm = () =>
    {
        setFormData({
            name: '',
            description: '',
            shortDescription: '',
            servicesText: '',
            image: null,
        });
        setEditingDepartment(null);
    };

    const openCreateModal = () =>
    {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (department) =>
    {
        setEditingDepartment(department);

        // NOTE: API-nin qaytardığı field adlarına görə düzəlt (məs: shortDescription və ya ShortDescription)
        const name = department.name ?? department.Name ?? '';
        const description = department.description ?? department.Description ?? '';
        const shortDescription = department.shortDescription ?? department.ShortDescription ?? '';

        // Services backdan array gələ bilər; stringə çeviririk
        const servicesArr = department.services ?? department.Services ?? [];
        const servicesText = Array.isArray(servicesArr) ? servicesArr.join(', ') : (servicesArr || '');

        setFormData({
            name,
            description,
            shortDescription,
            servicesText,
            image: null, // editdə yeni file seçməsə null qalsın
        });

        setShowModal(true);
    };

    const handleDelete = async (id) =>
    {
        if (!window.confirm('Are you sure you want to delete this department?')) return;

        try
        {
            await departmentApi.deleteDepartment(id);
            showToast('Department deleted successfully', 'success');
            loadDepartments();
        } catch (error)
        {
            showToast('Error deleting department', 'error');
        }
    };

    const buildMultipartFormData = () =>
    {
        const fd = new FormData();

        // Backend: CreateDepartmentCommand: Name, Description, ShortDescription, Services (List<string>), Image
        // Key-lər property adları ilə uyğun olsun:
        fd.append('Name', formData.name);
        fd.append('Description', formData.description || '');
        fd.append('ShortDescription', formData.shortDescription || '');

        // Services: comma-separated -> array
        const services = (formData.servicesText || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        // ASP.NET binder List<string> üçün: Services=... (təkrar-təkrar)
        services.forEach((s) => fd.append('Services', s));

        if (formData.image)
        {
            fd.append('Image', formData.image);
        }

        // Update üçün command.Id tələb olunur
        if (editingDepartment?.id != null)
        {
            fd.append('Id', String(editingDepartment.id));
        }

        return fd;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        try
        {
            const multipart = buildMultipartFormData();

            if (editingDepartment)
            {
                await departmentApi.updateDepartment(editingDepartment.id, multipart);
                showToast('Department updated successfully', 'success');
            } else
            {
                await departmentApi.createDepartment(multipart);
                showToast('Department created successfully', 'success');
            }

            setShowModal(false);
            resetForm();
            loadDepartments();
        } catch (error)
        {
            showToast(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleChange = (e) =>
    {
        const { name, value, files, type } = e.target;

        if (type === 'file')
        {
            setFormData((prev) => ({ ...prev, [name]: files?.[0] ?? null }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>Departments Management</h2>

                <button className="btn btn-primary" onClick={openCreateModal}>
                    + Add Department
                </button>
            </div>

            <div className="grid grid-3">
                {departments.map((department) => (
                    <div key={department.id} className="card">

                        {/* IMAGE */}
                        {department.imagePath && (
                            <img
                                src={getImageUrl(department.imagePath)}
                                alt={department.name}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginBottom: "10px"
                                }}
                            />
                        )}

                        {/* NAME */}
                        <h3>{department.name}</h3>

                        {/* SHORT DESCRIPTION */}
                        <p style={{ fontWeight: "500", marginTop: "5px" }}>
                            {department.shortDescription}
                        </p>

                        {/* FULL DESCRIPTION */}
                        <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                            {department.description}
                        </p>

                        {/* SERVICES */}
                        {department.services && department.services.length > 0 && (
                            <div style={{ marginTop: "10px" }}>
                                <strong>Services:</strong>
                                <ul style={{ paddingLeft: "18px", marginTop: "5px" }}>
                                    {department.services.map((service, index) => (
                                        <li key={index}>{service}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

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
                onClose={() =>
                {
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

                    <div className="form-group mt-md">
                        <label className="form-label">Short Description</label>
                        <input
                            type="text"
                            name="shortDescription"
                            className="form-input"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            placeholder="e.g., Heart-related diagnosis and treatment"
                        />
                    </div>

                    <div className="form-group mt-md">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Full description..."
                        />
                    </div>

                    <div className="form-group mt-md">
                        <label className="form-label">Services (comma separated)</label>
                        <input
                            type="text"
                            name="servicesText"
                            className="form-input"
                            value={formData.servicesText}
                            onChange={handleChange}
                            placeholder="e.g., ECG, Echo, Stress test"
                        />
                    </div>

                    <div className="form-group mt-md">
                        <label className="form-label">Image</label>
                        <input
                            type="file"
                            name="image"
                            className="form-input"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {editingDepartment && (
                            <small className="text-muted">
                                Şəkil seçməsən, əvvəlki şəkil qalmalıdır (back tərəfdə necə yazmısansa).
                            </small>
                        )}
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
                            {editingDepartment ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DepartmentsList;
