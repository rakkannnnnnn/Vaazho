import { useEffect, useMemo, useState } from "react";
import { PencilLine, Plus, Trash2, Wallet } from "lucide-react";

import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "@/services/expenseService";

const emptyForm = () => ({
  title: "",
  category: "Travel",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
});

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [plannedBudget, setPlannedBudget] = useState(25000);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getExpenses();
      setExpenses(response?.expenses || []);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const actualSpending = useMemo(
    () => expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0),
    [expenses]
  );

  const remainingBudget = plannedBudget - actualSpending;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = form.title.trim();
    const trimmedCategory = form.category.trim();
    const numericAmount = Number(form.amount);

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!trimmedCategory) {
      setError("Category is required.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Amount must be a valid positive number.");
      return;
    }

    if (!form.date) {
      setError("Date is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: trimmedTitle,
        category: trimmedCategory,
        amount: numericAmount,
        date: form.date,
        description: form.description.trim(),
      };

      if (editingId) {
        await updateExpense(editingId, payload);
        setSuccess("Expense updated successfully.");
      } else {
        await createExpense(payload);
        setSuccess("Expense added successfully.");
      }

      resetForm();
      await fetchExpenses();
    } catch (err) {
      setError(err.message || "Unable to save expense.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : "",
      description: expense.description || "",
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      setError("");
      setSuccess("");
      await deleteExpense(expenseId);
      setSuccess("Expense deleted successfully.");
      await fetchExpenses();
      if (editingId === expenseId) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Unable to delete expense.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Budget planner
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Expense Tracker</h1>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Wallet className="h-4 w-4 text-neutral-500" />
              Planned Budget
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={plannedBudget}
              onChange={(event) => setPlannedBudget(Number(event.target.value) || 0)}
              className="mt-2 w-40 rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-lg font-semibold outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">Planned Budget</p>
            <p className="mt-3 text-2xl font-bold">{currency.format(plannedBudget)}</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">Actual Spending</p>
            <p className="mt-3 text-2xl font-bold text-red-600">{currency.format(actualSpending)}</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">Remaining Budget</p>
            <p className={`mt-3 text-2xl font-bold ${remainingBudget >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
              {currency.format(remainingBudget)}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingId ? "Edit Expense" : "Add Expense"}</h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 outline-none focus:border-neutral-900"
                  placeholder="e.g. Airport transfer"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 outline-none focus:border-neutral-900"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Activities">Activities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 outline-none focus:border-neutral-900"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 outline-none focus:border-neutral-900"
                  placeholder="Optional notes"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (editingId ? "Updating..." : "Saving...") : (
                  editingId ? <><PencilLine className="h-4 w-4" /> Update Expense</> : <><Plus className="h-4 w-4" /> Add Expense</>
                )}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Expense List</h2>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                {expenses.length} records
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-20 animate-pulse rounded-2xl bg-neutral-200" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                No expenses yet. Add your first trip cost to track your budget.
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense._id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold">{expense.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                          <span className="rounded-full bg-white px-2 py-1">{expense.category}</span>
                          <span>{new Date(expense.date).toLocaleDateString("en-IN")}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-neutral-900">{currency.format(expense.amount)}</p>
                      </div>
                    </div>

                    {expense.description && (
                      <p className="mt-3 text-sm text-neutral-600">{expense.description}</p>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(expense)}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(expense._id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses;
