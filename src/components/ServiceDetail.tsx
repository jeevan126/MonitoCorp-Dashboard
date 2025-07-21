export const ServiceDetail = ({ service }: { service: any }) => (
  <div className="p-4 border rounded bg-white shadow mb-4">
    <h1 className="text-2xl font-semibold mb-1">{service.name}</h1>
    <p className="text-gray-500 text-sm mb-2">{service.type}</p>
    <span className={`inline-block px-3 py-1 rounded-full bg-${service.status === 'Online' ? 'green' : service.status === 'Offline' ? 'red' : 'yellow'}-100 text-${service.status === 'Online' ? 'green' : service.status === 'Offline' ? 'red' : 'yellow'}-800 text-sm`}>
      {service.status}
    </span>
  </div>
);
