// src/components/dashboard/RecentActivityTable.jsx
import StatusBadge from '../common/StatusBadge';
import { UserIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const RecentActivityTable = ({ activities = [] }) => {
  const data = activities;

  // Get user role badge and color (only Admin or Herb Creator)
  const getUserRoleInfo = (userRole) => {
    const role = userRole?.toLowerCase() || 'herb_creator';
    switch(role) {
      case 'admin':
        return { 
          label: 'Administrator', 
          color: 'bg-purple-100 text-purple-700',
          icon: ShieldCheckIcon
        };
      case 'herb_creator':
      case 'creator':
      default:
        return { 
          label: 'Herb Creator', 
          color: 'bg-emerald-100 text-emerald-700',
          icon: UserCircleIcon
        };
    }
  };

  // Get user display name
  const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';
    if (typeof user === 'string') return user;
    return user.name || user.username || user.email || 'Herb Creator';
  };

  // Get user role
  const getUserRole = (user) => {
    if (!user) return 'herb_creator';
    if (typeof user === 'string') return 'herb_creator';
    return user.role || user.userType || 'herb_creator';
  };

  // Get user avatar
  const getUserAvatar = (user) => {
    if (!user) return null;
    if (typeof user === 'string') return null;
    return user.avatar || user.profileImage || null;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HERB NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DATE ADDED
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ADDED BY
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((activity) => {
              const userRoleInfo = getUserRoleInfo(getUserRole(activity.userData));
              const RoleIcon = userRoleInfo.icon;
              const userAvatar = getUserAvatar(activity.userData);
              const userName = getUserDisplayName(activity.userData);
              
              return (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{activity.herbName}</div>
                    {activity.scientificName && (
                      <div className="text-xs text-gray-500 italic mt-0.5">
                        {activity.scientificName}
                      </div>
                    )}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.date}</div>
                    {activity.timeAgo && (
                      <div className="text-xs text-gray-500 mt-0.5">{activity.timeAgo}</div>
                    )}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {userAvatar ? (
                        <img 
                          src={userAvatar} 
                          alt={userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{userName}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <RoleIcon className="w-3 h-3" />
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${userRoleInfo.color}`}>
                            {userRoleInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={activity.status} />
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityTable;