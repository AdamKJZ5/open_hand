import { useState } from 'react'
import './styles/index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-screen bg-blue-500 flex flex-col items-center justify-center gap-6">
      <h1 className="text-white text-4xl font-bold">Hello Tailwind!</h1>
        
      <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-700">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
