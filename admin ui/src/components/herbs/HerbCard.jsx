// // src/components/herbs/HerbCard.jsx - Add this function to fetch images as blobs
// import { useState, useEffect } from 'react';
// import StatusBadge from '../common/StatusBadge';
// import Button from '../common/Button';
// import { herbApi, getApiBaseUrl } from '../../services/herbApi';
// import { 
//   BookOpenIcon,
//   MapPinIcon,
//   TagIcon,
//   ClockIcon,
//   EyeIcon,
//   PencilIcon,
//   TrashIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   ExclamationTriangleIcon,
//   BeakerIcon,
//   PhotoIcon
// } from '@heroicons/react/24/outline';

// const HerbCard = ({ herb, viewMode = 'grid', onEdit, onDelete, onView }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [isLoadingImage, setIsLoadingImage] = useState(false);

//   // Fetch image URL from uploads API if not present in herb object
//   useEffect(() => {
//     const fetchImageUrl = async () => {
//       const herbId = herb?.id;
//       const existingImageUrl = herb?.imageUrl || herb?.image_url;
      
//       if (existingImageUrl) {
//         setImageUrl(existingImageUrl);
//         return;
//       }
      
//       if (!herbId) return;
      
//       setIsLoadingImage(true);
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${getApiBaseUrl()}/uploads/${herbId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         const data = await response.json();
        
//         if (data.success && data.data && data.data.length > 0) {
//           const fetchedImageUrl = data.data[0].image_url;
//           setImageUrl(fetchedImageUrl);
//           console.log(`📸 Fetched image for herb ${herb.name}:`, fetchedImageUrl);
//         }
//       } catch (error) {
//         console.error(`Failed to fetch image for herb ${herbId}:`, error);
//       } finally {
//         setIsLoadingImage(false);
//       }
//     };
    
//     fetchImageUrl();
//   }, [herb?.id, herb?.name, herb?.imageUrl, herb?.image_url]);

//   // Add a proxy URL for images if needed (for CORS bypass)
//   const getProxiedImageUrl = (url) => {
//     if (!url) return null;
//     // If you have a proxy endpoint, use it
//     // return `${getApiBaseUrl()}/proxy?url=${encodeURIComponent(url)}`;
//     return url;
//   };

//   // Safely get herb properties with defaults
//   const herbData = {
//     id: herb?.id || herb?._id || 'N/A',
//     name: herb?.name || 'Unnamed Herb',
//     scientificName: herb?.scientificName || 'No scientific name',
//     description: herb?.description || 'No description available',
//     preparation: herb?.preparation || 'No preparation information available',
//     safetyWarning: herb?.safetyWarning || 'No safety warnings specified',
//     status: herb?.status || 'draft',
//     createdAt: herb?.createdAt ? new Date(herb.createdAt).toLocaleDateString() : 'Unknown date',
//     updatedAt: herb?.updatedAt ? new Date(herb.updatedAt).toLocaleDateString() : 'Unknown'
//   };

//   const handleAction = (action, e) => {
//     e.stopPropagation();
//     switch (action) {
//       case 'edit':
//         onEdit?.(herb);
//         break;
//       case 'delete':
//         onDelete?.(herb);
//         break;
//       case 'view':
//         onView?.(herb);
//         break;
//     }
//   };

//   // Get status colors
//   const getStatusColors = () => {
//     switch (herbData.status) {
//       case 'published':
//         return { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' };
//       case 'pending':
//         return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
//       case 'draft':
//         return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
//       default:
//         return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
//     }
//   };

//   const statusColors = getStatusColors();
//   const displayImageUrl = getProxiedImageUrl(imageUrl || herb?.imageUrl || herb?.image_url);

//   if (viewMode === 'list') {
//     return (
//       <div 
//         className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div className="flex items-start justify-between">
//           {/* Left Section with Image */}
//           <div className="flex-1 flex items-start space-x-4">
//             {/* Herb Image or Icon */}
//             <div className="flex-shrink-0">
//               {isLoadingImage ? (
//                 <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${statusColors.bg}`}>
//                   <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300" />
//                 </div>
//               ) : displayImageUrl && !imageError ? (
//                 <img
//                   src={displayImageUrl}
//                   alt={herbData.name}
//                   className="w-16 h-16 rounded-xl object-cover border border-gray-200"
//                   onError={() => setImageError(true)}
//                   crossOrigin="anonymous"
//                 />
//               ) : (
//                 <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${statusColors.bg}`}>
//                   <PhotoIcon className={`w-8 h-8 ${statusColors.text}`} />
//                 </div>
//               )}
//             </div>

//             {/* Content */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{herbData.name}</h3>
//                   <p className="text-sm text-gray-500 italic mt-1">{herbData.scientificName}</p>
//                 </div>
//                 <StatusBadge status={herbData.status} />
//               </div>

//               <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <div className="flex items-center space-x-2">
//                   <TagIcon className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm font-medium text-gray-900">ID: {herbData.id}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <ClockIcon className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm text-gray-600">Added: {herbData.createdAt}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <BeakerIcon className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm text-gray-600">Updated: {herbData.updatedAt}</span>
//                 </div>
//               </div>

//               {herbData.description && (
//                 <p className="mt-3 text-sm text-gray-600 line-clamp-2">{herbData.description}</p>
//               )}
//             </div>
//           </div>

//           {/* Actions - View, Edit, Delete (No Duplicate) */}
//           <div className={`ml-4 flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
//             <Button
//               size="sm"
//               variant="ghost"
//               icon={EyeIcon}
//               onClick={(e) => handleAction('view', e)}
//               title="View details"
//             />
//             <Button
//               size="sm"
//               variant="ghost"
//               icon={PencilIcon}
//               onClick={(e) => handleAction('edit', e)}
//               title="Edit herb"
//             />
//             <Button
//               size="sm"
//               variant="ghost"
//               icon={TrashIcon}
//               onClick={(e) => handleAction('delete', e)}
//               title="Delete herb"
//               className="text-red-600 hover:text-red-700 hover:bg-red-50"
//             />
//           </div>
//         </div>

//         {/* Expandable Section */}
//         {expanded && (
//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h4 className="text-sm font-medium text-gray-900 mb-2">Preparation</h4>
//                 <p className="text-sm text-gray-600">{herbData.preparation}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
//                   <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mr-1" />
//                   Safety Warning
//                 </h4>
//                 <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
//                   {herbData.safetyWarning}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Expand/Collapse Button */}
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="w-full mt-4 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700"
//         >
//           {expanded ? (
//             <>
//               <ChevronUpIcon className="w-4 h-4 mr-1" />
//               Show Less
//             </>
//           ) : (
//             <>
//               <ChevronDownIcon className="w-4 h-4 mr-1" />
//               Show Preparation & Safety
//             </>
//           )}
//         </button>
//       </div>
//     );
//   }

//   // Grid View with Image
//   return (
//     <div 
//       className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Image Section */}
//       <div className="relative h-48 bg-gray-100 overflow-hidden">
//         {isLoadingImage ? (
//           <div className="w-full h-full flex items-center justify-center">
//             <div className="animate-pulse w-12 h-12 rounded-full bg-gray-300" />
//           </div>
//         ) : displayImageUrl && !imageError ? (
//           <img
//             src={displayImageUrl}
//             alt={herbData.name}
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//             onError={() => setImageError(true)}
//             crossOrigin="anonymous"
//           />
//         ) : (
//           <div className="w-full h-full flex flex-col items-center justify-center">
//             <PhotoIcon className="w-12 h-12 text-gray-400" />
//             <p className="text-xs text-gray-400 mt-2">No image</p>
//           </div>
//         )}
        
//         {/* Status Badge Overlay */}
//         <div className="absolute top-3 right-3">
//           <StatusBadge status={herbData.status} size="sm" />
//         </div>
        
//         {/* ID Overlay */}
//         <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
//           <span className="text-xs text-white font-mono">#{herbData.id}</span>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-5 flex-1 flex-col">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{herbData.name}</h3>
//           <p className="text-sm text-gray-500 italic mt-1 line-clamp-1">{herbData.scientificName}</p>
//         </div>

//         {herbData.description && (
//           <p className="mt-3 text-sm text-gray-600 line-clamp-2">{herbData.description}</p>
//         )}

//         {/* Details */}
//         <div className="mt-4 space-y-3 flex-1">
//           {/* Preparation Preview */}
//           <div>
//             <div className="flex items-center space-x-2 mb-1">
//               <BeakerIcon className="w-4 h-4 text-gray-400" />
//               <span className="text-xs font-medium text-gray-700">Preparation</span>
//             </div>
//             <p className="text-xs text-gray-600 line-clamp-2">{herbData.preparation}</p>
//           </div>

//           {/* Safety Warning Preview */}
//           <div>
//             <div className="flex items-center space-x-2 mb-1">
//               <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
//               <span className="text-xs font-medium text-gray-700">Safety</span>
//             </div>
//             <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg line-clamp-2">
//               {herbData.safetyWarning}
//             </div>
//           </div>
//         </div>

//         {/* Dates */}
//         <div className="mt-4 pt-3 border-t border-gray-100">
//           <div className="flex items-center justify-between text-xs text-gray-400">
//             <span>Added: {herbData.createdAt}</span>
//             <span>Updated: {herbData.updatedAt}</span>
//           </div>
//         </div>

//         {/* Action Buttons - View, Edit, Delete (No Duplicate) */}
//         <div className={`mt-4 pt-3 border-t border-gray-200 flex items-center justify-between transition-opacity ${
//           isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
//         }`}>
//           <Button
//             size="sm"
//             variant="ghost"
//             icon={EyeIcon}
//             onClick={(e) => handleAction('view', e)}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             View
//           </Button>
//           <Button
//             size="sm"
//             variant="ghost"
//             icon={PencilIcon}
//             onClick={(e) => handleAction('edit', e)}
//             className="text-blue-600 hover:text-blue-700"
//           >
//             Edit
//           </Button>
//           <Button
//             size="sm"
//             variant="ghost"
//             icon={TrashIcon}
//             onClick={(e) => handleAction('delete', e)}
//             className="text-red-600 hover:text-red-700"
//           >
//             Delete
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Default props for the component
// HerbCard.defaultProps = {
//   herb: {
//     id: 1,
//     name: 'Tenadam',
//     scientificName: 'Ruta chalepensis',
//     description: 'A traditional Ethiopian herb known for its medicinal properties and use in coffee ceremonies.',
//     preparation: 'Fresh or dried leaves can be brewed into tea. Typically 3-5 leaves steeped in hot water for 5-10 minutes.',
//     safetyWarning: 'POTENT HERB - Contraindicated during pregnancy. Use with caution and in small amounts.',
//     status: 'published',
//     createdAt: '2024-01-15',
//     updatedAt: '2024-01-15'
//   }
// };

// export default HerbCard;


// src/components/herbs/HerbCard.jsx - Fixed version
import { useState, useEffect } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { herbApi, getApiBaseUrl } from '../../services/herbApi';
import { 
  BookOpenIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const HerbCard = ({ herb, viewMode = 'grid', onEdit, onDelete, onView }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Debug: Log the herb data to see what's being received
  useEffect(() => {
    console.log('📋 HerbCard received herb:', {
      id: herb?.id,
      name: herb?.name,
      scientificName: herb?.scientificName,
      description: herb?.description,
      safetyWarning: herb?.safetyWarning,
      preparation: herb?.preparation,
      source: herb?.source,
      status: herb?.status,
      imageUrl: herb?.imageUrl,
      conditionIds: herb?.conditionIds
    });
  }, [herb]);

  // Fetch image URL from uploads API if not present in herb object
  useEffect(() => {
    const fetchImageUrl = async () => {
      const herbId = herb?.id;
      const existingImageUrl = herb?.imageUrl || herb?.image_url;
      
      if (existingImageUrl) {
        setImageUrl(existingImageUrl);
        return;
      }
      
      if (!herbId) return;
      
      setIsLoadingImage(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${getApiBaseUrl()}/uploads/${herbId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          const fetchedImageUrl = data.data[0].image_url;
          setImageUrl(fetchedImageUrl);
          console.log(`📸 Fetched image for herb ${herb.name}:`, fetchedImageUrl);
        }
      } catch (error) {
        console.error(`Failed to fetch image for herb ${herbId}:`, error);
      } finally {
        setIsLoadingImage(false);
      }
    };
    
    fetchImageUrl();
  }, [herb?.id, herb?.name, herb?.imageUrl, herb?.image_url]);

  // Add a proxy URL for images if needed (for CORS bypass)
  const getProxiedImageUrl = (url) => {
    if (!url) return null;
    return url;
  };

  // ✅ FIXED: Safely get herb properties with proper fallbacks
  const herbData = {
    id: herb?.id || herb?._id || 'N/A',
    name: herb?.name || 'Unnamed Herb',
    // ✅ Try multiple possible field names
    scientificName: herb?.scientificName || herb?.scientific_name || 'Scientific name not available',
    description: herb?.description || 'No description available',
    preparation: herb?.preparation || 'Preparation information not available',
    safetyWarning: herb?.safetyWarning || herb?.safety_warning || 'Safety information not available',
    source: herb?.source || '',
    status: herb?.status || 'draft',
    createdAt: herb?.createdAt || herb?.created_at ? new Date(herb?.createdAt || herb?.created_at).toLocaleDateString() : 'Unknown date',
    updatedAt: herb?.updatedAt || herb?.updated_at ? new Date(herb?.updatedAt || herb?.updated_at).toLocaleDateString() : 'Unknown',
    conditionNames: herb?.conditionNames || herb?.conditions || []
  };

  // ✅ Show warning if data is missing
  useEffect(() => {
    if (herb && (!herb.scientificName || herb.scientificName === 'No scientific name')) {
      console.warn(`⚠️ Herb "${herb.name}" is missing scientificName. Raw herb data:`, herb);
    }
    if (herb && (!herb.safetyWarning || herb.safetyWarning === 'No safety warnings specified')) {
      console.warn(`⚠️ Herb "${herb.name}" is missing safetyWarning. Raw herb data:`, herb);
    }
    if (herb && (!herb.description || herb.description === 'No description available')) {
      console.warn(`⚠️ Herb "${herb.name}" is missing description. Raw herb data:`, herb);
    }
  }, [herb]);

  const handleAction = (action, e) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        onEdit?.(herb);
        break;
      case 'delete':
        onDelete?.(herb);
        break;
      case 'view':
        onView?.(herb);
        break;
    }
  };

  // Get status colors
  const getStatusColors = () => {
    switch (herbData.status) {
      case 'published':
        return { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' };
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
      case 'draft':
        return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const statusColors = getStatusColors();
  const displayImageUrl = getProxiedImageUrl(imageUrl || herb?.imageUrl || herb?.image_url);

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between">
          {/* Left Section with Image */}
          <div className="flex-1 flex items-start space-x-4">
            {/* Herb Image or Icon */}
            <div className="flex-shrink-0">
              {isLoadingImage ? (
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${statusColors.bg}`}>
                  <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300" />
                </div>
              ) : displayImageUrl && !imageError ? (
                <img
                  src={displayImageUrl}
                  alt={herbData.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                  onError={() => setImageError(true)}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${statusColors.bg}`}>
                  <PhotoIcon className={`w-8 h-8 ${statusColors.text}`} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{herbData.name}</h3>
                  <p className="text-sm text-gray-500 italic mt-1">{herbData.scientificName}</p>
                </div>
                <StatusBadge status={herbData.status} />
              </div>

              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <TagIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">ID: {herbData.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Added: {herbData.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Updated: {herbData.updatedAt}</span>
                </div>
              </div>

              {herbData.description && herbData.description !== 'No description available' && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{herbData.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={`ml-4 flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              size="sm"
              variant="ghost"
              icon={EyeIcon}
              onClick={(e) => handleAction('view', e)}
              title="View details"
            />
            <Button
              size="sm"
              variant="ghost"
              icon={PencilIcon}
              onClick={(e) => handleAction('edit', e)}
              title="Edit herb"
            />
            <Button
              size="sm"
              variant="ghost"
              icon={TrashIcon}
              onClick={(e) => handleAction('delete', e)}
              title="Delete herb"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            />
          </div>
        </div>

        {/* Expandable Section */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preparation</h4>
                <p className="text-sm text-gray-600">{herbData.preparation}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mr-1" />
                  Safety Warning
                </h4>
                <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                  {herbData.safetyWarning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700"
        >
          {expanded ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" />
              Show Preparation & Safety
            </>
          )}
        </button>
      </div>
    );
  }

  // Grid View with Image
  return (
    <div 
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {isLoadingImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse w-12 h-12 rounded-full bg-gray-300" />
          </div>
        ) : displayImageUrl && !imageError ? (
          <img
            src={displayImageUrl}
            alt={herbData.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-gray-400" />
            <p className="text-xs text-gray-400 mt-2">No image</p>
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={herbData.status} size="sm" />
        </div>
        
        {/* ID Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-xs text-white font-mono">#{herbData.id}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex-col">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{herbData.name}</h3>
          <p className="text-sm text-gray-500 italic mt-1 line-clamp-1">{herbData.scientificName}</p>
        </div>

        {herbData.description && herbData.description !== 'No description available' && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{herbData.description}</p>
        )}

        {/* Details */}
        <div className="mt-4 space-y-3 flex-1">
          {/* Preparation Preview */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <BeakerIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">Preparation</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{herbData.preparation}</p>
          </div>

          {/* Safety Warning Preview */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-gray-700">Safety</span>
            </div>
            <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg line-clamp-2">
              {herbData.safetyWarning}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Added: {herbData.createdAt}</span>
            <span>Updated: {herbData.updatedAt}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`mt-4 pt-3 border-t border-gray-200 flex items-center justify-between transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <Button
            size="sm"
            variant="ghost"
            icon={EyeIcon}
            onClick={(e) => handleAction('view', e)}
            className="text-gray-600 hover:text-gray-900"
          >
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={PencilIcon}
            onClick={(e) => handleAction('edit', e)}
            className="text-blue-600 hover:text-blue-700"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={TrashIcon}
            onClick={(e) => handleAction('delete', e)}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HerbCard;