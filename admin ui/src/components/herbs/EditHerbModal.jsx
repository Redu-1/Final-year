// // src/components/herbs/EditHerbModal.jsx
// import { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import Button from '../common/Button';
// import Input from '../common/Input';
// import { 
//   Leaf,
//   X,
//   AlertCircle,
//   Save,
//   Pencil,
//   FlaskConical,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   Shield,
//   Image as ImageIcon,
//   Activity,
//   Bug,
//   Flame,
//   Zap,
//   Pill,
//   Flower2,
//   Upload,
//   Trash2,
//   BookOpen,
//   Plus,
//   Layers,
//   Globe,
//   Languages
// } from 'lucide-react';
// import { herbApi, getApiBaseUrl } from '../../services/herbApi';
// import { useAuth } from '../../contexts/AuthContext';
// import axios from 'axios';

// // Helper function to normalize status to lowercase
// const normalizeStatus = (status) => {
//   if (!status) return 'pending';
//   return status.toLowerCase();
// };

// // Get condition icon
// const getConditionIcon = (conditionName) => {
//   const name = conditionName?.toLowerCase() || '';
//   if (name.includes('acne')) return Bug;
//   if (name.includes('inflammation') || name.includes('inflammatory')) return Flame;
//   if (name.includes('rash')) return Activity;
//   if (name.includes('skin')) return Shield;
//   if (name.includes('chebt')) return Zap;
//   if (name.includes('hb')) return Pill;
//   return Flower2;
// };

// // Language options
// const languages = [
//   { code: "amharic", label: "አማርኛ (Amharic)", value: "AM" },
//   { code: "oromo", label: "Oromiffa (Oromo)", value: "OM" }
// ];

// const EditHerbModal = ({ isOpen, onClose, onSave, herb, onHerbUpdated }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     scientificName: '',
//     description: '',
//     preparation: '',
//     safetyWarning: '',
//     source: '',
//     status: 'pending',
//     conditionIds: []
//   });

//   // Herb translation states
//   const [herbTranslations, setHerbTranslations] = useState({
//     amharic: {
//       translated_name: "",
//       translated_uses: "",
//       translated_preparation: "",
//       translated_safety: "",
//       source: ""
//     },
//     oromo: {
//       translated_name: "",
//       translated_uses: "",
//       translated_preparation: "",
//       translated_safety: "",
//       source: ""
//     }
//   });
//   const [activeLanguage, setActiveLanguage] = useState("amharic");

//   // Condition translation states
//   const [conditionTranslations, setConditionTranslations] = useState({});
//   const [activeConditionTranslationLang, setActiveConditionTranslationLang] = useState("amharic");

//   const [conditions, setConditions] = useState([]);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [isLoadingImage, setIsLoadingImage] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState('');
//   const [isLoadingConditions, setIsLoadingConditions] = useState(false);
//   const [selectedConditionId, setSelectedConditionId] = useState('');
  
