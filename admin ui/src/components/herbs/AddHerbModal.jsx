// // src/components/herbs/AddHerbModal.jsx (ADMIN - WITH CONDITION TRANSLATIONS)
// import { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import Button from "../common/Button";
// import Input from "../common/Input";
// import { Leaf, X, Plus, Trash2, Sparkles, Globe, Languages, BookOpen } from "lucide-react";
// import { herbApi, getApiBaseUrl } from "../../services/herbApi";
// import axios from "axios";

// const AddHerbModal = ({ isOpen, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     scientificName: "",
//     description: "",
//     preparation: "",
//     safetyWarning: "",
//     source: "",
//     conditionIds: [],
//     image: null,
//     imagePreview: null
//   });

//   // Translation states - Only Amharic and Oromo (English is default)
//   const [translations, setTranslations] = useState({
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
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState("");
//   const [isLoadingConditions, setIsLoadingConditions] = useState(false);
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [selectedConditionId, setSelectedConditionId] = useState("");
  
//   // New condition creation states
//   const [showNewConditionForm, setShowNewConditionForm] = useState(false);
//   const [newCondition, setNewCondition] = useState({
//     name: '',
//     description: ''
//   });
//   const [isCreatingCondition, setIsCreatingCondition] = useState(false);

//   const API_BASE_URL = getApiBaseUrl();

//   // Language options - Only Amharic and Oromo
//   const languages = [
//     { code: "amharic", label: "አማርኛ (Amharic)", value: "AM" },
//     { code: "oromo", label: "Oromiffa (Oromo)", value: "OM" }
//   ];

//   // Fetch conditions when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       fetchConditions();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) {
//       handleReset();
//     }
//   }, [isOpen]);

//   const fetchConditions = async () => {
//     setIsLoadingConditions(true);
//     setApiError("");
    
//     try {
//       const token = localStorage.getItem("token");
//       console.log('Fetching conditions from:', `${API_BASE_URL}/conditions`);
      
//       const response = await axios.get(`${API_BASE_URL}/conditions`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       console.log('API Response:', response.data);
      
//       let conditionsList = [];
//       if (response.data && response.data.success && Array.isArray(response.data.data)) {
//         conditionsList = response.data.data;
//       } else if (Array.isArray(response.data)) {
//         conditionsList = response.data;
//       }
      
//       console.log('Conditions loaded:', conditionsList);
//       setConditions(conditionsList);
      
//       // Initialize condition translations for existing conditions
//       const initialConditionTranslations = {};
//       conditionsList.forEach(condition => {
//         initialConditionTranslations[condition.id] = {
//           amharic: { translated_name: "", translated_description: "" },
//           oromo: { translated_name: "", translated_description: "" }
//         };
//       });
//       setConditionTranslations(initialConditionTranslations);
      
//       if (conditionsList.length === 0) {
//         setApiError("No conditions available. Please add a condition first.");
//       }
//     } catch (error) {
//       console.error("Failed to fetch conditions:", error);
//       setApiError("Failed to load conditions. Please refresh and try again.");
//     } finally {
//       setIsLoadingConditions(false);
//     }
//   };

//   // Delete condition from database - DELETES ONLY THE SELECTED CONDITION
//   const handleDeleteCondition = async (conditionId, conditionName) => {
//     // Safety check: ensure we have a valid ID
//     if (!conditionId) {
//       alert("❌ Error: Invalid condition ID");
//       return;
//     }
    
//     // Confirm before deleting
//     const confirmDelete = window.confirm(
//       `⚠️ Are you sure you want to delete the condition "${conditionName}"?\n\n` +
//       `Condition ID: ${conditionId}\n\n` +
//       `This will permanently remove it from the database.\n` +
//       `Any herbs associated with this condition will lose this connection.\n\n` +
//       `This action cannot be undone!`
//     );
    
//     if (!confirmDelete) return;
    
//     try {
//       const token = localStorage.getItem('token');
//       const deleteUrl = `${API_BASE_URL}/conditions/${conditionId}`;
//       console.log(`🗑️ Deleting condition at: ${deleteUrl}`);
      
//       const response = await axios.delete(deleteUrl, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       console.log('Delete response:', response.data);
      
//       if (response.data && response.data.success) {
//         alert(`✅ Condition "${conditionName}" deleted successfully!`);
        
//         // Remove ONLY the deleted condition from local state
//         setConditions(prevConditions => 
//           prevConditions.filter(c => c.id !== conditionId)
//         );
        
//         // Remove this condition from selected condition IDs if it was selected
//         if (formData.conditionIds.includes(conditionId)) {
//           setFormData(prev => ({
//             ...prev,
//             conditionIds: prev.conditionIds.filter(id => id !== conditionId)
//           }));
//         }
        
//         // Remove translations for ONLY this condition
//         setConditionTranslations(prev => {
//           const newTranslations = { ...prev };
//           delete newTranslations[conditionId];
//           return newTranslations;
//         });
        
//         // Reset selected condition ID if it was the deleted one
//         if (selectedConditionId === conditionId) {
//           setSelectedConditionId("");
//         }
//       } else {
//         throw new Error(response.data?.message || 'Delete failed');
//       }
//     } catch (error) {
//       console.error('Failed to delete condition:', error);
//       const errorMsg = error.response?.data?.message || error.message || 'Failed to delete condition';
//       alert(`❌ Error: ${errorMsg}`);
//     }
//   };

//   // Create new condition
//   const handleCreateCondition = async () => {
//     if (!newCondition.name.trim()) {
//       setErrors(prev => ({ ...prev, newCondition: "Condition name is required" }));
//       return;
//     }

