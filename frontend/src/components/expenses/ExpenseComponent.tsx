import { useEffect, useState } from "react";
import axios from "axios";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Trash2, TrendingDown } from "lucide-react";
import { AddExpenseModal } from "./addExpenseModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {Skeleton} from "@/components/ui/skeleton";
import { toast } from "sonner";
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL 

type ExpenseItem = {
  id: string
  title: string;
  amount: number;
  date: string;
  icon: string;
};

export default function ExpenseComponent() {
  const [expenseList, setExpenseList] = useState<ExpenseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpense = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${DATABASE_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExpenseList(res.data.expenses || []);
    } catch (err) {
      console.error("Error fetching expenses", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await axios.delete(`${DATABASE_URL}/transactions/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if(res.data){
      toast.success("Expense Deleted Successfully");
      fetchExpense();
    }else{
      toast.error('Failed to Delete Expense Transaction')
    }

  }

  const handleDownload = () => {
    const formattedData = expenseList.map((item) => ({
      Title: item.title,
      Amount: item.amount,
      Date: formatDate(item.date),
      Icon: item.icon,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "expense_data.xlsx");
  };

  const lineData = expenseList.map((item) => ({
    name: formatDateLabel(item.date),
    value: item.amount,
  }));

  const maxAmount = Math.max(...lineData.map((item) => item.value), 0);
  const yMax = Math.ceil(maxAmount / 1000) * 1000 + 1000;

  const tickStep = 1000;
  const yAxisTicks = Array.from(
    { length: Math.ceil(yMax / tickStep) + 1 },
    (_, i) => i * tickStep
  );

  return (
    <div className="p-6 space-y-6">
      {/* Area Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">Expense Overview</h2>
            <p className="text-sm text-gray-500">
              Track your spending trends over time and gain insights into where your money goes.
            </p>
          </div>
          <div className="text-sm">
            <AddExpenseModal onExpenseAdded={fetchExpense} />
          </div>
        </div>

        <div className="w-full h-[250px]">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-xl" />
          ) : lineData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              No expenses yet 💤
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7b44f2" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  stroke="#888"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  ticks={yAxisTicks}
                  stroke="#888"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-white shadow px-3 py-2 border rounded text-sm">
                        <p className="text-purple-600 font-bold">{payload[0].payload.name}</p>
                        <p>Amount: ₹{payload[0].value.toLocaleString()}</p>
                      </div>
                    ) : null
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7b44f2"
                  strokeWidth={2}
                  fill="url(#lineGradient)"
                  dot={{ r: 4, stroke: "#7b44f2", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 5, fill: "#7b44f2", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Expense List Section */}
      <div className="bg-white p-6 rounded-2xl shadow w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Expenses</h2>
          <button
            onClick={handleDownload}
            className="text-sm text-gray-500 border px-3 py-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            Download
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-20 w-full rounded-lg" />
            ))
          ) : expenseList.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p className="text-xl">😴 No expenses added yet</p>
              <p className="text-sm mt-2">Start tracking your spending by adding an expense above.</p>
            </div>
          ) : (
            expenseList.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-red-600 font-semibold text-sm flex items-center bg-red-100 px-2 py-1 rounded-full">
                    + ₹{item.amount.toLocaleString()} <TrendingDown size={14} className="ml-1" />
                  </p>
                  <button onClick={() => handleDelete(item.id)} className="cursor-pointer text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
