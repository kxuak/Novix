import { useMemo, useState } from "react";
import "./index.css";
import { DiamondIcon } from "../../components/DiamondIcon.tsx";
import Card from "../../components/Card";
import TransactionForm from "../../components/TransactionForm";
import { formatCurrency } from "../../components/TransactionForm";
import EventForm from "../../components/EventForm";
import HistoryModal from "../../components/HistoryModal";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";

/* ===== Ícone via máscara (usa os svgs importados, cor 100% controlável) ===== */

const MaskIcon = ({
  src,
  color = "currentColor",
  size = 18,
}: {
  src: string;
  color?: string;
  size?: number;
}) => (
  <span
    className="mask-icon"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
    }}
  />
);

/* ===== Ícones inline (sem svg equivalente na pasta public) ===== */

const ArrowDownRightIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7 17 17" />
    <path d="M17 8v9H8" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

/* ===== Config ===== */

const ACTIVITIES_PER_PAGE = 7;

const CATEGORY_COLORS: Record<string, string> = {
  "Alimentação": "#E4F24C",
  "Transporte": "#3DE600",
  "Moradia": "#2E3E5C",
  "Lazer": "#38BEEA",
  "Saúde": "#F02D2D",
  "Educação": "#F97316",
  "Salário": "#3396FF",
  "Investimentos": "#953BEA",
  "Outros": "#A1A1AA",
};

const getMonthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const Home = () => {
  const { transactions, addTransaction, goals, events, addEvent, deleteEvent } = useData();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const [isTxFormOpen, setIsTxFormOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const monthKey = getMonthKey();

  /* ===== Cálculos financeiros derivados das transações reais ===== */

  const sumByType = (type: "Receita" | "Despesa" | "Investimento", onlyThisMonth = false) =>
    transactions.reduce((acc, t) => {
      if (t.type !== type) return acc;
      if (onlyThisMonth && !t.date.startsWith(monthKey)) return acc;
      return acc + Number(t.value || 0);
    }, 0);

  const totalReceitas = sumByType("Receita");
  const totalDespesas = sumByType("Despesa");
  const totalInvestimentos = sumByType("Investimento");

  const receitasMes = sumByType("Receita", true);
  const despesasMes = sumByType("Despesa", true);

  const saldoAtual = totalReceitas - totalDespesas - totalInvestimentos;
  const economiaMes = receitasMes - despesasMes;

  const maiorGasto = transactions
    .filter((t) => t.type === "Despesa")
    .reduce((max, t) => Math.max(max, Number(t.value || 0)), 0);

  const diasDoMesDecorridos = new Date().getDate();
  const mediaDiariaGastos = despesasMes / diasDoMesDecorridos;

  const metaFinanceiraPercentual =
    goals.length === 0
      ? 0
      : Math.round(goals.reduce((acc, g) => acc + g.percentage, 0) / goals.length);

  /* ===== Gráfico de gastos mensais (por categoria, só despesas do mês) ===== */

  const monthlySpending = useMemo(() => {
    const despesasDoMes = transactions.filter(
      (t) => t.type === "Despesa" && t.date.startsWith(monthKey)
    );

    const totals = new Map<string, number>();
    despesasDoMes.forEach((t) => {
      totals.set(t.category, (totals.get(t.category) ?? 0) + Number(t.value || 0));
    });

    const totalGasto = Array.from(totals.values()).reduce((a, b) => a + b, 0);

    return Array.from(totals.entries())
      .map(([label, value]) => ({
        label,
        percentage: totalGasto > 0 ? Math.round((value / totalGasto) * 100) : 0,
        color: CATEGORY_COLORS[label] ?? "#3396FF",
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [transactions, monthKey]);

  /* ===== Histórico (atividades) ===== */

  const sortedActivities = useMemo(
    () =>
      [...transactions].sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return b.id - a.id;
      }),
    [transactions]
  );

  const totalPages = Math.max(1, Math.ceil(sortedActivities.length / ACTIVITIES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedActivities = useMemo(
    () =>
      sortedActivities.slice(
        (safePage - 1) * ACTIVITIES_PER_PAGE,
        safePage * ACTIVITIES_PER_PAGE
      ),
    [sortedActivities, safePage]
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  /* ===== Agenda (calendário financeiro) — mais próximos primeiro ===== */

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(`${a.date}T${a.time || "00:00"}`).getTime() -
          new Date(`${b.date}T${b.time || "00:00"}`).getTime()
      ),
    [events]
  );

  const formatEventDate = (date: string) => {
    if (!date) return "-";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="main-home">
      <div className="home-header">
        <div className="home-header-text">
          <h1>Olá, {user.name}</h1>
          <p>Aqui está um resumo da sua vida financeira hoje.</p>
        </div>

        <div className="home-header-actions">
          <button className="home-theme-btn" aria-label="Alternar tema" onClick={toggleTheme}>
            <MaskIcon src={theme === "dark" ? "/moon.svg" : "/sun.svg"} color="var(--text-primary)" size={18} />
          </button>

          <button className="home-new-tx-btn" onClick={() => setIsTxFormOpen(true)}>
            <MaskIcon src="/plus.svg" color="#fff" size={16} /> Nova Transação
          </button>
        </div>
      </div>

      <div className="home-summary-grid">
        <Card
          variant="summary"
          title="Saldo atual"
          value={`R$ ${formatCurrency(String(saldoAtual))}`}
          icon={<MaskIcon src="/credit-card.svg" color="#3396FF" size={18} />}
          iconColor="#3396FF"
        />

        <Card
          variant="summary"
          title="Receitas do mês"
          value={`R$ ${formatCurrency(String(receitasMes))}`}
          icon={<MaskIcon src="/trending-up.svg" color="#3DE600" size={18} />}
          iconColor="#3DE600"
        />

        <Card
          variant="summary"
          title="Despesas do mês"
          value={`R$ ${formatCurrency(String(despesasMes))}`}
          icon={<ArrowDownRightIcon />}
          iconColor="#F02D2D"
        />

        <Card
          variant="summary"
          title="Economia do mês"
          value={`R$ ${formatCurrency(String(economiaMes))}`}
          icon={<MaskIcon src="/bulb.svg" color="#38BEEA" size={18} />}
          iconColor="#38BEEA"
        />

        <Card
          variant="summary"
          title="Total de transações"
          value={String(transactions.length)}
          icon={<MaskIcon src="/clipboard-text.svg" color="#953BEA" size={18} />}
          iconColor="#953BEA"
        />

        <Card
          variant="summary"
          title="Maior gasto"
          value={`R$ ${formatCurrency(String(maiorGasto))}`}
          icon={<AlertIcon />}
          iconColor="#FDC958"
        />

        <Card
          variant="summary"
          title="Média diária de gastos"
          value={`R$ ${formatCurrency(String(mediaDiariaGastos))}`}
          icon={<MaskIcon src="/clock.svg" color="#F97316" size={18} />}
          iconColor="#F97316"
        />

        <Card
          variant="summary"
          title="Meta financeira"
          value={`${metaFinanceiraPercentual}%`}
          icon={<DiamondIcon color="#3DE600" />}
          iconColor="#3DE600"
          progress={metaFinanceiraPercentual}
        />
      </div>

      <div className="home-bottom-grid">
        <div className="home-panel activities-panel">
          <div className="activities-header">
            <div>
              <span className="panel-eyebrow">Atividades</span>
              <h4 className="panel-title">Histórico de Transações</h4>
            </div>

            <button
              className="activities-eye-btn"
              aria-label="Ver histórico completo"
              onClick={() => setIsHistoryOpen(true)}
            >
              <MaskIcon src="/eye.svg" color="var(--text-muted)" size={18} />
            </button>
          </div>

          <div className="activities-list">
            {paginatedActivities.length === 0 && (
              <div className="activities-empty">
                <p>Nenhuma transação registrada ainda.</p>
              </div>
            )}

            {paginatedActivities.map((activity) => (
              <div className="activity-row" key={activity.id}>
                <div className="activity-info">
                  <span className="activity-description">{activity.description}</span>
                  <span className="activity-meta">
                    {activity.category} · {formatEventDate(activity.date)}
                  </span>
                </div>
                <span
                  className={
                    activity.type === "Receita"
                      ? "activity-value activity-positive"
                      : "activity-value activity-negative"
                  }
                >
                  {activity.type === "Receita" ? "+" : "-"}R$ {formatCurrency(activity.value)}
                </span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="home-pagination">
              <button
                className="home-pagination-arrow"
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
              >
                ‹
              </button>
              <span className="home-pagination-info">
                {safePage} / {totalPages}
              </span>
              <button
                className="home-pagination-arrow"
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>

        <div className="home-side-column">
          <div className="home-panel monthly-panel">
            <span className="panel-eyebrow">Mensal</span>
            <h4 className="panel-title">Gastos mensais</h4>

            {monthlySpending.length === 0 ? (
              <div className="monthly-empty">
                <p>Nenhum gasto registrado este mês.</p>
              </div>
            ) : (
              <div className="monthly-chart">
                {monthlySpending.map((item) => (
                  <div className="monthly-bar-wrapper" key={item.label}>
                    <span className="monthly-bar-percentage">{item.percentage}%</span>
                    <div className="monthly-bar-track">
                      <div
                        className="monthly-bar-fill"
                        style={{
                          height: `${Math.max(item.percentage, 4)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="monthly-bar-label">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="home-panel agenda-panel">
            <div className="agenda-header">
              <div>
                <span className="panel-eyebrow">Agenda</span>
                <h4 className="panel-title">Calendário Financeiro</h4>
              </div>

              <button
                className="agenda-add-btn"
                aria-label="Adicionar evento"
                onClick={() => setIsEventFormOpen(true)}
              >
                <MaskIcon src="/plus.svg" color="#fff" size={16} />
              </button>
            </div>

            {sortedEvents.length === 0 ? (
              <div className="agenda-empty">
                <p>Nenhum evento financeiro no calendário.</p>
              </div>
            ) : (
              <div className="agenda-list">
                {sortedEvents.map((event) => (
                  <div className="agenda-event-row" key={event.id}>
                    <span className="agenda-event-dot" style={{ backgroundColor: event.color }} />

                    <div className="agenda-event-info">
                      <span className="agenda-event-title">{event.title}</span>
                      <span className="agenda-event-datetime">
                        {formatEventDate(event.date)} às {event.time}
                      </span>
                    </div>

                    <button
                      className="agenda-event-delete"
                      aria-label="Remover evento"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <MaskIcon src="/trash.svg" color="var(--text-muted)" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isTxFormOpen && (
        <TransactionForm
          onClose={() => setIsTxFormOpen(false)}
          onSubmit={(data) => {
            addTransaction(data);
            setIsTxFormOpen(false);
            setCurrentPage(1);
          }}
        />
      )}

      {isEventFormOpen && (
        <EventForm
          onClose={() => setIsEventFormOpen(false)}
          onSubmit={(data) => {
            addEvent(data);
            setIsEventFormOpen(false);
          }}
        />
      )}

      {isHistoryOpen && <HistoryModal onClose={() => setIsHistoryOpen(false)} />}
    </div>
  );
};

export default Home;