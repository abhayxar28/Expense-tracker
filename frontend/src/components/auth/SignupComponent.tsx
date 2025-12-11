import { useEffect, useState } from "react";
import { User, Upload } from "lucide-react";
import type { SignupParams } from "@ratatsam22/common";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

export default function SignupComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileImage(base64String);
      setPreviewUrl(base64String);
    };
    reader.readAsDataURL(file);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const signupParams: SignupParams = {
      email,
      password,
      name,
      profileImage,
    };

    try {
      setIsPending(false);
      const response = await axios.post(
        `${DATABASE_URL}/user/signup`,
        signupParams
      );
      if (response.data) {
        toast.success("Signup successful");
        navigate("/signin");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full items-center justify-center">
      <div className="md:w-3/5 w-full bg-white flex items-center justify-center h-screen px-6">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-1">Create an Account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Join us today by entering your details below.
          </p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#f2e3ff] flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-[#7b44f2]" />
                  )}
                </div>
                <label
                  htmlFor="upload-avatar"
                  className="absolute -bottom-2 -right-2 bg-[#7b44f2] hover:bg-[#6930d4] p-2 rounded-full cursor-pointer shadow-md border-2 border-white"
                >
                  <Upload size={16} color="white" />
                  <input
                    type="file"
                    id="upload-avatar"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="w-full">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-medium">Password</label>
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 Characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition cursor-pointer"
            >
              {isPending ? "Sign Up" : "Signing Up..."}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-purple-600 font-medium hover:underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
