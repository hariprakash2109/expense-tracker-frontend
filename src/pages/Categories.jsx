import React, { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'

const colorPalette = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6', '#f97316']

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(colorPalette[0])
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await getCategories()
      setCategories(res.data)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setName('')
    setColor(colorPalette[0])
    setError('')
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setName(cat.name)
    setColor(cat.color)
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Category name is required.')
      return
    }
    try {
      if (editing) {
        await updateCategory(editing.id, { name, color, icon: 'tag' })
      } else {
        await createCategory({ name, color, icon: 'tag' })
      }
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This only works if it has no expenses.')) return
    try {
      await deleteCategory(id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category.')
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="page-title">Categories</div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-4">
          {categories.map((c) => (
            <div className="card" key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10, background: c.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Tag size={18} color={c.color} />
              </div>
              <div style={{ flex: 1, fontWeight: 600 }}>{c.name}</div>
              <button className="icon-btn" onClick={() => openEdit(c)}><Pencil size={15} /></button>
              <button className="icon-btn" onClick={() => handleDelete(c.id)}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h2 style={{ margin: 0, fontSize: 18 }}>{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button className="icon-btn" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {colorPalette.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        width: 30, height: 30, borderRadius: '50%', background: c, border: color === c ? '3px solid #1f2937' : 'none',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>
              {error && <div className="error-text">{error}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
