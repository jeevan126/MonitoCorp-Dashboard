'use client';

import { useEffect, useState } from 'react';
import { useCreateService, useUpdateService } from '@/hooks/useServiceMutations';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { ServiceType } from '@/lib/type';

export const ServiceModal = ({
  open,
  onClose,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  existing?: ServiceType | null;
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('API');

  const isEdit = Boolean(existing);
  const create = useCreateService();
  const update = useUpdateService();

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setType(existing.type);
    } else {
      setName('');
      setType('API');
    }
  }, [existing]);

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await update.mutateAsync({ id: existing!.id, name, type });
        toast.success('Service updated successfully!');
      } else {
        await create.mutateAsync({ name, type });
        toast.success('Service created successfully!');
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white w-[95%] max-w-md rounded-xl shadow-2xl p-6 space-y-5 transition-all animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              {isEdit ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1">Service Name</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter service name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Type</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="API">API</option>
                <option value="Database">Database</option>
                <option value="Frontend">Frontend</option>
                <option value="Worker">Worker</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
