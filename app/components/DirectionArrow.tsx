'use client';

interface DirectionArrowProps {
  direction: number; // degrees (0-360)
  size?: number;
  color?: string;
  label?: string;
}

export default function DirectionArrow({
  direction,
  size = 24,
  color = '#3b82f6',
  label,
}: DirectionArrowProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ transform: `rotate(${direction}deg)` }}
      >
        <path
          d="M12 2 L16 10 L12 8 L8 10 Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
        <path d="M12 8 L12 22" stroke={color} strokeWidth="2" />
      </svg>
      {label && <span className="text-xs text-gray-600">{label}</span>}
    </div>
  );
}
