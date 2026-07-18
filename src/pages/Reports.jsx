import React, { useEffect, useState } from 'react'
import { getMonthlyReport, exportPdfUrl } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { format } from 'date-fns'

export default function Reports() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReport()
  }, [year, month])

  const loadReport = async () => {
    setLoading(true)
    try {
      const res = await getMonthlyReport(year, month)
      setReport(res.data)
    } finally {
      setLoading(false)
    }
  }

  const changeMonth = (delta) => {
    let newMonth = month + delta
    let newYear = year
    if (newMonth < 1) { newMonth = 12; newYear -= 1 }
    if (newMonth > 12) { newMonth = 1; newYear += 1 }
    setMonth(newMonth)
    setYear(newYear)
  }

  const handleExport = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(exportPdfUrl(year, month), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get("content-type"));

  if (!res.ok) {
    console.log(await res.text());
    alert("Export failed");
    return;
  }

  const blob = await res.blob();

  console.log("Blob Type:", blob.type);
  console.log("Blob Size:", blob.size);

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.pdf";
  a.click();

  window.URL.revokeObjectURL(url);
};

  const monthLabel = format(new Date(year, month - 1), 'MMMM yyyy')

  return (
    <div>
      <div className="topbar">
        <div className="page-title">Monthly Reports</div>
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="month-nav" style={{ justifyContent: 'center' }}>
          <button className="icon-btn" onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
          <span style={{ minWidth: 160, textAlign: 'center' }}>{monthLabel}</span>
          <button className="icon-btn" onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
        </div>
      </div>

      {loading ? (
        <div>Loading report...</div>
      ) : (
        <>
          <div className="grid grid-3" style={{ marginBottom: 20 }}>
            <div className="card stat-card">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value">₹{report.totalSpent.toLocaleString()}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Budget</div>
              <div className="stat-value">₹{report.budget.toLocaleString()}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Remaining</div>
              <div className="stat-value" style={{ color: report.remaining >= 0 ? '#10b981' : '#ef4444' }}>
                ₹{report.remaining.toLocaleString()}
              </div>
            </div>
          </div>

          {report.budget > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span>Budget Usage</span>
                <span>{Math.min(100, Math.round((report.totalSpent / report.budget) * 100))}%</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(100, (report.totalSpent / report.budget) * 100)}%`,
                    background: report.budgetExceeded ? '#ef4444' : '#6366f1',
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Category Breakdown</h3>
              {report.categoryBreakdown.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={report.categoryBreakdown}
                      dataKey="total"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(d) => `${d.percentage}%`}
                    >
                      {report.categoryBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">No data for this month.</div>
              )}
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>Spending by Category</h3>
              {report.categoryBreakdown.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={report.categoryBreakdown} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" fontSize={12} />
                    <YAxis dataKey="categoryName" type="category" width={100} fontSize={12} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                    <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                      {report.categoryBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">No data for this month.</div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Category Table</h3>
            {report.categoryBreakdown.length === 0 ? (
              <div className="empty-state">No expenses recorded this month.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th style={{ textAlign: 'right' }}>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.categoryBreakdown.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <span className="badge" style={{ background: c.color + '20', color: c.color }}>{c.categoryName}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{c.total.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>{c.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