//   // Image upload states
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const [selectedImageFile, setSelectedImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
  
//   const { userType } = useAuth();
//   const isAdmin = userType === 'admin';
//   const API_BASE_URL = getApiBaseUrl();

//   // Fetch conditions
//   const fetchConditions = async () => {
//     setIsLoadingConditions(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/conditions`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       let conditionsList = [];
//       if (response.data && response.data.success && Array.isArray(response.data.data)) {
//         conditionsList = response.data.data;
//       } else if (Array.isArray(response.data)) {
//         conditionsList = response.data;
//       }
//       setConditions(conditionsList);
//     } catch (error) {
//       console.error('Failed to fetch conditions:', error);
//     } finally {
//       setIsLoadingConditions(false);
//     }
//   };

//   // Fetch herb translation by language from API
//   const fetchHerbTranslation = async (herbId, languageCode, languageKey) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/translations/${herbId}/${languageCode}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });
      
//       if (response.data && response.data.success && response.data.data) {
//         const trans = response.data.data;
//         setHerbTranslations(prev => ({
//           ...prev,
//           [languageKey]: {
//             translated_name: trans.translated_name || "",
//             translated_uses: trans.translated_uses || "",
//             translated_preparation: trans.translated_preparation || "",
//             translated_safety: trans.translated_safety || "",
//             source: trans.source || ""
//           }
//         }));
//         console.log(`✅ Loaded ${languageKey} translation for herb ${herbId}`);
//       }
//     } catch (error) {
//       console.log(`No ${languageKey} translation found for herb ${herbId}`);
//     }
//   };

//   // Fetch all herb translations
//   const fetchAllHerbTranslations = async (herbId) => {
//     await Promise.all([
//       fetchHerbTranslation(herbId, "AM", "amharic"),
//       fetchHerbTranslation(herbId, "OM", "oromo")
//     ]);
//   };

//   // Fetch condition translations
//   const fetchConditionTranslations = async (conditionId, languageCode, languageKey) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/condition-translations/${conditionId}/${languageCode}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });
      
//       if (response.data && response.data.success && response.data.data) {
//         const trans = response.data.data;
//         setConditionTranslations(prev => ({
//           ...prev,
//           [conditionId]: {
//             ...prev[conditionId],
//             [languageKey]: {
//               translated_name: trans.translated_name || "",
//               translated_description: trans.translated_description || ""
//             }
//           }
//         }));
//         console.log(`✅ Loaded ${languageKey} translation for condition ${conditionId}`);
//       }
//     } catch (error) {
//       console.log(`No ${languageKey} translation found for condition ${conditionId}`);
//     }
//   };

//   // Fetch all condition translations for given condition IDs
//   const fetchAllConditionTranslations = async (conditionIds) => {
//     for (const conditionId of conditionIds) {
//       await Promise.all([
//         fetchConditionTranslations(conditionId, "AM", "amharic"),
//         fetchConditionTranslations(conditionId, "OM", "oromo")
//       ]);
//     }
//   };

//   // Fetch image from uploads API
//   useEffect(() => {
//     const fetchImage = async () => {
//       if (!isOpen || !herb?.id) return;
      
//       if (herb.imageUrl) {
//         setImageUrl(herb.imageUrl);
//         return;
//       }
      
//       setIsLoadingImage(true);
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch(`${API_BASE_URL}/uploads/${herb.id}`, {
//           headers: {
//             'Authorization': token ? `Bearer ${token}` : {}
//           }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           if (data.success && data.data && data.data.length > 0) {
//             setImageUrl(data.data[0].image_url);
//           }
//         }
//       } catch (error) {
//         console.error('Failed to load image:', error);
//       } finally {
//         setIsLoadingImage(false);
//       }
//     };
    
//     fetchImage();
//     fetchConditions();
//   }, [isOpen, herb?.id, herb?.imageUrl, API_BASE_URL]);

//   // Load herb data and translations when modal opens
//   useEffect(() => {
//     if (isOpen && herb) {
//       let conditionIdsArray = [];
      
//       if (herb.conditionIds && Array.isArray(herb.conditionIds)) {
//         conditionIdsArray = herb.conditionIds;
//       } else if (herb.conditionId) {
//         conditionIdsArray = [herb.conditionId];
//       } else if (herb.condition_id) {
//         conditionIdsArray = [herb.condition_id];
//       }
      
//       console.log('📋 Editing herb - Condition IDs:', conditionIdsArray);
//       console.log('📋 Herb ID:', herb.id);
      
//       setFormData({
//         name: herb.name || '',
//         scientificName: herb.scientificName || '',
//         description: herb.description || '',
//         preparation: herb.preparation || '',
//         safetyWarning: herb.safetyWarning || '',
//         source: herb.source || '',
//         status: normalizeStatus(herb.status) || 'pending',
//         conditionIds: conditionIdsArray
//       });
      
//       // Fetch translations from API
//       if (herb.id) {
//         fetchAllHerbTranslations(herb.id);
//         if (conditionIdsArray.length > 0) {
//           fetchAllConditionTranslations(conditionIdsArray);
//         }
//       }
      
//       setErrors({});
//       setApiError('');
//       setSelectedConditionId('');
//       setSelectedImageFile(null);
//       setImagePreview(null);
//       setImageError(false);
//     }
//   }, [isOpen, herb]);

//   // Clean up preview URL on unmount
//   useEffect(() => {
//     return () => {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//     };
//   }, [imagePreview]);

//   const handleChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//     if (apiError) setApiError('');
//   };

//   // Handle herb translation changes
//   const handleHerbTranslationChange = (language, field, value) => {
//     setHerbTranslations(prev => ({
//       ...prev,
//       [language]: {
//         ...prev[language],
//         [field]: value
//       }
//     }));
//   };

//   // Handle condition translation changes
//   const handleConditionTranslationChange = (conditionId, language, field, value) => {
//     setConditionTranslations(prev => ({
//       ...prev,
//       [conditionId]: {
//         ...prev[conditionId],
//         [language]: {
//           ...prev[conditionId]?.[language],
//           [field]: value
//         }
//       }
//     }));
//   };

//   // Add condition to the array
//   const handleAddCondition = () => {
//     if (!selectedConditionId) {
//       setErrors(prev => ({ ...prev, conditionIds: "Please select a condition to add" }));
//       return;
//     }
    
//     const conditionIdNum = Number(selectedConditionId);
//     if (formData.conditionIds.includes(conditionIdNum)) {
//       setErrors(prev => ({ ...prev, conditionIds: "This condition is already added" }));
//       return;
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       conditionIds: [...prev.conditionIds, conditionIdNum]
//     }));
//     setSelectedConditionId("");
//     setErrors(prev => ({ ...prev, conditionIds: null }));
//   };

//   // Remove condition from the array
//   const handleRemoveCondition = (conditionIdToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       conditionIds: prev.conditionIds.filter(id => id !== conditionIdToRemove)
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
//         return;
//       }
      
//       if (file.size > 5 * 1024 * 1024) {
//         setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
//         return;
//       }
      
//       setSelectedImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//       setImageError(false);
      
//       if (errors.image) {
//         setErrors(prev => ({ ...prev, image: null }));
//       }
//     }
//   };

//   const uploadNewImage = async (herbId) => {
//     if (!selectedImageFile) return null;
    
//     setIsUploadingImage(true);
//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('herbId', herbId);
//       formData.append('image', selectedImageFile);
      
//       const response = await axios.post(`${API_BASE_URL}/uploads`, formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       if (response.data?.success && response.data?.data?.image_url) {
//         return response.data.data.image_url;
//       }
//       return null;
//     } catch (error) {
//       console.error('Image upload failed:', error);
//       throw error;
//     } finally {
//       setIsUploadingImage(false);
//     }
//   };

//   // Save herb translations
//   const saveHerbTranslations = async (herbId) => {
//     const token = localStorage.getItem('token');
//     const translationPromises = [];

//     // Save Amharic translation
//     if (herbTranslations.amharic.translated_name || herbTranslations.amharic.translated_uses || 
//         herbTranslations.amharic.translated_preparation || herbTranslations.amharic.translated_safety) {
//       translationPromises.push(
//         axios.post(`${API_BASE_URL}/translations`, {
//           herbId: herbId,
//           language: "AM",
//           translated_name: herbTranslations.amharic.translated_name,
//           translated_uses: herbTranslations.amharic.translated_uses,
//           translated_preparation: herbTranslations.amharic.translated_preparation,
//           translated_safety: herbTranslations.amharic.translated_safety,
//           source: herbTranslations.amharic.source || formData.source
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       );
//     }

//     // Save Oromo translation
//     if (herbTranslations.oromo.translated_name || herbTranslations.oromo.translated_uses || 
//         herbTranslations.oromo.translated_preparation || herbTranslations.oromo.translated_safety) {
//       translationPromises.push(
//         axios.post(`${API_BASE_URL}/translations`, {
//           herbId: herbId,
//           language: "OM",
//           translated_name: herbTranslations.oromo.translated_name,
//           translated_uses: herbTranslations.oromo.translated_uses,
//           translated_preparation: herbTranslations.oromo.translated_preparation,
//           translated_safety: herbTranslations.oromo.translated_safety,
//           source: herbTranslations.oromo.source || formData.source
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       );
//     }

//     if (translationPromises.length > 0) {
//       await Promise.all(translationPromises);
//       console.log(`✅ Saved ${translationPromises.length} herb translations`);
//     }
//   };

//   // Save condition translations
//   const saveConditionTranslations = async () => {
//     const token = localStorage.getItem('token');
//     const translationPromises = [];

//     for (const [conditionId, translations] of Object.entries(conditionTranslations)) {
//       // Save Amharic translation
//       if (translations.amharic?.translated_name || translations.amharic?.translated_description) {
//         translationPromises.push(
//           axios.post(`${API_BASE_URL}/condition-translations`, {
//             conditionId: parseInt(conditionId),
//             language: "AM",
//             translated_name: translations.amharic.translated_name || "",
//             translated_description: translations.amharic.translated_description || ""
//           }, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         );
//       }

//       // Save Oromo translation
//       if (translations.oromo?.translated_name || translations.oromo?.translated_description) {
//         translationPromises.push(
//           axios.post(`${API_BASE_URL}/condition-translations`, {
//             conditionId: parseInt(conditionId),
//             language: "OM",
//             translated_name: translations.oromo.translated_name || "",
//             translated_description: translations.oromo.translated_description || ""
//           }, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         );
//       }
//     }

//     if (translationPromises.length > 0) {
//       await Promise.all(translationPromises);
//       console.log(`✅ Saved ${translationPromises.length} condition translations`);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Herb name is required';
//     }
//     if (!formData.scientificName.trim()) {
//       newErrors.scientificName = 'Scientific name is required';
//     }
//     if (!formData.description.trim()) {
//       newErrors.description = 'Description is required';
//     }
//     if (!formData.safetyWarning.trim()) {
//       newErrors.safetyWarning = 'Safety warning is required';
//     }
//     if (formData.conditionIds.length === 0) {
//       newErrors.conditionIds = 'Please select at least one condition';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     setApiError('');
    
//     const wasPending = formData.status === 'pending';
//     const isNowPublished = formData.status === 'published';
//     const statusChangedToPublished = isAdmin && wasPending && isNowPublished;
    
//     try {
//       const conditionIdsArray = formData.conditionIds.map(id => Number(id));
      
//       console.log('📝 Updating herb with condition IDs:', conditionIdsArray);
      
//       const herbData = {
//         name: formData.name.trim(),
//         scientificName: formData.scientificName.trim(),
//         description: formData.description.trim(),
//         preparation: formData.preparation.trim() || "No preparation information available",
//         safetyWarning: formData.safetyWarning.trim(),
//         source: formData.source.trim() || "",
//         conditionIds: conditionIdsArray,
//         ...(isAdmin && { status: formData.status.toLowerCase() })
//       };
      
//       console.log('📤 Updating herb:', herbData);
      
//       await herbApi.updateHerb(herb.id, herbData);
      
//       let newImageUrl = imageUrl;
      
//       if (selectedImageFile) {
//         console.log('📸 Uploading new image...');
//         newImageUrl = await uploadNewImage(herb.id);
//         console.log('✅ New image uploaded:', newImageUrl);
//       }
      
//       // Save translations (these will create or update)
//       await saveHerbTranslations(herb.id);
//       await saveConditionTranslations();
      
//       const herbForFrontend = {
//         id: herb.id,
//         name: formData.name.trim(),
//         scientificName: formData.scientificName.trim(),
//         description: formData.description.trim(),
//         preparation: formData.preparation.trim() || "No preparation information available",
//         safetyWarning: formData.safetyWarning.trim(),
//         source: formData.source.trim() || "",
//         status: isAdmin ? formData.status.toLowerCase() : normalizeStatus(herb.status),
//         conditionIds: conditionIdsArray,
//         imageUrl: newImageUrl,
//         createdAt: herb.createdAt,
//         updatedAt: new Date().toISOString(),
//         createdBy: herb.createdBy,
//         herbTranslations: herbTranslations,
//         conditionTranslations: conditionTranslations
//       };
      
//       onSave(herbForFrontend);
      
//       if (statusChangedToPublished) {
//         console.log('✅ Herb published! Refreshing herbs list...');
//         if (onHerbUpdated) {
//           onHerbUpdated();
//         }
//         setTimeout(() => {
//           alert(`✅ "${herbForFrontend.name}" has been published successfully!\n\nConditions: ${conditionIdsArray.length} condition(s)\n\nThe herb will now appear in the directory.`);
//         }, 100);
//       }
      
//       onClose();
//     } catch (error) {
//       console.error('Error updating herb:', error);
//       setApiError(error.message || 'Failed to update herb. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Get selected conditions for display
//   const selectedConditions = conditions.filter(c => formData.conditionIds.includes(c.id));
  
//   // Display image (either new preview or existing)
//   const displayImage = imagePreview || imageUrl;

//   if (!isOpen || !herb) return null;

//   const modalContent = (
//     <div className="fixed inset-0 z-[9999] overflow-y-auto">
//       <div 
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       />
      
//       <div className="relative flex min-h-full items-center justify-center p-4">
//         <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
//           {/* Header */}
//           <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="rounded-lg bg-white/20 p-2">
//                   <Pencil className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">Edit Herb</h3>
//                   <p className="text-sm text-emerald-50">
//                     Editing: {herb.name}
//                     {!isAdmin && (
//                       <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-200 text-amber-800">
//                         <Shield className="h-3 w-3 mr-1" />
//                         Read Only Status
//                       </span>
//                     )}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="rounded-lg bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
//               {apiError && (
//                 <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
//                   <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//                   <p className="text-sm text-red-700">{apiError}</p>
//                 </div>
//               )}

//               <div className="space-y-6">
//                 {/* Herb Image Section */}
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Herb Image
//                   </label>
                  
//                   <div className="flex justify-center mb-4">
//                     <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-md">
//                       {isLoadingImage || isUploadingImage ? (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300" />
//                         </div>
//                       ) : displayImage && !imageError ? (
//                         <img 
//                           src={displayImage} 
//                           alt={herb.name}
//                           className="w-full h-full object-cover"
//                           onError={() => setImageError(true)}
//                           crossOrigin="anonymous"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex flex-col items-center justify-center">
//                           <ImageIcon className="w-8 h-8 text-gray-400" />
//                           <p className="text-xs text-gray-400 mt-1">No image</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="mt-2">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
//                     />
//                     {errors.image && (
//                       <p className="mt-1 text-xs text-red-600">{errors.image}</p>
//                     )}
//                     {selectedImageFile && (
//                       <p className="mt-2 text-xs text-green-600 flex items-center">
//                         <Upload className="w-3 h-3 mr-1" />
//                         New image selected: {selectedImageFile.name}
//                       </p>
//                     )}
//                   </div>
//                   <p className="text-xs text-gray-400 mt-2">
//                     Upload a new image to replace the current one. Max size: 5MB
//                   </p>
//                 </div>

//                 {/* Status Selection - ONLY VISIBLE FOR ADMIN */}
//                 {isAdmin ? (
//                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       Herb Status <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex space-x-6">
//                       <label className="flex items-center space-x-2 cursor-pointer">
//                         <input
//                           type="radio"
//                           name="status"
//                           value="pending"
//                           checked={formData.status === 'pending'}
//                           onChange={(e) => handleChange('status', e.target.value)}
//                           className="w-4 h-4 text-amber-500 focus:ring-amber-500"
//                         />
//                         <div className="flex items-center space-x-1">
//                           <Clock className="h-4 w-4 text-amber-500" />
//                           <span className="text-sm text-gray-700">Pending Review</span>
//                         </div>
//                       </label>
//                       <label className="flex items-center space-x-2 cursor-pointer">
//                         <input
//                           type="radio"
//                           name="status"
//                           value="published"
//                           checked={formData.status === 'published'}
//                           onChange={(e) => handleChange('status', e.target.value)}
//                           className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
//                         />
//                         <div className="flex items-center space-x-1">
//                           <CheckCircle className="h-4 w-4 text-emerald-500" />
//                           <span className="text-sm text-gray-700">Published</span>
//                         </div>
//                       </label>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">
//                       {formData.status === 'published' 
//                         ? '✅ Published herbs are visible to all users' 
//                         : '⏳ Pending herbs await review before publication'}
//                     </p>
//                     {formData.status === 'published' && (
//                       <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
//                         <p className="text-xs text-blue-700 flex items-center">
//                           <Shield className="h-3 w-3 mr-1" />
//                           After publishing, please refresh the condition filter to see this herb in the directory.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       Herb Status
//                     </label>
//                     <div className="flex items-center space-x-3">
//                       <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
//                         normalizeStatus(herb.status) === 'published' 
//                           ? 'bg-emerald-100 text-emerald-700' 
//                           : 'bg-amber-100 text-amber-700'
//                       }`}>
//                         {normalizeStatus(herb.status) === 'published' ? (
//                           <>
//                             <CheckCircle className="h-4 w-4 mr-1" />
//                             Published
//                           </>
//                         ) : (
//                           <>
//                             <Clock className="h-4 w-4 mr-1" />
//                             Pending Review
//                           </>
//                         )}
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         {normalizeStatus(herb.status) === 'published' 
//                           ? '✅ This herb is visible to all users' 
//                           : '⏳ This herb is awaiting review'}
//                       </span>
//                     </div>
//                     <p className="text-xs text-amber-600 mt-3">
//                       <Shield className="h-3 w-3 inline mr-1" />
//                       Only administrators can change herb status
//                     </p>
//                   </div>
//                 )}

//                 {/* Multiple Conditions Selection */}
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Conditions <span className="text-red-500">*</span>
//                   </label>
//                   <p className="text-xs text-gray-500 mb-2">
//                     Select one or more conditions that this herb treats
//                   </p>
                  
//                   {/* Selected Conditions Tags */}
//                   {selectedConditions.length > 0 && (
//                     <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
//                       <div className="text-xs font-medium text-emerald-700 mb-2 flex items-center">
//                         <Layers className="h-3 w-3 mr-1" />
//                         Selected Conditions ({selectedConditions.length}):
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedConditions.map(condition => {
//                           const Icon = getConditionIcon(condition.name);
//                           return (
//                             <div key={condition.id} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
//                               <Icon className="h-3 w-3" />
//                               <span>{condition.name}</span>
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveCondition(condition.id)}
//                                 className="hover:bg-emerald-200 rounded-full p-0.5 ml-1"
//                               >
//                                 <X className="h-3 w-3" />
//                               </button>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Add Condition Dropdown */}
//                   <div className="flex gap-2">
//                     <select
//                       className={`flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
//                         errors.conditionIds ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       value={selectedConditionId}
//                       onChange={(e) => setSelectedConditionId(e.target.value)}
//                       disabled={isLoadingConditions}
//                     >
//                       <option value="">Select a condition to add...</option>
//                       {conditions
//                         .filter(condition => !formData.conditionIds.includes(condition.id))
//                         .map((condition) => (
//                           <option key={condition.id} value={condition.id}>
//                             {condition.name} (ID: {condition.id})
//                           </option>
//                         ))}
//                     </select>
//                     <Button
//                       type="button"
//                       onClick={handleAddCondition}
//                       variant="outline"
//                       className="px-4"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </Button>
//                   </div>
                  
//                   {errors.conditionIds && (
//                     <p className="text-red-500 text-xs mt-1">{errors.conditionIds}</p>
//                   )}
                  
//                   {conditions.length > 0 && (
//                     <p className="text-gray-400 text-xs mt-1">
//                       {conditions.length} condition(s) available. Selected: {formData.conditionIds.length}
//                     </p>
//                   )}
//                 </div>

//                 {/* Condition Translations Section */}
//                 {selectedConditions.length > 0 && Object.keys(conditionTranslations).length > 0 && (
//                   <div className="border-t pt-4">
//                     <div className="flex items-center gap-2 mb-4">
//                       <BookOpen className="h-5 w-5 text-emerald-600" />
//                       <h3 className="text-lg font-semibold text-gray-900">Condition Translations</h3>
//                       <span className="text-xs text-gray-500">(Edit condition translations for Amharic and Oromo)</span>
//                     </div>

//                     <div className="flex gap-2 mb-4 border-b">
//                       {languages.map(lang => (
//                         <button
//                           key={lang.code}
//                           type="button"
//                           onClick={() => setActiveConditionTranslationLang(lang.code)}
//                           className={`px-4 py-2 text-sm font-medium transition-colors ${
//                             activeConditionTranslationLang === lang.code
//                               ? 'border-b-2 border-emerald-500 text-emerald-600'
//                               : 'text-gray-500 hover:text-gray-700'
//                           }`}
//                         >
//                           <Languages className="h-4 w-4 inline mr-1" />
//                           {lang.label}
//                         </button>
//                       ))}
//                     </div>

//                     <div className="space-y-4">
//                       {selectedConditions.map(condition => {
//                         const currentTranslations = conditionTranslations[condition.id]?.[activeConditionTranslationLang] || {};
//                         return (
//                           <div key={condition.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                             <div className="flex items-center gap-2 mb-3">
//                               <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
//                                 <span className="text-xs font-bold text-emerald-600">{condition.id}</span>
//                               </div>
//                               <h4 className="font-medium text-gray-900">{condition.name}</h4>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                                   Translated Name
//                                 </label>
//                                 <input
//                                   type="text"
//                                   value={currentTranslations.translated_name || ""}
//                                   onChange={(e) => handleConditionTranslationChange(condition.id, activeConditionTranslationLang, 'translated_name', e.target.value)}
//                                   placeholder={`${condition.name} in ${languages.find(l => l.code === activeConditionTranslationLang)?.label}`}
//                                   className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                                   Translated Description
//                                 </label>
//                                 <input
//                                   type="text"
//                                   value={currentTranslations.translated_description || ""}
//                                   onChange={(e) => handleConditionTranslationChange(condition.id, activeConditionTranslationLang, 'translated_description', e.target.value)}
//                                   placeholder={`Description in ${languages.find(l => l.code === activeConditionTranslationLang)?.label}`}
//                                   className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 {/* Herb Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Herb Name <span className="text-red-500">*</span>
//                   </label>
//                   <Input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => handleChange('name', e.target.value)}
//                     placeholder="e.g., Tenadam, Ginger, Turmeric"
//                     className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
//                     icon={Leaf}
//                     required
//                   />
//                   {errors.name && (
//                     <p className="mt-1 text-xs text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* Scientific Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Scientific Name <span className="text-red-500">*</span>
//                   </label>
//                   <Input
//                     type="text"
//                     value={formData.scientificName}
//                     onChange={(e) => handleChange('scientificName', e.target.value)}
//                     placeholder="e.g., Ruta chalepensis, Zingiber officinale"
//                     className={errors.scientificName ? 'border-red-500 focus:ring-red-500' : ''}
//                     required
//                   />
//                   {errors.scientificName && (
//                     <p className="mt-1 text-xs text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors.scientificName}
//                     </p>
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => handleChange('description', e.target.value)}
//                     rows="4"
//                     className={`
//                       w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
//                       shadow-sm resize-none
//                       ${errors.description ? 'border-red-500' : 'border-gray-300'}
//                     `}
//                     placeholder="Detailed description of the herb, its characteristics, and traditional uses..."
//                     required
//                   />
//                   {errors.description && (
//                     <p className="mt-1 text-xs text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors.description}
//                     </p>
//                   )}
//                 </div>

//                 {/* Preparation */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Preparation
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <FlaskConical className="h-4 w-4 text-gray-400" />
//                     </div>
//                     <textarea
//                       value={formData.preparation}
//                       onChange={(e) => handleChange('preparation', e.target.value)}
//                       rows="3"
//                       className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
//                       placeholder="How to prepare and use the herb (tea, tincture, poultice, etc.)..."
//                     />
//                   </div>
//                 </div>

//                 {/* Source Field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Source
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <BookOpen className="h-4 w-4 text-gray-400" />
//                     </div>
//                     <textarea
//                       value={formData.source}
//                       onChange={(e) => handleChange('source', e.target.value)}
//                       rows="2"
//                       className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
//                       placeholder="e.g., WHO monographs on selected medicinal plants, scientific references, traditional knowledge sources..."
//                     />
//                   </div>
//                   <p className="mt-1 text-xs text-gray-500">
//                     Optional: Provide the source or reference for this herb information
//                   </p>
//                 </div>

//                 {/* Safety Warning */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Safety Warning <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <AlertTriangle className="h-4 w-4 text-amber-500" />
//                     </div>
//                     <textarea
//                       value={formData.safetyWarning}
//                       onChange={(e) => handleChange('safetyWarning', e.target.value)}
//                       rows="3"
//                       className={`
//                         w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
//                         shadow-sm resize-none
//                         ${errors.safetyWarning ? 'border-red-500' : 'border-gray-300'}
//                       `}
//                       placeholder="Important safety information, contraindications, precautions, and potential side effects..."
//                       required
//                     />
//                   </div>
//                   {errors.safetyWarning && (
//                     <p className="mt-1 text-xs text-red-600 flex items-center">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {errors.safetyWarning}
//                     </p>
//                   )}
//                   <p className="mt-1 text-xs text-gray-500">
//                     Include information about pregnancy, drug interactions, dosage limits, etc.
//                   </p>
//                 </div>

//                 {/* Herb Translations Section */}
//                 <div className="border-t pt-4">
//                   <div className="flex items-center gap-2 mb-4">
//                     <Globe className="h-5 w-5 text-emerald-600" />
//                     <h3 className="text-lg font-semibold text-gray-900">Herb Translations</h3>
//                     <span className="text-xs text-gray-500">(Edit translations for Amharic and Oromo)</span>
//                   </div>

//                   <div className="flex gap-2 mb-4 border-b">
//                     {languages.map(lang => (
//                       <button
//                         key={lang.code}
//                         type="button"
//                         onClick={() => setActiveLanguage(lang.code)}
//                         className={`px-4 py-2 text-sm font-medium transition-colors ${
//                           activeLanguage === lang.code
//                             ? 'border-b-2 border-emerald-500 text-emerald-600'
//                             : 'text-gray-500 hover:text-gray-700'
//                         }`}
//                       >
//                         <Languages className="h-4 w-4 inline mr-1" />
//                         {lang.label}
//                       </button>
//                     ))}
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Translated Name</label>
//                       <input
//                         type="text"
//                         value={herbTranslations[activeLanguage].translated_name}
//                         onChange={(e) => handleHerbTranslationChange(activeLanguage, 'translated_name', e.target.value)}
//                         placeholder={`Enter herb name in ${languages.find(l => l.code === activeLanguage)?.label}`}
//                         className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Translated Uses/Description</label>
//                       <textarea
//                         value={herbTranslations[activeLanguage].translated_uses}
//                         onChange={(e) => handleHerbTranslationChange(activeLanguage, 'translated_uses', e.target.value)}
//                         placeholder={`Enter uses/description in ${languages.find(l => l.code === activeLanguage)?.label}`}
//                         rows="3"
//                         className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Translated Preparation</label>
//                       <textarea
//                         value={herbTranslations[activeLanguage].translated_preparation}
//                         onChange={(e) => handleHerbTranslationChange(activeLanguage, 'translated_preparation', e.target.value)}
//                         placeholder={`Enter preparation instructions in ${languages.find(l => l.code === activeLanguage)?.label}`}
//                         rows="2"
//                         className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Translated Safety Warning</label>
//                       <textarea
//                         value={herbTranslations[activeLanguage].translated_safety}
//                         onChange={(e) => handleHerbTranslationChange(activeLanguage, 'translated_safety', e.target.value)}
//                         placeholder={`Enter safety warning in ${languages.find(l => l.code === activeLanguage)?.label}`}
//                         rows="2"
//                         className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Translation Source (Optional)</label>
//                       <input
//                         type="text"
//                         value={herbTranslations[activeLanguage].source}
//                         onChange={(e) => handleHerbTranslationChange(activeLanguage, 'source', e.target.value)}
//                         placeholder="Source for this translation"
//                         className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//               <div className="text-xs text-gray-500">
//                 <span className="text-red-500">*</span> Required fields
//               </div>
//               <div className="flex space-x-3">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onClose}
//                   disabled={isSubmitting}
//                   className="px-6"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="primary"
//                   disabled={isSubmitting || isUploadingImage}
//                   className="px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
//                 >
//                   {isSubmitting || isUploadingImage ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       {isUploadingImage ? "Uploading Image..." : "Updating..."}
//                     </>
//                   ) : (
//                     <>
//                       <Save className="h-4 w-4 mr-2" />
//                       Update Herb
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );

//   return ReactDOM.createPortal(modalContent, document.body);
// };

// export default EditHerbModal;

// src/components/herbs/EditHerbModal.jsx
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  Leaf,
  X,
  AlertCircle,
  Save,
  Pencil,
  FlaskConical,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Image as ImageIcon,
  Activity,
  Bug,
  Flame,
  Zap,
  Pill,
  Flower2,
  Upload,
  Trash2,
  BookOpen,
  Plus,
  Layers,
  Globe,
  Languages
} from 'lucide-react';
import { herbApi, getApiBaseUrl } from '../../services/herbApi';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

