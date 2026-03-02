// import React, { useMemo, useState } from "react";
// import { authApi } from "../../api/authApi";
// import { useToast } from "../../components/common/Toast";

// const ChangePassword = () =>
// {
//     const { showToast, ToastComponent } = useToast();

//     const [form, setForm] = useState({
//         oldPassword: "",
//         newPassword: "",
//         confirmNewPassword: "",
//     });

//     const [loading, setLoading] = useState(false);

//     const mismatch = useMemo(() =>
//     {
//         return (
//             form.newPassword &&
//             form.confirmNewPassword &&
//             form.newPassword !== form.confirmNewPassword
//         );
//     }, [form.newPassword, form.confirmNewPassword]);

//     const onChange = (e) =>
//     {
//         const { name, value } = e.target;
//         setForm((p) => ({ ...p, [name]: value }));
//     };

//     const validate = () =>
//     {
//         if (!form.oldPassword.trim()) return "Old password is required";
//         if (!form.newPassword.trim()) return "New password is required";
//         if (form.newPassword.length < 6) return "New password must be at least 6 characters";
//         if (form.newPassword !== form.confirmNewPassword) return "New passwords do not match";
//         if (form.oldPassword === form.newPassword) return "New password must be different from old password";
//         return null;
//     };

//     const extractErrorMessage = (error) =>
//     {
//         const data = error?.response?.data;
//         if (!data) return error?.message || "Change password failed";
//         if (typeof data === "string") return data;
//         if (data.message && typeof data.message === "string") return data.message;

//         // ASP.NET validation { errors: { Field: ["msg"] } }
//         if (data.errors && typeof data.errors === "object")
//         {
//             const lines = Object.entries(data.errors).flatMap(([field, msgs]) =>
//                 (Array.isArray(msgs) ? msgs : [String(msgs)]).map((m) => `${field}: ${m}`)
//             );
//             return lines.join("\n");
//         }

//         try
//         {
//             return JSON.stringify(data);
//         } catch
//         {
//             return "Change password failed";
//         }
//     };


//     const onSubmit = async (e) =>
//     {
//         e.preventDefault();

//         const err = validate();
//         if (err)
//         {
//             showToast(err, "error");
//             return;
//         }

//         try
//         {
//             setLoading(true);

//             const res = await authApi.changePassword({
//                 OldPassword: form.oldPassword,
//                 NewPassword: form.newPassword,
//             });

//             if (res.data === true)
//             {
//                 showToast("Password changed successfully", "success");
//                 setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
//             } else
//             {
//                 showToast("Old password is incorrect", "error");
//             }
//         } catch (error)
//         {
//             showToast(extractErrorMessage(error), "error");
//         } finally
//         {
//             setLoading(false);
//         }
//     };


//     return (
//         <div style={{ maxWidth: 520 }}>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Settings</h2>
//             </div>

//             <div className="card" style={{ padding: 16 }}>
//                 <h3 style={{ marginTop: 0 }}>Change Password</h3>

//                 <form onSubmit={onSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">Old Password</label>
//                         <input
//                             type="password"
//                             name="oldPassword"
//                             className="form-input"
//                             value={form.oldPassword}
//                             onChange={onChange}
//                             autoComplete="current-password"
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">New Password</label>
//                         <input
//                             type="password"
//                             name="newPassword"
//                             className="form-input"
//                             value={form.newPassword}
//                             onChange={onChange}
//                             autoComplete="new-password"
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Confirm New Password</label>
//                         <input
//                             type="password"
//                             name="confirmNewPassword"
//                             className="form-input"
//                             value={form.confirmNewPassword}
//                             onChange={onChange}
//                             autoComplete="new-password"
//                             required
//                         />
//                         {mismatch && (
//                             <small style={{ color: "red" }}>New passwords do not match</small>
//                         )}
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button type="submit" className="btn btn-primary" disabled={loading || mismatch}>
//                             {loading ? "Saving..." : "Change Password"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ChangePassword;

















// import React, { useEffect, useMemo, useState } from "react";
// import { authApi } from "../../api/authApi";
// import { patientApi } from "../../api/patientApi";
// import { useToast } from "../../components/common/Toast";

