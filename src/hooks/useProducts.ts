import { useEffect, useState } from 'react'
import { UIProduct } from '../services/types'
import { getProducts, getFeaturedProducts, getProductBySlug, getProductsByCategory, getProductsByCollection, getRelatedProducts } from '../services/products'

export function useProducts() {
  const [products, setProducts] = useState<UIProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getProducts()
      .then((data) => {
        if (mounted) {
          setProducts(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  return { products, loading, error }
}

export function useFeaturedProducts(limit = 8) {
  const [products, setProducts] = useState<UIProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getFeaturedProducts(limit)
      .then((data) => {
        if (mounted) {
          setProducts(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [limit])

  return { products, loading, error }
}

export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct] = useState<UIProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)
    getProductBySlug(slug)
      .then((data) => {
        if (mounted) {
          setProduct(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [slug])

  return { product, loading, error }
}

export function useProductsByCategory(category: string) {
  const [products, setProducts] = useState<UIProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getProductsByCategory(category)
      .then((data) => {
        if (mounted) {
          setProducts(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [category])

  return { products, loading, error }
}

export function useProductsByCollection(collectionSlug: string) {
  const [products, setProducts] = useState<UIProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!collectionSlug) {
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)
    getProductsByCollection(collectionSlug)
      .then((data) => {
        if (mounted) {
          setProducts(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [collectionSlug])

  return { products, loading, error }
}

export function useRelatedProducts(slug: string | undefined, category: string | undefined, limit = 4) {
  const [products, setProducts] = useState<UIProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug || !category) {
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)
    getRelatedProducts(slug, category, limit)
      .then((data) => {
        if (mounted) {
          setProducts(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [slug, category, limit])

  return { products, loading, error }
}
