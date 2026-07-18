import React, { useEffect, useState } from 'react'
import { getExpenses, deleteExpense, getCategories } from '../services/api'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { format } from 'date-fns'
import ExpenseModal from '../components/ExpenseModal.jsx'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    loadCategories()
    loadExpenses()
  }, [])

  const loadCategories = async () => {
    const res = await getCategories()
    setCategories(res.data)
  }

  const loadExpenses = async (params = {}) => {
    setLoading(true)
    try {
      const res = await getExpenses(params)
      setExpenses(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    const params = {}
    if (search) params.search = search
    if (categoryFilter) params.categoryId = categoryFilter
    loadExpenses(params)
  }

  useEffect(() => {
    const t = setTimeout(handleFilter, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    await deleteExpense(id)
    loadExpenses()
  }

  const openAddModal = () => {
    setEditingExpense(null)
    setModalOpen(true)
  }

  const openEditModal = (expense) => {
    setEditingExpense(expense)
    setModalOpen(true)
  }

  const handleSaved = () => {
    setModalOpen(false)
    loadExpenses()
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-title">Expenses</div>
          <div style={{ color: '#6b7280', fontSize: 14 }}>{expenses.length} transactions · ₹{total.toLocaleString()} total</div>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#9ca3af' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 36, width: '100%' }}
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div>Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">No expenses found. Try adjusting filters or add a new expense.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.title}
                    {e.notes && <div style={{ fontSize: 12, color: '#9ca3af' }}>{e.notes}</div>}
                  </td>
                  <td>
                    <span className="badge" style={{ background: e.categoryColor + '20', color: e.categoryColor }}>
                      {e.categoryName}
                    </span>
                  </td>
                  <td>{e.paymentMethod}</td>
                  <td>{format(new Date(e.date), 'd MMM yyyy')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{e.amount.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" onClick={() => openEditModal(e)}><Pencil size={16} /></button>
                    <button className="icon-btn" onClick={() => handleDelete(e.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <ExpenseModal
          expense={editingExpense}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
