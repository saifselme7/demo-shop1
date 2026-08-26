import { useEffect, useState } from 'react'
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../services/admin/categories'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ id: '', name: '', slug: '', description: '', image_url: '' })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminGetCategories()
      setCategories(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editing) {
        await adminUpdateCategory(editing, { name: form.name, slug: form.slug, description: form.description, image_url: form.image_url })
      } else {
        await adminCreateCategory({ id: form.id || form.slug, name: form.name, slug: form.slug, description: form.description, image_url: form.image_url })
      }
      setForm({ id: '', name: '', slug: '', description: '', image_url: '' })
      setEditing(null)
      await load()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cat: any) => {
    setForm({ id: cat.id, name: cat.name, slug: cat.slug, description: cat.description || '', image_url: cat.image_url || '' })
    setEditing(cat.id)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category \"${name}\"? Products referencing it must be reassigned first.`)) return
    try {
      await adminDeleteCategory(id)
      await load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[800px]">
      <div>
        <span className="eyebrow mb-2 block">— Categories</span>
        <h1 className="font-display text-3xl tracking-ultra-tight">Categories</h1>
      </div>

      <form onSubmit={handleSubmit} className="border border-line p-6 bg-cream flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">ID</label>
            <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editing} placeholder="outerwear" className="border border-line px-4 py-2.5 text-[13px] bg-paper disabled:opacity-60 focus:outline-none focus:border-ink" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Slug *</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" placeholder="outerwear" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="eyebrow">Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="eyebrow">Description</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="eyebrow">Image URL</label>
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="border border-line px-4 py-2.5 text-[12px] bg-paper focus:outline-none focus:border-ink" />
        </div>
        {error && <div className="text-[12px] text-ochre border border-ochre/20 bg-ochre/10 px-3 py-2">{error}</div>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-ink text-paper px-6 py-2.5 text-[11px] uppercase tracking-wide-lg disabled:opacity-50">
            {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ id: '', name: '', slug: '', description: '', image_url: '' }) }} className="border border-line px-6 py-2.5 text-[11px] uppercase">Cancel</button>}
        </div>
      </form>

      {loading ? (
        <div className="h-20 bg-cream animate-pulse border border-line" />
      ) : (
        <div className="border border-line">
          <table className="w-full text-left hidden md:table">
            <thead className="bg-cream border-b border-line text-[11px] uppercase tracking-wide-lg text-muted">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-line text-[13px]">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.slug}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => handleEdit(c)} className="link-line text-[11px] uppercase">Edit</button>
                    <button onClick={() => handleDelete(c.id, c.name)} className="link-line text-[11px] uppercase text-ochre">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden flex flex-col">
            {categories.map((c) => (
              <div key={c.id} className="border-b border-line p-4 flex justify-between">
                <span className="font-medium text-[13px]">{c.name} — {c.slug}</span>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(c)} className="text-[11px] uppercase link-line">Edit</button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="text-[11px] uppercase link-line text-ochre">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
