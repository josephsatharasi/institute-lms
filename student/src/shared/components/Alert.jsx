import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = '' 
}) {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600'
    }
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border-2 p-4 ${config.bg} ${config.border} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${config.text}`}>{title}</h4>}
          {message && <p className={`text-sm ${config.text}`}>{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className={`${config.text} hover:opacity-70`}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
