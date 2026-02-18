type GeometricAccentProps = {
  variant?: "circle" | "square" | "triangle";
  color?: "primary" | "secondary" | "blue" | "green" | "white";
  size?: number;
  strokeWidth?: number;
  className?: string;
};

const colorMap: Record<NonNullable<GeometricAccentProps["color"]>, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  blue: "var(--color-accent-blue)",
  green: "var(--color-accent-green)",
  white: "var(--color-accent-white)"
};

export function GeometricAccent({
  variant = "circle",
  color = "primary",
  size = 80,
  strokeWidth = 2,
  className
}: GeometricAccentProps) {
  const stroke = colorMap[color];

  if (variant === "square") {
    const inset = strokeWidth / 2;
    return (
      <svg
        aria-hidden
        className={className}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <rect
          x={inset}
          y={inset}
          width={size - strokeWidth}
          height={size - strokeWidth}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  }

  if (variant === "triangle") {
    const h = size * 0.866;
    const points = `${size / 2},${strokeWidth} ${strokeWidth},${h - strokeWidth / 2} ${size - strokeWidth},${h - strokeWidth / 2}`;
    return (
      <svg
        aria-hidden
        className={className}
        width={size}
        height={h}
        viewBox={`0 0 ${size} ${h}`}
        fill="none"
      >
        <polygon
          points={points}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const r = (size - strokeWidth) / 2;
  return (
    <svg
      aria-hidden
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
