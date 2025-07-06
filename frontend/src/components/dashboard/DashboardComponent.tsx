import axios from "axios";
import {
  Wallet,
  HandCoins,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ExpensesCard from "./expense-card";
import IncomeCard from "./income-card";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL 

const SkeletonBox = ({ height = "h-6", width = "w-full" }: { height?: string; width?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${height} ${width}`} />
);

export type Transaction = {
  title: string;
  amount: number;
  date: string;
  category: "income" | "expense";
  icon: string;
};

type Total = {
  balance: number;
  totalExpenses: number;
  totalIncome: number;
};

export default function DashboardComponent() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [totals, setTotals] = useState<Total | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      const response = await axios.get(`${DATABASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTransactions(response.data.transactions);
    };

    const fetchTransactionTotal = async () => {
      const response = await axios.get(`${DATABASE_URL}/transactions/sum`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTotals(response.data);
    };

    fetchTransaction();
    fetchTransactionTotal();
  }, []);

  const handleDownload = () => {
    if (!transactions || transactions.length === 0) return;

    const formattedData = transactions.map((item) => ({
      Title: item.title,
      Amount: item.amount,
      Date: formatDate(item.date),
      Category: item.category,
      Icon: item.icon,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "transactions.xlsx");
  };

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

  const pieData =
    totals !== null
      ? [
          { name: "Total Balance", value: totals.balance, color: "#7b44f2" },
          { name: "Total Income", value: totals.totalIncome, color: "#ff6b00" },
          { name: "Total Expenses", value: totals.totalExpenses, color: "#ff3d3d" },
        ]
      : [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          icon={<CreditCard />}
          title="Total Balance"
          amount={totals ? `₹${totals.balance.toLocaleString()}` : ""}
          textColor="text-white"
          iconBg="bg-[#7b44f2]"
          loading={!totals}
        />
        <Card
          icon={<Wallet />}
          title="Total Income"
          amount={totals ? `₹${totals.totalIncome.toLocaleString()}` : ""}
          textColor="text-white"
          iconBg="bg-[#ff6b00]"
          loading={!totals}
        />
        <Card
          icon={<HandCoins />}
          title="Total Expenses"
          amount={totals ? `₹${totals.totalExpenses.toLocaleString()}` : ""}
          textColor="text-white"
          iconBg="bg-[#ff3d3d]"
          loading={!totals}
        />
      </div>

      {/* Transactions + Pie Chart */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow px-4 py-6 sm:px-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button
              onClick={handleDownload}
              className="flex cursor-pointer items-center text-sm text-[#7b44f2] bg-[#f4ecff] px-3 py-1 rounded-full hover:underline"
            >
              Download <ArrowRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {transactions === null ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <SkeletonBox width="w-8 h-8" />
                    <div>
                      <SkeletonBox width="w-24" />
                      <SkeletonBox width="w-16" height="h-3 mt-1" />
                    </div>
                  </div>
                  <SkeletonBox width="w-20" />
                </div>
              ))
            ) : transactions.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No transactions found.</div>
            ) : (
              transactions.slice(0, 6).map((t, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center gap-2 flex-wrap pb-1 last:border-none"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xl rounded-full bg-gray-200 p-2 shrink-0">{t.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate max-w-[200px]">
                        {t.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{formatDate(t.date)}</p>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                      t.category === "expense"
                        ? "bg-[#ffe4e4] text-red-500"
                        : "bg-[#e1f0e2] text-green-500"
                    }`}
                  >
                    {t.category === "expense"
                      ? `- ₹${Math.abs(t.amount)}`
                      : `+ ₹${t.amount}`}
                    {t.category === "expense" ? (
                      <TrendingDown size={16} />
                    ) : (
                      <TrendingUp size={16} />
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow px-4 py-6 sm:px-6 w-full flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
          <div className="relative w-full max-w-[250px] aspect-square">
            {totals ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      paddingAngle={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | string) => `₹${Number(value).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <p className="text-sm text-gray-500">Total Balance</p>
                  <p className="text-lg font-bold text-[#7b44f2]">
                    ₹{totals.balance.toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <SkeletonBox height="h-60 w-full" />
            )}
          </div>
          {totals && (
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  {d.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Income & Expenses Cards */}
      <div className="w-full">
        <ExpensesCard />
      </div>
      <div className="w-full">
        <IncomeCard />
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  amount,
  iconBg,
  textColor,
  loading = false,
}: {
  icon: React.ReactElement;
  title: string;
  amount: string;
  iconBg: string;
  textColor: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 w-full">
      <div className={`p-3 rounded-full ${iconBg} ${textColor} text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        {loading ? (
          <SkeletonBox width="w-24" height="h-6" />
        ) : (
          <p className="text-xl font-medium text-black">{amount}</p>
        )}
      </div>
    </div>
  );
}
