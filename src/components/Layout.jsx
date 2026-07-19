import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Footer from './Footer.jsx'
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Tags,
  Settings as SettingsIcon,
  LogOut,
  Wallet,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const sidebarContent = (
    <>
      <div className="sidebar-logo">
        <Wallet size={22} />
        ExpenseTracker
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ padding: '0 8px', marginBottom: 10, fontSize: 13, color: '#9ca3af' }}>
          Signed in as<br />
          <strong style={{ color: '#fff' }}>{user?.name}</strong>
        </div>
        <button
          onClick={logout}
          className="sidebar-link"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="app-shell">
      {/* Mobile-only top bar with hamburger toggle */}
      <div className="mobile-topbar">
        <div className="sidebar-logo">
          <Wallet size={20} />
          ExpenseTracker
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Backdrop shown only when mobile drawer is open */}
      <div
        className={'sidebar-backdrop' + (menuOpen ? ' open' : '')}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={'sidebar' + (menuOpen ? ' open' : '')}>
        <button
          className="mobile-menu-btn"
          style={{ alignSelf: 'flex-end', marginBottom: 8, display: menuOpen ? 'flex' : 'none' }}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
        {sidebarContent}
      </aside>

      <main className="main-content">
        <div className="page-body">
                  <Outlet />
                </div>
                <Footer />
      </main>
    </div>
  )
}
