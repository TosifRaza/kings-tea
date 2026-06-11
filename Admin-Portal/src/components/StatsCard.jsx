import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, change, changeLabel, color = 'imperial-gold' }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const colorMap = {
    'imperial-gold': { bg: 'bg-imperial-gold/10', icon: 'text-imperial-gold', border: 'border-imperial-gold/20' },
    'tea-green': { bg: 'bg-tea-green/10', icon: 'text-tea-green', border: 'border-tea-green/20' },
    'royal-terracotta': { bg: 'bg-royal-terracotta/10', icon: 'text-royal-terracotta', border: 'border-royal-terracotta/20' },
    'blue': { bg: 'bg-blue-500/10', icon: 'text-blue-500', border: 'border-blue-500/20' },
  };

  const colors = colorMap[color] || colorMap['imperial-gold'];

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-5 flex items-start gap-4`}>
      <div className={`${colors.bg} p-3 rounded-lg flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-deep-walnut/50 font-medium">{title}</p>
        <p className="text-2xl font-bold text-deep-walnut mt-1">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1.5">
            {isPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
            {isNegative && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
            <span className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : isNegative ? 'text-red-500' : 'text-deep-walnut/40'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            {changeLabel && (
              <span className="text-xs text-deep-walnut/40">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;