// const BASE_URL = "http://localhost:5151"; // lazım olsa dəyiş

// function splitFullName(fullName)
// {
//     const s = (fullName || "").trim().replace(/\s+/g, " ");
//     if (!s) return { firstName: "", lastName: "" };

//     const parts = s.split(" ");
//     if (parts.length === 1) return { firstName: parts[0], lastName: "" };

//     return {
//         firstName: parts[0],
//         lastName: parts.slice(1).join(" "),
//     };
// }

// const Settings = () =>
// {
//     const { showToast, ToastComponent } = useToast();

//     // =======================
//     // My Profile
//     // =======================
//     const [profileLoading, setProfileLoading] = useState(false);
//     const [profileSaving, setProfileSaving] = useState(false);

//     const [profile, setProfile] = useState({
//         id: 0,
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         dateOfBirth: "",
//         address: "",
//         city: "",
//         gender: "",
//         imageFile: null, // IFormFile üçün
//         removeImage: false,
//         imagePath: "", // göstərmək üçün
//     });

//     const loadProfile = async () =>
//     {
//         try
//         {
//             setProfileLoading(true);

//             const res = await patientApi.getMyProfile();
//             const p = res.data;

//             const { firstName, lastName } = splitFullName(p.fullName);

//             setProfile((prev) => ({
//                 ...prev,
//                 id: p.id ?? 0,
//                 firstName,
//                 lastName,
//                 email: p.email ?? "",
//                 phone: p.phone ?? "",
//                 gender: p.gender ?? "",
//                 dateOfBirth: p.dateOfBirth ? String(p.dateOfBirth).slice(0, 10) : "",
//                 city: p.city ?? "",
//                 address: p.address ?? "",
//                 imagePath: p.imagePath ?? "",
//                 imageFile: null,
//                 removeImage: false,
//             }));
//         } catch (e)
//         {
//             showToast("Failed to load profile", "error");
//         } finally
//         {
//             setProfileLoading(false);
//         }
//     };

//     useEffect(() =>
//     {
//         loadProfile();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const onProfileChange = (e) =>
//     {
//         const { name, value, type, checked } = e.target;

//         if (type === "checkbox")
//         {
//             setProfile((p) => ({ ...p, [name]: checked }));
//             return;
//         }

//         setProfile((p) => ({ ...p, [name]: value }));
//     };

//     const onPickImage = (e) =>
//     {
//         const file = e.target.files?.[0] || null;
//         setProfile((p) => ({
//             ...p,
//             imageFile: file,
//             removeImage: false, // yeni şəkil seçilirsə remove söndür
//         }));
//     };

//     const saveProfile = async (e) =>
//     {
//         e.preventDefault();

//         // basic validation
//         if (!profile.firstName.trim()) return showToast("First name is required", "error");
//         if (!profile.email.trim()) return showToast("Email is required", "error");
//         if (!profile.phone.trim()) return showToast("Phone is required", "error");
//         if (!profile.city.trim()) return showToast("City is required", "error");
//         if (!profile.gender.trim()) return showToast("Gender is required", "error");
//         if (!profile.dateOfBirth) return showToast("Date of birth is required", "error");

//         try
//         {
//             setProfileSaving(true);

//             const fd = new FormData();
//             // UpdateMyProfileCommand böyük ehtimalla UpdatePatientCommand-a oxşardır
//             // Əgər UpdateMyProfileCommand-da Id lazımdırsa göndəririk:
//             fd.append("Id", String(profile.id));

//             fd.append("FirstName", profile.firstName);
//             fd.append("LastName", profile.lastName);
//             fd.append("Email", profile.email);
//             fd.append("Phone", profile.phone);
//             fd.append("DateOfBirth", profile.dateOfBirth); // YYYY-MM-DD
//             fd.append("City", profile.city);
//             fd.append("Gender", profile.gender);

//             if (profile.address) fd.append("Address", profile.address);

//             // Image + RemoveImage
//             fd.append("RemoveImage", String(!!profile.removeImage));
//             if (profile.imageFile) fd.append("Image", profile.imageFile);

