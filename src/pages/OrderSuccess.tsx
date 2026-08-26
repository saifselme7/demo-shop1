import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrderByNumber } from '../services/orders'
import { formatPrice } from '../lib/utils'

export default function OrderSuccess() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderNumber) return
    getOrderByNumber(orderNumber)
      .then(setOrder)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) {
    return (
      <div className="container-ecru py-24">
        <span className="eyebrow">Loading order...</span>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container-ecru py-24 text-center">
        <span className="eyebrow mb-4 block">— Order</span>
        <p className="font-display text-3xl">Order not found.</p>
        <p className="mt-2 text-[11px] text-muted">{error || `Order ${orderNumber} not found`}</p>
        <Link to="/shop" className="mt-8 inline-block btn-underline text-[11px] uppercase">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container-ecru-wide py-16 md:py-24"
    >
      <div className="max-w-[800px] mx-auto">
        <span className="eyebrow mb-4 block">— Order Confirmed</span>
        <h1 className="font-display text-4xl md:text-6xl tracking-ultra-tight leading-[0.9]">Thank you. Your order is pending review.</h1>
        <p className="mt-6 text-[14px] text-muted max-w-[520px] leading-relaxed">
          Your order <span className="font-medium text-ink">{order.order_number}</span> has been submitted. SAIF STORE will review and confirm your order shortly. You will be contacted via email or phone.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="border border-line p-6 bg-cream">
            <span className="eyebrow mb-3 block">Order Details</span>
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between"><span className="text-muted">Order Number</span><span className="font-mono">{order.order_number}</span></div>
              <div className="flex justify-between"><span className="text-muted">Status</span><span className="uppercase text-[11px] tracking-wide-lg bg-ink text-paper px-2 py-1">{order.order_status}</span></div>
              <div className="flex justify-between"><span className="text-muted">Payment</span><span className="capitalize">{order.payment_method} — {order.payment_status}</span></div>
              <div className="flex justify-between"><span className="text-muted">Total</span><span className="font-medium tabular-nums">{formatPrice(Number(order.total), order.currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Date</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
            </div>
          </div>

          <div className="border border-line p-6 bg-cream">
            <span className="eyebrow mb-3 block">Customer</span>
            <div className="flex flex-col gap-1 text-[12px] leading-relaxed">
              <span className="font-medium">{order.customer_name}</span>
              <span className="text-muted">{order.customer_email}</span>
              <span className="text-muted">{order.customer_phone}</span>
              <span className="text-muted">{order.country}, {order.city}</span>
              <span className="text-muted">{order.address} {order.apartment && `, ${order.apartment}`}</span>
              {order.notes && <span className="text-muted mt-2">Notes: {order.notes}</span>}
            </div>
          </div>
        </div>

        <div className="mt-8 border border-line p-6 bg-paper">
          <span className="eyebrow mb-4 block">Items — {order.items?.length} pieces</span>
          <div className="flex flex-col gap-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex gap-4 border-b border-line pb-4 last:border-0">
                <div className="h-20 w-16 bg-cream overflow-hidden shrink-0">
                  {item.product_image && <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="font-display text-[13px] font-medium">{item.product_name}</span>
                  <span className="text-[11px] text-muted">{item.color_name} — Size {item.size} — Qty {item.quantity}</span>
                  <span className="text-[12px] tabular-nums">{formatPrice(Number(item.unit_price))} × {item.quantity} = {formatPrice(Number(item.subtotal))}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-2 text-[11px] uppercase tracking-wide-lg border-t border-line pt-4">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tabular-nums">{formatPrice(Number(order.subtotal), order.currency)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="tabular-nums">{formatPrice(Number(order.shipping), order.currency)}</span></div>
            <div className="flex justify-between font-medium text-[13px]"><span>Total</span><span className="tabular-nums">{formatPrice(Number(order.total), order.currency)}</span></div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <Link to="/shop" className="border border-ink bg-ink text-paper px-8 py-4 text-[11px] uppercase tracking-wide-lg">Continue Shopping</Link>
          <Link to="/" className="border border-line px-8 py-4 text-[11px] uppercase tracking-wide-lg hover:border-ink">Home</Link>
        </div>
      </div>
    </motion.div>
  )
}
