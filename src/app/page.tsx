import { ServiceList } from '@/components/ServiceList';

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">MonitoCorp Services</h1>
      <ServiceList />
    </main>
  );
}
