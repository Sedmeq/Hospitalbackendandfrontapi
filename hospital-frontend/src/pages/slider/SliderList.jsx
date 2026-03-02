import React, { useEffect, useState } from "react";
import { sliderApi } from "../../api/sliderApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";

const API_ORIGIN = "http://localhost:5151";

const buildImgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const fixed = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${fixed}`;
};

const SliderList = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);

  const { showToast, ToastComponent } = useToast();

  const [formState, setFormState] = useState({
    subtitle: "",
    title: "",
    description: "",
    imageFile: null,
  });

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      const res = await sliderApi.getAllSliders();
      setSliders(res.data ?? []);
    } catch (e) {
      showToast("Error loading sliders", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormState({
      subtitle: "",
      title: "",
      description: "",
      imageFile: null,
    });
    setEditingSlider(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditingSlider(s);
    setFormState({
      subtitle: s?.subtitle ?? "",
      title: s?.title ?? "",
      description: s?.description ?? "",
      imageFile: null, // yeni file seçməsə köhnə qalacaq (backend logic-dən asılı)
    });
    setShowModal(true);
  };

  const buildFormData = (id) => {
    const fd = new FormData();

    // Update üçün MÜTLƏQ Id göndər
    if (id != null) fd.append("Id", String(id));

    // CreateSliderCommand property adları
    fd.append("Subtitle", formState.subtitle ?? "");
    fd.append("Title", formState.title ?? "");
    fd.append("Description", formState.description ?? "");

    if (formState.imageFile) {
      fd.append("ImageUrl", formState.imageFile); // IFormFile? ImageUrl
    }

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSlider) {
        const fd = buildFormData(editingSlider.id);
        await sliderApi.updateSlider(editingSlider.id, fd);
        showToast("Slider updated successfully", "success");
      } else {
        const fd = buildFormData(null);
        await sliderApi.createSlider(fd);
        showToast("Slider created successfully", "success");
      }

      setShowModal(false);
      resetForm();
      loadSliders();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "string" ? error.response.data : null) ||
        error?.message ||
        "Operation failed";
      showToast(msg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;

    try {
      await sliderApi.deleteSlider(id);
      showToast("Slider deleted successfully", "success");
      loadSliders();
    } catch (e) {
      showToast("Error deleting slider", "error");
    }
  };

  const handleChange = (e) => {
    setFormState((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFormState((p) => ({ ...p, imageFile: file }));
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      {ToastComponent}

      <div className="flex justify-between items-center mb-xl">
        <h2>Slider Management</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Slider
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Subtitle</th>
                <th>Title</th>
                <th>Description</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(sliders ?? []).map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.imageUrl ? (
                      <img
                        src={buildImgUrl(s.imageUrl)}
                        alt={s.title}
                        style={{
                          width: "80px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <span className="badge badge-secondary">No image</span>
                    )}
                  </td>

                  <td>{s.subtitle}</td>
                  <td>{s.title}</td>
                  <td style={{ maxWidth: 420 }}>
                    {s.description?.length > 100
                      ? s.description.slice(0, 100) + "..."
                      : s.description}
                  </td>

                  <td>
                    <div className="flex gap-sm">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {(!sliders || sliders.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                    No sliders found
                  </td>
                </tr>
              )}
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
        title={editingSlider ? "Edit Slider" : "Add New Slider"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              className="form-input"
              value={formState.subtitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formState.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input"
              rows={5}
              value={formState.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Image (optional){editingSlider ? " — seçməsən köhnə şəkil qalacaq" : ""}
            </label>
            <input type="file" onChange={handleFileChange} />
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
              {editingSlider ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SliderList;
