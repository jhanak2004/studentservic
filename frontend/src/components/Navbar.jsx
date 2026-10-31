import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const openLogin  = () => { setAuthMode('login');  setShowAuth(true) }
  const openSignup = () => { setAuthMode('signup'); setShowAuth(true) }

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = [
    { to: '/',            label: 'Home' },
    { to: '/services',    label: 'Services' },
    { to: '/scholarship', label: 'Affidavit' },
    { to: '/track',       label: 'Track Order' },
  ]

  return (
    <>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>Study<span>Serve</span></Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={location.pathname === l.to ? styles.active : ''} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          {user && <li><Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link></li>}
        </ul>

        <div className={styles.cta}>
          {user ? (
            <>
              <span className={styles.userName}>👋 {user.name.split(' ')[0]}</span>
              <button className={styles.btnLogin} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className={styles.btnLogin}  onClick={openLogin}>Login</button>
              <button className={styles.btnPrimary} onClick={openSignup}>Sign Up</button>
            </>
          )}
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onSwitch={setAuthMode} />}
    </>
  )
}
