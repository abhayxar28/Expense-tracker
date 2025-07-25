import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SigninParams } from "@ratatsam22/common";
import { toast } from "sonner";

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

export default function SignInComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault();

    const signinParams: SigninParams = { email, password };

    try {
      setIsPending(false);
      const response = await axios.post(
        `${DATABASE_URL}/user/signin`,
        signinParams
      );

      const { token, user } = response.data;

      if (token && user) {
        toast.success("Signin successful");
        localStorage.setItem("token", token);
        localStorage.setItem("id", user.id);
        navigate("/dashboard");
      } else {
        toast.error("Sign-in failed: No token received");
      }
    } catch (e: any) {
      const msg = e.response?.data?.message || "Sign-in failed";

      if (msg.includes("Email")) {
        toast.error("Incorrect email");
      } else if (msg.includes("Password")) {
        toast.error("Incorrect password");
      } else {
        toast.error(msg);
      }

      setEmail("");
      setPassword("");
      setIsPending(true);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">
            Please enter your details to log in
          </p>

          <form className="space-y-4" onSubmit={handleSignin}>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 Characters"
                  className="w-full mt-1 px-4 py-2 border rounded-md bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition cursor-pointer"
            >
              {isPending ? "Sign in" : "Signing in..."}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-purple-600 font-medium hover:underline cursor-pointer"
            >
              Signup
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
