import { X } from 'lucide-react';

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  icon: Icon,
  size = 'md'
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`max-h-[90vh] w-full ${sizes[size]} overflow-y-auto rounded-2xl bg-white shadow-2xl`}>
        <div className="sticky top-0 flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-7 w-7 text-white" />}
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
