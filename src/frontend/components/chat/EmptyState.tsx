interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No messages yet.",
  message = "Start the conversation below!"
}: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center text-black">
        <div className="text-4xl mb-4">💬</div>
        <p className="text-lg">{title}</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
}
