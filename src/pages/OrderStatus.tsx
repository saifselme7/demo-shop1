import { useState } from 'react'
import { getOrderByNumber } from '../services/orders'
import { formatPrice } from '../lib/utils'
import { Link } from 'react-router-dom'

export default function OrderStatus() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)
    try {
      const data = await getOrderByNumber(orderNumber.trim(), email.trim() || undefined)
      setOrder(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-ecru-wide py-12 md:py-20">
      <div className="max-w-[600px]">
        <span className="eyebrow mb-3 block">— Order Status</span>
        <h1 className="font-display text-4xl md:text-5xl tracking-ultra-tight">Track your order</h1>
        <p className="mt-3 text-[13px] text-muted">Enter your order number and email to view status. Your information is secure and only your order will be shown.</p>

        <form onSubmit={handleLookup} className="mt-8 border border-line p-6 bg-cream flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wide-lg">Order Number *</label>
            <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="SAIF-2026-000001" className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wide-lg">Email (for verification)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink" />
          </div>
          <button type="submit" disabled={loading} className="bg-ink text-paper py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50">
            {loading ? 'Looking up...' : 'Check Status'}
          </button>
          {error && <div className="text-[12px] text-ochre border border-ochre/20 bg-ochre/10 px-3 py-2 whitespace-pre-wrap">{error}</div>}
        </form>

        {order && (
          <div className="mt-8 border border-line p-6 bg-paper">
            <span className="eyebrow mb-3 block">Order {order.order_number}</span>
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between"><span className="text-muted">Status</span><span className="uppercase bg-ink text-paper px-2 py-1 text-[11px]">{order.order_status}</span></div>
              <div className="flex justify-between"><span className="text-muted">Payment</span><span>{order.payment_method} — {order.payment_status}</span></div>
              <div className="flex justify-between"><span className="text-muted">Total</span><span className="tabular-nums font-medium">{formatPrice(Number(order.total), order.currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Date</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-3 border-b border-line pb-3 last:border-0">
                  <div className="h-16 w-12 bg-cream overflow-hidden shrink-0">
                    {item.product_image && <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-[13px]">{item.product_name}</div>
                    <div className="text-[11px] text-muted">{item.color_name} — {item.size} — Qty {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to="/shop" className="btn-underline text-[11px] uppercase">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
