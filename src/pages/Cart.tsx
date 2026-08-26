import { Link, useNavigate } from 'react-router-dom'
import { useCart, cartTotal, cartCount } from '../store/cart'
import { formatPrice } from '../lib/utils'
import SafeImage from '../components/ui/SafeImage'

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCart()
  const total = cartTotal(items)
  const count = cartCount(items)
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="container-ecru py-20 md:py-32 text-center">
        <span className="eyebrow mb-4 block">— Cart — Empty</span>
        <h1 className="font-display text-3xl md:text-4xl tracking-ultra-tight">Your cart is empty.</h1>
        <p className="mt-4 font-serif italic text-[14px] text-muted max-w-[320px] mx-auto">A considered selection awaits in the reserve.</p>
        <Link to="/shop" className="mt-8 inline-block btn-underline text-[11px] uppercase tracking-wide-lg min-h-[44px]">Browse the collection</Link>
      </div>
    )
  }

  return (
    <div className="container-ecru-wide py-8 md:py-12">
      <div className="mb-8">
        <span className="eyebrow mb-3 block">— Cart — {count} {count === 1 ? 'piece' : 'pieces'}</span>
        <h1 className="font-display text-3xl md:text-5xl tracking-ultra-tight">Cart</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 border-b border-line py-6">
              <Link to={`/product/${item.slug}`} className="block h-28 w-[88px] md:h-32 md:w-[100px] shrink-0 overflow-hidden bg-cream">
                <SafeImage src={item.image} alt={item.name} className="h-full w-full" />
              </Link>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex justify-between gap-4">
                  <h3 className="font-display text-[14px] md:text-[15px] font-medium leading-tight truncate">{item.name}</h3>
                  <button onClick={() => removeItem(item.id, item.size, item.color)} className="text-[10px] uppercase tracking-wide-lg text-muted link-line shrink-0 min-h-[28px]">Remove</button>
                </div>
                <p className="text-[11px] md:text-[12px] text-muted truncate">{item.color} — Size {item.size}</p>
                <div className="flex items-end justify-between gap-2 mt-2">
                  <div className="flex items-center border border-line">
                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="min-h-[44px] min-w-[44px] px-3 text-sm hover:bg-cream">–</button>
                    <span className="px-3 text-sm tabular-nums min-w-[36px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="min-h-[44px] min-w-[44px] px-3 text-sm hover:bg-cream">+</button>
                  </div>
                  <span className="text-[13px] md:text-[14px] tabular-nums font-medium">{formatPrice(item.price * item.quantity, item.currency)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="border border-line p-6 bg-paper lg:sticky lg:top-24">
            <span className="eyebrow mb-4 block">Summary</span>
            <div className="flex flex-col gap-3 text-[11px] uppercase tracking-wide-lg">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tabular-nums">{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="tabular-nums">Calculated at checkout</span></div>
              <div className="flex justify-between font-medium text-[13px] border-t border-line pt-3 mt-2"><span>Total</span><span className="tabular-nums">{formatPrice(total)}</span></div>
            </div>
            <button onClick={() => navigate('/checkout')} className="mt-6 w-full border border-ink bg-ink text-paper py-4 text-[11px] uppercase tracking-wide-lg hover:bg-ochre transition-colors min-h-[44px]">Proceed to Checkout</button>
            <Link to="/shop" className="mt-4 block text-center text-[11px] uppercase tracking-wide-lg text-muted link-line w-fit mx-auto min-h-[44px] flex items-center justify-center">Continue Shopping</Link>
            <Link to="/order-status" className="mt-2 block text-center text-[11px] uppercase tracking-wide-lg text-muted link-line w-fit mx-auto min-h-[44px] flex items-center justify-center">Track Order</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
