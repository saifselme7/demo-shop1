import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart, cartTotal, cartCount } from '../../store/cart'
import { formatPrice } from '../../lib/utils'
import { useLanguage, interpolate } from '../../i18n'

export default function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQuantity } = useCart()
  const total = cartTotal(items)
  const count = cartCount(items)
  const { t } = useLanguage()

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
                {t.cart.title} <span className="text-muted">({count})</span>
              </span>
              <button onClick={close} className="text-[12px] uppercase tracking-wide-lg link-line" data-cursor="hover">
                {t.cart.close}
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
                <span className="eyebrow">{t.cart.emptyEyebrow}</span>
                <p className="font-display text-2xl tracking-ultra-tight text-ink">{t.cart.emptyTitle}</p>
                <p className="font-serif italic text-[14px] text-muted max-w-[260px]">
                  {t.cart.emptySub}
                </p>
                <Link
                  to="/shop"
                  onClick={close}
                  className="btn-underline text-[11px] uppercase tracking-wide-lg mt-2"
                  data-cursor="hover"
                >
                  {t.cart.browseCollection}
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 md:px-6">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      className="flex gap-4 border-b border-line py-6"
                    >
                      <Link to={`/product/${item.slug}`} onClick={close} className="block h-28 w-[88px] shrink-0 overflow-hidden bg-cream">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between gap-4">
                            <h3 className="font-display text-[15px] font-medium leading-tight">{item.name}</h3>
                            <button
                              onClick={() => removeItem(item.id, item.size, item.color)}
                              className="text-[10px] uppercase tracking-wide-lg text-muted link-line"
                              data-cursor="hover"
                            >
                              {t.cart.remove}
                            </button>
                          </div>
                          <p className="mt-1 text-[12px] text-muted">
                            {item.color} — {t.product.size} {item.size}
                          </p>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                              className="min-h-[44px] min-w-[44px] px-3 py-1 text-sm transition-colors hover:bg-cream"
                              data-cursor="hover"
                              aria-label="Decrease quantity"
                            >
                              –
                            </button>
                            <span className="px-3 py-1 text-sm tabular-nums min-w-[36px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                              className="min-h-[44px] min-w-[44px] px-3 py-1 text-sm transition-colors hover:bg-cream"
                              data-cursor="hover"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[14px] tabular-nums font-medium">{formatPrice(item.price * item.quantity, item.currency)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-line px-5 py-6 md:px-6">
                  <div className="mb-2 flex justify-between text-[12px] uppercase tracking-wide-lg">
                    <span>{t.cart.subtotal}</span>
                    <span className="tabular-nums">{formatPrice(total)}</span>
                  </div>
                  {total < 250 && total > 0 && (
                    <p className="mb-3 text-[11px] text-muted">
                      {interpolate(t.cart.freeShippingProgress, { amount: formatPrice(250 - total) })}
                    </p>
                  )}
                  <p className="mb-4 text-[11px] text-muted">{t.cart.shippingNote}</p>
                  <button
                    onClick={close}
                    className="group relative w-full overflow-hidden border border-ink py-4 text-[11px] uppercase tracking-wide-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    data-cursor="hover"
                  >
                    <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-paper">
                      {t.cart.checkout}
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
