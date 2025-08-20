import { PropsWithChildren } from "hono/jsx";

interface ActionCardProps {
  title: string;
  description?: string;
  icon: string;
  onClick?: () => void;
  href?: string;
}

export function ActionCard({ title, description, icon, onClick, href }: ActionCardProps) {
  const baseClasses = "flex flex-col items-center p-4 border border-black hover:bg-gray-50 transition-colors";

  const content = (
    <>
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-black text-center">
        {title}
      </span>
      {description && (
        <span className="text-xs text-black text-center mt-1">
          {description}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
