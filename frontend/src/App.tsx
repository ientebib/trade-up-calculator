import { useState } from 'react'
import './index.css'

function App() {
  const [runId, setRunId] = useState<number | null>(null)

  const generate = async () => {
    const res = await fetch('http://localhost:8000/upload?generate=true', { method: 'POST' })
    const data = await res.json()
    setRunId(data.run_id)
  }

  return (
    <div className="p-4 text-gray-100 bg-gray-900 min-h-screen">
      <h1 className="text-xl mb-4">Trade-Up Batch Demo</h1>
      <button className="bg-blue-600 px-4 py-2" onClick={generate}>Generate Demo Data</button>
      {runId && <p className="mt-4">Created run {runId}</p>}
    </div>
  )
}

export default App
