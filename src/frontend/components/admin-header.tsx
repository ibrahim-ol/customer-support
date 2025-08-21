export function AdminAlternateHeader({
  title,
  subtitle,
  button,
}: {
  title: string;
  subtitle: string;
  button?: { label: string; onClick: () => void };
}) {
  return (
    <div className="sticky top-0 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/dashboard"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ← Back to Dashboard
            </a>
            {button && (
              <button
                onClick={button.onClick}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {button.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