//     setIsCreatingCondition(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`${API_BASE_URL}/conditions`, {
//         name: newCondition.name.trim(),
//         description: newCondition.description.trim() || ""
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data && response.data.success && response.data.data) {
//         const createdCondition = response.data.data;
//         console.log('✅ New condition created:', createdCondition);
        
//         await fetchConditions();
//         setSelectedConditionId(createdCondition.id.toString());
//         setShowNewConditionForm(false);
//         setNewCondition({ name: '', description: '' });
//         setErrors(prev => ({ ...prev, newCondition: null }));
//         alert(`✅ Condition "${createdCondition.name}" created successfully!`);
//       }
//     } catch (error) {
//       console.error('Failed to create condition:', error);
//       setErrors(prev => ({ 
//         ...prev, 
//         newCondition: error.response?.data?.message || "Failed to create condition" 
//       }));
//     } finally {
//       setIsCreatingCondition(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: null }));
//     }

//     if (apiError) setApiError("");
//   };

//   // Handle translation changes
//   const handleTranslationChange = (language, field, value) => {
//     setTranslations(prev => ({
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
    
//     // Use string IDs for consistency
//     if (formData.conditionIds.includes(selectedConditionId)) {
//       setErrors(prev => ({ ...prev, conditionIds: "This condition is already added" }));
//       return;
//     }
//     setFormData(prev => ({
//       ...prev,
//       conditionIds: [...prev.conditionIds, selectedConditionId]
//     }));
//     setSelectedConditionId("");
//     setErrors(prev => ({ ...prev, conditionIds: null }));
//   };

//   // Remove condition from the array (only from this herb, not from database)
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
      
//       setFormData(prev => ({
//         ...prev,
//         image: file,
//         imagePreview: URL.createObjectURL(file)
//       }));
      
//       if (errors.image) {
//         setErrors(prev => ({ ...prev, image: null }));
//       }
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.scientificName.trim())
//       newErrors.scientificName = "Scientific name is required";
//     if (!formData.description.trim())
//       newErrors.description = "Description is required";
//     if (!formData.safetyWarning.trim())
//       newErrors.safetyWarning = "Safety warning is required";
//     if (formData.conditionIds.length === 0)
//       newErrors.conditionIds = "Please select at least one condition";
//     if (!formData.image)
//       newErrors.image = "Please select an image for the herb";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const uploadHerbImage = async (herbId, imageFile) => {
//     try {
//       const token = localStorage.getItem('token');
//       const imageFormData = new FormData();
//       imageFormData.append('herbId', herbId);
//       imageFormData.append('image', imageFile);
      
//       const response = await axios.post(`${API_BASE_URL}/uploads`, imageFormData, {
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
//     }
//   };

//   // Save translations to API - Only for Amharic and Oromo
//   const saveTranslations = async (herbId) => {
//     const token = localStorage.getItem('token');
//     const translationPromises = [];

//     // Save Amharic translation
//     if (translations.amharic.translated_name || translations.amharic.translated_uses || 
//         translations.amharic.translated_preparation || translations.amharic.translated_safety) {
//       translationPromises.push(
//         axios.post(`${API_BASE_URL}/translations`, {
//           herbId: herbId,
//           language: "AM",
//           translated_name: translations.amharic.translated_name,
//           translated_uses: translations.amharic.translated_uses,
//           translated_preparation: translations.amharic.translated_preparation,
//           translated_safety: translations.amharic.translated_safety,
//           source: translations.amharic.source || formData.source
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       );
//     }

//     // Save Oromo translation
//     if (translations.oromo.translated_name || translations.oromo.translated_uses || 
//         translations.oromo.translated_preparation || translations.oromo.translated_safety) {
//       translationPromises.push(
//         axios.post(`${API_BASE_URL}/translations`, {
//           herbId: herbId,
//           language: "OM",
//           translated_name: translations.oromo.translated_name,
//           translated_uses: translations.oromo.translated_uses,
//           translated_preparation: translations.oromo.translated_preparation,
//           translated_safety: translations.oromo.translated_safety,
//           source: translations.oromo.source || formData.source
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
//             conditionId: conditionId,
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
//             conditionId: conditionId,
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     setApiError("");
//     setUploadProgress(0);

//     try {
//       // Use string IDs for all condition handling
//       const conditionIdsArray = [...formData.conditionIds];
//       console.log('📋 Selected condition IDs:', conditionIdsArray);
//       const invalidConditions = conditionIdsArray.filter(id => !conditions.find(c => String(c.id) === String(id)));
//       if (invalidConditions.length > 0) {
//         throw new Error(`Invalid condition IDs: ${invalidConditions.join(', ')}`);
//       }
//       const selectedConditions = conditions.filter(c => conditionIdsArray.includes(String(c.id)) || conditionIdsArray.includes(c.id));
//       console.log('📋 Selected conditions details:', selectedConditions.map(c => ({ id: c.id, name: c.name })));
//       // Create herb
//       const herbData = {
//         name: formData.name.trim(),
//         scientificName: formData.scientificName.trim(),
//         description: formData.description.trim(),
//         preparation: formData.preparation.trim() || "No preparation information available",
//         safetyWarning: formData.safetyWarning.trim(),
//         source: formData.source.trim() || "",
//         conditionIds: conditionIdsArray
//       };

//       console.log('📤 Creating herb with herbApi...');
//       const createdHerb = await herbApi.createHerb(herbData);
      
//       console.log('✅ Herb created:', createdHerb);
      
//       let finalHerb = { ...createdHerb };
//       let imageUrl = null;

//       // Upload image AFTER herb is created
//       if (formData.image && createdHerb.id) {
//         setIsUploadingImage(true);
//         setUploadProgress(30);
        
//         try {
//           console.log(`📸 Uploading image for herb ID: ${createdHerb.id}`);
//           setUploadProgress(60);
          
//           imageUrl = await uploadHerbImage(createdHerb.id, formData.image);
//           setUploadProgress(100);
          
//           if (imageUrl) {
//             finalHerb.imageUrl = imageUrl;
//             console.log('✅ Image URL:', imageUrl);
//           }
//         } catch (uploadError) {
//           console.error('❌ Image upload failed:', uploadError);
//           setApiError(`Herb created but image upload failed: ${uploadError.message}`);
//         } finally {
//           setIsUploadingImage(false);
//         }
//       }

//       // Save translations
//       await saveTranslations(createdHerb.id);
      
//       // Save condition translations
//       await saveConditionTranslations();

//       // Add selected conditions info to the herb object
//       const herbWithConditions = {
//         ...finalHerb,
//         conditionIds: conditionIdsArray,
//         selectedConditions: selectedConditions,
//         translations: translations,
//         conditionTranslations: conditionTranslations
//       };

//       if (onSave) {
//         console.log('📞 Calling onSave with herb:', herbWithConditions);
//         onSave(herbWithConditions);
//       }

//       alert(`✅ Herb "${formData.name}" added successfully with ${conditionIdsArray.length} condition(s) and translations!`);
//       handleReset();
//       onClose();
//     } catch (error) {
//       console.error('❌ Error in handleSubmit:', error);
      