// Helper function to normalize status to lowercase
const normalizeStatus = (status) => {
  if (!status) return 'pending';
  return status.toLowerCase();
};

// Get condition icon
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

// Language options
const languages = [
  { code: "amharic", label: "አማርኛ (Amharic)", value: "AM" },
  { code: "oromo", label: "Oromiffa (Oromo)", value: "OM" }
];

const EditHerbModal = ({ isOpen, onClose, onSave, herb, onHerbUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    preparation: '',
    safetyWarning: '',
    source: '',
    status: 'pending',
    conditionIds: []
  });

  // Herb translation states
  const [herbTranslations, setHerbTranslations] = useState({
    amharic: {
      translated_name: "",
      translated_uses: "",
      translated_preparation: "",
      translated_safety: "",
      source: ""
    },
    oromo: {
      translated_name: "",
      translated_uses: "",
      translated_preparation: "",
      translated_safety: "",
      source: ""
    }
  });
  const [activeLanguage, setActiveLanguage] = useState("amharic");

  // Condition translation states
  const [conditionTranslations, setConditionTranslations] = useState({});
  const [activeConditionTranslationLang, setActiveConditionTranslationLang] = useState("amharic");

  const [conditions, setConditions] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoadingConditions, setIsLoadingConditions] = useState(false);
  const [selectedConditionId, setSelectedConditionId] = useState('');
  
  // Image upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const { userType } = useAuth();
  const isAdmin = userType === 'admin';
  const API_BASE_URL = getApiBaseUrl();

  // Fetch conditions
  const fetchConditions = async () => {
    setIsLoadingConditions(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/conditions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      let conditionsList = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        conditionsList = response.data.data;
      } else if (Array.isArray(response.data)) {
        conditionsList = response.data;
      }
      setConditions(conditionsList);
    } catch (error) {
      console.error('Failed to fetch conditions:', error);
    } finally {
      setIsLoadingConditions(false);
    }
  };

  // Fetch herb translation by language from API
  const fetchHerbTranslation = async (herbId, languageCode, languageKey) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/translations/${herbId}/${languageCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data && response.data.success && response.data.data) {
        const trans = response.data.data;
        setHerbTranslations(prev => ({
          ...prev,
          [languageKey]: {
            translated_name: trans.translated_name || "",
            translated_uses: trans.translated_uses || "",
            translated_preparation: trans.translated_preparation || "",
            translated_safety: trans.translated_safety || "",
            source: trans.source || ""
          }
        }));
        console.log(`✅ Loaded ${languageKey} translation for herb ${herbId}`);
      }
    } catch (error) {
      console.log(`No ${languageKey} translation found for herb ${herbId}`);
    }
  };

  // Fetch all herb translations
  const fetchAllHerbTranslations = async (herbId) => {
    await Promise.all([
      fetchHerbTranslation(herbId, "AM", "amharic"),
      fetchHerbTranslation(herbId, "OM", "oromo")
    ]);
  };

  // Fetch condition translations
  const fetchConditionTranslations = async (conditionId, languageCode, languageKey) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/condition-translations/${conditionId}/${languageCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data && response.data.success && response.data.data) {
        const trans = response.data.data;
        setConditionTranslations(prev => ({
          ...prev,
          [conditionId]: {
            ...prev[conditionId],
            [languageKey]: {
              translated_name: trans.translated_name || "",
              translated_description: trans.translated_description || ""
            }
          }
        }));
        console.log(`✅ Loaded ${languageKey} translation for condition ${conditionId}`);
      }
    } catch (error) {
      console.log(`No ${languageKey} translation found for condition ${conditionId}`);
    }
  };

  // Fetch all condition translations for given condition IDs
  const fetchAllConditionTranslations = async (conditionIds) => {
    for (const conditionId of conditionIds) {
      await Promise.all([
        fetchConditionTranslations(conditionId, "AM", "amharic"),
        fetchConditionTranslations(conditionId, "OM", "oromo")
      ]);
    }
  };

  // Fetch image from uploads API
  useEffect(() => {
    const fetchImage = async () => {
      if (!isOpen || !herb?.id) return;
      
      if (herb.imageUrl) {
        setImageUrl(herb.imageUrl);
        return;
      }
      
      setIsLoadingImage(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/uploads/${herb.id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : {}
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setImageUrl(data.data[0].image_url);
          }
        }
      } catch (error) {
        console.error('Failed to load image:', error);
      } finally {
        setIsLoadingImage(false);
      }
    };
    
    fetchImage();
    fetchConditions();
  }, [isOpen, herb?.id, herb?.imageUrl, API_BASE_URL]);

  // Load herb data and translations when modal opens
  useEffect(() => {
    if (isOpen && herb) {
      let conditionIdsArray = [];
      
      if (herb.conditionIds && Array.isArray(herb.conditionIds)) {
        conditionIdsArray = herb.conditionIds;
      } else if (herb.conditionId) {
        conditionIdsArray = [herb.conditionId];
      } else if (herb.condition_id) {
        conditionIdsArray = [herb.condition_id];
      }
      
      console.log('📋 Editing herb - Condition IDs:', conditionIdsArray);
      console.log('📋 Herb ID:', herb.id);
      
      setFormData({
        name: herb.name || '',
        scientificName: herb.scientificName || '',
        description: herb.description || '',
        preparation: herb.preparation || '',
        safetyWarning: herb.safetyWarning || '',
        source: herb.source || '',
        status: normalizeStatus(herb.status) || 'pending',
        conditionIds: conditionIdsArray
      });
      
      // Fetch translations from API
      if (herb.id) {
        fetchAllHerbTranslations(herb.id);
        if (conditionIdsArray.length > 0) {
          fetchAllConditionTranslations(conditionIdsArray);
        }
      }
      
      setErrors({});
      setApiError('');
      setSelectedConditionId('');
      setSelectedImageFile(null);
      setImagePreview(null);
      setImageError(false);
    }
  }, [isOpen, herb]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    if (apiError) setApiError('');
  };

  // Handle herb translation changes
  const handleHerbTranslationChange = (language, field, value) => {
    setHerbTranslations(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value
      }
    }));
  };

  // Handle condition translation changes
  const handleConditionTranslationChange = (conditionId, language, field, value) => {
    setConditionTranslations(prev => ({
      ...prev,
      [conditionId]: {
        ...prev[conditionId],
        [language]: {
          ...prev[conditionId]?.[language],
          [field]: value
        }
      }
    }));
  };

  // Add condition to the array - FIXED: Keep IDs as-is without converting to numbers
  const handleAddCondition = () => {
    if (!selectedConditionId) {
      setErrors(prev => ({ ...prev, conditionIds: "Please select a condition to add" }));
      return;
    }
    
    // Keep ID as-is (could be string or number)
    if (formData.conditionIds.includes(selectedConditionId)) {
      setErrors(prev => ({ ...prev, conditionIds: "This condition is already added" }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      conditionIds: [...prev.conditionIds, selectedConditionId]
    }));
    setSelectedConditionId("");
    setErrors(prev => ({ ...prev, conditionIds: null }));
  };

  // Remove condition from the array
  const handleRemoveCondition = (conditionIdToRemove) => {
    setFormData(prev => ({
      ...prev,
      conditionIds: prev.conditionIds.filter(id => id !== conditionIdToRemove)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }
      
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError(false);
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
    }
  };

  const uploadNewImage = async (herbId) => {
    if (!selectedImageFile) return null;
    
    setIsUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('herbId', herbId);
      formData.append('image', selectedImageFile);
      
      const response = await axios.post(`${API_BASE_URL}/uploads`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data?.success && response.data?.data?.image_url) {
        return response.data.data.image_url;
      }
      return null;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save herb translations
  const saveHerbTranslations = async (herbId) => {
    const token = localStorage.getItem('token');
    const translationPromises = [];

    // Save Amharic translation
    if (herbTranslations.amharic.translated_name || herbTranslations.amharic.translated_uses || 
        herbTranslations.amharic.translated_preparation || herbTranslations.amharic.translated_safety) {
      translationPromises.push(
        axios.post(`${API_BASE_URL}/translations`, {
          herbId: herbId,
          language: "AM",
          translated_name: herbTranslations.amharic.translated_name,
          translated_uses: herbTranslations.amharic.translated_uses,
          translated_preparation: herbTranslations.amharic.translated_preparation,
          translated_safety: herbTranslations.amharic.translated_safety,
          source: herbTranslations.amharic.source || formData.source
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          if (error.response?.status === 501) {
            console.warn('⚠️ Translations endpoint not implemented yet (501)');
            return { data: { success: true, message: 'Skipped' } };
          }
          throw error;
        })
      );
    }

    // Save Oromo translation
    if (herbTranslations.oromo.translated_name || herbTranslations.oromo.translated_uses || 
        herbTranslations.oromo.translated_preparation || herbTranslations.oromo.translated_safety) {
      translationPromises.push(
        axios.post(`${API_BASE_URL}/translations`, {
          herbId: herbId,
          language: "OM",
          translated_name: herbTranslations.oromo.translated_name,
          translated_uses: herbTranslations.oromo.translated_uses,
          translated_preparation: herbTranslations.oromo.translated_preparation,
          translated_safety: herbTranslations.oromo.translated_safety,
          source: herbTranslations.oromo.source || formData.source
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          if (error.response?.status === 501) {
            console.warn('⚠️ Translations endpoint not implemented yet (501)');
            return { data: { success: true, message: 'Skipped' } };
          }
          throw error;
        })
      );
    }

    if (translationPromises.length > 0) {
      await Promise.allSettled(translationPromises);
      console.log(`✅ Processed ${translationPromises.length} herb translations`);
    }
  };

  // Save condition translations
  const saveConditionTranslations = async () => {
    const token = localStorage.getItem('token');
    const translationPromises = [];

    for (const [conditionId, translations] of Object.entries(conditionTranslations)) {
      // Save Amharic translation
      if (translations.amharic?.translated_name || translations.amharic?.translated_description) {
        translationPromises.push(
          axios.post(`${API_BASE_URL}/condition-translations`, {
            conditionId: conditionId, // Keep as-is, don't parseInt
            language: "AM",
            translated_name: translations.amharic.translated_name || "",
            translated_description: translations.amharic.translated_description || ""
          }, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(error => {
            if (error.response?.status === 501) {
              console.warn('⚠️ Condition translations endpoint not implemented yet (501)');
              return { data: { success: true, message: 'Skipped' } };
            }
            throw error;
          })
        );
      }

      // Save Oromo translation
      if (translations.oromo?.translated_name || translations.oromo?.translated_description) {
        translationPromises.push(
          axios.post(`${API_BASE_URL}/condition-translations`, {
            conditionId: conditionId, // Keep as-is, don't parseInt
            language: "OM",
            translated_name: translations.oromo.translated_name || "",
            translated_description: translations.oromo.translated_description || ""
          }, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(error => {
            if (error.response?.status === 501) {
              console.warn('⚠️ Condition translations endpoint not implemented yet (501)');
              return { data: { success: true, message: 'Skipped' } };
            }
            throw error;
          })
        );
      }
    }

    if (translationPromises.length > 0) {
      await Promise.allSettled(translationPromises);
      console.log(`✅ Processed ${translationPromises.length} condition translations`);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Herb name is required';
    }
    if (!formData.scientificName.trim()) {
      newErrors.scientificName = 'Scientific name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.safetyWarning.trim()) {
      newErrors.safetyWarning = 'Safety warning is required';
    }
    if (formData.conditionIds.length === 0) {
      newErrors.conditionIds = 'Please select at least one condition';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    
    const wasPending = formData.status === 'pending';
    const isNowPublished = formData.status === 'published';
    const statusChangedToPublished = isAdmin && wasPending && isNowPublished;
    
    try {
      // FIXED: Don't convert IDs to numbers - keep them as they are
      const conditionIdsArray = [...formData.conditionIds];
      
      console.log('📝 Updating herb with condition IDs:', conditionIdsArray);
      
      const herbData = {
        name: formData.name.trim(),
        scientificName: formData.scientificName.trim(),
        description: formData.description.trim(),
        preparation: formData.preparation.trim() || "No preparation information available",
        safetyWarning: formData.safetyWarning.trim(),
        source: formData.source.trim() || "",
        conditionIds: conditionIdsArray, // Send as-is
        ...(isAdmin && { status: formData.status.toLowerCase() })
      };
      
      console.log('📤 Updating herb:', herbData);
      
      await herbApi.updateHerb(herb.id, herbData);
      
      let newImageUrl = imageUrl;
      
      if (selectedImageFile) {
        console.log('📸 Uploading new image...');
        try {
          newImageUrl = await uploadNewImage(herb.id);
          console.log('✅ New image uploaded:', newImageUrl);
        } catch (imageError) {
          console.warn('⚠️ Image upload failed:', imageError.message);
        }
      }
      
      // Save translations (these will create or update)
      await saveHerbTranslations(herb.id);
      await saveConditionTranslations();
      
      const herbForFrontend = {
        id: herb.id,
        name: formData.name.trim(),
        scientificName: formData.scientificName.trim(),
        description: formData.description.trim(),
        preparation: formData.preparation.trim() || "No preparation information available",
        safetyWarning: formData.safetyWarning.trim(),
        source: formData.source.trim() || "",
        status: isAdmin ? formData.status.toLowerCase() : normalizeStatus(herb.status),
        conditionIds: conditionIdsArray,
        imageUrl: newImageUrl,
        createdAt: herb.createdAt,
        updatedAt: new Date().toISOString(),
        createdBy: herb.createdBy,
        herbTranslations: herbTranslations,
        conditionTranslations: conditionTranslations
      };
      
      onSave(herbForFrontend);
      
      if (statusChangedToPublished) {
        console.log('✅ Herb published! Refreshing herbs list...');
        if (onHerbUpdated) {
          onHerbUpdated();
        }
        setTimeout(() => {
          alert(`✅ "${herbForFrontend.name}" has been published successfully!\n\nConditions: ${conditionIdsArray.length} condition(s)\n\nThe herb will now appear in the directory.`);
        }, 100);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating herb:', error);
      setApiError(error.message || 'Failed to update herb. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected conditions for display
  const selectedConditions = conditions.filter(c => formData.conditionIds.includes(c.id));
  
  // Display image (either new preview or existing)
  const displayImage = imagePreview || imageUrl;

  if (!isOpen || !herb) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Pencil className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Edit Herb</h3>
                  <p className="text-sm text-emerald-50">
                    Editing: {herb.name}
                    {!isAdmin && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-200 text-amber-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Read Only Status
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              {apiError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Herb Image Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Herb Image
                  </label>
                  
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                      {isLoadingImage || isUploadingImage ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300" />
                        </div>
                      ) : displayImage && !imageError ? (
                        <img 
                          src={displayImage} 
                          alt={herb.name}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                          <p className="text-xs text-gray-400 mt-1">No image</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {errors.image && (
                      <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                    )}
                    {selectedImageFile && (
                      <p className="mt-2 text-xs text-green-600 flex items-center">
                        <Upload className="w-3 h-3 mr-1" />
                        New image selected: {selectedImageFile.name}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Upload a new image to replace the current one. Max size: 5MB
                  </p>
                </div>

                {/* Status Selection - ONLY VISIBLE FOR ADMIN */}
                {isAdmin ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Herb Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="pending"
                          checked={formData.status === 'pending'}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                        />
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span className="text-sm text-gray-700">Pending Review</span>
                        </div>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="published"
                          checked={formData.status === 'published'}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                        />
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-gray-700">Published</span>
                        </div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.status === 'published' 
                        ? '✅ Published herbs are visible to all users' 
                        : '⏳ Pending herbs await review before publication'}
                    </p>
                    {formData.status === 'published' && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          After publishing, please refresh the condition filter to see this herb in the directory.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Herb Status
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        normalizeStatus(herb.status) === 'published' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {normalizeStatus(herb.status) === 'published' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-1" />
                            Pending Review
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {normalizeStatus(herb.status) === 'published' 
                          ? '✅ This herb is visible to all users' 
                          : '⏳ This herb is awaiting review'}
                      </span>
                    </div>
                    <p className="text-xs text-amber-600 mt-3">
                      <Shield className="h-3 w-3 inline mr-1" />
                      Only administrators can change herb status
                    </p>
                  </div>
                )}

                {/* Multiple Conditions Selection */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Conditions <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select one or more conditions that this herb treats
                  </p>
                  
                  {/* Selected Conditions Tags */}
                  {selectedConditions.length > 0 && (
                    <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="text-xs font-medium text-emerald-700 mb-2 flex items-center">
                        <Layers className="h-3 w-3 mr-1" />
                        Selected Conditions ({selectedConditions.length}):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedConditions.map(condition => {
                          const Icon = getConditionIcon(condition.name);
                          return (
                            <div key={condition.id} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                              <Icon className="h-3 w-3" />
                              <span>{condition.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveCondition(condition.id)}
                                className="hover:bg-emerald-200 rounded-full p-0.5 ml-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Add Condition Dropdown */}
                  <div className="flex gap-2">
                    <select
                      className={`flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                        errors.conditionIds ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={selectedConditionId}
                      onChange={(e) => setSelectedConditionId(e.target.value)}
                      disabled={isLoadingConditions}
                    >
                      <option value="">Select a condition to add...</option>
                      {conditions
                        .filter(condition => !formData.conditionIds.includes(condition.id))
                        .map((condition) => (
                          <option key={condition.id} value={condition.id}>
                            {condition.name} (ID: {condition.id})
                          </option>
                        ))}
                    </select>
                    <Button
                      type="button"
                      onClick={handleAddCondition}
                      variant="outline"
                      className="px-4"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {errors.conditionIds && (
                    <p className="text-red-500 text-xs mt-1">{errors.conditionIds}</p>
                  )}
                  
                  {conditions.length > 0 && (
                    <p className="text-gray-400 text-xs mt-1">
                      {conditions.length} condition(s) available. Selected: {formData.conditionIds.length}
                    </p>
                  )}
                </div>

                {/* Condition Translations Section */}
                {selectedConditions.length > 0 && Object.keys(conditionTranslations).length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Condition Translations</h3>
                      <span className="text-xs text-gray-500">(Edit condition translations for Amharic and Oromo)</span>
                    </div>

                    <div className="flex gap-2 mb-4 border-b">
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setActiveConditionTranslationLang(lang.code)}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            activeConditionTranslationLang === lang.code
                              ? 'border-b-2 border-emerald-500 text-emerald-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Languages className="h-4 w-4 inline mr-1" />
                          {lang.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {selectedConditions.map(condition => {
                        const currentTranslations = conditionTranslations[condition.id]?.[activeConditionTranslationLang] || {};
                        return (
                          <div key={condition.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-emerald-600">{condition.id}</span>
                              </div>
                              <h4 className="font-medium text-gray-900">{condition.name}</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Translated Name
                                </label>
                                <input
                                  type="text"
                                  value={currentTranslations.translated_name || ""}
                                  onChange={(e) => handleConditionTranslationChange(condition.id, activeConditionTranslationLang, 'translated_name', e.target.value)}
                                  placeholder={`${condition.name} in ${languages.find(l => l.code === activeConditionTranslationLang)?.label}`}
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Translated Description
                                </label>
                                <input
                                  type="text"
                                  value={currentTranslations.translated_description || ""}
                                  onChange={(e) => handleConditionTranslationChange(condition.id, activeConditionTranslationLang, 'translated_description', e.target.value)}
                                  placeholder={`Description in ${languages.find(l => l.code === activeConditionTranslationLang)?.label}`}
                                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Herb Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Herb Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Tenadam, Ginger, Turmeric"
                    className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                    icon={Leaf}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Scientific Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scientific Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.scientificName}
                    onChange={(e) => handleChange('scientificName', e.target.value)}
                    placeholder="e.g., Ruta chalepensis, Zingiber officinale"
                    className={errors.scientificName ? 'border-red-500 focus:ring-red-500' : ''}
                    required
                  />
                  {errors.scientificName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.scientificName}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows="4"
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                      shadow-sm resize-none
                      ${errors.description ? 'border-red-500' : 'border-gray-300'}
                    `}
                    placeholder="Detailed description of the herb, its characteristics, and traditional uses..."
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Preparation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preparation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FlaskConical className="h-4 w-4 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.preparation}
                      onChange={(e) => handleChange('preparation', e.target.value)}
                      rows="3"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                      placeholder="How to prepare and use the herb (tea, tincture, poultice, etc.)..."
                    />
                  </div>
                </div>

                {/* Source Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.source}
                      onChange={(e) => handleChange('source', e.target.value)}
                      rows="2"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                      placeholder="e.g., WHO monographs on selected medicinal plants, scientific references, traditional knowledge sources..."
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Optional: Provide the source or reference for this herb information
                  </p>
                </div>

                {/* Safety Warning */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Safety Warning <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <textarea
                      value={formData.safetyWarning}
                      onChange={(e) => handleChange('safetyWarning', e.target.value)}
                      rows="3"
                      className={`
                        w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        shadow-sm resize-none
                        ${errors.safetyWarning ? 'border-red-500' : 'border-gray-300'}
                      `}
                      placeholder="Important safety information, contraindications, precautions, and potential side effects..."
                      required
                    />
                  </div>
                  {errors.safetyWarning && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.safetyWarning}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Include information about pregnancy, drug interactions, dosage limits, etc.
                  </p>
                </div>

                {/* Herb Translations Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Herb Translations</h3>
                    <span className="text-xs text-gray-500">(Edit translations for Amharic and Oromo)</span>
                  </div>

                  <div className="flex gap-2 mb-4 border-b">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setActiveLanguage(lang.code)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeLanguage === lang.code
                            ? 'border-b-2 border-emerald-500 text-emerald-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Languages className="h-4 w-4 inline mr-1" />
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Translated Name</label>
                      <input
                        type="text"
                        value={herbTranslations[activeLanguage].translated_name}
                        onChange={(e) => handleHerbTranslationChange(activeLanguage, 'translated_name', e.target.value)}
                        placeholder={`Enter herb name in ${languages.find(l => l.code === activeLanguage)?.label}`}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Translated Uses/Description</label>
                      <textarea
                        value={herbTranslations[activeLanguage].translated_uses}
                        onChange={(e) => handleHerbTranslationChange(activeLanguage, 'translated_uses', e.target.value)}
                        placeholder={`Enter uses/description in ${languages.find(l => l.code === activeLanguage)?.label}`}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Translated Preparation</label>
                      <textarea
                        value={herbTranslations[activeLanguage].translated_preparation}
                        onChange={(e) => handleHerbTranslationChange(activeLanguage, 'translated_preparation', e.target.value)}
                        placeholder={`Enter preparation instructions in ${languages.find(l => l.code === activeLanguage)?.label}`}
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Translated Safety Warning</label>
                      <textarea
                        value={herbTranslations[activeLanguage].translated_safety}
                        onChange={(e) => handleHerbTranslationChange(activeLanguage, 'translated_safety', e.target.value)}
                        placeholder={`Enter safety warning in ${languages.find(l => l.code === activeLanguage)?.label}`}
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Translation Source (Optional)</label>
                      <input
                        type="text"
                        value={herbTranslations[activeLanguage].source}
                        onChange={(e) => handleHerbTranslationChange(activeLanguage, 'source', e.target.value)}
                        placeholder="Source for this translation"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || isUploadingImage}
                  className="px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {isSubmitting || isUploadingImage ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {isUploadingImage ? "Uploading Image..." : "Updating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Herb
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditHerbModal;