import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number, currency = '€') {
  return `${currency}${price.toLocaleString('en-EU')}`
}

export function preloadImage(src: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = reject
    img.src = src
  })
}
