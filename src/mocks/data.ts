export const mockServices = [
  { id: '1', name: 'Auth Service', type: 'API', status: 'Online' },
  { id: '2', name: 'Billing DB', type: 'Database', status: 'Offline' },
  { id: '3', name: 'User API', type: 'API', status: 'Degraded' },
  { id: '4', name: 'Inventory', type: 'Database', status: 'Online' },
  { id: '5', name: 'Payment Gateway', type: 'API', status: 'Online' },
  { id: '6', name: 'Analytics', type: 'API', status: 'Offline' },
  { id: '7', name: 'Email Svc', type: 'API', status: 'Online' },
  { id: '8', name: 'SMS Notifier', type: 'API', status: 'Online' },
  { id: '9', name: 'Reports DB', type: 'Database', status: 'Degraded' },
  { id: '10', name: 'Cache Layer', type: 'Database', status: 'Online' },
  { id: '11', name: 'Logging', type: 'API', status: 'Offline' },
];

import { faker } from '@faker-js/faker';

const statusOptions = ['Online', 'Offline', 'Degraded'];
const serviceIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']; 

export const mockEvents = Array.from({ length: 500 }).map((_, i) => {
  const randomServiceId = faker.helpers.arrayElement(serviceIds);
  const randomStatus = faker.helpers.arrayElement(statusOptions);
  const timestamp = faker.date.recent({ days: 60 }); 

  return {
    id: `event-${i + 1}`,
    serviceId: randomServiceId,
    status: randomStatus,
    timestamp: timestamp.toISOString(),
  };
});
