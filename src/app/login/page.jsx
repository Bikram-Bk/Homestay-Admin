"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { showToast, errorMessage } from "@/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, isAuthenticated, hydrate } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast.error("Please fill in both email and password.");
      return;
    }

    try {
      await login({ email, password });
      showToast.success("Welcome back, Admin! 🙏");
    } catch (err) {
      showToast.error(errorMessage(err, "Login failed. Please check credentials."));
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-admin-text">
          Homestay Nepal
        </h1>
        <p className="text-xs uppercase tracking-widest font-semibold text-gold mt-1">
          Admin Portal
        </p>
        <p className="text-sm text-admin-muted mt-2">
          Sign in to manage bookings, homestays, and village guides
        </p>
      </div>

      {/* Card Form */}
      <div className="admin-card p-7 shadow-2xl backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label">Admin Email</label>
            <input
              id="admin-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@homestaynepal.com"
              required
              className="admin-input"
            />
          </div>

          <div>
            <label className="admin-label">Password</label>
            <div className="relative">
              <input
                id="admin-login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className="admin-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B796D] hover:text-[#2C1810] p-1.5 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={isLoggingIn}
            className="admin-btn-primary w-full justify-center py-2.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-terracotta/20 cursor-pointer"
          >
            {isLoggingIn ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Authenticating...
              </span>
            ) : (
              "Sign In to Admin"
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-admin-border text-center text-xs text-admin-muted">
          Only authorized staff with role <span className="text-gold font-mono font-semibold">ADMIN</span> can access this dashboard.
        </div>
      </div>
    </div>
  );
}
