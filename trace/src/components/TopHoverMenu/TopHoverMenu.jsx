import './TopHoverMenu.css'

const menuItems = [
  { label: 'Home', href: '/HomePage' },
  { label: 'Learn', href: '/' },
  { label: 'Gallery', href: '/Gallery' },
  { label: 'Make', href: '/make' },
]

function TopHoverMenu() {
  return (
    <nav className="top-hover-menu" aria-label="Primary navigation">
      <div className="top-hover-menu__bar">
        {menuItems.map((item, index) => (
          <a
            className="top-hover-menu__link"
            href={item.href}
            key={item.label}
            style={{ '--menu-delay': `${index * 58}ms` }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default TopHoverMenu
