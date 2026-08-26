import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart, cartTotal, cartCount } from '../../store/cart'
import { formatPrice } from '../../lib/utils'

export default function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQuantity } = useCart()
  const total = cartTotal(items)
  const count = cartCount(items)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-[460px] flex-col bg-paper"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <span className="text-[12px] uppercase tracking-wide-lg">
                Cart <span className="text-muted">({count})</span>
              </span>
              <button onClick={close} className="text-[12px] uppercase tracking-wide-lg link-line" data-cursor="hover">
                Close
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
                <p className="font-display text-2xl tracking-ultra-tight text-ink">Your cart is empty.</p>
                <Link
                  to="/shop"
                  onClick={close}
                  className="btn-underline text-[11px] uppercase tracking-wide-lg"
                  data-cursor="hover"
                >
                  Browse the collection
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      className="flex gap-4 border-b border-line py-6"
                    >
                      <Link to={`/product/${item.slug}`} onClick={close} className="block h-28 w-22 shrink-0 overflow-hidden bg-cream">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between gap-4">
                            <h3 className="font-display text-base font-medium leading-tight">{item.name}</h3>
                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              className="text-[10px] uppercase tracking-wide-lg text-muted link-line"
                              data-cursor="hover"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="text-[12px] text-muted">
                            {item.color} — Size {item.size}
                          </p>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="px-3 py-1 text-sm"
                              data-cursor="hover"
                            >
                              –
                            </button>
                            <span className="px-3 py-1 text-sm tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="px-3 py-1 text-sm"
                              data-cursor="hover"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm tabular-nums">{formatPrice(item.price * item.quantity, item.currency)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-line px-6 py-6">
                  <div className="mb-4 flex justify-between text-[12px] uppercase tracking-wide-lg">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatPrice(total)}</span>
                  </div>
                  <p className="mb-4 text-[11px] text-muted">Shipping and duties calculated at checkout.</p>
                  <button
                    onClick={close}
                    className="group relative w-full overflow-hidden border border-ink py-4 text-[11px] uppercase tracking-wide-lg"
                    data-cursor="hover"
                  >
                    <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-paper">
                      Proceed to Checkout
                    </span>
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
