import { useState } from "react";
import "./index.css";

export type TransactionType = "Receita" | "Despesa" | "Investimento";

export interface TransactionFormData {
  description: string;
  value: string;
  category: string;
  type: TransactionType;
  date: string;
}

export const CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Salário",
  "Investimentos",
  "Outros",
];

export const TYPES: TransactionType[] = ["Receita", "Despesa", "Investimento"];

export const badgeClassByType: Record<TransactionType, string> = {
  Receita: "badge-receita",
  Despesa: "badge-despesa",
  Investimento: "badge-investimento",
};

export const sanitizeNumber = (value: string) => value.replace(/[^\d.]/g, "");

export const formatCurrency = (value: string) => {
  const n = Number(value || 0);
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (value: string) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  initialData?: TransactionFormData;
}

const TransactionForm = ({ onClose, onSubmit, initialData }: TransactionFormProps) => {
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [value, setValue] = useState(initialData?.value ?? "");
  const [category, setCategory] = useState(initialData?.category ?? CATEGORIES[0]);
  const [type, setType] = useState<TransactionType>(initialData?.type ?? "Despesa");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [error, setError] = useState("");

  const isEditing = !!initialData;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(sanitizeNumber(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !value || !date) {
      setError("Preencha todos os campos.");
      return;
    }

    setError("");
    onSubmit({ description, value, category, type, date });
  };

  return (
    <div className="tx-form-overlay" onClick={onClose}>
      <div className="tx-form-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? "Editar transação" : "Nova transação"}</h3>

        <form onSubmit={handleSubmit}>
          <label>
            Descrição
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Janta fora"
            />
          </label>

          <label>
            Valor
            <div className="tx-input-prefix">
              <span>R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={handleValueChange}
                placeholder="0,00"
              />
            </div>
          </label>

          <label>
            Categoria
            <div className="tx-select-wrapper">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label>
            Data
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          {error && <p className="tx-form-error">{error}</p>}

          <label>Tipo</label>
          <div className="tx-type-options">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t}
                className={`tx-type-option ${badgeClassByType[t]} ${type === t ? "selected" : ""}`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="tx-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="confirm-btn">
              {isEditing ? "Salvar alterações" : "Criar transação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;