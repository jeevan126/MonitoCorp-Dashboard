import { ServiceType } from "@/lib/type";

export const ServiceDetail = ({ service }: { service: ServiceType }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-100 text-green-800";
      case "Offline":
        return "bg-red-100 text-red-800";
      case "Degraded":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">{service.name}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
          {service.status}
        </span>
      </div>
      <p className="text-gray-500 text-sm">{service.type}</p>
    </div>
  );
};

