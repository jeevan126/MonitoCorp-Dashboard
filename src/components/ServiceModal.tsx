import { useEffect, useState } from 'react';
import { useCreateService, useUpdateService } from '@/hooks/useServiceMutations';

export const ServiceModal = ({ open, onClose, existing }: {
  open: boolean;
  onClose: () => void;
  existing?: { id: string; name: string; type: string };
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
      } else {
        await create.mutateAsync({ name, type });
      }
      onClose();
    } catch (err) {
      alert('Failed to save. Try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96 space-y-4">
        <h2 className="text-lg font-semibold">{isEdit ? 'Edit' : 'Add'} Service</h2>
        <input
          className="border w-full p-2 rounded"
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="border w-full p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="API">API</option>
          <option value="Database">Database</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            {isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};
