import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { getMonthlyReport, getBudgetStatus, getExpenses } from '../services/api'
import { Wallet, TrendingDown, TrendingUp, Target } from 'lucide-react'
import BudgetAlert from '../components/BudgetAlert.jsx'
import { format } from 'date-fns'

export default function Dashboard() {
  const now = new Date()
  const [report, setReport] = useState(null)
  const [budgetStatus, setBudgetStatus] = useState(null)
  const [recentExpenses, setRecentExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [reportRes, budgetRes, expensesRes] = await Promise.all([
        getMonthlyReport(now.getFullYear(), now.getMonth() + 1),
        getBudgetStatus(),
        getExpenses(),
      ])
      setReport(reportRes.data)
      setBudgetStatus(budgetRes.data)
      setRecentExpenses(expensesRes.data.slice(0, 5))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading dashboard...</div>

  const avgDaily = report?.dailyTotals?.length
    ? report.totalSpent / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    : 0;

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">Dashboard</div>
          <div style={{ color: '#6b7280', fontSize: 14 }}>{format(now, 'MMMM yyyy')} overview</div>
        </div>
      </div>

      <BudgetAlert status={budgetStatus} />

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-label"><Wallet size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Total Spent</div>
          <div className="stat-value">₹{report?.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label"><Target size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Monthly Budget</div>
          <div className="stat-value">₹{report?.budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">
            {report?.remaining >= 0
              ? <TrendingUp size={14} style={{ verticalAlign: 'middle', marginRight: 4, color: '#10b981' }} />
              : <TrendingDown size={14} style={{ verticalAlign: 'middle', marginRight: 4, color: '#ef4444' }} />}
            Remaining
          </div>
          <div className="stat-value" style={{ color: report?.remaining >= 0 ? '#10b981' : '#ef4444' }}>
            ₹{report?.remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Avg. Daily Spend</div>
          <div className="stat-value">₹{avgDaily.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24, alignItems: 'stretch' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Spending by Category</h3>
          {report?.categoryBreakdown?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={report.categoryBreakdown}
                  dataKey="total"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(d) => `${d.categoryName} (${d.percentage}%)`}
                >
                  {report.categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">No expenses this month yet.</div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Daily Spending Trend</h3>
          {report?.dailyTotals?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={report.dailyTotals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), 'd MMM')} fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  labelFormatter={(d) => format(new Date(d), 'd MMM yyyy')}
                  formatter={(v) => [`₹${v.toLocaleString()}`, 'Spent']}
                />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">No expenses this month yet.</div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Recent Expenses</h3>
        {recentExpenses.length === 0 ? (
          <div className="empty-state">No expenses yet. Start by adding one!</div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((e) => (
                  <tr key={e.id}>
                    <td>{e.title}</td>
                    <td>
                      <span className="badge" style={{ background: e.categoryColor + '20', color: e.categoryColor }}>
                        {e.categoryName}
                      </span>
                    </td>
                    <td>{format(new Date(e.date), 'd MMM yyyy')}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{e.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
