import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  adminGetOrderById,
  adminConfirmOrder,
  adminRejectOrder,
  adminUpdateOrderStatusFlow,
  adminApprovePayment,
  adminRejectPayment,
} from '../../services/admin/orders'
import { getPaymentSettings, PaymentSettings } from '../../services/paymentSettings'
import { getPaymentProofSignedUrl } from '../../services/paymentProofs'
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

export default function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [settings, setSettings] = useState<PaymentSettings | null>(null)
  const [proofUrl, setProofUrl] = useState<string | null>(null)
  const [proofLoading, setProofLoading] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const load = async () => {
    if (!id) return
    setLoading(true)
    setActionError(null)
    try {
      const data = await adminGetOrderById(id)
      setOrder(data)
      getPaymentSettings().then(setSettings).catch(() => setSettings(null))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const viewProof = async () => {
    if (!order?.payment_proof_path) return
    setProofLoading(true)
    setActionError(null)
    try {
      const url = await getPaymentProofSignedUrl(order.payment_proof_path)
      setProofUrl(url)
      // Open in new tab for download/full view
      window.open(url, '_blank', 'noopener')
    } catch (e: any) {
      setActionError(`Could not load payment proof: ${e.message}`)
    } finally {
      setProofLoading(false)
    }
  }

  const handleApprovePayment = async () => {
    if (!order) return
    if (!confirm('Approve this payment proof? The order can then be confirmed (stock decreases on order confirmation).')) return
    setActionLoading('approve-payment')
    setActionError(null)
    try {
      const updated = await adminApprovePayment(order.id)
      setOrder({ ...order, ...updated })
    } catch (e: any) {
      setActionError(`Approval failed: ${e.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectPayment = async () => {
    if (!order) return
    const reason = rejectReason.trim() || 'Payment proof could not be verified.'
    setActionLoading('reject-payment')
    setActionError(null)
    try {
      const updated = await adminRejectPayment(order.id, reason)
      setOrder({ ...order, ...updated })
      setRejectOpen(false)
      setRejectReason('')
    } catch (e: any) {
      setActionError(`Rejection failed: ${e.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleConfirm = async () => {
    if (!order) return
    if (!confirm(`Confirm order ${order.order_number}? Stock will be decreased atomically. Ensure sufficient stock.`)) return
    setActionLoading('confirm')
    setActionError(null)
    try {
      const updated = await adminConfirmOrder(order.id)
      setOrder({ ...order, ...updated })
    } catch (e: any) {
      setActionError(`Confirm failed: ${e.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!order) return
    if (!confirm(`Reject order ${order.order_number}?`)) return
    setActionLoading('reject')
    setActionError(null)
    try {
      const updated = await adminRejectOrder(order.id)
      setOrder({ ...order, ...updated })
    } catch (e: any) {
      setActionError(`Reject failed: ${e.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return
    if (!confirm(`Change status from ${order.order_status} to ${newStatus}?`)) return
    setActionLoading(newStatus)
    setActionError(null)
    try {
      const updated = await adminUpdateOrderStatusFlow(order.id, newStatus)
      setOrder({ ...order, ...updated })
    } catch (e: any) {
      setActionError(e.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="py-12"><span className="eyebrow">Loading order...</span></div>
  if (error) return <div className="py-12"><span className="eyebrow">Error</span><p className="text-[12px] text-ochre mt-2">{error}</p></div>
  if (!order) return <div className="py-12"><span className="eyebrow">Not found</span></div>

  const isManualTransfer = order.payment_method === 'instapay' || order.payment_method === 'vodafone'
  const needsPaymentReview = isManualTransfer && (order.payment_status === 'proof_submitted' || order.payment_status === 'pending')
  const paymentDenied = order.payment_status === 'rejected'
  const paymentApproved = order.payment_status === 'approved'

  const paymentDestination =
    order.payment_method === 'instapay'
      ? settings?.instapay_account ?? '—'
      : order.payment_method === 'vodafone'
        ? settings?.vodafone_number ?? '—'
        : null

  return (
    <div className="flex flex-col gap-8 max-w-[900px]">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="text-[11px] uppercase tracking-wide-lg link-line">← Back to Orders</Link>
      </div>

      <div>
        <span className="eyebrow mb-2 block">— Order {order.order_number}</span>
        <h1 className="font-display text-3xl tracking-ultra-tight flex flex-wrap items-center gap-3">
          {order.order_number}
          <span className={`text-[10px] uppercase px-2 py-1 ${order.order_status === 'pending' ? 'bg-ochre text-paper' : order.order_status === 'confirmed' ? 'bg-ink text-paper' : order.order_status === 'rejected' ? 'bg-red-700 text-paper' : 'bg-line'}`}>{order.order_status}</span>
          <span className={`text-[10px] uppercase px-2 py-1 ${PAYMENT_STATUS_STYLES[order.payment_status] || 'bg-line'}`}>
            {PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method} — {order.payment_status}
          </span>
        </h1>
        <p className="mt-2 text-[11px] text-muted">Created {new Date(order.created_at).toLocaleString()}</p>
      </div>

      {actionError && (
        <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] text-ochre break-words">{actionError}</div>
      )}

      {/* PAYMENT REVIEW — manual transfers */}
      <div className="border border-line p-6 bg-cream">
        <span className="eyebrow mb-4 block">Payment Review</span>

        <div className="grid md:grid-cols-2 gap-4 text-[12px]">
          <div className="flex flex-col gap-1">
            <span className="text-muted text-[10px] uppercase tracking-wide-lg">Method</span>
            <span className="font-medium">{PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted text-[10px] uppercase tracking-wide-lg">Payment status</span>
            <span className={`text-[10px] uppercase px-2 py-1 w-fit ${PAYMENT_STATUS_STYLES[order.payment_status] || 'bg-line'}`}>{order.payment_status}</span>
          </div>

          {paymentDestination && (
            <div className="flex flex-col gap-1">
              <span className="text-muted text-[10px] uppercase tracking-wide-lg">
                {order.payment_method === 'vodafone' ? 'Vodafone Cash number' : 'InstaPay address'}
              </span>
              <span className="font-mono text-[14px] break-all" dir={order.payment_method === 'vodafone' ? 'ltr' : undefined}>{paymentDestination}</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-muted text-[10px] uppercase tracking-wide-lg">Reference</span>
            <span className="font-mono break-all">{order.payment_reference || '— none provided —'}</span>
          </div>

          {order.payment_reviewed_at && (
            <div className="flex flex-col gap-1">
              <span className="text-muted text-[10px] uppercase tracking-wide-lg">Reviewed</span>
              <span>{new Date(order.payment_reviewed_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        {order.payment_rejection_reason && (
          <div className="mt-4 border border-red-700/30 bg-red-700/5 px-4 py-3 text-[12px] text-red-800 break-words">
            <span className="uppercase tracking-wide-lg text-[10px] block mb-1">Rejection reason</span>
            {order.payment_rejection_reason}
          </div>
        )}

        {/* Proof */}
        {isManualTransfer && (
          <div className="mt-5 border-t border-line pt-4 flex flex-col gap-3">
            <span className="text-muted text-[10px] uppercase tracking-wide-lg">Payment proof</span>
            {order.payment_proof_path ? (
              <div className="flex flex-wrap items-center gap-3">
                {proofUrl ? (
                  <a
                    href={proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-ink bg-ink text-paper px-5 py-3 text-[11px] uppercase tracking-wide-lg inline-flex items-center min-h-[44px]"
                  >
                    Open / Download Screenshot
                  </a>
                ) : (
                  <button
                    onClick={viewProof}
                    disabled={proofLoading}
                    className="border border-ink bg-ink text-paper px-5 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]"
                  >
                    {proofLoading ? 'Generating secure link...' : 'View Payment Screenshot'}
                  </button>
                )}
                <span className="text-[10px] text-muted break-all">Private file · signed access · {order.payment_proof_path.split('/').pop()}</span>
              </div>
            ) : (
              <p className="text-[12px] text-ochre">No payment proof was uploaded for this order.</p>
            )}
          </div>
        )}

        {/* Review actions */}
        {needsPaymentReview && (
          <div className="mt-6 border-t border-line pt-5 flex flex-col gap-4">
            {!rejectOpen ? (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleApprovePayment}
                  disabled={!!actionLoading}
                  className="bg-ink text-paper px-6 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]"
                >
                  {actionLoading === 'approve-payment' ? 'Approving...' : 'Approve Payment'}
                </button>
                <button
                  onClick={() => setRejectOpen(true)}
                  disabled={!!actionLoading}
                  className="border border-ochre text-ochre px-6 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]"
                >
                  Reject Payment
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 border border-line bg-paper p-4">
                <label className="text-[11px] uppercase tracking-wide-lg">Rejection reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Payment proof could not be verified."
                  className="border border-line bg-paper px-4 py-3 text-[13px] focus:outline-none focus:border-ink"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleRejectPayment}
                    disabled={!!actionLoading}
                    className="border border-red-700 bg-red-700 text-paper px-6 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]"
                  >
                    {actionLoading === 'reject-payment' ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                  <button
                    onClick={() => { setRejectOpen(false); setRejectReason('') }}
                    disabled={!!actionLoading}
                    className="border border-line px-6 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <p className="text-[11px] text-muted leading-relaxed">
              Approving the payment only verifies funds — it does not change stock. Stock is decreased
              atomically when the order is confirmed below.
            </p>
          </div>
        )}

        {paymentApproved && order.order_status === 'pending' && (
          <p className="mt-5 border-t border-line pt-4 text-[12px] text-muted">
            Payment approved. You can now confirm the order below to reserve and deduct stock.
          </p>
        )}
        {paymentDenied && (
          <p className="mt-5 border-t border-line pt-4 text-[12px] text-red-800">
            Payment rejected — this order must not be treated as paid. Do not confirm it.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-line p-6 bg-cream">
          <span className="eyebrow mb-3 block">Customer</span>
          <div className="flex flex-col gap-1 text-[12px] leading-relaxed">
            <span className="font-medium">{order.customer_name}</span>
            <span className="break-all">{order.customer_email}</span>
            <span>{order.customer_phone}</span>
            <span>{order.country}, {order.city}</span>
            <span>{order.address} {order.apartment && `, ${order.apartment}`}</span>
            {order.notes && <span className="mt-2 text-muted break-words">Notes: {order.notes}</span>}
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
        <span className="eyebrow mb-4 block">Order Actions</span>
        {order.order_status === 'pending' ? (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleConfirm}
              disabled={!!actionLoading || needsPaymentReview || paymentDenied}
              className="bg-ink text-paper px-6 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]"
              title={needsPaymentReview ? 'Approve the payment proof first' : paymentDenied ? 'Payment was rejected' : undefined}
            >
              {actionLoading === 'confirm' ? 'Confirming...' : needsPaymentReview ? 'Confirm Order (approve payment first)' : 'Confirm Order (decrease stock)'}
            </button>
            <button onClick={handleReject} disabled={!!actionLoading} className="border border-ochre text-ochre px-6 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]">
              {actionLoading === 'reject' ? 'Rejecting...' : 'Reject Order'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] text-muted">Current: {order.order_status} — Change to:</p>
            <div className="flex flex-wrap gap-2">
              {['processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                <button key={s} onClick={() => handleStatusChange(s)} disabled={!!actionLoading} className="border border-line px-4 py-2 text-[11px] uppercase tracking-wide-lg hover:border-ink disabled:opacity-50 min-h-[44px]">
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
