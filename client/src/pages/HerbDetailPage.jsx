// src/pages/HerbDetailPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout, { PageWrapper } from '../components/layout/Layout'
import HerbDetail from '../components/herbs/HerbDetail'
import { LoadingDots } from '../components/common/LoadingSpinner'

const HerbDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [herb, setHerb] = useState(null)

  // Mock herb data
  const mockHerbs = {
    1: {
      id: 1,
      name: "Aloe Vera",
      localName: "Eret, Herbo",
      scientificName: "Aloe barbadensis miller",
      description: "Aloe vera, a succulent plant, has been revered for centuries in traditional Ethiopian medicine for its profound healing properties, especially for skin ailments. Its thick, fleshy leaves contain a gel-like substance rich in vitamins, enzymes, minerals, and amino acids. This natural composition makes it an exceptional remedy for various dermatological conditions, promoting skin repair and soothing irritation. Its presence in traditional practices highlights its significance as a versatile and potent botanical remedy.",
      category: "Succulent",
      uses: ["Burns", "Inflammation", "Sunburn", "Dry Skin", "Minor Wounds", "Skin Infections"],
      effectiveness: 95,
      views: 2450,
      isBookmarked: false,
      region: "Throughout Ethiopia",
      traditionalUse: 2000,
      preparation: "Traditional gel extraction",
      safety: "Generally safe for topical use",
    },
    2: {
      id: 2,
      name: "Kosso",
      localName: "Koso",
      scientificName: "Hagenia abyssinica",
      description: "Traditional Ethiopian herb used for skin purification and detoxification. Known for its anthelmintic properties and traditional use in skin purification.",
      category: "Tree Bark",
      uses: ["Skin purification", "Anti-parasitic", "Cleansing"],
      effectiveness: 88,
      views: 1890,
      isBookmarked: true,
      region: "Highlands of Ethiopia",
      traditionalUse: 500,
      preparation: "Bark infusion",
      safety: "Use under guidance",
    },
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const herbData = mockHerbs[id] || mockHerbs[1]
      setHerb(herbData)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  if (isLoading || !herb) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingDots size="lg" />
      </div>
    )
  }

  return (
    <Layout>
      <PageWrapper>
        {/* Main Content - Only HerbDetail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <HerbDetail herb={herb} />
          </div>
        </div>
      </PageWrapper>
    </Layout>
  )
}

export default HerbDetailPage