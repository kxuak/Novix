import { useState } from 'react'
import Card from '../../components/Card'
import GoalForm from '../../components/GoalForm'
import type { NewGoalData } from '../../components/GoalForm'
import type { Goal } from '../../context/DataContext'
import { useData } from '../../context/DataContext'
import './index.css'
import { DiamondIcon } from '../../components/DiamondIcon.tsx';


const Goals = () => {

  const { goals, addGoal, updateGoal, deleteGoal } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleAddGoal = (data: NewGoalData) => {
    addGoal(data);
    setIsFormOpen(false);
  };

  const handleEditGoal = (data: NewGoalData) => {
    if (!editingGoal) return;
    updateGoal(editingGoal.id, data);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: number) => {
    deleteGoal(id);
  };

  return (
    <div className="main-goals">

      <h2 className='subtitle-goal'>Destino</h2>
      <h1 className='title-goal'>Controle seus objetivos</h1>

      <div className="first-main-goals">
        <div className="goals">
          <h4 className="goals-title">Minhas metas</h4>

          <div className="goals-cards">
            {goals.map((goal) => (
              <Card
                key={goal.id}
                variant="goal"
                title={goal.title}
                percentage={goal.percentage}
                currentValue={goal.currentValue}
                targetValue={goal.targetValue}
                icon={goal.icon}
                color={goal.color}
                onEdit={() => setEditingGoal(goal)}
                onDelete={() => handleDeleteGoal(goal.id)}
              />
            ))}

            <div className="add-goal-card" onClick={() => setIsFormOpen(true)}>
              <img src="./circle-dashed-plus.svg" />
            </div>
          </div>
        </div>

        <div className="goals-resume">
          <div className="metas-resume-title">
            <h4>Resumo das metas</h4>
          </div>
          <div className="metas-resume">
            <div className="metas-resumo">
              <div className="metas-resumo-header">
                <h5>Metas ativas</h5>
                <div className="metas-ativas-icon">
                  <img src="/trending-up.svg" />
                </div>
              </div>
              <span className="metas-resumo-value">
                {goals.filter((g) => g.percentage < 100).length}
              </span>
            </div>

            <div className="metas-resumo">
              <div className="metas-resumo-header">
                <h5>Metas concluídas</h5>
                <div className="metas-check-icon">
                  <img src="/check.svg" />
                </div>
              </div>
              <span className="metas-resumo-value">
                {goals.filter((g) => g.percentage >= 100).length}
              </span>
            </div>

            <div className="metas-resumo">
              <div className="metas-resumo-header">
                <h5>Total guardado</h5>
                <div className="metas-guardado-icon">
                  <img src="/currency-dollar.svg"/>
                </div>
              </div>
              <span className="metas-resumo-value">
                R${goals.reduce((sum, g) => sum + Number(g.currentValue), 0)}
              </span>
            </div>

            <div className="metas-resumo">
              <div className="metas-resumo-header">
                <h5>Total de metas</h5>
                <div className="metas-total-icon">
                  <DiamondIcon color='#FDC958'/>
                </div>
              </div>
              <span className="metas-resumo-value">{goals.length}</span>
            </div>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <GoalForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddGoal}
        />
      )}

      {editingGoal && (
        <GoalForm
          onClose={() => setEditingGoal(null)}
          onSubmit={handleEditGoal}
          initialData={{
            title: editingGoal.title,
            targetValue: editingGoal.targetValue,
            currentValue: editingGoal.currentValue,
            icon: editingGoal.icon,
            color: editingGoal.color,
          }}
        />
      )}

    </div>
  )
}


export default Goals
