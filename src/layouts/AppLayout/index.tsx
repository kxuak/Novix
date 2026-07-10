import { NavLink, Outlet } from 'react-router-dom'
import './index.css'
import { DiamondIcon } from '../../components/DiamondIcon.tsx'

const AppLayout = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className='main-sidebar'>
            <div className='logo'>
                <img className='imagemLogo' src="logoNovix.png"/>
                <h2>Novix</h2>
            </div>

            <nav>
                <NavLink className='paginas' to="/home"> <img src="/home-2.svg"/> Home</NavLink>
                <NavLink className='paginas' to="/transacoes"> <img src="/transfer-vertical.svg"/> Transações</NavLink>
                <NavLink className='paginas' to="/metas"> <DiamondIcon color="white" /> Metas</NavLink>
                <NavLink className='paginas' to="/settings"> <img src="/settings.svg"/> Configuração</NavLink>
            </nav>
        </div>

        <div className='profile'>
          <div className="profile-info">
              <div className='user-photo'><img src="/user.svg"/></div>
              <div className='profile-texts'>
                <p className="title-profile">Cliente Novix</p>
                <p className="description-profile">Plano free</p>
              </div>
          </div>
        </div>
    </aside>


      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout