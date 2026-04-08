import { Lightbulb, AlertTriangle, Zap, Briefcase } from 'lucide-react';
import type { Step } from '../../dsa-types';

type CalloutType = NonNullable<Step['callout']>['type'];

const CALLOUT_CONFIG: Record<CalloutType, { icon: React.ReactNode; className: string; label: string }> = {
  tip: {
    icon: <Lightbulb size={13} />,
    className: 'border-[#2a2a2a] text-gray-300 bg-white/[0.02]',
    label: '// TIP',
  },
  warning: {
    icon: <AlertTriangle size={13} />,
    className: 'border-yellow-800 text-yellow-400 bg-yellow-950/20',
    label: '// WATCH',
  },
  insight: {
    icon: <Zap size={13} />,
    className: 'border-[#2a2a2a] text-[#00FF00] bg-[#00FF00]/5',
    label: '// INSIGHT',
  },
  interview: {
    icon: <Briefcase size={13} />,
    className: 'border-[#2a2a2a] text-gray-300 bg-white/[0.02]',
    label: '// INTERVIEW',
  },
};

interface StepCalloutProps {
  type: CalloutType;
  text: string;
}

export default function StepCallout({ type, text }: StepCalloutProps) {
  const config = CALLOUT_CONFIG[type];
  return (
    <div className={`flex items-start gap-2.5 border px-3.5 py-3 text-sm font-mono ${config.className}`}>
      <span className="mt-0.5 flex-shrink-0">{config.icon}</span>
      <div>
        <span className="font-bold">{config.label}: </span>
        <span className="opacity-80">{text}</span>
      </div>
    </div>
  );
}
