import { useEffect, useState } from 'react'
import { Category, Collection } from '../services/types'
import { getCategories } from '../services/categories'
import { getCollections } from '../services/collections'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getCategories()
      .then((data) => {
        if (mounted) {
          setCategories(data)
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

  return { categories, loading, error }
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getCollections()
      .then((data) => {
        if (mounted) {
          setCollections(data)
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

  return { collections, loading, error }
}
