import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

export default function AiAnalysisComponent() {
  const [summary, setSummary] = useState<{
    income?: string;
    expenses?: string;
    savings?: string;
    breakdown?: string[];
    savingRate?: string;
    suggestions?: string[];
  }>({});
  const [loading, setLoading] = useState(false);
   const calledRef = useRef(false);

  const fetchAISummary = useCallback(async () => {
    if (calledRef.current) return;
    calledRef.current = true;
    setLoading(true);
    try {
      const res = await axios.get(`${DATABASE_URL}/ai-summary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const raw = res.data.result || "No reply from AI.";

      const lines = raw.split("\n").map((line: string) => line.trim()).filter((line: string | any[]) => line.length > 0);

      const summaryObj: typeof summary = {
        breakdown: [],
        suggestions: [],
      };

      for (let line of lines) {
        if (line.toLowerCase().includes("total income")) {
          summaryObj.income = line.replace(/.*total income:\s*/i, "");
        }
        else if (line.toLowerCase().includes("total expenses")) {
          summaryObj.expenses = line.replace(/^\d+\.\s*/, "");
        }
        else if (line.toLowerCase().includes("total savings")) summaryObj.savings = line;
        else if (line.toLowerCase().includes("savings rate")) summaryObj.savingRate = line;
        else if (/^[-–]\s/.test(line)) {
          const cleanedLine = line.replace(/^[-–]\s*/, "");
          if (!cleanedLine.toLowerCase().includes("savings:")) {
            summaryObj.breakdown?.push(cleanedLine);
          }
        }
        else if (/^\d+\.\s/.test(line)) summaryObj.suggestions?.push(line);
      }

      setSummary(summaryObj);
      toast.success("✅ AI summary generated!");
    } catch (e) {
      toast.error("❌ Failed to fetch AI summary.");
    } finally {
      setLoading(false);
    }
  },[])

  const cleanText = (text: string) => {
    let cleaned = text.replace(/\*\*/g, '');
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
    return cleaned;
  };

  useEffect(() => {
    fetchAISummary();
  }, [fetchAISummary]);

  return (
    <div className="bg-gradient-to-tr from-purple-50 to-white shadow-lg rounded-2xl p-6 max-w-2xl mx-auto mt-10 border border-purple-200">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">💡 Financial Summary</h2>

      {loading ? (
        <div className="flex items-center justify-center h-28 text-purple-500">
          <Loader2 className="animate-spin w-6 h-6" />
          <span className="ml-2">Analyzing your transactions...</span>
        </div>
      ) : (
        <div className="space-y-4 text-sm text-gray-700">
          {summary.income && <p><strong>Income:</strong> {cleanText(summary.income)}</p>}
          {summary.expenses && <p><strong>Expenses:</strong> {cleanText(summary.expenses)}</p>}
          {summary.savings && <p><strong>Savings:</strong> {cleanText(summary.savings)}</p>}
          {summary.savingRate && <p><strong>Savings Rate:</strong> {cleanText(summary.savingRate)}</p>}

          {summary.breakdown?.length ? (
            <div>
              <h3 className="text-purple-600 font-semibold mt-4">💸 Expense Breakdown</h3>
              <ul className="list-disc ml-6">
                {summary.breakdown.map((item, i) => (
                  <li key={i}>{cleanText(item)}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {summary.suggestions?.length ? (
            <div>
              <h3 className="text-purple-600 font-semibold mt-4">📈 Money-Saving Tips</h3>
              <ol className="list-decimal ml-6">
                {summary.suggestions.map((item, i) => (
                  <li key={i}>{cleanText(item.replace(/^\d+\.\s*/, ""))}</li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}