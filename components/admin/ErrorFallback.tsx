"use client";

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => {
  return (
    <div className="error-fallback">
      <h2>Oops! Something went wrong.</h2>
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorFallback;
