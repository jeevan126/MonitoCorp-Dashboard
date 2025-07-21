'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServices } from '@/hooks/useServices';
import { useStatusPolling } from '@/hooks/useStatusPolling';
import { ServiceModal } from './ServiceModal';
import { useDeleteService } from '@/hooks/useServiceMutations';
import { DeleteModal } from './DeleteModal';

export const ServiceList = () => {
  const [filters, setFilters] = useState<{ status?: string; name_like?: string }>({});
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const limit = 10;

  const router = useRouter();
  useStatusPolling({ page, limit });

  const { data, isLoading, isError, isFetching } = useServices({ ...filters, page, limit });
  const deleteMutation = useDeleteService();

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex gap-4 items-center">
        <input
          placeholder="Search by name..."
          className="border p-2 rounded w-1/3"
          onChange={(e) => {
            setPage(1);
            setFilters((f) => ({ ...f, name_like: e.target.value }));
          }}
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => {
            setPage(1);
            setFilters((f) => ({ ...f, status: e.target.value || undefined }));
          }}
        >
          <option value="">All statuses</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Degraded">Degraded</option>
        </select>
        <button
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
        >
          + Add Service
        </button>
      </div>

      {/* List */}
      {isLoading && <p>Loading services...</p>}
      {isError && <p className="text-red-500">Error loading services.</p>}

      <div className="space-y-4">
        {data?.data.map((service) => (
          <div
            key={service.id}
            className="border rounded-lg p-4 shadow flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div
              onClick={() => router.push(`/services/${service.id}`)}
              className="cursor-pointer flex-1"
            >
              <h2 className="font-semibold text-lg">{service.name}</h2>
              <p className="text-sm text-gray-500">{service.type}</p>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <StatusBadge status={service.status} />

              <button
                className="text-blue-600 text-sm underline"
                onClick={() => {
                  setEditing(service);
                  setShowModal(true);
                }}
              >
                Edit
              </button>

              <button
                className="text-red-600 text-sm underline"
                onClick={() => setDeleteTarget(service)}
              >
                Delete
              </button>

              <DeleteModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={async () => {
                  try {
                    await deleteMutation.mutateAsync(deleteTarget.id);
                    setDeleteTarget(null);
                  } catch (err) {
                    alert('Failed to delete service.');
                  }
                }}
                loading={deleteMutation.isLoading}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      {/* Background refresh indicator */}
      {isFetching && !isLoading && (
        <p className="text-sm text-gray-400 text-center">Refreshing data...</p>
      )}

      {/* Add/Edit Modal */}
      <ServiceModal
        open={showModal || !!editing}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        existing={editing}
      />
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    Online: 'bg-green-100 text-green-800',
    Offline: 'bg-red-100 text-red-800',
    Degraded: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span
      className={`px-3 py-1 text-sm rounded-full ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
};
