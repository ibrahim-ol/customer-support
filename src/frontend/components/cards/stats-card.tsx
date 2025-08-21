interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white border border-black p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
            <span className="text-sm font-bold">{icon}</span>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-black">{title}</h3>
          <p className="text-2xl font-bold text-black">{value}</p>
        </div>
      </div>
    </div>
  );
}
