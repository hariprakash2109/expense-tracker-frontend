import axios from 'axios'
const API_BASE = "https://expense-tracker-backend-1vsy.onrender.com/api";
const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ---- Auth ----
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)

// ---- Categories ----
export const getCategories = () => api.get('/categories')
export const createCategory = (data) => api.post('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// ---- Expenses ----
export const getExpenses = (params) => api.get('/expenses', { params })
export const getExpense = (id) => api.get(`/expenses/${id}`)
export const createExpense = (data) => api.post('/expenses', data)
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)

// ---- Reports ----
export const getMonthlyReport = (year, month) =>
  api.get('/reports/monthly', { params: { year, month } })
export const getYearlyTrend = (year) =>
  api.get('/reports/yearly-trend', { params: { year } })
export const getBudgetStatus = () => api.get('/reports/budget-status')
export const updateBudget = (data) => api.put('/reports/budget', data)

// ---- Export ----
export const exportPdfUrl = (year, month) => `${API_BASE}/export/pdf?year=${year}&month=${month}`

export default api
