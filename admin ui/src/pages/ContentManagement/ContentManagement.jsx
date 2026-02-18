// src/pages/ContentManagement/ContentManagement.jsx
import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';

const ContentManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const content = [
    {
      id: 1,
      title: 'Updated Dosage: Aloe Vera',
      type: 'Herb Update',
      author: 'Sarah J.',
      date: 'Oct 24, 2023',
      status: 'approved',
      views: 1245,
      comments: 23
    },
    {
      id: 2,
      title: 'New Submission: Kava',
      type: 'Herb Submission',
      author: 'Mike R.',
      date: 'Oct 23, 2023',
      status: 'pending',
      views: 0,
      comments: 0
    },
    {
      id: 3,
      title: 'Deleted Draft: Root B',
      type: 'Content Deletion',
      author: 'Admin',
      date: 'Oct 23, 2023',
      status: 'draft',
      views: 0,
      comments: 0
    },
    {
      id: 4,
      title: 'User Role Changed: John D.',
      type: 'User Update',
      author: 'John D.',
      date: 'Oct 22, 2023',
      status: 'approved',
      views: 89,
      comments: 3
    }
  ];

  // Handle view content
  const handleView = (item) => {
    alert(`Viewing: ${item.title}`);
  };

  // Handle edit content
  const handleEdit = (item) => {
    alert(`Editing: ${item.title}`);
  };

  // Handle delete content
  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      alert(`Deleted: ${item.title}`);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'CONTENT',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.title}</div>
          <div className="text-sm text-gray-500">{item.type}</div>
        </div>
      )
    },
    {
      key: 'author',
      header: 'AUTHOR',
      render: (item) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-gray-600">
              {item.author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.author}</div>
            <div className="text-sm text-gray-500">{item.date}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (item) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          item.status === 'approved' ? 'bg-green-100 text-green-800' :
          item.status === 'pending' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status.toUpperCase()}
        </span>
      )
    },
    {
      key: 'metrics',
      header: 'METRICS',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.views.toLocaleString()} views</div>
          <div className="text-sm text-gray-500">{item.comments} comments</div>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      render: (item) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(item)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  const filteredContent = content.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate stats
  const totalItems = content.length;
  const publishedItems = content.filter(i => i.status === 'approved').length;
  const pendingItems = content.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      </div>

      {/* Simple Stats */}
      <div className="flex items-center space-x-6 text-sm">
        <span className="text-gray-600">
          Total: <span className="font-medium text-gray-900">{totalItems}</span>
        </span>
        <span className="text-gray-600">
          Published: <span className="font-medium text-emerald-600">{publishedItems}</span>
        </span>
        <span className="text-gray-600">
          Pending: <span className="font-medium text-amber-600">{pendingItems}</span>
        </span>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search content..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <select
              className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredContent}
          emptyMessage="No content found"
        />

        {/* Simple Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          Showing {filteredContent.length} of {content.length} items
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;