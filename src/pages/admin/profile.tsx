import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, AlertCircle, Mail, AtSign, Phone, BadgeCheck, CalendarDays, Pencil, Save, X, Trash2, User as UserIcon } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ACCEPTED_IMAGE_TYPES, uploadImageFile } from "@/lib/admin-upload";
import { PROFILE_LIMITS, normalizeUsername, validateProfile, type ProfileErrors } from "@/lib/profile-input";

interface Profile {
  id: string;
  name: string;
  email: string;
  username: string | null;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
  role: { name: string; description?: string | null };
}

interface FormState {
  name: string;
  username: string;
  phone: string;
  avatarUrl: string;
}

const INPUT =
  "w-full bg-gray-900 border rounded-xl px-3.5 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#a855f7]";

const toForm = (p: Profile): FormState => ({
  name: p.name,
  username: p.username || "",
  phone: p.phone || "",
  avatarUrl: p.avatarUrl || "",
});

function Avatar({ url, name, className }: { url?: string | null; name: string; className: string }) {
  return url ? (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={url} alt={`${name} profile picture`} className={`${className} object-cover`} />
  ) : (
    <div className={`${className} bg-linear-to-tr from-[#7c3aed] to-[#4f8bff] text-white flex items-center justify-center font-bold`} aria-hidden="true">
      {name.trim().charAt(0).toUpperCase() || "A"}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0B0F17] border border-gray-800/80">
      <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/15 border border-[#a855f7]/25 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#a855f7]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-intel">{label}</p>
        <p className="text-sm text-white mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", username: "", phone: "", avatarUrl: "" });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/v1/profile")
      .then((r) => r.json())
      .then((res) => {
        if (!alive) return;
        if (res.success) setProfile(res.data);
        else setLoadError(res.error || "Failed to load profile");
      })
      .catch(() => alive && setLoadError("Failed to load profile"));
    return () => {
      alive = false;
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const startEdit = () => {
    if (!profile) return;
    setForm(toForm(profile));
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const setField = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file, { optimize: true, maxWidth: 400 });
      setField("avatarUrl", url);
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateProfile(form);
    if (Object.keys(found).length) {
      setErrors(found);
      notify("error", "Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, username: normalizeUsername(form.username) }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setProfile(data.data);
        setEditing(false);
        setErrors({});
        notify("success", "Profile updated successfully.");
        // Refresh the sidebar user card right away
        window.dispatchEvent(
          new CustomEvent("cc-profile-updated", {
            detail: { name: data.data.name, avatarUrl: data.data.avatarUrl, username: data.data.username, phone: data.data.phone },
          })
        );
      } else {
        if (data.fields) setErrors(data.fields);
        notify("error", data.error || "Failed to update profile.");
      }
    } catch {
      notify("error", "Network error while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (key: keyof FormState) => `${INPUT} ${errors[key] ? "border-red-500/60" : "border-gray-800"}`;

  return (
    <AdminLayout title="My Profile">
      <div className="w-full mx-auto space-y-6 font-intel">
        {loadError && (
          <p role="alert" className="px-4 py-3 rounded-xl text-xs border bg-red-500/10 border-red-500/30 text-red-300">{loadError}</p>
        )}

        {!profile && !loadError && <div className="p-12 text-center text-xs text-gray-500">Loading profile...</div>}

        {profile && (
          <>
            {/* Header card */}
            <section className="bg-[#0e0e12] border border-white/10 rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8" aria-labelledby="profile-heading">
              <div className="relative shrink-0 self-start">
                <Avatar url={editing ? form.avatarUrl : profile.avatarUrl} name={editing ? form.name || profile.name : profile.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full text-3xl border-2 border-[#a855f7]/40 shadow-[0_0_30px_rgba(124,58,237,0.25)]" />
                {editing && (
                  <>
                    <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={handleAvatar} className="sr-only" id="avatar-file" aria-label="Upload profile picture" />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      aria-label="Change profile picture"
                      className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white flex items-center justify-center border-2 border-[#0e0e12] disabled:opacity-60 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 id="profile-heading" className="text-xl sm:text-2xl font-bold text-white font-manrope break-words">{profile.name}</h3>
                <p className="text-xs text-[#a855f7] font-semibold mt-1 inline-flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> {profile.role.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 break-all">{profile.email}</p>
                {editing && (
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px]">
                    <span className="text-gray-500">{uploading ? "Uploading..." : "JPG, PNG, WEBP or AVIF. Resized automatically."}</span>
                    {form.avatarUrl && (
                      <button type="button" onClick={() => setField("avatarUrl", "")} className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 cursor-pointer">
                        <Trash2 className="w-3 h-3" aria-hidden="true" /> Remove picture
                      </button>
                    )}
                  </div>
                )}
                {errors.avatarUrl && <p className="text-[11px] text-red-400 mt-1" role="alert">{errors.avatarUrl}</p>}
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold hover:opacity-90 shadow-[0_0_20px_rgba(124,58,237,0.3)] cursor-pointer"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" /> Edit Profile
                </button>
              )}
            </section>

            {editing ? (
              <form onSubmit={handleSave} noValidate className="bg-[#0e0e12] border border-white/10 rounded-3xl p-5 sm:p-8 space-y-5" aria-label="Edit profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="pf-name" className="text-xs font-semibold text-gray-300">Full Name <span className="text-red-400">*</span></label>
                    <input id="pf-name" type="text" value={form.name} onChange={(e) => setField("name", e.target.value)} maxLength={PROFILE_LIMITS.name} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "pf-name-err" : undefined} className={fieldClass("name")} />
                    {errors.name && <p id="pf-name-err" className="text-[11px] text-red-400" role="alert">{errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pf-username" className="text-xs font-semibold text-gray-300">Username</label>
                    <input id="pf-username" type="text" value={form.username} onChange={(e) => setField("username", e.target.value)} maxLength={PROFILE_LIMITS.username} autoComplete="username" placeholder="e.g. john.doe" aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? "pf-username-err" : undefined} className={fieldClass("username")} />
                    {errors.username ? (
                      <p id="pf-username-err" className="text-[11px] text-red-400" role="alert">{errors.username}</p>
                    ) : (
                      <p className="text-[11px] text-gray-500">3-30 characters: letters, numbers, . - _</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pf-phone" className="text-xs font-semibold text-gray-300">Mobile Number</label>
                    <input id="pf-phone" type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} maxLength={PROFILE_LIMITS.phone} autoComplete="tel" placeholder="+91 98765 43210" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "pf-phone-err" : undefined} className={fieldClass("phone")} />
                    {errors.phone && <p id="pf-phone-err" className="text-[11px] text-red-400" role="alert">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pf-email" className="text-xs font-semibold text-gray-300">Email Address</label>
                    <input id="pf-email" type="email" value={profile.email} readOnly disabled className={`${INPUT} border-gray-800 opacity-60 cursor-not-allowed`} />
                    <p className="text-[11px] text-gray-500">Email can only be changed by an administrator with user management access.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pf-role" className="text-xs font-semibold text-gray-300">Designation / Role</label>
                    <input id="pf-role" type="text" value={profile.role.name} readOnly disabled className={`${INPUT} border-gray-800 opacity-60 cursor-not-allowed`} />
                    <p className="text-[11px] text-gray-500">Roles are managed under User Roles &amp; RBAC.</p>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={cancelEdit} disabled={saving} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#14141a] border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-60 cursor-pointer">
                    <X className="w-4 h-4" aria-hidden="true" /> Cancel
                  </button>
                  <button type="submit" disabled={saving || uploading} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold hover:opacity-90 disabled:opacity-60 cursor-pointer">
                    <Save className="w-4 h-4" aria-hidden="true" /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Account details">
                <InfoRow icon={UserIcon} label="Full Name" value={profile.name} />
                <InfoRow icon={Mail} label="Email Address" value={profile.email} />
                <InfoRow icon={AtSign} label="Username" value={profile.username ? `@${profile.username}` : <span className="text-gray-500">Not set</span>} />
                <InfoRow icon={Phone} label="Mobile Number" value={profile.phone || <span className="text-gray-500">Not set</span>} />
                <InfoRow icon={BadgeCheck} label="Designation / Role" value={profile.role.name} />
                <InfoRow
                  icon={CalendarDays}
                  label="Account Created"
                  value={new Date(profile.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                />
              </section>
            )}
          </>
        )}
      </div>

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed top-6 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#0e0e12]/95 border backdrop-blur-xl text-white font-intel ${
            toast.type === "success" ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)]" : "border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.25)]"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />}
          <p className="text-xs">{toast.text}</p>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification" className="p-1 text-gray-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
