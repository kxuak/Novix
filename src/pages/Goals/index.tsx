import { useState } from 'react'
import Card from '../../components/Card'
import './index.css'
import { DiamondIcon } from '../../components/DiamondIcon.tsx';


interface Goal {
  id: number;
  title: string;
  percentage: number;
  currentValue: string;
  targetValue: string;
}


const Goals = () => {

  const [goals, setGoals] = useState<Goal[]>([]);


  const addGoal = () => {

  setGoals([
    ...goals,

    {
      id: Date.now(),
      title: `Nova meta ${goals.length + 1}`,
      percentage: 0,
      currentValue: "0",
      targetValue: "100",
    }

  ]);

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
        icon="/school.svg"
      />
    ))}

    <div className="add-goal-card" onClick={addGoal}>
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
      <span className="metas-resumo-value">6</span>
    </div>

    <div className="metas-resumo">
      <div className="metas-resumo-header">
        <h5>Metas concluídas</h5>
        <div className="metas-check-icon">
          <img src="/check.svg" />
        </div>
      </div>
      <span className="metas-resumo-value">6</span>
    </div>

    <div className="metas-resumo">
      <div className="metas-resumo-header">
        <h5>Total guardado</h5>
        <div className="metas-guardado-icon">
          <img src="/currency-dollar.svg"/>
        </div>
      </div>
      <span className="metas-resumo-value">6</span>
    </div>

    <div className="metas-resumo">
      <div className="metas-resumo-header">
        <h5>Total de metas</h5>
        <div className="metas-total-icon">
          <DiamondIcon color='#FDC958'/>
        </div>
      </div>
      <span className="metas-resumo-value">6</span>
    </div>
  </div>
</div>
    </div>
  </div>
)
}


export default Goals