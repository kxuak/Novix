import { useState } from "react";
import "./index.css";

const ICONS = [
  { name: "aviao", src: "/plane-tilt.svg" },
  { name: "escola", src: "/school.svg" },
  { name: "carro", src: "/car.svg" },
  { name: "escudo", src: "/shield.svg" },
  { name: "presente", src: "/gift.svg" },
  { name: "laptop", src: "/device-laptop.svg" },
];

const COLORS = ["#319FFF", "#3DE600", "#953BEA", "#FDC958", "#F02D2D", "#46FCE0"];

export interface NewGoalData {
  title: string;
  targetValue: string;
  currentValue: string;
  icon: string;
  color: string;
}

interface GoalFormProps {
  onClose: () => void;
  onSubmit: (goal: NewGoalData) => void;
  initialData?: NewGoalData; // NOVO
}

const sanitizeNumber = (value: string) => value.replace(/[^\d.]/g, "");

const stripLeadingZero = (value: string) => {
  const cleaned = value.replace(/^0+(?=\d)/, "");
  return cleaned === "" ? "0" : cleaned;
};

const GoalForm = ({ onClose, onSubmit, initialData }: GoalFormProps) => {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [targetValue, setTargetValue] = useState(initialData?.targetValue ?? "");
  const [currentValue, setCurrentValue] = useState(initialData?.currentValue ?? "0");
  const [icon, setIcon] = useState(initialData?.icon ?? ICONS[0].src);
  const [color, setColor] = useState(initialData?.color ?? COLORS[0]);
  const [error, setError] = useState("");

  const isEditing = !!initialData; // NOVO

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValue(sanitizeNumber(e.target.value));
  };

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeNumber(e.target.value);
    setCurrentValue(stripLeadingZero(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !targetValue) return;

    if (Number(currentValue) > Number(targetValue)) {
      setError("O valor atual não pode ser maior que o valor da meta.");
      return;
    }

    setError("");
    onSubmit({ title, targetValue, currentValue, icon, color });
  };

  return (
    <div className="goal-form-overlay" onClick={onClose}>
      <div className="goal-form-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? "Editar meta" : "Nova meta"}</h3>

        <form onSubmit={handleSubmit}>
          <label>
            Título da meta
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Viagem para o Japão"
            />
          </label>

          <label>
            Valor da meta
            <div className="input-prefix">
              <span>R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={targetValue}
                onChange={handleTargetChange}
                placeholder="5000"
              />
            </div>
          </label>

          <label>
            Valor atual
            <div className="input-prefix">
              <span>R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={currentValue}
                onChange={handleCurrentChange}
              />
            </div>
          </label>

          {error && <p className="form-error">{error}</p>}

          <label>Ícone</label>
          <div className="icon-options">
            {ICONS.map((i) => (
              <button
                type="button"
                key={i.name}
                className={`icon-option ${icon === i.src ? "selected" : ""}`}
                onClick={() => setIcon(i.src)}
              >
                <span
                  className="icon-option-mask"
                  style={{
                    WebkitMaskImage: `url(${i.src})`,
                    maskImage: `url(${i.src})`,
                  }}
                />
              </button>
            ))}
          </div>

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
              {isEditing ? "Salvar alterações" : "Criar meta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;