//             const res = await patientApi.updateMyProfile(fd);

//             showToast("Profile updated successfully", "success");

//             // server yeni imagePath qaytara bilər → refresh eləyək
//             // (res.data PatientsDto-dur)
//             const updated = res.data;
//             if (updated)
//             {
//                 const { firstName, lastName } = splitFullName(updated.fullName);
//                 setProfile((p) => ({
//                     ...p,
//                     firstName,
//                     lastName,
//                     email: updated.email ?? p.email,
//                     phone: updated.phone ?? p.phone,
//                     gender: updated.gender ?? p.gender,
//                     dateOfBirth: updated.dateOfBirth ? String(updated.dateOfBirth).slice(0, 10) : p.dateOfBirth,
//                     city: updated.city ?? p.city,
//                     address: updated.address ?? p.address,
//                     imagePath: updated.imagePath ?? p.imagePath,
//                     imageFile: null,
//                     removeImage: false,
//                 }));
//             } else
//             {
//                 await loadProfile();
//             }
//         } catch (error)
//         {
//             const data = error?.response?.data;
//             if (typeof data === "string") showToast(data, "error");
//             else if (data?.message) showToast(data.message, "error");
//             else showToast("Profile update failed", "error");
//         } finally
//         {
//             setProfileSaving(false);
//         }
//     };

//     // =======================
//     // Change Password (sənin kodun)
//     // =======================
//     const [form, setForm] = useState({
//         oldPassword: "",
//         newPassword: "",
//         confirmNewPassword: "",
//     });

//     const [loading, setLoading] = useState(false);

//     const mismatch = useMemo(() =>
//     {
//         return (
//             form.newPassword &&
//             form.confirmNewPassword &&
//             form.newPassword !== form.confirmNewPassword
//         );
//     }, [form.newPassword, form.confirmNewPassword]);

//     const onChange = (e) =>
//     {
//         const { name, value } = e.target;
//         setForm((p) => ({ ...p, [name]: value }));
//     };

//     const validate = () =>
//     {
//         if (!form.oldPassword.trim()) return "Old password is required";
//         if (!form.newPassword.trim()) return "New password is required";
//         if (form.newPassword.length < 6) return "New password must be at least 6 characters";
//         if (form.newPassword !== form.confirmNewPassword) return "New passwords do not match";
//         if (form.oldPassword === form.newPassword) return "New password must be different from old password";
//         return null;
//     };

//     const extractErrorMessage = (error) =>
//     {
//         const data = error?.response?.data;
//         if (!data) return error?.message || "Change password failed";
//         if (typeof data === "string") return data;
//         if (data.message && typeof data.message === "string") return data.message;

//         if (data.errors && typeof data.errors === "object")
//         {
//             const lines = Object.entries(data.errors).flatMap(([field, msgs]) =>
//                 (Array.isArray(msgs) ? msgs : [String(msgs)]).map((m) => `${field}: ${m}`)
//             );
//             return lines.join("\n");
//         }

//         try
//         {
//             return JSON.stringify(data);
//         } catch
//         {
//             return "Change password failed";
//         }
//     };

//     const onSubmit = async (e) =>
//     {
//         e.preventDefault();

//         const err = validate();
//         if (err)
//         {
//             showToast(err, "error");
//             return;
//         }

//         try
//         {
//             setLoading(true);

//             const res = await authApi.changePassword({
//                 OldPassword: form.oldPassword,
//                 NewPassword: form.newPassword,
//             });

//             if (res.data === true)
//             {
//                 showToast("Password changed successfully", "success");
//                 setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
//             } else
//             {
//                 showToast("Old password is incorrect", "error");
//             }
//         } catch (error)
//         {
//             showToast(extractErrorMessage(error), "error");
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     // =======================
//     // UI
//     // =======================
//     const imageUrl = profile.imagePath ? `${BASE_URL}/${profile.imagePath.replace(/^\//, "")}` : "";

//     return (
//         <div style={{ maxWidth: 820 }}>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Settings</h2>
//             </div>

