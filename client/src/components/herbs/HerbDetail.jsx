// src/components/herbs/HerbDetail.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Leaf, ChevronLeft, Calendar, 
  AlertCircle, Clock, Droplets, 
  Flame, Shield, Zap, CheckCircle,
  FlaskConical, AlertTriangle, Eye,
  BookOpen, Layers, Activity, Bug, Pill, Flower2,
  Star, Send, User, ThumbsUp, MessageCircle,
  ChevronDown, ChevronUp
} from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { getApiBaseUrl } from '../../services/herbApi'
import { useAuth } from '../../contexts/AuthContext'

const HerbDetail = ({ herb }) => {
  const [activeTab, setActiveTab] = useState('description')
  const [openSections, setOpenSections] = useState({
    description: true,
    preparation: false,
    safety: false,
    source: false,
    reviews: false
  })
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, token } = useAuth()
  
  // Rating states
  const [ratingValue, setRatingValue] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ratings, setRatings] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [userRating, setUserRating] = useState(null)
  const [isLoadingRatings, setIsLoadingRatings] = useState(false)

  const API_BASE_URL = getApiBaseUrl()

  // Use real herb data
  const herbData = {
    id: herb.id,
    name: herb.name || 'Unknown Herb',
    scientificName: herb.scientificName || herb.scientific_name || '',
    description: herb.description || 'No description available',
    preparation: herb.preparation || 'No preparation information available',
    safetyWarning: herb.safetyWarning || herb.safety_warning || 'No safety information available',
    source: herb.source || '',
    views: herb.views || 0,
    createdAt: herb.createdAt || herb.created_at,
    updatedAt: herb.updatedAt || herb.updated_at,
    conditionIds: herb.conditionIds || [],
    conditionNames: herb.conditionNames || [],
    averageRating: herb.averageRating || 0,
    ratingCount: herb.ratingCount || 0
  };

  // Parse safety warning into bullet points
  const safetyPoints = herbData.safetyWarning.split('. ').filter(point => point.trim().length > 0);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Toggle section on mobile
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get condition icon based on name
  const getConditionIcon = (conditionName) => {
    const name = conditionName?.toLowerCase() || '';
    if (name.includes('acne')) return Bug;
    if (name.includes('inflammation') || name.includes('inflammatory')) return Flame;
    if (name.includes('rash')) return Activity;
    if (name.includes('skin')) return Shield;
    if (name.includes('chebt')) return Zap;
    if (name.includes('hb')) return Pill;
    return Flower2;
  };

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const authToken = token || localStorage.getItem('herbisense_token') || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken.replace(/^["']|["']$/g, '')}`;
    }
    return headers;
  };

  // Fetch ratings for this herb
  const fetchRatings = async () => {
    if (!herbData.id) return;
    setIsLoadingRatings(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/${herbData.id}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const ratingsData = data.data || [];
          setRatings(ratingsData);
          const total = ratingsData.reduce((sum, r) => sum + parseFloat(r.rating_value), 0);
          const avg = ratingsData.length > 0 ? total / ratingsData.length : 0;
          setAverageRating(avg);
          setTotalRatings(ratingsData.length);
          if (user && user.id) {
            const userRatingFound = ratingsData.find(r => r.user_id === user.id);
            if (userRatingFound) {
              setUserRating(userRatingFound);
              setRatingValue(parseFloat(userRatingFound.rating_value));
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    } finally {
      setIsLoadingRatings(false);
    }
  };

  // Submit rating
  const submitRating = async () => {
    if (!user) {
      alert('Please login to rate this herb');
      return;
    }
    if (ratingValue === 0) {
      alert('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    const requestBody = {
      herbId: herbData.id,
      ratingValue: ratingValue,
      comment: comment.trim() || null
    };
    try {
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(data.message || 'Rating submitted successfully!');
          setComment('');
          await fetchRatings();
        }
      } else {
        const error = await response.json().catch(() => ({}));
        alert(error.message || `Failed to submit rating`);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load ratings on mount
  useEffect(() => {
    fetchRatings();
  }, [herbData.id]);

  // Render stars
  const renderStars = (rating, size = "h-5 w-5") => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${size} text-yellow-400 fill-current`} />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${size} text-yellow-400`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${size} text-yellow-400 fill-current`} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${size} text-gray-300`} />
        ))}
      </div>
    );
  };

  // Render interactive stars
  const renderInteractiveStars = () => {
    return (
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRatingValue(star)}
            className="focus:outline-none transition-transform hover:scale-110"
            disabled={isSubmitting}
          >
            <Star
              className={`h-8 w-8 ${
                (hoverRating || ratingValue) >= star
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const benefits = [
    { icon: Flame, label: 'Anti-inflammatory', color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: Droplets, label: 'Hydrating', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Shield, label: 'Protective', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Zap, label: 'Healing', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  // Section configuration
  const sections = [
    { id: 'description', label: 'Description', icon: BookOpen, desktopOnly: false },
    { id: 'preparation', label: 'Preparation', icon: FlaskConical, desktopOnly: false },
    { id: 'safety', label: 'Safety', icon: AlertTriangle, desktopOnly: false },
    { id: 'source', label: 'Source', icon: BookOpen, desktopOnly: false },
    { id: 'reviews', label: 'Reviews', icon: MessageCircle, desktopOnly: false },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Back Navigation */}
      <button
        onClick={handleGoBack}
        className="flex items-center text-emerald-600 hover:text-emerald-700 mb-4 sm:mb-6 transition-all group"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs sm:text-sm font-medium">Back</span>
      </button>

      {/* Hero Section - Herb Name Prominently Displayed */}
      <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl border border-emerald-100 p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 break-words">{herbData.name}</h1>
            <p className="text-base sm:text-lg text-gray-600 italic mt-1 break-words">{herbData.scientificName}</p>
            
            {/* Rating Summary */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
              <div className="flex items-center">
                {renderStars(averageRating, "h-3 w-3 sm:h-4 sm:w-4")}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {averageRating.toFixed(1)} / 5
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Added {herbData.createdAt ? new Date(herbData.createdAt).toLocaleDateString() : 'Recently'}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>{herbData.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Desktop Tabs - Horizontal */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                      activeTab === section.id
                        ? 'text-emerald-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <section.icon className="h-4 w-4 inline mr-2" />
                    {section.label}
                    {activeTab === section.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{herbData.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className={`${benefit.bg} rounded-xl p-3 text-center`}>
                        <benefit.icon className={`h-6 w-6 ${benefit.color} mx-auto mb-2`} />
                        <span className="text-xs font-medium text-gray-700">{benefit.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparation Tab */}
              {activeTab === 'preparation' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed flex-1">{herbData.preparation}</p>
                  </div>
                </div>
              )}

              {/* Safety Tab */}
              {activeTab === 'safety' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {safetyPoints.length > 0 ? (
                      safetyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                          <p className="text-gray-700 flex-1">{point}.</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">{herbData.safetyWarning}</p>
                    )}
                  </div>
                  {/* <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm text-amber-800">Always consult with a healthcare provider before using any herbal remedy.</p>
                  </div> */}
                </div>
              )}

              {/* Source Tab */}
              {activeTab === 'source' && (
                <div className="space-y-4">
                  {herbData.source ? (
                    <>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{herbData.source}</p>
                      </div>
                      {/* <p className="text-xs text-gray-500">Information source for this herb's medicinal properties and usage</p> */}
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No source information available.</p>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-emerald-600" />
                      {userRating ? 'Update Your Rating' : 'Rate this Herb'}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-sm text-gray-600">Your Rating</span>
                        {renderInteractiveStars()}
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="3"
                        placeholder="Share your experience..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                        disabled={isSubmitting}
                      />
                      <button
                        onClick={submitRating}
                        disabled={isSubmitting || ratingValue === 0}
                        className={`w-full py-2 rounded-lg font-medium transition-all ${
                          isSubmitting || ratingValue === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isSubmitting ? 'Submitting...' : (userRating ? 'Update Rating' : 'Submit Rating')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-emerald-600" />
                      User Reviews ({totalRatings})
                    </h3>
                    {isLoadingRatings ? (
                      <div className="text-center py-8">Loading reviews...</div>
                    ) : ratings.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No reviews yet. Be the first!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ratings.map((rating, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                                {rating.user?.full_name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{rating.user?.full_name || `User ${rating.user_id}`}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {renderStars(rating.rating_value, "h-4 w-4")}
                                  <span className="text-xs text-gray-500">
                                    {new Date(rating.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {rating.comment && <p className="mt-3 text-gray-700">{rating.comment}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Accordion Sections */}
          <div className="lg:hidden space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-gray-900">{section.label}</span>
                  </div>
                  {openSections[section.id] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {openSections[section.id] && (
                  <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/30">
                    {/* Description Section */}
                    {section.id === 'description' && (
                      <div className="space-y-3">
                        <p className="text-gray-700 leading-relaxed text-sm">{herbData.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {benefits.map((benefit, index) => (
                            <div key={index} className={`${benefit.bg} rounded-lg p-2 text-center`}>
                              <benefit.icon className={`h-5 w-5 ${benefit.color} mx-auto mb-1`} />
                              <span className="text-xs font-medium text-gray-700">{benefit.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preparation Section */}
                    {section.id === 'preparation' && (
                      <div className="flex items-start gap-2">
                        <FlaskConical className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm leading-relaxed">{herbData.preparation}</p>
                      </div>
                    )}

                    {/* Safety Section */}
                    {section.id === 'safety' && (
                      <div className="space-y-2">
                        {safetyPoints.slice(0, 4).map((point, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                            <p className="text-gray-700 text-sm flex-1">{point}.</p>
                          </div>
                        ))}
                        <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                          {/* <p className="text-xs text-amber-700">Always consult a healthcare provider before use.</p> */}
                        </div>
                      </div>
                    )}

                    {/* Source Section */}
                    {section.id === 'source' && (
                      <div>
                        {herbData.source ? (
                          <>
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                              <p className="text-gray-700 text-sm">{herbData.source}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Source for this herb's information</p>
                          </>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No source information available.</p>
                        )}
                      </div>
                    )}

                    {/* Reviews Section */}
                    {section.id === 'reviews' && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-emerald-600" />
                            {userRating ? 'Update Rating' : 'Rate this Herb'}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-xs text-gray-600">Your Rating</span>
                              {renderInteractiveStars()}
                            </div>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows="2"
                              placeholder="Share your experience..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                              disabled={isSubmitting}
                            />
                            <button
                              onClick={submitRating}
                              disabled={isSubmitting || ratingValue === 0}
                              className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${
                                isSubmitting || ratingValue === 0
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {isSubmitting ? 'Submitting...' : (userRating ? 'Update Rating' : 'Submit Rating')}
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-emerald-600" />
                            User Reviews ({totalRatings})
                          </h4>
                          {ratings.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                              <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">No reviews yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {ratings.slice(0, 5).map((rating, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                                      {rating.user?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900 text-sm">{rating.user?.full_name || `User ${rating.user_id}`}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        {renderStars(rating.rating_value, "h-3 w-3")}
                                        <span className="text-xs text-gray-400">
                                          {new Date(rating.created_at).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {rating.comment && <p className="mt-2 text-gray-600 text-sm">{rating.comment}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Info Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Info</h3>
            <div className="space-y-2 sm:space-y-3">
              {/* <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-600">Status</span>
                <span className="text-xs sm:text-sm font-medium text-emerald-600 bg-emerald-50 px-2 sm:px-3 py-1 rounded-full">
                  Published
                </span>
              </div> */}
              
              <div className="py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Conditions Treated</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {herbData.conditionNames && herbData.conditionNames.length > 0 ? (
                    herbData.conditionNames.slice(0, 3).map((conditionName, index) => {
                      const Icon = getConditionIcon(conditionName);
                      return (
                        <span key={index} className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-100 text-emerald-700">
                          <Icon className="h-2 w-2 sm:h-3 sm:w-3" />
                          {conditionName.length > 15 ? conditionName.substring(0, 12) + '...' : conditionName}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-500">General Wellness</span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-xs sm:text-sm text-gray-600">Last Updated</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {herbData.updatedAt ? new Date(herbData.updatedAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Summary Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl sm:rounded-2xl border border-yellow-100 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Rating Summary</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">{renderStars(averageRating, "h-4 w-4 sm:h-5 sm:w-5")}</div>
              <p className="text-xs sm:text-sm text-gray-600">Based on {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}</p>
            </div>
            {!userRating && user && (
              <button 
                onClick={() => {
                  setActiveTab('reviews');
                  if (window.innerWidth < 1024) toggleSection('reviews');
                }} 
                className="mt-4 w-full text-center text-xs sm:text-sm font-medium text-emerald-600"
              >
                Rate this herb →
              </button>
            )}
          </div>

          {/* Source Summary Card */}
          {/* {herbData.source && herbData.source.trim() !== '' && (
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Source Info</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-3 mb-3">{herbData.source.substring(0, 100)}...</p>
              <button 
                onClick={() => {
                  setActiveTab('source');
                  if (window.innerWidth < 1024) toggleSection('source');
                }} 
                className="text-xs sm:text-sm font-medium text-blue-600"
              >
                View full source →
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default HerbDetail