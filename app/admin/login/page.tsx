"use client";

import React, { useActionState, useState } from "react";
import { loginAction } from "./actions";
import { FiLock, FiMail, FiEye, FiEyeOff, FiTerminal, FiArrowRight, FiShield } from "react-icons/fi";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-zinc-100 p-4 relative overflow-hidden selection:bg-zinc-800 selection:text-white">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Icon Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl border border-white/20 bg-white/5 p-1 shadow-2xl backdrop-blur-xl mb-4 group transition-transform hover:scale-105">
            <div className="h-full w-full bg-zinc-900/90 rounded-[12px] flex items-center justify-center border border-white/10">
              <FiTerminal className="h-6 w-6 text-zinc-100" />
            </div>
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-zinc-50 flex items-center gap-2">
            Admin Studio
            <span className="px-2 py-0.5 text-xs font-mono font-normal rounded bg-white/10 text-zinc-400 border border-white/10">
              CMS
            </span>
          </h1>
          <p className="text-sm text-zinc-400 font-mono mt-1">
            Authenticate to access portfolio control system
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <form action={formAction} className="space-y-5">
            {/* Error Message */}
            {state?.error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-mono flex items-center gap-2.5">
                <FiShield className="h-4 w-4 shrink-0 text-red-400" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold"
              >
                Admin Email
              </label>
              <div className="relative rounded-xl border border-white/10 bg-white/5 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <FiMail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@blankxd.site"
                  autoComplete="email"
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold"
                >
                  Admin Password
                </label>
              </div>
              <div className="relative rounded-xl border border-white/10 bg-white/5 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <FiLock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full bg-transparent pl-10 pr-10 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-semibold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <FiArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Badge Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs font-mono text-zinc-600 flex items-center justify-center gap-1.5">
            <FiShield className="h-3.5 w-3.5 text-emerald-500/80" />
            <span>Protected Route Proxy • NextAuth v5</span>
          </p>
        </div>
      </div>
    </div>
  );
}
