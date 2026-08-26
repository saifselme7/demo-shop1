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

  // Mark confirmed
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: 'confirmed', payment_status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminRejectOrder(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: 'rejected', payment_status: 'failed', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

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
