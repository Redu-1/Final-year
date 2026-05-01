// src/pages/Profile/SavedHerbs.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Heart, Leaf, Trash2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getApiBaseUrl } from '../../services/herbApi'

const SavedHerbs = () => {
  const [savedHerbs, setSavedHerbs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRemoving, setIsRemoving] = useState(null)
  
  const { user, token } = useAuth()
  const API_BASE_URL = getApiBaseUrl()

  // Fetch saved herbs
  const fetchSavedHerbs = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const authToken = token || localStorage.getItem('herbisense_token') || localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/saved-herbs/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setSavedHerbs(data.data)
        } else {
          setSavedHerbs([])
        }
      } else if (response.status === 404) {
        // No saved herbs endpoint or no saved herbs yet
        setSavedHerbs([])
      } else {
        throw new Error('Failed to fetch saved herbs')
      }
    } catch (error) {
      console.error('Error fetching saved herbs:', error)
      setError('Unable to load saved herbs. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Remove a saved herb
  const handleRemove = async (herbId, herbName) => {
    if (!confirm(`Remove "${herbName}" from your saved herbs?`)) return
    
    setIsRemoving(herbId)
    
    try {
      const authToken = token || localStorage.getItem('herbisense_token') || localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/saved-herbs/${user.id}/${herbId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        // Remove from local state
        setSavedHerbs(prev => prev.filter(h => h.herb_id !== herbId && h.herb?.id !== herbId))
      } else {
        throw new Error('Failed to remove saved herb')
      }
    } catch (error) {
      console.error('Error removing saved herb:', error)
      alert('Failed to remove herb. Please try again.')
    } finally {
      setIsRemoving(null)
    }
  }

  useEffect(() => {
    fetchSavedHerbs()
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/profile" 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Herbs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Herbs you've saved for later reference
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Error loading saved herbs</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchSavedHerbs}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!error && savedHerbs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-10 w-10 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved herbs yet</h3>
          <p className="text-gray-500 mb-4">
            Start exploring herbs and save your favorites for easy access
          </p>
          <Link
            to="/herbs"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Leaf className="h-4 w-4 mr-2" />
            Browse Herbs
          </Link>
        </div>
      )}

      {/* Saved Herbs Grid */}
      {!error && savedHerbs.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-500">
            {savedHerbs.length} {savedHerbs.length === 1 ? 'herb' : 'herbs'} saved
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {savedHerbs.map((item) => {
              const herb = item.herb || item
              return (
                <div
                  key={item.id || herb.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
                >
                  {/* Herb Image */}
                  <div className="relative h-40 bg-gray-100">
                    {herb.image_url || herb.imageUrl ? (
                      <img
                        src={herb.image_url || herb.imageUrl}
                        alt={herb.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                        <Leaf className="h-12 w-12 text-emerald-300" />
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(herb.id, herb.name)}
                      disabled={isRemoving === herb.id}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Herb Info */}
                  <div className="p-4">
                    <Link to={`/herbs/${herb.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1">
                        {herb.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 italic mt-0.5 line-clamp-1">
                      {herb.scientific_name || herb.scientificName}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {herb.description}
                    </p>
                    
                    {/* Saved Date */}
                    {item.created_at && (
                      <p className="text-xs text-gray-400 mt-3">
                        Saved on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    )}
                    
                    <Link
                      to={`/herbs/${herb.id}`}
                      className="inline-flex items-center mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      View Details
                      <Heart className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default SavedHerbs
