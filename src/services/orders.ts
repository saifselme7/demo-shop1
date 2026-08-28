import { supabase } from '../lib/supabase'

export type ManualPaymentMethod = 'cod' | 'instapay' | 'vodafone'
export type PaymentStatus = 'pending' | 'proof_submitted' | 'approved' | 'rejected' | 'confirmed' | 'failed'

export interface OrderInput {
  customer_name: string
  customer_email: string
  customer_phone: string
  country: string
  city: string
  address: string
  apartment?: string
  notes?: string
  payment_method: string
  payment_reference?: string | null
  payment_proof_path?: string | null
  payment_proof_url?: string | null
  payment_status?: PaymentStatus
  subtotal: number
  shipping: number
  total: number
  currency?: string
  items: {
    product_id: string
    product_name: string
    product_slug: string
    color_name: string
    color_hex: string
    size: string
    quantity: number
    unit_price: number
    subtotal: number
    product_image: string
  }[]
}

export async function createOrder(input: OrderInput) {
  // Generate order number via RPC or client
  const { data: orderNumberData } = await supabase.rpc('generate_order_number')
  const order_number = orderNumberData || `SAIF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

  // Verify stock for each item before creating order (safe approach B: keep stock unchanged until admin confirms, but verify availability)
  for (const item of input.items) {
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('product_id', item.product_id)
      .eq('color_name', item.color_name)
      .eq('size', item.size)
      .maybeSingle()

    if (variantError) throw variantError
    if (!variant) {
      throw new Error(`Variant not found for ${item.product_name} — ${item.color_name} / ${item.size}`)
    }
    if (variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.product_name} — ${item.color_name} / ${item.size}. Available: ${variant.stock}`)
    }
  }

  const manualProofRequired = input.payment_method !== 'cod'

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      country: input.country,
      city: input.city,
      address: input.address,
      apartment: input.apartment || null,
      notes: input.notes || null,
      payment_method: input.payment_method,
      payment_status: input.payment_status || (manualProofRequired ? 'proof_submitted' : 'pending'),
      payment_proof_url: input.payment_proof_url || null,
      payment_proof_path: input.payment_proof_path || null,
      payment_reference: input.payment_reference || null,
      order_status: 'pending',
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
      currency: input.currency || '€',
    })
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_slug: item.product_slug,
    color_name: item.color_name,
    color_hex: item.color_hex,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
    product_image: item.product_image,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  return order
}

export async function getOrderByNumber(orderNumber: string, email?: string) {
  let query = supabase.from('orders').select(`
    *,
    items:order_items(*)
  `).eq('order_number', orderNumber)

  if (email) {
    query = query.eq('customer_email', email)
  }

  const { data, error } = await query.single()
  if (error) throw error
  return data
}
