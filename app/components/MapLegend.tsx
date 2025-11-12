'use client';

export default function MapLegend() {
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">
        Surf Score Legend
      </h3>

      <div className="space-y-2">
        <LegendItem color="#22c55e" label="Epic" score="80-100" />
        <LegendItem color="#84cc16" label="Great" score="60-79" />
        <LegendItem color="#eab308" label="Good" score="40-59" />
        <LegendItem color="#f97316" label="Fair" score="20-39" />
        <LegendItem color="#ef4444" label="Poor" score="0-19" />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
            <span>Loading data...</span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>
          Score based on wave height, period, direction, and wind conditions.
        </p>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  score,
}: {
  color: string;
  label: string;
  score: string;
}) {
  return (
    <div className="flex items-center text-sm">
      <div
        className="w-5 h-5 rounded-full mr-2 border-2 border-white shadow"
        style={{ backgroundColor: color }}
      ></div>
      <span className="font-medium text-gray-700">{label}</span>
      <span className="ml-auto text-gray-500 text-xs">{score}</span>
    </div>
  );
}
