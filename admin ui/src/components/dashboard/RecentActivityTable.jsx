// src/components/dashboard/RecentActivityTable.jsx
import StatusBadge from '../common/StatusBadge';
import { EyeIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';

const RecentActivityTable = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      date: 'Oct 24, 2023',
      action: 'Updated Dosage: Aloe Vera',
      user: 'Sarah J.',
      status: 'approved',
      userAvatar: 'SJ',
      type: 'update'
    },
    {
      id: 2,
      date: 'Oct 23, 2023',
      action: 'New Submission: Kava',
      user: 'Mike R.',
      status: 'pending',
      userAvatar: 'MR',
      type: 'submission'
    },
    {
      id: 3,
      date: 'Oct 23, 2023',
      action: 'Deleted Draft: Root B',
      user: 'Admin',
      status: 'draft',
      userAvatar: 'AD',
      type: 'delete'
    },
    {
      id: 4,
      date: 'Oct 22, 2023',
      action: 'User Role Changed: John D.',
      user: 'John D.',
      status: 'approved',
      userAvatar: 'JD',
      type: 'user'
    },
    {
      id: 5,
      date: 'Oct 21, 2023',
      action: 'Added New Herb: Ashwagandha',
      user: 'Botany Team',
      status: 'published',
      userAvatar: 'BT',
      type: 'create'
    },
    {
      id: 6,
      date: 'Oct 20, 2023',
      action: 'Updated Safety Guidelines',
      user: 'Medical Team',
      status: 'approved',
      userAvatar: 'MT',
      type: 'update'
    }
  ];

  const data = activities.length > 0 ? activities : defaultActivities;

  const getActionIcon = (type) => {
    switch (type) {
      case 'create':
        return (
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'update':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <PencilIcon className="w-4 h-4 text-blue-600" />
          </div>
        );
      case 'delete':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <TrashIcon className="w-4 h-4 text-red-600" />
          </div>
        );
      case 'user':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <EyeIcon className="w-4 h-4 text-gray-600" />
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DATE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTION
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                USER
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{activity.date}</div>
                  <div className="text-xs text-gray-500">10:30 AM</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {getActionIcon(activity.type)}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.type === 'create' && 'New herb added to database'}
                        {activity.type === 'update' && 'Dosage information updated'}
                        {activity.type === 'delete' && 'Draft content removed'}
                        {activity.type === 'user' && 'User permissions modified'}
                        {activity.type === 'submission' && 'Awaiting review and approval'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {activity.userAvatar}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                      <div className="text-xs text-gray-500">
                        {activity.user === 'Admin' ? 'System Administrator' : 'Herb Specialist'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={activity.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">6</span> of <span className="font-medium">142</span> activities
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityTable;