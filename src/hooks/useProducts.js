import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Hook to fetch all products from Supabase
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('product')
        .select('*')

      if (error) {
        setError(error.message)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

// Function to insert a new product
export async function addProduct(product) {
  const { data, error } = await supabase
    .from('product')
    .insert([product])
    .select()

  return { data, error }
}

// Function to update a product by id
export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('product')
    .update(updates)
    .eq('id', id)
    .select()

  return { data, error }
}

// Function to delete a product by id
export async function deleteProduct(id) {
  const { error } = await supabase
    .from('product')
    .delete()
    .eq('id', id)

  return { error }
}
