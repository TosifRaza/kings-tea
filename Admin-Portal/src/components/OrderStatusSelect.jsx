import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ORDER_STATUSES } from '../utils/constants';

const OrderStatusSelect = ({ currentStatus, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statusConfig = ORDER_STATUSES.find((s) => s.value === currentStatus) || ORDER_STATUSES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm"
        style={{
          borderColor: `${statusConfig.color}40`,
          backgroundColor: `${statusConfig.color}10`,
          color: statusConfig.color,
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: statusConfig.color }}
        />
        {statusConfig.label}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg border border-imperial-gold/10 shadow-lg py-1 min-w-[140px]">
            {ORDER_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  onChange(status.value);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium w-full hover:bg-warm-ivory/60 transition-colors"
                style={{ color: status.color }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                {status.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderStatusSelect;
