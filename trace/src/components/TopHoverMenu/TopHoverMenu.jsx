import { Link } from 'react-router-dom'
import './TopHoverMenu.css'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Learn', href: '/Learn' },
  { label: 'Gallery', href: '/Gallery' },
  { label: 'Make', href: '/make' },
]

function TopHoverMenu() {
  return (
    <nav className="top-hover-menu" aria-label="Primary navigation">
      <div className="top-hover-menu__bar">
        {menuItems.map((item, index) => (
          <Link
            className="top-hover-menu__link"
            key={item.label}
            style={{ '--menu-delay': `${index * 58}ms` }}
            to={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default TopHoverMenu
