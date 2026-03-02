import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "../../components/common/Toast";

const BASE_URL = "http://localhost:5151";

function splitFullName(fullName) {
  const s = (fullName || "").trim().replace(/\s+/g, " ");
  if (!s) return { firstName: "", lastName: "" };
  const parts = s.split(" ");
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export default function ProfileForm({
  title = "My Profile",
  mode, // "patient" | "doctor"
  api,  // { getMyProfile, updateMyProfile }
}) {
  const { showToast, ToastComponent } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // patient
    dateOfBirth: "",
    address: "",
    city: "",
    gender: "",

    // doctor
    specialty: "",
    biography: "",

    // image
    imageFile: null,
    removeImage: false,
    imagePath: "",
  });

  const imageUrl = useMemo(() => {
    if (!profile.imagePath || profile.removeImage) return "";
    return `${BASE_URL}/${String(profile.imagePath).replace(/^\//, "")}`;
  }, [profile.imagePath, profile.removeImage]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getMyProfile();
      const dto = res.data;

      const { firstName, lastName } = splitFullName(dto.fullName);

      setProfile((p) => ({
        ...p,
        id: dto.id ?? 0,
        firstName,
        lastName,
        email: dto.email ?? "",
        phone: dto.phone ?? "",

        // patient
        dateOfBirth: dto.dateOfBirth ? String(dto.dateOfBirth).slice(0, 10) : "",
        address: dto.address ?? "",
        city: dto.city ?? "",
        gender: dto.gender ?? "",

        // doctor
        specialty: dto.specialty ?? "",
        biography: dto.biography ?? "",

        imagePath: dto.imagePath ?? "",
        imageFile: null,
        removeImage: false,
      }));
    } catch {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setProfile((p) => ({ ...p, [name]: checked }));
      return;
    }

    setProfile((p) => ({ ...p, [name]: value }));
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0] || null;
    setProfile((p) => ({
      ...p,
      imageFile: file,
      removeImage: false,
    }));
  };

  const validate = () => {
    if (!profile.firstName.trim()) return "First name is required";
    if (!profile.phone.trim()) return "Phone is required";

    if (mode === "patient") {
      if (!profile.email.trim()) return "Email is required";
      if (!profile.city.trim()) return "City is required";
      if (!profile.gender.trim()) return "Gender is required";
      if (!profile.dateOfBirth) return "Date of birth is required";
    }

    if (mode === "doctor") {
      if (!profile.specialty.trim()) return "Specialty is required";
    }

    return null;
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return showToast(err, "error");

    try {
      setSaving(true);

      const fd = new FormData();

      // Doctor UpdateMyDoctorProfileCommand-da Id yoxdur → göndərməyə ehtiyac yoxdu
      // Patient UpdateMyProfileCommand-da da Id yoxdur → göndərməyə ehtiyac yoxdu
      // Amma göndərsən belə binder ignore edə bilər. İstəsən kommentdə saxla.
      // fd.append("Id", String(profile.id));

      fd.append("FirstName", profile.firstName);
      fd.append("LastName", profile.lastName);
      fd.append("Phone", profile.phone);

      if (mode === "patient") {
        // Patient command-da Email YOXDUR, DTO-da var. Sən UI-da email göstərürsən, amma update göndərməyək.
        // Əgər patient email-i update etmək istəyirsənsə → backend command-a Email əlavə etməlisən.
        // fd.append("Email", profile.email); // ❌ backend-də yoxdur

        fd.append("DateOfBirth", profile.dateOfBirth); // YYYY-MM-DD
        fd.append("City", profile.city);
        fd.append("Gender", profile.gender);
        if (profile.address) fd.append("Address", profile.address);
      }

      if (mode === "doctor") {
        fd.append("Specialty", profile.specialty);
        fd.append("Biography", profile.biography || "");
      }

      fd.append("RemoveImage", String(!!profile.removeImage));
      if (profile.imageFile) fd.append("Image", profile.imageFile);

      const res = await api.updateMyProfile(fd);
      const updated = res.data;

      showToast("Profile updated successfully", "success");

      // response DTO-dan state yenilə
      if (updated) {
        const { firstName, lastName } = splitFullName(updated.fullName);
        setProfile((p) => ({
          ...p,
          firstName,
          lastName,
          email: updated.email ?? p.email,
          phone: updated.phone ?? p.phone,

          dateOfBirth: updated.dateOfBirth ? String(updated.dateOfBirth).slice(0, 10) : p.dateOfBirth,
          address: updated.address ?? p.address,
          city: updated.city ?? p.city,
          gender: updated.gender ?? p.gender,

          specialty: updated.specialty ?? p.specialty,
          biography: updated.biography ?? p.biography,

          imagePath: updated.imagePath ?? p.imagePath,
          imageFile: null,
          removeImage: false,
        }));
      } else {
        await loadProfile();
      }
    } catch (error) {
      const data = error?.response?.data;
      if (typeof data === "string") showToast(data, "error");
      else if (data?.message) showToast(data.message, "error");
      else showToast("Profile update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 820 }}>
      {ToastComponent}

      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="flex justify-between items-center">
          <h3 style={{ marginTop: 0 }}>{title}</h3>
          <button type="button" className="btn" onClick={loadProfile} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <form onSubmit={saveProfile}>
          {imageUrl && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={imageUrl}
                alt="profile"
                style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Profile image</label>
            <input type="file" accept="image/*" onChange={onPickImage} />
            <div style={{ marginTop: 8 }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="removeImage"
                  checked={profile.removeImage}
                  onChange={onChange}
                  disabled={!profile.imagePath && !profile.imageFile}
                />
                Remove current image
              </label>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" name="firstName" value={profile.firstName} onChange={onChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" name="lastName" value={profile.lastName} onChange={onChange} />
            </div>

            {/* Email: backend update command-larında yoxdur → göstər, amma disable et */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" value={profile.email} onChange={onChange} disabled />
              <small style={{ opacity: 0.6 }}>
                Email dəyişmək üçün ayrıca endpoint lazımdır.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={profile.phone} onChange={onChange} />
            </div>

            {mode === "patient" && (
              <>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-input" name="gender" value={profile.gender} onChange={onChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={onChange}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">City</label>
                  <input className="form-input" name="city" value={profile.city} onChange={onChange} />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Address</label>
                  <input className="form-input" name="address" value={profile.address} onChange={onChange} />
                </div>
              </>
            )}

            {mode === "doctor" && (
              <>
                <div className="form-group">
                  <label className="form-label">Specialty</label>
                  <input className="form-input" name="specialty" value={profile.specialty} onChange={onChange} />
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Biography</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    name="biography"
                    value={profile.biography}
                    onChange={onChange}
                    placeholder="Write a short bio..."
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-md justify-between mt-lg">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}