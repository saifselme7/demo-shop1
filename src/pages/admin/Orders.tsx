import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { adminGetOrders } from '../../services/admin/orders'
import { formatPrice } from '../../lib/utils'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  instapay: 'InstaPay',
  vodafone: 'Vodafone Cash',
  bank: 'Bank Transfer',
}

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-ochre text-paper',
  proof_submitted: 'bg-ochre text-paper',
  approved: 'bg-ink text-paper',
  rejected: 'bg-red-700 text-paper',
  confirmed: 'bg-ink text-paper',
  failed: 'bg-red-700 text-paper',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminGetOrders()
      setOrders(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = search === '' || o.order_number.toLowerCase().includes(search.toLowerCase()) || o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.customer_email.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter
      const matchesPayment = paymentFilter === 'all' || o.payment_method === paymentFilter
      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [orders, search, statusFilter, paymentFilter])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow mb-2 block">— Orders</span>
        <h1 className="font-display text-3xl tracking-ultra-tight">Orders — {loading ? '...' : filtered.length}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 border-y border-line py-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order number, customer, email" className="border border-line bg-cream px-4 py-2.5 text-[13px] flex-1 min-w-[200px] focus:outline-none focus:border-ink" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-line bg-cream px-4 py-2.5 text-[11px] uppercase tracking-wide-lg focus:outline-none focus:border-ink">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="border border-line bg-cream px-4 py-2.5 text-[11px] uppercase tracking-wide-lg focus:outline-none focus:border-ink">
          <option value="all">All Payment</option>
          <option value="cod">Cash on Delivery</option>
          <option value="instapay">InstaPay</option>
          <option value="vodafone">Vodafone Cash</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-cream animate-pulse border border-line" />)}</div>
      ) : error ? (
        <div className="py-12 text-center"><p className="font-serif italic text-lg text-muted">Unable to load orders.</p><p className="mt-2 text-[11px] text-muted">{error}</p></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center"><span className="eyebrow mb-3 block">— Empty</span><p className="font-serif italic text-xl text-muted">No orders found.</p></div>
      ) : (
        <div className="border border-line overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead className="bg-cream border-b border-line text-[11px] uppercase tracking-wide-lg text-muted">
              <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Pay Status</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-line text-[13px] hover:bg-cream/50">
                  <td className="px-4 py-3 font-mono text-[12px]">{o.order_number}</td>
                  <td className="px-4 py-3"><div className="font-medium">{o.customer_name}</div><div className="text-[11px] text-muted">{o.customer_email}</div></td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(Number(o.total), o.currency)}</td>
                  <td className="px-4 py-3 text-[11px] uppercase">{PAYMENT_METHOD_LABELS[o.payment_method] || o.payment_method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase px-2 py-1 ${PAYMENT_STATUS_STYLES[o.payment_status] || 'bg-line'}`}>
                      {o.payment_status === 'proof_submitted' ? 'Proof Submitted' : o.payment_status}
                    </span>
                    {(o.payment_method === 'instapay' || o.payment_method === 'vodafone') && o.payment_status === 'proof_submitted' && (
                      <span className="ml-2 text-[9px] uppercase tracking-wide-lg text-ochre">Review needed</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><span className={`text-[10px] uppercase px-2 py-1 ${o.order_status === 'pending' ? 'bg-ochre text-paper' : o.order_status === 'confirmed' ? 'bg-ink text-paper' : o.order_status === 'rejected' ? 'bg-red-700 text-paper' : 'bg-line'}`}>{o.order_status}</span></td>
                  <td className="px-4 py-3 text-[11px] text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Link to={`/admin/orders/${o.id}`} className="link-line text-[11px] uppercase">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="md:hidden flex flex-col gap-3">
        {filtered.map((o) => (
          <div key={o.id} className="border border-line bg-cream p-4 flex flex-col gap-2">
            <div className="flex justify-between gap-2"><span className="font-mono text-[12px]">{o.order_number}</span><span className={`text-[10px] uppercase px-2 py-1 ${o.order_status === 'pending' ? 'bg-ochre text-paper' : 'bg-ink text-paper'}`}>{o.order_status}</span></div>
            <div className="text-[13px] font-medium">{o.customer_name} — {formatPrice(Number(o.total), o.currency)}</div>
            <div className="text-[11px] text-muted break-all">{o.customer_email}</div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wide-lg">{PAYMENT_METHOD_LABELS[o.payment_method] || o.payment_method}</span>
              <span className={`text-[10px] uppercase px-2 py-1 ${PAYMENT_STATUS_STYLES[o.payment_status] || 'bg-line'}`}>
                {o.payment_status === 'proof_submitted' ? 'Proof Submitted' : o.payment_status}
              </span>
            </div>
            <Link to={`/admin/orders/${o.id}`} className="mt-2 text-[11px] uppercase link-line w-fit">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
