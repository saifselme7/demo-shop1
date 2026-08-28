import { supabase } from '../../lib/supabase'

export async function adminGetOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function adminGetOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function adminUpdateOrderStatus(id: string, order_status: string, payment_status?: string) {
  const updates: any = { order_status, updated_at: new Date().toISOString() }
  if (payment_status) updates.payment_status = payment_status

  const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

/**
 * Approve a manual payment (InstaPay / Vodafone Cash proof verified).
 * Sets payment_status = approved and records reviewer metadata.
 * Does NOT touch order_status and does NOT decrease stock.
 */
export async function adminApprovePayment(id: string) {
  const { data, error } = await supabase.rpc('review_order_payment', {
    p_order_id: id,
    p_approved: true,
    p_rejection_reason: null,
  })

  if (error) throw error
  return data
}

/**
 * Reject a manual payment.
 * Sets payment_status = rejected and stores the admin's reason.
 * Does NOT touch order_status and does NOT decrease stock.
 */
export async function adminRejectPayment(id: string, reason: string) {
  const { data, error } = await supabase.rpc('review_order_payment', {
    p_order_id: id,
    p_approved: false,
    p_rejection_reason: reason || 'Payment proof could not be verified.',
  })

  if (error) throw error
  return data
}

/**
 * Confirm an order and decrease stock atomically.
 *
 * Business rule (unchanged): stock is only decreased when the admin
 * confirms the order. For manual-transfer orders the admin must first
 * approve the payment (payment_status = approved); COD orders can be
 * confirmed directly. This prevents stock decreasing merely because a
 * payment proof was uploaded or rejected.
 */
export async function adminConfirmOrder(id: string) {
  // Fetch order with items
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const isManualTransfer = order.payment_method === 'instapay' || order.payment_method === 'vodafone'
  if (isManualTransfer && order.payment_status !== 'approved') {
    throw new Error(
      `Payment has not been approved for this ${order.payment_method} order (status: ${order.payment_status}). Approve the payment proof first, then confirm the order.`,
    )
  }

  // Verify stock for each item and decrease atomically
  for (const item of order.items) {
    const { data: success, error: stockError } = await supabase.rpc('decrease_variant_stock', {
      p_product_id: item.product_id,
      p_color_name: item.color_name,
      p_size: item.size,
      p_quantity: item.quantity,
    })

    if (stockError) throw stockError
    if (!success) {
      throw new Error(`Insufficient stock for ${item.product_name} — ${item.color_name} / ${item.size}`)
    }
  }

  // Mark confirmed. COD moves payment pending -> confirmed; approved manual
  // payments remain 'approved' (they were already verified) — but we record
  // the order itself as confirmed for the fulfillment workflow.
  const newPaymentStatus = order.payment_method === 'cod' ? 'confirmed' : order.payment_status

  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: 'confirmed', payment_status: newPaymentStatus, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Reject an order outright (order_status = rejected). Payment status moves
 * to failed unless a payment has already been approved.
 */
export async function adminRejectOrder(id: string) {
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('payment_status')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const updates: any = { order_status: 'rejected', updated_at: new Date().toISOString() }
  if (order.payment_status !== 'approved') {
    updates.payment_status = 'failed'
  }

  const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function adminUpdateOrderStatusFlow(id: string, newStatus: string) {
  const allowed: Record<string, string[]> = {
    pending: ['confirmed', 'rejected', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: [],
    rejected: [],
    cancelled: [],
  }

  const { data: current, error: fetchError } = await supabase.from('orders').select('order_status').eq('id', id).single()
  if (fetchError) throw fetchError

  const currentStatus = current.order_status
  if (!allowed[currentStatus]?.includes(newStatus) && currentStatus !== newStatus) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`)
  }

  const { data, error } = await supabase.from('orders').update({ order_status: newStatus, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}
