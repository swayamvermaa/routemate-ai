"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div>
        <p className="text-sm font-semibold text-blue-600">
          Welcome back to RouteMate
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950">
          Sign in to your account
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Continue your smarter everyday commute.
        </p>
      </div>

      {/* Google */}
      <button
        type="button"
        disabled
        className="mt-8 flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-400 shadow-sm"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-sm font-bold">
          G
        </span>

        Continue with Google
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-[10px] font-semibold tracking-wider text-slate-400">
          OR CONTINUE WITH EMAIL
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}

          {!loading && (
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-blue-600 transition hover:text-blue-700"
        >
          Create account
        </Link>
      </p>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
        <CheckCircle2 size={13} />
        Your information is protected
      </div>
    </div>
  );
}