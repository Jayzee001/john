/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { adminUserService } from '@/lib/admin/userService';
import { X } from 'lucide-react';

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ open, onOpenChange, userId }) => {
  const [user, setUser] = React.useState<any>(null);
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open && userId) {
      setLoading(true);
      setError('');
      adminUserService.getUserById(userId)
        .then((data) => {
          setUser(data.user);
          setAnalytics(data.analytics);
        })
        .catch(() => {
          setError('Failed to load user details');
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setAnalytics(null);
      setError('');
    }
  }, [open, userId]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none md:w-full">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold">User Details</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-600">{error}</div>
          ) : user ? (
            <div className="space-y-4">
              <div>
                <div className="font-medium text-gray-900 text-lg">{user.firstName} {user.lastName}</div>
                <div className="text-gray-700 text-sm">{user.email}</div>
                <div className="text-xs text-gray-500">ID: {user.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold text-gray-700">Role:</span> <span className="text-gray-900">{user.role}</span></div>
                <div><span className="font-semibold text-gray-700">Status:</span> <span className="text-gray-900">{user.isActive ? 'Active' : 'Inactive'}</span></div>
                <div><span className="font-semibold text-gray-700">Email Verified:</span> <span className="text-gray-900">{user.emailVerified ? 'Yes' : 'No'}</span></div>
                <div><span className="font-semibold text-gray-700">Created:</span> <span className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span></div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-gray-700">Address</div>
                <div className="text-sm text-gray-900">
                  {user.address?.street || '-'}, {user.address?.city || '-'}, {user.address?.postCode || '-'}, {user.address?.country || '-'}
                </div>
              </div>
              {analytics && (
                <div className="mt-2 text-sm text-gray-900">
                  <div><span className="font-semibold text-gray-700">Account Age:</span> {analytics.accountAge} days</div>
                  <div><span className="font-semibold text-gray-700">Last Updated:</span> {analytics.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : '-'}</div>
                </div>
              )}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 