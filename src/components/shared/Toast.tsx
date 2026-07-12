import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-20 left-4 right-4 z-[3000] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: { id: string; type: string; message: string; duration?: number }; onRemove: (id: string) => void }) {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 4000;
  const Icon = icons[toast.type as keyof typeof icons] || Info;
  const color = colors[toast.type as keyof typeof colors] || '#2196f3';

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p <= 0) {
          clearInterval(interval);
          return 0;
        }
        return p - (100 / (duration / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    if (progress <= 0) {
      onRemove(toast.id);
    }
  }, [progress, toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="pointer-events-auto max-w-[400px] w-full mx-auto sm:mx-0 sm:ms-auto"
    >
      <div className="bg-[#111] border border-[rgba(200,164,92,0.2)] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex items-start gap-3 p-4">
          <Icon size={20} style={{ color }} className="shrink-0 mt-0.5" />
          <p className="text-sm text-[#f5f5f5] flex-1">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-[#666] hover:text-[#f5f5f5] transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
        <div className="h-[2px] bg-[#1a1a1a]">
          <motion.div
            className="h-full"
            style={{ backgroundColor: color, width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
