interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = "Loading..." }: LoadingIndicatorProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex items-center space-x-2 text-black">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
        <span>{message}</span>
      </div>
    </div>
  );
}