//       if (error.message?.includes('already exists')) {
//         setErrors(prev => ({
//           ...prev,
//           name: "A herb with this name already exists. Please use a different name."
//         }));
//       } else {
//         setApiError(error.message || "Failed to add herb. Please try again.");
//       }
//     } finally {
//       setIsSubmitting(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleReset = () => {
//     if (formData.imagePreview) {
//       URL.revokeObjectURL(formData.imagePreview);
//     }
    
//     setFormData({
//       name: "",
//       scientificName: "",
//       description: "",
//       preparation: "",
//       safetyWarning: "",
//       source: "",
//       conditionIds: [],
//       image: null,
//       imagePreview: null
//     });
//     setTranslations({
//       amharic: { translated_name: "", translated_uses: "", translated_preparation: "", translated_safety: "", source: "" },
//       oromo: { translated_name: "", translated_uses: "", translated_preparation: "", translated_safety: "", source: "" }
//     });
//     setConditionTranslations({});
//     setSelectedConditionId("");
//     setShowNewConditionForm(false);
//     setNewCondition({ name: '', description: '' });
//     setErrors({});
//     setApiError("");
//     setUploadProgress(0);
//   };

//   // Get the list of selected condition objects
//   const selectedConditionObjects = conditions.filter(c => formData.conditionIds.includes(String(c.id)) || formData.conditionIds.includes(c.id));

//   if (!isOpen) return null;

//   // ✅ FIX: Check if document.body exists before creating portal
//   const portalTarget = document.body;
//   if (!portalTarget) return null;

//   const modalContent = (
//     <div className="fixed inset-0 z-[9999] overflow-y-auto">
//       <div className="fixed inset-0 bg-black/50" onClick={onClose} />

//       <div className="relative flex min-h-full items-center justify-center p-4">
//         <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
//           <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5 flex justify-between items-center">
//             <div className="flex items-center space-x-3">
//               <Leaf className="h-6 w-6 text-white" />
//               <h3 className="text-xl font-semibold text-white">Add New Herb</h3>
//             </div>
//             <button onClick={onClose} className="hover:opacity-80 transition-opacity">
//               <X className="h-5 w-5 text-white" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
//               {isLoadingConditions && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm">
//                   Loading conditions...
//                 </div>
//               )}
              
//               {apiError && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
//                   <p className="font-medium">Error:</p>
//                   <p>{apiError}</p>
//                 </div>
//               )}

//               {/* Upload Progress Bar */}
//               {isUploadingImage && (
//                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm text-blue-700">Uploading image...</span>
//                     <span className="text-sm text-blue-700">{uploadProgress}%</span>
//                   </div>
//                   <div className="w-full bg-blue-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${uploadProgress}%` }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Image Upload Section */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Herb Image <span className="text-red-500">*</span>
//                 </label>
//                 <div className="mt-1 flex items-center gap-4">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
//                   />
//                 </div>
//                 {errors.image && (
//                   <p className="text-red-500 text-xs mt-1">{errors.image}</p>
//                 )}
                
//                 {formData.imagePreview && (
//                   <div className="mt-3">
//                     <p className="text-xs text-gray-500 mb-2">Preview:</p>
//                     <img
//                       src={formData.imagePreview}
//                       alt="Herb preview"
//                       className="w-32 h-32 object-cover rounded-lg border border-gray-200"
//                     />
//                     <p className="text-xs text-gray-400 mt-1">
//                       Selected: {formData.image?.name}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   value={formData.name}
//                   onChange={(e) => handleChange("name", e.target.value)}
//                   placeholder="e.g., Rosemary, Lavender, Chamomile"
//                   className={errors.name ? 'border-red-500' : ''}
//                 />
//                 {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Scientific Name <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   value={formData.scientificName}
//                   onChange={(e) => handleChange("scientificName", e.target.value)}
//                   placeholder="e.g., Salvia rosmarinus, Lavandula angustifolia"
//                   className={errors.scientificName ? 'border-red-500' : ''}
//                 />
//                 {errors.scientificName && <p className="text-red-500 text-xs mt-1">{errors.scientificName}</p>}
//               </div>

//               {/* Multiple Conditions Selection */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Conditions <span className="text-red-500">*</span>
//                 </label>
//                 <p className="text-xs text-gray-500 mb-2">
//                   Select one or more conditions that this herb treats
//                 </p>
                
//                 {formData.conditionIds.length > 0 && (
//                   <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
//                     <div className="text-xs font-medium text-emerald-700 mb-2">Selected Conditions:</div>
//                     <div className="flex flex-wrap gap-2">
//                       {formData.conditionIds.map(id => {
//                         const condition = conditions.find(c => c.id === id);
//                         return (
//                           <div key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm group">
//                             <span>{condition?.name || `ID: ${id}`}</span>
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveCondition(id)}
//                               className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
//                               title="Remove condition from herb only (not from database)"
//                             >
//                               <X className="h-3 w-3" />
//                             </button>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="flex gap-2 mb-2">
//                   <select
//                     className={`flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
//                       errors.conditionIds ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     value={selectedConditionId}
//                     onChange={(e) => setSelectedConditionId(e.target.value)}
//                     disabled={isLoadingConditions}
//                   >
//                     <option value="">Select a condition to add...</option>
//                     {conditions
//                       .filter(condition => !formData.conditionIds.includes(String(condition.id)) && !formData.conditionIds.includes(condition.id))
//                       .map((condition) => (
//                         <option key={condition.id} value={condition.id}>
//                           {condition.name} (ID: {condition.id})
//                         </option>
//                       ))}
//                   </select>
//                   <Button type="button" onClick={handleAddCondition} variant="outline" className="px-4">
//                     <Plus className="h-4 w-4" />
//                   </Button>
                  
//                   {/* Delete button for selected condition - DELETES ONLY THE SELECTED ONE */}
//                   {selectedConditionId && (
//                     <Button 
//                       type="button" 
//                       onClick={() => {
//                         const condition = conditions.find(c => String(c.id) === String(selectedConditionId));
//                         if (condition) {
//                           handleDeleteCondition(condition.id, condition.name);
//                           setSelectedConditionId('');
//                         }
//                       }}
//                       variant="outline" 
//                       className="px-4 bg-red-50 border-red-300 hover:bg-red-100 text-red-600"
//                       title="Permanently delete this condition from database"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
                
