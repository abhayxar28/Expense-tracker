import { ArrowRight, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Link } from "react-router-dom";
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL 

type IncomeItem = {
  title: string;
  date: string;
  amount: number;
  icon: string;
};

export default function IncomeCard() {
  const [incomeList, setIncomeList] = useState<IncomeItem[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/transactions/income`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIncomeList(response.data.transactions);
      } catch (err) {
        console.error("Error fetching incomes", err);
      }
    };
    fetchIncome();
  }, []);

  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        const { data } = await axios.get(`${DATABASE_URL}/incomes/sum`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTotalIncome(data.totalAmount);
      } catch (err) {
        console.error("Error fetching total income", err);
      }
    };
    fetchTotalIncome();
  }, []);

  const COLORS = ["#7b44f2", "#ff3d3d", "#ff6b00", "#4ade80", "#818cf8"];
  const pieData = incomeList.map((item, index) => ({
    name: item.title,
    value: item.amount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Pie Chart Section */}
      <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col items-center">
        <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Last 60 Days Income</h2>
        
        <div className="relative aspect-square w-full max-w-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | string) => `₹${Number(value).toLocaleString()}`}
                contentStyle={{ borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Income */}
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center z-10 pointer-events-none">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-lg font-bold text-black">₹{totalIncome}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-3 text-xs md:text-sm">
          {pieData.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
              {d.name}
            </div>
          ))}
        </div>
      </div>

      {/* Income List Section */}
      <div className="bg-white rounded-2xl shadow p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base md:text-lg font-semibold">Income</h2>
          <Link to={'/dashboard/income'} className="flex items-center text-sm text-[#7b44f2] bg-[#f4ecff] px-3 py-1 rounded-full hover:underline">
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {incomeList.slice(0, 5).map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-xl bg-gray-100 p-2 rounded-full">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                </div>
              </div>
              <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                + ₹{item.amount}
                <TrendingUp size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}
