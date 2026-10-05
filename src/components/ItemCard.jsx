function ItemCard({ title, price, category, image_url }) {
  const safePrice = Number.isFinite(Number(price)) ? Number(price) : price

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={image_url}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-indigo-600 font-bold mt-1">₹{safePrice}</p>
        <span className="text-xs text-gray-500">{category}</span>
      </div>
    </div>
  )
}

export default ItemCard