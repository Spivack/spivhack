import { motion } from 'framer-motion';
import type {
  Visualization as VisualizationType,
  SortingVisualization,
  ArrayVisualization,
  GraphVisualization,
} from '../../types';

function SortingViz({ data }: { data: SortingVisualization }) {
  const max = Math.max(...data.array);

  const getColor = (index: number): string => {
    if (data.sorted?.includes(index)) return '#4ade80';
    if (data.swapping?.includes(index)) return '#f87171';
    if (data.comparing?.includes(index)) return '#facc15';
    if (data.pivot === index) return '#a3e635';
    return '#166534';
  };

  return (
    <div className="flex items-end justify-center gap-1 h-40 px-4">
      {data.array.map((val, i) => (
        <motion.div
          key={i}
          className="relative flex flex-col items-center"
          style={{ width: `${String(Math.min(40, 280 / data.array.length))}px` }}
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span className="text-xs text-green-700 mb-1 font-mono">{val}</span>
          <motion.div
            animate={{ height: `${String((val / max) * 120)}px`, backgroundColor: getColor(i) }}
            transition={{ duration: 0.3 }}
            style={{ minHeight: '4px', width: '100%' }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function ArrayViz({ data }: { data: ArrayVisualization }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {data.array.map((val, i) => {
          const isHighlighted = data.highlighted?.includes(i);
          const isFound = data.found === i;
          return (
            <motion.div
              key={i}
              className={`w-10 h-10 flex items-center justify-center border font-mono text-sm font-bold transition-colors ${
                isFound
                  ? 'border-green-400 bg-green-950 text-green-300'
                  : isHighlighted
                  ? 'border-green-600 bg-green-900/30 text-green-400'
                  : 'border-green-900 bg-[#0a120a] text-green-700'
              }`}
              animate={{ scale: isHighlighted || isFound ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {val}
            </motion.div>
          );
        })}
      </div>
      <div className="flex gap-1">
        {data.array.map((_, i) => (
          <div key={i} className="w-10 text-center text-xs text-green-900 font-mono">
            {i}
          </div>
        ))}
      </div>
      {data.pointers && data.pointers.length > 0 && (
        <div className="flex gap-1 relative">
          {data.array.map((_, i) => {
            const pointer = data.pointers?.find((p) => p.index === i);
            return (
              <div key={i} className="w-10 flex flex-col items-center">
                {pointer && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold font-mono px-1"
                    style={{ color: pointer.color }}
                  >
                    ↑ {pointer.label}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GraphViz({ data }: { data: GraphVisualization }) {
  const nodeStateColors: Record<string, string> = {
    default: '#0a120a',
    visiting: '#713f12',
    visited: '#14532d',
    path: '#166534',
    start: '#164e63',
    end: '#7f1d1d',
  };

  const nodeBorderColors: Record<string, string> = {
    default: '#166534',
    visiting: '#ca8a04',
    visited: '#4ade80',
    path: '#86efac',
    start: '#38bdf8',
    end: '#f87171',
  };

  const edgeStateColors: Record<string, string> = {
    default: '#166534',
    active: '#4ade80',
    path: '#86efac',
  };

  const width = 320;
  const height = 200;

  return (
    <svg
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      className="w-full max-w-xs mx-auto"
      style={{ maxHeight: '200px' }}
    >
      {data.edges.map((edge, i) => {
        const from = data.nodes.find((n) => n.id === edge.from);
        const to = data.nodes.find((n) => n.id === edge.to);
        if (!from || !to) return null;
        const fromX = (from.x / 100) * width;
        const fromY = (from.y / 100) * height;
        const toX = (to.x / 100) * width;
        const toY = (to.y / 100) * height;

        return (
          <g key={i}>
            <line
              x1={fromX} y1={fromY} x2={toX} y2={toY}
              stroke={edgeStateColors[edge.state] ?? edgeStateColors.default}
              strokeWidth={edge.state === 'path' ? 2 : 1}
              strokeOpacity={0.7}
            />
            {edge.weight !== undefined && (
              <text x={(fromX + toX) / 2} y={(fromY + toY) / 2 - 4}
                fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {edge.weight}
              </text>
            )}
          </g>
        );
      })}

      {data.nodes.map((node) => {
        const x = (node.x / 100) * width;
        const y = (node.y / 100) * height;

        return (
          <g key={node.id}>
            <rect
              x={x - 14} y={y - 14} width={28} height={28}
              fill={nodeStateColors[node.state] ?? nodeStateColors.default}
              stroke={nodeBorderColors[node.state] ?? nodeBorderColors.default}
              strokeWidth={1.5}
            />
            <text x={x} y={y + 5} fill="#86efac" fontSize="11"
              fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {node.label}
            </text>
            {node.distance !== undefined && node.distance !== Infinity && (
              <text x={x} y={y - 18} fill="#4ade80" fontSize="8"
                textAnchor="middle" fontFamily="monospace">
                d={node.distance}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

interface VisualizationProps {
  data: VisualizationType;
}

export default function Visualization({ data }: VisualizationProps) {
  return (
    <div className="border border-green-900 bg-[#060e06] p-4">
      <div className="text-xs font-mono text-green-800 mb-3 tracking-widest">{'// VISUALIZATION'}</div>
      {data.type === 'sorting' && <SortingViz data={data} />}
      {data.type === 'array' && <ArrayViz data={data} />}
      {data.type === 'graph' && <GraphViz data={data} />}
    </div>
  );
}
