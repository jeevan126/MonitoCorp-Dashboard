'use client';

import React from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
};

export const DeleteModal = ({ open, onClose, onConfirm, loading }: DeleteModalProps) => {
  if (!open) return null;

  const handleDelete = async () => {
    try {
      await onConfirm();
      toast.success('Service deleted successfully.');
      onClose();
    } catch (error) {
      toast.error('Failed to delete the service.');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl relative animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold mb-2">Confirm Deletion</h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete this service? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
