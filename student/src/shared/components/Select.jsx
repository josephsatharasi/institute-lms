export function Select({ 
  label, 
  options = [], 
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
      <select
        className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none ${
          error ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
        } ${className}`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
