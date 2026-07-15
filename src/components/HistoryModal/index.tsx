import "./index.css";
import { useData } from "../../context/DataContext";
import { formatCurrency, formatDate, badgeClassByType } from "../TransactionForm";

interface HistoryModalProps {
  onClose: () => void;
}

const HistoryModal = ({ onClose }: HistoryModalProps) => {
  const { transactions } = useData();

  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="goal-form-overlay" onClick={onClose}>
      <div className="goal-form-modal history-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Histórico completo de transações</h3>

        <div className="history-list">
          {sorted.length === 0 && (
            <p className="history-empty">Nenhuma transação registrada ainda.</p>
          )}

          {sorted.map((t) => (
            <div className="history-row" key={t.id}>
              <div className="history-row-main">
                <span className="history-row-description">{t.description}</span>
                <span
                  className={
                    t.type === "Receita"
                      ? "history-value history-value-positive"
                      : "history-value history-value-negative"
                  }
                >
                  {t.type === "Receita" ? "+ " : "- "}R${formatCurrency(t.value)}
                </span>
              </div>
              <div className="history-row-meta">
                <span className={`tx-badge ${badgeClassByType[t.type]}`}>{t.type}</span>
                <span className="history-row-category">{t.category}</span>
                <span className="history-row-date">{formatDate(t.date)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="goal-form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;