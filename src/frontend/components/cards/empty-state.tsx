import { PropsWithChildren } from "hono/jsx";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <span className="text-4xl mb-4 block">{icon}</span>
      <p className="text-black font-medium mb-2">{title}</p>
      {description && (
        <p className="text-sm text-black mb-4">
          {description}
        </p>
      )}
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black inline-block"
          >
            {action.text}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black"
          >
            {action.text}
          </button>
        )
      )}
    </div>
  );
}
