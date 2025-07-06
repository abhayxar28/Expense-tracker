import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Trash2 } from "lucide-react";
import { AddIncomeModal } from "./addIncomeModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {Skeleton} from "@/components/ui/skeleton"; 
import { toast } from "sonner";
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL 

type IncomeItem = {
  id: string
  title: string;
  amount: number;
  date: string;
  icon: string;
};

export default function IncomeComponent() {
  const [incomeList, setIncomeList] = useState<IncomeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncome = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${DATABASE_URL}/incomes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIncomeList(res.data.incomes || []);
    } catch (err) {
      console.error("Error fetching income data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleDelete = async(id: string)=>{
    const res = await axios.delete(`${DATABASE_URL}/transactions/${id}`,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if(res.data){
      toast.success('Income Deleted Successfully')
      fetchIncome();
    }else{
      toast.error('Failed to delete Income Transaction')
    }
  }

  const handleDownload = () => {
    const formattedData = incomeList.map((item) => ({
      Title: item.title,
      Amount: item.amount,
      Date: formatDate(item.date),
      Icon: item.icon,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "income_data.xlsx");
  };

  const barData = incomeList.map((item) => ({
    name: formatDateLabel(item.date),
    value: item.amount,
  }));

  const maxIncome = barData.length
    ? Math.max(...barData.map((item) => item.value))
    : 0;
  const yMax = Math.ceil(maxIncome / 1000) * 1000 + 1000;

  const tickStep = 1000;
  const yAxisTicks = Array.from(
    { length: Math.ceil(yMax / tickStep) + 1 },
    (_, i) => i * tickStep
  );

  const getColor = (amount: number) => {
    if (amount > 10000) return "#7b44f2";
    if (amount > 5000) return "#a78bfa";
    return "#ddd6fe";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Bar Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Income Overview</h2>
          <AddIncomeModal onIncomeAdded={fetchIncome} />
        </div>

        <div className="w-full h-[250px]">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-xl" />
          ) : incomeList.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              No income entries yet 💤
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, yMax]}
                  ticks={yAxisTicks}
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
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {barData.map((entry, idx) => (
                    <Cell key={idx} fill={getColor(entry.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Income List Section */}
      <div className="bg-white p-6 rounded-2xl shadow w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Income Sources</h2>
          <button
            onClick={handleDownload}
            className="text-sm text-gray-500 border px-3 py-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            Download
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))
          ) : incomeList.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p className="text-xl">🪙 No income data yet</p>
              <p className="text-sm mt-2">Add a source of income above to get started.</p>
            </div>
          ) : (
            incomeList.map((item, idx) => (
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
                  <p className="text-green-600 font-semibold text-sm flex items-center bg-green-100 px-2 py-1 rounded-full">
                    + ₹{item.amount.toLocaleString()} <TrendingUp size={14} className="ml-1" />
                  </p>
                  <button onClick={()=>handleDelete(item.id)} className="cursor-pointer text-gray-400 hover:text-red-500">
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
