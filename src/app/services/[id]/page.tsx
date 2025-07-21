'use client';

import { useParams, useRouter } from 'next/navigation';
import { useServiceDetails } from '@/hooks/useServiceDetails';
import { ServiceDetail } from '@/components/ServiceDetail';
import { EventList } from '@/components/EventList';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServiceDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data, isLoading, isError } = useServiceDetails(id);

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">MonitoCorp Services</h1>
        <Button
          variant="ghost"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 px-2 py-1"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : isError || !data ? (
        <p className="text-red-500 text-sm text-center">⚠️ Failed to load service.</p>
      ) : (
        <div className="space-y-6">
          <ServiceDetail service={data} />

          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Status History</h2>
            <EventList serviceId={id} />
          </div>
        </div>
      )}
    </main>
  );
}
