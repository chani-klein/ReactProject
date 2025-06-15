interface Props {
  onSubmit: (summary: string) => void;
}

export default function CloseCallForm({ onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const summary = (e.target as any).elements.summary.value;
    onSubmit(summary);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>📝 דו״ח סיום</h3>
      <textarea name="summary" placeholder="פרטי הקריאה..." required style={{ minHeight: "120px", padding: "1rem" }} />
      <button type="submit">סיים קריאה</button>
    </form>
  );
}
