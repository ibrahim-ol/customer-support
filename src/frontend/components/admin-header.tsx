export function AdminHeader({
  back,
  title,
}: {
  title: string;
  back?: { text: string; link: string };
}) {
  return (
    <header className="sticky top-0  bg-white text-black px-4 py-2 border-b border-black">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {back && (
            <a
              href={back.link}
              className="text-black hover:text-gray-600 transition-colors"
            >
              ← {back.text}
            </a>
          )}

          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-black">Welcome, Admin</span>
          <a
            href="/admin/logout"
            className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black"
          >
            Logout
          </a>
        </div>
      </div>
    </header>
  );
}

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
