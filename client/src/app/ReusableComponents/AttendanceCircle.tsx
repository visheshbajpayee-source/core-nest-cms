'use client';

import React, { useEffect, useState } from 'react';

export interface AttendanceCircleProps {
  /** 0–100 */
  percentage: number;
  /** Size in px — SVG viewBox is always 140×140 */
  size?: number;
  /** Label shown below the number */
  label?: string;
  /** Override track ring colour */
  trackColor?: string;
  /** Animate fill on mount */
  animate?: boolean;
  /** Show status badge on hover */
  showTooltip?: boolean;
}

function resolveColor(pct: number): string {
  if (pct >= 85) return '#14b8a6'; // teal   — Excellent
  if (pct >= 70) return '#22c55e'; // green  — Good
  if (pct >= 50) return '#f59e0b'; // amber  — Fair
  return '#ef4444';                // red    — Low
}

function resolveStatus(pct: number): string {
  if (pct >= 85) return 'Excellent';
  if (pct >= 70) return 'Good';
  if (pct >= 50) return 'Fair';
  return 'Low';
}

export default function AttendanceCircle({
  percentage,
  size = 128,
  label = 'Attendance',
  trackColor = '#e5e7eb',
  animate = true,
  showTooltip = true,
}: AttendanceCircleProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const color = resolveColor(percentage);
  const status = resolveStatus(percentage);

  const [displayed, setDisplayed] = useState(animate ? 0 : percentage);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!animate) {
      setDisplayed(percentage);
      return;
    }
    const target = Math.min(100, Math.max(0, percentage));
    let frame: number;
    let current = 0;
    const step = target / 60; // ~1 s at 60 fps

    const tick = () => {
      current = Math.min(current + step, target);
      setDisplayed(Math.round(current));
      if (current < target) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [percentage, animate]);

  const filledLength = circumference * (displayed / 100);
  const gap = circumference - filledLength;

  return (
    <div
      className="relative inline-flex flex-col items-center gap-2 select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, cursor: 'default' }}
      role="img"
      aria-label={`${label}: ${percentage}%`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 140 140"
          className="block -rotate-90"
          style={{
            transition: 'filter 0.2s',
            filter: hovered ? `drop-shadow(0 0 6px ${color}80)` : 'none',
          }}
        >
          {/* Track */}
          <circle
            cx="70" cy="70" r={radius}
            stroke={trackColor}
            strokeWidth="10"
            fill="none"
          />
          {/* Progress arc */}
          <circle
            cx="70" cy="70" r={radius}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${filledLength} ${gap}`}
          />
        </svg>

        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-extrabold leading-none tabular-nums transition-colors duration-200"
            style={{
              fontSize: size * 0.22,
              color: hovered ? color : '#1f2937',
            }}
          >
            {displayed}%
          </span>
          <span
            className="text-gray-400 mt-0.5"
            style={{ fontSize: size * 0.09 }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Hover tooltip badge */}
      {showTooltip && (
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold text-white shadow-sm transition-all duration-200"
          style={{
            backgroundColor: color,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            pointerEvents: 'none',
          }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
          {status}
        </div>
      )}
    </div>
  );
}
