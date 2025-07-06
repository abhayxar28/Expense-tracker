import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Brain,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Menu,
  Wallet,
  X,
} from "lucide-react";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import axios from "axios";

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; profileImage: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    if (!token) {
      navigate("/signup");
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await axios.get(`${DATABASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err: any) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    };

    fetchMe();
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/signin");
  }, [navigate]);

  const activeRoute = location.pathname.split("/")[2] || "";

  if (!user) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Topbar for small screens */}
      <div className="lg:hidden flex items-center justify-between p-4 shadow z-20 bg-white">
        <h2 className="text-xl font-bold text-purple-700">FinFlow</h2>
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-100 p-4 flex-col z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "flex" : "hidden"} lg:flex`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-purple-700 mb-4 hidden lg:block">
          FinFlow
        </h2>

        {/* User info */}
        <div className="flex flex-col items-center text-center gap-2 mb-5 p-4">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
          />
          <span className="text-lg font-medium text-gray-800">{user.name}</span>
        </div>

        {/* Sidebar links */}
        <div className="space-y-3">
          <SidebarButton
            label="Dashboard"
            icon={<LayoutDashboard size={18} />}
            isActive={activeRoute === ""}
            onClick={() => {
              navigate("/dashboard");
              setSidebarOpen(false);
            }}
          />
          <SidebarButton
            label="Income"
            icon={<Wallet size={18} />}
            isActive={activeRoute === "income"}
            onClick={() => {
              navigate("/dashboard/income");
              setSidebarOpen(false);
            }}
          />
          <SidebarButton
            label="Expense"
            icon={<HandCoins size={18} />}
            isActive={activeRoute === "expense"}
            onClick={() => {
              navigate("/dashboard/expense");
              setSidebarOpen(false);
            }}
          />
          <SidebarButton
            label="AI"
            icon={<Brain size={18} />}
            isActive={activeRoute === "ai-analysis"}
            onClick={() => {
              navigate("/dashboard/ai-analysis");
              setSidebarOpen(false);
            }}
          />
          {/* Fixed logout button */}
          <SidebarButton
            label="Logout"
            icon={<LogOut size={18} />}
            isActive={false}
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
}

function SidebarButton({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition cursor-pointer ${
        isActive
          ? "bg-purple-600 text-white"
          : "bg-white text-gray-700 hover:bg-purple-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
