import React, { useEffect, useMemo, useState } from "react";
import { contactInfoApi } from "../../api/contactInfoApi";
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

const ContactInfoList = () => {
  const [items, setItems] = useState([]);
  const [activeInfo, setActiveInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { showToast, ToastComponent } = useToast();

  const [formState, setFormState] = useState({
    email: "",
    address: "",
    phoneNumber: "",
    time: "",
    logoFile: null,
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [allRes, activeRes] = await Promise.allSettled([
        contactInfoApi.getAll(),
        contactInfoApi.getActive(),
      ]);

      if (allRes.status === "fulfilled") setItems(allRes.value.data ?? []);
      else showToast("Error loading contact infos", "error");

      if (activeRes.status === "fulfilled") setActiveInfo(activeRes.value.data ?? null);
      else setActiveInfo(null); // active tapılmayanda 404 ola bilər
    } catch {
      showToast("Error loading contact infos", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormState({
      email: "",
      address: "",
      phoneNumber: "",
      time: "",
      logoFile: null,
    });
    setEditingItem(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormState({
      email: item.email ?? "",
      address: item.address ?? "",
      phoneNumber: item.phoneNumber ?? "",
      time: item.time ?? "",
      logoFile: null, // yeni logo seçməsə, köhnə qalacaq
    });
    setShowModal(true);
  };

  const buildFormData = (id) => {
    const fd = new FormData();
    if (id) fd.append("Id", id);

    // Backend DTO property-lərinə uyğun göndəririk
    fd.append("Email", formState.email);
    fd.append("Address", formState.address);
    fd.append("PhoneNumber", formState.phoneNumber);
    fd.append("Time", formState.time);

    if (formState.logoFile) {
      // DTO-da logo property adı necədirsə ona görə:
      // Çox vaxt IFormFile Logo olur. Səndə JSON-da "logo" çıxır.
      // Ona görə "Logo" göndəririk (ən standart).
      fd.append("Logo", formState.logoFile);
    }

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        const fd = buildFormData(editingItem.id);
        await contactInfoApi.update(editingItem.id, fd);
        showToast("Updated successfully", "success");
      } else {
        const fd = buildFormData(null);
        await contactInfoApi.create(fd);
        showToast("Created successfully", "success");
      }

      setShowModal(false);
      resetForm();
      loadAll();
    } catch (error) {
      const msg =
        error?.response?.data ||
        error?.response?.data?.message ||
        "Operation failed";
      showToast(msg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact info?")) return;

    try {
      await contactInfoApi.remove(id);
      showToast("Deleted successfully", "success");
      loadAll();
    } catch {
      showToast("Error deleting", "error");
    }
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }, [items]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      {ToastComponent}

      <div className="flex justify-between items-center mb-xl">
        <h2>Contact Info Management</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Contact Info
        </button>
      </div>

      {/* Active info preview (əgər endpoint qaytarırsa) */}
      {activeInfo && (
        <div className="card" style={{ padding: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {activeInfo.logo && (
              <img
                src={buildImgUrl(activeInfo.logo)}
                alt="logo"
                style={{ width: 56, height: 56, objectFit: "contain" }}
              />
            )}
            <div>
              <div><b>Active:</b> #{activeInfo.id}</div>
              <div style={{ opacity: 0.9 }}>
                {activeInfo.email} • {activeInfo.phoneNumber} • {activeInfo.time}
              </div>
              <div style={{ opacity: 0.9 }}>{activeInfo.address}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Logo</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Time</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedItems.map((x) => (
                <tr key={x.id}>
                  <td>
                    {x.logo ? (
                      <img
                        src={buildImgUrl(x.logo)}
                        alt="logo"
                        style={{ width: 60, height: 40, objectFit: "contain" }}
                      />
                    ) : (
                      "No Logo"
                    )}
                  </td>
                  <td>{x.email}</td>
                  <td style={{ maxWidth: 260 }}>
                    {x.address?.length > 60 ? x.address.slice(0, 60) + "..." : x.address}
                  </td>
                  <td>{x.phoneNumber}</td>
                  <td>{x.time}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => openEdit(x)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(x.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {sortedItems.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 16, textAlign: "center" }}>
                    No contact info records found.
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
        title={editingItem ? `Edit Contact Info #${editingItem.id}` : "Add Contact Info"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={formState.address}
              onChange={(e) => setFormState({ ...formState, address: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              value={formState.phoneNumber}
              onChange={(e) =>
                setFormState({ ...formState, phoneNumber: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time</label>
            <input
              type="text"
              className="form-input"
              placeholder="09:00 - 22:00"
              value={formState.time}
              onChange={(e) => setFormState({ ...formState, time: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Logo (optional){editingItem ? " — seçməsən köhnə logo qalacaq" : ""}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormState({ ...formState, logoFile: e.target.files?.[0] ?? null })
              }
            />
            {editingItem?.logo && !formState.logoFile && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
                  Current logo:
                </div>
                <img
                  src={buildImgUrl(editingItem.logo)}
                  alt="current logo"
                  style={{ width: 120, height: 60, objectFit: "contain" }}
                />
              </div>
            )}
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
              {editingItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContactInfoList;
