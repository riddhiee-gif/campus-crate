import Navbar from './components/Navbar'
import ItemGrid from './components/ItemGrid'
import PostItemForm from './components/PostItemForm'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ItemGrid />
      <PostItemForm />
    </div>
  )
}

export default App