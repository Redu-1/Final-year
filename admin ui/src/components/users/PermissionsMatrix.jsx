// src/components/users/PermissionsMatrix.jsx
import { useState } from 'react';

const PermissionsMatrix = ({ permissions = [] }) => {
  const [editedPermissions, setEditedPermissions] = useState(
    permissions.map(p => ({ ...p }))
  );

  const handlePermissionChange = (index, field, value) => {
    const updated = [...editedPermissions];
    updated[index][field] = value;
    setEditedPermissions(updated);
  };

  const columns = [
    { key: 'module', label: 'Module' },
    { key: 'create', label: 'Create' },
    { key: 'read', label: 'Read' },
    { key: 'update', label: 'Update' },
    { key: 'delete', label: 'Delete' }
  ];

  if (!permissions || permissions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No permissions data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {editedPermissions.map((perm, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">
                  {perm.module}
                </div>
                {perm.description && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {perm.description}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={perm.create}
                  onChange={(e) => handlePermissionChange(index, 'create', e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={perm.read}
                  onChange={(e) => handlePermissionChange(index, 'read', e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={perm.update}
                  onChange={(e) => handlePermissionChange(index, 'update', e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={perm.delete}
                  onChange={(e) => handlePermissionChange(index, 'delete', e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsMatrix;