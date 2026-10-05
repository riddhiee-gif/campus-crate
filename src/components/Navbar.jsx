function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-indigo-600">Campus Crate 🛒</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search for items..."
        className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Buttons */}
      <div className="flex gap-3">
        <button className="text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50">
          Login
        </button>
        <button className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Sell Item
        </button>
      </div>
    </nav>
  )
}

export default Navbar