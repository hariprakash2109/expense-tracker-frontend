import React, { useEffect, useState } from 'react'
import { updateBudget, getBudgetStatus } from '../services/api'
import { useAuth } from '../context/AuthContext.jsx'
import BudgetAlert from '../components/BudgetAlert.jsx'

export default function Settings() {
  const { user, updateLocalBudget } = useAuth()
  const [budget, setBudget] = useState(user?.monthlyBudget || 0)
  const [status, setStatus] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    const res = await getBudgetStatus()
    setStatus(res.data)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateBudget({ monthlyBudget: parseFloat(budget) })
      updateLocalBudget(parseFloat(budget))
      setSaved(true)
      loadStatus()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="page-title">Settings</div>
      </div>

      <BudgetAlert status={status} />

      <div className="card" style={{ maxWidth: 480 }}>
        <h3 style={{ marginTop: 0 }}>Monthly Budget & Alerts</h3>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          Set a monthly spending budget. You'll get a warning at 80% usage and an alert if you exceed it.
        </p>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Monthly Budget (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
          {saved && <span style={{ marginLeft: 12, color: '#10b981', fontSize: 14 }}>Saved!</span>}
        </form>
      </div>

      <div className="card" style={{ maxWidth: 480, marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Account</h3>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>Name</div>
        <div style={{ marginBottom: 14, fontWeight: 600 }}>{user?.name}</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>Email</div>
        <div style={{ fontWeight: 600 }}>{user?.email}</div>
      </div>
    </div>
  )
}
