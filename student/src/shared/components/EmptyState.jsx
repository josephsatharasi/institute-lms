export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
      {Icon && <Icon className="mx-auto h-16 w-16 text-gray-400" />}
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
