import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { adminGetOrderById, adminConfirmOrder, adminRejectOrder, adminUpdateOrderStatusFlow } from '../../services/admin/orders'
import { formatPrice } from '../../lib/utils'

export default function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const load = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await adminGetOrderById(id)
      setOrder(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleConfirm = async () => {
    if (!order) return
    if (!confirm(`Confirm order ${order.order_number}? Stock will be decreased atomically. Ensure sufficient stock.`)) return
    setActionLoading('confirm')
    try {
      const updated = await adminConfirmOrder(order.id)
      setOrder({ ...order, ...updated })
    } catch (e: any) {
      alert(`Confirm failed: ${e.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!order) return
    if (!confirm(`Reject order ${order.order_number}?`)) return
    setActionLoading('reject')
    try {
      const updated = await adminRejectOrder(order.id)
      setOrder({ ...order, ...updated })
    } catch (e: any) {
      alert(`Reject failed: ${e.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return
    if (!confirm(`Change status from ${order.order_status} to ${newStatus}?`)) return
    setActionLoading(newStatus)
    try {
      const updated = await adminUpdateOrderStatusFlow(order.id, newStatus)
      setOrder({ ...order, ...updated })
    } catch (e: any) {
      alert(e.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="py-12"><span className="eyebrow">Loading order...</span></div>
  if (error) return <div className="py-12"><span className="eyebrow">Error</span><p className="text-[12px] text-ochre mt-2">{error}</p></div>
  if (!order) return <div className="py-12"><span className="eyebrow">Not found</span></div>

  return (
    <div className="flex flex-col gap-8 max-w-[900px]">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="text-[11px] uppercase tracking-wide-lg link-line">← Back to Orders</Link>
      </div>

      <div>
        <span className="eyebrow mb-2 block">— Order {order.order_number}</span>
        <h1 className="font-display text-3xl tracking-ultra-tight flex items-center gap-3">
          {order.order_number}
          <span className={`text-[10px] uppercase px-2 py-1 ${order.order_status === 'pending' ? 'bg-ochre text-paper' : order.order_status === 'confirmed' ? 'bg-ink text-paper' : 'bg-line'}`}>{order.order_status}</span>
        </h1>
        <p className="mt-2 text-[11px] text-muted">Created {new Date(order.created_at).toLocaleString()} — Payment: {order.payment_method} / {order.payment_status}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-line p-6 bg-cream">
          <span className="eyebrow mb-3 block">Customer</span>
          <div className="flex flex-col gap-1 text-[12px] leading-relaxed">
            <span className="font-medium">{order.customer_name}</span>
            <span>{order.customer_email}</span>
            <span>{order.customer_phone}</span>
            <span>{order.country}, {order.city}</span>
            <span>{order.address} {order.apartment && `, ${order.apartment}`}</span>
            {order.notes && <span className="mt-2 text-muted">Notes: {order.notes}</span>}
          </div>
        </div>
        <div className="border border-line p-6 bg-cream">
          <span className="eyebrow mb-3 block">Totals</span>
          <div className="flex flex-col gap-2 text-[12px]">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tabular-nums">{formatPrice(Number(order.subtotal), order.currency)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="tabular-nums">{formatPrice(Number(order.shipping), order.currency)}</span></div>
            <div className="flex justify-between font-medium text-[14px] border-t border-line pt-2 mt-2"><span>Total</span><span className="tabular-nums">{formatPrice(Number(order.total), order.currency)}</span></div>
          </div>
        </div>
      </div>

      <div className="border border-line p-6 bg-paper">
        <span className="eyebrow mb-4 block">Items — {order.items?.length}</span>
        <div className="flex flex-col gap-4">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex gap-4 border-b border-line pb-4 last:border-0">
              <div className="h-20 w-16 bg-cream overflow-hidden shrink-0">
                {item.product_image && <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="font-display text-[13px] font-medium">{item.product_name} — {item.product_slug}</span>
                <span className="text-[11px] text-muted">{item.color_name} — Size {item.size} — Qty {item.quantity}</span>
                <span className="text-[11px] text-muted">SKU: {item.product_id} — Unit: {formatPrice(Number(item.unit_price))}</span>
                <span className="text-[12px] tabular-nums font-medium">Subtotal: {formatPrice(Number(item.subtotal))}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-line p-6 bg-cream">
        <span className="eyebrow mb-4 block">Actions</span>
        {order.order_status === 'pending' ? (
          <div className="flex flex-wrap gap-3">
            <button onClick={handleConfirm} disabled={!!actionLoading} className="bg-ink text-paper px-6 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50">
              {actionLoading === 'confirm' ? 'Confirming...' : 'Confirm Order (decrease stock)'}
            </button>
            <button onClick={handleReject} disabled={!!actionLoading} className="border border-ochre text-ochre px-6 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50">
              {actionLoading === 'reject' ? 'Rejecting...' : 'Reject Order'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] text-muted">Current: {order.order_status} — Change to:</p>
            <div className="flex flex-wrap gap-2">
              {['processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                <button key={s} onClick={() => handleStatusChange(s)} disabled={!!actionLoading} className="border border-line px-4 py-2 text-[11px] uppercase tracking-wide-lg hover:border-ink disabled:opacity-50">
                  {actionLoading === s ? `${s}...` : s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
