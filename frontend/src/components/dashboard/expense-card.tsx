import axios from "axios";
import { ArrowRight, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

type Expenses = {
  title: string;
  amount: number;
  date: string;
  category: "expense";
  icon: string;
};

const getColor = (amount: number) => {
  if (amount > 10000) return "#5b21b6";
  if (amount > 1000) return "#7c3aed";
  return "#c4b5fd";
};

export default function ExpensesCard() {
  const [expenses, setExpenses] = useState<Expenses[] | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      const response = await axios.get(`${DATABASE_URL}/transactions/expense`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExpenses(response.data.transactions);
    };

    fetchExpense();
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const getSuffix = (d: number) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    return `${day}${getSuffix(day)} ${month} ${year}`;
  }

  const barData =
    expenses
      ?.slice(0, 10)
      .map((e) => ({
        name: e.title.length > 10 ? e.title.slice(0, 10) + "…" : e.title,
        value: e.amount,
      })) || [];

  const maxValue = Math.max(...barData.map((item) => item.value), 0);
  const yAxisMax = Math.ceil(maxValue / 500) * 500;

  const yAxisTicks = Array.from(
    { length: Math.ceil(yAxisMax / 500) + 1 },
    (_, i) => i * 500
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: Expenses List */}
      <div className="bg-white rounded-2xl shadow p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold">Expenses</h2>
          <Link to={'/dashboard/expenses'} className="flex items-center text-sm text-[#7b44f2] bg-[#f4ecff] px-3 py-1 rounded-full hover:underline">
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {!expenses ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="w-24 h-3 bg-gray-200 rounded mb-1" />
                    <div className="w-16 h-2 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded" />
              </div>
            ))
          ) : expenses.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No expenses found.
            </div>
          ) : (
            expenses.slice(0, 5).map((e, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-gray-100 rounded-full p-2">{e.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{e.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(e.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-[#ffe4e4] text-red-500 text-sm font-medium rounded-full">
                  - ₹{e.amount}
                  <TrendingDown size={16} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Bar Chart */}
      <div className="bg-white rounded-2xl shadow p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Last 30 Days Expenses</h2>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, yAxisMax]}
                ticks={yAxisTicks}
              />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload && payload.length ? (
                    <div className="bg-white p-2 rounded shadow text-sm border border-gray-200">
                      <p className="text-[#7b44f2] font-bold">{payload[0].payload.name}</p>
                      <p className="text-gray-700 font-medium">
                        Amount: ₹{payload[0].value}
                      </p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
