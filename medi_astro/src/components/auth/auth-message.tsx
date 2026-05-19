interface AuthMessageProps {
  message: string | null;
}

export function AuthMessage({ message }: AuthMessageProps) {
  if (!message) return null;

  return (
    <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
      {message}
    </p>
  );
}
