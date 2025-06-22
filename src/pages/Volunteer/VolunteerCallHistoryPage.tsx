import { useEffect, useState } from "react";
import axios from "../../services/axios";
import BackgroundLayout from "../../layouts/BackgroundLayout";
import CloseCallForm from "../../components/CloseCallForm";

export default function HistoryPage() {
  const [calls, setCalls] = useState<any[]>([]);

  const fetchCalls = async () => {
    const res = await axios.get("/api/Volunteer/history-calls");
    setCalls(res.data);
  };

  const closeCall = async (id: number, summary: string) => {
    await axios.post(`/api/Calls/${id}/close`, { summary });
    fetchCalls();
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  return (
    <BackgroundLayout>
      <h2>📖 היסטוריית קריאות</h2>
      {calls.map((call) => (
        <div key={call.id} className="card">
          <h3>{call.description}</h3>
          <p>סטטוס: {call.status}</p>
          {call.status === "נסגר" ? (
            <p>📝 דו״ח: {call.summary}</p>
          ) : (
            <CloseCallForm onSubmit={(summary) => closeCall(call.id, summary)} />
          )}
        </div>
      ))}
    </BackgroundLayout>
  );
}
