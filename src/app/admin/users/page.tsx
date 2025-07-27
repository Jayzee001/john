/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye } from 'lucide-react';
import type { User } from '@/types';
import { adminUserService } from '@/lib/admin/userService';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { UserDetailModal } from '@/components/admin/UserDetailModal';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function TableSkeleton({ rows = 5, cols = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <td key={j} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        </td>
      ))}
    </tr>
  ));
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add more filters as needed
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const params: Record<string, any> = {
          page,
          limit,
        };
        if (debouncedSearch.length >= 2) {
          params.search = debouncedSearch;
        }
        if (role !== 'all') {
          params.role = role;
        }
        if (status !== 'all') {
          params.status = status;
        }
        const response: any = await adminUserService.searchUsers(params, true); // true: return full response
        setUsers(response.users);
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
        });
      } catch (err: any) {
        // Handle validation error from API
        if (err?.error?.details && Array.isArray(err.error.details)) {
          setError(err.error.details.join(', '));
        } else if (err?.error?.message) {
          setError(err.error.message);
        } else {
          setError('Failed to fetch users');
        }
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [debouncedSearch, role, status, page, limit]);

  // Filter users based on search (optional, since API does it)
  // const filteredUsers = users.filter(user => {
  //   const fullName = user.name || `${user.firstName} ${user.lastName}`;
  //   return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //          user.email.toLowerCase().includes(searchTerm.toLowerCase());
  // });

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage customer accounts and information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {users.filter(user => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return new Date(user.createdAt) > thirtyDaysAgo;
              }).length}
            </p>
            <p className="text-sm text-gray-600">New This Month</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {users.filter(user => user.isActive).length}
            </p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-col md:flex-row gap-2 md:gap-4 items-stretch md:items-center">
            <Input
              type="text"
          placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64"
        />
        <Select
          value={role}
          onValueChange={setRole}
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'admin', label: 'Admin' },
            { value: 'customer', label: 'Customer' },
          ]}
          placeholder="All Roles"
          className="w-full md:w-36"
        />
        <Select
          value={status}
          onValueChange={setStatus}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          placeholder="All Status"
          className="w-full md:w-36"
        />
        <Input
          type="number"
          min={1}
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          className="w-full md:w-20"
            />
          </div>
      <Card className="p-4 md:p-6" id="user-table">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? TableSkeleton({ rows: limit, cols: 5 })
                : users.map((user) => {
                const fullName = user.name || `${user.firstName} ${user.lastName}`;
                const initials = fullName.split(' ').map(n => n[0]).join('');
                return (
                  <tr key={user.id}>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {initials}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {fullName}
                          </div>
                              <div className="text-sm text-gray-500 md:block hidden">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {user.email}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 justify-center md:justify-start">
                            <Button variant="outline" size="sm" title="View User" className="p-1" onClick={() => { setSelectedUserId(user.id); setModalOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                            {/*
                        <Button variant="outline" size="sm" title="Edit User" className="p-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Delete User" className="p-1 text-red-600 hover:text-red-800" onClick={() => deleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                            */}
                      </div>
                    </td>
                  </tr>
                );
                  })
              }
            </tbody>
          </table>
        </div>
        {users.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </Card>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(p) => {
          setPage(p);
          setTimeout(() => {
            const el = document.getElementById('user-table');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }}
        scrollToId="user-table"
      />
      <UserDetailModal open={modalOpen} onOpenChange={setModalOpen} userId={selectedUserId} />
    </div>
  );
} 