'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServices } from '@/hooks/useServices';
import { useStatusPolling } from '@/hooks/useStatusPolling';
import { ServiceModal } from './ServiceModal';
import { useDeleteService } from '@/hooks/useServiceMutations';
import { DeleteModal } from './DeleteModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trash2, Pencil, Plus, Loader2 } from 'lucide-react';
import { ServicesResponse, ServiceType } from '@/lib/type';

export const ServiceList = () => {
  const [filters, setFilters] = useState<{ status?: string; name_like?: string }>({});
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ServiceType|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceType|null>(null);
  const limit = 10;

  const router = useRouter();
  useStatusPolling({ page, limit });

  const { data, isLoading, isError, isFetching } = useServices({ ...filters, page, limit }) as { data: ServicesResponse | undefined, isLoading: boolean, isError: boolean, isFetching: boolean };
  const deleteMutation = useDeleteService();

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name..."
          className="w-1/3"
          onChange={(e) => {
            setPage(1);
            setFilters((f) => ({ ...f, name_like: e.target.value }));
          }}
        />

        <Select
          onValueChange={(value) => {
            setPage(1);
            setFilters((f) => ({
              ...f,
              status: value === 'all' ? undefined : value,
            }));
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
            <SelectItem value="Degraded">Degraded</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="ml-auto"
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {isLoading && 
        <div className="flex justify-center py-6">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      }
      {isError && <p className="text-red-500">Error loading services.</p>}

      <div className="space-y-4">
        {data?.data.map((service: ServiceType) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
          <div
            key={service.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
            onClick={() => router.push(`/services/${service.id}`)}
          >
            <div className="flex flex-col">
              <h2 className="text-lg font-medium text-gray-900">{service.name}</h2>
              <p className="text-sm text-gray-500">{service.type}</p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={service.status} />
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(service);
                  setShowModal(true);
                }}
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(service);
                }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>

      {isFetching && !isLoading && (
        <p className="text-sm text-gray-400 text-center">Refreshing data...</p>
      )}

      <ServiceModal
        open={showModal || !!editing}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        existing={editing}
      />

      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            if (!deleteTarget) return;
            await deleteMutation.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
          } catch {
            alert('Failed to delete service.');
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    Online: 'bg-green-100 text-green-700',
    Offline: 'bg-red-100 text-red-700',
    Degraded: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${colorMap[status] || 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
};
