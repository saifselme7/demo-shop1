import { useEffect, useState, useRef } from 'react'
import { adminGetHeroes, adminUpdateHero, adminCreateHero, uploadHeroImage } from '../../services/admin/hero'

export default function AdminHero() {
  const [heroes, setHeroes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    id: '',
    eyebrow: '',
    title: '',
    description: '',
    primary_button_text: '',
    primary_button_link: '',
    secondary_button_text: '',
    secondary_button_link: '',
    background_image_url: '',
    background_image_alt: '',
    is_active: true,
  })

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminGetHeroes()
      setHeroes(data)
      if (data.length > 0) {
        const active = data.find((h) => h.is_active) || data[0]
        setForm({
          id: active.id,
          eyebrow: active.eyebrow,
          title: active.title,
          description: active.description,
          primary_button_text: active.primary_button_text,
          primary_button_link: active.primary_button_link,
          secondary_button_text: active.secondary_button_text,
          secondary_button_link: active.secondary_button_link,
          background_image_url: active.background_image_url,
          background_image_alt: active.background_image_alt || '',
          is_active: active.is_active,
        })
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const url = await uploadHeroImage(file)
      setForm((prev) => ({ ...prev, background_image_url: url }))
    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      if (!form.eyebrow || !form.title || !form.background_image_url) {
        throw new Error('Eyebrow, title and background image are required')
      }
      if (form.id) {
        await adminUpdateHero(form.id, {
          eyebrow: form.eyebrow,
          title: form.title,
          description: form.description,
          primary_button_text: form.primary_button_text,
          primary_button_link: form.primary_button_link,
          secondary_button_text: form.secondary_button_text,
          secondary_button_link: form.secondary_button_link,
          background_image_url: form.background_image_url,
          background_image_alt: form.background_image_alt,
          is_active: form.is_active,
        })
        setSuccess('Hero updated — homepage will reflect changes after refresh')
      } else {
        const created = await adminCreateHero({
          eyebrow: form.eyebrow,
          title: form.title,
          description: form.description,
          primary_button_text: form.primary_button_text,
          primary_button_link: form.primary_button_link,
          secondary_button_text: form.secondary_button_text,
          secondary_button_link: form.secondary_button_link,
          background_image_url: form.background_image_url,
          background_image_alt: form.background_image_alt,
          is_active: true,
        })
        setForm((prev) => ({ ...prev, id: created.id }))
        setSuccess('Hero created and set active')
      }
      await load()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-12"><span className="eyebrow">Loading hero...</span></div>

  return (
    <div className="flex flex-col gap-8 max-w-[900px]">
      <div>
        <span className="eyebrow mb-2 block">— Hero CMS</span>
        <h1 className="font-display text-3xl tracking-ultra-tight">Hero Content — Admin</h1>
        <p className="mt-2 text-[12px] text-muted">Manage homepage hero. Only one hero active at a time (enforced by DB trigger). Changes appear in storefront after refresh.</p>
      </div>

      <form onSubmit={handleSave} className="border border-line p-5 md:p-6 bg-cream flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="eyebrow">Eyebrow</label>
          <input value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="THE ATELIER" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Title (use newline for line breaks)</label>
          <textarea value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} rows={3} className="border border-line bg-paper px-4 py-3 text-[14px] font-display tracking-ultra-tight focus:outline-none focus:border-ink" placeholder={"Garments for\nthe considered\nlife."} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Primary Button Text</label>
            <input value={form.primary_button_text} onChange={(e) => setForm({ ...form, primary_button_text: e.target.value })} className="border border-line bg-paper px-4 py-3 text-[12px] uppercase tracking-wide-lg focus:outline-none focus:border-ink min-h-[44px]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Primary Button Link</label>
            <input value={form.primary_button_link} onChange={(e) => setForm({ ...form, primary_button_link: e.target.value })} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="/shop" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Secondary Button Text</label>
            <input value={form.secondary_button_text} onChange={(e) => setForm({ ...form, secondary_button_text: e.target.value })} className="border border-line bg-paper px-4 py-3 text-[12px] uppercase tracking-wide-lg focus:outline-none focus:border-ink min-h-[44px]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Secondary Button Link</label>
            <input value={form.secondary_button_link} onChange={(e) => setForm({ ...form, secondary_button_link: e.target.value })} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="/about" />
          </div>
        </div>

        <div className="flex flex-col gap-3 border border-line p-4 bg-paper">
          <span className="eyebrow">Background Image — Supabase Storage hero-images</span>
          <div className="flex flex-col sm:flex-row gap-3">
            <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFile} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="border border-ink bg-paper px-6 py-3 text-[11px] uppercase tracking-wide-lg hover:bg-ink hover:text-paper disabled:opacity-50 min-h-[44px]">
              {uploading ? 'Uploading...' : 'Upload Hero Image (max 5MB)'}
            </button>
            <input value={form.background_image_url} onChange={(e) => setForm({ ...form, background_image_url: e.target.value })} placeholder="Or paste image URL" className="border border-line bg-cream px-4 py-2.5 text-[12px] flex-1 min-h-[44px] focus:outline-none focus:border-ink" />
          </div>
          {uploadError && <div className="text-[11px] text-ochre">{uploadError}</div>}
          {form.background_image_url && (
            <div className="relative h-[200px] md:h-[300px] overflow-hidden border border-line">
              <img src={form.background_image_url} alt={form.background_image_alt} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Image Alt Text</label>
            <input value={form.background_image_alt} onChange={(e) => setForm({ ...form, background_image_alt: e.target.value })} className="border border-line bg-cream px-4 py-2.5 text-[12px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="SAIF STORE AW Reserve" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-[12px] uppercase tracking-wide-lg cursor-pointer min-h-[44px]">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active (only one active at a time)
        </label>

        {error && <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] text-ochre whitespace-pre-wrap break-words">{error}</div>}
        {success && <div className="border border-green-700/30 bg-green-700/10 px-4 py-3 text-[12px] text-green-800">{success}</div>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving || uploading} className="bg-ink text-paper px-8 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]">
            {saving ? 'Saving...' : 'Save Hero'}
          </button>
          <button type="button" onClick={load} className="border border-line px-8 py-3 text-[11px] uppercase tracking-wide-lg hover:border-ink min-h-[44px]">Cancel / Reload</button>
        </div>
      </form>

      <div className="border border-line p-5 bg-paper">
        <span className="eyebrow mb-3 block">Preview — Title / Description / Buttons</span>
        <div className="bg-ink text-paper p-6 md:p-8 flex flex-col gap-4">
          <span className="eyebrow text-paper/60">{form.eyebrow}</span>
          <h2 className="font-display text-2xl md:text-4xl tracking-ultra-tight leading-[0.9] whitespace-pre-line">{form.title}</h2>
          <p className="text-[13px] text-paper/80 max-w-[400px]">{form.description}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="border border-paper text-paper px-6 py-3 text-[11px] uppercase tracking-wide-lg">{form.primary_button_text}</span>
            <span className="border border-paper/50 text-paper/80 px-6 py-3 text-[11px] uppercase tracking-wide-lg">{form.secondary_button_text}</span>
          </div>
        </div>
      </div>

      {heroes.length > 1 && (
        <div className="border border-line p-4">
          <span className="eyebrow mb-3 block">All Heroes ({heroes.length})</span>
          <div className="flex flex-col gap-2">
            {heroes.map((h) => (
              <div key={h.id} className="flex justify-between items-center border border-line p-3 bg-cream text-[12px]">
                <span className="font-mono text-[11px] truncate max-w-[200px]">{h.id} — {h.is_active ? 'ACTIVE' : 'inactive'}</span>
                <span className="truncate max-w-[200px]">{h.eyebrow}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
