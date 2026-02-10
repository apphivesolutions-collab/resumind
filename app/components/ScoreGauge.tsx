import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = score / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Determine color based on score
  let strokeColor = "#a855f7"; // purple default
  let glowColor = "rgba(168, 85, 247, 0.5)";

  if (score >= 70) {
    strokeColor = "#3b82f6"; // neon blue
    glowColor = "rgba(59, 130, 246, 0.6)";
  } else if (score >= 50) {
    strokeColor = "#facc15"; // yellow
    glowColor = "rgba(250, 204, 21, 0.5)";
  } else {
    strokeColor = "#ef4444"; // red
    glowColor = "rgba(239, 68, 68, 0.5)";
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Background Glow */}
      <div
        className="absolute inset-0 rounded-full blur-[40px] opacity-20"
        style={{ background: strokeColor }}
      />

      <div className="relative w-64 h-32">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Foreground arc with glow */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${strokeColor})`
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {score}
            </span>
            <span className="text-sm text-gray-400 font-medium">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
