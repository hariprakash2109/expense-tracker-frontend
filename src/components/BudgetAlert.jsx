import React from 'react'
import { AlertTriangle, AlertCircle } from 'lucide-react'

export default function BudgetAlert({ status }) {
  if (!status || !status.budget || status.budget <= 0) return null

  if (status.exceeded) {
    return (
      <div className="alert alert-danger">
        <AlertCircle size={18} />
        <div>
          <strong>Budget exceeded!</strong> You've spent ₹{status.spent.toLocaleString()} of your
          ₹{status.budget.toLocaleString()} monthly budget ({status.percentUsed}% used).
        </div>
      </div>
    )
  }

  if (status.nearLimit) {
    return (
      <div className="alert alert-warning">
        <AlertTriangle size={18} />
        <div>
          <strong>Approaching budget limit.</strong> You've used {status.percentUsed}% of your
          ₹{status.budget.toLocaleString()} monthly budget.
        </div>
      </div>
    )
  }

  return null
}
