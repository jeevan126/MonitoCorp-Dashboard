'use client';

import { useParams, useRouter } from 'next/navigation';
import { useServiceDetails } from '@/hooks/useServiceDetails';
import { ServiceDetail } from '@/components/ServiceDetail';
import { EventList } from '@/components/EventList';

export default function ServiceDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data, isLoading, isError } = useServiceDetails(id);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError || !data) return <p className="p-4 text-red-500">Failed to load service.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <button
        onClick={() => router.push('/')}
        className="text-sm text-blue-600 underline mb-2 hover:text-blue-800"
      >
        ← Back to Services
      </button>

      <ServiceDetail service={data} />

      <h2 className="text-lg font-semibold mb-2">Status History</h2>
      <EventList serviceId={id} />
    </div>
  );
}
