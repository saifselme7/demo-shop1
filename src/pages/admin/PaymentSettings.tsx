import { useEffect, useState } from 'react'
import {
  getPaymentSettings,
  adminUpdatePaymentSettings,
  PaymentSettings,
} from '../../services/paymentSettings'

export default function AdminPaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getPaymentSettings(true)
      .then(setSettings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const set = <K extends keyof PaymentSettings>(key: K, value: PaymentSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))
    setSaved(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setError(null)
    try {
      const updated = await adminUpdatePaymentSettings(settings)
      setSettings(updated)
      setSaved(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-12"><span className="eyebrow">Loading payment settings...</span></div>
  if (!settings) return <div className="py-12 text-ochre">{error || 'Unable to load payment settings.'}</div>

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-[820px]">
      <div>
        <span className="eyebrow mb-2 block">— Payment Settings</span>
        <h1 className="font-display text-3xl tracking-ultra-tight">Manual Payment Methods</h1>
        <p className="mt-2 text-[12px] text-muted">
          Enable or disable manual payment methods and configure the transfer destinations shown at checkout.
        </p>
      </div>

      {error && <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] text-ochre break-words">{error}</div>}
      {saved && <div className="border border-ink/20 bg-ink/5 px-4 py-3 text-[12px]">Payment settings saved.</div>}

      {/* Cash on Delivery */}
      <section className="border border-line bg-cream p-6 flex flex-col gap-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={settings.cod_enabled} onChange={(e) => set('cod_enabled', e.target.checked)} className="h-4 w-4 accent-ink" />
          <span className="text-[12px] uppercase tracking-wide-lg font-medium">{settings.cod_label}</span>
        </label>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-wide-lg">Label</label>
          <input value={settings.cod_label} onChange={(e) => set('cod_label', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-wide-lg">Instructions shown at checkout</label>
          <textarea value={settings.cod_instructions} onChange={(e) => set('cod_instructions', e.target.value)} rows={2} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" />
        </div>
      </section>

      {/* InstaPay */}
      <section className="border border-line bg-cream p-6 flex flex-col gap-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={settings.instapay_enabled} onChange={(e) => set('instapay_enabled', e.target.checked)} className="h-4 w-4 accent-ink" />
          <span className="text-[12px] uppercase tracking-wide-lg font-medium">{settings.instapay_label}</span>
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wide-lg">InstaPay address / handle</label>
            <input value={settings.instapay_account} onChange={(e) => set('instapay_account', e.target.value)} placeholder="yourstore@instapay" className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px] font-mono" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wide-lg">Account name</label>
            <input value={settings.instapay_account_name} onChange={(e) => set('instapay_account_name', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-wide-lg">Instructions</label>
          <textarea value={settings.instapay_instructions} onChange={(e) => set('instapay_instructions', e.target.value)} rows={3} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" />
        </div>
      </section>

      {/* Vodafone Cash */}
      <section className="border border-line bg-cream p-6 flex flex-col gap-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={settings.vodafone_enabled} onChange={(e) => set('vodafone_enabled', e.target.checked)} className="h-4 w-4 accent-ink" />
          <span className="text-[12px] uppercase tracking-wide-lg font-medium">{settings.vodafone_label}</span>
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wide-lg">Vodafone Cash number</label>
            <input value={settings.vodafone_number} onChange={(e) => set('vodafone_number', e.target.value)} placeholder="01040324811" dir="ltr" className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px] font-mono" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wide-lg">Wallet name</label>
            <input value={settings.vodafone_account_name} onChange={(e) => set('vodafone_account_name', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] uppercase tracking-wide-lg">Instructions</label>
          <textarea value={settings.vodafone_instructions} onChange={(e) => set('vodafone_instructions', e.target.value)} rows={3} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" />
        </div>
      </section>

      <button type="submit" disabled={saving} className="self-start bg-ink text-paper px-8 py-4 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]">
        {saving ? 'Saving...' : 'Save Payment Settings'}
      </button>
    </form>
  )
}