//             {/* ===== My Profile ===== */}
//             <div className="card" style={{ padding: 16, marginBottom: 16 }}>
//                 <div className="flex justify-between items-center">
//                     <h3 style={{ marginTop: 0 }}>My Profile</h3>
//                     <button type="button" className="btn" onClick={loadProfile} disabled={profileLoading}>
//                         {profileLoading ? "Loading..." : "Refresh"}
//                     </button>
//                 </div>

//                 <form onSubmit={saveProfile}>
//                     {imageUrl && !profile.removeImage && (
//                         <div style={{ marginBottom: 12 }}>
//                             <img
//                                 src={imageUrl}
//                                 alt="profile"
//                                 style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover" }}
//                             />
//                         </div>
//                     )}

//                     <div className="form-group">
//                         <label className="form-label">Profile image</label>
//                         <input type="file" accept="image/*" onChange={onPickImage} />
//                         <div style={{ marginTop: 8 }}>
//                             <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                                 <input
//                                     type="checkbox"
//                                     name="removeImage"
//                                     checked={profile.removeImage}
//                                     onChange={onProfileChange}
//                                     disabled={!profile.imagePath && !profile.imageFile}
//                                 />
//                                 Remove current image
//                             </label>
//                         </div>
//                     </div>

//                     <div
//                         style={{
//                             display: "grid",
//                             gridTemplateColumns: "1fr 1fr",
//                             gap: 12,
//                         }}
//                     >
//                         <div className="form-group">
//                             <label className="form-label">First Name</label>
//                             <input className="form-input" name="firstName" value={profile.firstName} onChange={onProfileChange} />
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Last Name</label>
//                             <input className="form-input" name="lastName" value={profile.lastName} onChange={onProfileChange} />
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Email</label>
//                             <input className="form-input" name="email" value={profile.email} onChange={onProfileChange} />
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Phone</label>
//                             <input className="form-input" name="phone" value={profile.phone} onChange={onProfileChange} />
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Gender</label>
//                             <select className="form-input" name="gender" value={profile.gender} onChange={onProfileChange}>
//                                 <option value="">Select</option>
//                                 <option value="Male">Male</option>
//                                 <option value="Female">Female</option>
//                             </select>
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Date of Birth</label>
//                             <input
//                                 type="date"
//                                 className="form-input"
//                                 name="dateOfBirth"
//                                 value={profile.dateOfBirth}
//                                 onChange={onProfileChange}
//                             />
//                         </div>

//                         <div className="form-group" style={{ gridColumn: "1 / -1" }}>
//                             <label className="form-label">City</label>
//                             <input className="form-input" name="city" value={profile.city} onChange={onProfileChange} />
//                         </div>

//                         <div className="form-group" style={{ gridColumn: "1 / -1" }}>
//                             <label className="form-label">Address</label>
//                             <input className="form-input" name="address" value={profile.address} onChange={onProfileChange} />
//                         </div>
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button type="submit" className="btn btn-primary" disabled={profileSaving}>
//                             {profileSaving ? "Saving..." : "Save Profile"}
//                         </button>
//                     </div>
//                 </form>
//             </div>

//             {/* ===== Change Password ===== */}
//             <div className="card" style={{ padding: 16 }}>
//                 <h3 style={{ marginTop: 0 }}>Change Password</h3>

//                 <form onSubmit={onSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">Old Password</label>
//                         <input
//                             type="password"
//                             name="oldPassword"
//                             className="form-input"
//                             value={form.oldPassword}
//                             onChange={onChange}
//                             autoComplete="current-password"
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">New Password</label>
//                         <input
//                             type="password"
//                             name="newPassword"
//                             className="form-input"
//                             value={form.newPassword}
//                             onChange={onChange}
//                             autoComplete="new-password"
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Confirm New Password</label>
//                         <input
//                             type="password"
//                             name="confirmNewPassword"
//                             className="form-input"
//                             value={form.confirmNewPassword}
//                             onChange={onChange}
//                             autoComplete="new-password"
//                             required
//                         />
//                         {mismatch && <small style={{ color: "red" }}>New passwords do not match</small>}
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button type="submit" className="btn btn-primary" disabled={loading || mismatch}>
//                             {loading ? "Saving..." : "Change Password"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Settings;