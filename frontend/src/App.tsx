import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './index.css'

// Types
interface Run {
  id: number
  created_at: string
  offers: number
}

interface Client {
  id: number
  client_id: string
  orig_loan_amount: number
  current_vehicle_value: number
  equity: number
  current_risk_tier: string
  new_risk_tier: string
  current_total_payment_gross: number
}

interface Offer {
  id: number
  client_id: string
  vehicle_id: string
  term: number
  new_payment_gross: number
  npv: number
  price_delta: number
  payment_delta: number
  archetype: string
  score: number
}

// API functions
const api = {
  async generateDemo() {
    const res = await fetch('http://localhost:8000/upload?generate=true', { method: 'POST' })
    return await res.json()
  },
  
  async getRuns(): Promise<Run[]> {
    const res = await fetch('http://localhost:8000/runs')
    return await res.json()
  },
  
  async getClients(runId: number): Promise<Client[]> {
    const res = await fetch(`http://localhost:8000/runs/${runId}/clients`)
    return await res.json()
  },
  
  async getOffers(runId: number, clientId?: string): Promise<Offer[]> {
    const url = clientId 
      ? `http://localhost:8000/runs/${runId}/offers?client_id=${clientId}`
      : `http://localhost:8000/runs/${runId}/offers`
    const res = await fetch(url)
    return await res.json()
  }
}

// Dashboard Component
function Dashboard() {
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadRuns()
  }, [])

  const loadRuns = async () => {
    try {
      const data = await api.getRuns()
      setRuns(data)
    } catch (error) {
      console.error('Failed to load runs:', error)
    }
  }

  const generateDemo = async () => {
    setLoading(true)
    try {
      const result = await api.generateDemo()
      console.log('Generated run:', result)
      await loadRuns() // Refresh the runs list
    } catch (error) {
      console.error('Failed to generate demo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trade-Up Optimization Dashboard</h1>
          <p className="text-gray-400">Automotive finance portfolio optimization and analytics</p>
        </div>
        <button 
          onClick={generateDemo}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Demo Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Runs</h3>
          <p className="text-3xl font-bold text-blue-400">{runs.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Offers</h3>
          <p className="text-3xl font-bold text-green-400">
            {runs.reduce((sum, run) => sum + run.offers, 0)}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Latest Run</h3>
          <p className="text-3xl font-bold text-purple-400">
            {runs.length > 0 ? `#${runs[runs.length - 1].id}` : 'None'}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Processing Runs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Run ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Offers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">#{run.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(run.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{run.offers}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button 
                      onClick={() => navigate(`/runs/${run.id}/clients`)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View Clients
                    </button>
                    <button 
                      onClick={() => navigate(`/runs/${run.id}/offers`)}
                      className="text-green-400 hover:text-green-300"
                    >
                      View Offers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {runs.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No runs found. Generate demo data to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Clients View Component
function ClientsView() {
  const [clients, setClients] = useState<Client[]>([])
  const [runId, setRunId] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    const pathParts = window.location.pathname.split('/')
    const id = parseInt(pathParts[2])
    setRunId(id)
    loadClients(id)
  }, [])

  const loadClients = async (id: number) => {
    try {
      const data = await api.getClients(id)
      setClients(data)
    } catch (error) {
      console.error('Failed to load clients:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="text-blue-400 hover:text-blue-300 mr-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-white">Clients - Run #{runId}</h1>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Client ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Loan Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Vehicle Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Equity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Risk Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-700">
                  <td className="px-4 py-4 text-sm font-medium text-white">{client.client_id}</td>
                  <td className="px-4 py-4 text-sm text-gray-300">${client.orig_loan_amount.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-gray-300">${client.current_vehicle_value.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={client.equity >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${client.equity.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className="px-2 py-1 rounded text-xs bg-gray-700">
                      {client.current_risk_tier} → {client.new_risk_tier}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-300">${client.current_total_payment_gross.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm">
                    <button 
                      onClick={() => navigate(`/runs/${runId}/offers?client=${client.client_id}`)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View Offers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Offers View Component
function OffersView() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [runId, setRunId] = useState<number>(0)
  const [clientId, setClientId] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const pathParts = window.location.pathname.split('/')
    const id = parseInt(pathParts[2])
    const urlParams = new URLSearchParams(window.location.search)
    const client = urlParams.get('client') || ''
    
    setRunId(id)
    setClientId(client)
    loadOffers(id, client)
  }, [])

  const loadOffers = async (id: number, client?: string) => {
    try {
      const data = await api.getOffers(id, client)
      setOffers(data)
    } catch (error) {
      console.error('Failed to load offers:', error)
    }
  }

  const getArchetypeColor = (archetype: string) => {
    switch (archetype) {
      case 'TU-1': return 'bg-green-600'
      case 'TU-2': return 'bg-blue-600'
      case 'TD-1': return 'bg-yellow-600'
      case 'TD-2': return 'bg-purple-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="text-blue-400 hover:text-blue-300 mr-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-white">
          Offers - Run #{runId} {clientId && `- Client ${clientId}`}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['TU-1', 'TU-2', 'TD-1', 'TD-2'].map(archetype => {
          const count = offers.filter(o => o.archetype === archetype).length
          return (
            <div key={archetype} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400">{archetype}</h3>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">Client</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">Vehicle</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">Term</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">Payment</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">NPV</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price Δ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">Payment Δ</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">Archetype</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-700">
                  <td className="px-3 py-4 text-sm font-medium text-white">{offer.client_id}</td>
                  <td className="px-3 py-4 text-sm text-gray-300">{offer.vehicle_id}</td>
                  <td className="px-3 py-4 text-sm text-gray-300">{offer.term}mo</td>
                  <td className="px-3 py-4 text-sm text-gray-300">${offer.new_payment_gross.toLocaleString()}</td>
                  <td className="px-3 py-4 text-sm">
                    <span className={offer.npv >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${offer.npv.toFixed(0)}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <span className={offer.price_delta >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {(offer.price_delta * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <span className={offer.payment_delta >= 0 ? 'text-red-400' : 'text-green-400'}>
                      {(offer.payment_delta * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs text-white ${getArchetypeColor(offer.archetype)}`}>
                      {offer.archetype}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-300">{offer.score.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/runs/:runId/clients" element={<ClientsView />} />
          <Route path="/runs/:runId/offers" element={<OffersView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
