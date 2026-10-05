import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../supabaseClient'

function normalizePrice(value) {
  const parsed = Number.parseInt(String(value).trim(), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function PostItemForm() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [condition, setCondition] = useState('Good')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!imageFile) {
      alert('Please choose a photo of your item.')
      return
    }

    const normalizedPrice = normalizePrice(price)
    if (normalizedPrice === null) {
      alert('Please enter a valid price in rupees.')
      return
    }

    setLoading(true)

    if (!isSupabaseConfigured) {
      const demoItems = JSON.parse(localStorage.getItem('campus-crate-demo-items') || '[]')
      const newItem = {
        id: Date.now(),
        title,
        price: normalizedPrice,
        category,
        condition,
        image_url: URL.createObjectURL(imageFile),
      }

      localStorage.setItem('campus-crate-demo-items', JSON.stringify([newItem, ...demoItems]))
      window.dispatchEvent(new CustomEvent('campus-crate:item-added'))

      setLoading(false)
      alert(`"${title}" posted successfully in demo mode!`)
      setTitle('')
      setPrice('')
      setCategory('Electronics')
      setCondition('Good')
      setImageFile(null)
      e.target.reset()
      return
    }

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(fileName, imageFile)

    if (uploadError) {
      alert('Image upload failed: ' + uploadError.message)
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    const { error: insertError } = await supabase.from('items').insert({
      title,
      price: normalizedPrice,
      category,
      condition,
      image_url: imageUrl,
    })

    setLoading(false)

    if (insertError) {
      alert('Something went wrong: ' + insertError.message)
    } else {
      alert(`"${title}" posted successfully with your photo!`)
      setTitle('')
      setPrice('')
      setCategory('Electronics')
      setCondition('Good')
      setImageFile(null)
      e.target.reset()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">Post an Item</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Scientific Calculator"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 450"
          min="1"
          step="1"
          inputMode="numeric"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option>Electronics</option>
          <option>Books</option>
          <option>Furniture</option>
          <option>Vehicles</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Condition</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option>New</option>
          <option>Like New</option>
          <option>Good</option>
          <option>Fair</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Post Item'}
      </button>
    </form>
  )
}

export default PostItemForm