import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../supabaseClient'
import ItemCard from './ItemCard'

const demoItems = [
  {
    id: 1,
    title: 'Mechanical Keyboard',
    price: 1800,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'DSA Book Set',
    price: 650,
    category: 'Books',
    image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'Study Table',
    price: 2400,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
]

function ItemGrid() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()

    const handleItemAdded = () => fetchItems()
    window.addEventListener('campus-crate:item-added', handleItemAdded)

    return () => window.removeEventListener('campus-crate:item-added', handleItemAdded)
  }, [])

  async function fetchItems() {
    setLoading(true)

    if (!isSupabaseConfigured) {
      const savedItems = localStorage.getItem('campus-crate-demo-items')
      setItems(savedItems ? JSON.parse(savedItems) : demoItems)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setItems(demoItems)
    } else {
      setItems(data.length ? data : demoItems)
    }

    setLoading(false)
  }

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading items...</p>
  }

  if (items.length === 0) {
    return <p className="text-center py-10 text-gray-500">No items yet. Be the first to post one!</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {items.map((item) => (
        <ItemCard key={item.id} {...item} />
      ))}
    </div>
  )
}

export default ItemGrid