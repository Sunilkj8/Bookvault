import React, { useContext, useEffect, useState } from "react";
import { IsLoginClicked } from "../../contexts/LoginContext";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { toast } from "react-toastify";

const LoginModal = () => {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [signInState, setSignInState] = useState("Login");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setLoginClickState } = useContext(IsLoginClicked);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLoginClickState(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setLoginClickState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleDemoFill = (type) => {
    if (type === "admin") {
      setSignInState("Login");
      setLoginInfo({
        email: "admin@gmail.com",
        password: "admin",
        username: "admin",
      });
    } else {
      setSignInState("Login");
      setLoginInfo({
        email: "sunil@gmail.com",
        password: "password123",
        username: "sunil",
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (signInState === "Login") {
        const res = await axios.post(`${API_BASE_URL}/signin`, {
          email: loginInfo.email,
          password: loginInfo.password,
        });

        if (res.data.token) {
          localStorage.setItem("user_id", res.data.user_id);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("usertype", res.data.usertype || "user");
          localStorage.setItem("token", res.data.token);
          toast.success(`Welcome back, ${res.data.username}!`);
          setLoginClickState(false);
          setTimeout(() => window.location.reload(), 300);
        } else {
          setErrorMessage(
            typeof res.data === "string"
              ? res.data
              : "Login failed. Check your credentials."
          );
        }
      } else {
        await axios.post(`${API_BASE_URL}/signup`, loginInfo);
        toast.success("Account created successfully! Please sign in.");
        setSignInState("Login");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Authentication failed. Please verify credentials.";
      setErrorMessage(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        onClick={() => setLoginClickState(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Centered Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Brand Logo */}
        <div className="px-6 sm:px-8 pt-8 pb-4 text-center relative">
          <button
            type="button"
            onClick={() => setLoginClickState(false)}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
          >
            ✕
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md shadow-emerald-500/20">
            📖
          </div>

          <h2 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">
            {signInState === "Login" ? "Welcome Back to BookVault" : "Create Your Account"}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {signInState === "Login"
              ? "Access your active rentals, bookmarks, and catalog."
              : "Join our reader community to rent titles with ease."}
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl mt-6">
            <button
              type="button"
              onClick={() => {
                setSignInState("Login");
                setErrorMessage("");
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                signInState === "Login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setSignInState("Signup");
                setErrorMessage("");
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                signInState === "Signup"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 sm:px-8 pb-8 pt-2">
          {/* Quick Demo Fill Buttons */}
          <div className="mb-4 bg-slate-50 border border-slate-200/70 rounded-2xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              One-Click Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill("admin")}
                className="py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>🔑</span> Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("user")}
                className="py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>👤</span> Reader Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {signInState === "Signup" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={loginInfo.username}
                  onChange={handleChange}
                  placeholder="e.g. readmaster"
                  required
                  className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={loginInfo.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={loginInfo.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2 active:scale-95"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>
                    {signInState === "Login" ? "Sign In to BookVault" : "Create Account"}
                  </span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
            {signInState === "Login" ? (
              <span>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setSignInState("Signup")}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already a member?{" "}
                <button
                  type="button"
                  onClick={() => setSignInState("Login")}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
