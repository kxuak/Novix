import { useMemo, useState } from "react";
import "./index.css";

type TransactionType = "Receita" | "Despesa" | "Investimento";

interface Transaction {
  id: number;
  description: string;
  value: string;
  category: string;
  type: TransactionType;
  date: string; // yyyy-mm-dd
}

interface TransactionFormData {
  description: string;
  value: string;
  category: string;
  type: TransactionType;
  date: string;
}

const CATEGORIES = [
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

const TYPES: TransactionType[] = ["Receita", "Despesa", "Investimento"];

const ITEMS_PER_PAGE = 5;

const sanitizeNumber = (value: string) => value.replace(/[^\d.]/g, "");

const formatCurrency = (value: string) => {
  const n = Number(value || 0);
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value: string) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const badgeClassByType: Record<TransactionType, string> = {
  Receita: "badge-receita",
  Despesa: "badge-despesa",
  Investimento: "badge-investimento",
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

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddTransaction = (data: TransactionFormData) => {
    setTransactions([
      ...transactions,
      {
        id: Date.now(),
        description: data.description,
        value: data.value,
        category: data.category,
        type: data.type,
        date: data.date,
      },
    ]);
    setIsFormOpen(false);
    setCurrentPage(1);
  };

  const handleEditTransaction = (data: TransactionFormData) => {
    if (!editingTransaction) return;

    setTransactions(
      transactions.map((t) =>
        t.id === editingTransaction.id
          ? {
              ...t,
              description: data.description,
              value: data.value,
              category: data.category,
              type: data.type,
              date: data.date,
            }
          : t
      )
    );

    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = !categoryFilter || t.category === categoryFilter;
      const matchesType = !typeFilter || t.type === typeFilter;
      const matchesFrom = !dateFrom || t.date >= dateFrom;
      const matchesTo = !dateTo || t.date <= dateTo;

      return matchesSearch && matchesCategory && matchesType && matchesFrom && matchesTo;
    });
  }, [transactions, search, categoryFilter, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="main-transactions">
      <h2 className="subtitle-tx">Fluxo</h2>
      <h1 className="title-tx">Gerenciar transações</h1>

      <div className="transactions-panel">
        <h4 className="transactions-title">Transações</h4>

        <div className="transactions-filters">
          <input
            className="tx-filter-search"
            type="text"
            placeholder="Pesquisar"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="tx-select-wrapper tx-filter-category">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Categoria</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="tx-select-wrapper tx-filter-type">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tipo:</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <label className="tx-filter-date">
            <span>de:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>

          <label className="tx-filter-date">
            <span>até:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>

          <button className="tx-add-button" onClick={() => setIsFormOpen(true)}>
            + Transação
          </button>
        </div>

        <div className="tx-table-wrapper">
          <div className="tx-table-header">
            <span>Valor</span>
            <span>Categoria</span>
            <span>Tipo</span>
            <span>Data</span>
            <span>Descrição</span>
            <span className="tx-col-actions"></span>
          </div>

          {paginatedTransactions.length === 0 && (
            <div className="tx-empty-state" onClick={() => setIsFormOpen(true)}>
              <img src="/circle-dashed-plus.svg" />
              <p>Nenhuma transação encontrada. Clique para adicionar.</p>
            </div>
          )}

          {paginatedTransactions.map((t) => (
            <div className="tx-table-row" key={t.id}>
              <span
                className={`tx-value ${t.type === "Receita" ? "tx-value-positive" : "tx-value-negative"}`}
                data-label="Valor"
              >
                {t.type === "Receita" ? "+ " : "- "}R${formatCurrency(t.value)}
              </span>

              <span className="tx-category" data-label="Categoria">
                {t.category}
              </span>

              <span data-label="Tipo">
                <span className={`tx-badge ${badgeClassByType[t.type]}`}>{t.type}</span>
              </span>

              <span className="tx-date" data-label="Data">
                {formatDate(t.date)}
              </span>

              <span className="tx-description" data-label="Descrição">
                {t.description}
              </span>

              <span className="tx-row-actions">
                <button className="tx-edit-button" onClick={() => setEditingTransaction(t)}>
                  Editar
                </button>
                <button className="tx-delete-button" onClick={() => handleDeleteTransaction(t.id)}>
                  <img src="/trash.svg" />
                </button>
              </span>
            </div>
          ))}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="tx-pagination">
            <button
              className="tx-pagination-arrow"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
            >
              ‹
            </button>
            <span className="tx-pagination-info">
              {safePage} / {totalPages}
            </span>
            <button
              className="tx-pagination-arrow"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <TransactionForm onClose={() => setIsFormOpen(false)} onSubmit={handleAddTransaction} />
      )}

      {editingTransaction && (
        <TransactionForm
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleEditTransaction}
          initialData={{
            description: editingTransaction.description,
            value: editingTransaction.value,
            category: editingTransaction.category,
            type: editingTransaction.type,
            date: editingTransaction.date,
          }}
        />
      )}
    </div>
  );
};

export default Transactions;