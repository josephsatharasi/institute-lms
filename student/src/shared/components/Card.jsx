export function Card({ 
  children, 
  className = '',
  hover = false,
  ...props 
}) {
  return (
    <div
      className={`rounded-xl bg-white p-6 shadow-lg ${
        hover ? 'transition-all hover:shadow-xl' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
