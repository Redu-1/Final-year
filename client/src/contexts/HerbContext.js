// src/context/HerbContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const HerbContext = createContext()

export const useHerbs = () => {
  const context = useContext(HerbContext)
  if (!context) {
    throw new Error('useHerbs must be used within a HerbProvider')
  }
  return context
}

export const HerbProvider = ({ children }) => {
  const [herbs, setHerbs] = useState([])
  const [featuredHerbs, setFeaturedHerbs] = useState([])
  const [bookmarkedHerbs, setBookmarkedHerbs] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    categories: [],
    uses: [],
    regions: [],
    preparation: [],
    safety: []
  })

  // Mock herb data
  const mockHerbsData = [
    {
      id: 1,
      name: "Aloe Vera",
      localName: "Eret, Herbo",
      scientificName: "Aloe barbadensis miller",
      description: "A succulent plant known for its soothing, healing, and moisturizing properties for various skin conditions.",
      image: "https://images.unsplash.com/photo-1599302592159-3b4d19b355d8",
      category: "Succulent",
      uses: ["Burns", "Inflammation", "Sunburn", "Dry Skin"],
      benefits: [
        "Soothes inflammation",
        "Accelerates healing",
        "Provides deep hydration",
        "Calms skin irritation"
      ],
      preparation: [
        {
          method: "Gel Extraction",
          steps: [
            "Harvest fresh Aloe Vera leaves",
            "Wash leaves thoroughly",
            "Extract clear gel from inner leaf",
            "Apply directly to affected area"
          ],
          difficulty: "Easy",
          duration: "10 minutes"
        }
      ],
      safety: {
        level: "safe",
        precautions: [
          "Generally safe for topical use",
          "Patch test recommended for sensitive skin",
          "Do not ingest without guidance"
        ]
      },
      effectiveness: 95,
      views: 2450,
      isBookmarked: false,
      region: "Throughout Ethiopia",
      traditionalUse: 2000,
      researchPapers: 3,
      popularity: 98
    },
    {
      id: 2,
      name: "Kosso",
      localName: "Koso",
      scientificName: "Hagenia abyssinica",
      description: "Traditional Ethiopian herb used for skin purification and detoxification.",
      image: "https://images.unsplash.com/photo-1589923186741-db6e5d06b6ef",
      category: "Tree Bark",
      uses: ["Skin purification", "Anti-parasitic", "Cleansing"],
      benefits: [
        "Deep cleansing",
        "Removes toxins",
        "Improves skin texture",
        "Antimicrobial properties"
      ],
      preparation: [
        {
          method: "Bark Infusion",
          steps: [
            "Collect dried bark pieces",
            "Boil in water for 20 minutes",
            "Strain the infusion",
            "Use as skin wash"
          ],
          difficulty: "Medium",
          duration: "25 minutes"
        }
      ],
      safety: {
        level: "caution",
        precautions: [
          "Use under traditional healer guidance",
          "Not recommended for pregnant women",
          "Limited topical use"
        ]
      },
      effectiveness: 88,
      views: 1890,
      isBookmarked: true,
      region: "Highlands of Ethiopia",
      traditionalUse: 500,
      researchPapers: 2,
      popularity: 85
    },
    // Add more mock herbs as needed
  ]

  useEffect(() => {
    const loadHerbs = async () => {
      setIsLoading(true)
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Load saved data from localStorage
        const savedBookmarks = localStorage.getItem('herbisense_bookmarks')
        const savedHistory = localStorage.getItem('herbisense_search_history')
        const savedViewed = localStorage.getItem('herbisense_recently_viewed')
        
        if (savedBookmarks) {
          setBookmarkedHerbs(JSON.parse(savedBookmarks))
        }
        
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory))
        }
        
        if (savedViewed) {
          setRecentlyViewed(JSON.parse(savedViewed))
        }
        
        // Set mock data
        setHerbs(mockHerbsData)
        
        // Set featured herbs (first 3)
        setFeaturedHerbs(mockHerbsData.slice(0, 3))
        
      } catch (error) {
        console.error('Error loading herbs:', error)
        toast.error('Failed to load herb data')
      } finally {
        setIsLoading(false)
      }
    }

    loadHerbs()
  }, [])

  const getHerbById = (id) => {
    return herbs.find(herb => herb.id === parseInt(id))
  }

  const searchHerbs = (query, filters = {}) => {
    if (!query) return herbs
    
    const lowercaseQuery = query.toLowerCase()
    
    return herbs.filter(herb => {
      // Search in name, local name, and scientific name
      const matchesSearch = 
        herb.name.toLowerCase().includes(lowercaseQuery) ||
        herb.localName.toLowerCase().includes(lowercaseQuery) ||
        herb.scientificName.toLowerCase().includes(lowercaseQuery) ||
        herb.uses.some(use => use.toLowerCase().includes(lowercaseQuery)) ||
        herb.description.toLowerCase().includes(lowercaseQuery)
      
      // Apply filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value.length === 0) return true
        
        if (key === 'categories') {
          return value.includes(herb.category.toLowerCase())
        }
        
        if (key === 'uses') {
          return value.some(filterUse => 
            herb.uses.some(herbUse => 
              herbUse.toLowerCase().includes(filterUse.toLowerCase())
            )
          )
        }
        
        if (key === 'regions') {
          return value.includes(herb.region.toLowerCase())
        }
        
        return true
      })
      
      return matchesSearch && matchesFilters
    })
  }

  const toggleBookmark = (herbId) => {
    setHerbs(prevHerbs =>
      prevHerbs.map(herb =>
        herb.id === herbId ? { ...herb, isBookmarked: !herb.isBookmarked } : herb
      )
    )
    
    const herb = getHerbById(herbId)
    if (!herb) return
    
    setBookmarkedHerbs(prev => {
      const isCurrentlyBookmarked = prev.some(h => h.id === herbId)
      let updatedBookmarks
      
      if (isCurrentlyBookmarked) {
        updatedBookmarks = prev.filter(h => h.id !== herbId)
        toast.info(`Removed ${herb.name} from bookmarks`, {
          icon: '📌'
        })
      } else {
        updatedBookmarks = [...prev, { ...herb, isBookmarked: true }]
        toast.success(`Added ${herb.name} to bookmarks`, {
          icon: '✅'
        })
      }
      
      // Save to localStorage
      localStorage.setItem('herbisense_bookmarks', JSON.stringify(updatedBookmarks))
      
      return updatedBookmarks
    })
  }

  const addToRecentlyViewed = (herbId) => {
    const herb = getHerbById(herbId)
    if (!herb) return
    
    setRecentlyViewed(prev => {
      const updated = [herb, ...prev.filter(h => h.id !== herbId)].slice(0, 10)
      
      // Save to localStorage
      localStorage.setItem('herbisense_recently_viewed', JSON.stringify(updated))
      
      return updated
    })
  }

  const addToSearchHistory = (query) => {
    if (!query.trim()) return
    
    setSearchHistory(prev => {
      const updated = [
        { query, timestamp: Date.now() },
        ...prev.filter(item => item.query.toLowerCase() !== query.toLowerCase())
      ].slice(0, 10)
      
      // Save to localStorage
      localStorage.setItem('herbisense_search_history', JSON.stringify(updated))
      
      return updated
    })
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('herbisense_search_history')
    toast.info('Search history cleared')
  }

  const getPopularHerbs = (limit = 6) => {
    return [...herbs]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
  }

  const getHerbsByCategory = (category) => {
    return herbs.filter(herb => 
      herb.category.toLowerCase() === category.toLowerCase()
    )
  }

  const getHerbsByUse = (use) => {
    return herbs.filter(herb => 
      herb.uses.some(herbUse => 
        herbUse.toLowerCase().includes(use.toLowerCase())
      )
    )
  }

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      uses: [],
      regions: [],
      preparation: [],
      safety: []
    })
  }

  const value = {
    herbs,
    featuredHerbs,
    bookmarkedHerbs,
    recentlyViewed,
    searchHistory,
    isLoading,
    filters,
    getHerbById,
    searchHerbs,
    toggleBookmark,
    addToRecentlyViewed,
    addToSearchHistory,
    clearSearchHistory,
    getPopularHerbs,
    getHerbsByCategory,
    getHerbsByUse,
    updateFilters,
    clearFilters
  }

  return (
    <HerbContext.Provider value={value}>
      {children}
    </HerbContext.Provider>
  )
}