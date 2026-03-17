import type { ComplexityInfo } from '../../types';
import { Clock, Database } from 'lucide-react';

interface ComplexityBadgeProps {
  complexity: ComplexityInfo;
}

export default function ComplexityBadge({ complexity }: ComplexityBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border border-green-800 text-green-400 font-mono text-xs">
        <Clock size={12} />
        <span className="font-bold">{complexity.time}</span>
        <span className="text-green-700">time</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 border border-green-900 text-green-600 font-mono text-xs">
        <Database size={12} />
        <span className="font-bold">{complexity.space}</span>
        <span className="text-green-800">space</span>
      </div>
      {complexity.note && (
        <p className="w-full text-xs font-mono text-green-800 italic pl-1">{complexity.note}</p>
      )}
    </div>
  );
}
