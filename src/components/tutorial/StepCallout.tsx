import { Lightbulb, AlertTriangle, Zap, Briefcase } from 'lucide-react';
import type { Step } from '../../types';

type CalloutType = NonNullable<Step['callout']>['type'];

const CALLOUT_CONFIG: Record<CalloutType, { icon: React.ReactNode; className: string; label: string }> = {
  tip: {
    icon: <Lightbulb size={13} />,
    className: 'border-cyan-800 text-cyan-400 bg-cyan-950/30',
    label: '// TIP',
  },
  warning: {
    icon: <AlertTriangle size={13} />,
    className: 'border-yellow-800 text-yellow-400 bg-yellow-950/20',
    label: '// WATCH',
  },
  insight: {
    icon: <Zap size={13} />,
    className: 'border-green-700 text-green-400 bg-green-950/40',
    label: '// INSIGHT',
  },
  interview: {
    icon: <Briefcase size={13} />,
    className: 'border-emerald-700 text-emerald-400 bg-emerald-950/30',
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