//                 <button
//                   type="button"
//                   onClick={() => setShowNewConditionForm(!showNewConditionForm)}
//                   className="w-full text-sm text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-2 py-2 border-t border-gray-200 mt-2 pt-3"
//                 >
//                   <Sparkles className="h-4 w-4" />
//                   {showNewConditionForm ? 'Cancel' : '+ Create New Condition'}
//                 </button>
                
//                 {showNewConditionForm && (
//                   <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                     <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
//                       <Sparkles className="h-4 w-4" />
//                       Create New Condition
//                     </h4>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">
//                           Condition Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           value={newCondition.name}
//                           onChange={(e) => setNewCondition(prev => ({ ...prev, name: e.target.value }))}
//                           placeholder="e.g., Diabetes, Hypertension, Asthma"
//                           className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">
//                           Description (Optional)
//                         </label>
//                         <textarea
//                           value={newCondition.description}
//                           onChange={(e) => setNewCondition(prev => ({ ...prev, description: e.target.value }))}
//                           placeholder="Brief description of the condition..."
//                           rows="2"
//                           className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
//                         />
//                       </div>
//                       {errors.newCondition && <p className="text-red-500 text-xs">{errors.newCondition}</p>}
//                       <div className="flex gap-2">
//                         <Button type="button" onClick={handleCreateCondition} disabled={isCreatingCondition} className="flex-1 bg-blue-600 hover:bg-blue-700">
//                           {isCreatingCondition ? "Creating..." : "Create Condition"}
//                         </Button>
//                         <Button type="button" onClick={() => { setShowNewConditionForm(false); setNewCondition({ name: '', description: '' }); setErrors(prev => ({ ...prev, newCondition: null })); }} variant="outline" className="flex-1">
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {errors.conditionIds && <p className="text-red-500 text-xs mt-1">{errors.conditionIds}</p>}
//                 {conditions.length > 0 && (
//                   <p className="text-gray-400 text-xs mt-2">
//                     {conditions.length} condition(s) available. Selected: {formData.conditionIds.length}
//                   </p>
//                 )}
//               </div>

//               {/* Condition Translations Section - Only shown when conditions are selected */}
//               {selectedConditionObjects.length > 0 && (
//                 <div className="border-t pt-4">
//                   <div className="flex items-center gap-2 mb-4">
//                     <BookOpen className="h-5 w-5 text-emerald-600" />
//                     <h3 className="text-lg font-semibold text-gray-900">Condition Translations</h3>
//                     <span className="text-xs text-gray-500">(Optional - Translate condition names for Amharic and Oromo)</span>
//                   </div>

//                   {/* Language Tabs for Conditions */}
//                   <div className="flex gap-2 mb-4 border-b">
//                     {languages.map(lang => (
//                       <button
//                         key={lang.code}
//                         type="button"
//                         onClick={() => setActiveConditionTranslationLang(lang.code)}
//                         className={`px-4 py-2 text-sm font-medium transition-colors ${
//                           activeConditionTranslationLang === lang.code
//                             ? 'border-b-2 border-emerald-500 text-emerald-600'
//                             : 'text-gray-500 hover:text-gray-700'
//                         }`}
//                       >
//                         <Languages className="h-4 w-4 inline mr-1" />
//                         {lang.label}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Condition Translation Forms for each selected condition */}
//                   <div className="space-y-4">
//                     {selectedConditionObjects.map(condition => {
//                       const currentTranslations = conditionTranslations[condition.id]?.[activeConditionTranslationLang] || {};
//                       return (
//                         <div key={condition.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                           <div className="flex items-center justify-between mb-3">
//                             <div className="flex items-center gap-2">
//                               <h4 className="font-medium text-gray-900">{condition.name}</h4>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={() => handleDeleteCondition(condition.id, condition.name)}
//                               className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
//                               title="Permanently delete this condition from database"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block text-xs font-medium text-gray-700 mb-1">
//                                 Translated Name
//                               </label>
//                               <input
//                                 type="text"
//                                 value={currentTranslations.translated_name || ""}
//                                 onChange={(e) => handleConditionTranslationChange(condition.id, activeConditionTranslationLang, 'translated_name', e.target.value)}
//                                 placeholder={`${condition.name} in ${languages.find(l => l.code === activeConditionTranslationLang)?.label}`}
//                                 className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-700 mb-1">
//                                 Translated Description
//                               </label>
//                               <input
//                                 type="text"
//                                 value={currentTranslations.translated_description || ""}
//                                 onChange={(e) => handleConditionTranslationChange(condition.id, activeConditionTranslationLang, 'translated_description', e.target.value)}
//                                 placeholder={`Description in ${languages.find(l => l.code === activeConditionTranslationLang)?.label}`}
//                                 className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Main Herb Details */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
//                   rows="4"
//                   value={formData.description}
//                   onChange={(e) => handleChange("description", e.target.value)}
//                   placeholder="Detailed description of the herb..."
//                 />
//                 {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Preparation</label>
//                 <textarea
//                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                   rows="3"
//                   value={formData.preparation}
//                   onChange={(e) => handleChange("preparation", e.target.value)}
//                   placeholder="How to prepare and use the herb..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Source</label>
//                 <textarea
//                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                   rows="2"
//                   value={formData.source}
//                   onChange={(e) => handleChange("source", e.target.value)}
//                   placeholder="e.g., WHO monographs on selected medicinal plants, scientific references, traditional knowledge sources..."
//                 />
//                 <p className="text-gray-400 text-xs mt-1">Optional: Provide the source or reference for this herb information</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Safety Warning <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${errors.safetyWarning ? 'border-red-500' : 'border-gray-300'}`}
//                   rows="3"
//                   value={formData.safetyWarning}
//                   onChange={(e) => handleChange("safetyWarning", e.target.value)}
//                   placeholder="Important safety information..."
//                 />
//                 {errors.safetyWarning && <p className="text-red-500 text-xs mt-1">{errors.safetyWarning}</p>}
//               </div>

//               {/* Herb Translations Section */}
//               <div className="border-t pt-4">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Globe className="h-5 w-5 text-emerald-600" />
//                   <h3 className="text-lg font-semibold text-gray-900">Herb Translations</h3>
//                   <span className="text-xs text-gray-500">(Optional - Add translations for Amharic and Oromo)</span>
//                 </div>

