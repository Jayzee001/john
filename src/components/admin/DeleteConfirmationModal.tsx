import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean; // Add loading prop
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ open, onOpenChange, onConfirm, title = 'Delete Item', description = 'Are you sure you want to delete this item? This action cannot be undone.', loading = false }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none md:w-full">
          <Dialog.Title className="text-lg font-bold mb-2">{title}</Dialog.Title>
          <Dialog.Description className="mb-6 text-gray-700">{description}</Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" className="w-full sm:w-auto" disabled={loading}>Cancel</Button>
            </Dialog.Close>
            <Button variant="destructive" className="w-full sm:w-auto flex items-center justify-center" onClick={onConfirm} disabled={loading}>
              {loading ? (
                <span className="flex items-center"><svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Loading...</span>
              ) : (
                title?.toLowerCase().includes('delete') ? 'Delete' : 'Confirm'
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 