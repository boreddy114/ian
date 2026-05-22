"use client";

import React, { useState } from "react";

interface Dataset {
  label: string;
  data: number[];
}

interface ChartData {
  title: string;
  type: "line" | "bar" | "area" | "pie";
  labels: string[];
  datasets: Dataset[];
}

export default function InlineChart({ data }: { data: ChartData }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return <div className="text-muted italic text-xs">No chart data available</div>;
  }

  const { type, labels, datasets, title } = data;

  // Layout parameters for SVG
  const width = 280;
  const height = 160;
  const paddingLeft = 32;
  const paddingRight = 12;
  const paddingTop = 20;
  const paddingBottom = 22;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find overall min and max values for Y scaling
  const allValues = datasets.flatMap((d) => d.data);
  const maxValue = Math.max(...allValues, 1); // Avoid division by zero
  const minValue = Math.min(...allValues, 0); // Include zero by default

  const yRange = maxValue - minValue;
  const yStep = yRange / 4;

  const getYPos = (val: number) => {
    return height - paddingBottom - ((val - minValue) / yRange) * chartHeight;
  };

  const getXPos = (index: number) => {
    if (labels.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (labels.length - 1)) * chartWidth;
  };

  // Color palettes
  const datasetColors = [
    {
      stroke: "#8b5cf6", // Violet
      fillGradStart: "rgba(139, 92, 246, 0.3)",
      fillGradEnd: "rgba(139, 92, 246, 0.0)",
      dot: "#a78bfa",
    },
    {
      stroke: "#d946ef", // Fuchsia
      fillGradStart: "rgba(217, 70, 239, 0.3)",
      fillGradEnd: "rgba(217, 70, 239, 0.0)",
      dot: "#f472b6",
    },
    {
      stroke: "#06b6d4", // Cyan
      fillGradStart: "rgba(6, 182, 212, 0.3)",
      fillGradEnd: "rgba(6, 182, 212, 0.0)",
      dot: "#22d3ee",
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= paddingLeft && x <= width - paddingRight) {
      // Find closest label index
      const relativeX = x - paddingLeft;
      const index = Math.round((relativeX / chartWidth) * (labels.length - 1));
      if (index >= 0 && index < labels.length) {
        setHoveredIndex(index);
        setTooltipPos({ x: getXPos(index), y: y - 10 });
      }
    } else {
      setHoveredIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // RENDER LINE OR AREA
  const renderLineArea = () => {
    return (
      <>
        {/* Grids */}
        {[0, 1, 2, 3, 4].map((i) => {
          const val = minValue + yStep * i;
          const y = getYPos(val);
          return (
            <g key={i} className="chart-grid-line">
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="2,2"
              />
              <text
                x={paddingLeft - 6}
                y={y + 3}
                fill="rgba(255,255,255,0.4)"
                fontSize="8px"
                textAnchor="end"
              >
                {val.toFixed(val > 100 ? 0 : 1)}
              </text>
            </g>
          );
        })}

        {/* Areas (render first so lines sit on top) */}
        {type === "area" &&
          datasets.map((dataset, dIdx) => {
            const color = datasetColors[dIdx % datasetColors.length];
            const points = dataset.data.map((val, idx) => ({
              x: getXPos(idx),
              y: getYPos(val),
            }));

            if (points.length === 0) return null;

            const pathD = [
              `M ${points[0].x} ${points[0].y}`,
              ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
              `L ${points[points.length - 1].x} ${height - paddingBottom}`,
              `L ${points[0].x} ${height - paddingBottom}`,
              "Z",
            ].join(" ");

            return (
              <path
                key={`area-${dIdx}`}
                d={pathD}
                fill={`url(#areaGrad-${dIdx})`}
                opacity={0.7}
              />
            );
          })}

        {/* Lines */}
        {datasets.map((dataset, dIdx) => {
          const color = datasetColors[dIdx % datasetColors.length];
          const points = dataset.data.map((val, idx) => ({
            x: getXPos(idx),
            y: getYPos(val),
          }));

          if (points.length === 0) return null;

          const pathD = [
            `M ${points[0].x} ${points[0].y}`,
            ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
          ].join(" ");

          return (
            <path
              key={`line-${dIdx}`}
              d={pathD}
              fill="none"
              stroke={color.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="chart-line-path"
            />
          );
        })}

        {/* Data points */}
        {datasets.map((dataset, dIdx) => {
          const color = datasetColors[dIdx % datasetColors.length];
          return dataset.data.map((val, idx) => {
            const cx = getXPos(idx);
            const cy = getYPos(val);
            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={`dot-${dIdx}-${idx}`}
                cx={cx}
                cy={cy}
                r={isHovered ? 5 : 3}
                fill={isHovered ? "#fff" : color.dot}
                stroke={color.stroke}
                strokeWidth={isHovered ? 2 : 1}
                className="chart-dot"
                style={{ transition: "all 0.15s ease" }}
              />
            );
          });
        })}

        {/* X Labels */}
        {labels.map((label, idx) => {
          const x = getXPos(idx);
          return (
            <text
              key={idx}
              x={x}
              y={height - paddingBottom + 12}
              fill="rgba(255,255,255,0.4)"
              fontSize="8px"
              textAnchor="middle"
            >
              {label}
            </text>
          );
        })}

        {/* Hover vertical guide line */}
        {hoveredIndex !== null && (
          <line
            x1={getXPos(hoveredIndex)}
            y1={paddingTop}
            x2={getXPos(hoveredIndex)}
            y2={height - paddingBottom}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
            pointerEvents="none"
          />
        )}
      </>
    );
  };

  // RENDER BAR
  const renderBar = () => {
    const numLabels = labels.length;
    const numDatasets = datasets.length;
    const groupGap = 16; // gap between groups
    const availableWidth = chartWidth - (numLabels - 1) * groupGap;
    const groupWidth = availableWidth / numLabels;
    const barGap = 2; // gap between bars in group
    const barWidth = (groupWidth - (numDatasets - 1) * barGap) / numDatasets;

    return (
      <>
        {/* Grids */}
        {[0, 1, 2, 3, 4].map((i) => {
          const val = minValue + yStep * i;
          const y = getYPos(val);
          return (
            <g key={i} className="chart-grid-line">
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="2,2"
              />
              <text
                x={paddingLeft - 6}
                y={y + 3}
                fill="rgba(255,255,255,0.4)"
                fontSize="8px"
                textAnchor="end"
              >
                {val.toFixed(val > 100 ? 0 : 1)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {labels.map((_, lIdx) => {
          const groupX = paddingLeft + lIdx * (groupWidth + groupGap);

          return datasets.map((dataset, dIdx) => {
            const val = dataset.data[lIdx];
            const barX = groupX + dIdx * (barWidth + barGap);
            const y = getYPos(val);
            const barHeight = height - paddingBottom - y;
            const isHovered = hoveredIndex === lIdx;

            const color = datasetColors[dIdx % datasetColors.length];

            return (
              <rect
                key={`bar-${dIdx}-${lIdx}`}
                x={barX}
                y={y}
                width={Math.max(barWidth, 3)}
                height={Math.max(barHeight, 1)}
                fill={isHovered ? "#ffffff" : color.stroke}
                rx={1.5}
                ry={1.5}
                opacity={isHovered ? 1 : 0.85}
                style={{
                  transition: "all 0.2s ease",
                  transformOrigin: `${barX}px ${height - paddingBottom}px`,
                }}
              />
            );
          });
        })}

        {/* X Labels */}
        {labels.map((label, idx) => {
          const groupX = paddingLeft + idx * (groupWidth + groupGap);
          const x = groupX + groupWidth / 2;
          return (
            <text
              key={idx}
              x={x}
              y={height - paddingBottom + 12}
              fill="rgba(255,255,255,0.4)"
              fontSize="8px"
              textAnchor="middle"
            >
              {label}
            </text>
          );
        })}
      </>
    );
  };

  // RENDER PIE
  const renderPie = () => {
    const pieCenter = { x: 75, y: 85 };
    const pieRadius = 45;

    // Use first dataset for pie data
    const dataset = datasets[0];
    const total = dataset.data.reduce((sum, v) => sum + v, 0);

    let startAngle = 0;

    const pieColors = ["#8b5cf6", "#d946ef", "#06b6d4", "#3b82f6", "#10b981"];

    return (
      <g>
        {dataset.data.map((val, idx) => {
          const percentage = total > 0 ? val / total : 0;
          const angle = percentage * 360;

          // Convert polar coordinates to Cartesian
          const radStart = ((startAngle - 90) * Math.PI) / 180;
          const radEnd = ((startAngle + angle - 90) * Math.PI) / 180;

          const x1 = pieCenter.x + pieRadius * Math.cos(radStart);
          const y1 = pieCenter.y + pieRadius * Math.sin(radStart);
          const x2 = pieCenter.x + pieRadius * Math.cos(radEnd);
          const y2 = pieCenter.y + pieRadius * Math.sin(radEnd);

          const largeArcFlag = angle > 180 ? 1 : 0;

          // Path description for a pie wedge
          const pathD = [
            `M ${pieCenter.x} ${pieCenter.y}`,
            `L ${x1} ${y1}`,
            `A ${pieRadius} ${pieRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ");

          const isHovered = hoveredIndex === idx;
          const color = pieColors[idx % pieColors.length];

          // Compute label position
          const midAngle = startAngle + angle / 2;
          const radMid = ((midAngle - 90) * Math.PI) / 180;
          const labelDist = isHovered ? 6 : 0;
          const transform = isHovered
            ? `translate(${Math.cos(radMid) * labelDist}, ${Math.sin(radMid) * labelDist})`
            : "";

          startAngle += angle;

          return (
            <path
              key={`slice-${idx}`}
              d={pathD}
              fill={color}
              transform={transform}
              opacity={hoveredIndex === null || isHovered ? 0.9 : 0.5}
              style={{ transition: "all 0.2s ease", cursor: "pointer" }}
              onMouseEnter={(e) => {
                setHoveredIndex(idx);
                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({
                    x: pieCenter.x + Math.cos(radMid) * (pieRadius / 2),
                    y: pieCenter.y + Math.sin(radMid) * (pieRadius / 2) - 10,
                  });
                }
              }}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}

        {/* Pie Legend on the right side of the circle */}
        <g transform="translate(145, 45)">
          {labels.map((label, idx) => {
            const color = pieColors[idx % pieColors.length];
            const val = dataset.data[idx];
            const pctStr = total > 0 ? `(${(val / total * 100).toFixed(0)}%)` : "";
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={`legend-${idx}`}
                transform={`translate(0, ${idx * 18})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={handleMouseLeave}
                opacity={hoveredIndex === null || isHovered ? 1 : 0.5}
              >
                <rect width="8" height="8" rx="2" fill={color} />
                <text
                  x="14"
                  y="8"
                  fill={isHovered ? "#fff" : "rgba(255,255,255,0.7)"}
                  fontSize="9px"
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {label.slice(0, 10)} {pctStr}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    );
  };

  // Render vertical indicator for Bar chart hovers
  const handleBarMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const numLabels = labels.length;
    const groupGap = 16;
    const availableWidth = chartWidth - (numLabels - 1) * groupGap;
    const groupWidth = availableWidth / numLabels;

    const relativeX = x - paddingLeft;
    const idx = Math.floor(relativeX / (groupWidth + groupGap));

    if (idx >= 0 && idx < labels.length) {
      setHoveredIndex(idx);
      const centerOfGroup = paddingLeft + idx * (groupWidth + groupGap) + groupWidth / 2;
      setTooltipPos({ x: centerOfGroup, y: y - 10 });
    } else {
      setHoveredIndex(null);
    }
  };

  return (
    <div className="inline-chart-container relative my-2 rounded-xl p-3 border border-border bg-black/40 backdrop-blur-md shadow-2xl">
      <div className="chart-header flex justify-between items-center mb-1">
        <span className="chart-title text-xs font-semibold text-white/95 truncate">
          {title}
        </span>
        <span className="chart-badge text-[8px] bg-accent/25 text-accent-secondary border border-accent/40 rounded px-1.5 py-0.5 uppercase tracking-wider font-bold">
          {type}
        </span>
      </div>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={type === "bar" ? handleBarMouseMove : handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="overflow-visible"
      >
        <defs>
          {datasets.map((_, idx) => (
            <linearGradient
              key={`grad-${idx}`}
              id={`areaGrad-${idx}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={datasetColors[idx % datasetColors.length].stroke} stopOpacity="0.4" />
              <stop offset="100%" stopColor={datasetColors[idx % datasetColors.length].stroke} stopOpacity="0.0" />
            </linearGradient>
          ))}
        </defs>

        {type === "pie"
          ? renderPie()
          : type === "bar"
          ? renderBar()
          : renderLineArea()}
      </svg>

      {/* Glassmorphic interactive HTML tooltip */}
      {hoveredIndex !== null && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(tooltipPos.x / width) * 100}%`,
            top: `${tooltipPos.y}px`,
            transform: "translate(-50%, -100%)",
            transition: "left 0.1s ease-out, top 0.1s ease-out",
            position: "absolute"
          }}
        >
          <div className="font-semibold border-b border-white/10 pb-0.5 text-white/60">
            {labels[hoveredIndex]}
          </div>
          {datasets.map((ds, idx) => (
            <div key={idx} className="chart-tooltip-row">
              <span className="chart-tooltip-label">
                <span
                  className="tooltip-dot"
                  style={{
                    backgroundColor:
                      type === "pie"
                        ? ["#8b5cf6", "#d946ef", "#06b6d4", "#3b82f6", "#10b981"][hoveredIndex % 5]
                        : datasetColors[idx % datasetColors.length].stroke,
                  }}
                />
                {ds.label}:
              </span>
              <span className="chart-tooltip-value">
                {ds.data[hoveredIndex]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Legend below the graph (only for line/bar/area with multiple datasets) */}
      {type !== "pie" && datasets.length > 1 && (
        <div className="chart-legend-container">
          {datasets.map((dataset, idx) => (
            <div key={idx} className="chart-legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: datasetColors[idx % datasetColors.length].stroke }}
              />
              {dataset.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