//                 {/* Language Tabs */}
//                 <div className="flex gap-2 mb-4 border-b">
//                   {languages.map(lang => (
//                     <button
//                       key={lang.code}
//                       type="button"
//                       onClick={() => setActiveLanguage(lang.code)}
//                       className={`px-4 py-2 text-sm font-medium transition-colors ${
//                         activeLanguage === lang.code
//                           ? 'border-b-2 border-emerald-500 text-emerald-600'
//                           : 'text-gray-500 hover:text-gray-700'
//                       }`}
//                     >
//                       <Languages className="h-4 w-4 inline mr-1" />
//                       {lang.label}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Translation Form */}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Translated Name</label>
//                     <input
//                       type="text"
//                       value={translations[activeLanguage].translated_name}
//                       onChange={(e) => handleTranslationChange(activeLanguage, 'translated_name', e.target.value)}
//                       placeholder={`Enter herb name in ${languages.find(l => l.code === activeLanguage)?.label}`}
//                       className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Translated Uses/Description</label>
//                     <textarea
//                       value={translations[activeLanguage].translated_uses}
//                       onChange={(e) => handleTranslationChange(activeLanguage, 'translated_uses', e.target.value)}
//                       placeholder={`Enter uses/description in ${languages.find(l => l.code === activeLanguage)?.label}`}
//                       rows="3"
//                       className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Translated Preparation</label>
//                     <textarea
//                       value={translations[activeLanguage].translated_preparation}
//                       onChange={(e) => handleTranslationChange(activeLanguage, 'translated_preparation', e.target.value)}
//                       placeholder={`Enter preparation instructions in ${languages.find(l => l.code === activeLanguage)?.label}`}
//                       rows="2"
//                       className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Translated Safety Warning</label>
//                     <textarea
//                       value={translations[activeLanguage].translated_safety}
//                       onChange={(e) => handleTranslationChange(activeLanguage, 'translated_safety', e.target.value)}
//                       placeholder={`Enter safety warning in ${languages.find(l => l.code === activeLanguage)?.label}`}
//                       rows="2"
//                       className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Translation Source (Optional)</label>
//                     <input
//                       type="text"
//                       value={translations[activeLanguage].source}
//                       onChange={(e) => handleTranslationChange(activeLanguage, 'source', e.target.value)}
//                       placeholder="Source for this translation"
//                       className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="px-6 py-4 border-t flex justify-end space-x-3">
//               <Button type="button" onClick={onClose} variant="outline" disabled={isSubmitting}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting || isLoadingConditions || isUploadingImage}>
//                 {isSubmitting ? "Creating Herb..." : isUploadingImage ? "Uploading Image..." : "Save Herb"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );

//   // ✅ Use createPortal with a safety check
//   return ReactDOM.createPortal(modalContent, portalTarget);
// };

// export default AddHerbModal;


// src/components/herbs/AddHerbModal.jsx (ADMIN - WITH CONDITION TRANSLATIONS)
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import { Leaf, X, Plus, Trash2, Sparkles, Globe, Languages, BookOpen } from "lucide-react";
import { herbApi, getApiBaseUrl } from "../../services/herbApi";
import axios from "axios";

const AddHerbModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    description: "",
    preparation: "",
    safetyWarning: "",
    source: "",
    conditionIds: [],
    image: null,
    imagePreview: null
  });

  // Translation states - Only Amharic and Oromo (English is default)
  const [translations, setTranslations] = useState({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoadingConditions, setIsLoadingConditions] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedConditionId, setSelectedConditionId] = useState("");
  
  // New condition creation states
  const [showNewConditionForm, setShowNewConditionForm] = useState(false);
  const [newCondition, setNewCondition] = useState({
    name: '',
    description: ''
  });
  const [isCreatingCondition, setIsCreatingCondition] = useState(false);

  const API_BASE_URL = getApiBaseUrl();

  // Language options - Only Amharic and Oromo
  const languages = [
    { code: "amharic", label: "አማርኛ (Amharic)", value: "AM" },
    { code: "oromo", label: "Oromiffa (Oromo)", value: "OM" }
  ];

  // Fetch conditions when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchConditions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const fetchConditions = async () => {
    setIsLoadingConditions(true);
    setApiError("");
    
    try {
      const token = localStorage.getItem("token");
      console.log('Fetching conditions from:', `${API_BASE_URL}/conditions`);
      
      const response = await axios.get(`${API_BASE_URL}/conditions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Response:', response.data);
      
      let conditionsList = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        conditionsList = response.data.data;
      } else if (Array.isArray(response.data)) {
        conditionsList = response.data;
      }
      
      console.log('Conditions loaded:', conditionsList);
      setConditions(conditionsList);
      
      // Initialize condition translations for existing conditions
      const initialConditionTranslations = {};
      conditionsList.forEach(condition => {
        initialConditionTranslations[condition.id] = {
          amharic: { translated_name: "", translated_description: "" },
          oromo: { translated_name: "", translated_description: "" }
        };
      });
      setConditionTranslations(initialConditionTranslations);
      
      if (conditionsList.length === 0) {
        setApiError("No conditions available. Please add a condition first.");
      }
    } catch (error) {
      console.error("Failed to fetch conditions:", error);
      setApiError("Failed to load conditions. Please refresh and try again.");
    } finally {
      setIsLoadingConditions(false);
    }
  };

  // Delete condition from database - DELETES ONLY THE SELECTED CONDITION
  const handleDeleteCondition = async (conditionId, conditionName) => {
    // Safety check: ensure we have a valid ID
    if (!conditionId) {
      alert("❌ Error: Invalid condition ID");
      return;
    }
    
    // Confirm before deleting
    const confirmDelete = window.confirm(
      `⚠️ Are you sure you want to delete the condition "${conditionName}"?\n\n` +
      `Condition ID: ${conditionId}\n\n` +
      `This will permanently remove it from the database.\n` +
      `Any herbs associated with this condition will lose this connection.\n\n` +
      `This action cannot be undone!`
    );
    
    if (!confirmDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const deleteUrl = `${API_BASE_URL}/conditions/${conditionId}`;
      console.log(`🗑️ Deleting condition at: ${deleteUrl}`);
      
      const response = await axios.delete(deleteUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Delete response:', response.data);
      
      if (response.data && response.data.success) {
        alert(`✅ Condition "${conditionName}" deleted successfully!`);
        
        // Remove ONLY the deleted condition from local state
        setConditions(prevConditions => 
          prevConditions.filter(c => c.id !== conditionId)
        );
        
        // Remove this condition from selected condition IDs if it was selected
        if (formData.conditionIds.includes(conditionId)) {
          setFormData(prev => ({
            ...prev,
            conditionIds: prev.conditionIds.filter(id => id !== conditionId)
          }));
        }
        
        // Remove translations for ONLY this condition
        setConditionTranslations(prev => {
          const newTranslations = { ...prev };
          delete newTranslations[conditionId];
          return newTranslations;
        });
        
        // Reset selected condition ID if it was the deleted one
        if (selectedConditionId === conditionId) {
          setSelectedConditionId("");
        }
      } else {
        throw new Error(response.data?.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete condition:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete condition';
      alert(`❌ Error: ${errorMsg}`);
    }
  };

  // Create new condition
  const handleCreateCondition = async () => {
    if (!newCondition.name.trim()) {
      setErrors(prev => ({ ...prev, newCondition: "Condition name is required" }));
      return;
    }

    setIsCreatingCondition(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/conditions`, {
        name: newCondition.name.trim(),
        description: newCondition.description.trim() || ""
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success && response.data.data) {
        const createdCondition = response.data.data;
        console.log('✅ New condition created:', createdCondition);
        
        await fetchConditions();
        setSelectedConditionId(createdCondition.id.toString());
        setShowNewConditionForm(false);
        setNewCondition({ name: '', description: '' });
        setErrors(prev => ({ ...prev, newCondition: null }));
        alert(`✅ Condition "${createdCondition.name}" created successfully!`);
      }
    } catch (error) {
      console.error('Failed to create condition:', error);
      setErrors(prev => ({ 
        ...prev, 
        newCondition: error.response?.data?.message || "Failed to create condition" 
      }));
    } finally {
      setIsCreatingCondition(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }

    if (apiError) setApiError("");
  };

  // Handle translation changes
  const handleTranslationChange = (language, field, value) => {
    setTranslations(prev => ({
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

  // Add condition to the array
  const handleAddCondition = () => {
    if (!selectedConditionId) {
      setErrors(prev => ({ ...prev, conditionIds: "Please select a condition to add" }));
      return;
    }
    
    // Use string IDs for consistency
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

  // Remove condition from the array (only from this herb, not from database)
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
      
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.scientificName.trim())
      newErrors.scientificName = "Scientific name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.safetyWarning.trim())
      newErrors.safetyWarning = "Safety warning is required";
    if (formData.conditionIds.length === 0)
      newErrors.conditionIds = "Please select at least one condition";
    if (!formData.image)
      newErrors.image = "Please select an image for the herb";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload image with 501 handling
  const uploadHerbImage = async (herbId, imageFile) => {
    try {
      const token = localStorage.getItem('token');
      const imageFormData = new FormData();
      imageFormData.append('herbId', herbId);
      imageFormData.append('image', imageFile);
      
      const response = await axios.post(`${API_BASE_URL}/uploads`, imageFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 10000
      });
      
      if (response.data?.success && response.data?.data?.image_url) {
        return response.data.data.image_url;
      }
      return null;
    } catch (error) {
      // Handle 501 gracefully - endpoint not implemented
      if (error.response?.status === 501) {
        console.warn('⚠️ Image upload endpoint not implemented yet (501). Image will be added later.');
        return null;
      }
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  // Save translations with 501 handling
  const saveTranslations = async (herbId) => {
    const token = localStorage.getItem('token');
    const translationPromises = [];

    // Save Amharic translation
    if (translations.amharic.translated_name || translations.amharic.translated_uses || 
        translations.amharic.translated_preparation || translations.amharic.translated_safety) {
      translationPromises.push(
        axios.post(`${API_BASE_URL}/translations`, {
          herbId: herbId,
          language: "AM",
          translated_name: translations.amharic.translated_name,
          translated_uses: translations.amharic.translated_uses,
          translated_preparation: translations.amharic.translated_preparation,
          translated_safety: translations.amharic.translated_safety,
          source: translations.amharic.source || formData.source
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          if (error.response?.status === 501) {
            console.warn('⚠️ Translations endpoint not implemented yet (501). Translations will be added later.');
            return { data: { success: true, message: 'Skipped - endpoint not implemented' } };
          }
          throw error;
        })
      );
    }

    // Save Oromo translation
    if (translations.oromo.translated_name || translations.oromo.translated_uses || 
        translations.oromo.translated_preparation || translations.oromo.translated_safety) {
      translationPromises.push(
        axios.post(`${API_BASE_URL}/translations`, {
          herbId: herbId,
          language: "OM",
          translated_name: translations.oromo.translated_name,
          translated_uses: translations.oromo.translated_uses,
          translated_preparation: translations.oromo.translated_preparation,
          translated_safety: translations.oromo.translated_safety,
          source: translations.oromo.source || formData.source
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(error => {
          if (error.response?.status === 501) {
            console.warn('⚠️ Translations endpoint not implemented yet (501). Translations will be added later.');
            return { data: { success: true, message: 'Skipped - endpoint not implemented' } };
          }
          throw error;
        })
      );
    }

    if (translationPromises.length > 0) {
      const results = await Promise.allSettled(translationPromises);
      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      console.log(`✅ Saved ${succeeded} herb translations (${failed} failed - may be unimplemented endpoints)`);
    }
  };

  // Save condition translations with 501 handling
  const saveConditionTranslations = async () => {
    const token = localStorage.getItem('token');
    const translationPromises = [];

    for (const [conditionId, translations] of Object.entries(conditionTranslations)) {
      // Save Amharic translation
      if (translations.amharic?.translated_name || translations.amharic?.translated_description) {
        translationPromises.push(
          axios.post(`${API_BASE_URL}/condition-translations`, {
            conditionId: conditionId,
            language: "AM",
            translated_name: translations.amharic.translated_name || "",
            translated_description: translations.amharic.translated_description || ""
          }, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(error => {
            if (error.response?.status === 501) {
              console.warn('⚠️ Condition translations endpoint not implemented yet (501)');
              return { data: { success: true, message: 'Skipped - endpoint not implemented' } };
            }
            throw error;
          })
        );
      }

      // Save Oromo translation
      if (translations.oromo?.translated_name || translations.oromo?.translated_description) {
        translationPromises.push(
          axios.post(`${API_BASE_URL}/condition-translations`, {
            conditionId: conditionId,
            language: "OM",
            translated_name: translations.oromo.translated_name || "",
            translated_description: translations.oromo.translated_description || ""
          }, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(error => {
            if (error.response?.status === 501) {
              console.warn('⚠️ Condition translations endpoint not implemented yet (501)');
              return { data: { success: true, message: 'Skipped - endpoint not implemented' } };
            }
            throw error;
          })
        );
      }
    }

    if (translationPromises.length > 0) {
      const results = await Promise.allSettled(translationPromises);
      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      console.log(`✅ Saved ${succeeded} condition translations (${failed} failed - may be unimplemented endpoints)`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");
    setUploadProgress(0);

    try {
      // Use string IDs for all condition handling
      const conditionIdsArray = [...formData.conditionIds];
      console.log('📋 Selected condition IDs:', conditionIdsArray);
      const invalidConditions = conditionIdsArray.filter(id => !conditions.find(c => String(c.id) === String(id)));
      if (invalidConditions.length > 0) {
        throw new Error(`Invalid condition IDs: ${invalidConditions.join(', ')}`);
      }
      const selectedConditions = conditions.filter(c => conditionIdsArray.includes(String(c.id)) || conditionIdsArray.includes(c.id));
      console.log('📋 Selected conditions details:', selectedConditions.map(c => ({ id: c.id, name: c.name })));
      
      // Create herb
      const herbData = {
        name: formData.name.trim(),
        scientificName: formData.scientificName.trim(),
        description: formData.description.trim(),
        preparation: formData.preparation.trim() || "No preparation information available",
        safetyWarning: formData.safetyWarning.trim(),
        source: formData.source.trim() || "",
        conditionIds: conditionIdsArray
      };

      console.log('📤 Creating herb with herbApi...');
      const createdHerb = await herbApi.createHerb(herbData);
      
      console.log('✅ Herb created:', createdHerb);
      
      let finalHerb = { ...createdHerb };
      let imageUrl = null;
      let imageUploadFailed = false;
      let translationFailed = false;

      // Upload image AFTER herb is created (skip if endpoint not available)
      if (formData.image && createdHerb.id) {
        setIsUploadingImage(true);
        setUploadProgress(30);
        
        try {
          console.log(`📸 Uploading image for herb ID: ${createdHerb.id}`);
          setUploadProgress(60);
          
          imageUrl = await uploadHerbImage(createdHerb.id, formData.image);
          setUploadProgress(100);
          
          if (imageUrl) {
            finalHerb.imageUrl = imageUrl;
            console.log('✅ Image URL:', imageUrl);
          } else if (formData.image) {
            imageUploadFailed = true;
          }
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          imageUploadFailed = true;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Save translations (skip if endpoints not available)
      try {
        await saveTranslations(createdHerb.id);
      } catch (translationError) {
        console.warn('⚠️ Translation save failed:', translationError.message);
        translationFailed = true;
      }
      
      // Save condition translations (skip if endpoints not available)
      try {
        await saveConditionTranslations();
      } catch (conditionTranslationError) {
        console.warn('⚠️ Condition translation save failed:', conditionTranslationError.message);
        translationFailed = true;
      }

      // Add selected conditions info to the herb object
      const herbWithConditions = {
        ...finalHerb,
        conditionIds: conditionIdsArray,
        selectedConditions: selectedConditions,
        translations: translations,
        conditionTranslations: conditionTranslations
      };

      if (onSave) {
        console.log('📞 Calling onSave with herb:', herbWithConditions);
        onSave(herbWithConditions);
      }

      // Build success message
      let successMessage = `✅ Herb "${formData.name}" added successfully with ${conditionIdsArray.length} condition(s)!`;
      if (imageUrl) {
        successMessage += `\n📸 Image uploaded successfully.`;
      } else if (imageUploadFailed) {
        successMessage += `\n⚠️ Image upload failed (endpoint not available). You can add the image later.`;
      }
      if (translationFailed) {
        successMessage += `\n⚠️ Some translations were not saved (endpoints not available). You can add them later.`;
      }
      
      alert(successMessage);
      handleReset();
      onClose();
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      
      if (error.message?.includes('already exists')) {
        setErrors(prev => ({
          ...prev,
          name: "A herb with this name already exists. Please use a different name."
        }));
      } else {
        setApiError(error.message || "Failed to add herb. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    
    setFormData({
      name: "",
      scientificName: "",
      description: "",
      preparation: "",
      safetyWarning: "",
      source: "",
      conditionIds: [],
      image: null,
      imagePreview: null
    });
    setTranslations({
      amharic: { translated_name: "", translated_uses: "", translated_preparation: "", translated_safety: "", source: "" },
      oromo: { translated_name: "", translated_uses: "", translated_preparation: "", translated_safety: "", source: "" }
    });
    setConditionTranslations({});
    setSelectedConditionId("");
    setShowNewConditionForm(false);
    setNewCondition({ name: '', description: '' });
    setErrors({});
    setApiError("");
    setUploadProgress(0);
  };

  // Get the list of selected condition objects
  const selectedConditionObjects = conditions.filter(c => formData.conditionIds.includes(String(c.id)) || formData.conditionIds.includes(c.id));

  if (!isOpen) return null;

  // ✅ FIX: Check if document.body exists before creating portal
  const portalTarget = document.body;
  if (!portalTarget) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Leaf className="h-6 w-6 text-white" />
              <h3 className="text-xl font-semibold text-white">Add New Herb</h3>
            </div>
            <button onClick={onClose} className="hover:opacity-80 transition-opacity">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {isLoadingConditions && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm">
                  Loading conditions...
                </div>
              )}
              
              {apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <p className="font-medium">Error:</p>
                  <p>{apiError}</p>
                </div>
              )}

              {/* Upload Progress Bar */}
              {isUploadingImage && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700">Uploading image...</span>
                    <span className="text-sm text-blue-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Herb Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
                
                {formData.imagePreview && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img
                      src={formData.imagePreview}
                      alt="Herb preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Selected: {formData.image?.name}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., Rosemary, Lavender, Chamomile"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scientific Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.scientificName}
                  onChange={(e) => handleChange("scientificName", e.target.value)}
                  placeholder="e.g., Salvia rosmarinus, Lavandula angustifolia"
                  className={errors.scientificName ? 'border-red-500' : ''}
                />
                {errors.scientificName && <p className="text-red-500 text-xs mt-1">{errors.scientificName}</p>}
              </div>

              {/* Multiple Conditions Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Conditions <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Select one or more conditions that this herb treats
                </p>
                
                {formData.conditionIds.length > 0 && (
                  <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-xs font-medium text-emerald-700 mb-2">Selected Conditions:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.conditionIds.map(id => {
                        const condition = conditions.find(c => c.id === id);
                        return (
                          <div key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm group">
                            <span>{condition?.name || `ID: ${id}`}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCondition(id)}
                              className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                              title="Remove condition from herb only (not from database)"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 mb-2">
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
                      .filter(condition => !formData.conditionIds.includes(String(condition.id)) && !formData.conditionIds.includes(condition.id))
                      .map((condition) => (
                        <option key={condition.id} value={condition.id}>
                          {condition.name} (ID: {condition.id})
                        </option>
                      ))}
                  </select>
                  <Button type="button" onClick={handleAddCondition} variant="outline" className="px-4">
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  {/* Delete button for selected condition - DELETES ONLY THE SELECTED ONE */}
                  {selectedConditionId && (
                    <Button 
                      type="button" 
                      onClick={() => {
                        const condition = conditions.find(c => String(c.id) === String(selectedConditionId));
                        if (condition) {
                          handleDeleteCondition(condition.id, condition.name);
                          setSelectedConditionId('');
                        }
                      }}
                      variant="outline" 
                      className="px-4 bg-red-50 border-red-300 hover:bg-red-100 text-red-600"
                      title="Permanently delete this condition from database"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowNewConditionForm(!showNewConditionForm)}
                  className="w-full text-sm text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-2 py-2 border-t border-gray-200 mt-2 pt-3"
                >
                  <Sparkles className="h-4 w-4" />
                  {showNewConditionForm ? 'Cancel' : '+ Create New Condition'}
                </button>
                
                {showNewConditionForm && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Create New Condition
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Condition Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newCondition.name}
                          onChange={(e) => setNewCondition(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Diabetes, Hypertension, Asthma"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description (Optional)
                        </label>
                        <textarea
                          value={newCondition.description}
                          onChange={(e) => setNewCondition(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the condition..."
                          rows="2"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                        />
                      </div>
                      {errors.newCondition && <p className="text-red-500 text-xs">{errors.newCondition}</p>}
                      <div className="flex gap-2">
                        <Button type="button" onClick={handleCreateCondition} disabled={isCreatingCondition} className="flex-1 bg-blue-600 hover:bg-blue-700">
                          {isCreatingCondition ? "Creating..." : "Create Condition"}
                        </Button>
                        <Button type="button" onClick={() => { setShowNewConditionForm(false); setNewCondition({ name: '', description: '' }); setErrors(prev => ({ ...prev, newCondition: null })); }} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.conditionIds && <p className="text-red-500 text-xs mt-1">{errors.conditionIds}</p>}
                {conditions.length > 0 && (
                  <p className="text-gray-400 text-xs mt-2">
                    {conditions.length} condition(s) available. Selected: {formData.conditionIds.length}
                  </p>
                )}
              </div>

              {/* Condition Translations Section - Only shown when conditions are selected */}
              {selectedConditionObjects.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Condition Translations</h3>
                    <span className="text-xs text-gray-500">(Optional - Translate condition names for Amharic and Oromo)</span>
                  </div>

                  {/* Language Tabs for Conditions */}
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

                  {/* Condition Translation Forms for each selected condition */}
                  <div className="space-y-4">
                    {selectedConditionObjects.map(condition => {
                      const currentTranslations = conditionTranslations[condition.id]?.[activeConditionTranslationLang] || {};
                      return (
                        <div key={condition.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{condition.name}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteCondition(condition.id, condition.name)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
                              title="Permanently delete this condition from database"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

              {/* Main Herb Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  rows="4"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Detailed description of the herb..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preparation</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  rows="3"
                  value={formData.preparation}
                  onChange={(e) => handleChange("preparation", e.target.value)}
                  placeholder="How to prepare and use the herb..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Source</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  rows="2"
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  placeholder="e.g., WHO monographs on selected medicinal plants, scientific references, traditional knowledge sources..."
                />
                <p className="text-gray-400 text-xs mt-1">Optional: Provide the source or reference for this herb information</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Safety Warning <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${errors.safetyWarning ? 'border-red-500' : 'border-gray-300'}`}
                  rows="3"
                  value={formData.safetyWarning}
                  onChange={(e) => handleChange("safetyWarning", e.target.value)}
                  placeholder="Important safety information..."
                />
                {errors.safetyWarning && <p className="text-red-500 text-xs mt-1">{errors.safetyWarning}</p>}
              </div>

              {/* Herb Translations Section */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Herb Translations</h3>
                  <span className="text-xs text-gray-500">(Optional - Add translations for Amharic and Oromo)</span>
                </div>

                {/* Language Tabs */}
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

                {/* Translation Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Translated Name</label>
                    <input
                      type="text"
                      value={translations[activeLanguage].translated_name}
                      onChange={(e) => handleTranslationChange(activeLanguage, 'translated_name', e.target.value)}
                      placeholder={`Enter herb name in ${languages.find(l => l.code === activeLanguage)?.label}`}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Translated Uses/Description</label>
                    <textarea
                      value={translations[activeLanguage].translated_uses}
                      onChange={(e) => handleTranslationChange(activeLanguage, 'translated_uses', e.target.value)}
                      placeholder={`Enter uses/description in ${languages.find(l => l.code === activeLanguage)?.label}`}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Translated Preparation</label>
                    <textarea
                      value={translations[activeLanguage].translated_preparation}
                      onChange={(e) => handleTranslationChange(activeLanguage, 'translated_preparation', e.target.value)}
                      placeholder={`Enter preparation instructions in ${languages.find(l => l.code === activeLanguage)?.label}`}
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Translated Safety Warning</label>
                    <textarea
                      value={translations[activeLanguage].translated_safety}
                      onChange={(e) => handleTranslationChange(activeLanguage, 'translated_safety', e.target.value)}
                      placeholder={`Enter safety warning in ${languages.find(l => l.code === activeLanguage)?.label}`}
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Translation Source (Optional)</label>
                    <input
                      type="text"
                      value={translations[activeLanguage].source}
                      onChange={(e) => handleTranslationChange(activeLanguage, 'source', e.target.value)}
                      placeholder="Source for this translation"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <Button type="button" onClick={onClose} variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingConditions || isUploadingImage}>
                {isSubmitting ? "Creating Herb..." : isUploadingImage ? "Uploading Image..." : "Save Herb"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // ✅ Use createPortal with a safety check
  return ReactDOM.createPortal(modalContent, portalTarget);
};

export default AddHerbModal;