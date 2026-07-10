import { NavLink } from "react-router-dom"
import "./index.css"

const LadingPage = () => {
  return (
    <div>
      <div className="sim">LadingPage</div>

      <NavLink className='paginas' to="/home"> <img src="/home-2.svg"/> Home</NavLink>
    </div>
  )
}

export default LadingPage