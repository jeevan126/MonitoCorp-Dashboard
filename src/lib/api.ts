export type Service = {
  id: string;
  name: string;
  type: 'API' | 'Database';
  status: 'Online' | 'Offline' | 'Degraded';
};

export const fetchServices = async (): Promise<Service[]> => {
  console.log('Fetching services...');
  const res = await fetch('/api/services');
    console.log('Response status:', res.status);

  if (!res.ok) {
    throw new Error('Failed to fetch services');
  }

  return res.json();
};
