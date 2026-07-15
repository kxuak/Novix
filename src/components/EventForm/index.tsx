import { useState } from "react";
// Reaproveita as classes globais do GoalForm (goal-form-overlay, goal-form-modal,
// color-option, cancel-btn, confirm-btn...), por isso não precisa de CSS próprio.

const COLORS = ["#319FFF", "#3DE600", "#953BEA", "#FDC958", "#F02D2D", "#46FCE0"];

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  color: string;
}

interface EventFormProps {
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
}

const EventForm = ({ onClose, onSubmit }: EventFormProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !time) {
      setError("Preencha todos os campos.");
      return;
    }

    setError("");
    onSubmit({ title, date, time, color });
  };

  return (
    <div className="goal-form-overlay" onClick={onClose}>
      <div className="goal-form-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Novo evento financeiro</h3>

        <form onSubmit={handleSubmit}>
          <label>
            Título do evento
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Vencimento do cartão"
            />
          </label>

          <label>
            Data
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label>
            Hora
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>

          {error && <p className="form-error">{error}</p>}

          <label>Cor</label>
          <div className="color-options">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={`color-option ${color === c ? "selected" : ""}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="goal-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="confirm-btn">
              Criar evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;