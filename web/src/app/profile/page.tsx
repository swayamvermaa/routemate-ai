"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CarFront,
  CheckCircle2,
  Loader2,
  Save,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getCurrentProfile,
  updateCurrentProfile,
  Profile,
} from "@/services/profileService";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [collegeWorkplace, setCollegeWorkplace] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentProfile();

        setProfile(data);

        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setCity(data.city ?? "");
        setCollegeWorkplace(data.college_workplace ?? "");
        setBio(data.bio ?? "");
      } catch (error) {
        console.error(error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);

      const updated = await updateCurrentProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        college_workplace: collegeWorkplace.trim(),
        bio: bio.trim(),
      });

      setProfile(updated);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Loader2 className="animate-spin" size={18} />
          Loading profile...
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <CarFront size={20} />
            </div>

            <div>
              <p className="font-bold text-slate-950">
                RouteMate{" "}
                <span className="text-blue-600">
                  AI
                </span>
              </p>

              <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400">
                Smart Mobility
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>

        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        <div>
          <p className="text-sm font-semibold text-blue-600">
            Your Profile
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Complete your RouteMate profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            A complete profile helps other commuters know who they are
            travelling with.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Profile Header */}
          <div className="border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={28} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {fullName || "RouteMate User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {profile.email}
                </p>
              </div>

            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 p-6 sm:p-8">

            {/* Name + Phone */}
            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>

                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

            </div>

            {/* City + College */}
            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Agra"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="collegeWorkplace"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  College / Workplace
                </label>

                <input
                  id="collegeWorkplace"
                  value={collegeWorkplace}
                  onChange={(e) =>
                    setCollegeWorkplace(e.target.value)
                  }
                  placeholder="Where do you study or work?"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                About you
              </label>

              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={300}
                placeholder="Tell other commuters a little about yourself..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {bio.length}/300
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                <CheckCircle2 size={16} />
                {success}
              </div>
            )}

            {/* Save */}
            <div className="flex justify-end border-t border-slate-100 pt-6">

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save changes
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}