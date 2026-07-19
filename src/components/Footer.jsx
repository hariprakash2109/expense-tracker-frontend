import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Globe, Mail, Wallet } from 'lucide-react'

// TODO: Replace these sample values with your real details before sharing/deploying.
const DEV_NAME = 'HARI PRAKASH S'
const LINKS = {
  github: 'https://github.com/hariprakash2109',
  linkedin: 'https://linkedin.com/in/yourusername',
  portfolio: 'https://yourportfolio.dev',
  email: 'mailto:you@example.com',
}

const quickLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/reports', label: 'Reports' },
  { to: '/categories', label: 'Categories' },
  { to: '/settings', label: 'Settings' },
]

const socialLinks = [
  { href: LINKS.github, label: 'GitHub', icon: Github },
  { href: LINKS.linkedin, label: 'LinkedIn', icon: Linkedin },
  { href: LINKS.portfolio, label: 'Portfolio', icon: Globe },
  { href: LINKS.email, label: 'Email', icon: Mail },
]

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-grid">
        <div className="app-footer-col">
          <div className="app-footer-brand">
            <Wallet size={18} />
            ExpenseTracker
          </div>
          <p className="app-footer-tagline">
            Take control of your spending, one expense at a time.
          </p>
          
        </div>

        <div className="app-footer-col">
          <div className="app-footer-heading">Quick Links</div>
          <ul className="app-footer-list">
            {quickLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="app-footer-col">
          <div className="app-footer-heading">Connect With Me</div>
          <ul className="app-footer-list app-footer-social-list">
            {socialLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  <item.icon size={15} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="app-footer-bottom">
        <span>&copy; {year} ExpenseTracker. All rights reserved.</span>
        <span className="app-footer-dot">&middot;</span>
        <span>
          Developed by <strong className="app-footer-name">{DEV_NAME}</strong>
        </span>
      </div>
    </footer>
  )
}
