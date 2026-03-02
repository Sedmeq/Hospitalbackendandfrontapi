import React, { useEffect, useState } from "react";
import { partnersApi } from "../../api/partnersApi";
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

const PartnersList = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);

  const { showToast, ToastComponent } = useToast();

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const res = await partnersApi.getAllPartners();
      setPartners(res.data ?? []);
    } catch (e) {
      showToast("Error loading partners", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setEditingPartner(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingPartner(p);
    setImageFile(null);
    setShowModal(true);
  };

  const buildFormData = (id) => {
    const fd = new FormData();
    if (id != null) fd.append("Id", String(id)); // UpdatePartnersCommand-də Id varsa
    if (imageFile) fd.append("ImageUrl", imageFile); // CreatePartnersCommand.ImageUrl
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingPartner && !imageFile) {
      showToast("Please select an image", "error");
      return;
    }

    try {
      if (editingPartner) {
        const fd = buildFormData(editingPartner.id);
        await partnersApi.updatePartner(editingPartner.id, fd);
        showToast("Partner updated successfully", "success");
      } else {
        const fd = buildFormData(null);
        await partnersApi.createPartner(fd);
        showToast("Partner created successfully", "success");
      }

      setShowModal(false);
      resetForm();
      loadPartners();
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
    if (!window.confirm("Are you sure you want to delete this partner?")) return;

    try {
      await partnersApi.deletePartner(id);
      showToast("Partner deleted successfully", "success");
      loadPartners();
    } catch (e) {
      showToast("Error deleting partner", "error");
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      {ToastComponent}

      <div className="flex justify-between items-center mb-xl">
        <h2>Partners Management</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Partner
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Logo</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {(partners ?? []).map((p) => {
                // DTO hansı adla qaytarırsa onu yaz:
                // çox vaxt: imageUrl, imagePath, logoPath
                const imgPath = p.imageUrl ?? p.imagePath ?? p.logoPath ?? p.logoUrl;

                return (
                  <tr key={p.id}>
                    <td>
                      {imgPath ? (
                        <img
                          src={buildImgUrl(imgPath)}
                          alt="partner"
                          style={{
                            width: "120px",
                            height: "60px",
                            objectFit: "contain",
                            background: "#fff",
                            borderRadius: "6px",
                            padding: "6px",
                          }}
                        />
                      ) : (
                        <span className="badge badge-secondary">No image</span>
                      )}
                    </td>

                    <td>
                      <div className="flex gap-sm">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {(!partners || partners.length === 0) && (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", padding: "1rem" }}>
                    No partners found
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
        title={editingPartner ? "Edit Partner" : "Add New Partner"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Partner Logo {editingPartner ? "(optional)" : "(required)"}
            </label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              required={!editingPartner}
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
              {editingPartner ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PartnersList;
