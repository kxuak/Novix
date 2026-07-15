import "./index.css";

type CardProps =
  | {
      variant: "summary";
      title: string;
      value: string;
      icon: React.ReactNode;
      iconColor: string;
      progress?: number;
    }
  | {
      variant: "goal";
      title: string;
      percentage: number;
      currentValue: string;
      targetValue: string;
      icon: string;
      color: string;
      onEdit: () => void;   // NOVO
      onDelete: () => void; // NOVO
    };


const Card = (props: CardProps) => {

  if (props.variant === "summary") {
    return (
      <div className="card">
        <div className="card-header">
          <span>{props.title}</span>
          <div
            className="card-icon"
            style={{
              backgroundColor: `${props.iconColor}30`,
              color: props.iconColor,
            }}
          >
            {props.icon}
          </div>
        </div>

        <h2>{props.value}</h2>

        {props.progress !== undefined && (
          <div className="card-progress">
            <div
              className="card-progress-fill"
              style={{
                width: `${props.progress}%`,
                backgroundColor: props.iconColor,
              }}
            />
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="card goal-card">

      <div className="goal-header">

        <div className="goal-info">

          <div
            className="goal-icon"
            style={{ backgroundColor: `${props.color}30` }}
          >
            <span
              className="goal-icon-mask"
              style={{
                backgroundColor: props.color,
                WebkitMaskImage: `url(${props.icon})`,
                maskImage: `url(${props.icon})`,
              }}
            />
          </div>

          <span>{props.title}</span>

        </div>

        <strong style={{ color: props.color }}>{props.percentage}%</strong>

      </div>


      <div className="goal-values">

        <div>
          <p><span className="info-goal">Meta:</span> R${props.targetValue}</p>
          <p><span className="info-goal">Atual:</span> R${props.currentValue}</p>
        </div>

        <div className="goal-buttons">
          <button className="goal-edit-button" onClick={props.onEdit}>
            Editar
          </button>
          <button className="delete-btn" onClick={props.onDelete}>
            <img src="./trash.svg"/>
          </button>
        </div>

      </div>


      <div className="goal-progress">
        <div
          className="goal-progress-fill"
          style={{
            width: `${props.percentage}%`,
            backgroundColor: props.color,
          }}
        />
      </div>

    </div>
  );
};


export default Card;