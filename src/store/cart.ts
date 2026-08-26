import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  slug: string
  name: string
  price: number
  currency: string
  size: string
  color: string
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  open: () => void
  close: () => void
  toggle: () => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.id === item.id && i.size === item.size && i.color === item.color,
          )
          if (existing) {
            return {
              items: s.items.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + quantity } : i,
              ),
              isOpen: true,
            }
          }
          return { items: [...s.items, { ...item, quantity }], isOpen: true }
        }),
      removeItem: (id, size) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id || i.size !== size) })),
      updateQuantity: (id, size, quantity) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.id === id && i.size === size ? { ...i, quantity: Math.max(0, quantity) } : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      clear: () => set({ items: [] }),
    }),
    { name: 'ecru-cart' },
  ),
)

export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0)

export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0)
