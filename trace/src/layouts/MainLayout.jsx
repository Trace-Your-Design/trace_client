import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
]

function MainLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Trace home">
          Trace
        </NavLink>
        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link is-active' : 'nav-link'
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
