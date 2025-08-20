import { PropsWithChildren } from "hono/jsx";

interface ContentCardProps extends PropsWithChildren {
  title?: string;
  className?: string;
}

export function ContentCard({ title, children, className = "" }: ContentCardProps) {
  return (
    <div className={`bg-white border border-black ${className}`}>
      {title && (
        <div className="border-b border-black px-6 py-4">
          <h3 className="text-lg font-bold text-black">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
