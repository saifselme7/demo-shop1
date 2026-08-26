import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart, cartTotal } from '../store/cart'
import { formatPrice } from '../lib/utils'
import { createOrder } from '../services/orders'

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives. No extra fees.' },
  { id: 'bank', label: 'Bank Transfer', description: 'Manual transfer — instructions will be provided after order confirmation.' },
]

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
    payment_method: 'cod',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="container-ecru py-24 md:py-32 text-center">
        <span className="eyebrow mb-4 block">— Checkout</span>
        <p className="font-display text-3xl tracking-ultra-tight">Your cart is empty.</p>
        <Link to="/shop" className="mt-8 inline-block btn-underline text-[11px] uppercase tracking-wide-lg">Browse the collection</Link>
      </div>
    )
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!form.customer_name || !form.customer_email || !form.customer_phone || !form.country || !form.city || !form.address) {
        throw new Error('Please fill all required fields')
      }

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

      clear()
      navigate(`/order-success/${order.order_number}`)
    } catch (err: any) {
      console.error('Order creation failed', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container-ecru-wide py-12 md:py-20"
    >
      <div className="mb-10">
        <span className="eyebrow mb-3 block">— Checkout</span>
        <h1 className="font-display text-4xl md:text-6xl tracking-ultra-tight">Checkout</h1>
        <p className="mt-3 text-[13px] text-muted max-w-[480px]">Your order will be reviewed and confirmed by SAIF STORE. No payment is processed online — we will contact you for confirmation.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-8">
          <div className="border border-line p-6 bg-cream">
            <span className="eyebrow mb-4 block">Customer Information</span>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Full Name *</label>
                <input required value={form.customer_name} onChange={(e) => handleChange('customer_name', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" placeholder="Saif Ahmed" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Phone Number *</label>
                <input required value={form.customer_phone} onChange={(e) => handleChange('customer_phone', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" placeholder="+20 100 123 4567" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Email *</label>
                <input required type="email" value={form.customer_email} onChange={(e) => handleChange('customer_email', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" placeholder="saif@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Country *</label>
                <input required value={form.country} onChange={(e) => handleChange('country', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">City *</label>
                <input required value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" placeholder="Cairo" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Address *</label>
                <input required value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" placeholder="Street, area" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Apartment / Building / Floor</label>
                <input value={form.apartment} onChange={(e) => handleChange('apartment', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" placeholder="Optional" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide-lg">Notes</label>
                <input value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" placeholder="Optional" />
              </div>
            </div>
          </div>

          <div className="border border-line p-6 bg-cream">
            <span className="eyebrow mb-4 block">Payment Method</span>
            <div className="flex flex-col gap-3">
              {paymentMethods.map((pm) => (
                <label key={pm.id} className={`border p-4 cursor-pointer transition-colors ${form.payment_method === pm.id ? 'border-ink bg-paper' : 'border-line bg-paper hover:border-ink'}`}>
                  <div className="flex items-start gap-3">
                    <input type="radio" name="payment_method" value={pm.id} checked={form.payment_method === pm.id} onChange={(e) => handleChange('payment_method', e.target.value)} className="mt-1" />
                    <div className="flex-1">
                      <span className="text-[12px] uppercase tracking-wide-lg font-medium">{pm.label}</span>
                      <p className="mt-1 text-[12px] text-muted leading-relaxed">{pm.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {form.payment_method === 'bank' && (
              <div className="mt-6 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
                <p className="eyebrow mb-2">Bank Transfer Instructions</p>
                <p>Bank: SAIF STORE Bank</p>
                <p>Account Name: SAIF STORE</p>
                <p>IBAN: EG00 0000 0000 0000 0000</p>
                <p className="mt-2">Please include your order number in transfer reference. Your order will be confirmed after payment verification.</p>
              </div>
            )}
          </div>

          {error && <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] text-ochre whitespace-pre-wrap">{error}</div>}

          <button type="submit" disabled={loading} className="group relative overflow-hidden border border-ink bg-ink text-paper py-4 text-[11px] uppercase tracking-wide-lg disabled:opacity-50">
            <span className="absolute inset-0 translate-y-full bg-ochre transition-transform duration-500 group-hover:translate-y-0 group-disabled:translate-y-full" />
            <span className="relative z-10 group-hover:text-paper transition-colors">{loading ? 'Placing order...' : `Place Order — ${formatPrice(grandTotal)}`}</span>
          </button>

          <p className="text-[11px] text-muted">By placing an order, you agree that SAIF STORE will review and confirm your order manually. No card data is collected.</p>
        </form>

        <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
          <div className="border border-line p-6 bg-paper">
            <span className="eyebrow mb-4 block">Order Summary — {items.length} {items.length === 1 ? 'piece' : 'pieces'}</span>
            <div className="flex flex-col gap-4 max-h-[400px] overflow-auto no-scrollbar">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 border-b border-line pb-4 last:border-0">
                  <div className="h-20 w-16 bg-cream overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="font-display text-[13px] font-medium leading-tight">{item.name}</span>
                    <span className="text-[11px] text-muted">{item.color} — Size {item.size} — Qty {item.quantity}</span>
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
