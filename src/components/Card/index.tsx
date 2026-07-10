import "./index.css";

type CardProps =
  | {
      variant: "summary";
      title: string;
      value: string;
      icon: string;
    }
  | {
      variant: "goal";
      title: string;
      percentage: number;
      currentValue: string;
      targetValue: string;
      icon: string;
    };


const Card = (props: CardProps) => {

  if (props.variant === "summary") {
    return (
      <div className="card">

        <div className="card-header">
          <span>{props.title}</span>
          {props.icon}
        </div>

        <h2>{props.value}</h2>

      </div>
    );
  }


    return (
    <div className="card goal-card">

      <div className="goal-header">

        <div className="goal-info">

          <div className="goal-icon">
            <img src={props.icon} alt={props.title} />
          </div>

          <span>{props.title}</span>

        </div>

        <strong>{props.percentage}%</strong>

      </div>


     <div className="goal-values">

    <div>

        <p><span className="info-goal">Meta:</span> R${props.targetValue}</p>
        <p><span className="info-goal">Atual:</span> R${props.currentValue}</p>

    </div>

    <div className="goal-buttons">

        <button className="goal-edit-button">Editar</button>

        <button className="delete-btn">
            <img src="./trash.svg"/>
        </button>

    </div>

    </div>


      <div className="goal-progress">

        <div
          className="goal-progress-fill"
          style={{ width: `${props.percentage}%` }}
        />

      </div>

    </div>
  );
};


export default Card;