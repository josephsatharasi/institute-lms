export function Input({ 
  label, 
  icon: Icon, 
  error,
  className = '',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        )}
        <input
          className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none ${
            Icon ? 'pl-11' : ''
          } ${
            error ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
