import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart, cartTotal } from '../store/cart'
import { formatPrice } from '../lib/utils'
import { createOrder } from '../services/orders'
import { getPaymentSettings, PaymentSettings } from '../services/paymentSettings'
import {
  uploadPaymentProof,
  validatePaymentProofFile,
} from '../services/paymentProofs'
import SafeImage from '../components/ui/SafeImage'

type Method = 'cod' | 'instapay' | 'vodafone'

interface MethodDef {
  id: Method
  label: string
  description: string
  requiresProof: boolean
}

export default function Checkout() {
  const { items, clear } = useCart()
  const navigate = useNavigate()
  const total = cartTotal(items)
  const shipping = 0
  const grandTotal = total + shipping

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    country: 'Egypt',
    city: '',
    address: '',
    apartment: '',
    notes: '',
    payment_method: 'cod' as Method,
  })

  const [settings, setSettings] = useState<PaymentSettings | null>(null)
  const [settingsError, setSettingsError] = useState<string | null>(null)

  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [proofError, setProofError] = useState<string | null>(null)
  const [paymentReference, setPaymentReference] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getPaymentSettings()
      .then(setSettings)
      .catch((e) => {
        console.error('payment settings', e)
        setSettingsError('Could not load payment instructions. Please try again.')
      })
  }, [])

  const allMethods: MethodDef[] = [
    {
      id: 'cod',
      label: settings?.cod_label || 'Cash on Delivery',
      description: 'Pay in cash when your order arrives at your door. No payment proof required.',
      requiresProof: false,
    },
    {
      id: 'instapay',
      label: settings?.instapay_label || 'InstaPay',
      description: 'Manual transfer via InstaPay — send payment, then upload a screenshot of the transfer.',
      requiresProof: true,
    },
    {
      id: 'vodafone',
      label: settings?.vodafone_label || 'Vodafone Cash',
      description: 'Manual Vodafone Cash wallet transfer — send payment, then upload a screenshot.',
      requiresProof: true,
    },
  ]

  const methods = allMethods.filter((m) => {
    if (!settings) return true
    if (m.id === 'cod') return settings.cod_enabled
    if (m.id === 'instapay') return settings.instapay_enabled
    if (m.id === 'vodafone') return settings.vodafone_enabled
    return true
  })

  // Ensure the selected method is still available (e.g. admin disabled it)
  useEffect(() => {
    if (!settings) return
    setForm((prev) => {
      const enabled =
        (prev.payment_method === 'cod' && settings.cod_enabled) ||
        (prev.payment_method === 'instapay' && settings.instapay_enabled) ||
        (prev.payment_method === 'vodafone' && settings.vodafone_enabled)
      return enabled ? prev : { ...prev, payment_method: 'cod' as Method }
    })
  }, [settings])

  // Reset proof when switching to COD
  useEffect(() => {
    if (form.payment_method === 'cod') {
      setProofFile(null)
      setProofPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setProofError(null)
    }
  }, [form.payment_method])

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (proofPreview) URL.revokeObjectURL(proofPreview)
    }
  }, [proofPreview])

  if (items.length === 0) {
    return (
      <div className="container-ecru py-24 md:py-32 text-center">
        <span className="eyebrow mb-4 block">— Checkout</span>
        <p className="font-display text-3xl tracking-ultra-tight">Your cart is empty.</p>
        <Link to="/shop" className="mt-8 inline-block btn-underline text-[11px] uppercase tracking-wide-lg min-h-[44px]">Browse the collection</Link>
      </div>
    )
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setProofError(null)
    if (!file) return
    try {
      validatePaymentProofFile(file)
      setProofFile(file)
      if (proofPreview) URL.revokeObjectURL(proofPreview)
      setProofPreview(URL.createObjectURL(file))
    } catch (err: any) {
      setProofFile(null)
      setProofPreview((p) => {
        if (p) URL.revokeObjectURL(p)
        return null
      })
      setProofError(err.message)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeProof = () => {
    setProofFile(null)
    if (proofPreview) URL.revokeObjectURL(proofPreview)
    setProofPreview(null)
    setProofError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const requiresProof = form.payment_method !== 'cod'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setProofError(null)

    try {
      if (!form.customer_name || !form.customer_email || !form.customer_phone || !form.country || !form.city || !form.address) {
        throw new Error('Please fill all required fields')
      }

      // Proof is mandatory for manual transfer methods BEFORE anything is created
      if (requiresProof && !proofFile) {
        setProofError('Please upload a screenshot of your payment before placing the order.')
        // Scroll the proof area into view on mobile
        fileInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        throw new Error('Payment proof screenshot is required for InstaPay and Vodafone Cash.')
      }

      setLoading(true)

      // 1) Upload proof first (so an upload failure never creates an order and never clears the cart)
      let proofPath: string | null = null
      if (requiresProof && proofFile) {
        try {
          const uploaded = await uploadPaymentProof(proofFile)
          proofPath = uploaded.path
        } catch (upErr: any) {
          throw new Error(`Payment proof upload failed: ${upErr.message || upErr}. Your cart is kept — please retry.`)
        }
      }

      // 2) Create the order with the proof reference. Only after BOTH succeed is the cart cleared.
      const order = await createOrder({
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        country: form.country,
        city: form.city,
        address: form.address,
        apartment: form.apartment,
        notes: form.notes,
        payment_method: form.payment_method,
        payment_reference: paymentReference.trim() || null,
        payment_proof_path: proofPath,
        payment_proof_url: proofPath, // private bucket — path is the stable reference
        payment_status: requiresProof ? 'proof_submitted' : 'pending',
        subtotal: total,
        shipping,
        total: grandTotal,
        currency: '€',
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_slug: item.slug,
          color_name: item.color,
          color_hex: '#000000',
          size: item.size,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
          product_image: item.image,
        })),
      })

      // 3) Success — only now clear the cart.
      if (proofPreview) URL.revokeObjectURL(proofPreview)
      clear()
      navigate(`/order-success/${order.order_number}`)
    } catch (err: any) {
      console.error('Order creation failed', err)
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container-ecru-wide py-8 md:py-12 lg:py-20"
    >
      <div className="mb-8 md:mb-10">
        <span className="eyebrow mb-3 block">— Checkout</span>
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-ultra-tight">Checkout</h1>
        <p className="mt-3 text-[12px] md:text-[13px] text-muted max-w-[480px] leading-relaxed">
          Choose cash on delivery or a manual transfer. No card details are ever collected.
          Manual-transfer orders are confirmed after we verify your payment.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
        <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6 md:gap-8">
          <div className="border border-line p-5 md:p-6 bg-cream">
            <span className="eyebrow mb-4 block">Customer Information</span>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Full Name *</label>
                <input required value={form.customer_name} onChange={(e) => handleChange('customer_name', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="Saif Ahmed" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Phone Number *</label>
                <input required value={form.customer_phone} onChange={(e) => handleChange('customer_phone', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="+20 100 123 4567" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Email *</label>
                <input required type="email" value={form.customer_email} onChange={(e) => handleChange('customer_email', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="saif@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Country *</label>
                <input required value={form.country} onChange={(e) => handleChange('country', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">City *</label>
                <input required value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="Cairo" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Address *</label>
                <input required value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="Street, area" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Apartment / Building / Floor</label>
                <input value={form.apartment} onChange={(e) => handleChange('apartment', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="Optional" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Notes</label>
                <input value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]" placeholder="Optional" />
              </div>
            </div>
          </div>

          <div className="border border-line p-5 md:p-6 bg-cream">
            <span className="eyebrow mb-4 block">Payment Method</span>
            {settingsError && (
              <p className="mb-4 text-[11px] text-ochre border border-ochre/20 bg-ochre/10 px-3 py-2">{settingsError}</p>
            )}
            <div className="flex flex-col gap-3" role="radiogroup" aria-label="Payment method">
              {methods.map((pm) => {
                const selected = form.payment_method === pm.id
                return (
                  <label
                    key={pm.id}
                    className={`border p-4 cursor-pointer transition-colors flex items-stretch ${selected ? 'border-ink bg-paper' : 'border-line bg-paper hover:border-ink'}`}
                  >
                    <div className="flex items-start gap-3 w-full min-w-0">
                      <input
                        type="radio"
                        name="payment_method"
                        value={pm.id}
                        checked={selected}
                        onChange={() => handleChange('payment_method', pm.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-ink"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] uppercase tracking-wide-lg font-medium">{pm.label}</span>
                        <p className="mt-1 text-[11px] md:text-[12px] text-muted leading-relaxed">{pm.description}</p>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>

            {/* InstaPay instructions */}
            {form.payment_method === 'instapay' && settings && (
              <div className="mt-6 border-t border-line pt-5">
                <div className="border border-line bg-paper p-4 md:p-5 flex flex-col gap-3">
                  <span className="eyebrow">— InstaPay Transfer</span>
                  <p className="text-[11px] md:text-[12px] text-muted leading-relaxed">{settings.instapay_instructions}</p>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wide-lg text-muted">Send to InstaPay address</span>
                    <span className="font-mono text-[15px] md:text-[17px] font-medium break-all select-all">{settings.instapay_account}</span>
                    <span className="text-[11px] text-muted">Account name: {settings.instapay_account_name}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-3">
                    <span className="text-[11px] uppercase tracking-wide-lg text-muted">Amount</span>
                    <span className="font-display text-[15px]">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Vodafone Cash instructions */}
            {form.payment_method === 'vodafone' && settings && (
              <div className="mt-6 border-t border-line pt-5">
                <div className="border border-line bg-paper p-4 md:p-5 flex flex-col gap-3">
                  <span className="eyebrow">— Vodafone Cash Transfer</span>
                  <p className="text-[11px] md:text-[12px] text-muted leading-relaxed">{settings.vodafone_instructions}</p>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wide-lg text-muted">Transfer to Vodafone Cash number</span>
                    <span className="font-mono text-[18px] md:text-[22px] font-medium tracking-wide select-all" dir="ltr">{settings.vodafone_number}</span>
                    <span className="text-[11px] text-muted">Wallet name: {settings.vodafone_account_name}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-3">
                    <span className="text-[11px] uppercase tracking-wide-lg text-muted">Amount</span>
                    <span className="font-display text-[15px]">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Proof upload — required for manual transfers */}
            {requiresProof && (
              <div className="mt-6 border-t border-line pt-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] uppercase tracking-wide-lg font-medium">
                    Payment Proof *
                  </span>
                  <span className="text-[11px] md:text-[12px] text-muted leading-relaxed">
                    Upload a screenshot of the completed transfer (JPG, JPEG, PNG or WEBP — maximum 5 MB).
                    You can use your phone camera or gallery.
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  capture="environment"
                  onChange={handleProofChange}
                  className="hidden"
                  id="payment-proof-input"
                />

                {!proofPreview ? (
                  <label
                    htmlFor="payment-proof-input"
                    className="flex min-h-[88px] cursor-pointer items-center justify-center border border-dashed border-ink/40 bg-paper px-4 py-5 text-center transition-colors hover:border-ink hover:bg-cream"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="text-[12px] uppercase tracking-wide-lg font-medium">Tap to upload screenshot</span>
                      <span className="text-[10px] uppercase tracking-wide-lg text-muted">Camera / Gallery / File — JPG · PNG · WEBP · max 5MB</span>
                    </span>
                  </label>
                ) : (
                  <div className="border border-line bg-paper p-3 flex flex-col gap-3">
                    <div className="relative w-full overflow-hidden border border-line bg-cream">
                      <img
                        src={proofPreview}
                        alt="Payment proof preview"
                        className="mx-auto max-h-[360px] w-auto max-w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label
                        htmlFor="payment-proof-input"
                        className="flex-1 cursor-pointer border border-line bg-paper px-4 py-3 text-center text-[11px] uppercase tracking-wide-lg hover:border-ink min-h-[44px] flex items-center justify-center"
                      >
                        Replace screenshot
                      </label>
                      <button
                        type="button"
                        onClick={removeProof}
                        className="flex-1 border border-ochre text-ochre px-4 py-3 text-[11px] uppercase tracking-wide-lg hover:bg-ochre hover:text-paper transition-colors min-h-[44px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {proofError && (
                  <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] text-ochre break-words">{proofError}</div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-wide-lg">
                    Transaction / Reference number <span className="text-muted normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    inputMode="text"
                    className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink min-h-[44px]"
                    placeholder="e.g. the reference shown in your transfer confirmation"
                  />
                </div>
              </div>
            )}
          </div>

          {error && <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] text-ochre whitespace-pre-wrap break-words">{error}</div>}

          <button type="submit" disabled={loading} className="group relative overflow-hidden border border-ink bg-ink text-paper py-4 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]">
            <span className="absolute inset-0 translate-y-full bg-ochre transition-transform duration-500 group-hover:translate-y-0 group-disabled:translate-y-full" />
            <span className="relative z-10 group-hover:text-paper transition-colors">
              {loading ? (requiresProof ? 'Uploading proof & placing order...' : 'Placing order...') : `Place Order — ${formatPrice(grandTotal)}`}
            </span>
          </button>

          <p className="text-[11px] text-muted leading-relaxed">
            We never ask for card numbers, CVV, PIN, banking passwords or InstaPay login details.
            Only your payment screenshot and optional reference are collected.
          </p>
        </form>

        <div className="lg:col-span-5">
          <div className="border border-line p-5 md:p-6 bg-paper lg:sticky lg:top-24">
            <span className="eyebrow mb-4 block">Order Summary — {items.length} {items.length === 1 ? 'piece' : 'pieces'}</span>
            <div className="flex flex-col gap-4 max-h-[50vh] lg:max-h-[400px] overflow-auto no-scrollbar">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 border-b border-line pb-4 last:border-0">
                  <div className="h-20 w-16 bg-cream overflow-hidden shrink-0">
                    <SafeImage src={item.image} alt={item.name} className="h-full w-full" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <span className="font-display text-[13px] font-medium leading-tight truncate">{item.name}</span>
                    <span className="text-[11px] text-muted truncate">{item.color} — Size {item.size} — Qty {item.quantity}</span>
                    <span className="text-[12px] tabular-nums">{formatPrice(item.price * item.quantity, item.currency)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-line pt-4 flex flex-col gap-2 text-[11px] uppercase tracking-wide-lg">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tabular-nums">{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="tabular-nums">{formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-[13px] font-medium border-t border-line pt-3 mt-2"><span>Total</span><span className="tabular-nums">{formatPrice(grandTotal)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
